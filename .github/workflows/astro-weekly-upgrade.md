---
description: Weekly Astro ecosystem dependency upgrade workflow with breaking-change analysis and automated PR creation.
on:
  schedule: weekly
  skip-if-match: 'is:pr is:open in:title "[astro-upgrade]"'
permissions: read-all
tools:
  github:
    toolsets: [default]
  web-fetch:
safe-outputs:
  create-pull-request:
    max: 1
    allowed-files:
      - ASTRO_UPGRADE_PLAN.md
      - astro.config.ts
      - package.json
      - package-lock.json
      - pnpm-lock.yaml
      - tsconfig.json
      - yarn.lock
  noop:
network:
  allowed:
    - defaults
    - node
    - github
    - docs.astro.build
---

# Weekly Astro Upgrade PR

You are maintaining an Astro website and should proactively keep Astro-managed dependencies current.

## Goal

Every week:
1. Detect whether any dependency in this repository published by Astro has a newer release.
2. If updates exist, review Astro migration guidance and identify breaking changes.
3. Apply the upgrade in a dedicated branch.
4. Validate the project.
5. Create one pull request with all upgrade changes and a clear migration plan.

## Scope Of Dependencies

Treat a dependency as Astro-managed when its package name is:
- `astro`
- starts with `@astrojs/`

Check both `dependencies` and `devDependencies`.

## Required External References

Always review these sources before deciding implementation details:
- Astro changelog: `https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md`
- Upgrade guide: `https://docs.astro.build/en/upgrade-astro/`

You may also inspect package-specific changelogs for any `@astrojs/*` packages that are being upgraded.

## Execution Steps

1. Read `package.json` to collect current Astro-managed dependencies and versions.
2. Resolve the latest published version for each Astro-managed package.
3. Compare current vs latest.
4. If no package has an update:
   - Use the `noop` safe output.
   - Message should state the checked packages and confirm there are no newer releases.
5. If updates are available:
   - Create and switch to a new branch named `chore/astro-upgrade-YYYY-MM-DD`.
   - Upgrade all outdated Astro-managed dependencies in one pass.
   - Prefer preserving range semantics already used in `package.json` (for example, keep caret ranges when appropriate).

## Breaking-Change Analysis And Plan

After reading the changelog and upgrade docs, create an explicit plan in `ASTRO_UPGRADE_PLAN.md` with:
- Current versions and target versions.
- Breaking changes that apply to this repository.
- Required code/config updates for each breaking change.
- Step-by-step mitigation plan.
- Post-upgrade verification checklist.

Then implement the required code/config changes described by the plan.

If docs indicate manual follow-up that should not be automated safely, include it in `ASTRO_UPGRADE_PLAN.md` and in the PR description under a `Manual Follow-up` section.

## Validation

Run these commands after changes:
- `npm install`
- `npm run sync`
- `npm run lint`
- `npm run build`

If a command fails, fix what is reasonable within this run. If unresolved, still create a PR but clearly describe failures and logs summary in the PR body.

## Pull Request Requirements

Create a PR using the `create-pull-request` safe output.

PR title format:
- `[astro-upgrade] upgrade Astro ecosystem dependencies`

PR body must include:
- Summary of upgraded packages.
- Key breaking changes reviewed.
- Implemented remediations.
- Validation results for each command.
- Link to `ASTRO_UPGRADE_PLAN.md`.
- `Manual Follow-up` section when needed.

## Safety Rules

- Never push directly to the default branch.
- Keep changes scoped to Astro dependency upgrades and migration-related fixes.
- Do not create multiple PRs in one run.
- If there is no actionable change, always use `noop` instead of silently succeeding.
