# VibeForge Project Brief

VibeForge is an AI Project Operating System for vibe coding. It helps non-technical users convert rough app ideas into complete, AI-buildable project kits for Codex, Cline, Cursor, Claude Code, Gemini CLI, and similar tools.

## MVP Goal

Build a polished Next.js app that guides users through project intake, generates a structured project kit, recommends tools and repos, stores history locally, supports API/MCP settings, and exports artifacts as Markdown, JSON, and ZIP.

## Primary Users

- Non-coders building with AI coding agents
- Freelancers planning client MVPs
- AI automation agencies
- Course creators teaching vibe coding
- Indie hackers and developers who want structured project plans

## Core Experience

1. User enters a rough software idea and basic constraints.
2. App asks clarifying questions or lets AI choose defaults.
3. App generates a complete project kit with strategy, tasks, repo/tool map, architecture, test plan, deployment plan, and launch kit.
4. User can copy, approve, regenerate, download, export ZIP, save to history, and reopen projects.
5. User can configure AI providers and MCP/external integrations locally.

## Design Direction

Premium, calm SaaS interface with a real builder as the first screen. Use neutral backgrounds, deep charcoal text, restrained teal/blue/amber/coral/green accents, compact readable typography, and practical cockpit-style result panels.

## Constraints

- Must work without API keys through mock generation.
- Do not hardcode secrets.
- Store settings locally for MVP with clear warnings.
- Do not clone or execute external repositories automatically.
- Clearly distinguish install, clone, external tool, import workflow, and reference-only recommendations.
