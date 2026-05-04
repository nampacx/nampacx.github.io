# Astro Upgrade Plan

Generated: 2026-05-04

## Package Version Summary

| Package | Current (before) | Target |
|---|---|---|
| `astro` | ^5.16.6 | ^6.2.1 |
| `@astrojs/rss` | ^4.0.14 | ^4.0.18 |
| `@astrojs/sitemap` | ^3.6.0 | ^3.7.2 |
| `@astrojs/check` | ^0.9.6 | ^0.9.9 |

---

## Breaking Changes Applicable To This Repository

### 1. Node.js ≥ 22.12.0 Required

Astro v6 drops support for Node.js < 22.12.0.

**Impact:** The CI/build environment must be updated to use Node.js 22.

**Mitigation:** Update any GitHub Actions workflow `node-version` to `22` (or `lts`). If deploying to a hosting platform, ensure the Node.js version is set to 22+.

> ⚠️ This is a **manual follow-up** — see section below.

---

### 2. `experimental.fonts` Moved to Top-Level `fonts`

`experimental.fonts` was removed and replaced with a stable top-level `fonts` config option.

**Implemented:** `astro.config.ts` updated — moved fonts array from `experimental.fonts` to top-level `fonts`.

---

### 3. `experimental.preserveScriptOrder` Is Now the Default

The `experimental.preserveScriptOrder: true` flag was graduated: `<script>` and `<style>` tags now render in definition order by default.

**Implemented:** Removed `experimental.preserveScriptOrder` from `astro.config.ts` (no longer needed).

---

### 4. Vite 7 / `@tailwindcss/vite` Type Compatibility Fixed

Previous workaround: `// @ts-ignore` + comments on the `tailwindcss()` Vite plugin call. Astro 6 uses Vite 7, which resolves the type mismatch.

**Implemented:** Removed `@ts-ignore` and associated comments from `astro.config.ts`.

---

### 5. Zod v4

Astro v6 upgrades to Zod v4 for content collection schema validation.

**Assessment:** This project's `src/content.config.ts` uses:
- `z.object()`, `z.string()`, `z.boolean()`, `z.array()`, `z.date()` — all unchanged in Zod v4.
- `image().or(z.string())` — Zod v4 preserves the `.or()` instance method as an alias for `z.union`.
- `.optional()`, `.nullable()`, `.default()` — unchanged.

**No code changes required.**

---

### 6. Removed: Legacy Content Collections

Astro v6 removes the legacy content collections API (the one using `src/content/config.ts`).

**Assessment:** This project already uses the **new** Content Layer API (`src/content.config.ts` with `loader: glob(...)` from `astro/loaders`). **No changes required.**

---

### 7. Removed: `Astro.glob()`

**Assessment:** Searched the codebase — `Astro.glob()` is not used. **No changes required.**

---

### 8. Removed: `<ViewTransitions />` Component

**Assessment:** Not used in this project. **No changes required.**

---

### 9. CommonJS Config Files No Longer Supported

**Assessment:** All config files (`astro.config.ts`, `eslint.config.js`, `tailwind.config.cjs`) use ES module syntax or are not Astro config files. **No changes required.**

---

## Migration Steps (Applied)

1. `package.json` — bumped `astro` to `^6.2.1`, `@astrojs/rss` to `^4.0.18`, `@astrojs/sitemap` to `^3.7.2`, `@astrojs/check` to `^0.9.9`.
2. `astro.config.ts` — moved `experimental.fonts` → top-level `fonts`.
3. `astro.config.ts` — removed `experimental.preserveScriptOrder`.
4. `astro.config.ts` — removed `@ts-ignore` workaround for Tailwind Vite plugin.
5. `npm install` — ran successfully (warnings only).

---

## Validation Results

| Command | Result | Notes |
|---|---|---|
| `npm install` | ✅ Completed | Engine warning: `@astrojs/prism` requires Node 22 |
| `npm run sync` | ❌ Failed | Node.js v20 not supported by Astro 6; requires ≥ 22.12.0 |
| `npm run lint` | ⚠️ Pre-existing errors | 3 errors in `Layout.astro` and `PostDetails.astro` — unrelated to this upgrade |
| `npm run build` | ❌ Not attempted | Blocked by Node.js version requirement |

---

## Post-Upgrade Verification Checklist

- [ ] Node.js updated to ≥ 22.12.0 in CI and deployment environment
- [ ] `npm run sync` completes without errors
- [ ] `npm run lint` passes (or pre-existing errors addressed separately)
- [ ] `npm run build` completes without errors
- [ ] Site renders correctly in preview (`npm run preview`)
- [ ] Font loading still works (Google Sans Code via `fonts` config)
- [ ] Script/style order renders as expected

---

## Manual Follow-up

### Update Node.js Version to 22

Astro v6 requires Node.js ≥ 22.12.0. You must update Node.js in:

1. **GitHub Actions workflow** — update `node-version` to `'22'` (or `'lts/*'`).
2. **Hosting platform** — ensure Node.js 22 is selected (e.g., Netlify, Vercel, Cloudflare Pages runtime).
3. **Local development** — upgrade your local Node.js installation.

After updating Node.js, run the full validation suite:
```sh
npm run sync
npm run lint
npm run build
```
