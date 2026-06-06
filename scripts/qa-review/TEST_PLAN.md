# TEST_PLAN.md

## Test Strategy
The test plan should prove that the user can move from rough idea to exportable AI-coding kit without hidden setup.

## Manual Flow Checklist
- Generate a kit in demo/mock mode with only an idea and defaults.
- Generate a kit with target users, problem, desired output, MCP, and automation enabled.
- Open generated project detail from history.
- Copy one section and confirm Markdown stays readable.
- Edit a section, save it, approve it, and confirm version history records the change.
- Regenerate one section and confirm only that section changes.
- Export Markdown, JSON, ZIP, Codex Pack, Cline Pack, Cursor Pack, and Claude Code Pack.
- Save provider settings locally and confirm demo mode still works if the provider is disabled.
- Add an MCP connection.
- View repo recommendations for an AI video app.
- Generate AI video sample
- Export ZIP
- Confirm Remotion and FFmpeg are use-later items

## Automated Checks
| Check | Purpose | Command |
|---|---|---|
| Lint | Catch invalid React/TypeScript patterns | npm.cmd run lint |
| Build | Catch route, type, and bundling failures | npm.cmd run build |
| Product check | Ensure kit sections, templates, repo lanes, and exports exist | npm.cmd run check:product |
| Export check | Ensure Markdown/JSON/ZIP/agent packs still map to files | npm.cmd run check:exports |
| Production check | Ensure provider hardening rules stay present | npm.cmd run check:production |

## Acceptance Criteria
- No test requires a real API key for the core flow.
- Failed provider calls produce a useful error and do not erase generated work.
- Exported TASKS.md includes file paths, acceptance criteria, and test commands.
- Exported TOOLS.md includes repo URLs and reference-only guidance.
