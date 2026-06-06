# SECURITY_CHECKLIST.md

## Secret Handling
- No hardcoded API keys, tokens, or service-role keys.
- Do not send saved provider API keys back to the browser.
- Do not log provider API keys in console output, server logs, errors, or generation logs.
- Local provider keys are acceptable only for local-first MVP with a visible warning.

## Input And Provider Safety
- Validate all generate, regenerate, test-provider, and export inputs with typed schemas.
- Apply rate limits before provider calls.
- Return structured user-facing errors for invalid key, timeout, quota, invalid model, unreachable provider, and rate limit.
- Never execute user-supplied code.
- Never clone external repositories automatically.

## Repo Reference Safety
- Provide repo URLs as inspiration only.
- Ask for explicit approval before cloning, license review, or code reuse.
- Prefer package installation and official docs over copying repository files.

## Supabase Safety
- Enable RLS for user-owned data.
- Scope provider_profiles and generation_logs by user_id.
- Encrypt provider keys at rest before production user rollout.
- Document any encryption limitation in README before launch.
