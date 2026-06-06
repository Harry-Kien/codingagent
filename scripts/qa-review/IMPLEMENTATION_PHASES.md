# IMPLEMENTATION_PHASES.md

## Phase 0: Validate The Brief
Goal: make sure the generated kit matches the user's actual request before code starts.

Files to review:
- PRODUCT_REQUIREMENTS.md
- MVP_SCOPE.md
- REPO_REFERENCES.md
- TASKS.md

Acceptance criteria:
- The target users, problem, desired output, and app type match the builder input.
- The MVP avoids expensive or risky features that do not fit 7 day build.
- Repo references are URL-only and include do-not-clone guidance.

Test command:
```powershell
npm.cmd run check:product
```

## Phase 1: Build The Smallest Working Flow
Goal: implement one end-to-end flow that creates 30-second product showcase videos with text overlays, background music, and transitions for Small shop owners, local retailers, Shopee/TikTok Shop sellers.

Likely files:
- src/app/page.tsx
- src/components/builder/BuilderForm.tsx
- src/lib/generator-shared.ts
- src/lib/export.ts

Acceptance criteria:
- User can complete the primary flow without API keys.
- Generated output can be copied or exported.
- Empty, loading, and error states are clear.

Test command:
```powershell
npm.cmd run lint
npm.cmd run build
```

## Phase 2: Add Provider Quality Carefully
Goal: use configured AI providers for deeper output while preserving demo fallback.

Likely files:
- src/app/api/generate-kit/route.ts
- src/lib/server-generator.ts
- src/lib/generation-client.ts
- src/lib/user-facing-errors.ts

Acceptance criteria:
- Provider mode reflects the user's exact input.
- Invalid provider key, timeout, quota, invalid model, and rate limit errors are clear.
- Demo fallback never destroys user work.

Test command:
```powershell
npm.cmd run check:production
```

## Phase 3: Productionize Only After The Core Works
Goal: add account storage, logs, and provider vault only when the core kit is useful.

Likely files:
- src/lib/cloud-store.ts
- src/lib/provider-vault.ts
- src/lib/generation-logs.ts
- supabase/migrations/*

Acceptance criteria:
- Local-first mode still works when Supabase is missing.
- Provider keys stay server-side in production paths.
- Generation logs do not contain secrets.

## Do Not Build Yet
- Team workspaces, billing, or marketplace features before beta users export useful kits.
- Automatic repo cloning, code copying, or external repo execution.
- Heavy rendering queues and media storage before the first workflow proves demand.
