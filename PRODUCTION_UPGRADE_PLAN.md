# VibeForge Production Upgrade Plan

> For agentic workers: execute one group at a time, keep local-first behavior intact, run the listed checks before moving on, and do not revert unrelated worktree changes.

Goal: upgrade VibeForge into a professional local-first AI Project Kit Builder whose demo mode produces high-quality, exportable, agent-ready kits without API keys, while optional provider mode can improve quality safely.

Architecture: preserve the existing Next.js App Router structure. Keep generation/export/storage logic in `src/lib/*`, keep UI components small, and use server routes only for optional provider-backed work. Local/Demo Mode remains the default and must always work.

Tech stack: Next.js 16, React 19, TypeScript, localStorage, Zod, React Hook Form, Tailwind, lucide-react, JSZip, Playwright.

## 1. Build/Runtime Stability

Goal: preserve the current passing baseline while making focused upgrades.

Files:

- `package.json`
- `next.config.ts`
- `src/app/*`
- `src/components/*`
- `src/lib/*`
- `e2e/core-flow.spec.ts`

Completion criteria:

- `/` renders the builder.
- `/projects`, `/projects/[id]`, `/settings`, and `/repo-map` render without severe runtime errors.
- Build remains green after each major change.

Checks:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`

## 2. Local Generator Quality 9/10

Goal: deterministic local generation creates concrete, domain-specific, agent-ready kits for short and long ideas without API keys.

Files:

- `src/lib/project-profile.ts`
- `src/lib/templates.ts`
- `src/lib/generator-shared.ts`
- `src/lib/kit-quality.ts`
- `scripts/verify-sample-output.mjs`

Tasks:

- Add or strengthen presets for CRM/freelancer workflows and habit/mobile workflows.
- Make required kit categories explicit in generated Markdown: Product Brief, Target Users, Core User Flow, Feature Scope, MVP Requirements, Technical Architecture, Data Models, UI Screens, Component Plan, Implementation Tasks, Agent Prompts, Acceptance Criteria, Test Checklist, Risks & Edge Cases, Launch/Export Notes.
- Add validation checks that flag generic `/items`, `AppItem`, or "saved work" output when a domain-specific profile should exist.
- Ensure local output for the three required ideas is meaningfully different.

Completion criteria:

- `AI video app` output mentions scripts, captions, shot lists, AI video prompts, video rendering as later, and URL-only repo references.
- `local CRM for freelancers` output mentions clients, leads, invoices/deals, follow-ups, pipeline, local storage, and freelancer workflows.
- `habit tracker mobile app` output mentions habits, streaks, check-ins, reminders, mobile screens, offline/local persistence, and progress.
- Every generated kit has actionable tasks, acceptance criteria, and a test checklist.

Checks:

- `npm.cmd run check:sample-output`
- `npm.cmd run check:product`
- Manual inspection with `scripts/dump-sample-kit.mjs` or an equivalent local generation script.

## 3. Optional AI Provider Quality 10/10

Goal: provider mode remains optional, safe, and quality-focused while never breaking demo mode.

Files:

- `src/lib/server-generator.ts`
- `src/lib/generation-client.ts`
- `src/app/api/generate-kit/route.ts`
- `src/app/api/regenerate-section/route.ts`
- `src/app/api/improve-section/route.ts`
- `src/app/api/test-provider/route.ts`
- `src/components/settings/ProviderSettingsForm.tsx`

Completion criteria:

- Demo mode never requires provider settings.
- Provider errors return user-facing messages and fallback to demo generation where appropriate.
- Provider prompts require domain-specific sections, no placeholders, no clone instructions, and local-first MVP scope.
- No provider key is logged or exported.

Checks:

- `npm.cmd run check:production`
- `npm.cmd run build`
- Manual invalid-provider test in settings or E2E.

## 4. History/Detail/Export

Goal: users can save, reopen, copy, regenerate, and export generated kits end to end.

Files:

- `src/lib/storage.ts`
- `src/lib/use-project-store.ts`
- `src/lib/export-core.ts`
- `src/lib/export.ts`
- `src/components/ExportButton.tsx`
- `src/components/history/ProjectHistoryList.tsx`
- `src/components/kit/ProjectDetailClient.tsx`

Completion criteria:

- Generated projects save to local history.
- History opens generated project detail.
- Markdown, JSON, ZIP, and agent packs download complete content.
- Exported JSON does not include provider secrets.

Checks:

- `npm.cmd run check:exports`
- `npm.cmd run test:e2e`

## 5. Copy/Regenerate Section

Goal: every section can be copied and regenerated without provider keys.

Files:

- `src/components/CopyButton.tsx`
- `src/components/kit/ProjectKitTabs.tsx`
- `src/components/kit/MarkdownSection.tsx`
- `src/lib/generator-shared.ts`
- `src/lib/section-workspace.ts`

Completion criteria:

- Copy button works for the active section.
- Local regenerate changes only the selected section.
- Regenerated output stays domain-specific.
- Section status/version metadata updates cleanly.

Checks:

- `npm.cmd run test:e2e`
- Manual regenerate for `Task Plan`, `Architecture`, and `Test Plan`.

## 6. Provider Settings/MCP

Goal: settings remain local-first and explicit about safety limits.

Files:

- `src/components/settings/ProviderSettingsForm.tsx`
- `src/components/settings/McpConnectionCard.tsx`
- `src/lib/storage.ts`
- `src/lib/export-core.ts`

Completion criteria:

- User can add/save provider settings locally.
- User can test provider if configured.
- User can add/save MCP connection.
- MCP JSON export works.
- Local provider keys are not included in project exports.

Checks:

- `npm.cmd run test:e2e`
- `npm.cmd run check:exports`

## 7. Repo Recommendations

Goal: AI video app recommendations are useful, URL-only, and safe.

Files:

- `src/lib/repo-data.ts`
- `src/components/repo/RepoRecommendationPanel.tsx`
- `src/app/repo-map/page.tsx`
- `src/app/api/trending-repos/route.ts`

Completion criteria:

- AI video app recommendations include relevant video/script/storyboard/rendering references.
- Remotion/FFmpeg/rendering-heavy tools are clearly use-later or reference-only for the MVP.
- Repo references never instruct auto-clone or execution.
- Repo map handles live trend failure with a clear fallback.

Checks:

- `npm.cmd run check:product`
- `npm.cmd run test:e2e`

## 8. UX Polish

Goal: dense, calm, professional UI with no landing-page drift and no text overlap.

Files:

- `src/app/page.tsx`
- `src/components/builder/BuilderForm.tsx`
- `src/components/kit/ProjectDetailClient.tsx`
- `src/components/kit/ProjectKitTabs.tsx`
- `src/components/kit/MarkdownSection.tsx`
- `src/app/globals.css`
- `src/app/repo-map/page.tsx`
- `src/app/settings/page.tsx`

Completion criteria:

- `/` first screen is the builder.
- Common actions use lucide-react icons.
- Generated sections are shown with tabs/list navigation.
- Empty/loading/error states are readable.
- Mobile and desktop layouts do not clip or overlap key text/actions.

Checks:

- Browser verification on desktop and mobile.
- `npm.cmd run test:e2e`

## 9. Security Hardening

Goal: preserve local-first safety limits and avoid secret exposure.

Files:

- `.env.example`
- `src/lib/export-core.ts`
- `src/lib/provider-vault.ts`
- `src/lib/generation-logs.ts`
- `src/lib/server-generator.ts`
- `src/app/api/*`
- `SECURITY_REPORT.md`

Completion criteria:

- No hardcoded real secrets.
- `.env.example` contains placeholders only.
- Provider keys are not logged or exported.
- API inputs are validated.
- Repo references are URL-only.
- No user-supplied code execution or auto-cloning.

Checks:

- `npm.cmd run check:production`
- `npm.cmd run check:exports`
- Manual review of changed files.

## 10. Documentation/Readiness

Goal: final docs explain product behavior, local/demo mode, optional provider mode, safety limits, and checks.

Files:

- `README.md`
- `PRODUCT_REPORT.md`
- `SECURITY_REPORT.md`
- `CHECKPOINT_REPORT.md` if anything remains incomplete
- `.env.example`

Completion criteria:

- README explains VibeForge, Local/Demo Mode, optional AI Provider Mode, core features, running local, generating/exporting, provider settings, and safety limits.
- Product report lists changes, files changed, flows checked, generator improvements, commands run, and next work.
- Security report lists checked risks, fixes, residual risks, and production recommendations.

Checks:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `npm.cmd run check:product`
- `npm.cmd run check:exports`
- `npm.cmd run check:sample-output`
- `npm.cmd run check:production`
- `npm.cmd run test:e2e`
