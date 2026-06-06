import type { ProjectInput, RepoRecommendation, RepoTool } from "@/types/vibeforge";

export const repoTools: RepoTool[] = [
  {
    id: "codex-cli",
    name: "Codex CLI",
    url: "https://github.com/openai/codex",
    category: "Agent workflow",
    useCase: "Main coding agent and terminal coding workflow",
    whenToUse: "Use when the user wants a repo-aware coding agent that can inspect, edit, and verify a local project.",
    whenNotToUse: "Do not copy it into the app or treat it as app source code.",
    howToUse: "external-tool",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Keep project instructions explicit and never paste secrets into prompts.",
    costNotes: "Costs depend on the configured model/provider, not the CLI repository.",
    suggestedPrompt: "Read AGENTS.md, PROJECT_BRIEF.md, and TASKS.md, then implement the next task with tests.",
    tags: ["agent", "codex", "workflow"],
  },
  {
    id: "cline",
    name: "Cline",
    url: "https://github.com/cline/cline",
    category: "Agent workflow",
    useCase: "IDE agent in VS Code",
    whenToUse: "Use when the builder prefers a visual IDE workflow with file-level changes and approvals.",
    whenNotToUse: "Do not bundle it into a product; it is an external developer tool.",
    howToUse: "external-tool",
    difficulty: "easy",
    productionReadiness: "high",
    riskNotes: "Review file changes before accepting them.",
    costNotes: "Model spend is controlled by the user's configured provider.",
    suggestedPrompt: "Use the generated TASKS.md and implement one milestone at a time with concise diffs.",
    tags: ["agent", "ide", "workflow"],
  },
  {
    id: "cursor",
    name: "Cursor",
    url: "https://www.cursor.com/",
    category: "Agent workflow",
    useCase: "AI-first code editor for project kit implementation",
    whenToUse: "Use when the builder wants editor-native AI changes guided by .cursorrules and task files.",
    whenNotToUse: "Do not depend on it at runtime or require it for users of the generated product.",
    howToUse: "external-tool",
    difficulty: "easy",
    productionReadiness: "high",
    riskNotes: "Keep secrets out of prompts and review broad file edits before accepting them.",
    costNotes: "Subscription or model costs are external to the generated app.",
    suggestedPrompt: "Read .cursorrules, PROJECT_BRIEF.md, and TASKS.md, then implement the next small task.",
    tags: ["agent", "ide", "cursor", "workflow"],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    url: "https://www.anthropic.com/claude-code",
    category: "Agent workflow",
    useCase: "Terminal coding agent using CLAUDE.md project instructions",
    whenToUse: "Use when the team prefers a terminal coding agent with persistent project memory.",
    whenNotToUse: "Do not make it part of the app runtime or require it for the core product flow.",
    howToUse: "external-tool",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Review commands and file changes before approving tool execution.",
    costNotes: "Costs depend on the user's Claude plan or configured account.",
    suggestedPrompt: "Read CLAUDE.md, PROJECT_BRIEF.md, and TASKS.md. Preserve local-first behavior and verify changes.",
    tags: ["agent", "claude", "workflow"],
  },
  {
    id: "superpowers",
    name: "Superpowers",
    url: "https://github.com/obra/superpowers",
    category: "Agent methodology",
    useCase: "Agentic development methodology and skills",
    whenToUse: "Use as workflow instructions to improve agent planning, execution, and verification discipline.",
    whenNotToUse: "Do not treat it as a runtime dependency for the generated product.",
    howToUse: "external-tool",
    difficulty: "medium",
    productionReadiness: "medium",
    riskNotes: "Adapt the process to the repo instead of blindly importing every instruction.",
    costNotes: "No direct app runtime cost.",
    suggestedPrompt: "Adopt a skill-based workflow and keep each implementation step small, verified, and documented.",
    tags: ["agent", "skills", "workflow"],
  },
  {
    id: "openhands",
    name: "OpenHands",
    url: "https://github.com/OpenHands/OpenHands",
    category: "Agent platform",
    useCase: "AI software engineering agent platform",
    whenToUse: "Use as a reference or advanced orchestration path for teams that need a broader agent platform.",
    whenNotToUse: "Avoid for simple local-first MVPs unless the team has ops capacity.",
    howToUse: "reference-only",
    difficulty: "hard",
    productionReadiness: "medium",
    riskNotes: "Self-hosting and permissions need careful review.",
    costNotes: "Infrastructure plus model costs can exceed a simple CLI workflow.",
    suggestedPrompt: "Evaluate whether OpenHands is needed after the MVP has repeatable build tasks.",
    tags: ["agent", "orchestration"],
  },
  {
    id: "shadcn-ui",
    name: "shadcn/ui",
    url: "https://github.com/shadcn-ui/ui",
    category: "UI",
    useCase: "Accessible UI components for React apps",
    whenToUse: "Use when building a polished SaaS, dashboard, settings, or form-heavy interface.",
    whenNotToUse: "Avoid if the project is static content with almost no interface surface.",
    howToUse: "install",
    difficulty: "easy",
    productionReadiness: "high",
    riskNotes: "Components are copied into the repo, so keep them maintained.",
    costNotes: "No runtime service cost.",
    suggestedPrompt: "Build the UI with shadcn-style components, lucide icons, and compact responsive layouts.",
    tags: ["ui", "nextjs", "dashboard", "saas", "video"],
  },
  {
    id: "supabase",
    name: "Supabase",
    url: "https://github.com/supabase/supabase",
    category: "Backend",
    useCase: "Auth, Postgres database, storage, and edge functions",
    whenToUse: "Use when the app needs users, persistent projects, files, or collaborative data.",
    whenNotToUse: "Avoid requiring it for a purely local prototype.",
    howToUse: "install",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Row-level security policies must be tested before launch.",
    costNotes: "Free tier can carry MVPs; storage and auth usage may add cost.",
    suggestedPrompt: "Add Supabase only after the local-first flow works, then map local types to Postgres tables.",
    tags: ["backend", "database", "auth", "saas", "dashboard", "internal tool", "video"],
  },
  {
    id: "n8n",
    name: "n8n",
    url: "https://github.com/n8n-io/n8n",
    category: "Automation",
    useCase: "Automation workflows",
    whenToUse: "Use for CRM, notification, content pipeline, and agency automation workflows.",
    whenNotToUse: "Avoid embedding it inside the app unless workflow execution is core to the product.",
    howToUse: "import-workflow",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Webhook auth and data retention need explicit setup.",
    costNotes: "Cloud or self-hosted infrastructure cost depends on volume.",
    suggestedPrompt: "Design n8n workflows as external integrations with webhook contracts and retry notes.",
    tags: ["automation", "n8n", "workflow", "content", "ecommerce", "internal tool"],
  },
  {
    id: "remotion",
    name: "Remotion",
    url: "https://github.com/remotion-dev/remotion",
    category: "Video",
    useCase: "Video rendering with React",
    whenToUse: "Use when the app needs deterministic programmatic video generation, previews, or rendering queues.",
    whenNotToUse: "Avoid for a first MVP that only generates scripts, captions, and prompts.",
    howToUse: "install",
    difficulty: "hard",
    productionReadiness: "high",
    riskNotes: "Rendering workloads need queueing, storage, and cost controls.",
    costNotes: "Video rendering can create compute and storage costs.",
    suggestedPrompt: "Add Remotion as a phase-two video renderer after validating script and content-plan demand.",
    tags: ["video", "react", "ai video app"],
  },
  {
    id: "videosos",
    name: "VideoSOS",
    url: "https://github.com/timoncool/videosos",
    category: "Video reference",
    useCase: "AI video editor architecture reference",
    whenToUse: "Use as reference for product architecture, editor concepts, and pipeline decomposition.",
    whenNotToUse: "Do not clone into the MVP unless intentionally adopting its license and architecture.",
    howToUse: "reference-only",
    difficulty: "hard",
    productionReadiness: "medium",
    riskNotes: "Review license and dependencies before any code reuse.",
    costNotes: "Reference-only has no direct cost.",
    suggestedPrompt: "Review this repo for architecture patterns only, then design a smaller MVP-specific flow.",
    tags: ["video", "reference", "ai video app"],
  },
  {
    id: "storygen-atelier",
    name: "StoryGen-Atelier",
    url: "https://github.com/0xsline/StoryGen-Atelier",
    category: "Video reference",
    useCase: "Storyboard to AI video pipeline reference",
    whenToUse: "Use to study storyboard, scene, and generation pipeline patterns.",
    whenNotToUse: "Avoid copying code into a commercial MVP without license review.",
    howToUse: "reference-only",
    difficulty: "hard",
    productionReadiness: "medium",
    riskNotes: "Reference workflow ideas rather than implementation details.",
    costNotes: "Reference-only has no direct cost.",
    suggestedPrompt: "Extract scene planning concepts, not source code, and map them to the generated app scope.",
    tags: ["video", "storyboard", "ai video app"],
  },
  {
    id: "short-video-maker",
    name: "short-video-maker",
    url: "https://github.com/gyoridavid/short-video-maker",
    category: "Video reference",
    useCase: "Faceless short video automation with Remotion, FFmpeg, TTS, and captions",
    whenToUse: "Use as a reference or fork candidate for short-video automation workflows.",
    whenNotToUse: "Do not start here for a prompt-and-plan MVP aimed at non-technical users.",
    howToUse: "reference-only",
    difficulty: "medium",
    productionReadiness: "medium",
    riskNotes: "Validate licenses for media, fonts, and generated assets.",
    costNotes: "FFmpeg compute and TTS generation can add cost.",
    suggestedPrompt: "Use this as a reference for future rendering workflows after the planning app ships.",
    tags: ["video", "ffmpeg", "captions", "ai video app"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    url: "https://github.com/vercel/next.js",
    category: "Framework",
    useCase: "Full-stack React app with App Router and Vercel deployment",
    whenToUse: "Use for SaaS, dashboards, AI tools, and apps that need routes and API endpoints.",
    whenNotToUse: "Avoid for tiny static tools where Vite is enough.",
    howToUse: "install",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Keep server actions free of hardcoded secrets.",
    costNotes: "Vercel free tier can run many MVPs; serverless usage can grow with traffic.",
    suggestedPrompt: "Use Next.js App Router with typed data models and build-safe environment access.",
    tags: ["nextjs", "saas", "dashboard", "video", "ai tool"],
  },
  {
    id: "ffmpeg",
    name: "FFmpeg",
    url: "https://ffmpeg.org/",
    category: "Video",
    useCase: "Video/audio processing, clipping, transcoding, and caption burn-in",
    whenToUse: "Use when generated assets need real media processing.",
    whenNotToUse: "Avoid in the first MVP if the product only outputs scripts and prompts.",
    howToUse: "external-tool",
    difficulty: "hard",
    productionReadiness: "high",
    riskNotes: "Serverless runtime support and licensing details must be checked.",
    costNotes: "Compute-heavy media processing needs cost controls.",
    suggestedPrompt: "Keep FFmpeg as a future processing service until user demand for rendered files is proven.",
    tags: ["video", "ffmpeg", "media"],
  },
  {
    id: "shopify-api",
    name: "Shopify Admin API",
    url: "https://shopify.dev/docs/api/admin",
    category: "Commerce",
    useCase: "Store catalog and product listing integration",
    whenToUse: "Use after a human-reviewed product-copy workflow is validated and store permissions are clear.",
    whenNotToUse: "Avoid for an MVP that only needs exportable listing drafts or CSV output.",
    howToUse: "external-tool",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Store write permissions, rate limits, and merchant approval need careful handling.",
    costNotes: "API usage is usually tied to the merchant store and app hosting costs.",
    suggestedPrompt: "Keep Shopify integration behind an explicit use-later milestone with review before writeback.",
    tags: ["ecommerce", "commerce", "shopify"],
  },
  {
    id: "airtable",
    name: "Airtable",
    url: "https://airtable.com/developers/web/api/introduction",
    category: "Operations",
    useCase: "Lightweight operational database and approval queue",
    whenToUse: "Use as an external workflow destination for content, commerce, or internal-tool approvals.",
    whenNotToUse: "Avoid as the system of record when the product needs strong relational constraints.",
    howToUse: "external-tool",
    difficulty: "easy",
    productionReadiness: "medium",
    riskNotes: "API limits and permission boundaries should be documented before production use.",
    costNotes: "Free tier can work for prototypes; team usage can require paid plans.",
    suggestedPrompt: "Model Airtable as an optional external approval queue, not a required MVP dependency.",
    tags: ["content", "automation", "internal tool", "operations"],
  },
  {
    id: "playwright",
    name: "Playwright",
    url: "https://github.com/microsoft/playwright",
    category: "Testing",
    useCase: "End-to-end checks for builder, history, settings, and exports",
    whenToUse: "Use after the main MVP flow exists and needs repeatable browser verification.",
    whenNotToUse: "Avoid making broad browser coverage the first task before the core workflow is stable.",
    howToUse: "install",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Keep tests focused on user outcomes rather than fragile visual details.",
    costNotes: "No service cost; CI runtime grows with browser and viewport coverage.",
    suggestedPrompt: "Add Playwright tests for generation, history navigation, exports, settings, and repo recommendations.",
    tags: ["testing", "qa", "mcp", "saas", "dashboard", "internal tool"],
  },
  // --- AI / LLM SDKs ---
  { id: "vercel-ai-sdk", name: "Vercel AI SDK", url: "https://github.com/vercel/ai", category: "AI SDK", useCase: "Streaming AI responses in Next.js apps", whenToUse: "Use when building chat, completion, or structured generation UIs in Next.js.", whenNotToUse: "Avoid if the app has no AI-powered UI.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Provider costs depend on model choice.", costNotes: "SDK is free; model API calls cost per token.", suggestedPrompt: "Use Vercel AI SDK for streaming chat completions with provider-agnostic hooks.", tags: ["ai", "nextjs", "streaming", "llm"] },
  { id: "langchain-js", name: "LangChain.js", url: "https://github.com/langchain-ai/langchainjs", category: "AI SDK", useCase: "LLM chains, RAG pipelines, and tool-calling agents", whenToUse: "Use for complex multi-step AI workflows, RAG, or tool-use patterns.", whenNotToUse: "Avoid for simple single-prompt completions where Vercel AI SDK suffices.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Large dependency tree; pin versions carefully.", costNotes: "Free SDK; model and vector DB costs vary.", suggestedPrompt: "Use LangChain for RAG pipeline with document loading, splitting, embedding, and retrieval.", tags: ["ai", "rag", "agents", "llm"] },
  { id: "llamaindex-ts", name: "LlamaIndex.TS", url: "https://github.com/run-llama/LlamaIndexTS", category: "AI SDK", useCase: "Data ingestion and RAG framework for TypeScript", whenToUse: "Use when building knowledge bases or document Q&A apps.", whenNotToUse: "Avoid for simple chat apps without document retrieval.", howToUse: "install", difficulty: "medium", productionReadiness: "medium", riskNotes: "Evolving API surface; check compatibility.", costNotes: "Free SDK; embedding and LLM costs apply.", suggestedPrompt: "Use LlamaIndex for document ingestion, indexing, and retrieval-augmented generation.", tags: ["ai", "rag", "documents", "llm"] },
  { id: "openai-node", name: "OpenAI Node SDK", url: "https://github.com/openai/openai-node", category: "AI SDK", useCase: "Direct OpenAI and OpenAI-compatible API access", whenToUse: "Use for direct API calls to OpenAI, Azure, or compatible providers.", whenNotToUse: "Prefer Vercel AI SDK for streaming UI; use this for server-side batch work.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Keep API keys server-side only.", costNotes: "Pay-per-token based on model.", suggestedPrompt: "Use OpenAI SDK for server-side completions with structured output and function calling.", tags: ["ai", "openai", "llm", "api"] },
  { id: "google-genai", name: "Google GenAI SDK", url: "https://github.com/google-gemini/generative-ai-js", category: "AI SDK", useCase: "Access Gemini models from JavaScript/TypeScript", whenToUse: "Use when targeting Gemini models directly without OpenRouter.", whenNotToUse: "Avoid if already using OpenRouter or Vercel AI SDK with Gemini provider.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Free tier has rate limits; production needs billing.", costNotes: "Gemini Flash is very cheap; Pro costs more.", suggestedPrompt: "Use Google GenAI SDK for Gemini completions with multimodal input support.", tags: ["ai", "gemini", "google", "llm"] },
  // --- Agent Frameworks ---
  { id: "crewai", name: "CrewAI", url: "https://github.com/crewAIInc/crewAI", category: "Agent framework", useCase: "Multi-agent orchestration with role-based agents", whenToUse: "Use as reference for multi-agent architecture patterns.", whenNotToUse: "Do not embed in a simple MVP; use as architecture reference only.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "medium", riskNotes: "Python-based; reference architecture only for JS projects.", costNotes: "No direct cost as reference.", suggestedPrompt: "Study CrewAI for multi-agent patterns; implement equivalent in TypeScript if needed.", tags: ["agent", "multi-agent", "orchestration"] },
  { id: "autogen", name: "AutoGen", url: "https://github.com/microsoft/autogen", category: "Agent framework", useCase: "Microsoft multi-agent conversation framework", whenToUse: "Use as reference for agent conversation patterns and group chat architectures.", whenNotToUse: "Do not install directly; Python-based reference only.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "medium", riskNotes: "Python ecosystem; extract patterns only.", costNotes: "Reference-only has no direct cost.", suggestedPrompt: "Review AutoGen for multi-agent conversation patterns to inform your agent architecture.", tags: ["agent", "microsoft", "multi-agent"] },
  { id: "mastra", name: "Mastra", url: "https://github.com/mastra-ai/mastra", category: "Agent framework", useCase: "TypeScript AI agent framework with tool-calling and workflows", whenToUse: "Use when building TypeScript agents with structured tool calling.", whenNotToUse: "Avoid for simple completion tasks; overkill for basic AI features.", howToUse: "install", difficulty: "medium", productionReadiness: "medium", riskNotes: "Newer framework; evaluate stability before production.", costNotes: "Free SDK; model costs apply.", suggestedPrompt: "Use Mastra for TypeScript agent workflows with typed tool definitions.", tags: ["agent", "typescript", "tools", "workflow"] },
  // --- Auth ---
  { id: "next-auth", name: "NextAuth.js / Auth.js", url: "https://github.com/nextauthjs/next-auth", category: "Auth", useCase: "Authentication for Next.js with OAuth, credentials, and magic links", whenToUse: "Use when building auth without Supabase or when needing flexible provider support.", whenNotToUse: "Avoid if already using Supabase Auth or Clerk.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Session management needs careful configuration.", costNotes: "Free and self-hosted.", suggestedPrompt: "Add NextAuth with Google and GitHub OAuth providers for the Next.js app.", tags: ["auth", "nextjs", "oauth", "saas"] },
  { id: "clerk", name: "Clerk", url: "https://clerk.com/", category: "Auth", useCase: "Drop-in auth UI with user management dashboard", whenToUse: "Use when you want auth working in minutes with minimal code.", whenNotToUse: "Avoid if you need full data ownership or are already using Supabase Auth.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Vendor lock-in for user data; review pricing tiers.", costNotes: "Free tier for dev; paid for production features.", suggestedPrompt: "Integrate Clerk for instant auth with pre-built sign-in/up components.", tags: ["auth", "saas", "dashboard"] },
  { id: "lucia-auth", name: "Lucia Auth", url: "https://github.com/lucia-auth/lucia", category: "Auth", useCase: "Lightweight, flexible auth library for any framework", whenToUse: "Use when you want full control over auth without a heavy framework.", whenNotToUse: "Avoid if you prefer managed auth like Clerk or Supabase.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Requires manual session and token management.", costNotes: "Free and self-hosted.", suggestedPrompt: "Use Lucia for lightweight session-based auth with database adapter.", tags: ["auth", "lightweight", "sessions"] },
  // --- Database / ORM ---
  { id: "prisma", name: "Prisma", url: "https://github.com/prisma/prisma", category: "Database", useCase: "Type-safe ORM for PostgreSQL, MySQL, SQLite", whenToUse: "Use when building with relational databases and wanting type-safe queries.", whenNotToUse: "Avoid if using Supabase client directly or for simple key-value storage.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Migration management needs CI/CD integration.", costNotes: "Free ORM; database hosting costs vary.", suggestedPrompt: "Define Prisma schema with models, relations, and run prisma generate for type-safe client.", tags: ["database", "orm", "postgres", "saas", "dashboard"] },
  { id: "drizzle", name: "Drizzle ORM", url: "https://github.com/drizzle-team/drizzle-orm", category: "Database", useCase: "Lightweight TypeScript ORM with SQL-like syntax", whenToUse: "Use when you want a thinner ORM closer to raw SQL with full type safety.", whenNotToUse: "Avoid if team prefers Prisma's schema-first approach.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Migration tooling is separate (drizzle-kit).", costNotes: "Free ORM; database costs vary.", suggestedPrompt: "Use Drizzle ORM with PostgreSQL for type-safe queries with SQL-like builder.", tags: ["database", "orm", "postgres", "lightweight"] },
  { id: "upstash-redis", name: "Upstash Redis", url: "https://github.com/upstash/upstash-redis", category: "Database", useCase: "Serverless Redis for caching, rate limiting, and queues", whenToUse: "Use for caching, session storage, rate limiting in serverless environments.", whenNotToUse: "Avoid as primary database; use for caching and ephemeral data.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Data is ephemeral by design; don't store critical state.", costNotes: "Free tier available; pay per request after.", suggestedPrompt: "Use Upstash Redis for API rate limiting and response caching.", tags: ["database", "redis", "caching", "serverless"] },
  // --- UI / Design System ---
  { id: "radix-ui", name: "Radix UI", url: "https://github.com/radix-ui/primitives", category: "UI", useCase: "Unstyled accessible UI primitives for React", whenToUse: "Use as the foundation under shadcn/ui or for custom accessible components.", whenNotToUse: "Avoid if already using shadcn/ui which wraps Radix.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Unstyled by default; needs your own design system.", costNotes: "Free.", suggestedPrompt: "Use Radix primitives for accessible dialog, dropdown, and tooltip components.", tags: ["ui", "accessibility", "react"] },
  { id: "framer-motion", name: "Framer Motion", url: "https://github.com/framer/motion", category: "UI", useCase: "Production-ready animations for React", whenToUse: "Use for page transitions, micro-animations, and interactive UI.", whenNotToUse: "Avoid for static content with no animation needs.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Bundle size grows with animation complexity.", costNotes: "Free.", suggestedPrompt: "Add Framer Motion for page transitions, list animations, and interactive hover effects.", tags: ["ui", "animation", "react"] },
  { id: "react-email", name: "React Email", url: "https://github.com/resend/react-email", category: "UI", useCase: "Build emails with React components", whenToUse: "Use when building transactional or marketing emails in a React project.", whenNotToUse: "Avoid if the app has no email sending needs.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Email client rendering varies; test across clients.", costNotes: "Free library; email sending service costs extra.", suggestedPrompt: "Use React Email to build transactional email templates with Resend for sending.", tags: ["ui", "email", "saas"] },
  { id: "tanstack-table", name: "TanStack Table", url: "https://github.com/TanStack/table", category: "UI", useCase: "Headless table with sorting, filtering, pagination", whenToUse: "Use for data-heavy dashboards, admin panels, and list views.", whenNotToUse: "Avoid for simple lists that don't need sorting/filtering.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Headless; requires UI wrapper implementation.", costNotes: "Free.", suggestedPrompt: "Use TanStack Table for sortable, filterable data tables in the dashboard.", tags: ["ui", "table", "dashboard", "saas", "internal tool"] },
  { id: "recharts", name: "Recharts", url: "https://github.com/recharts/recharts", category: "UI", useCase: "Composable chart library for React", whenToUse: "Use for dashboards and analytics views with bar, line, pie charts.", whenNotToUse: "Avoid if the app has no data visualization needs.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Performance degrades with very large datasets.", costNotes: "Free.", suggestedPrompt: "Use Recharts for dashboard analytics with bar charts, line charts, and area charts.", tags: ["ui", "charts", "dashboard", "saas", "analytics"] },
  { id: "dnd-kit", name: "dnd kit", url: "https://github.com/clauderic/dnd-kit", category: "UI", useCase: "Drag and drop for React with accessibility", whenToUse: "Use for kanban boards, sortable lists, and drag-to-reorder UIs.", whenNotToUse: "Avoid if the UI has no drag-and-drop requirements.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Accessibility needs keyboard support testing.", costNotes: "Free.", suggestedPrompt: "Use dnd kit for kanban board drag-and-drop with sortable columns and cards.", tags: ["ui", "drag-drop", "kanban", "dashboard"] },
  { id: "react-flow", name: "React Flow", url: "https://github.com/xyflow/xyflow", category: "UI", useCase: "Node-based graph editor for workflows and diagrams", whenToUse: "Use for workflow builders, pipeline editors, and visual graph UIs.", whenNotToUse: "Avoid if the app has no graph/workflow visualization.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Pro features require license for commercial use.", costNotes: "Free for open source; pro license for commercial.", suggestedPrompt: "Use React Flow for visual workflow builder with draggable nodes and edges.", tags: ["ui", "workflow", "graph", "automation", "n8n"] },
  { id: "react-hook-form", name: "React Hook Form", url: "https://github.com/react-hook-form/react-hook-form", category: "UI", useCase: "Performant form management with validation", whenToUse: "Use for any form-heavy app with complex validation needs.", whenNotToUse: "Avoid only for extremely simple single-input forms.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Combine with Zod for runtime type-safe validation.", costNotes: "Free.", suggestedPrompt: "Use React Hook Form with Zod resolver for type-safe form validation.", tags: ["ui", "forms", "validation", "saas", "dashboard"] },
  { id: "zustand", name: "Zustand", url: "https://github.com/pmndrs/zustand", category: "State management", useCase: "Minimal global state management for React", whenToUse: "Use for app-wide state like auth, theme, or cart without Redux complexity.", whenNotToUse: "Avoid if React context or server state (TanStack Query) suffices.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Keep stores small and focused.", costNotes: "Free.", suggestedPrompt: "Use Zustand for lightweight global state with persist middleware for localStorage.", tags: ["state", "react", "saas", "dashboard"] },
  { id: "tanstack-query", name: "TanStack Query", url: "https://github.com/TanStack/query", category: "State management", useCase: "Server state management with caching and refetching", whenToUse: "Use for API data fetching with automatic caching and revalidation.", whenNotToUse: "Avoid if using Next.js server components for all data fetching.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Cache invalidation strategy needs upfront planning.", costNotes: "Free.", suggestedPrompt: "Use TanStack Query for API data fetching with optimistic updates and cache invalidation.", tags: ["state", "api", "caching", "saas", "dashboard"] },
  // --- Deployment / Hosting ---
  { id: "docker", name: "Docker", url: "https://github.com/docker/cli", category: "Deployment", useCase: "Containerized app deployment", whenToUse: "Use for reproducible builds, self-hosting, and CI/CD pipelines.", whenNotToUse: "Avoid for simple Vercel/Netlify deployments.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Container security and image size need management.", costNotes: "Free for dev; hosting costs vary.", suggestedPrompt: "Create multi-stage Dockerfile for production Next.js build.", tags: ["deployment", "docker", "devops"] },
  { id: "terraform", name: "Terraform", url: "https://github.com/hashicorp/terraform", category: "Deployment", useCase: "Infrastructure as code for cloud provisioning", whenToUse: "Use when deploying to AWS/GCP/Azure with repeatable infrastructure.", whenNotToUse: "Avoid for simple PaaS deployments on Vercel or Railway.", howToUse: "external-tool", difficulty: "hard", productionReadiness: "high", riskNotes: "State management requires remote backend.", costNotes: "Free tool; cloud resource costs apply.", suggestedPrompt: "Use Terraform for infrastructure provisioning only after validating on PaaS.", tags: ["deployment", "iac", "devops"] },
  { id: "github-actions", name: "GitHub Actions", url: "https://github.com/features/actions", category: "Deployment", useCase: "CI/CD pipelines for testing, building, and deploying", whenToUse: "Use for automated lint, test, build, and deploy workflows.", whenNotToUse: "Avoid complex self-hosted runners for simple projects.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "Keep secrets in GitHub Secrets, never in workflow files.", costNotes: "Free for public repos; minutes-based for private.", suggestedPrompt: "Set up GitHub Actions for lint, build, test on PR and deploy on merge to main.", tags: ["deployment", "ci-cd", "devops"] },
  { id: "railway", name: "Railway", url: "https://railway.app/", category: "Deployment", useCase: "Simple PaaS for deploying apps and databases", whenToUse: "Use when you need quick deployment with database included.", whenNotToUse: "Avoid if Vercel free tier covers your needs.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "Costs can grow with usage; set spending limits.", costNotes: "Free trial; pay-as-you-go after.", suggestedPrompt: "Deploy to Railway with PostgreSQL for a simple full-stack deployment.", tags: ["deployment", "hosting", "database"] },
  // --- Observability ---
  { id: "sentry", name: "Sentry", url: "https://github.com/getsentry/sentry-javascript", category: "Observability", useCase: "Error tracking and performance monitoring", whenToUse: "Use for production error tracking and performance insights.", whenNotToUse: "Avoid adding before the app has real users.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "PII in error reports needs scrubbing.", costNotes: "Free tier for dev; paid for production volume.", suggestedPrompt: "Add Sentry for error tracking with source maps in production.", tags: ["observability", "errors", "monitoring", "saas"] },
  { id: "posthog", name: "PostHog", url: "https://github.com/PostHog/posthog", category: "Observability", useCase: "Product analytics, feature flags, and session replay", whenToUse: "Use for understanding user behavior and A/B testing.", whenNotToUse: "Avoid before the app has a working product flow.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Privacy compliance needs consent management.", costNotes: "Generous free tier; self-host for full control.", suggestedPrompt: "Add PostHog for event tracking, funnels, and feature flags.", tags: ["observability", "analytics", "saas"] },
  // --- Payments ---
  { id: "stripe", name: "Stripe", url: "https://github.com/stripe/stripe-node", category: "Payments", useCase: "Payment processing, subscriptions, and billing", whenToUse: "Use when the app needs payments, subscriptions, or invoicing.", whenNotToUse: "Avoid in MVP until the free value proposition is validated.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "PCI compliance handled by Stripe; webhook verification is critical.", costNotes: "2.9% + 30¢ per transaction.", suggestedPrompt: "Add Stripe Checkout for subscription billing with webhook-based status sync.", tags: ["payments", "billing", "saas", "ecommerce"] },
  { id: "lemonsqueezy", name: "Lemon Squeezy", url: "https://www.lemonsqueezy.com/", category: "Payments", useCase: "Merchant of record for SaaS and digital products", whenToUse: "Use when you want Stripe simplicity plus tax/VAT handling.", whenNotToUse: "Avoid if you need full Stripe customization.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "Vendor handles tax compliance; review terms.", costNotes: "5% + 50¢ per transaction.", suggestedPrompt: "Integrate Lemon Squeezy for SaaS subscriptions with built-in tax handling.", tags: ["payments", "saas", "digital-products"] },
  // --- E-commerce ---
  { id: "medusa", name: "Medusa", url: "https://github.com/medusajs/medusa", category: "E-commerce", useCase: "Open-source headless commerce engine", whenToUse: "Use when building a custom storefront with full backend control.", whenNotToUse: "Avoid if Shopify hosted meets all needs.", howToUse: "install", difficulty: "hard", productionReadiness: "high", riskNotes: "Self-hosting requires ops capacity.", costNotes: "Free; hosting and infrastructure costs apply.", suggestedPrompt: "Use Medusa for headless commerce with Next.js storefront.", tags: ["ecommerce", "headless", "commerce"] },
  { id: "saleor", name: "Saleor", url: "https://github.com/saleor/saleor", category: "E-commerce", useCase: "GraphQL-first headless commerce platform", whenToUse: "Use as architecture reference for GraphQL commerce.", whenNotToUse: "Avoid if team lacks Python/Django backend experience.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Python backend; reference patterns only for JS projects.", costNotes: "Free; self-hosting costs apply.", suggestedPrompt: "Study Saleor for GraphQL commerce API patterns.", tags: ["ecommerce", "graphql", "reference"] },
  // --- Mobile ---
  { id: "expo", name: "Expo", url: "https://github.com/expo/expo", category: "Mobile", useCase: "React Native framework for cross-platform mobile apps", whenToUse: "Use when extending a web app to iOS/Android.", whenNotToUse: "Avoid if web-only is sufficient for the MVP.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Native module compatibility varies.", costNotes: "Free SDK; EAS Build has paid tiers.", suggestedPrompt: "Use Expo with React Native for cross-platform mobile extension of the web app.", tags: ["mobile", "react-native", "cross-platform"] },
  { id: "capacitor", name: "Capacitor", url: "https://github.com/ionic-team/capacitor", category: "Mobile", useCase: "Wrap web apps as native iOS/Android apps", whenToUse: "Use to ship a web app to mobile stores with native access.", whenNotToUse: "Avoid if native performance is critical.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Native plugin compatibility needs testing.", costNotes: "Free.", suggestedPrompt: "Use Capacitor to wrap the Next.js web app for iOS and Android distribution.", tags: ["mobile", "hybrid", "web-to-native"] },
  // --- Browser Automation ---
  { id: "puppeteer", name: "Puppeteer", url: "https://github.com/puppeteer/puppeteer", category: "Browser automation", useCase: "Headless Chrome for scraping, PDF generation, and testing", whenToUse: "Use for server-side PDF/screenshot generation or web scraping.", whenNotToUse: "Prefer Playwright for E2E testing.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Memory-intensive; needs resource limits.", costNotes: "Free; compute costs for serverless.", suggestedPrompt: "Use Puppeteer for server-side PDF invoice generation.", tags: ["browser", "automation", "scraping", "pdf"] },
  { id: "browserbase", name: "Browserbase", url: "https://github.com/browserbase/sdk-node", category: "Browser automation", useCase: "Cloud browser infrastructure for AI agents", whenToUse: "Use when AI agents need browser access without self-hosting.", whenNotToUse: "Avoid for simple scraping that Puppeteer handles.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "medium", riskNotes: "Cloud dependency; evaluate vendor stability.", costNotes: "Usage-based pricing.", suggestedPrompt: "Use Browserbase for cloud-hosted browser sessions in AI agent workflows.", tags: ["browser", "agent", "cloud"] },
  // --- SaaS Starters ---
  { id: "next-saas-starter", name: "Next.js SaaS Starter", url: "https://github.com/leerob/next-saas-starter", category: "SaaS starter", useCase: "Production SaaS template with auth, billing, and dashboard", whenToUse: "Use as reference architecture for building SaaS products.", whenNotToUse: "Do not clone directly; extract patterns and adapt.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Reference only; adapt to your specific needs.", costNotes: "Free template.", suggestedPrompt: "Study this starter for SaaS patterns: auth flow, billing integration, dashboard layout.", tags: ["saas", "starter", "nextjs", "reference"] },
  { id: "t3-stack", name: "T3 Stack (create-t3-app)", url: "https://github.com/t3-oss/create-t3-app", category: "SaaS starter", useCase: "Full-stack TypeScript starter with tRPC, Prisma, NextAuth", whenToUse: "Use as reference for type-safe full-stack architecture.", whenNotToUse: "Avoid if the app doesn't need tRPC or prefers REST.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Opinionated stack; verify fit before adopting.", costNotes: "Free.", suggestedPrompt: "Reference T3 Stack for type-safe full-stack patterns with tRPC and Prisma.", tags: ["saas", "starter", "trpc", "prisma", "reference"] },
  { id: "supastarter", name: "Supastarter", url: "https://supastarter.dev/", category: "SaaS starter", useCase: "Supabase-based SaaS boilerplate with payments and teams", whenToUse: "Use as reference for Supabase + Stripe + team management patterns.", whenNotToUse: "Do not clone; study patterns for your own implementation.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Paid template; reference architecture only.", costNotes: "One-time license fee.", suggestedPrompt: "Study Supastarter for Supabase auth + Stripe billing integration patterns.", tags: ["saas", "supabase", "payments", "reference"] },
  // --- Automation ---
  { id: "trigger-dev", name: "Trigger.dev", url: "https://github.com/triggerdotdev/trigger.dev", category: "Automation", useCase: "Background jobs and scheduled tasks for serverless", whenToUse: "Use for background processing, cron jobs, and long-running tasks.", whenNotToUse: "Avoid if the app has no background processing needs.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Cloud dependency for managed service.", costNotes: "Free tier available.", suggestedPrompt: "Use Trigger.dev for background job processing and scheduled tasks.", tags: ["automation", "background-jobs", "serverless"] },
  { id: "inngest", name: "Inngest", url: "https://github.com/inngest/inngest", category: "Automation", useCase: "Event-driven serverless functions and workflows", whenToUse: "Use for event-driven background processing in serverless apps.", whenNotToUse: "Avoid if simple cron or queue suffices.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Vendor dependency; evaluate self-hosting option.", costNotes: "Free tier; paid for production.", suggestedPrompt: "Use Inngest for event-driven background workflows with retry and scheduling.", tags: ["automation", "events", "serverless", "workflow"] },
  { id: "bull-mq", name: "BullMQ", url: "https://github.com/taskforcesh/bullmq", category: "Automation", useCase: "Redis-based job queue for Node.js", whenToUse: "Use for reliable background job processing with Redis.", whenNotToUse: "Avoid in serverless; use Trigger.dev or Inngest instead.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Requires persistent Redis instance.", costNotes: "Free library; Redis hosting costs.", suggestedPrompt: "Use BullMQ for reliable background job processing with retry and prioritization.", tags: ["automation", "queue", "redis", "jobs"] },
  // --- Testing ---
  { id: "vitest", name: "Vitest", url: "https://github.com/vitest-dev/vitest", category: "Testing", useCase: "Fast unit and integration testing for Vite/TypeScript projects", whenToUse: "Use for unit tests, component tests, and API route tests.", whenNotToUse: "Use Playwright for E2E browser tests instead.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Ensure test isolation for database tests.", costNotes: "Free.", suggestedPrompt: "Add Vitest for unit and integration tests with coverage reporting.", tags: ["testing", "unit", "typescript"] },
  { id: "testing-library", name: "Testing Library", url: "https://github.com/testing-library/react-testing-library", category: "Testing", useCase: "User-centric React component testing", whenToUse: "Use for testing React components by user behavior.", whenNotToUse: "Avoid for E2E tests; use Playwright.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Focus on user interactions, not implementation details.", costNotes: "Free.", suggestedPrompt: "Use Testing Library for component tests that simulate user interactions.", tags: ["testing", "react", "components"] },
  { id: "msw", name: "MSW (Mock Service Worker)", url: "https://github.com/mswjs/msw", category: "Testing", useCase: "API mocking for tests and development", whenToUse: "Use for mocking API responses in tests and dev without a backend.", whenNotToUse: "Avoid in production builds.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Keep mock data realistic.", costNotes: "Free.", suggestedPrompt: "Use MSW for API mocking in development and testing.", tags: ["testing", "api", "mocking"] },
  // --- Email / Notifications ---
  { id: "resend", name: "Resend", url: "https://github.com/resend/resend-node", category: "Email", useCase: "Developer-friendly email sending API", whenToUse: "Use for transactional emails like welcome, password reset, invoices.", whenNotToUse: "Avoid if the app has no email needs.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Email deliverability requires domain verification.", costNotes: "Free tier: 100 emails/day.", suggestedPrompt: "Use Resend with React Email for transactional email sending.", tags: ["email", "notifications", "saas"] },
  { id: "novu", name: "Novu", url: "https://github.com/novuhq/novu", category: "Notifications", useCase: "Open-source notification infrastructure", whenToUse: "Use for multi-channel notifications (email, SMS, push, in-app).", whenNotToUse: "Avoid for simple single-channel email sending.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Complex setup for multi-channel; start with one channel.", costNotes: "Free tier available.", suggestedPrompt: "Use Novu for unified notification system across email, push, and in-app channels.", tags: ["notifications", "email", "push", "saas"] },
  // --- File Storage ---
  { id: "uploadthing", name: "UploadThing", url: "https://github.com/pingdotgg/uploadthing", category: "Storage", useCase: "File uploads for Next.js apps", whenToUse: "Use for user file uploads with presigned URLs and validation.", whenNotToUse: "Avoid if Supabase Storage covers your needs.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Vendor dependency; evaluate pricing.", costNotes: "Free tier; paid for storage.", suggestedPrompt: "Use UploadThing for file uploads with type-safe route handlers.", tags: ["storage", "uploads", "nextjs"] },
  { id: "minio", name: "MinIO", url: "https://github.com/minio/minio", category: "Storage", useCase: "S3-compatible object storage (self-hosted)", whenToUse: "Use for self-hosted file storage with S3 compatibility.", whenNotToUse: "Avoid for simple projects; use cloud S3 or Supabase Storage.", howToUse: "external-tool", difficulty: "hard", productionReadiness: "high", riskNotes: "Self-hosting requires ops capacity.", costNotes: "Free; hosting infrastructure costs.", suggestedPrompt: "Use MinIO for self-hosted S3-compatible file storage.", tags: ["storage", "s3", "self-hosted"] },
  // --- Search ---
  { id: "meilisearch", name: "Meilisearch", url: "https://github.com/meilisearch/meilisearch", category: "Search", useCase: "Fast full-text search engine", whenToUse: "Use for instant search, faceted filtering, and typo tolerance.", whenNotToUse: "Avoid if simple SQL LIKE queries suffice.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Needs separate hosting; Meilisearch Cloud available.", costNotes: "Free self-hosted; cloud has paid tiers.", suggestedPrompt: "Add Meilisearch for instant product search with faceted filters.", tags: ["search", "fulltext", "ecommerce"] },
  { id: "typesense", name: "Typesense", url: "https://github.com/typesense/typesense", category: "Search", useCase: "Open-source search engine alternative to Algolia", whenToUse: "Use for typo-tolerant instant search with simple setup.", whenNotToUse: "Avoid if Postgres full-text search is sufficient.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Needs hosting; Typesense Cloud available.", costNotes: "Free self-hosted; cloud pricing varies.", suggestedPrompt: "Use Typesense for fast, typo-tolerant search with geo-search support.", tags: ["search", "fulltext", "ecommerce"] },
  // --- CMS ---
  { id: "payload-cms", name: "Payload CMS", url: "https://github.com/payloadcms/payload", category: "CMS", useCase: "Headless CMS with Next.js integration", whenToUse: "Use for content-managed sites, blogs, and marketing pages.", whenNotToUse: "Avoid for pure SaaS apps without editorial content.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Database choice (Postgres/MongoDB) affects deployment.", costNotes: "Free self-hosted; cloud paid.", suggestedPrompt: "Use Payload CMS for content management with Next.js App Router integration.", tags: ["cms", "content", "nextjs"] },
  { id: "sanity", name: "Sanity", url: "https://github.com/sanity-io/sanity", category: "CMS", useCase: "Real-time headless CMS with GROQ query language", whenToUse: "Use for structured content with real-time collaboration.", whenNotToUse: "Avoid if simple Markdown files suffice.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "GROQ has a learning curve.", costNotes: "Free tier; paid for team features.", suggestedPrompt: "Use Sanity for real-time content management with custom schemas.", tags: ["cms", "content", "real-time"] },
  // --- Misc Utilities ---
  { id: "zod", name: "Zod", url: "https://github.com/colinhacks/zod", category: "Validation", useCase: "TypeScript-first schema validation", whenToUse: "Use for API input validation, form validation, and data parsing.", whenNotToUse: "Already included in most starter setups.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "None significant.", costNotes: "Free.", suggestedPrompt: "Use Zod for all API input validation and form schema definitions.", tags: ["validation", "typescript", "forms", "api"] },
  { id: "trpc", name: "tRPC", url: "https://github.com/trpc/trpc", category: "API", useCase: "End-to-end type-safe API without code generation", whenToUse: "Use for type-safe client-server communication in full-stack TypeScript.", whenNotToUse: "Avoid if the API needs to serve non-TypeScript clients.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "TypeScript-only clients; REST/GraphQL better for external APIs.", costNotes: "Free.", suggestedPrompt: "Use tRPC for type-safe API routes between Next.js client and server.", tags: ["api", "typescript", "fullstack"] },
  { id: "jszip", name: "JSZip", url: "https://github.com/Stuk/jszip", category: "Utility", useCase: "Create and extract ZIP files in JavaScript", whenToUse: "Use for file bundle exports and batch downloads.", whenNotToUse: "Avoid for server-side heavy ZIP operations; use Node streams.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Memory usage with large files.", costNotes: "Free.", suggestedPrompt: "Use JSZip for client-side ZIP file generation and download.", tags: ["utility", "export", "files"] },
  { id: "date-fns", name: "date-fns", url: "https://github.com/date-fns/date-fns", category: "Utility", useCase: "Modular date utility library", whenToUse: "Use for date formatting, parsing, and manipulation.", whenNotToUse: "Avoid if native Intl.DateTimeFormat suffices.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Tree-shakeable; import only needed functions.", costNotes: "Free.", suggestedPrompt: "Use date-fns for date formatting and relative time display.", tags: ["utility", "dates"] },
  // --- POS / Business ---
  { id: "odoo", name: "Odoo", url: "https://github.com/odoo/odoo", category: "Business", useCase: "Open-source ERP and POS system", whenToUse: "Use as architecture reference for POS, inventory, and CRM systems.", whenNotToUse: "Do not embed; Python/PostgreSQL based reference only.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Massive codebase; extract specific module patterns.", costNotes: "Free community edition.", suggestedPrompt: "Study Odoo POS module for point-of-sale architecture patterns.", tags: ["pos", "erp", "business", "reference"] },
  { id: "krayin-crm", name: "Krayin CRM", url: "https://github.com/krayin/laravel-crm", category: "Business", useCase: "Open-source CRM built with Laravel", whenToUse: "Use as reference for CRM data models and workflow patterns.", whenNotToUse: "Do not embed; PHP/Laravel based reference only.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "medium", riskNotes: "PHP ecosystem; extract data model patterns only.", costNotes: "Free.", suggestedPrompt: "Study Krayin CRM for customer management and pipeline data models.", tags: ["crm", "business", "reference"] },
  // --- Vector DB ---
  { id: "pinecone", name: "Pinecone", url: "https://www.pinecone.io/", category: "Vector DB", useCase: "Managed vector database for AI embeddings", whenToUse: "Use for RAG, semantic search, and recommendation systems.", whenNotToUse: "Avoid if simple keyword search suffices.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Vendor lock-in; evaluate alternatives.", costNotes: "Free tier; paid for production.", suggestedPrompt: "Use Pinecone for vector storage and similarity search in RAG pipelines.", tags: ["ai", "vector", "rag", "search"] },
  { id: "chromadb", name: "ChromaDB", url: "https://github.com/chroma-core/chroma", category: "Vector DB", useCase: "Open-source embedding database", whenToUse: "Use for local or self-hosted vector search.", whenNotToUse: "Avoid if managed solution like Pinecone fits better.", howToUse: "install", difficulty: "medium", productionReadiness: "medium", riskNotes: "Self-hosting needs capacity planning.", costNotes: "Free self-hosted.", suggestedPrompt: "Use ChromaDB for local vector storage during development.", tags: ["ai", "vector", "rag", "open-source"] },
  // --- Image / Media ---
  { id: "sharp", name: "Sharp", url: "https://github.com/lovell/sharp", category: "Media", useCase: "High-performance image processing for Node.js", whenToUse: "Use for image resizing, format conversion, and optimization.", whenNotToUse: "Avoid in browser; server-side only.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Native bindings may need build tools.", costNotes: "Free.", suggestedPrompt: "Use Sharp for server-side image optimization and thumbnail generation.", tags: ["media", "images", "optimization"] },
  { id: "cloudinary", name: "Cloudinary", url: "https://cloudinary.com/", category: "Media", useCase: "Cloud-based image and video management", whenToUse: "Use for image CDN, transformations, and media optimization.", whenNotToUse: "Avoid if simple local file serving suffices.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "Costs grow with media volume.", costNotes: "Free tier; paid for bandwidth.", suggestedPrompt: "Use Cloudinary for image CDN with on-the-fly transformations.", tags: ["media", "cdn", "images", "video"] },
  // --- Realtime ---
  { id: "socket-io", name: "Socket.IO", url: "https://github.com/socketio/socket.io", category: "Realtime", useCase: "Real-time bidirectional event-based communication", whenToUse: "Use for live chat, notifications, and collaborative features.", whenNotToUse: "Avoid if SSE or polling suffices.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Scaling needs Redis adapter for multi-server.", costNotes: "Free; hosting costs for persistent connections.", suggestedPrompt: "Use Socket.IO for real-time notifications and live updates.", tags: ["realtime", "websocket", "chat"] },
  { id: "pusher", name: "Pusher", url: "https://pusher.com/", category: "Realtime", useCase: "Hosted real-time messaging infrastructure", whenToUse: "Use for real-time features without managing WebSocket servers.", whenNotToUse: "Avoid if self-hosted WebSocket is preferred.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "Vendor dependency; evaluate pricing.", costNotes: "Free tier; paid for scale.", suggestedPrompt: "Use Pusher for managed real-time event broadcasting.", tags: ["realtime", "websocket", "managed"] },
  // --- i18n ---
  { id: "next-intl", name: "next-intl", url: "https://github.com/amannn/next-intl", category: "i18n", useCase: "Internationalization for Next.js App Router", whenToUse: "Use when the app needs multi-language support.", whenNotToUse: "Avoid if the app is single-language only.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Translation management needs workflow.", costNotes: "Free.", suggestedPrompt: "Add next-intl for internationalization with App Router support.", tags: ["i18n", "nextjs", "localization"] },
  // --- Scheduling ---
  { id: "cal-com", name: "Cal.com", url: "https://github.com/calcom/cal.com", category: "Scheduling", useCase: "Open-source scheduling and booking platform", whenToUse: "Use as reference for booking, calendar, and scheduling patterns.", whenNotToUse: "Do not clone; study architecture patterns.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Large codebase; extract scheduling logic only.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Cal.com for scheduling UI patterns and availability management.", tags: ["scheduling", "calendar", "booking", "reference"] },
  // --- PDF ---
  { id: "react-pdf", name: "React PDF", url: "https://github.com/diegomura/react-pdf", category: "PDF", useCase: "Generate PDF documents with React components", whenToUse: "Use for invoice, report, and document generation.", whenNotToUse: "Avoid for simple text exports; use Markdown instead.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Server-side rendering needed for large PDFs.", costNotes: "Free.", suggestedPrompt: "Use React PDF for server-side invoice and report generation.", tags: ["pdf", "documents", "reports"] },
  // --- CLI / Dev Tools ---
  { id: "commander", name: "Commander.js", url: "https://github.com/tj/commander.js", category: "CLI", useCase: "Node.js CLI framework", whenToUse: "Use when building CLI tools or developer utilities.", whenNotToUse: "Avoid for web-only applications.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "None significant.", costNotes: "Free.", suggestedPrompt: "Use Commander.js for building CLI tools with typed arguments.", tags: ["cli", "developer-tools"] },
  { id: "tsx", name: "tsx", url: "https://github.com/privatenumber/tsx", category: "CLI", useCase: "Run TypeScript files directly without compilation", whenToUse: "Use for running scripts, migrations, and dev tools.", whenNotToUse: "Avoid in production; compile TypeScript properly.", howToUse: "install", difficulty: "easy", productionReadiness: "medium", riskNotes: "Dev-only tool; not for production runtime.", costNotes: "Free.", suggestedPrompt: "Use tsx for running TypeScript scripts and database seeds.", tags: ["cli", "typescript", "developer-tools"] },
  // --- Security ---
  { id: "helmet", name: "Helmet", url: "https://github.com/helmetjs/helmet", category: "Security", useCase: "HTTP security headers for Express/Node.js", whenToUse: "Use for setting security headers in Node.js apps.", whenNotToUse: "Next.js handles most headers via next.config; use for custom servers.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Test header compatibility with CDN.", costNotes: "Free.", suggestedPrompt: "Add Helmet for security headers in the Node.js API layer.", tags: ["security", "headers", "api"] },
  { id: "arcjet", name: "Arcjet", url: "https://github.com/arcjet/arcjet-js", category: "Security", useCase: "Rate limiting, bot protection, and email validation", whenToUse: "Use for API protection, bot detection, and abuse prevention.", whenNotToUse: "Avoid if simple rate limiting suffices.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Cloud dependency for detection rules.", costNotes: "Free tier; paid for production.", suggestedPrompt: "Use Arcjet for API rate limiting and bot protection.", tags: ["security", "rate-limiting", "api"] },
  // --- GraphQL ---
  { id: "graphql-yoga", name: "GraphQL Yoga", url: "https://github.com/dotansimha/graphql-yoga", category: "API", useCase: "Fully-featured GraphQL server", whenToUse: "Use when building a GraphQL API.", whenNotToUse: "Avoid if REST or tRPC meets the needs.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Schema design needs upfront planning.", costNotes: "Free.", suggestedPrompt: "Use GraphQL Yoga for a type-safe GraphQL API with code-first schema.", tags: ["api", "graphql", "server"] },
  { id: "urql", name: "urql", url: "https://github.com/urql-graphql/urql", category: "API", useCase: "Lightweight GraphQL client for React", whenToUse: "Use as a lighter alternative to Apollo Client.", whenNotToUse: "Avoid if not using GraphQL.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Exchange-based architecture for customization.", costNotes: "Free.", suggestedPrompt: "Use urql for lightweight GraphQL data fetching in React.", tags: ["api", "graphql", "client", "react"] },
  // --- Monorepo ---
  { id: "turborepo", name: "Turborepo", url: "https://github.com/vercel/turborepo", category: "Monorepo", useCase: "High-performance monorepo build system", whenToUse: "Use when managing multiple packages or apps in one repo.", whenNotToUse: "Avoid for single-app projects.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Workspace configuration needs planning.", costNotes: "Free.", suggestedPrompt: "Use Turborepo for monorepo with shared packages between web and mobile.", tags: ["monorepo", "build", "devops"] },
  // --- Firebase ---
  { id: "firebase", name: "Firebase", url: "https://github.com/firebase/firebase-js-sdk", category: "Backend", useCase: "Google's app platform with auth, database, storage, and hosting", whenToUse: "Use as alternative to Supabase for Google ecosystem.", whenNotToUse: "Avoid if already committed to Supabase.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Vendor lock-in with Google; NoSQL data model.", costNotes: "Generous free tier; pay-as-you-go.", suggestedPrompt: "Use Firebase for auth, Firestore, and storage in Google ecosystem.", tags: ["backend", "auth", "database", "google"] },
  // --- Workflow/BPMN ---
  { id: "temporal", name: "Temporal", url: "https://github.com/temporalio/temporal", category: "Workflow", useCase: "Durable execution platform for reliable workflows", whenToUse: "Use for long-running business processes and saga patterns.", whenNotToUse: "Avoid for simple CRUD apps without complex workflows.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Infrastructure complexity; evaluate managed service.", costNotes: "Free self-hosted; Temporal Cloud paid.", suggestedPrompt: "Study Temporal for durable workflow patterns in distributed systems.", tags: ["workflow", "distributed", "saga", "reference"] },
  { id: "windmill", name: "Windmill", url: "https://github.com/windmill-labs/windmill", category: "Workflow", useCase: "Open-source developer platform for scripts and workflows", whenToUse: "Use for internal tooling and workflow automation.", whenNotToUse: "Avoid if n8n or simple cron jobs suffice.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Self-hosting needs resources.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Windmill for script-based workflow automation patterns.", tags: ["workflow", "automation", "internal tool", "reference"] },
  // --- AI Coding Assistants (3000+ stars) ---
  { id: "aider", name: "Aider", url: "https://github.com/aider-chat/aider", category: "AI Coding", useCase: "Terminal AI pair programmer with Git integration", whenToUse: "Use for AI-assisted code editing with automatic Git commits.", whenNotToUse: "Avoid if IDE-based agent (Cursor/Cline) is preferred.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "Review diffs before accepting commits.", costNotes: "Free tool; model API costs apply.", suggestedPrompt: "Use Aider to implement tasks from TASKS.md with automatic Git commits.", tags: ["ai", "coding", "agent", "git", "terminal"] },
  { id: "open-interpreter", name: "Open Interpreter", url: "https://github.com/OpenInterpreter/open-interpreter", category: "AI Coding", useCase: "LLM-powered local code execution in terminal", whenToUse: "Use for natural language code execution and system automation.", whenNotToUse: "Avoid for production apps; development tool only.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "medium", riskNotes: "Executes code on your machine; use with caution.", costNotes: "Free; model costs apply.", suggestedPrompt: "Use Open Interpreter for rapid prototyping and local automation tasks.", tags: ["ai", "coding", "interpreter", "terminal"] },
  { id: "gemini-cli", name: "Gemini CLI", url: "https://github.com/google-gemini/gemini-cli", category: "AI Coding", useCase: "Google Gemini-powered terminal coding assistant", whenToUse: "Use for Gemini-based code assistance from terminal.", whenNotToUse: "Avoid if already using Codex CLI or Aider.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "Requires Google API key.", costNotes: "Free tier available.", suggestedPrompt: "Use Gemini CLI for code generation and refactoring tasks.", tags: ["ai", "coding", "gemini", "google", "terminal"] },
  { id: "swe-agent", name: "SWE-agent", url: "https://github.com/princeton-nlp/SWE-agent", category: "AI Coding", useCase: "Autonomous software engineering agent for GitHub issues", whenToUse: "Use as reference for autonomous code repair and issue resolution.", whenNotToUse: "Do not embed; research tool for agent patterns.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "medium", riskNotes: "Research project; not production-ready.", costNotes: "Free; model costs apply.", suggestedPrompt: "Study SWE-agent for autonomous issue resolution patterns.", tags: ["ai", "coding", "agent", "autonomous", "reference"] },
  { id: "continue-dev", name: "Continue", url: "https://github.com/continuedev/continue", category: "AI Coding", useCase: "Open-source AI autopilot for VS Code and JetBrains", whenToUse: "Use for IDE-integrated AI coding with any LLM.", whenNotToUse: "Avoid if already using Cursor or Cline.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "Review generated code before accepting.", costNotes: "Free; bring your own model.", suggestedPrompt: "Use Continue for IDE-based AI pair programming with local models.", tags: ["ai", "coding", "ide", "vscode"] },
  { id: "tabby", name: "Tabby", url: "https://github.com/TabbyML/tabby", category: "AI Coding", useCase: "Self-hosted AI coding assistant", whenToUse: "Use for private, self-hosted code completion.", whenNotToUse: "Avoid if cloud-based solutions are acceptable.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Requires GPU for good performance.", costNotes: "Free self-hosted.", suggestedPrompt: "Deploy Tabby for private, self-hosted code completion.", tags: ["ai", "coding", "self-hosted", "completion"] },
  // --- AI Agent Platforms (3000+ stars) ---
  { id: "dify", name: "Dify", url: "https://github.com/langgenius/dify", category: "AI Platform", useCase: "Low-code LLM app and agent development platform", whenToUse: "Use for visual AI workflow building with RAG and agents.", whenNotToUse: "Avoid if code-first approach is preferred.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Self-hosting needs Docker and resources.", costNotes: "Free self-hosted; cloud paid.", suggestedPrompt: "Study Dify for visual AI workflow and RAG pipeline patterns.", tags: ["ai", "platform", "rag", "agents", "low-code", "reference"] },
  { id: "langgraph", name: "LangGraph", url: "https://github.com/langchain-ai/langgraph", category: "AI Agent", useCase: "Stateful agent workflows with LangChain", whenToUse: "Use for production-grade multi-step agent workflows.", whenNotToUse: "Avoid for simple single-turn completions.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Python-first; JS/TS version available.", costNotes: "Free; model costs apply.", suggestedPrompt: "Use LangGraph for stateful agent workflows with checkpointing.", tags: ["ai", "agent", "workflow", "langchain"] },
  { id: "langflow", name: "Langflow", url: "https://github.com/langflow-ai/langflow", category: "AI Platform", useCase: "Visual low-code AI agent and RAG builder", whenToUse: "Use for visual prototyping of AI pipelines.", whenNotToUse: "Avoid for production code-first systems.", howToUse: "reference-only", difficulty: "easy", productionReadiness: "medium", riskNotes: "Best for prototyping; evaluate for production.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Langflow for visual RAG pipeline design patterns.", tags: ["ai", "low-code", "rag", "visual", "reference"] },
  { id: "ragflow", name: "RAGFlow", url: "https://github.com/infiniflow/ragflow", category: "AI Platform", useCase: "Enterprise RAG engine with deep document understanding", whenToUse: "Use for document Q&A and knowledge base systems.", whenNotToUse: "Avoid for simple chatbot without documents.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Complex setup; Docker required.", costNotes: "Free self-hosted.", suggestedPrompt: "Study RAGFlow for enterprise document RAG architecture.", tags: ["ai", "rag", "documents", "enterprise", "reference"] },
  { id: "ollama", name: "Ollama", url: "https://github.com/ollama/ollama", category: "AI Infrastructure", useCase: "Run large language models locally", whenToUse: "Use for local LLM inference without cloud APIs.", whenNotToUse: "Avoid if cloud APIs are preferred for simplicity.", howToUse: "external-tool", difficulty: "easy", productionReadiness: "high", riskNotes: "GPU recommended for large models.", costNotes: "Free; runs on local hardware.", suggestedPrompt: "Use Ollama to run local models for development and testing.", tags: ["ai", "llm", "local", "inference", "privacy"] },
  { id: "open-webui", name: "Open WebUI", url: "https://github.com/open-webui/open-webui", category: "AI Infrastructure", useCase: "Self-hosted ChatGPT-like interface for local LLMs", whenToUse: "Use as UI for Ollama or any OpenAI-compatible API.", whenNotToUse: "Avoid if building custom chat UI.", howToUse: "reference-only", difficulty: "easy", productionReadiness: "high", riskNotes: "Self-hosting needs resources.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Open WebUI for chat interface patterns with LLM backends.", tags: ["ai", "chat", "ui", "self-hosted", "reference"] },
  { id: "phidata", name: "Phidata (Agno)", url: "https://github.com/phidatahq/phidata", category: "AI Agent", useCase: "Build multi-modal AI agents with memory and knowledge", whenToUse: "Use for building agents with tools, memory, and RAG.", whenNotToUse: "Avoid if LangChain/LangGraph already covers needs.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Python-based; reference for architecture.", costNotes: "Free; model costs apply.", suggestedPrompt: "Study Phidata for agent architecture with memory and knowledge.", tags: ["ai", "agent", "memory", "knowledge", "reference"] },
  // --- MCP & Tool Integration (3000+ stars) ---
  { id: "mcp-servers", name: "MCP Servers (Official)", url: "https://github.com/modelcontextprotocol/servers", category: "MCP", useCase: "Official Model Context Protocol server implementations", whenToUse: "Use for connecting AI agents to external tools via MCP.", whenNotToUse: "Avoid if not using MCP-compatible clients.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Review security of each server.", costNotes: "Free.", suggestedPrompt: "Reference MCP servers for tool integration patterns.", tags: ["mcp", "protocol", "tools", "agent", "reference"] },
  { id: "github-mcp", name: "GitHub MCP Server", url: "https://github.com/github/github-mcp-server", category: "MCP", useCase: "MCP server for GitHub repository management", whenToUse: "Use to let AI agents manage repos, issues, and PRs.", whenNotToUse: "Avoid if direct GitHub API is simpler.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Requires GitHub token with appropriate scopes.", costNotes: "Free.", suggestedPrompt: "Use GitHub MCP Server for AI-driven repo management.", tags: ["mcp", "github", "devops", "agent"] },
  { id: "mcp-agent", name: "MCP Agent", url: "https://github.com/lastmile-ai/mcp-agent", category: "MCP", useCase: "Framework for building agents using MCP", whenToUse: "Use for building MCP-native agent workflows.", whenNotToUse: "Avoid if not using MCP protocol.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "medium", riskNotes: "Evolving framework; check stability.", costNotes: "Free.", suggestedPrompt: "Study MCP Agent for MCP-native workflow patterns.", tags: ["mcp", "agent", "framework", "reference"] },
  // --- Vector DBs (3000+ stars) ---
  { id: "milvus", name: "Milvus", url: "https://github.com/milvus-io/milvus", category: "Vector DB", useCase: "Enterprise-grade vector database for similarity search", whenToUse: "Use for large-scale RAG and recommendation systems.", whenNotToUse: "Avoid for small prototypes; use Chroma instead.", howToUse: "external-tool", difficulty: "hard", productionReadiness: "high", riskNotes: "Complex deployment; use managed Zilliz Cloud.", costNotes: "Free self-hosted; Zilliz Cloud paid.", suggestedPrompt: "Use Milvus for production vector search at scale.", tags: ["ai", "vector", "database", "rag", "search"] },
  { id: "qdrant", name: "Qdrant", url: "https://github.com/qdrant/qdrant", category: "Vector DB", useCase: "High-performance vector database built in Rust", whenToUse: "Use for fast vector search with filtering.", whenNotToUse: "Avoid if managed Pinecone is simpler.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Self-hosting or Qdrant Cloud.", costNotes: "Free self-hosted; cloud paid.", suggestedPrompt: "Use Qdrant for hybrid vector + keyword search.", tags: ["ai", "vector", "database", "rust", "search"] },
  { id: "weaviate", name: "Weaviate", url: "https://github.com/weaviate/weaviate", category: "Vector DB", useCase: "AI-native vector DB with built-in vectorization", whenToUse: "Use for semantic search with auto-embedding.", whenNotToUse: "Avoid if you handle embeddings separately.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Module system adds complexity.", costNotes: "Free self-hosted; cloud paid.", suggestedPrompt: "Use Weaviate for semantic search with built-in vectorizers.", tags: ["ai", "vector", "database", "semantic", "search"] },
  { id: "lancedb", name: "LanceDB", url: "https://github.com/lancedb/lancedb", category: "Vector DB", useCase: "Embedded serverless vector database", whenToUse: "Use for embedded vector search without servers.", whenNotToUse: "Avoid for distributed multi-node deployments.", howToUse: "install", difficulty: "easy", productionReadiness: "medium", riskNotes: "Newer project; evaluate stability.", costNotes: "Free.", suggestedPrompt: "Use LanceDB for embedded vector search in serverless apps.", tags: ["ai", "vector", "embedded", "serverless"] },
  // --- AI SDKs & Models (3000+ stars) ---
  { id: "transformers-js", name: "Transformers.js", url: "https://github.com/huggingface/transformers.js", category: "AI SDK", useCase: "Run Hugging Face models in the browser/Node.js", whenToUse: "Use for client-side ML inference without APIs.", whenNotToUse: "Avoid for large models; use server-side.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Model download size affects load time.", costNotes: "Free; no API costs.", suggestedPrompt: "Use Transformers.js for client-side text classification and embedding.", tags: ["ai", "ml", "browser", "huggingface"] },
  { id: "instructor-js", name: "Instructor", url: "https://github.com/instructor-ai/instructor-js", category: "AI SDK", useCase: "Structured output extraction from LLMs with Zod", whenToUse: "Use for type-safe structured data from AI responses.", whenNotToUse: "Avoid if simple text output is fine.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Model must support structured output.", costNotes: "Free; model costs apply.", suggestedPrompt: "Use Instructor with Zod for type-safe structured AI output.", tags: ["ai", "structured-output", "zod", "typescript"] },
  { id: "anthropic-sdk", name: "Anthropic SDK", url: "https://github.com/anthropics/anthropic-sdk-typescript", category: "AI SDK", useCase: "Official TypeScript SDK for Claude models", whenToUse: "Use for direct Anthropic API access.", whenNotToUse: "Prefer Vercel AI SDK for streaming UI.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Keep API keys server-side.", costNotes: "Pay-per-token.", suggestedPrompt: "Use Anthropic SDK for Claude API with tool use and streaming.", tags: ["ai", "claude", "anthropic", "llm"] },
  { id: "ai-sdk-providers", name: "AI SDK Providers", url: "https://github.com/vercel/ai/tree/main/packages", category: "AI SDK", useCase: "Provider adapters for Vercel AI SDK", whenToUse: "Use for connecting Vercel AI SDK to any model provider.", whenNotToUse: "Avoid if using provider SDKs directly.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Check provider compatibility.", costNotes: "Free; model costs vary.", suggestedPrompt: "Use AI SDK providers for multi-model support in Next.js.", tags: ["ai", "vercel", "providers", "multi-model"] },
  // --- AI Image/Video Generation (3000+ stars) ---
  { id: "comfyui", name: "ComfyUI", url: "https://github.com/comfyanonymous/ComfyUI", category: "AI Image", useCase: "Node-based Stable Diffusion workflow editor", whenToUse: "Use as reference for visual AI pipeline design.", whenNotToUse: "Do not embed; Python-based reference only.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "GPU required; Python ecosystem.", costNotes: "Free; GPU costs.", suggestedPrompt: "Study ComfyUI for node-based AI workflow patterns.", tags: ["ai", "image", "diffusion", "workflow", "reference"] },
  { id: "stable-diffusion-webui", name: "Stable Diffusion WebUI", url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui", category: "AI Image", useCase: "Web UI for Stable Diffusion image generation", whenToUse: "Use as reference for AI image generation UIs.", whenNotToUse: "Do not embed; Python/Gradio reference.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Heavy GPU requirements.", costNotes: "Free self-hosted.", suggestedPrompt: "Study SD WebUI for AI image generation interface patterns.", tags: ["ai", "image", "generation", "ui", "reference"] },
  { id: "fal-ai", name: "fal.ai", url: "https://github.com/fal-ai/fal", category: "AI Image", useCase: "Serverless AI model inference platform", whenToUse: "Use for fast image/video generation via API.", whenNotToUse: "Avoid if self-hosted inference is preferred.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Cloud dependency; per-request pricing.", costNotes: "Pay-per-request.", suggestedPrompt: "Use fal.ai for serverless image generation in production.", tags: ["ai", "image", "serverless", "inference"] },
  { id: "replicate", name: "Replicate", url: "https://github.com/replicate/replicate-javascript", category: "AI Image", useCase: "Run ML models via API", whenToUse: "Use for quick access to thousands of AI models.", whenNotToUse: "Avoid for high-volume with cost concerns.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Per-prediction pricing.", costNotes: "Pay-per-prediction.", suggestedPrompt: "Use Replicate for AI model inference without GPU management.", tags: ["ai", "models", "api", "inference"] },
  // --- Code Analysis & Quality (3000+ stars) ---
  { id: "biome", name: "Biome", url: "https://github.com/biomejs/biome", category: "Code Quality", useCase: "Fast formatter and linter for JS/TS", whenToUse: "Use as fast alternative to ESLint + Prettier.", whenNotToUse: "Avoid if existing ESLint setup works well.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "May conflict with existing ESLint config.", costNotes: "Free.", suggestedPrompt: "Use Biome for fast linting and formatting.", tags: ["code-quality", "linter", "formatter", "typescript"] },
  { id: "oxlint", name: "oxlint", url: "https://github.com/oxc-project/oxc", category: "Code Quality", useCase: "Blazing fast JavaScript/TypeScript linter", whenToUse: "Use for extremely fast linting in CI/CD.", whenNotToUse: "Avoid if Biome or ESLint is already configured.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Newer; fewer rules than ESLint.", costNotes: "Free.", suggestedPrompt: "Use oxlint for fast CI linting.", tags: ["code-quality", "linter", "performance"] },
  { id: "knip", name: "Knip", url: "https://github.com/webpro-nl/knip", category: "Code Quality", useCase: "Find unused files, dependencies, and exports", whenToUse: "Use for codebase cleanup and dead code detection.", whenNotToUse: "Avoid in early prototyping phase.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "May flag intentionally unused exports.", costNotes: "Free.", suggestedPrompt: "Use Knip to find and remove unused code and dependencies.", tags: ["code-quality", "cleanup", "dependencies"] },
  // --- Data Processing & ETL (3000+ stars) ---
  { id: "airbyte", name: "Airbyte", url: "https://github.com/airbytehq/airbyte", category: "Data", useCase: "Open-source data integration and ETL platform", whenToUse: "Use for syncing data between sources.", whenNotToUse: "Avoid for simple single-source apps.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Docker required; resource intensive.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Airbyte for data pipeline architecture.", tags: ["data", "etl", "integration", "reference"] },
  { id: "apache-superset", name: "Apache Superset", url: "https://github.com/apache/superset", category: "Data", useCase: "Open-source data visualization and BI platform", whenToUse: "Use as reference for dashboard and visualization patterns.", whenNotToUse: "Do not embed; reference architecture only.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Python-based; reference patterns only.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Superset for data visualization and dashboard patterns.", tags: ["data", "visualization", "dashboard", "reference"] },
  // --- Prompt Engineering (3000+ stars) ---
  { id: "promptfoo", name: "Promptfoo", url: "https://github.com/promptfoo/promptfoo", category: "AI Tools", useCase: "LLM prompt testing and evaluation framework", whenToUse: "Use for systematic prompt testing and comparison.", whenNotToUse: "Avoid if prompts are simple and stable.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Test data needs management.", costNotes: "Free; model costs for testing.", suggestedPrompt: "Use Promptfoo to test and evaluate prompt quality.", tags: ["ai", "prompts", "testing", "evaluation"] },
  { id: "guidance", name: "Guidance", url: "https://github.com/guidance-ai/guidance", category: "AI Tools", useCase: "Structured LLM output with constrained generation", whenToUse: "Use as reference for constrained generation patterns.", whenNotToUse: "Avoid if Instructor handles structured output.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "medium", riskNotes: "Python-based; reference only.", costNotes: "Free.", suggestedPrompt: "Study Guidance for constrained LLM generation patterns.", tags: ["ai", "prompts", "structured", "reference"] },
  // --- AI Memory & Knowledge (3000+ stars) ---
  { id: "mem0", name: "Mem0", url: "https://github.com/mem0ai/mem0", category: "AI Memory", useCase: "Memory layer for AI agents and assistants", whenToUse: "Use for persistent AI memory across conversations.", whenNotToUse: "Avoid if simple session context suffices.", howToUse: "install", difficulty: "medium", productionReadiness: "medium", riskNotes: "Memory management needs strategy.", costNotes: "Free self-hosted; cloud paid.", suggestedPrompt: "Use Mem0 for persistent memory in AI agents.", tags: ["ai", "memory", "agents", "context"] },
  { id: "embedchain", name: "Embedchain", url: "https://github.com/embedchain/embedchain", category: "AI Memory", useCase: "RAG framework for creating AI-powered chat over data", whenToUse: "Use for quick RAG pipeline setup.", whenNotToUse: "Avoid if LangChain RAG is already set up.", howToUse: "reference-only", difficulty: "easy", productionReadiness: "medium", riskNotes: "Python-based; reference for patterns.", costNotes: "Free; embedding costs.", suggestedPrompt: "Study Embedchain for simple RAG pipeline patterns.", tags: ["ai", "rag", "memory", "reference"] },
  // --- DevOps & Infrastructure (3000+ stars) ---
  { id: "coolify", name: "Coolify", url: "https://github.com/coollabsio/coolify", category: "DevOps", useCase: "Self-hosted Heroku/Netlify/Vercel alternative", whenToUse: "Use for self-hosted PaaS deployment.", whenNotToUse: "Avoid if Vercel/Railway is simpler.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Self-hosting requires VPS management.", costNotes: "Free; VPS hosting costs.", suggestedPrompt: "Use Coolify for self-hosted app deployment.", tags: ["devops", "deployment", "self-hosted", "paas"] },
  { id: "dokku", name: "Dokku", url: "https://github.com/dokku/dokku", category: "DevOps", useCase: "Smallest PaaS implementation (Docker-powered Heroku)", whenToUse: "Use for simple git-push deployments on VPS.", whenNotToUse: "Avoid if managed PaaS is preferred.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Single-server limitation.", costNotes: "Free; VPS costs.", suggestedPrompt: "Use Dokku for git-push deployment on VPS.", tags: ["devops", "deployment", "docker", "self-hosted"] },
  // --- AI Evaluation & Safety (3000+ stars) ---
  { id: "guardrails", name: "Guardrails AI", url: "https://github.com/guardrails-ai/guardrails", category: "AI Safety", useCase: "Input/output validation for LLM applications", whenToUse: "Use for validating and sanitizing AI outputs.", whenNotToUse: "Avoid if simple output parsing suffices.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Python-based; reference for patterns.", costNotes: "Free.", suggestedPrompt: "Study Guardrails for AI output validation patterns.", tags: ["ai", "safety", "validation", "reference"] },
  { id: "openllmetry", name: "OpenLLMetry", url: "https://github.com/traceloop/openllmetry", category: "AI Observability", useCase: "OpenTelemetry-based LLM observability", whenToUse: "Use for monitoring LLM usage, costs, and latency.", whenNotToUse: "Avoid if no LLM usage to monitor.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Requires OpenTelemetry backend.", costNotes: "Free; backend costs.", suggestedPrompt: "Use OpenLLMetry for LLM cost and latency monitoring.", tags: ["ai", "observability", "monitoring", "llm"] },
  // --- No-Code / Low-Code (3000+ stars) ---
  { id: "appsmith", name: "Appsmith", url: "https://github.com/appsmithorg/appsmith", category: "Low-code", useCase: "Open-source platform for building internal tools", whenToUse: "Use as reference for internal tool builder patterns.", whenNotToUse: "Do not embed; study for admin panel design.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Self-hosting needs Docker.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Appsmith for internal tool and admin panel patterns.", tags: ["low-code", "internal tool", "admin", "reference"] },
  { id: "tooljet", name: "ToolJet", url: "https://github.com/ToolJet/ToolJet", category: "Low-code", useCase: "Open-source low-code platform for business apps", whenToUse: "Use as reference for business app builder patterns.", whenNotToUse: "Do not embed; reference architecture only.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Self-hosting complexity.", costNotes: "Free self-hosted.", suggestedPrompt: "Study ToolJet for business application builder patterns.", tags: ["low-code", "business", "internal tool", "reference"] },
  { id: "nocodb", name: "NocoDB", url: "https://github.com/nocodb/nocodb", category: "Low-code", useCase: "Open-source Airtable alternative", whenToUse: "Use as reference for spreadsheet-database hybrid UI.", whenNotToUse: "Do not embed; reference for data grid patterns.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Self-hosting needs database.", costNotes: "Free self-hosted.", suggestedPrompt: "Study NocoDB for spreadsheet-database UI patterns.", tags: ["low-code", "database", "airtable", "reference"] },
  // --- API Development (3000+ stars) ---
  { id: "hono", name: "Hono", url: "https://github.com/honojs/hono", category: "API", useCase: "Ultrafast web framework for Cloudflare, Deno, Bun, Node", whenToUse: "Use for lightweight, edge-first API development.", whenNotToUse: "Avoid if Next.js API routes cover needs.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Different middleware ecosystem than Express.", costNotes: "Free.", suggestedPrompt: "Use Hono for lightweight edge-first API routes.", tags: ["api", "edge", "serverless", "lightweight"] },
  { id: "elysia", name: "Elysia", url: "https://github.com/elysiajs/elysia", category: "API", useCase: "TypeScript web framework for Bun with end-to-end type safety", whenToUse: "Use for Bun-based APIs with type-safe routing.", whenNotToUse: "Avoid if targeting Node.js only.", howToUse: "install", difficulty: "easy", productionReadiness: "medium", riskNotes: "Bun runtime dependency.", costNotes: "Free.", suggestedPrompt: "Use Elysia with Bun for type-safe API development.", tags: ["api", "bun", "typescript", "type-safe"] },
  // --- AI Sandbox & Code Execution (3000+ stars) ---
  { id: "e2b", name: "E2B", url: "https://github.com/e2b-dev/e2b", category: "AI Sandbox", useCase: "Cloud sandboxes for AI-generated code execution", whenToUse: "Use for safe execution of AI-generated code.", whenNotToUse: "Avoid if local execution is acceptable.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Cloud dependency; per-sandbox pricing.", costNotes: "Free tier; paid for production.", suggestedPrompt: "Use E2B for sandboxed AI code execution.", tags: ["ai", "sandbox", "code-execution", "agent"] },
  { id: "code-interpreter-sdk", name: "E2B Code Interpreter", url: "https://github.com/e2b-dev/code-interpreter", category: "AI Sandbox", useCase: "AI code interpreter with Jupyter-like execution", whenToUse: "Use for AI agents that need to run Python/JS code.", whenNotToUse: "Avoid if simple code generation without execution.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "Sandboxed execution; safe by design.", costNotes: "Free tier available.", suggestedPrompt: "Use E2B Code Interpreter for AI agent code execution.", tags: ["ai", "sandbox", "jupyter", "agent"] },
  // --- AI Voice & Audio (3000+ stars) ---
  { id: "elevenlabs", name: "ElevenLabs SDK", url: "https://github.com/elevenlabs/elevenlabs-js", category: "AI Voice", useCase: "AI text-to-speech and voice cloning", whenToUse: "Use for generating natural speech from text.", whenNotToUse: "Avoid if the app has no voice/audio features.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Per-character pricing.", costNotes: "Free tier; paid for production.", suggestedPrompt: "Use ElevenLabs for natural text-to-speech generation.", tags: ["ai", "voice", "tts", "audio"] },
  { id: "whisper", name: "Whisper (OpenAI)", url: "https://github.com/openai/whisper", category: "AI Voice", useCase: "Speech-to-text transcription model", whenToUse: "Use as reference for speech recognition patterns.", whenNotToUse: "Avoid if cloud STT API is simpler.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "Python; use via API for JS projects.", costNotes: "Free model; compute costs.", suggestedPrompt: "Study Whisper for speech recognition architecture.", tags: ["ai", "voice", "stt", "transcription", "reference"] },
  { id: "deepgram", name: "Deepgram SDK", url: "https://github.com/deepgram/deepgram-js-sdk", category: "AI Voice", useCase: "Real-time speech-to-text API", whenToUse: "Use for live transcription and voice commands.", whenNotToUse: "Avoid if no real-time audio processing needed.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "Cloud dependency.", costNotes: "Free tier; paid for volume.", suggestedPrompt: "Use Deepgram for real-time speech transcription.", tags: ["ai", "voice", "stt", "realtime"] },
  // --- AI Fine-tuning & Training (3000+ stars) ---
  { id: "unsloth", name: "Unsloth", url: "https://github.com/unslothai/unsloth", category: "AI Training", useCase: "Fast LLM fine-tuning with 2x speed and 60% less memory", whenToUse: "Use as reference for LLM fine-tuning patterns.", whenNotToUse: "Do not embed; Python GPU tool.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "GPU required; Python ecosystem.", costNotes: "Free; GPU costs.", suggestedPrompt: "Study Unsloth for efficient LLM fine-tuning strategies.", tags: ["ai", "training", "fine-tuning", "llm", "reference"] },
  { id: "axolotl", name: "Axolotl", url: "https://github.com/OpenAccess-AI-Collective/axolotl", category: "AI Training", useCase: "Streamlined LLM fine-tuning tool", whenToUse: "Use as reference for fine-tuning workflows.", whenNotToUse: "Do not embed; Python-based reference.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "medium", riskNotes: "GPU and CUDA required.", costNotes: "Free; hardware costs.", suggestedPrompt: "Study Axolotl for LLM fine-tuning pipeline patterns.", tags: ["ai", "training", "fine-tuning", "reference"] },
  // --- AI Knowledge & Graph (3000+ stars) ---
  { id: "graphrag", name: "GraphRAG", url: "https://github.com/microsoft/graphrag", category: "AI Knowledge", useCase: "Graph-based RAG by Microsoft", whenToUse: "Use as reference for knowledge graph + RAG patterns.", whenNotToUse: "Avoid for simple vector-only RAG.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "medium", riskNotes: "Python; reference patterns only.", costNotes: "Free; model costs.", suggestedPrompt: "Study GraphRAG for knowledge graph-enhanced retrieval.", tags: ["ai", "rag", "knowledge-graph", "microsoft", "reference"] },
  { id: "neo4j", name: "Neo4j", url: "https://github.com/neo4j/neo4j", category: "Database", useCase: "Graph database for connected data", whenToUse: "Use for relationship-heavy data and knowledge graphs.", whenNotToUse: "Avoid for simple relational data.", howToUse: "external-tool", difficulty: "medium", productionReadiness: "high", riskNotes: "Query language (Cypher) learning curve.", costNotes: "Free community; enterprise paid.", suggestedPrompt: "Use Neo4j for knowledge graph storage and traversal.", tags: ["database", "graph", "knowledge", "relationships"] },
  // --- AI Multi-modal (3000+ stars) ---
  { id: "openclip", name: "OpenCLIP", url: "https://github.com/mlfoundations/open_clip", category: "AI Multi-modal", useCase: "Open-source CLIP model for image-text understanding", whenToUse: "Use as reference for multi-modal AI patterns.", whenNotToUse: "Do not embed; Python reference.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "high", riskNotes: "GPU required for inference.", costNotes: "Free.", suggestedPrompt: "Study OpenCLIP for image-text similarity patterns.", tags: ["ai", "multi-modal", "vision", "reference"] },
  { id: "llava", name: "LLaVA", url: "https://github.com/haotian-liu/LLaVA", category: "AI Multi-modal", useCase: "Visual instruction tuning for multi-modal LLMs", whenToUse: "Use as reference for vision-language model patterns.", whenNotToUse: "Do not embed; research reference.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "medium", riskNotes: "Research project.", costNotes: "Free.", suggestedPrompt: "Study LLaVA for vision-language model architecture.", tags: ["ai", "multi-modal", "vision", "llm", "reference"] },
  // --- AI Chatbot Frameworks (3000+ stars) ---
  { id: "botpress", name: "Botpress", url: "https://github.com/botpress/botpress", category: "AI Chatbot", useCase: "Open-source chatbot platform with visual builder", whenToUse: "Use as reference for chatbot architecture.", whenNotToUse: "Avoid for simple AI chat; use Vercel AI SDK.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Self-hosting needs resources.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Botpress for chatbot workflow and NLU patterns.", tags: ["ai", "chatbot", "nlu", "reference"] },
  { id: "chatbot-ui", name: "Chatbot UI", url: "https://github.com/mckaywrigley/chatbot-ui", category: "AI Chatbot", useCase: "Open-source ChatGPT clone interface", whenToUse: "Use as reference for AI chat interface design.", whenNotToUse: "Avoid if building custom chat from scratch.", howToUse: "reference-only", difficulty: "easy", productionReadiness: "medium", riskNotes: "Needs backend configuration.", costNotes: "Free.", suggestedPrompt: "Study Chatbot UI for ChatGPT-style interface patterns.", tags: ["ai", "chatbot", "ui", "chat", "reference"] },
  // --- AI Document Processing (3000+ stars) ---
  { id: "marker", name: "Marker", url: "https://github.com/VikParuchuri/marker", category: "AI Document", useCase: "Convert PDF/EPUB/images to Markdown with AI", whenToUse: "Use for document ingestion in RAG pipelines.", whenNotToUse: "Avoid if simple text extraction suffices.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Python; use as processing step.", costNotes: "Free.", suggestedPrompt: "Study Marker for AI document conversion patterns.", tags: ["ai", "document", "pdf", "markdown", "reference"] },
  { id: "docling", name: "Docling", url: "https://github.com/DS4SD/docling", category: "AI Document", useCase: "IBM document understanding and parsing", whenToUse: "Use for structured document extraction.", whenNotToUse: "Avoid for simple text files.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Python; reference patterns.", costNotes: "Free.", suggestedPrompt: "Study Docling for document parsing architecture.", tags: ["ai", "document", "parsing", "ibm", "reference"] },
  // --- AI Workflow Automation (3000+ stars) ---
  { id: "flowise", name: "Flowise", url: "https://github.com/FlowiseAI/Flowise", category: "AI Platform", useCase: "Drag-and-drop LLM flow builder", whenToUse: "Use as reference for visual LLM pipeline design.", whenNotToUse: "Avoid if code-first is preferred.", howToUse: "reference-only", difficulty: "easy", productionReadiness: "high", riskNotes: "Self-hosting needs Node.js.", costNotes: "Free self-hosted.", suggestedPrompt: "Study Flowise for visual LLM workflow builder patterns.", tags: ["ai", "low-code", "workflow", "llm", "reference"] },
  { id: "haystack", name: "Haystack", url: "https://github.com/deepset-ai/haystack", category: "AI Platform", useCase: "End-to-end NLP framework for building AI pipelines", whenToUse: "Use as reference for composable AI pipeline design.", whenNotToUse: "Avoid if LangChain covers your needs.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "high", riskNotes: "Python; reference for pipeline patterns.", costNotes: "Free.", suggestedPrompt: "Study Haystack for composable NLP pipeline architecture.", tags: ["ai", "nlp", "pipeline", "rag", "reference"] },
  // --- Collaboration & Communication (3000+ stars) ---
  { id: "livekit", name: "LiveKit", url: "https://github.com/livekit/livekit", category: "Realtime", useCase: "Open-source WebRTC infrastructure for video/audio", whenToUse: "Use for real-time video, audio, and data streaming.", whenNotToUse: "Avoid if simple WebSocket suffices.", howToUse: "install", difficulty: "hard", productionReadiness: "high", riskNotes: "Self-hosting is complex.", costNotes: "Free self-hosted; cloud paid.", suggestedPrompt: "Use LiveKit for real-time video and audio communication.", tags: ["realtime", "webrtc", "video", "audio"] },
  { id: "tldraw", name: "tldraw", url: "https://github.com/tldraw/tldraw", category: "UI", useCase: "Collaborative whiteboard/drawing library for React", whenToUse: "Use for collaborative diagramming and sketching.", whenNotToUse: "Avoid if no whiteboard feature needed.", howToUse: "install", difficulty: "medium", productionReadiness: "high", riskNotes: "License check for commercial use.", costNotes: "Free for open source.", suggestedPrompt: "Use tldraw for collaborative whiteboard features.", tags: ["ui", "collaboration", "drawing", "whiteboard"] },
  { id: "excalidraw", name: "Excalidraw", url: "https://github.com/excalidraw/excalidraw", category: "UI", useCase: "Virtual whiteboard for hand-drawn diagrams", whenToUse: "Use for diagram and wireframe drawing features.", whenNotToUse: "Avoid if no diagramming needed.", howToUse: "install", difficulty: "easy", productionReadiness: "high", riskNotes: "MIT license.", costNotes: "Free.", suggestedPrompt: "Use Excalidraw for embedded diagram and wireframe drawing.", tags: ["ui", "diagram", "drawing", "collaboration"] },
  // --- AI Autonomous Agents (3000+ stars) ---
  { id: "superagi", name: "SuperAGI", url: "https://github.com/TransformerOptimus/SuperAGI", category: "AI Agent", useCase: "Autonomous AI agent framework", whenToUse: "Use as reference for autonomous agent patterns.", whenNotToUse: "Do not embed; reference architecture.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "medium", riskNotes: "Experimental; evaluate stability.", costNotes: "Free; model costs.", suggestedPrompt: "Study SuperAGI for autonomous agent architecture.", tags: ["ai", "agent", "autonomous", "reference"] },
  { id: "gpt-engineer", name: "GPT Engineer", url: "https://github.com/gpt-engineer-org/gpt-engineer", category: "AI Coding", useCase: "AI agent that builds entire codebases from prompts", whenToUse: "Use as reference for AI code generation patterns.", whenNotToUse: "Do not embed; reference tool.", howToUse: "reference-only", difficulty: "medium", productionReadiness: "medium", riskNotes: "Experimental; review output quality.", costNotes: "Free; model costs.", suggestedPrompt: "Study GPT Engineer for AI code generation patterns.", tags: ["ai", "coding", "agent", "generation", "reference"] },
  { id: "devika", name: "Devika", url: "https://github.com/stitionai/devika", category: "AI Coding", useCase: "AI software engineer that plans and writes code", whenToUse: "Use as reference for AI planning and coding patterns.", whenNotToUse: "Do not embed; research project.", howToUse: "reference-only", difficulty: "hard", productionReadiness: "low", riskNotes: "Early stage; not production-ready.", costNotes: "Free; model costs.", suggestedPrompt: "Study Devika for AI software engineering agent patterns.", tags: ["ai", "coding", "agent", "planning", "reference"] },
];

export function recommendRepos(input: ProjectInput): RepoRecommendation[] {
  const appType = input.appType.toLowerCase();
  const text =
    `${input.idea} ${input.problem ?? ""} ${input.desiredOutput ?? ""} ${appType} ${input.preferredStack.join(" ")}`.toLowerCase();
  const isVideo = text.includes("video") || appType.includes("video");
  const isLearningPlanner =
    /lesson plan|practice exercises|review schedule|progress checklist|adult learners|structured practice|learning app|education app/.test(
      text,
    );
  const isAutomation =
    input.wantsAutomation || text.includes("automation") || text.includes("workflow") || appType.includes("n8n");
  const isN8nAutomation = text.includes("n8n") || appType.includes("n8n");
  const isLeadAutomation = /lead generation|lead capture|lead scoring|qualified leads|crm push|form submissions|enrich(?:es)? leads|slack notification/.test(text);
  const isSaas = text.includes("saas") || text.includes("dashboard");
  const isInternal = text.includes("internal") || text.includes("business tool");
  const isContent = text.includes("content") || text.includes("caption") || text.includes("copy");
  const isCommerce =
    text.includes("commerce") || text.includes("e-commerce") || text.includes("shopify") || text.includes("product listing") || text.includes("store") || text.includes("shop");
  const isAI = text.includes("ai") || text.includes("llm") || text.includes("gpt") || text.includes("gemini") || text.includes("chatbot") || text.includes("rag");
  const isMobile = text.includes("mobile") || text.includes("ios") || text.includes("android") || text.includes("react native");
  const isRealtime = text.includes("realtime") || text.includes("real-time") || text.includes("chat") || text.includes("live") || text.includes("websocket");
  const isPOS = text.includes("pos") || text.includes("point of sale") || text.includes("kiotviet") || text.includes("cashier");
  const isFastMvp = input.timeline.includes("1 night") || input.timeline.includes("1 day") || input.timeline.includes("7 day");

  // Base tools for every project
  const base = ["nextjs", "shadcn-ui", "codex-cli", "cline", "cursor", "claude-code", "zod", "react-hook-form"];
  const ids = new Set(base);

  // Conditional additions based on project type
  if (!isFastMvp || isSaas || isInternal) ids.add("supabase");
  if (isVideo) ["remotion", "ffmpeg", "videosos", "storygen-atelier", "short-video-maker", "sharp", "cloudinary"].forEach(id => ids.add(id));
  if (isAutomation) ["n8n", "trigger-dev", "inngest"].forEach(id => ids.add(id));
  if (isInternal || isContent) ids.add("airtable");
  if (isCommerce) ["shopify-api", "medusa", "stripe", "meilisearch"].forEach(id => ids.add(id));
  if (isAI) ["vercel-ai-sdk", "langchain-js", "openai-node", "google-genai"].forEach(id => ids.add(id));
  if (isMobile) ["expo", "capacitor"].forEach(id => ids.add(id));
  if (isRealtime) ["socket-io", "pusher"].forEach(id => ids.add(id));
  if (isPOS) ["odoo", "stripe", "prisma"].forEach(id => ids.add(id));
  if (isSaas) ["prisma", "stripe", "tanstack-table", "recharts", "sentry", "next-auth"].forEach(id => ids.add(id));
  if (!isFastMvp || isSaas || isInternal || input.wantsMcp) ids.add("playwright");
  if (input.skillLevel === "Developer") ["openhands", "vitest", "testing-library"].forEach(id => ids.add(id));
  if (input.wantsMcp) ids.add("superpowers");
  if (isN8nAutomation || isLeadAutomation) {
    ids.add("n8n");
    ["trigger-dev", "inngest", "bull-mq", "novu"].forEach((id) => ids.delete(id));
  }

  // Prune for fast MVP
  if ((input.timeline.includes("1 night") || input.budgetSensitivity === "high") && input.skillLevel !== "Developer") {
    ids.delete("openhands");
  }
  if (!isSaas && !isInternal && input.timeline.includes("1 night")) ids.delete("supabase");

  // Tag-based matching: scan all repos for tag overlap with the input text
  // Require at least 2 tag matches to avoid noisy recommendations
  const keywords = text.split(/\s+/).filter(w => w.length > 2);
  for (const tool of repoTools) {
    if (ids.has(tool.id)) continue;
    if (isLearningPlanner && !isVideo && tool.tags.includes("video")) continue;
    const tagMatches = tool.tags.filter(tag => keywords.includes(tag) || text.includes(tag)).length;
    const categoryMatch = text.includes(tool.category.toLowerCase());
    if (tagMatches >= 2 || (tagMatches >= 1 && categoryMatch)) ids.add(tool.id);
  }

  if (isLearningPlanner && !isVideo) {
    ["remotion", "ffmpeg", "videosos", "storygen-atelier", "short-video-maker", "livekit"].forEach((id) =>
      ids.delete(id),
    );
  }
  if (isN8nAutomation || isLeadAutomation) {
    ["trigger-dev", "inngest", "bull-mq", "novu"].forEach((id) => ids.delete(id));
  }

  const results = Array.from(ids)
    .map((id) => repoTools.find((tool) => tool.id === id))
    .filter((tool): tool is RepoTool => Boolean(tool))
    .map((tool) => {
      let lane: RepoRecommendation["lane"] = "use-now";
      if (tool.howToUse === "reference-only") lane = "reference-only";
      if (["videosos", "storygen-atelier", "short-video-maker", "saleor", "krayin-crm", "odoo"].includes(tool.id)) lane = "reference-only";
      if (["remotion", "ffmpeg", "n8n", "shopify-api", "airtable", "expo", "capacitor"].includes(tool.id)) lane = "use-later";
      if (tool.id === "n8n" && isAutomation) lane = "use-now";
      if (["trigger-dev", "inngest", "bull-mq", "novu"].includes(tool.id) && (isN8nAutomation || isLeadAutomation)) lane = "use-later";
      if (tool.id === "airtable" && (isInternal || isContent) && input.budgetSensitivity !== "high") lane = "use-now";
      if (tool.id === "playwright" && isFastMvp) lane = input.wantsMcp ? "use-later" : "avoid-mvp";
      if (tool.id === "supabase" && isFastMvp && !isSaas && !isInternal) lane = "use-later";
      if (tool.id === "openhands") lane = input.skillLevel === "Developer" ? "reference-only" : "avoid-mvp";
      return {
        tool,
        lane,
        reason:
          lane === "reference-only"
            ? `Architecture reference. URL: ${tool.url} — Do not clone automatically.`
            : lane === "use-later"
              ? "Relevant after the first validated workflow is working or when the timeline and budget allow it."
              : lane === "avoid-mvp"
                ? "Too much setup or operational risk for the first MVP."
                : recommendationReason(tool, input),
      };
    });
  // Cap recommendations to avoid noisy, overwhelming lists.
  // Prioritize: use-now > use-later > reference-only > avoid-mvp
  const MAX_RECOMMENDATIONS = 20;
  const lanePriority: Record<string, number> = { "use-now": 0, "use-later": 1, "reference-only": 2, "avoid-mvp": 3 };
  results.sort((a, b) => (lanePriority[a.lane] ?? 9) - (lanePriority[b.lane] ?? 9));
  return results.slice(0, MAX_RECOMMENDATIONS);
}

/** Generate GitHub search URLs as fallback when repo matches are sparse. */
export function generateGitHubSearchUrls(input: ProjectInput): string[] {
  const keywords = [
    input.appType,
    ...(input.preferredStack || []),
    ...(input.idea.split(/\s+/).slice(0, 5)),
  ].filter(Boolean).map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const unique = [...new Set(keywords)].slice(0, 6);
  const urls: string[] = [];
  if (unique.length >= 2) {
    urls.push(`https://github.com/search?q=${unique.slice(0, 3).join("+")}+stars%3A%3E100&type=repositories&s=stars`);
  }
  urls.push(`https://github.com/search?q=${input.appType.replace(/\s+/g, "+")}+template+starter+stars%3A%3E50&type=repositories&s=stars`);
  urls.push(`https://github.com/topics/${input.appType.replace(/\s+/g, "-").toLowerCase()}`);
  return urls.slice(0, 5);
}

function recommendationReason(tool: RepoTool, input: ProjectInput) {
  if (["codex-cli", "cline", "cursor", "claude-code", "superpowers"].includes(tool.id)) {
    return "Helps turn the generated kit into controlled implementation work.";
  }
  if (tool.id === "n8n") return "Matches the requested automation path without embedding a runtime in the app.";
  if (tool.id === "playwright") return "Verifies the core product workflow before production release.";
  if (tool.id === "supabase") return "Fits persistence, auth, and production setup while preserving the local-first MVP path.";
  return `${tool.useCase} — fits the ${input.appType} build path.`;
}

