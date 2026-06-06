# VibeForge Output QA Report

## Summary

This QA pass added a sample-output verification gate for VibeForge and confirmed that generated demo/local project kits are suitable for vibe coding handoff. The new check generates five representative project ideas, validates required kit sections, verifies task/API/repo/handoff quality markers, rejects placeholder output, and confirms the repo map stays URL-only.

## Files Reviewed

- `AGENTS.md`
- `package.json`
- `src/lib/generator-shared.ts`
- `src/lib/server-generator.ts`
- `src/lib/export.ts`
- `src/lib/kit-sections.ts`
- `src/lib/repo-data.ts`
- `src/components/builder/BuilderForm.tsx`
- `src/types/vibeforge.ts`
- `scripts/product-checks.mjs`
- `scripts/verify-exports.mjs`
- `README.md`

## Files Changed In This QA Pass

- `scripts/verify-sample-output.mjs`
  - Added runtime sample generation checks for five project ideas.
  - Verifies required sections, task quality, API request/response/error coverage, repo URL/no-clone policy, AI handoff prompt, and placeholder absence.
  - Verifies repo data has at least 80 URL-only references with required metadata.
- `package.json`
  - Added `check:samples`.
- `README.md`
  - Documented `check:samples`.
  - Updated quality-check commands for Windows/PowerShell usage.
- `src/lib/generator-shared.ts`
  - Standardized generated headings for `Error cases`, `Screen: ...`, `Happy Path`, and `Failure Path` so both users and automated checks can identify quality-critical content.

## Sample Ideas Tested

1. AI video app for small shops
2. n8n automation for lead qualification
3. SaaS dashboard for freelance finance tracking
4. Internal business tool for inventory approvals
5. E-commerce helper for product description generation

## Output Quality Result

Passed.

The new sample check confirms every generated sample kit includes:

- Product requirements or product strategy
- MVP scope
- Architecture / stack recommendation
- Database schema
- API specification
- UI screens
- User flows
- Task plan
- Implementation phases
- Repo references
- AI handoff brief
- Vibe coding prompts
- Test plan
- Security checklist
- Next actions

The check also verifies:

- `TASKS.md` includes `Files:`, `Acceptance criteria`, and `Test command`.
- `API_SPEC.md` includes request body, response body, and error cases.
- `REPO_REFERENCES.md` includes URLs, GitHub discovery URLs, and no-clone warning.
- `AI_HANDOFF.md` includes upload files, primary agent prompt, and definition of done.
- Generated sections do not include placeholder patterns such as TODO, TBD, lorem ipsum, coming soon, or `To be generated.`

## Export Result

Passed.

Existing export checks confirm:

- ZIP and agent packs include `AI_HANDOFF.md`.
- Agent packs include task, repo reference, next action, and vibe-coding prompt files.
- `downloadZip` and `downloadAgentPack` mappings are present.

## Repo Data Verification Result

Passed.

The sample check verified:

- Repo map has 167 references.
- Repo references use valid HTTP/HTTPS URLs.
- Each repo includes category, use case, when-to-use guidance, risk notes, and tags.
- No repo entry uses a clone workflow.
- No automatic `git clone` command appears in repo data.

## Commands Run And Exact Result

- `git status --short`
  - Completed. Repo had existing modified files from prior upgrade work plus new QA files.
- `npm.cmd run lint`
  - Passed.
- `npm.cmd run build`
  - Passed.
  - Note: one intermediate run failed because a generated `.next/dev/types/routes.d.ts` cache file contained a duplicated tail. The sandbox blocked deleting `.next`, so the generated cache file was corrected and build was rerun successfully.
- `npm.cmd run check:product`
  - Passed.
  - Output included: `Repo map: 167 repos (minimum 80, ideal 100+).`
- `npm.cmd run check:exports`
  - Passed.
  - Output: `Export packs and templates verified.`
- `npm.cmd run check:production`
  - Passed.
  - Output: `Production hardening checks passed.`
- `npm.cmd run check:samples`
  - Passed.
  - Output included: `Generated and checked 5 sample kits` and `Repo data verified: 167 URL-only references.`
- `npm.cmd run test:e2e -- --list`
  - Passed.
  - Output listed 22 Playwright tests.

## Remaining Risks

- Full Playwright E2E execution was not run in this pass; only test discovery/listing was required and completed.
- The project still has many uncommitted changes from the broader upgrade work, so merge timing with Antigravity should be handled carefully.
- Provider-backed live output quality still depends on the selected model and API reliability; the new sample check validates deterministic demo/local output.
- `.next` generated cache can become stale or corrupted during parallel work; when allowed, deleting `.next` before final CI/build is cleaner than editing generated files.

## Recommended Next Steps

1. Run `npm.cmd run test:e2e` after Antigravity finishes its generator/product-engine changes.
2. Run `npm.cmd run check:samples` after every generator or repo-map change.
3. Review five real user ideas manually in the browser and compare exported `AI_HANDOFF.md`, `TASKS.md`, `API_SPEC.md`, and `REPO_REFERENCES.md`.
4. Commit after reconciling Antigravity's changes to avoid mixing QA guardrails with large generator edits unintentionally.
