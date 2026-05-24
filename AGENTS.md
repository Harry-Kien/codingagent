# VibeForge Agent Instructions

## Mission

Keep VibeForge focused on creating practical project kits for AI coding workflows. Every feature should help a user move from vague idea to structured implementation artifacts.

## Engineering Rules

- Preserve the app's local-first MVP behavior.
- Do not require API keys for the core flow.
- Do not hardcode API keys or real secrets.
- Do not auto-clone external repos or execute user-supplied code.
- Keep generated outputs concrete, structured, and exportable.
- Prefer small, readable components and typed data models.
- Keep UI dense, calm, and usable rather than decorative.

## Karpathy-inspired Agent Rules

- Read the relevant code before editing.
- Understand the user's goal before writing code.
- Write a short plan for non-trivial work.
- Make small, focused changes one part at a time.
- Do not guess APIs, routes, schemas, or file structure; inspect them first.
- Do not delete working code, comments, or tests unless the task requires it.
- Run the relevant build, lint, or tests after changes.
- When something fails, fix the root cause instead of patching symptoms.
- Report the files changed and the checks run.

## UX Rules

- The `/` route must remain the usable builder, not a landing page.
- Use tabs for generated kit sections.
- Use icons for common actions through `lucide-react`.
- Avoid nested cards and oversized marketing layout.
- Ensure responsive layouts do not overlap or clip text.

## Test Checklist

- Generate a kit in demo/mock mode.
- Open generated project detail from history.
- Export Markdown, JSON, and ZIP.
- Copy a section.
- Regenerate a section.
- Save provider settings locally.
- Add an MCP connection.
- View repo recommendations for an AI video app.
