---
name: Weekly Astro Upgrade
description: Check for new Astro ecosystem releases and open an upgrade PR with a migration plan.
on:
  schedule: weekly
permissions:
  contents: read
  pull-requests: read
  issues: read
timeout-minutes: 45
tools:
  github:
    toolsets: [default]
  web-fetch: true
  bash: ["*"]
  edit: true
network:
  allowed: [defaults, node]
safe-outputs:
  create-pull-request:
    title-prefix: "[astro-upgrade] "
    labels: [dependencies, astro]
    draft: true
    if-no-changes: ignore
    base-branch: main
---

Run a weekly Astro upgrade maintenance pass for this repository.

1. Read `package.json` and identify Astro ecosystem dependencies:
   - `astro`
   - packages starting with `@astrojs/`
2. Check npm for the latest versions of those packages and compare with current versions.
3. If no Astro ecosystem package has a newer version available, stop with a concise no-op result.
4. If updates are available:
   - Fetch and review:
     - https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md
     - https://docs.astro.build/en/upgrade-astro/
   - Build a concrete upgrade plan that includes:
     - what will be upgraded
     - breaking changes that apply to this repository
     - required code/config/content changes
     - risk and verification checklist
5. Apply the upgrade changes in-repo:
   - Update Astro ecosystem dependencies in `package.json` and lockfile.
   - Apply any required code/config updates from the changelog and upgrade guide.
6. Validate the result:
   - Run repository checks (`npm run lint` and `npm run build`).
   - If checks fail, fix upgrade-related issues and rerun.
   - If there are pre-existing failures not caused by this upgrade, document them in the PR.
7. Create a draft PR with all upgrade changes and include:
   - Summary of version changes
   - Upgrade plan and breaking-change handling
   - Validation results
   - Follow-up items if needed

Use safe outputs to create the PR. Keep permissions read-only on the agent job.
