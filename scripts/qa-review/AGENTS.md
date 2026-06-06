# AGENTS.md

# Agent Rules

## Mission
Implement the project from the generated kit files. Treat Markdown files as implementation contracts.

## Hard Rules
- Preserve local-first behavior unless the task explicitly moves a feature to server/cloud.
- Do not require API keys for demo/core flow.
- Do not clone external repositories automatically.
- Do not copy code from reference repos without license review and user approval.
- Do not hardcode secrets.
- Keep changes focused and verify after each milestone.

## Working Method
1. Read PROJECT_BRIEF.md, TASKS.md, TOOLS.md, API_SPEC.md, and SECURITY_CHECKLIST.md.
2. Pick only the next task from TASKS.md.
3. Inspect existing files before editing.
4. Implement the smallest working slice.
5. Run the listed test command.
6. Report changed files and remaining risks.

## Definition Of Done
- Acceptance criteria are satisfied.
- Build/lint/check commands pass or failures are explained.
- Exports still work.
- No unrelated rewrites.
