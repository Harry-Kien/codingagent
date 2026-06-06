# VibeForge Security Report

Date: 2026-06-06

## Risks Checked

- Hardcoded API keys, tokens, and secret-like values.
- Provider API key storage and export behavior.
- Provider route validation, rate limiting, and user-facing errors.
- Server-side provider vault boundaries.
- Generation logs and monitoring sanitization.
- `.env.example` placeholder safety.
- Project JSON/ZIP export secret leakage.
- Repo recommendation behavior.
- User-supplied code execution risk.
- External repo auto-clone risk.
- Browser localStorage limitations for provider settings.

## What Was Fixed Or Strengthened

- Added stronger generator coverage for `local CRM for freelancers` and `habit tracker mobile app`, avoiding generic `/items` and `AppItem` fallback outputs.
- Expanded sample-output verification to assert domain-specific entities, routes, tasks, test checklist markers, and required kit taxonomy headings.
- Kept project exports sanitized through `src/lib/export-core.ts`; provider key-like fields are excluded from exported project JSON.
- Confirmed production hardening checks pass for server-only provider vault, generation logs, rate limits, security headers, and `.env.example`.

## Current Security Posture

- Local/Demo Mode requires no API keys.
- Provider Mode is optional.
- Browser local provider keys are used only as a local-first fallback and are not included in project exports.
- Production provider profiles are designed for encrypted server-side storage and owner-scoped Supabase access.
- API generation routes validate input with Zod and apply rate limits.
- Repo references are URL-only. VibeForge does not auto-clone external repositories or execute user-supplied code.

## Residual Risks

- Provider keys saved through Settings are stored in browser localStorage. This is acceptable for local MVP use, but not a secure vault for shared browsers or production users.
- Live GitHub trend fetching can hit API rate limits. The app falls back to the local snapshot, but users may see fallback data instead of live data.
- The worktree contains local `.env.local`, `.env.local.backup`, and `.env.vercel` files. They should remain uncommitted and excluded from exports.
- Supabase cloud sync and provider vault production paths depend on correct deployment env vars and migrations.

## Production Recommendations

- Use server-side provider profiles and `VIBEFORGE_PROVIDER_KEY_SECRET` for production API keys.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and never expose it through `NEXT_PUBLIC_*`.
- Run Supabase RLS migrations before public cloud sync.
- Use Redis/Upstash rate limiting for multi-instance deployments.
- Keep repo references as URL-only unless explicit license review and user approval allow code reuse.
- Run before production promotion:
  - `npm.cmd run lint`
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - `npm.cmd run check:exports`
  - `npm.cmd run check:production`
  - `npm.cmd run test:e2e`
