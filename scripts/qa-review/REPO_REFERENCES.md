# REPO_REFERENCES.md

## Reference Policy
Repo references are URLs and implementation inspiration only. Do not clone repositories automatically. Do not copy source code without license review and explicit user approval.

## Recommended References
- **Next.js** (use now): https://github.com/vercel/next.js
  - Why useful: Full-stack React app with App Router and Vercel deployment — fits the AI video app build path.
  - How AI should use it: Use Next.js App Router with typed data models and build-safe environment access.
  - Use as: install. Vercel free tier can run many MVPs; serverless usage can grow with traffic.
- **shadcn/ui** (use now): https://github.com/shadcn-ui/ui
  - Why useful: Accessible UI components for React apps — fits the AI video app build path.
  - How AI should use it: Build the UI with shadcn-style components, lucide icons, and compact responsive layouts.
  - Use as: install. No runtime service cost.
- **Codex CLI** (use now): https://github.com/openai/codex
  - Why useful: Helps turn the generated kit into controlled implementation work.
  - How AI should use it: Read AGENTS.md, PROJECT_BRIEF.md, and TASKS.md, then implement the next task with tests.
  - Use as: external-tool. Costs depend on the configured model/provider, not the CLI repository.
- **Cline** (use now): https://github.com/cline/cline
  - Why useful: Helps turn the generated kit into controlled implementation work.
  - How AI should use it: Use the generated TASKS.md and implement one milestone at a time with concise diffs.
  - Use as: external-tool. Model spend is controlled by the user's configured provider.
- **Cursor** (use now): https://www.cursor.com/
  - Why useful: Helps turn the generated kit into controlled implementation work.
  - How AI should use it: Read .cursorrules, PROJECT_BRIEF.md, and TASKS.md, then implement the next small task.
  - Use as: external-tool. Subscription or model costs are external to the generated app.
- **Claude Code** (use now): https://www.anthropic.com/claude-code
  - Why useful: Helps turn the generated kit into controlled implementation work.
  - How AI should use it: Read CLAUDE.md, PROJECT_BRIEF.md, and TASKS.md. Preserve local-first behavior and verify changes.
  - Use as: external-tool. Costs depend on the user's Claude plan or configured account.
- **Zod** (use now): https://github.com/colinhacks/zod
  - Why useful: TypeScript-first schema validation — fits the AI video app build path.
  - How AI should use it: Use Zod for all API input validation and form schema definitions.
  - Use as: install. Free.
- **React Hook Form** (use now): https://github.com/react-hook-form/react-hook-form
  - Why useful: Performant form management with validation — fits the AI video app build path.
  - How AI should use it: Use React Hook Form with Zod resolver for type-safe form validation.
  - Use as: install. Free.
- **Sharp** (use now): https://github.com/lovell/sharp
  - Why useful: High-performance image processing for Node.js — fits the AI video app build path.
  - How AI should use it: Use Sharp for server-side image optimization and thumbnail generation.
  - Use as: install. Free.
- **Cloudinary** (use now): https://cloudinary.com/
  - Why useful: Cloud-based image and video management — fits the AI video app build path.
  - How AI should use it: Use Cloudinary for image CDN with on-the-fly transformations.
  - Use as: external-tool. Free tier; paid for bandwidth.
- **Trigger.dev** (use now): https://github.com/triggerdotdev/trigger.dev
  - Why useful: Background jobs and scheduled tasks for serverless — fits the AI video app build path.
  - How AI should use it: Use Trigger.dev for background job processing and scheduled tasks.
  - Use as: install. Free tier available.
- **Inngest** (use now): https://github.com/inngest/inngest
  - Why useful: Event-driven serverless functions and workflows — fits the AI video app build path.
  - How AI should use it: Use Inngest for event-driven background workflows with retry and scheduling.
  - Use as: install. Free tier; paid for production.
- **Medusa** (use now): https://github.com/medusajs/medusa
  - Why useful: Open-source headless commerce engine — fits the AI video app build path.
  - How AI should use it: Use Medusa for headless commerce with Next.js storefront.
  - Use as: install. Free; hosting and infrastructure costs apply.
- **Stripe** (use now): https://github.com/stripe/stripe-node
  - Why useful: Payment processing, subscriptions, and billing — fits the AI video app build path.
  - How AI should use it: Add Stripe Checkout for subscription billing with webhook-based status sync.
  - Use as: install. 2.9% + 30¢ per transaction.
- **Meilisearch** (use now): https://github.com/meilisearch/meilisearch
  - Why useful: Fast full-text search engine — fits the AI video app build path.
  - How AI should use it: Add Meilisearch for instant product search with faceted filters.
  - Use as: install. Free self-hosted; cloud has paid tiers.
- **Vercel AI SDK** (use now): https://github.com/vercel/ai
  - Why useful: Streaming AI responses in Next.js apps — fits the AI video app build path.
  - How AI should use it: Use Vercel AI SDK for streaming chat completions with provider-agnostic hooks.
  - Use as: install. SDK is free; model API calls cost per token.
- **LangChain.js** (use now): https://github.com/langchain-ai/langchainjs
  - Why useful: LLM chains, RAG pipelines, and tool-calling agents — fits the AI video app build path.
  - How AI should use it: Use LangChain for RAG pipeline with document loading, splitting, embedding, and retrieval.
  - Use as: install. Free SDK; model and vector DB costs vary.
- **OpenAI Node SDK** (use now): https://github.com/openai/openai-node
  - Why useful: Direct OpenAI and OpenAI-compatible API access — fits the AI video app build path.
  - How AI should use it: Use OpenAI SDK for server-side completions with structured output and function calling.
  - Use as: install. Pay-per-token based on model.
- **Google GenAI SDK** (use now): https://github.com/google-gemini/generative-ai-js
  - Why useful: Access Gemini models from JavaScript/TypeScript — fits the AI video app build path.
  - How AI should use it: Use Google GenAI SDK for Gemini completions with multimodal input support.
  - Use as: install. Gemini Flash is very cheap; Pro costs more.
- **Superpowers** (use now): https://github.com/obra/superpowers
  - Why useful: Helps turn the generated kit into controlled implementation work.
  - How AI should use it: Adopt a skill-based workflow and keep each implementation step small, verified, and documented.
  - Use as: external-tool. No direct app runtime cost.

## GitHub Discovery URLs
Use these if the built-in repo map does not match the user's exact niche:
- https://github.com/search?q=AI%20video%20app%20AI%20video%20app%20for%20small%20shops%20that%20generates%20product%20showcase%20videos%20from%20product%20photos%20and%20descriptions%20Next.js%20Supabase%20github&type=repositories&s=stars&o=desc
- https://github.com/search?q=AI%20video%20app%20Next.js%20SaaS%20starter&type=repositories&s=stars&o=desc
- https://github.com/search?q=AI%20video%20app%20AI%20app%20template&type=repositories&s=stars&o=desc

## Agent Discovery Prompt
Find 5 reference repositories for this product idea. Use them only for architecture inspiration, package choices, and implementation patterns. Do not clone or copy code unless the user explicitly approves license review and code reuse.

## How The Coding Agent Should Use Repo URLs
- Read README/docs for patterns.
- Extract architecture ideas, not source code.
- Prefer official package installation over copying files.
- Keep the generated product's scope smaller than the reference repo.
