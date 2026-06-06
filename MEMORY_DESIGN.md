# Memory Design

## Goals

VibeForge memory should help a user resume product planning and agent handoff work without requiring accounts, API keys, or cloud services for the core flow.

## Memory Types

| Memory | Storage | Contents | Secret Policy |
|---|---|---|---|
| Project memory | localStorage by default, optional Supabase cloud sync | ProjectKit records, sections, readiness score, generation metadata, timestamps | No secrets. Export sanitization removes sensitive keys. |
| Repo memory | source files and docs | Route map, component map, API map, dependency map, risks, TODO/FIXME scan | No secrets. Reference repos are URLs only. |
| User preference memory | localStorage | Provider profile selection, UI form defaults, MCP connection plans | Local provider keys are not production vault storage. Warn users accordingly. |
| Provider vault memory | Supabase/server only when configured | Encrypted provider profiles and metadata | Never return decrypted keys to the browser. Never log keys. |
| Agent run memory | ProjectKit section history | Section versions, status, improvement/regeneration notes | Store task state and output, not credentials. |

## Local-First Behavior

- The builder, demo generator, project history, project detail, exports, and MCP connection planner work without login or API keys.
- Cloud sync is optional and must not become a dependency for the core demo.
- If cloud save fails, the app should preserve work in localStorage.

## Secret Exclusion

Secrets must not be saved in generated kit sections, exported JSON, exported ZIP files, README examples, logs, screenshots, or docs. The export layer sanitizes common sensitive keys such as `apiKey`, `secret`, `token`, `password`, and provider ciphertext fields.

## Future Memory Upgrades

1. Add explicit project-memory export/import.
2. Add user-controlled memory reset.
3. Add encrypted server-side preference profiles for production accounts.
4. Add per-project agent activity logs with no prompt secrets.
5. Add retention policy and audit log before team launch.
