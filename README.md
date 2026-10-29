# mikokono

Personal developer blog of Michael Kokonowskyj, live at [mikokono.de](https://mikokono.de/). It covers Microsoft Foundry, AI agents, MCP, Azure and developer productivity.

Built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/), based on the [AstroPaper](https://github.com/satnaing/astro-paper) theme by Sat Naing (MIT) and the blog of [Harald Binkel](https://harrybin.de).

## Features

- Markdown blog posts with type-safe frontmatter
- Light/dark theme, responsive, accessible
- Static search ([Pagefind](https://pagefind.app/))
- Tags, archives, pagination, RSS feed and sitemap
- Dynamic OG images per post

## Project structure

```
/
├── .github/
│   ├── skills/blog-creation/   # scripts behind the pnpm blog:* and build commands
│   └── workflows/              # GitHub Pages deployment
├── public/                     # static assets (pagefind index is generated on build)
└── src/
    ├── assets/                 # icons and post images
    ├── components/
    ├── data/blog/              # blog posts (Markdown)
    ├── layouts/
    ├── pages/
    ├── styles/
    ├── utils/
    ├── config.ts               # site settings (title, author, URL, ...)
    └── constants.ts            # social links
```

## Running locally

Requires Node.js and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm run dev       # http://localhost:4321
```

## Commands

| Command                | Action                                          |
| ---------------------- | ----------------------------------------------- |
| `pnpm run dev`         | Start the dev server                            |
| `pnpm run build`       | Build the site and the search index into `dist/` |
| `pnpm run preview`     | Preview the production build                    |
| `pnpm run blog:new`    | Scaffold a new blog post                        |
| `pnpm run blog:validate` | Validate blog post frontmatter                |
| `pnpm run lint`        | Lint with ESLint                                |
| `pnpm run format`      | Format with Prettier                            |

## Writing a post

Posts live in `src/data/blog/` as Markdown files. Run `pnpm run blog:new` to create one, and `pnpm run blog:validate` to check it. Set `draft: true` in the frontmatter to keep a post unpublished.

## Deployment

Pushing to `main` triggers [the GitHub Actions workflow](.github/workflows/deploy-to-gh-pages.yml), which builds the site and deploys it to GitHub Pages.

## License

MIT, see [LICENSE](LICENSE).
