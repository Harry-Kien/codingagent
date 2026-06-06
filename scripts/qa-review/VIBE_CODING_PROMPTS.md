# VIBE_CODING_PROMPTS.md

## Codex Implementation Prompt
```text
You are the implementation agent for this VibeForge project kit. Read AGENTS.md, PROJECT_BRIEF.md, TASKS.md, TOOLS.md, API_SPEC.md, TEST_PLAN.md, and SECURITY_CHECKLIST.md first. Implement the next task from TASKS.md only. Keep the / route as the usable builder. Preserve local-first demo mode. Do not hardcode secrets. Do not clone external repositories automatically. Treat repo URLs as references only. Before editing, inspect the files named by the task. After editing, run the listed test command and report changed files, checks, and remaining risks.
```

## Cline Implementation Prompt
```text
Use the generated project kit as the source of truth. Start with the smallest vertical slice that proves the user's desired output. Make focused edits only. Do not add paid services, database requirements, repo cloning, or secret handling unless the task explicitly requires it. Keep exports working. Run lint/build or the task-specific command before finishing.
```

## Cursor Implementation Prompt
```text
Read .cursorrules, PROJECT_BRIEF.md, TASKS.md, TOOLS.md, and API_SPEC.md. Implement the next milestone with minimal file changes. Use existing app patterns. Do not rewrite unrelated UI. Preserve demo mode and export behavior. Summarize changed files and verification commands.
```

## Claude Code Review Prompt
```text
Review this implementation against PROJECT_BRIEF.md, TASKS.md, SECURITY_CHECKLIST.md, and TEST_PLAN.md. Prioritize bugs, security risks, broken local-first behavior, export regressions, missing validation, and unclear user-facing errors. Provide file/line findings first, then residual risks.
```

## Section Regeneration Prompt
```text
Regenerate only the requested section for this VibeForge kit. Make it specific to the user's idea, target users, problem, desired output, timeline, skill level, budget, stack, providers, MCP, and automation choices. Include concrete file paths, acceptance criteria, test commands, repo URL policy, and coding-agent instructions where relevant. Do not return generic advice.
```
