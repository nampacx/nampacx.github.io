import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../../../../", import.meta.url));

function runPnpm(argumentsList) {
  const result = spawnSync("pnpm", argumentsList, {
    cwd: repositoryRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function main() {
  runPnpm(["exec", "astro", "check"]);
  runPnpm(["exec", "astro", "build"]);
  if (process.platform === "win32" && process.arch === "arm64") {
    process.stdout.write(
      "WARN Pagefind skipped: its binary package does not support Windows ARM64.\n"
    );
    return;
  }
  runPnpm(["exec", "pagefind", "--site", "dist"]);

  const pagefindOutput = path.join(repositoryRoot, "dist", "pagefind");
  const publicDirectory = path.join(repositoryRoot, "public");
  await mkdir(publicDirectory, { recursive: true });
  await cp(pagefindOutput, path.join(publicDirectory, "pagefind"), {
    recursive: true,
    force: true,
  });
  process.stdout.write("Build, Astro checks, and Pagefind completed.\n");
}

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
