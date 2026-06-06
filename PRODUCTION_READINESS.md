# VibeForge Production Readiness

Updated: 2026-06-05

Latest production deployment audited: `dpl_57jPtwWatvWj22o3mfWJr8Zyqg9P`

## Current Verdict

Status: **production-hardened public beta, not fully production-complete until durable cloud env is configured.**

The app now has code-level support for production database/cloud sync, provider vault, generation logs, monitoring hooks, analytics, security headers, API quota, and production preflight reporting. The current Vercel environment has the AI provider configured, but does not yet expose Supabase, Redis/Upstash, or external error monitoring env variables.

## Evidence From Current Audit

Vercel production env names present:

- `VIBEFORGE_SERVER_PROVIDER_API_KEY`
- `VIBEFORGE_SERVER_PROVIDER_NAME`
- `VIBEFORGE_SERVER_PROVIDER_TYPE`
- `VIBEFORGE_SERVER_PROVIDER_BASE_URL`
- `VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL`
- `VIBEFORGE_SERVER_PROVIDER_CHEAP_MODEL`
- `VIBEFORGE_SERVER_PROVIDER_STRONG_MODEL`
- `VIBEFORGE_SERVER_PROVIDER_VISION_MODEL`
- `VIBEFORGE_SERVER_PROVIDER_TOKEN_LIMIT`
- `VIBEFORGE_SERVER_PROVIDER_TEMPERATURE`
- `NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_ENABLED`
- `NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_NAME`
- `NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_MODEL`

Vercel production env names missing at audit time:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VIBEFORGE_PROVIDER_KEY_SECRET`
- `VIBEFORGE_REDIS_REST_URL` or `UPSTASH_REDIS_REST_URL`
- `VIBEFORGE_REDIS_REST_TOKEN` or `UPSTASH_REDIS_REST_TOKEN`
- `ERROR_WEBHOOK_URL` or `SENTRY_DSN`

Supabase projects visible through connector:

- `legal app` (`zmaihhisppgsvazbwqyg`) - ACTIVE_HEALTHY
- `Harry-Kien's Project` (`vtyayqqbxtrdlachnnww`) - INACTIVE

No Supabase project was clearly named VibeForge, and the available tool surface did not expose project API keys or SQL migration application. I did not write VibeForge schema into an unrelated project.

## Production Architecture

### Durable Data

Default mode remains local-first so the app never requires API keys for the core flow. Durable production mode is supported through Supabase:

- `projects`
- `project_versions`
- `provider_profiles`
- `mcp_connections`
- `generation_logs`

Migrations:

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_production_provider_vault.sql`
- `supabase/migrations/003_production_rls_data_api_hardening.sql`

Security model:

- All user-owned tables have RLS enabled.
- Policies are owner-scoped with `auth.uid() = user_id`.
- Data API grants are authenticated-only; anon access is explicitly revoked.
- The auth sign-up trigger function lives in the private schema, not public.
- Provider keys are encrypted server-side only in `provider_profiles`.
- `generation_logs` has owner-scoped select and no client insert policy.

Important Supabase note: recent Supabase behavior can require explicit Data API exposure/grants for SQL-created tables. After choosing the correct Supabase project, apply migrations and verify table access from `/api/production-readiness`.

### AI Provider

Production AI provider env is configured on Vercel. `/api/health` reports provider presence without exposing the API key.

### Monitoring

Implemented:

- `src/lib/monitoring.ts`
- Structured JSON error logs in server routes.
- Optional `ERROR_WEBHOOK_URL` forwarding.
- Vercel runtime logs remain available.

Missing for fully production-complete:

- Configure `ERROR_WEBHOOK_URL`, Sentry, Datadog, or Vercel Log Drain.

### Analytics

Implemented:

- `@vercel/analytics`
- `@vercel/speed-insights`
- `<Analytics />` and `<SpeedInsights />` in root layout.
- Basic custom events for kit generation and exports.

### API Quota

Implemented:

- Rate limiting on generation, regeneration, improvement, provider test, provider profiles, generation job, and trending repos.
- Optional Redis/Upstash REST backend for durable cross-instance quota.
- In-memory fallback for demo/single-instance operation.

Missing for fully production-complete:

- Configure Redis/Upstash env in Vercel production.

### Security

Implemented:

- Server-only provider vault, Supabase admin helper, generation logs, and monitoring helpers.
- Export sanitization for secret-like keys.
- Security headers in `next.config.ts`.
- Health/readiness routes expose booleans and labels only, not secret values.
- npm audit high findings were removed by upgrading Next.js to `16.2.7`.

Known residual audit item:

- `npm audit` still reports a moderate PostCSS advisory through Next.js' bundled dependency. `npm audit fix` suggests an invalid downgrade path to Next 9.3.3; do not apply that. Track the next Next.js patch that updates bundled PostCSS.

## Production Checklist To Finish Full Readiness

1. Choose or create the correct Supabase project for VibeForge.
2. Apply both Supabase migrations.
3. Add these Vercel production env variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VIBEFORGE_PROVIDER_KEY_SECRET`
4. Add Redis/Upstash env for durable quota:
   - `VIBEFORGE_REDIS_REST_URL`
   - `VIBEFORGE_REDIS_REST_TOKEN`
5. Add external error monitoring:
   - `ERROR_WEBHOOK_URL` or Sentry/Datadog integration.
6. Deploy production.
7. Open `/api/production-readiness`.
8. Treat status `ready` as the gate for full production launch.

Useful commands:

```powershell
npm.cmd run check:vercel-env
npm.cmd run check:production-readiness
$env:VIBEFORGE_ALLOW_PARTIAL_PRODUCTION='1'; npm.cmd run check:production-readiness
```

## Current Production Gate

The app is usable and hardened for public beta. It should not be called fully production-complete until `/api/production-readiness` returns `status: "ready"` on the production alias.

## Latest Verification Snapshot

Run after deploying `dpl_57jPtwWatvWj22o3mfWJr8Zyqg9P`:

- Production alias: `https://vibeforge-seven.vercel.app`
- Route smoke: `/`, `/dashboard`, `/agent-kit`, `/repo-map`, `/settings` all returned 200.
- `/api/production-readiness`: `partial`.
- `check:vercel-env`: missing Supabase, Redis, and external monitoring env listed above.
- `check:production-readiness` with `VIBEFORGE_ALLOW_PARTIAL_PRODUCTION=1`: passed as a public-beta deploy gate.
- Full production gate remains blocked by external Vercel env/database configuration, not by build/runtime code.
