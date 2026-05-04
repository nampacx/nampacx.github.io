# Astro Upgrade Plan — v5 → v6

## Package Versions

| Package | Current | Target |
|---|---|---|
| `astro` | `^5.16.6` | `^6.2.1` |
| `@astrojs/rss` | `^4.0.14` | `^4.0.18` |
| `@astrojs/sitemap` | `^3.6.0` | `^3.7.2` |
| `@astrojs/check` | `^0.9.6` | `^0.9.9` |

Reference: [Astro v6 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v6/)

---

## Breaking Changes

### 1. Node.js ≥ 22.12.0 Required

Astro 6 drops support for Node 18/20. The minimum required version is **Node 22.12.0**.

**Impact:** Build and dev commands will fail on Node 20 environments.

**Mitigation:** Upgrade the deployment and CI environment to Node 22.x before running this upgrade in production.

### 2. `z` from `astro:content` Deprecated → Use `astro:schema`

Astro 6 deprecates re-exporting Zod's `z` from `astro:content`. The canonical import is now `astro:schema`.

**Files affected:** `src/content.config.ts`

**Fix applied:**
```diff
- import { defineCollection, z } from "astro:content";
+ import { defineCollection } from "astro:content";
+ import { z } from "astro:schema";
```

### 3. `experimental.fonts` Moved to Top-Level `fonts`

The experimental fonts API is now stable in Astro 6. The configuration key moves from `experimental.fonts` to the top-level `fonts` option.

**Files affected:** `astro.config.ts`

**Fix applied:**
```diff
- experimental: {
-   fonts: [ ... ],
- },
+ fonts: [ ... ],
```

### 4. `experimental.preserveScriptOrder` Now Default

`preserveScriptOrder: true` is the new default behavior in Astro 6. The experimental flag is no longer needed and was removed.

**Files affected:** `astro.config.ts`

**Fix applied:**
```diff
- experimental: {
-   preserveScriptOrder: true,
- },
```

### 5. Tailwind Vite Plugin `@ts-ignore` Removed

The TypeScript compatibility issue with `@tailwindcss/vite` that required a `// @ts-ignore` comment was resolved in Astro 6 with the Vite 7 upgrade.

**Files affected:** `astro.config.ts`

**Fix applied:** Removed the `// eslint-disable-next-line`, `// @ts-ignore`, and related comments from the `vite.plugins` block.

### 6. Zod v4 (Dependency Upgrade)

Astro 6 upgrades from Zod v3 to Zod v4 internally. For content collections using `z` from `astro:schema`, the API is mostly backward compatible for common usage. No schema changes were required in this repository.

### 7. Vite 7 / Shiki 4 (Internal Upgrades)

Astro 6 ships with Vite 7 and Shiki 4. The Shiki config (`shikiConfig`) in `astro.config.ts` uses the same format — no changes required.

---

## Code / Config Changes Implemented

| File | Change |
|---|---|
| `package.json` | Updated all four Astro-managed packages to latest |
| `src/content.config.ts` | Changed `z` import from `astro:content` → `astro:schema` |
| `astro.config.ts` | Moved `fonts` to top-level, removed `experimental.preserveScriptOrder`, removed `@ts-ignore` for Tailwind plugin |

---

## Post-Upgrade Verification Checklist

- [ ] Node environment upgraded to ≥ 22.12.0
- [ ] `npm install` completes without errors
- [ ] `npm run sync` completes without type errors
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds (requires Node 22)
- [ ] Blog posts render correctly in `npm run preview`
- [ ] Font (Google Sans Code) loads correctly via the new top-level `fonts` config
- [ ] Shiki code blocks render with correct themes (min-light / night-owl)
- [ ] Table of contents collapse functionality works
- [ ] Sitemap and RSS feed generate correctly

---

## Manual Follow-up

1. **Upgrade Node.js to ≥ 22.12.0** in the CI/CD pipeline and any local development environments before merging this PR and deploying. GitHub Actions workflows, Netlify/Vercel Node version settings, or `.nvmrc`/`.node-version` files should be updated.

2. **Review Zod v4 migration** if custom schema validation beyond standard types is used in future content collections. See the [Zod v4 migration guide](https://zod.dev/v4/changelog).

3. **Check `@astrojs/sitemap` 3.7.x** changelog if sitemap customization is extended; minor additions were made to the sitemap API.
