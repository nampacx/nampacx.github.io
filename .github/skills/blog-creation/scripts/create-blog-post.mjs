import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";

const repositoryRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const blogDirectory = path.join(repositoryRoot, "src", "data", "blog");

function parseArguments(argumentsList) {
  const options = new Map();
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument: ${argument}`);
    }
    const value = argumentsList[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${argument}`);
    }
    options.set(argument.slice(2), value);
    index += 1;
  }
  return options;
}

function toSlug(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const title = options.get("title");
  if (!title?.trim()) {
    throw new Error(
      'Usage: pnpm run blog:new -- --title "Post title" [--slug slug] [--date ISO] [--description text] [--tags "tag1,tag2"]'
    );
  }

  const slug = options.get("slug") ?? toSlug(title);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Slug must be kebab-case: ${slug}`);
  }

  const pubDatetime = options.get("date") ?? new Date().toISOString();
  if (Number.isNaN(Date.parse(pubDatetime))) {
    throw new Error(`Invalid publication date: ${pubDatetime}`);
  }

  const outputPath = path.join(blogDirectory, `${slug}.md`);
  try {
    await access(outputPath);
    throw new Error(
      `Post already exists: ${path.relative(repositoryRoot, outputPath)}`
    );
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const tags = options
    .get("tags")
    ?.split(",")
    .map(tag => tag.trim())
    .filter(Boolean) ?? ["TODO"];
  const frontmatter = {
    author: "Michael Kokonowskyj",
    pubDatetime,
    title: title.trim(),
    featured: false,
    draft: true,
    tags,
    description:
      options.get("description") ??
      "TODO: Write a 150-160 character search description.",
  };
  const content = `---\n${stringify(frontmatter)}---\n\n## TL;DR\n\n- TODO: What prompted this exploration?\n- TODO: What did you try or build?\n- TODO: What did you learn or what was the result?\n\n## TODO: Describe the first part of the story\n\nTODO: Replace this placeholder with specific, verified details.\n`;

  await mkdir(blogDirectory, { recursive: true });
  await writeFile(outputPath, content, { flag: "wx" });
  process.stdout.write(
    `Created draft: ${path.relative(repositoryRoot, outputPath)}\n`
  );
}

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
