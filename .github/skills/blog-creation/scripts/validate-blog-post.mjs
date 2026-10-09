import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const repositoryRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const errors = [];
const warnings = [];

function reportError(message) {
  errors.push(message);
}

function reportWarning(message) {
  warnings.push(message);
}

function isWithinDirectory(directory, candidate) {
  const relativePath = path.relative(directory, candidate);
  return (
    relativePath !== "" &&
    !relativePath.startsWith(`..${path.sep}`) &&
    relativePath !== ".." &&
    !path.isAbsolute(relativePath)
  );
}

async function imageExists(postPath, imagePath) {
  let localPath;
  try {
    const decodedPath = decodeURIComponent(imagePath.split(/[?#]/, 1)[0]);
    localPath = decodedPath.startsWith("/")
      ? path.join(repositoryRoot, "public", decodedPath.slice(1))
      : path.resolve(path.dirname(postPath), decodedPath);
  } catch {
    return false;
  }

  try {
    await access(localPath);
    return true;
  } catch {
    return false;
  }
}

function validateFences(body, relativePath) {
  let activeFence;
  for (const [lineIndex, line] of body.split(/\r?\n/).entries()) {
    if (!activeFence) {
      const opening = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
      if (!opening) continue;
      const language = opening[2].trim().split(/\s+/, 1)[0];
      if (!language) {
        reportError(
          `${relativePath}:${lineIndex + 1}: fenced code block needs a language identifier.`
        );
      }
      activeFence = {
        marker: opening[1][0],
        length: opening[1].length,
        line: lineIndex + 1,
      };
      continue;
    }

    const closing = line.match(/^\s*(`{3,}|~{3,})\s*$/);
    if (
      closing &&
      closing[1][0] === activeFence.marker &&
      closing[1].length >= activeFence.length
    ) {
      activeFence = undefined;
    }
  }

  if (activeFence) {
    reportError(
      `${relativePath}:${activeFence.line}: code fence is not closed.`
    );
  }
}

async function validatePost(inputPath) {
  const postPath = path.resolve(repositoryRoot, inputPath);
  const blogDirectory = path.join(repositoryRoot, "src", "data", "blog");
  const relativePath = path.relative(repositoryRoot, postPath);
  if (!isWithinDirectory(blogDirectory, postPath)) {
    reportError("Post must be inside src/data/blog/.");
    return relativePath;
  }
  if (path.extname(postPath) !== ".md") {
    reportError("The current Astro blog collection loads .md files only.");
    return relativePath;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(path.basename(postPath))) {
    reportError("Filename must be kebab-case and end in .md.");
  }

  let content;
  try {
    content = await readFile(postPath, "utf8");
  } catch {
    reportError(`Post file not found: ${relativePath}`);
    return relativePath;
  }

  const frontmatterMatch = content.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
  );
  if (!frontmatterMatch) {
    reportError("Missing or malformed YAML frontmatter.");
    return relativePath;
  }

  let frontmatter;
  try {
    frontmatter = parse(frontmatterMatch[1]);
  } catch (error) {
    reportError(`Invalid YAML frontmatter: ${error.message}`);
    return relativePath;
  }
  if (
    !frontmatter ||
    typeof frontmatter !== "object" ||
    Array.isArray(frontmatter)
  ) {
    reportError("Frontmatter must be a YAML mapping.");
    return relativePath;
  }

  const supportedFields = new Set([
    "author",
    "pubDatetime",
    "modDatetime",
    "title",
    "featured",
    "draft",
    "tags",
    "ogImage",
    "description",
    "canonicalURL",
    "hideEditPost",
    "timezone",
    "postSlug",
  ]);
  for (const field of Object.keys(frontmatter)) {
    if (!supportedFields.has(field))
      reportError(`Unsupported frontmatter field: ${field}`);
  }

  if (frontmatter.author !== "Michael Kokonowskyj") {
    reportError('author must be "Michael Kokonowskyj".');
  }
  if (typeof frontmatter.title !== "string" || !frontmatter.title.trim()) {
    reportError("title is required and must be a non-empty string.");
  } else if (
    [...frontmatter.title].length < 50 ||
    [...frontmatter.title].length > 60
  ) {
    reportWarning(
      `Title is ${[...frontmatter.title].length} characters; aim for 50-60.`
    );
  }
  if (
    typeof frontmatter.description !== "string" ||
    !frontmatter.description.trim()
  ) {
    reportError("description is required and must be a non-empty string.");
  } else if (
    [...frontmatter.description].length < 150 ||
    [...frontmatter.description].length > 160
  ) {
    reportWarning(
      `Description is ${[...frontmatter.description].length} characters; aim for 150-160.`
    );
  }
  if (
    !Array.isArray(frontmatter.tags) ||
    frontmatter.tags.length === 0 ||
    frontmatter.tags.some(tag => typeof tag !== "string" || !tag.trim())
  ) {
    reportError("tags must be a non-empty array of non-empty strings.");
  }
  if (
    typeof frontmatter.pubDatetime !== "string" &&
    !(frontmatter.pubDatetime instanceof Date)
  ) {
    reportError("pubDatetime must be an ISO 8601 date-time.");
  } else {
    const dateValue =
      frontmatter.pubDatetime instanceof Date
        ? frontmatter.pubDatetime.toISOString()
        : frontmatter.pubDatetime;
    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
        dateValue
      ) ||
      Number.isNaN(Date.parse(dateValue))
    ) {
      reportError(
        "pubDatetime must include an ISO 8601 date, time, and timezone."
      );
    }
  }
  for (const field of ["featured", "draft", "hideEditPost"]) {
    if (
      frontmatter[field] !== undefined &&
      typeof frontmatter[field] !== "boolean"
    ) {
      reportError(`${field} must be a boolean when provided.`);
    }
  }
  if (
    frontmatter.postSlug &&
    frontmatter.postSlug !== path.basename(postPath, ".md")
  ) {
    reportWarning(
      "A distinct postSlug is not used by current route code; the filename determines the URL."
    );
  }

  const body = content.slice(frontmatterMatch[0].length).trimStart();
  if (!/^##\s+TL;DR\b/i.test(body)) {
    reportError("The first body section must be ## TL;DR.");
  }
  validateFences(body, relativePath);

  const imagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+[^)]*)?\)/g;
  for (const match of body.matchAll(imagePattern)) {
    const altText = match[1].trim();
    const imagePath = match[2];
    if (!altText)
      reportError(`Image has no descriptive alt text: ${imagePath}`);
    if (
      !/^(?:[a-z]+:)?\/\//i.test(imagePath) &&
      !imagePath.startsWith("data:") &&
      !(await imageExists(postPath, imagePath))
    ) {
      reportError(`Local image does not exist: ${imagePath}`);
    }
  }

  return relativePath;
}

async function main() {
  const postArgument = process.argv[2];
  if (!postArgument || postArgument.startsWith("--")) {
    throw new Error(
      "Usage: pnpm run blog:validate -- src/data/blog/post-name.md"
    );
  }

  const relativePath = await validatePost(postArgument);
  for (const warning of warnings)
    process.stdout.write(`WARN ${relativePath}: ${warning}\n`);
  for (const error of errors)
    process.stderr.write(`ERROR ${relativePath}: ${error}\n`);
  if (errors.length > 0) process.exitCode = 1;
  else
    process.stdout.write(
      `Validated ${relativePath} with ${warnings.length} warning(s).\n`
    );
}

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
