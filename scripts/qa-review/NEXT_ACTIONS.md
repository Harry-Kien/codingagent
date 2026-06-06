# NEXT_ACTIONS.md

## Next 5 Actions
1. Generate a kit for the strongest target niche and review every section for specificity.
2. Open TASKS.md in Codex and implement only Phase 1 Task 1.
3. Expand Repo & Tool Map with more high-star URL references for the user's selected domain.
4. Test exports: Markdown, JSON, ZIP, Codex Pack, Cline Pack, Cursor Pack, Claude Code Pack.
5. Run lint, build, product checks, export checks, and production checks.

## First Coding-Agent Handoff
Use this prompt:
```text
Read AGENTS.md, PROJECT_BRIEF.md, TASKS.md, TOOLS.md, API_SPEC.md, and SECURITY_CHECKLIST.md. Implement the first unchecked task only. Preserve local-first demo behavior. Do not clone external repos automatically. Before editing, inspect the target files listed in TASKS.md. After editing, run the listed test command and report changed files, checks, and risks.
```

## Review Questions Before Building More
- Does the output match the user's exact desired output?
- Does every task name the files to edit?
- Does every risky integration have a fallback?
- Can a coding agent start without asking for another brief?
