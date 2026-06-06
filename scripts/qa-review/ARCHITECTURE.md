# ARCHITECTURE.md

## Architecture Overview
AI Video App For Small Shops That Generates Product Showcase is built as a local-first Next.js web app that helps Small shop owners, local retailers, Shopee/TikTok Shop sellers create 30-second product showcase videos with text overlays, background music, and transitions. The architecture keeps the first workflow simple, fast, and easy for AI coding agents to extend.

## Frontend
- App Router pages under src/app/.
- Landing/intake page at src/app/page.tsx for AI video app input.
- Output preview at src/app/preview/page.tsx showing generated 30-second product showcase videos with text overlays, background music, and transitions.
- History at src/app/history/page.tsx for past outputs.
- AI video app-specific components in src/components/ai-video-app/.

## Backend And API Layer
- Route handlers in src/app/api/ for AI video app-specific processing.
- POST /api/process — Main processing endpoint for user input.
- POST /api/generate — AI-powered generation endpoint (when provider is configured).
- GET /api/outputs/[id] — Retrieve a specific output.
- Zod validation on every route before processing.
- Rate limiting before expensive AI or external API calls.

## Storage
- Default: browser localStorage for the MVP (no accounts needed).
- File uploads: local /tmp during dev, cloud storage (Cloudinary/S3) for production.
- Supabase for optional user accounts and cloud sync later.

## AI Provider Layer
- Demo mode with deterministic output (no API keys needed).
- Provider mode with OpenRouter/Gemini/OpenAI for richer generation.
- Provider failure falls back safely to demo output.

## Deployment
- Vercel (recommended) for the Next.js app.
- Environment variables optional for demo; required for AI provider and storage.

## Risks
- Video rendering is compute-heavy; defer to Phase 2 after validating planning outputs.
- External API costs should be controlled with rate limits and usage caps.
- User uploads need size limits and type validation before processing.

## Recommended Stack
- Next.js
- Supabase later
- shadcn/ui
- Gemini or OpenRouter provider option
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Zod + React Hook Form
- localStorage (default) → Supabase (optional)

## Why This Stack Fits
This stack allows Small shop owners, local retailers, Shopee/TikTok Shop sellers to start using the app immediately without setup. The Next.js App Router handles both the UI and API routes in one project. Local-first storage means no accounts are needed for the MVP.

## Alternatives Considered
- Vite: faster for static sites, but lacks built-in API routes needed for AI video app processing.
- Full backend first: unnecessary until the core workflow proves demand.
- No-code platform: fast to prototype but limits customization for 30-second product showcase videos with text overlays, background music, and transitions.
