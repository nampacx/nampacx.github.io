---
name: blog-creation
description: "Use when creating, editing, polishing, or validating Astro blog posts in src/data/blog. Includes scripts to scaffold a draft, check its content and frontmatter, and build the site."
---

# Blog Creation

Use this skill for the complete blog authoring workflow. Read `.github/instructions/content-md.instructions.md` first and treat it as the editorial source of truth. Inspect nearby posts for canonical tag casing, voice, links, and image patterns. Check `src/content.config.ts` when the supported content format or schema is uncertain.

## Project Constraints

- Blog collection content lives in `src/data/blog/`. The current Astro loader includes `.md` files; do not create `.mdx` posts unless MDX support is added to the project configuration.
- A post's filename supplies its route slug. `postSlug` appears in existing frontmatter and the authoring guide, but current route code does not consume it; do not promise a custom URL slug based on that field.
- Keep images under `src/assets/images/` and use the relative Markdown paths established by neighboring posts. Include descriptive alt text.
- Follow the authoring guide's first-person, candid voice for project stories. Do not invent results or experience. Put a concise `## TL;DR` immediately after frontmatter, use descriptive headings, and ground technical claims in what was actually tried.

## Scripts

Run commands from the repository root. They are plain Node.js scripts and do not use VS Code tasks.

Create a draft from a title:

```powershell
pnpm run blog:new -- --title "A specific post title"
```

Optional arguments are `--slug`, `--date`, `--description`, and `--tags` (comma-separated). The script creates a `.md` draft with `draft: true`, refuses to overwrite an existing post, and fills in editorial placeholders for fields not supplied.

Validate one post:

```powershell
pnpm run blog:validate -- src/data/blog/my-post.md
```

The validator checks the repository path and filename, YAML frontmatter, required editorial fields, date format, title and description length recommendations, TL;DR placement, code fence languages, image alt text, and local image paths. It reports advisory SEO length issues as warnings and malformed or missing required content as errors.

Build and validate the full site:

```powershell
pnpm run build
```

The build script runs `astro check`, `astro build`, and Pagefind, then copies Pagefind output into `public/pagefind` using Node's cross-platform filesystem API. This replaces the previous shell-specific `cp` build step. Pagefind is skipped with a warning on Windows ARM64 because its binary package does not support that platform.

Format a changed post:

```powershell
pnpm exec prettier --write src/data/blog/my-post.md
pnpm exec prettier --check src/data/blog/my-post.md
```

## Workflow

1. Read the content instructions and inspect relevant neighboring posts.
2. For a new post, run `blog:new`; then replace every placeholder with user-provided or verified content.
3. Validate the post with `blog:validate` and format it with Prettier.
4. Run `pnpm run build` for a publish-ready change or when frontmatter, links, assets, or templates could affect the generated site.
5. For visual styling, inspect the rendered post in the local site preview at desktop and mobile widths. A successful build verifies compilation, not visual appearance; do not report visual validation unless a browser preview was actually inspected.
6. Before publishing, confirm `draft: false` only when the user has requested a publish-ready post.

Report the created or changed file, validation commands and their outcomes, and any visual checks actually performed.
