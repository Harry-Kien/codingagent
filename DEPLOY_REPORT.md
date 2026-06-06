# VibeForge Deploy Report

Date: 2026-06-05
Final deploy time: 2026-06-05T13:30:19+07:00
Final verification time: 2026-06-05T13:32:18+07:00

## Current Session Status - 2026-06-05

- Vercel project link found at `.vercel/project.json`.
- Project: `vibeforge`
- Project ID: `prj_oLC2j7fTieshJy5EQZNZM87mwZ3o`
- Framework: Next.js
- Node version setting: 24.x
- New production deployment completed for the current code changes.
- Deployment ID: `dpl_2kXuLkdvcKRbS98RCenSnyRmvRY7`
- Deployment URL: `https://vibeforge-lidoslcq1-harry-kiens-projects.vercel.app`
- Production alias: `https://vibeforge-seven.vercel.app`
- Status: READY

## Current Session Verification

Commands run:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run check:product
npm.cmd run check:exports
npm.cmd run check:sample-output
npm.cmd run check:production
npm.cmd run check:launch
$env:VIBEFORGE_API_BASE_URL='http://127.0.0.1:3026'; npm.cmd run check:api-flows
npm.cmd run test:e2e
npx.cmd vercel deploy --prod --yes
npx.cmd vercel inspect vibeforge-lidoslcq1-harry-kiens-projects.vercel.app
npx.cmd vercel logs vibeforge-lidoslcq1-harry-kiens-projects.vercel.app --since 15m
```

Production smoke test on `https://vibeforge-seven.vercel.app`:

| Route | Status | Result |
|---|---:|---|
| `/` | 200 | Builder rendered, no console errors, no horizontal overflow. |
| `/dashboard` | 200 | Dashboard rendered, no console errors, no horizontal overflow. |
| `/agent-kit` | 200 | Agent Kit rendered, no console errors, no horizontal overflow. |
| `/repo-map` | 200 | Repo map rendered, no console errors, no horizontal overflow. |
| `/settings` | 200 | Settings rendered, no console errors, no horizontal overflow. |
| `/api/health` | 200 | Health returned `status: ok`. |

Vercel logs: no logs found in the 15 minute post-deploy scan.

## Supabase/Data API Hardening Deploy - 2026-06-05 20:42 +07:00

- Deployment ID: `dpl_57jPtwWatvWj22o3mfWJr8Zyqg9P`
- Deployment URL: `https://vibeforge-4llzoinlg-harry-kiens-projects.vercel.app`
- Production alias: `https://vibeforge-seven.vercel.app`
- Status: READY

Changes included:

- Added `supabase/migrations/003_production_rls_data_api_hardening.sql`.
- Added `check:production-readiness` and `check:vercel-env` scripts.
- Added rate limiting to provider profile GET and DELETE routes.

Verification:

- `npm.cmd run lint`: pass
- `npm.cmd run typecheck`: pass
- `npm.cmd run check:production`: pass
- `npm.cmd run build`: pass
- `npm.cmd audit --audit-level=high`: pass; moderate PostCSS advisory remains through Next bundled dependency.
- `npm.cmd run check:launch`: pass
- `npx.cmd vercel deploy --prod --yes`: READY
- Production route smoke: `/`, `/dashboard`, `/agent-kit`, `/repo-map`, `/settings` all 200 with no horizontal overflow.
- `npm.cmd run check:production-readiness` with partial allowed: `partial`.
- `npm.cmd run check:vercel-env`: fails as expected because Supabase, Redis, and external monitoring env are not configured in Vercel production.

Latest readiness missing env:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VIBEFORGE_PROVIDER_KEY_SECRET`
- `VIBEFORGE_REDIS_REST_URL`
- `VIBEFORGE_REDIS_REST_TOKEN`
- `ERROR_WEBHOOK_URL`

Vercel logs after deploy: production requests returned 200/207 and no error-level logs were observed in the sampled output.

## Deployment Result

- Production URL: https://vibeforge-seven.vercel.app/
- Final deployment URL: https://vibeforge-ln9dv1z4l-harry-kiens-projects.vercel.app
- Vercel deployment ID: `dpl_DtvnoBZ1szBKqUWuRSgZtQ976aUb`
- Vercel target: production
- Vercel status: READY
- Alias confirmed: `https://vibeforge-seven.vercel.app`
- Build region: Washington, D.C., USA (`iad1`)
- Framework: Next.js 16.1.6

## Commands Run

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run check:product
npm.cmd run check:exports
npm.cmd run check:sample-output
$env:VIBEFORGE_API_BASE_URL='http://127.0.0.1:3025'; npm.cmd run check:api-flows
npm.cmd run check:production
npm.cmd run check:launch
npm.cmd run test:e2e
npx.cmd vercel deploy --prod --yes
npx.cmd vercel inspect vibeforge-ln9dv1z4l-harry-kiens-projects.vercel.app
npx.cmd vercel logs vibeforge-ln9dv1z4l-harry-kiens-projects.vercel.app --since 30m
```

## Local Verification

- `npm.cmd run lint`: pass
- `npx.cmd tsc --noEmit`: pass
- `npm.cmd run build`: pass
- `npm.cmd run check:product`: pass
- `npm.cmd run check:exports`: pass
- `npm.cmd run check:sample-output`: pass
- `npm.cmd run check:api-flows` with `VIBEFORGE_API_BASE_URL=http://127.0.0.1:3025`: pass
- `npm.cmd run check:production`: pass
- `npm.cmd run check:launch`: pass
- `npm.cmd run test:e2e`: 7 passed

## Post-Deploy Browser Verification

Checked with Playwright Chromium against `https://vibeforge-seven.vercel.app/`.

Desktop, tablet, and mobile:
- `/`: 200, rendered builder content.
- `/projects`: 200, rendered history/empty state.
- `/repo-map`: 200, rendered repo navigator.
- `/settings`: 200, rendered provider and MCP settings.
- `/about`: 200, rendered about page.

Core desktop flow:
- Loaded AI video sample.
- Generated demo kit without provider blocking.
- Confirmed project name: `AI Video App For Small Shops`.
- Exported Markdown: `ai-video-app-for-small-shops-project-kit.md`.
- Exported JSON: `ai-video-app-for-small-shops.json`.
- Exported ZIP: `ai-video-app-for-small-shops-kit.zip`.
- Copied a section.
- Regenerated Task Plan in demo mode.
- Confirmed demo section regenerate made zero `/api/improve-section` or `/api/regenerate-section` calls.
- Opened project history and confirmed saved project actions.
- Added MCP connection in settings.
- Viewed repo recommendations for `video`.

## Console, Network, And Logs

- Browser console errors: none.
- Browser app/API network failures: none.
- One benign Next.js RSC `net::ERR_ABORTED` occurred during scripted route navigation after the core flow; it was not an app/API failure and did not affect UX.
- Vercel log sample for the final deployment showed 200 responses for audited routes and no error-level entries in the sampled output.

## Notes

- `.vercelignore` excludes `.env*`, `.vercel`, `.next`, `node_modules`, caches, logs, test results, and Playwright output from deployment upload.
- Production health endpoint returned status 200 with provider configured and database not configured, which matches the local-first deployment mode.

## Production Hardening Deploy - 2026-06-05 20:34 +07:00

- Deployment ID: `dpl_CuYHYtK5Jjkvqt6GfFtiQZD3fida`
- Deployment URL: `https://vibeforge-lvc46nioj-harry-kiens-projects.vercel.app`
- Production alias: `https://vibeforge-seven.vercel.app`
- Status: READY
- Next.js: `16.2.7`

Commands run:

```powershell
npm.cmd install @vercel/analytics @vercel/speed-insights
npm.cmd install next@16.2.7
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run check:production
npm.cmd run build
npm.cmd audit --audit-level=high
npm.cmd run check:product
npm.cmd run check:exports
npm.cmd run check:sample-output
npm.cmd run check:launch
npm.cmd run test:e2e
$env:VIBEFORGE_API_BASE_URL='http://127.0.0.1:3029'; npm.cmd run check:api-flows
npx.cmd vercel env ls production
npx.cmd vercel deploy --prod --yes
npx.cmd vercel inspect vibeforge-lvc46nioj-harry-kiens-projects.vercel.app
npx.cmd vercel logs vibeforge-lvc46nioj-harry-kiens-projects.vercel.app --since 15m
```

Production smoke test on `https://vibeforge-seven.vercel.app`:

| Route | Status | Result |
|---|---:|---|
| `/` | 200 | Builder rendered, no console errors, no horizontal overflow. |
| `/dashboard` | 200 | Dashboard rendered, no console errors, no horizontal overflow. |
| `/agent-kit` | 200 | Agent Kit rendered, no console errors, no horizontal overflow. |
| `/repo-map` | 200 | Repo map rendered, no console errors, no horizontal overflow. |
| `/settings` | 200 | Settings rendered, no console errors, no horizontal overflow. |
| `/api/health` | 200 | Provider ready, analytics ready, production readiness `partial`. |
| `/api/production-readiness` | 207 | AI provider, analytics, security ready; Supabase, vault, durable rate limit, external monitoring missing env. |

Security headers confirmed on production `/dashboard`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security` present from Vercel

Vercel logs: no logs found in the 15 minute post-deploy scan.
