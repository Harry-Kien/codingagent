# VibeForge Upgrade Report

Date: 2026-06-05
Production URL audited: https://vibeforge-seven.vercel.app/

## Current Upgrade Pass - 2026-06-05

### Code Upgrades

- Added `/dashboard` launch cockpit with product flow, latest run, readiness checklist, and CTAs.
- Added `/agent-kit` route backed by `src/lib/agent-kit.ts` with eight role-specific agents.
- Updated `src/components/app/AppShell.tsx` navigation for Dashboard and Agent Kit.
- Mounted `ToastContainer` in `src/app/layout.tsx` so export toasts are visible.
- Added `npm run typecheck` script.
- Cleaned visible UI labels in repo map/history/template quick starts.

### Documentation Upgrades

- Added `PRODUCT_AUDIT.md` with before/after scores.
- Added `PRODUCT_STRUCTURE.md`.
- Added `MEMORY_DESIGN.md`.
- Added root `ROADMAP.md`.
- Added machine-readable `repo-map.json`.
- Updated `README.md`, `REPO_MAP.md`, and `AGENT_KIT.md`.

### Current Product Flow

`/` builder -> `/dashboard` cockpit -> `/projects` history -> `/projects/[id]` result/report -> `/repo-map` repo viewer -> `/agent-kit` roles -> `/settings` provider/MCP configuration.

## Production Audit Findings

| Route / Flow | Steps | Finding | Root Cause | Fix |
|---|---|---|---|---|
| `/` builder production | Open production, click `Load AI video sample`, click `Generate project kit` | Page stayed on provider loading state while `/api/generate-kit` remained pending during the audit window | Provider-backed generation could leave the UI waiting too long before demo fallback became visible | Added client-side API timeout handling in `src/lib/generation-client.ts`; local source also defaults sample/demo flow to no-key generation |
| `/projects/[id]` detail | Generate a sample kit locally, export ZIP | Multiple visible ZIP export buttons had the same accessible name | Header export and post-generate CTA both rendered default `ZIP` label | Changed post-generate CTA ZIP label to `Download ZIP` in `src/components/kit/PostGenerateCTA.tsx` |
| Demo AI video sample | Generate AI video sample and inspect export filename | Generated slug could become `weekly-social-media-content-planner` for AI video ideas containing content-plan words | `inferName()` checked content-planner terms before AI-video terms | Added AI-video priority detection in `src/lib/generator-shared.ts` and a regression assertion in `scripts/verify-sample-output.mjs` |
| `/projects/[id]` section actions | Generate demo kit, copy/regenerate Task Plan | Demo section improve/regenerate could call provider section APIs when public server-provider env was enabled | `hasServerProvider()` treated env provider availability as enough for every section action, even demo-generated projects | `src/components/kit/ProjectKitTabs.tsx` now uses server section APIs only for provider-generated projects or explicit local providers; e2e asserts demo actions make zero section API calls |
| Local browser console | Run local dev browser flow | Next.js warned about `scroll-behavior: smooth` on `<html>` without opt-in attribute | Root layout lacked Next.js scroll behavior opt-in | Added `data-scroll-behavior="smooth"` in `src/app/layout.tsx` |
| README scripts | Read README check commands | README referenced `check:samples`, which is not in `package.json` | Outdated command name | Replaced with `check:sample-output` |

## UI/UX Upgrades

- Preserved `/` as the usable builder route.
- Kept demo generation selected for the sample/local-first path so the core flow does not require API keys.
- Improved export button clarity by distinguishing the main ZIP export from the post-generate CTA ZIP export.
- Added production audit/deploy checklist to README for repeatable verification.
- Created `REPO_MAP.md` with routes, APIs, components, models, scripts, risk areas, and backlog.
- Created `AGENT_KIT.md` with Code Reviewer, Bug Fixer, UI Builder, Repo Mapper, Test Writer, Deployment, and Documentation agent templates.

## Files Changed

- `src/lib/generator-shared.ts`
- `src/lib/generation-client.ts`
- `src/components/kit/ProjectKitTabs.tsx`
- `src/app/layout.tsx`
- `src/components/kit/PostGenerateCTA.tsx`
- `e2e/core-flow.spec.ts`
- `scripts/verify-sample-output.mjs`
- `README.md`
- `REPO_MAP.md`
- `AGENT_KIT.md`
- `UPGRADE_REPORT.md`

## Checks Run So Far

- `npm.cmd run check:sample-output` (red before fix, green after fix)
- `npm.cmd run lint`
- `npx.cmd tsc --noEmit`
- `npm.cmd run build`
- Browser production audit across desktop, tablet, and mobile
- Browser local smoke flow for generation/export/settings/repo map
- `npm.cmd run test:e2e` (7/7 passed after section-action regression fix)
- Production deploy to `https://vibeforge-seven.vercel.app/`
- Final post-deploy browser check: desktop/tablet/mobile routes returned 200; demo generation, history, Markdown/JSON/ZIP exports, copy, regenerate, MCP settings, and repo video filter passed

## Recommended Next Work

- Add a visible provider-timeout toast or banner when provider mode falls back to demo.
- Add stronger Playwright assertions for project title stability after navigation.
- Add a project-history search/filter once saved history grows.
- Add monitoring/log scans in Vercel after every production deploy.
