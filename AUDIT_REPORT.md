# VibeForge Audit Report

Date: 2026-06-06

## Current State Summary

VibeForge is a Next.js 16 App Router product with a usable builder at `/`, local-first project persistence, deterministic demo generation, optional provider-backed server generation, project history/detail views, section tabs, copy/regenerate/improve actions, Markdown/JSON/ZIP/agent-pack exports, provider settings, MCP connection settings, and repo/tool recommendations.

The project is already more mature than a rough MVP. Baseline checks pass:

- `npm.cmd run lint` passed.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed.
- `npm.cmd run check:product` passed.
- `npm.cmd run check:exports` passed.
- `npm.cmd run check:sample-output` passed.

The core risk is no longer basic build stability. The main product gap is ensuring the local generator consistently reaches a high-quality 9/10 standard across short, varied user ideas and that UX/security/docs remain aligned with a local-first professional product.

## Project Structure

- `src/app/page.tsx` keeps `/` as the builder entrypoint.
- `src/app/projects/page.tsx` and `src/app/projects/[id]/page.tsx` handle history and project detail.
- `src/app/settings/page.tsx` handles provider and MCP settings.
- `src/app/repo-map/page.tsx` handles repo/tool discovery and filtering.
- `src/app/api/*` contains provider generation, section regeneration, provider testing, health, readiness, and repo trend routes.
- `src/components/builder/*` contains the builder form, quick starts, and templates.
- `src/components/kit/*` contains project detail, tabs, section editor, readiness score, and start-build prompt.
- `src/components/settings/*` contains local provider settings and MCP connection configuration.
- `src/components/repo/*` contains repo recommendations.
- `src/lib/generator-shared.ts`, `src/lib/project-profile.ts`, and `src/lib/templates.ts` contain local generation logic.
- `src/lib/server-generator.ts` contains optional provider generation and provider fallback.
- `src/lib/storage.ts` and `src/lib/use-project-store.ts` contain local/cloud storage behavior.
- `src/lib/export-core.ts` and `src/lib/export.ts` contain export formatting and download logic.
- `e2e/core-flow.spec.ts` covers the most important browser flows.

## Critical Issues

No critical build/runtime blockers were found during baseline audit.

## High Priority Issues

1. Local generator section names do not exactly match the requested product section taxonomy.
   Current sections are export-file oriented, such as `Product Requirements`, `MVP Scope`, `Architecture`, `Task Plan`, and `AI Handoff Brief`. They cover most requested content, but the user-requested sections like `Product Brief`, `Target Users`, `Core User Flow`, `Feature Scope`, `Data Models`, `Component Plan`, `Agent Prompts`, `Acceptance Criteria`, and `Risks & Edge Cases` should be more explicitly represented inside generated output.

2. Local generator quality relies on large preset content in `src/lib/project-profile.ts` and `src/lib/generator-shared.ts`.
   This is useful, but needs stronger validation to prove short inputs such as "habit tracker mobile app" do not fall back to generic item CRUD. More domain presets or heuristic enrichment are needed for the required test ideas.

3. Provider settings store inline API keys in browser localStorage for local fallback.
   The UI warns users about this and production vault code exists, but this remains a high-risk local MVP behavior. Exports sanitize keys, and provider generation is optional, but docs/security copy should keep this limitation explicit.

4. Repo map defaults to live GitHub trends and logs fetch failures to the browser console.
   This does not clone or execute code, but live fetch failures should be handled with a user-visible fallback state instead of only `console.error`.

5. The worktree is dirty with many pre-existing modified and untracked files.
   This is not a product issue, but it increases change-management risk. Future edits must stay focused and avoid reverting unrelated user work.

## Medium Priority Issues

1. `MarkdownSection` uses a card wrapper around the entire section editor. This is acceptable for a framed tool, but the app should avoid adding more nested card structures around it.

2. Project detail has many actions in the header. It is functional, but the export/action area can feel dense on smaller screens and should be verified visually.

3. `Provider polish all` can iterate every section with provider calls. It is optional and gated by provider availability, but it needs clear cost/timeout expectations.

4. Local storage helpers swallow JSON parse errors silently. This prevents crashes but does not show a recovery message if storage is corrupted.

5. E2E is strong but was not run in this first audit step. Baseline lint/typecheck/build/product/export/sample-output checks were run; browser E2E should be run after code changes.

## UX/Product Issues

- `/` is currently a usable builder, not a landing page. This satisfies a hard requirement.
- The builder has clear Demo/Provider/Auto modes and defaults to demo.
- Tabs/section list exist for generated kit sections.
- Copy, edit, approve, improve, regenerate, and section export actions exist.
- Empty states exist for missing project, no sections, no providers, and no MCP connections.
- Responsive behavior needs fresh browser verification after any UI edits, especially the project detail action toolbar and repo map filters.
- Generated section titles should better map to the user's mental model: product brief, target users, flows, data models, implementation tasks, prompts, acceptance criteria, tests, risks, and launch/export notes.

## Security Issues

- No hardcoded real API keys were found in source during audit, but `.env.local`, `.env.local.backup`, and `.env.vercel` exist locally and must not be exported or committed.
- `.env.example` exists and is checked by production hardening scripts for secret-like values.
- Export JSON sanitizes sensitive key names and generation provider/model metadata.
- Provider vault code is server-only and includes encryption checks in `scripts/verify-production-hardening.mjs`.
- API routes validate request bodies with Zod and apply rate limiting.
- Repo references are URL-only and repeatedly state "do not clone automatically."
- Remaining risk: browser localStorage provider keys are not a secure vault and should remain local MVP only.

## Generator Quality Issues

- Strengths:
  - Deterministic local generation works without API keys.
  - Domain detection uses templates, profile presets, keyword scoring, route/entity/task generation, repo recommendations, and quality checks.
  - Existing sample-output verification covers 11 sample kits.
  - AI video app generation is already explicitly supported.

- Gaps:
  - Required audit examples include `local CRM for freelancers` and `habit tracker mobile app`; these need direct generator verification and likely stronger presets.
  - Short inputs can still risk generic labels, routes like `/items`, and generic entities such as `AppItem`.
  - Section-specific validation should verify required content categories, not only file presence and broad keywords.
  - Acceptance criteria and test checklist content should be explicitly easy to find in every generated kit.

## Build/Test Status

Commands run during audit:

- `npm.cmd run lint` -> pass.
- `npm.cmd run typecheck` -> pass.
- `npm.cmd run build` -> pass.
- `npm.cmd run check:product` -> pass.
- `npm.cmd run check:exports` -> pass.
- `npm.cmd run check:sample-output` -> pass.

Commands still needed after implementation:

- `npm.cmd run check:production`
- `npm.cmd run test:e2e`
- Manual/browser verification for desktop and mobile layouts.
- Manual generator comparison for:
  - `AI video app`
  - `local CRM for freelancers`
  - `habit tracker mobile app`

## Files/Modules Likely To Change

- `src/lib/project-profile.ts`
- `src/lib/templates.ts`
- `src/lib/generator-shared.ts`
- `src/lib/kit-quality.ts`
- `src/lib/export-core.ts`
- `src/components/builder/BuilderForm.tsx`
- `src/components/kit/ProjectKitTabs.tsx`
- `src/components/kit/MarkdownSection.tsx`
- `src/components/repo/RepoRecommendationPanel.tsx`
- `src/app/repo-map/page.tsx`
- `src/components/settings/ProviderSettingsForm.tsx`
- `src/components/settings/McpConnectionCard.tsx`
- `scripts/verify-sample-output.mjs`
- `scripts/product-checks.mjs`
- `e2e/core-flow.spec.ts`
- `README.md`

## Recommended Upgrade Order

1. Keep build/runtime stable and preserve current passing baseline.
2. Strengthen local generator presets and validation for the required sample ideas.
3. Make requested kit taxonomy explicit inside generated sections and exports.
4. Verify copy/regenerate/history/export/settings/MCP/repo flows with E2E.
5. Polish UX only where it improves the actual builder/detail/settings workflows.
6. Harden security docs and local provider warnings.
7. Update documentation and final product/security/checkpoint reports.
