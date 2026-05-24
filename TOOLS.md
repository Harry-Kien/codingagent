# VibeForge Tool Map

## Runtime Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- lucide-react icons
- Zod + React Hook Form
- JSZip for project exports
- localStorage for MVP persistence

## Agent Workflow

- Codex CLI: external coding agent workflow, do not copy into the app.
- Cline: external VS Code agent workflow.
- Superpowers: workflow and skill methodology reference.
- andrej-karpathy-skills: agent workflow/reference only; borrow the caution, simplicity, surgical-change, and verification rules without copying large code or adding dependencies.
- OpenHands: advanced orchestration reference only for later teams.

## Product Repos

- shadcn/ui: install/use components in app.
- Supabase: future auth, Postgres, and storage service.
- n8n: external automation service or workflow import path.
- Remotion and FFmpeg: future video rendering stack after MVP validation.
- VideoSOS, StoryGen-Atelier, short-video-maker: reference only unless a human explicitly approves license and code reuse.

## Safety Notes

- Do not auto-clone repositories.
- Do not execute user-supplied code.
- Do not hardcode secrets.
- Keep reference repos separate from installable dependencies.
