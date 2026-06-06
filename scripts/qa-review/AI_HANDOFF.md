# AI_HANDOFF.md

## Purpose
This file is the safest single-file brief to upload into Codex, Cline, Cursor, Claude Code, or another AI coding agent. It tells the agent exactly what to build, which files to read first, what constraints to preserve, and how to verify the work.

## Project Snapshot
- Project: AI Video App For Small Shops That Generates Product Showcase
- App type: AI video app
- Target users: Small shop owners, local retailers, Shopee/TikTok Shop sellers
- Problem: Small shops can't afford professional video production for their products
- Desired output: 30-second product showcase videos with text overlays, background music, and transitions
- Timeline: 7 day build
- Skill level: Builder
- Budget sensitivity: high
- Preferred stack: Next.js, Supabase
- Providers available: OpenRouter
- MCP requested: yes
- Automation requested: yes

## Upload These Files Together
1. AI_HANDOFF.md
2. PRODUCT_REQUIREMENTS.md
3. MVP_SCOPE.md
4. ARCHITECTURE.md
5. API_SPEC.md
6. TASKS.md
7. IMPLEMENTATION_PHASES.md
8. REPO_REFERENCES.md
9. SECURITY_CHECKLIST.md
10. TEST_PLAN.md
11. VIBE_CODING_PROMPTS.md

## Primary Agent Prompt
```text
You are the implementation agent for this project kit. Read AI_HANDOFF.md, PRODUCT_REQUIREMENTS.md, MVP_SCOPE.md, ARCHITECTURE.md, API_SPEC.md, TASKS.md, IMPLEMENTATION_PHASES.md, REPO_REFERENCES.md, SECURITY_CHECKLIST.md, and TEST_PLAN.md before editing. Implement only the next highest-priority task from TASKS.md. Preserve the requested user outcome: 30-second product showcase videos with text overlays, background music, and transitions. Keep local/demo fallback working. Do not hardcode secrets. Do not clone external repositories automatically. Treat repo URLs as reference-only. Before editing, inspect the target files named by the task. After editing, run the listed test command and report changed files, checks run, and remaining risks.
```

## Non-Negotiable Constraints
- Match the user's stated target users, problem, desired output, timeline, stack, provider, MCP, and automation choices.
- Build the smallest working workflow before adding production-only systems.
- Keep API keys and secrets out of source code and prompts.
- Do not execute user-supplied code.
- Do not clone external repositories automatically.
- Use repo URLs only for README/docs/architecture/package inspiration unless the user approves license review and code reuse.

## Quality Gate Before Coding
The agent should not start implementation until it can answer:
- What exact output should the user receive?
- Which user problem does the MVP solve first?
- Which files are likely to change in the next task?
- What acceptance criteria prove the task is done?
- What command verifies the task?
- Which features are explicitly not part of the first build?

## Definition Of Done
- The implemented task satisfies its acceptance criteria.
- Lint/build/check commands pass, or any blocker is reported with the root cause.
- Demo/local-first behavior still works.
- Exported Markdown/JSON/ZIP/agent packs still work.
- No secrets, external repo code, or unrelated rewrites are introduced.
