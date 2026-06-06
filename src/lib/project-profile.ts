import type { ProjectInput } from "@/types/vibeforge";
import type { AppTemplate } from "@/lib/templates";
import { slugify } from "@/lib/utils";

export type ProjectProfile = {
  id: string;
  label: string;
  slug: string;
  targetUsers: string;
  problem: string;
  desiredOutput: string;
  mvp: string[];
  avoid: string[];
  routes: Array<{ path: string; name: string; job: string; controls: string }>;
  entities: Array<{ name: string; purpose: string; fields: string[] }>;
  apiEndpoints: Array<{ method: "GET" | "POST" | "PATCH" | "DELETE"; path: string; purpose: string }>;
  tasks: Array<{ title: string; files: string[]; notes: string; acceptance: string; command: string }>;
  tests: string[];
  primaryAction: string;
  successMetric: string;
  launchAudience: string[];
  usesAiProvider: boolean;
};

type ProfilePreset = {
  id: string;
  label: string;
  keywords: string[];
  targetUsers: string;
  problem: string;
  desiredOutput: string;
  mvp: string[];
  avoid: string[];
  routes: ProjectProfile["routes"];
  entities: ProjectProfile["entities"];
  apiEndpoints: ProjectProfile["apiEndpoints"];
  tasks: ProjectProfile["tasks"];
  tests: string[];
  primaryAction: string;
  successMetric: string;
  launchAudience: string[];
  usesAiProvider?: boolean;
};

const presets: ProfilePreset[] = [
  {
    id: "coding-agent-project-kit-builder",
    label: "AI coding agent project kit builder",
    keywords: [
      "coding agent",
      "project kit",
      "codex",
      "cline",
      "cursor",
      "claude code",
      "ai handoff",
      "mcp settings",
      "mcp connection",
      "repo recommendations",
      "markdown json zip",
      "export markdown",
      "export zip",
      "local-first",
      "demo mode",
    ],
    targetUsers: "solo builders, non-coders, and small teams who want AI coding agents to build from structured project artifacts",
    problem: "raw ideas are too vague for coding agents, provider calls can be unreliable, and builders need exportable plans that preserve local-first behavior",
    desiredOutput: "a complete AI-agent-ready project kit with requirements, MVP scope, architecture, Supabase-ready storage plan, API spec, UI screens, tasks, tests, repo references, AI handoff, and Markdown/JSON/ZIP/agent-pack exports",
    mvp: [
      "Usable builder at / with a focused idea intake, explicit Demo/Provider generation mode, and sample templates",
      "Deterministic demo generator that creates a useful 20-section kit without API keys",
      "Provider-backed generation that validates domain fit and falls back section-by-section without changing the user's project domain",
      "Project cockpit with high-priority TASKS.md, AI_HANDOFF.md, repo references, quality score, section tabs, copy, regenerate, approve, and export controls",
      "Local project history backed by browser storage, with Supabase cloud sync as an optional production path",
      "Export Markdown, JSON, ZIP, Codex Pack, Cline Pack, Cursor Pack, and Claude Code Pack without leaking provider keys",
    ],
    avoid: [
      "Landing-page-first homepage, vague template cards, hidden builder inputs, or marketing copy that delays kit generation",
      "Mandatory API keys, Supabase login, paid providers, repo cloning, or execution of user-supplied code for the core flow",
      "Domain hallucination such as converting a coding-agent kit builder into inventory, booking, CRM, or unrelated CRUD workflows",
    ],
    routes: [
      { path: "/", name: "Kit builder", job: "capture one strong project idea and generation mode, then create a kit", controls: "idea textarea, demo/provider selector, optional tuning, template picker, generate button" },
      { path: "/projects", name: "Project history", job: "show saved kits from local or cloud storage", controls: "search, open, delete, storage status" },
      { path: "/projects/[id]", name: "Project cockpit", job: "review, improve, approve, copy, regenerate, and export the generated kit", controls: "section tabs, quality actions, export menu, copy prompt, regenerate section" },
      { path: "/repo-map", name: "Repo and tool map", job: "browse URL-only references for AI coding workflows", controls: "search, filters, copy prompt, no-clone warning" },
      { path: "/settings", name: "Provider and MCP settings", job: "configure optional local providers, Supabase sync, and MCP connection notes", controls: "provider form, test provider, MCP cards, local storage warning" },
    ],
    entities: [
      { name: "ProjectKit", purpose: "one generated AI-coding project package", fields: ["id", "name", "input", "sections", "sectionMeta", "repoRecommendations", "readinessScore", "generation", "createdAt", "updatedAt"] },
      { name: "ProjectInput", purpose: "the user's idea and constraints", fields: ["idea", "targetUsers", "problem", "desiredOutput", "appType", "timeline", "skillLevel", "budgetSensitivity", "preferredStack", "apiProviders", "wantsMcp", "wantsAutomation"] },
      { name: "SectionWorkspace", purpose: "status and version tracking for each generated section", fields: ["sectionKey", "status", "versions", "lastEditedAt", "lastEditedBy"] },
      { name: "ProviderProfile", purpose: "optional AI provider configuration", fields: ["id", "providerName", "providerType", "baseUrl", "model", "apiKeyHint", "enabled", "lastTestStatus"] },
      { name: "McpConnection", purpose: "local or cloud-synced MCP connection plan", fields: ["id", "name", "type", "commandOrUrl", "envVars", "status", "notes"] },
      { name: "GenerationLog", purpose: "server-side audit of generation source, fallback, model, and errors without secrets", fields: ["id", "projectId", "route", "providerName", "model", "mode", "status", "source", "errorMessage", "createdAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/generate-kit", purpose: "validate input, resolve optional provider, generate a full kit, validate quality, and return demo/provider metadata" },
      { method: "POST", path: "/api/regenerate-section", purpose: "regenerate exactly one section while preserving project domain and local-first constraints" },
      { method: "POST", path: "/api/improve-section", purpose: "polish one section based on checklist issues or user instruction" },
      { method: "GET", path: "/api/trending-repos", purpose: "load live or snapshot URL-only repo references without cloning or executing external code" },
      { method: "GET", path: "/api/health", purpose: "report app, provider, database, and runtime status without exposing secrets" },
    ],
    tasks: [
      { title: "Stabilize generation mode and domain detection", files: ["src/components/builder/BuilderForm.tsx", "src/lib/project-profile.ts", "src/lib/server-generator.ts"], notes: "Add explicit Demo/Provider/Auto control and validate that generated names, app type, and sections reuse coding-agent project-kit terms.", acceptance: "A coding-agent project kit idea never becomes inventory, booking, or generic CRUD; demo mode works without provider calls.", command: "npm.cmd run build" },
      { title: "Rework the builder into a focused work surface", files: ["src/components/builder/BuilderForm.tsx", "src/components/builder/TemplateGallery.tsx", "src/app/globals.css"], notes: "Put the idea textarea and Generate action above template browsing, reduce pastel noise, and keep optional tuning compact.", acceptance: "The first viewport clearly shows what to type, which generation mode is active, and how to generate a kit.", command: "npm.cmd run lint" },
      { title: "Make the project cockpit agent-first", files: ["src/components/kit/ProjectDetailClient.tsx", "src/components/kit/ProjectKitTabs.tsx", "src/components/kit/PostGenerateCTA.tsx"], notes: "Prioritize TASKS.md, AI_HANDOFF.md, section tabs, and export menu; demote secondary readiness details.", acceptance: "A user can open the generated kit and immediately review TASKS.md, copy a prompt, regenerate a weak section, and export an agent pack.", command: "npm.cmd run build" },
      { title: "Harden storage and Supabase rollout path", files: ["supabase/migrations/001_initial_schema.sql", "supabase/migrations/002_production_provider_vault.sql", ".env.example", "README.md", "src/lib/use-project-store.ts"], notes: "Keep localStorage as default, document Supabase RLS, provider vault secret, generation logs, and cloud fallback behavior.", acceptance: "Core flow has no required keys; production cloud sync has clear env vars, RLS tables, and rollback notes.", command: "npm.cmd run check:production" },
    ],
    tests: ["Generate coding-agent kit in demo mode", "Generate with provider and confirm domain stays coding-agent", "Open TASKS.md first", "Regenerate one weak section", "Export Markdown/JSON/ZIP/Codex Pack", "Save provider settings locally", "Add MCP connection", "Open history after refresh"],
    primaryAction: "turn one vague software idea into a complete, exportable project kit that a coding agent can build from",
    successMetric: "a non-coder can generate a domain-correct 10/10 kit, copy the first coding-agent prompt, and export a Codex pack in under five minutes without an API key",
    launchAudience: ["Non-coders using Codex or Cline", "Solo builders planning MVPs", "Agencies preparing implementation briefs"],
    usesAiProvider: true,
  },
  {
    id: "lead-generation-automation",
    label: "Lead generation automation",
    keywords: [
      "lead generation",
      "lead capture",
      "lead qualification",
      "lead scoring",
      "qualified leads",
      "crm push",
      "crm",
      "slack notification",
      "form submissions",
      "enriches leads",
      "enrich leads",
      "openrouter",
      "n8n webhook",
      "sales teams",
      "marketing agencies",
      "marketing teams",
    ],
    targetUsers: "marketing teams and agencies running lead generation campaigns",
    problem: "manual lead qualification is slow, inconsistent, and sends low-quality leads to sales teams",
    desiredOutput: "a working lead automation pipeline plan: capture form submission, validate lead, trigger n8n webhook, enrich with AI, calculate score, push qualified leads to CRM, notify Slack, and log each workflow run",
    mvp: [
      "Public lead capture form for name, email, company, role, budget, source, campaign, pain point, and consent",
      "Local demo enrichment that adds company fit, buying intent, objections, suggested next step, and confidence without API keys",
      "Lead scoring rules with transparent fit score, intent score, urgency score, total score, and qualified/disqualified status",
      "n8n webhook contract with retry, idempotency key, signed callback, and failure handling notes",
      "CRM push result model that records skipped, pending, pushed, failed, and retry-needed states",
      "Slack notification log for qualified leads with channel, message preview, delivery status, and error state",
      "Dashboard for recent leads, score, qualification status, CRM push result, Slack status, and workflow run log",
    ],
    avoid: [
      "Multi-CRM routing, custom scoring builder, scraping, cold email sending, billing, team permissions, and embedded n8n runtime in the first MVP",
      "Hard dependency on OpenRouter, n8n Cloud, Supabase, Auth, Slack, or CRM credentials for the first local demo flow",
      "Generic item CRUD routes, placeholder data models, or broad record screens that do not show leads, scoring, CRM, Slack, and workflow runs",
    ],
    routes: [
      { path: "/", name: "Lead capture form", job: "capture a realistic campaign lead with consent and source metadata", controls: "lead form, sample lead button, submit button, validation summary" },
      { path: "/leads", name: "Lead operations dashboard", job: "show recent leads with score, qualification, enrichment, CRM, Slack, and workflow status", controls: "status filters, source filter, score sort, open lead, export CSV" },
      { path: "/leads/[leadId]", name: "Lead detail", job: "review one lead's raw submission, enrichment, score breakdown, CRM result, Slack notification, and run history", controls: "re-score, retry CRM push, retry Slack, copy handoff, export JSON" },
      { path: "/workflow-runs", name: "Workflow run log", job: "inspect n8n webhook attempts, callbacks, retry state, and failure reasons", controls: "filter by status, copy webhook payload, mark resolved" },
      { path: "/settings", name: "Integration settings", job: "configure optional OpenRouter, n8n webhook, CRM, and Slack settings after local demo works", controls: "provider toggles, webhook URL field, test connection, clear local data" },
    ],
    entities: [
      { name: "LeadSubmission", purpose: "raw lead captured from the public form", fields: ["id", "name", "email", "company", "role", "budgetRange", "source", "campaign", "painPoint", "consent", "createdAt"] },
      { name: "EnrichedLead", purpose: "AI/demo enrichment attached to one lead", fields: ["id", "leadSubmissionId", "companyFit", "buyingIntent", "detectedNeed", "objections", "suggestedNextStep", "confidence", "source", "createdAt"] },
      { name: "LeadScore", purpose: "transparent scoring result used for routing", fields: ["id", "leadSubmissionId", "fitScore", "intentScore", "urgencyScore", "totalScore", "qualification", "scoreReasons", "createdAt"] },
      { name: "CrmPushResult", purpose: "status of sending a qualified lead to the selected CRM", fields: ["id", "leadSubmissionId", "crmName", "externalRecordId", "status", "attemptCount", "lastError", "pushedAt", "updatedAt"] },
      { name: "SlackNotification", purpose: "delivery state for qualified lead alerts", fields: ["id", "leadSubmissionId", "channel", "messagePreview", "status", "lastError", "sentAt", "updatedAt"] },
      { name: "WorkflowRun", purpose: "audit log for webhook, enrichment, scoring, CRM, and Slack steps", fields: ["id", "leadSubmissionId", "idempotencyKey", "status", "steps", "startedAt", "finishedAt", "errorMessage"] },
      { name: "GenerationSource", purpose: "records whether enrichment/scoring came from demo or provider mode", fields: ["mode", "providerName", "model", "generatedAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/leads", purpose: "validate and store a lead submission, then create a local workflow run" },
      { method: "GET", path: "/api/leads/[leadId]", purpose: "read one lead with enrichment, score, CRM result, Slack status, and run log" },
      { method: "POST", path: "/api/leads/[leadId]/score", purpose: "run deterministic demo scoring or optional provider-backed scoring for one lead" },
      { method: "POST", path: "/api/n8n/lead-webhook", purpose: "receive n8n callback events for enrichment, CRM push, Slack delivery, and workflow status" },
      { method: "POST", path: "/api/crm/push", purpose: "push a qualified lead to the configured CRM when credentials are available" },
      { method: "POST", path: "/api/slack/notify", purpose: "send or simulate a Slack alert for qualified leads" },
    ],
    tasks: [
      { title: "Build lead capture form and lead schema", files: ["src/app/page.tsx", "src/components/lead-automation/LeadCaptureForm.tsx", "src/lib/lead-automation/schema.ts"], notes: "Collect name, email, company, role, budget range, source, campaign, pain point, and consent. Validate with Zod and keep demo submission usable without external services.", acceptance: "A marketer can submit a sample lead, see useful validation, and create a LeadSubmission record locally.", command: "npm.cmd run lint" },
      { title: "Implement local enrichment and scoring engine", files: ["src/lib/lead-automation/demo-enrichment.ts", "src/lib/lead-automation/scoring.ts", "src/lib/lead-automation/storage.ts"], notes: "Create deterministic EnrichedLead and LeadScore records from lead fields. Explain score reasons so sales can trust why a lead is qualified.", acceptance: "Submitting a lead produces enrichment, score breakdown, qualification status, and local WorkflowRun without API keys.", command: "npm.cmd exec -- tsc --noEmit" },
      { title: "Render lead dashboard and detail views", files: ["src/app/leads/page.tsx", "src/app/leads/[leadId]/page.tsx", "src/components/lead-automation/LeadDashboard.tsx", "src/components/lead-automation/LeadDetailPanel.tsx"], notes: "Show recent leads, total score, qualification, CRM push result, Slack delivery, and workflow status with filters and export controls.", acceptance: "User can inspect a qualified lead, copy a sales handoff, export JSON/CSV, and reopen the lead after refresh.", command: "npm.cmd run build" },
      { title: "Add n8n, CRM, and Slack integration boundaries", files: ["src/app/api/n8n/lead-webhook/route.ts", "src/app/api/crm/push/route.ts", "src/app/api/slack/notify/route.ts", "src/lib/lead-automation/integration-contracts.ts"], notes: "Define webhook payloads, idempotency keys, signed callback checks, retry states, and simulation fallback. Do not require real credentials for the local MVP.", acceptance: "API contracts are typed, invalid payloads return user-safe errors, and simulated CRM/Slack states never erase local lead data.", command: "npm.cmd run build" },
    ],
    tests: ["Submit sample lead", "Generate enrichment and score", "Filter qualified leads", "Retry simulated CRM push", "Simulate Slack notification", "Inspect workflow run log", "Export lead CSV/JSON"],
    primaryAction: "capture, enrich, score, route, and notify one qualified lead through a visible workflow",
    successMetric: "a marketer can submit one lead, see enrichment and score, route a qualified lead, simulate Slack/CRM delivery, and inspect the workflow run without real credentials",
    launchAudience: ["Marketing agencies", "B2B growth teams", "Sales operations teams"],
    usesAiProvider: true,
  },
  {
    id: "momentum-learning-planner",
    label: "Personalized learning momentum app",
    keywords: [
      "momentum lessons",
      "personalized lesson plans",
      "practice exercises",
      "review schedules",
      "review schedule",
      "progress checklist",
      "busy adult learners",
      "structured practice",
      "learning app",
      "lesson plan",
      "daily exercises",
      "spaced review",
      "adult learners",
    ],
    targetUsers: "busy adult learners who want structured practice without joining a full course",
    problem: "they lose momentum because lessons are generic, practice is not broken into daily work, and review progress is hard to track",
    desiredOutput: "a personalized lesson plan, daily practice exercises, review schedule, and progress checklist generated from one short intake",
    mvp: [
      "Learning intake form for goal, subject, current level, available minutes, deadline, preferred practice style, and weak areas",
      "Local demo plan generator that creates a useful lesson plan without API keys",
      "Lesson plan dashboard with weekly milestones, daily exercises, and a visible next action",
      "Practice exercise cards with instructions, estimated minutes, completion state, and copy/export actions",
      "Review schedule that spaces review items by date and marks each review as due, done, or skipped",
      "Progress checklist persisted in browser storage so learners can resume after refresh",
    ],
    avoid: [
      "Full course marketplace, live tutoring, teacher dashboards, certification, payments, and multi-learner classrooms",
      "Hard dependency on Gemini, Supabase, Auth, accounts, or API keys for the first demo flow",
      "Generic saved-record routes or undifferentiated CRUD screens that do not show lesson, practice, review, and progress structure",
    ],
    routes: [
      { path: "/", name: "Learning intake", job: "capture goal, subject, level, minutes per day, deadline, style, and weak areas", controls: "intake form, sample learner button, generate plan button" },
      { path: "/plans/[planId]", name: "Lesson plan dashboard", job: "show milestones, daily exercises, review schedule, and next action", controls: "complete exercise, regenerate day, copy plan, export buttons" },
      { path: "/practice/[exerciseId]", name: "Practice exercise", job: "guide one focused exercise with instructions, notes, and completion state", controls: "mark done, add note, copy exercise, back to plan" },
      { path: "/review", name: "Review schedule", job: "show due review items and spaced repetition status", controls: "mark reviewed, skip, filter due/upcoming" },
      { path: "/history", name: "Saved learning plans", job: "reopen locally saved plans and progress", controls: "search, open, duplicate, delete" },
    ],
    entities: [
      { name: "LearnerProfile", purpose: "one learner's intake and constraints", fields: ["id", "goal", "subject", "currentLevel", "minutesPerDay", "deadline", "practiceStyle", "weakAreas", "createdAt", "updatedAt"] },
      { name: "LessonPlan", purpose: "personalized learning roadmap", fields: ["id", "learnerProfileId", "title", "milestones", "dailyPlan", "source", "createdAt", "updatedAt"] },
      { name: "PracticeExercise", purpose: "one actionable daily exercise", fields: ["id", "lessonPlanId", "dayIndex", "title", "instructions", "estimatedMinutes", "status", "notes"] },
      { name: "ReviewScheduleItem", purpose: "one spaced review item", fields: ["id", "lessonPlanId", "topic", "dueDate", "status", "reviewPrompt", "completedAt"] },
      { name: "ProgressChecklistItem", purpose: "one learner-visible progress task", fields: ["id", "lessonPlanId", "label", "status", "completedAt"] },
      { name: "GenerationSource", purpose: "records whether the plan came from demo or provider mode", fields: ["mode", "providerName", "model", "generatedAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/lesson-plans", purpose: "generate or regenerate a lesson plan from LearnerProfile input" },
      { method: "GET", path: "/api/lesson-plans/[planId]", purpose: "read one lesson plan when cloud sync is later enabled" },
      { method: "PATCH", path: "/api/practice/[exerciseId]", purpose: "update exercise completion, notes, or regeneration metadata" },
      { method: "PATCH", path: "/api/review/[itemId]", purpose: "mark one review schedule item as done or skipped" },
    ],
    tasks: [
      { title: "Build learner intake and schema", files: ["src/app/page.tsx", "src/components/momentum-lessons/LearnerIntakeForm.tsx", "src/lib/momentum-lessons/schema.ts"], notes: "Collect goal, subject, current level, minutes per day, deadline, practice style, and weak areas. Validate with Zod and keep fields understandable for non-coders.", acceptance: "Learner can submit a valid profile and sees field-level messages for missing goal, level, or time budget.", command: "npm.cmd run lint" },
      { title: "Implement local demo plan generator", files: ["src/lib/momentum-lessons/demo-generator.ts", "src/lib/momentum-lessons/storage.ts"], notes: "Generate deterministic LessonPlan, PracticeExercise, ReviewScheduleItem, and ProgressChecklistItem records without a provider key.", acceptance: "A learner profile produces a complete plan, daily exercises, review schedule, and checklist with no API key.", command: "npm.cmd exec -- tsc --noEmit" },
      { title: "Render lesson plan dashboard", files: ["src/app/plans/[planId]/page.tsx", "src/components/momentum-lessons/LessonPlanDashboard.tsx", "src/components/momentum-lessons/PracticeCard.tsx"], notes: "Show milestones, daily exercises, review items, next action, progress checklist, and copy/export controls.", acceptance: "Learner can complete exercises, see progress update, and copy/export the plan.", command: "npm.cmd run build" },
      { title: "Add review and history flows", files: ["src/app/review/page.tsx", "src/app/history/page.tsx", "src/lib/momentum-lessons/local-plans.ts"], notes: "Persist local progress, due review status, and saved plans. Keep cloud sync optional.", acceptance: "Plans and checklist progress survive refresh; due review items can be marked done or skipped.", command: "npm.cmd run build" },
    ],
    tests: ["Generate a local lesson plan", "Complete one practice exercise", "Mark a review item done", "Save and reopen progress after refresh", "Export the lesson plan Markdown/JSON"],
    primaryAction: "generate a personalized lesson plan and finish the next practice step",
    successMetric: "learner can generate a plan, complete one exercise, mark one review item, and reopen progress in under 5 minutes without an account or API key",
    launchAudience: ["Busy adult learners", "Self-study language learners", "Professionals learning a new skill after work"],
    usesAiProvider: true,
  },
  {
    id: "shop-product-video-app",
    label: "AI product showcase video app",
    keywords: [
      "ai video app",
      "product showcase",
      "showcase video",
      "product photos",
      "shopclip",
      "tiktok shop",
      "shopee",
      "small shops",
      "local retailers",
      "video san pham",
      "anh san pham",
    ],
    targetUsers: "small shop owners, local retailers, Shopee sellers, and TikTok Shop sellers",
    problem: "they need affordable product showcase videos but cannot hire a professional editor for every SKU",
    desiredOutput: "a 30-second product showcase video plan with uploaded product photos, scene-by-scene storyboard, overlay text, music mood, transitions, render status, and downloadable export when rendering is enabled",
    mvp: [
      "Product intake form for 3-6 photos, product name, price, offer, description, target platform, tone, and call to action",
      "Local demo generator that turns product details into a 5-scene storyboard without API keys",
      "Storyboard preview with scene cards, overlay copy, image slot, transition, duration, and music mood",
      "Video job status model that can later connect to Remotion, Cloudinary, or a video provider",
      "Local history of product video briefs and one-click regenerate storyboard",
      "Export storyboard as Markdown/JSON for a human editor or coding agent",
    ],
    avoid: [
      "Full timeline editor, marketplace autopublishing, multi-language dubbing, team approvals, billing, and store writeback",
      "Hard dependency on Supabase, Auth, paid video generation, or API keys for the first demo flow",
      "Generic weekly content planner routes, caption calendars, or social post scheduling as the main workflow",
    ],
    routes: [
      { path: "/", name: "Product video brief", job: "capture product photos, description, price, offer, platform, tone, and CTA", controls: "photo uploader, product fields, platform selector, generate storyboard button" },
      { path: "/create", name: "Storyboard builder", job: "generate and review a 30-second scene plan before rendering", controls: "scene cards, regenerate scene, edit overlay, save brief" },
      { path: "/videos/[id]", name: "Video project detail", job: "show storyboard, job status, export options, and a clear render-disabled download notice", controls: "copy scene script, export JSON, regenerate, mark approved" },
      { path: "/videos", name: "Video history", job: "show saved product video briefs and statuses", controls: "search, platform filter, duplicate, delete, open" },
      { path: "/settings", name: "Optional provider settings", job: "configure script, image, or video providers only after demo mode is useful", controls: "provider toggles, API key fields, demo warning" },
    ],
    entities: [
      { name: "ProductVideoBrief", purpose: "user input for one product showcase video", fields: ["id", "shopName", "productName", "price", "offer", "description", "targetPlatform", "tone", "cta", "photoIds", "createdAt", "updatedAt"] },
      { name: "ProductPhoto", purpose: "uploaded or locally referenced product image", fields: ["id", "briefId", "fileName", "previewUrl", "sortOrder", "altText"] },
      { name: "StoryboardScene", purpose: "one 3-7 second scene in the 30-second video", fields: ["id", "briefId", "sceneIndex", "durationSeconds", "visualPrompt", "overlayText", "voiceover", "transition", "musicCue"] },
      { name: "VideoJob", purpose: "render or provider job status", fields: ["id", "briefId", "status", "provider", "renderUrl", "errorMessage", "createdAt", "updatedAt"] },
      { name: "GenerationSource", purpose: "records whether storyboard came from demo or provider mode", fields: ["mode", "providerName", "model", "generatedAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/video-briefs", purpose: "validate product input and create a local/cloud video brief when server persistence is enabled" },
      { method: "POST", path: "/api/storyboards", purpose: "generate or regenerate a storyboard from product details" },
      { method: "GET", path: "/api/videos/[id]", purpose: "read one video project with storyboard scenes and job status" },
      { method: "PATCH", path: "/api/videos/[id]", purpose: "update edited scene copy, approval status, or render metadata" },
    ],
    tasks: [
      { title: "Build product brief intake and schema", files: ["src/app/page.tsx", "src/app/create/page.tsx", "src/components/product-video/product-brief-form.tsx", "src/lib/product-video/schema.ts"], notes: "Collect 3-6 photos, product name, price, offer, description, target platform, tone, and CTA. Store image previews locally first.", acceptance: "Shop owner can submit a valid product brief and sees useful validation for missing photos or description.", command: "npm.cmd run lint" },
      { title: "Generate local storyboard preview", files: ["src/lib/product-video/demo-storyboard.ts", "src/components/product-video/storyboard-preview.tsx", "src/app/create/page.tsx"], notes: "Create deterministic 5-scene storyboard with overlay text, duration, transition, music mood, and voiceover. No API key required.", acceptance: "A product brief produces a complete 30-second storyboard preview that can be edited and saved.", command: "npm.cmd run build" },
      { title: "Add video project history and detail", files: ["src/app/videos/page.tsx", "src/app/videos/[id]/page.tsx", "src/lib/product-video/local-videos.ts"], notes: "Persist briefs, scenes, and job status locally. Include duplicate/delete/open actions.", acceptance: "Saved video projects reopen after refresh and show storyboard plus status.", command: "npm.cmd exec -- tsc --noEmit" },
      { title: "Prepare optional render/provider boundary", files: ["src/app/api/storyboards/route.ts", "src/app/api/videos/[id]/route.ts", "src/lib/product-video/provider-contract.ts"], notes: "Keep server routes optional. Define provider response schema and fallback to local storyboard when provider fails.", acceptance: "Provider failure returns a clear message and never erases local storyboard data.", command: "npm.cmd run build" },
    ],
    tests: ["Create a product brief with photos", "Generate a 5-scene storyboard", "Edit overlay text", "Save and reopen video history", "Export storyboard Markdown/JSON"],
    primaryAction: "turn product photos and a short description into a 30-second showcase storyboard",
    successMetric: "shop owner can create, edit, save, and export one product video storyboard in under 5 minutes without an API key",
    launchAudience: ["Small shop owners", "Shopee sellers", "TikTok Shop sellers"],
    usesAiProvider: true,
  },
  {
    id: "weekly-social-content-planner",
    label: "Weekly social media content planner",
    keywords: [
      "weekly social media",
      "content planner",
      "content plan",
      "social media content",
      "instagram",
      "tiktok",
      "caption",
      "hashtags",
      "lich noi dung",
      "ke hoach noi dung",
    ],
    targetUsers: "solo creators, freelance social media managers, and small brand teams",
    problem: "they need consistent weekly content ideas, captions, prompts, and posting times without starting from a blank page",
    desiredOutput: "a 7-day social media content plan with captions, hashtag sets, image prompts, short video prompts, and best posting times for Instagram and TikTok",
    mvp: [
      "Planner form for niche, audience, offer, tone, platforms, weekly goal, and posting frequency",
      "Demo/local generation path that creates a useful 7-day plan without API keys",
      "Weekly plan view grouped by day with Instagram and TikTok post cards",
      "Copy buttons for captions, hashtags, image prompts, and short video prompts",
      "Regenerate one day or one post while preserving the rest of the plan",
      "Local history so saved plans reopen after refresh",
    ],
    avoid: [
      "Autopublishing, scheduling, analytics, team approvals, payments, and multi-brand workspaces",
      "Hard dependency on Gemini, OpenRouter, Supabase, Auth, or API keys for the core demo flow",
      "Generic item CRUD screens that do not show weekly content planning structure",
    ],
    routes: [
      { path: "/", name: "Planner start", job: "capture the creator's niche, audience, platforms, offer, tone, and weekly goal", controls: "planner form, sample brief button, generate button" },
      { path: "/plan/new", name: "New weekly plan", job: "let the user review inputs and generate a 7-day plan", controls: "platform toggles, frequency selector, tone menu, generate button" },
      { path: "/plan/[id]", name: "Weekly plan detail", job: "show seven days of captions, hashtags, prompts, and posting times", controls: "copy buttons, regenerate day, edit post, save" },
      { path: "/history", name: "Saved plans", job: "show locally saved weekly plans", controls: "search, platform filter, open, duplicate, delete" },
      { path: "/settings", name: "Optional provider settings", job: "configure Gemini/OpenRouter only after demo mode is useful", controls: "provider toggle, API key fields, demo mode warning" },
    ],
    entities: [
      { name: "PlanInput", purpose: "user brief for one weekly content plan", fields: ["id", "niche", "audience", "offer", "tone", "platforms", "weeklyGoal", "postingFrequency"] },
      { name: "ContentPlan", purpose: "saved 7-day plan", fields: ["id", "title", "input", "days", "source", "createdAt", "updatedAt"] },
      { name: "PlanDay", purpose: "one calendar day in the weekly plan", fields: ["id", "dayIndex", "dateLabel", "theme", "posts"] },
      { name: "SocialPost", purpose: "one Instagram or TikTok content idea", fields: ["id", "platform", "caption", "hashtags", "imagePrompt", "videoPrompt", "bestPostingTime"] },
      { name: "PlatformSettings", purpose: "platform-specific preferences", fields: ["platform", "enabled", "postingTimes", "captionLength"] },
      { name: "GenerationSource", purpose: "records whether a plan came from demo or provider mode", fields: ["mode", "providerName", "model", "generatedAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/generate-plan", purpose: "generate or regenerate a weekly content plan from the planner input" },
      { method: "GET", path: "/api/plans/[id]", purpose: "read one saved content plan when cloud sync is later enabled" },
      { method: "PATCH", path: "/api/plans/[id]", purpose: "update edited captions, hashtags, prompts, or saved metadata" },
    ],
    tasks: [
      { title: "Build planner form and typed plan schema", files: ["src/app/page.tsx", "src/app/plan/new/page.tsx", "src/components/content-planner/planner-form.tsx", "src/lib/content-planner/schema.ts"], notes: "Collect niche, audience, offer, tone, platform mix, weekly goal, and posting frequency. Keep defaults useful for non-coders.", acceptance: "User can submit a valid planner brief and see validation messages for missing required fields.", command: "npm.cmd run lint" },
      { title: "Implement demo weekly plan generation", files: ["src/lib/content-planner/demo-generator.ts", "src/app/api/generate-plan/route.ts"], notes: "Return deterministic 7-day JSON in demo mode before calling any provider. Provider mode may use Gemini later but must fall back to demo.", acceptance: "POST /api/generate-plan returns seven PlanDay records with SocialPost cards and no API key is required for demo mode.", command: "npm.cmd exec -- tsc --noEmit" },
      { title: "Render weekly plan detail and copy actions", files: ["src/app/plan/[id]/page.tsx", "src/components/content-planner/weekly-plan-view.tsx", "src/components/content-planner/post-card.tsx"], notes: "Show day sections, platform badges, captions, hashtags, prompts, posting times, and copy/regenerate controls.", acceptance: "User can view a full weekly plan and copy captions, hashtags, image prompts, and video prompts.", command: "npm.cmd run build" },
      { title: "Add local saved history", files: ["src/app/history/page.tsx", "src/lib/content-planner/local-plans.ts"], notes: "Persist generated plans locally first and support open, duplicate, and delete.", acceptance: "Saved plans reopen after refresh and can be searched from history.", command: "npm.cmd run build" },
    ],
    tests: ["Generate a demo weekly plan", "Copy a caption", "Copy hashtags", "Regenerate one day", "Save and reopen plan history"],
    primaryAction: "generate a weekly social media content plan",
    successMetric: "user can generate, edit, copy, and reopen a complete 7-day Instagram/TikTok plan in under 5 minutes",
    launchAudience: ["Solo creators", "Freelance social media managers", "Small brand teams"],
    usesAiProvider: true,
  },
  {
    id: "english-video-style-lesson",
    label: "Local-first English video-style lesson app",
    keywords: [
      "video-style",
      "video style",
      "local-first english video-style lesson app",
      "timed vocabulary",
      "timed vocabulary cards",
      "timed cards",
      "lesson player",
      "video lesson",
      "slide lesson",
      "web speech",
      "hear button",
      "narration text",
      "vietnamese meaning",
      "no real video rendering",
      "hoc tu vung tieng anh moi ngay",
      "ung dung dung de hoc tu vung tieng anh moi ngay",
    ],
    targetUsers: "beginner English learners, students, and busy adults who want short daily vocabulary practice",
    problem: "they want a lightweight way to practice English vocabulary with video-like rhythm without paying for real video generation",
    desiredOutput: "a local-first video-style lesson player with timed vocabulary cards, Vietnamese meanings, examples, narration text, Web Speech playback, and saved local progress",
    mvp: [
      "Seed one daily English vocabulary lesson in local JSON/TypeScript data",
      "Lesson library screen with the seeded lesson and resume state",
      "Video-style player that advances timed cards with play, pause, next, previous, and restart controls",
      "Each card shows optional image, English word, Vietnamese meaning, example sentence, narration text, and duration",
      "Web Speech API hear button for the current word or narration text",
      "Local-first persistence for edited lessons, playback state, and completion progress",
    ],
    avoid: [
      "Real video rendering, FFmpeg, Remotion export, cloud media storage, or AI video APIs",
      "Supabase, Auth, Gemini, OpenRouter, API keys, accounts, payments, and cloud sync in the core MVP",
      "Topic/quiz/progress routes unless they are added after the player workflow is proven",
    ],
    routes: [
      { path: "/", name: "Lesson library", job: "show the daily lesson, resume state, and start action", controls: "start lesson button, resume button, local reset action" },
      { path: "/lesson/[lessonId]", name: "Video-style lesson player", job: "play timed vocabulary cards like a lightweight video lesson", controls: "play, pause, next, previous, restart, hear button" },
      { path: "/lesson/[lessonId]/edit", name: "Lesson editor", job: "let the user edit local cards and save them in the browser", controls: "card list, duration input, text fields, save/reset buttons" },
    ],
    entities: [
      { name: "VideoLesson", purpose: "one local-first vocabulary lesson", fields: ["id", "title", "description", "cards", "createdAt", "updatedAt"] },
      { name: "LessonCard", purpose: "one timed slide in the lesson player", fields: ["id", "word", "meaningVi", "example", "narration", "durationSeconds", "imageUrl"] },
      { name: "PlaybackState", purpose: "resume and completion state", fields: ["lessonId", "currentCardIndex", "isCompleted", "lastPlayedAt", "completedAt"] },
      { name: "LocalLessonStore", purpose: "browser persistence wrapper", fields: ["lessons", "playbackStates", "schemaVersion", "updatedAt"] },
    ],
    apiEndpoints: [],
    tasks: [
      { title: "Create lesson schema and seed content", files: ["src/lib/lesson-schema.ts", "src/data/seed-lessons.ts"], notes: "Define VideoLesson, LessonCard, PlaybackState, and seed one daily vocabulary lesson with 5 timed cards.", acceptance: "The seed lesson has optional image, word, Vietnamese meaning, example, narration, and duration for every card.", command: "npm.cmd exec -- tsc --noEmit" },
      { title: "Build the video-style lesson player", files: ["src/app/page.tsx", "src/app/lesson/[lessonId]/page.tsx", "src/components/lesson-player.tsx"], notes: "Implement play, pause, next, previous, restart, timed card advancement, and responsive layout without real video rendering.", acceptance: "A learner can start the seeded lesson and navigate all timed cards on mobile and desktop.", command: "npm.cmd run build" },
      { title: "Add local persistence and Web Speech playback", files: ["src/lib/local-lessons.ts", "src/components/speak-button.tsx"], notes: "Persist edited lessons and playback state in IndexedDB or localStorage; use Web Speech API for hear buttons.", acceptance: "Lesson edits and playback progress survive refresh, and speaking works without an API key.", command: "npm.cmd run lint" },
    ],
    tests: ["Open the lesson library", "Play and pause timed cards", "Use next, previous, and restart", "Hear narration with Web Speech API", "Refresh and resume progress"],
    primaryAction: "play today's video-style vocabulary lesson",
    successMetric: "learner can finish one 5-card video-style lesson in under 5 minutes without an account or API key",
    launchAudience: ["Beginner English learners", "Students practicing vocabulary", "Busy adults learning during short breaks"],
    usesAiProvider: false,
  },
  {
    id: "english-learning",
    label: "English learning app",
    keywords: ["english", "tieng anh", "vocabulary", "listening", "quiz", "learn language", "hoc ngoai ngu"],
    targetUsers: "beginner English learners, students, and busy adults practicing in short daily sessions",
    problem: "they want simple daily English practice without joining a full course or installing a complicated LMS",
    desiredOutput: "a working daily learning flow with topic lessons, vocabulary, listening practice, quiz scoring, and progress tracking",
    mvp: [
      "Home dashboard with today's short lesson and visible progress",
      "Topic list seeded locally with beginner vocabulary themes",
      "Lesson screen with 8 words, Vietnamese meanings, examples, and browser speech playback",
      "Five-question quiz with instant feedback and saved score",
      "Progress page with completed topics, latest score, and daily streak",
    ],
    avoid: [
      "Teacher dashboards, certificates, live classes, payments, and full LMS features",
      "Paid AI tutoring, real audio hosting, or account sync before the local learning loop works",
    ],
    routes: [
      { path: "/", name: "Daily lesson dashboard", job: "show today's lesson, streak, and next action", controls: "start lesson button, topic shortcut, progress link" },
      { path: "/topics", name: "Topic list", job: "let learners choose greetings, school, work, food, or travel", controls: "topic cards, completion badges, search/filter" },
      { path: "/topics/[topic]", name: "Lesson", job: "teach vocabulary and listening examples for one topic", controls: "play audio buttons, mark learned, start quiz" },
      { path: "/topics/[topic]/quiz", name: "Quiz", job: "test understanding with five short questions", controls: "answer choices, next question, score summary" },
      { path: "/progress", name: "Progress", job: "show completed lessons, streak, and latest score", controls: "reset demo data, continue learning" },
    ],
    entities: [
      { name: "LessonTopic", purpose: "seeded lesson content grouped by theme", fields: ["id", "title", "description", "words", "listeningSentences", "quizQuestions"] },
      { name: "VocabularyWord", purpose: "one teachable word or phrase", fields: ["english", "vietnamese", "example", "pronunciationHint"] },
      { name: "QuizQuestion", purpose: "one multiple-choice check", fields: ["id", "prompt", "choices", "answer", "explanation"] },
      { name: "ProgressRecord", purpose: "local learner progress", fields: ["topicId", "completedAt", "score", "streakDay", "lastPracticedAt"] },
    ],
    apiEndpoints: [
      { method: "GET", path: "/api/topics", purpose: "return seeded lesson topics for optional server rendering or later sync" },
      { method: "POST", path: "/api/progress", purpose: "save completed lesson, quiz score, and streak metadata" },
      { method: "GET", path: "/api/progress", purpose: "read local/cloud progress when sync is added" },
    ],
    tasks: [
      { title: "Build seeded lessons and topic navigation", files: ["src/data/lessons.ts", "src/app/page.tsx", "src/app/topics/page.tsx"], notes: "Seed five beginner topics and render dense, mobile-safe topic navigation.", acceptance: "Learner can open the app, pick a topic, and see whether it is completed.", command: "npm.cmd run build" },
      { title: "Build lesson and listening practice", files: ["src/app/topics/[topic]/page.tsx", "src/components/learning/SpeechButton.tsx", "src/lib/lessons.ts"], notes: "Use the Web Speech API for audio so the MVP needs no paid provider.", acceptance: "Each lesson shows words, meanings, examples, and play buttons for short sentences.", command: "npm.cmd run lint" },
      { title: "Add quiz scoring", files: ["src/app/topics/[topic]/quiz/page.tsx", "src/lib/quiz.ts"], notes: "Keep the quiz five questions with instant correct/incorrect feedback.", acceptance: "Quiz saves a score and shows explanations after completion.", command: "npx tsc --noEmit" },
      { title: "Add daily progress", files: ["src/lib/progress.ts", "src/app/progress/page.tsx"], notes: "Store progress in localStorage first with a small typed wrapper.", acceptance: "Progress page shows completed topics, latest score, and current streak.", command: "npm.cmd run build" },
    ],
    tests: ["Complete one daily lesson", "Play a listening sentence", "Finish a five-question quiz", "Open progress after refresh"],
    primaryAction: "start today's lesson",
    successMetric: "learner completes one lesson in under 10 minutes and returns the next day",
    launchAudience: ["Students learning beginner English", "Busy adults practicing during breaks", "Parents testing a simple learning site for children"],
  },
  {
    id: "clinic-appointment-intake",
    label: "Clinic appointment intake app",
    keywords: [
      "clinic appointment",
      "patient intake",
      "small clinics",
      "clinic app",
      "medical appointment",
      "visit notes",
      "appointment status",
      "patient forms",
      "doctor schedule",
      "healthcare appointment",
    ],
    targetUsers: "small clinic reception teams, nurses, and clinic owners managing patient visits",
    problem: "patient intake, appointment requests, and visit status updates are scattered across phone calls, paper forms, and chat messages",
    desiredOutput: "a clinic-safe appointment intake workflow with patient request form, staff schedule board, appointment status tracker, visit note export, and privacy checklist",
    mvp: [
      "Patient appointment request form for contact details, visit reason, preferred date/time, consent, and urgency",
      "Clinic staff queue with pending, confirmed, checked-in, completed, cancelled, and no-show states",
      "Appointment detail view with patient intake summary, internal staff notes, visit status, and exportable visit note",
      "Daily schedule board grouped by time slot and appointment status",
      "Local demo storage so staff can test the workflow without accounts or medical system integrations",
      "Privacy and safety checklist that forbids diagnosis automation and keeps PHI out of logs",
    ],
    avoid: [
      "Diagnosis automation, medical advice, insurance claims, EHR integrations, payments, and patient portal accounts in the MVP",
      "Hard dependency on Supabase, Auth, SMS, email, or third-party clinical APIs for the first local demo flow",
      "Generic booking-only screens that omit patient intake, consent, staff notes, visit status, and privacy constraints",
    ],
    routes: [
      { path: "/", name: "Patient intake request", job: "capture appointment request, visit reason, consent, and preferred time", controls: "patient form, urgency selector, consent checkbox, submit button" },
      { path: "/appointments", name: "Clinic schedule board", job: "show appointment queue by date, time, status, and urgency", controls: "date selector, status filters, confirm/cancel/check-in actions" },
      { path: "/appointments/[appointmentId]", name: "Appointment detail", job: "review patient intake, staff notes, status history, and visit note export", controls: "update status, add internal note, export visit note, copy summary" },
      { path: "/privacy", name: "Privacy checklist", job: "show launch constraints for patient data, logs, exports, and future cloud sync", controls: "checklist toggles, export privacy notes" },
    ],
    entities: [
      { name: "PatientIntake", purpose: "patient-submitted appointment request and consent", fields: ["id", "patientName", "phone", "email", "visitReason", "urgency", "preferredDate", "preferredTime", "consentAccepted", "createdAt"] },
      { name: "ClinicAppointment", purpose: "staff-managed visit slot and status", fields: ["id", "patientIntakeId", "scheduledAt", "status", "assignedStaff", "internalNotes", "updatedAt"] },
      { name: "VisitNote", purpose: "exportable non-diagnostic visit note draft", fields: ["id", "appointmentId", "summary", "followUpNeeded", "exportedAt", "createdAt"] },
      { name: "StatusEvent", purpose: "audit event for appointment status changes", fields: ["id", "appointmentId", "fromStatus", "toStatus", "note", "createdAt"] },
      { name: "PrivacyChecklistItem", purpose: "launch safety checklist for patient data handling", fields: ["id", "label", "status", "riskLevel", "notes"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/patient-intakes", purpose: "validate and save a patient appointment request" },
      { method: "GET", path: "/api/appointments", purpose: "list appointments by date, status, and urgency" },
      { method: "GET", path: "/api/appointments/[appointmentId]", purpose: "read one appointment with intake, status events, and visit note" },
      { method: "PATCH", path: "/api/appointments/[appointmentId]", purpose: "update appointment status, assigned staff, or internal note" },
      { method: "POST", path: "/api/visit-notes", purpose: "create an exportable non-diagnostic visit note draft" },
    ],
    tasks: [
      { title: "Build patient intake form and schema", files: ["src/app/page.tsx", "src/components/clinic/PatientIntakeForm.tsx", "src/lib/clinic/schema.ts"], notes: "Collect contact details, visit reason, urgency, preferred time, and consent. Avoid medical advice or diagnosis fields.", acceptance: "Patient can submit a valid intake request and staff can see clear validation for missing consent or contact details.", command: "npm.cmd run lint" },
      { title: "Implement local appointment storage and status events", files: ["src/lib/clinic/storage.ts", "src/lib/clinic/status.ts"], notes: "Persist PatientIntake, ClinicAppointment, StatusEvent, and VisitNote locally with typed helpers.", acceptance: "Appointment status changes from pending to confirmed/check-in/completed and survives refresh.", command: "npm.cmd exec -- tsc --noEmit" },
      { title: "Render clinic schedule and appointment detail", files: ["src/app/appointments/page.tsx", "src/app/appointments/[appointmentId]/page.tsx", "src/components/clinic/ClinicScheduleBoard.tsx", "src/components/clinic/AppointmentDetail.tsx"], notes: "Show daily queue, urgency, status actions, intake summary, staff notes, and visit note export.", acceptance: "Staff can filter appointments, open one appointment, update status, add note, and export a visit note.", command: "npm.cmd run build" },
      { title: "Add privacy checklist and export guardrails", files: ["src/app/privacy/page.tsx", "src/lib/clinic/privacy-checklist.ts", "src/lib/clinic/export.ts"], notes: "Document no diagnosis automation, no PHI in logs, local-first limitations, and future RLS requirements.", acceptance: "Privacy page names the main patient-data risks and exports a readable launch checklist.", command: "npm.cmd run build" },
    ],
    tests: ["Submit patient intake", "Confirm appointment", "Check in patient", "Export visit note", "Review privacy checklist", "Reopen schedule after refresh"],
    primaryAction: "capture a patient appointment request and let staff manage it through visit status",
    successMetric: "clinic staff can turn one patient intake into a confirmed appointment and export a visit note in under five minutes without cloud services",
    launchAudience: ["Small clinic reception teams", "Independent practices", "Clinic owners validating a lighter intake workflow"],
    usesAiProvider: false,
  },
  {
    id: "freelancer-crm",
    label: "Local CRM for freelancers",
    keywords: [
      "local crm",
      "crm for freelancers",
      "freelancer crm",
      "freelancers",
      "consultants",
      "client pipeline",
      "client follow-up",
      "follow ups",
      "deal pipeline",
      "leads",
      "client notes",
      "invoice reminders",
      "proposal tracking",
    ],
    targetUsers: "freelancers, consultants, and solo service providers managing clients without a heavy sales platform",
    problem: "client conversations, proposal status, unpaid invoices, and follow-up reminders are scattered across email, chat, spreadsheets, and memory",
    desiredOutput: "a local-first CRM workflow with client records, lead/deal pipeline, follow-up reminders, proposal status, invoice notes, lightweight dashboard, and exportable client history",
    mvp: [
      "Client intake form for name, company, contact channel, service need, budget range, relationship stage, next follow-up date, and notes",
      "Pipeline board with lead, qualified, proposal sent, won, paused, and lost columns",
      "Client detail view with timeline notes, proposal status, invoice reminder, follow-up checklist, and copyable client summary",
      "Today view for due follow-ups, stale deals, unpaid invoice notes, and high-value opportunities",
      "Local browser storage and CSV/JSON export so the freelancer can use the CRM without accounts or API keys",
      "Optional provider-generated follow-up drafts only after the local CRM workflow works",
    ],
    avoid: [
      "Team sales permissions, enterprise CRM sync, cold email automation, billing subscriptions, and complex reporting in the MVP",
      "Hard dependency on HubSpot, Salesforce, Supabase, Auth, email APIs, or AI provider keys for the first local workflow",
      "Generic item CRUD screens that do not show clients, follow-ups, deals, proposals, invoices, and freelancer workflow context",
    ],
    routes: [
      { path: "/", name: "Freelancer CRM dashboard", job: "show due follow-ups, active pipeline value, stale deals, and quick add client action", controls: "today filter, stage filter, add client button, export menu" },
      { path: "/clients/new", name: "Add client or lead", job: "capture a new lead/client with service need, budget, stage, and next action", controls: "client form, stage selector, next follow-up date, save button" },
      { path: "/clients", name: "Client pipeline", job: "scan leads and clients by stage, value, due follow-up, and proposal status", controls: "pipeline columns, search, stage filters, open client" },
      { path: "/clients/[clientId]", name: "Client detail", job: "review contact info, notes timeline, deal stage, proposal/invoice state, and next follow-up", controls: "add note, move stage, mark follow-up done, copy summary, export JSON" },
      { path: "/follow-ups", name: "Follow-up queue", job: "work today's due follow-ups and stale client opportunities", controls: "due today filter, snooze, mark done, copy outreach draft" },
    ],
    entities: [
      { name: "Client", purpose: "freelancer's client or sales lead", fields: ["id", "name", "company", "email", "phone", "contactChannel", "serviceNeed", "budgetRange", "stage", "createdAt", "updatedAt"] },
      { name: "Deal", purpose: "pipeline opportunity attached to a client", fields: ["id", "clientId", "title", "value", "stage", "proposalStatus", "invoiceStatus", "expectedCloseDate", "updatedAt"] },
      { name: "FollowUp", purpose: "next action reminder for a client", fields: ["id", "clientId", "dealId", "dueDate", "channel", "messageGoal", "status", "completedAt", "createdAt"] },
      { name: "ClientNote", purpose: "timeline note for meetings, calls, proposals, and invoice context", fields: ["id", "clientId", "type", "body", "createdAt", "createdBy"] },
      { name: "CrmExport", purpose: "exportable local snapshot of client pipeline data", fields: ["id", "format", "recordCount", "exportedAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/clients", purpose: "validate and save a client locally or through an optional backend later" },
      { method: "GET", path: "/api/clients/[clientId]", purpose: "read one client with deals, follow-ups, and notes" },
      { method: "PATCH", path: "/api/deals/[dealId]", purpose: "update deal stage, proposal status, invoice status, or expected close date" },
      { method: "POST", path: "/api/follow-ups", purpose: "create or complete a client follow-up reminder" },
      { method: "POST", path: "/api/export/crm", purpose: "produce CSV or JSON from local CRM records" },
    ],
    tasks: [
      { title: "Build local CRM data model and storage", files: ["src/lib/freelancer-crm/schema.ts", "src/lib/freelancer-crm/local-store.ts", "src/lib/freelancer-crm/export.ts"], notes: "Define Client, Deal, FollowUp, ClientNote, and export helpers. Keep all records in browser storage for the MVP.", acceptance: "A sample client with deal, note, and follow-up can be saved, reloaded after refresh, and exported without API keys.", command: "npm.cmd exec -- tsc --noEmit" },
      { title: "Build dashboard and add-client flow", files: ["src/app/page.tsx", "src/app/clients/new/page.tsx", "src/components/freelancer-crm/CrmDashboard.tsx", "src/components/freelancer-crm/ClientForm.tsx"], notes: "Show due follow-ups, stage counts, stale deals, and a compact add-client form with validation.", acceptance: "Freelancer can add a lead/client, assign a stage, set next follow-up, and see it on the dashboard.", command: "npm.cmd run lint" },
      { title: "Build pipeline and client detail", files: ["src/app/clients/page.tsx", "src/app/clients/[clientId]/page.tsx", "src/components/freelancer-crm/PipelineBoard.tsx", "src/components/freelancer-crm/ClientDetail.tsx"], notes: "Render pipeline columns, notes timeline, proposal/invoice status, follow-up actions, and copyable client summary.", acceptance: "User can move a deal stage, add a note, mark a follow-up done, copy a summary, and reopen the client after refresh.", command: "npm.cmd run build" },
      { title: "Add follow-up queue and export checks", files: ["src/app/follow-ups/page.tsx", "src/components/freelancer-crm/FollowUpQueue.tsx", "src/lib/freelancer-crm/export.ts"], notes: "Create a focused queue for due follow-ups and CSV/JSON exports.", acceptance: "Due follow-ups can be filtered, snoozed, completed, and exported with no provider dependency.", command: "npm.cmd run build" },
    ],
    tests: ["Add client lead", "Move deal stage", "Add client note", "Complete follow-up", "Export CRM CSV/JSON", "Reopen client after refresh"],
    primaryAction: "capture a client lead and move it through a local follow-up pipeline",
    successMetric: "a freelancer can add one client, schedule a follow-up, update proposal/invoice status, copy a client summary, and export records in under five minutes without accounts or API keys",
    launchAudience: ["Freelancers", "Independent consultants", "Solo agencies"],
    usesAiProvider: false,
  },
  {
    id: "habit-tracker-mobile",
    label: "Habit tracker mobile app",
    keywords: [
      "habit tracker",
      "habit tracking",
      "mobile habit",
      "daily habits",
      "streaks",
      "check-ins",
      "routine",
      "wellness tracker",
      "reminders",
      "progress",
      "ios",
      "android",
      "mobile app",
    ],
    targetUsers: "mobile-first users who want a simple daily habit routine with visible streaks and low-friction check-ins",
    problem: "habit tracking breaks down when check-ins take too long, streaks are unclear, and missed days feel punishing instead of recoverable",
    desiredOutput: "a mobile-first habit tracker plan with habit setup, daily check-ins, streak logic, progress calendar, gentle reminders, offline/local persistence, and exportable progress summary",
    mvp: [
      "Mobile-first habit setup for name, frequency, daily target, reminder preference, color, and start date",
      "Today check-in screen with one-tap complete, skip with reason, partial progress, and reset-safe streak display",
      "Progress calendar showing completed, skipped, missed, and partial days",
      "Habit detail screen with streak, completion rate, recent notes, and edit/archive actions",
      "Local/offline storage so habits and check-ins survive refresh or temporary network loss",
      "Exportable weekly progress summary for personal review",
    ],
    avoid: [
      "Social leaderboards, paid coaching, wearable integrations, complex gamification, and push notification infrastructure in the first MVP",
      "Hard dependency on native app stores, Supabase, Auth, paid notification providers, or AI provider keys for the first local workflow",
      "Generic saved-record screens that do not show habits, check-ins, streaks, reminders, calendar progress, and mobile UX states",
    ],
    routes: [
      { path: "/", name: "Today habits", job: "show today's habit cards, streaks, and one-tap check-in actions", controls: "complete, partial, skip, add habit, filter active/archived" },
      { path: "/habits/new", name: "Create habit", job: "capture habit name, frequency, target, reminder preference, and color", controls: "habit form, frequency segmented control, save button" },
      { path: "/habits/[habitId]", name: "Habit detail", job: "review streak, completion calendar, notes, edit/archive controls, and weekly summary", controls: "calendar grid, edit, archive, export summary" },
      { path: "/progress", name: "Progress calendar", job: "compare habits by week, completion rate, and missed-day recovery", controls: "week switcher, habit filter, export progress" },
      { path: "/settings", name: "Reminder settings", job: "configure local reminder copy and future push-notification readiness", controls: "quiet hours, reminder text, local storage reset" },
    ],
    entities: [
      { name: "Habit", purpose: "trackable recurring behavior", fields: ["id", "name", "frequency", "dailyTarget", "color", "reminderTime", "status", "createdAt", "updatedAt"] },
      { name: "HabitCheckIn", purpose: "one daily completion, partial, skip, or missed state", fields: ["id", "habitId", "date", "status", "quantity", "note", "createdAt"] },
      { name: "StreakSummary", purpose: "derived streak and completion metrics", fields: ["habitId", "currentStreak", "bestStreak", "completionRate", "lastCompletedDate", "missedDays"] },
      { name: "ReminderPreference", purpose: "local reminder configuration before push notifications", fields: ["habitId", "enabled", "time", "quietHoursStart", "quietHoursEnd", "message"] },
      { name: "ProgressExport", purpose: "weekly progress export metadata", fields: ["id", "weekStart", "habitCount", "completionRate", "exportedAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/habits", purpose: "validate and save a habit for future backend extension" },
      { method: "POST", path: "/api/check-ins", purpose: "record complete, partial, skip, or missed check-in" },
      { method: "GET", path: "/api/habits/[habitId]/progress", purpose: "read streak summary and calendar check-ins" },
      { method: "PATCH", path: "/api/habits/[habitId]", purpose: "edit habit settings or archive a habit" },
      { method: "POST", path: "/api/export/progress", purpose: "export weekly habit progress summary" },
    ],
    tasks: [
      { title: "Build habit schema, streak engine, and local storage", files: ["src/lib/habits/schema.ts", "src/lib/habits/streaks.ts", "src/lib/habits/local-store.ts"], notes: "Define Habit, HabitCheckIn, StreakSummary, ReminderPreference, and deterministic streak calculation from check-ins.", acceptance: "Streaks update correctly for complete, partial, skipped, and missed days and survive refresh in local storage.", command: "npm.cmd exec -- tsc --noEmit" },
      { title: "Build mobile Today screen and habit creation", files: ["src/app/page.tsx", "src/app/habits/new/page.tsx", "src/components/habits/TodayHabitList.tsx", "src/components/habits/HabitForm.tsx"], notes: "Use compact mobile-safe cards, one-tap actions, segmented frequency controls, and clear empty states.", acceptance: "User can create a habit, complete today's check-in, skip with a reason, and see streak feedback without account setup.", command: "npm.cmd run lint" },
      { title: "Build habit detail and progress calendar", files: ["src/app/habits/[habitId]/page.tsx", "src/app/progress/page.tsx", "src/components/habits/HabitDetail.tsx", "src/components/habits/ProgressCalendar.tsx"], notes: "Render completion calendar, streak summary, weekly progress, notes, edit/archive controls, and export action.", acceptance: "User can inspect a habit's progress, edit/archive it, export a weekly summary, and verify no text overlaps on mobile.", command: "npm.cmd run build" },
      { title: "Add reminder settings and offline fallback notes", files: ["src/app/settings/page.tsx", "src/components/habits/ReminderSettings.tsx", "src/lib/habits/export.ts"], notes: "Keep reminders as local copy/settings in MVP and document push notifications as a later native milestone.", acceptance: "Reminder settings save locally, exports omit secrets, and push notifications are clearly not required for MVP.", command: "npm.cmd run build" },
    ],
    tests: ["Create habit", "Complete today's check-in", "Skip with reason", "Verify streak calculation", "Open progress calendar", "Export weekly progress", "Reopen habits after refresh"],
    primaryAction: "create a habit and complete a low-friction daily check-in on mobile",
    successMetric: "a mobile user can create three habits, complete today's check-ins, understand streak state, and export a weekly progress summary without login or network access",
    launchAudience: ["People starting personal routines", "Wellness creators testing a simple tracker", "Mobile-first productivity users"],
    usesAiProvider: false,
  },
  {
    id: "booking",
    label: "Booking app",
    keywords: ["booking", "appointment", "lich hen", "dat lich", "reservation", "salon", "clinic booking"],
    targetUsers: "customers booking from mobile and staff who manage daily appointments",
    problem: "requests are scattered across chat messages and staff cannot see a reliable schedule",
    desiredOutput: "a booking flow, request status tracker, staff calendar, and CSV export",
    mvp: ["Mobile booking form", "Available time slots", "Owner/staff request list", "Status update workflow", "CSV export"],
    avoid: ["Marketplace discovery, deposits, loyalty points, and complex staff payroll"],
    routes: [
      { path: "/", name: "Booking form", job: "capture customer, service, date, and note", controls: "date picker, service selector, submit button" },
      { path: "/requests", name: "Request list", job: "let staff scan pending and confirmed bookings", controls: "status filters, approve/decline buttons" },
      { path: "/calendar", name: "Schedule", job: "show daily appointments", controls: "day switcher, status badges" },
    ],
    entities: [
      { name: "Service", purpose: "bookable service", fields: ["id", "name", "durationMinutes", "price"] },
      { name: "BookingRequest", purpose: "customer request", fields: ["id", "customerName", "phone", "serviceId", "requestedAt", "status", "note"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/bookings", purpose: "create a booking request" },
      { method: "GET", path: "/api/bookings", purpose: "list bookings by date and status" },
      { method: "PATCH", path: "/api/bookings/[id]", purpose: "update booking status" },
    ],
    tasks: [
      { title: "Build customer booking form", files: ["src/app/page.tsx", "src/components/booking/BookingForm.tsx"], notes: "Keep the form short and mobile-first.", acceptance: "Customer can submit a valid request and see confirmation.", command: "npm.cmd run build" },
      { title: "Build staff request board", files: ["src/app/requests/page.tsx", "src/lib/bookings.ts"], notes: "Use localStorage for MVP storage.", acceptance: "Staff can approve, decline, and filter requests.", command: "npm.cmd run lint" },
      { title: "Add calendar and export", files: ["src/app/calendar/page.tsx", "src/lib/export-bookings.ts"], notes: "Show a simple daily schedule and CSV export.", acceptance: "Confirmed bookings appear on calendar and export correctly.", command: "npx tsc --noEmit" },
    ],
    tests: ["Create booking", "Approve booking", "Filter by status", "Export CSV"],
    primaryAction: "submit a booking request",
    successMetric: "staff can process a request from pending to confirmed in under two minutes",
    launchAudience: ["Local service owners", "Salon staff", "Small clinic reception teams"],
  },
  {
    id: "inventory-approval",
    label: "Inventory approval app",
    keywords: ["inventory", "warehouse", "purchasing", "approval", "stock", "kho", "hang ton", "quan ly kho", "phe duyet", "mua hang"],
    targetUsers: "operations managers, purchasing staff, and warehouse supervisors",
    problem: "inventory requests get lost in chat and approvals are hard to audit",
    desiredOutput: "request intake, approval workflow, audit trail, role-light views, and exportable records",
    mvp: ["Request form", "Approval queue", "Inventory item list", "Audit log", "CSV export"],
    avoid: ["ERP integration, barcode scanning, advanced forecasting, and complex permissions"],
    routes: [
      { path: "/", name: "Request dashboard", job: "show pending requests and key counts", controls: "new request button, status tabs" },
      { path: "/requests/new", name: "New request", job: "capture item, quantity, reason, and urgency", controls: "item selector, quantity input, submit button" },
      { path: "/approvals", name: "Approval queue", job: "approve or reject requests with notes", controls: "approve/reject buttons, note field" },
      { path: "/audit", name: "Audit trail", job: "show all status changes", controls: "filters, CSV export" },
    ],
    entities: [
      { name: "InventoryItem", purpose: "tracked item", fields: ["id", "sku", "name", "currentStock", "minimumStock"] },
      { name: "InventoryRequest", purpose: "purchase or stock movement request", fields: ["id", "itemId", "quantity", "reason", "status", "requestedBy"] },
      { name: "AuditEvent", purpose: "approval history", fields: ["id", "requestId", "actor", "action", "note", "createdAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/requests", purpose: "create an inventory request" },
      { method: "PATCH", path: "/api/requests/[id]/status", purpose: "approve or reject a request" },
      { method: "GET", path: "/api/audit", purpose: "read audit events" },
    ],
    tasks: [
      { title: "Build request intake and seed items", files: ["src/data/inventory.ts", "src/app/requests/new/page.tsx"], notes: "Seed items locally and validate quantity/reason.", acceptance: "User can create a pending request.", command: "npm.cmd run build" },
      { title: "Build approval queue", files: ["src/app/approvals/page.tsx", "src/lib/requests.ts"], notes: "Every status change writes an audit event.", acceptance: "Approver can approve/reject and see updated status.", command: "npm.cmd run lint" },
      { title: "Add audit and export", files: ["src/app/audit/page.tsx", "src/lib/export-audit.ts"], notes: "Keep audit records append-only in the local MVP.", acceptance: "Audit page lists changes and exports CSV.", command: "npx tsc --noEmit" },
    ],
    tests: ["Submit request", "Approve request", "Reject with note", "Export audit CSV"],
    primaryAction: "submit an inventory request",
    successMetric: "a request can be submitted, approved, audited, and exported without chat messages",
    launchAudience: ["Small warehouse teams", "Purchasing teams", "Operations managers"],
  },
];

export function deriveProjectProfile(input: ProjectInput, template: AppTemplate): ProjectProfile {
  const preset = bestPresetForInput(input);
  const fallback = preset ?? genericProfile(input, template);
  const label = preset?.label ?? template.label;
  const desiredOutput = input.desiredOutput?.trim() || fallback.desiredOutput;
  const targetUsers = input.targetUsers?.trim() || fallback.targetUsers;
  const problem = input.problem?.trim() || fallback.problem;

  return {
    ...fallback,
    label,
    slug: slugify(label),
    targetUsers,
    problem,
    desiredOutput,
    usesAiProvider: fallback.usesAiProvider ?? (label.toLowerCase().includes("ai") || input.apiProviders.length > 0),
  };
}

export function completeProjectInput(input: ProjectInput, profile: ProjectProfile): ProjectInput {
  const preferredStack = inferPreferredStack(input, profile);
  const apiProviders = inferApiProviders(input, profile);
  return {
    ...input,
    appType: shouldUseInferredAppType(input, profile) ? profile.label : input.appType,
    targetUsers: input.targetUsers?.trim() || profile.targetUsers,
    problem: input.problem?.trim() || profile.problem,
    desiredOutput: input.desiredOutput?.trim() || profile.desiredOutput,
    preferredStack,
    apiProviders,
    wantsAutomation: input.wantsAutomation || /automation|n8n|workflow|webhook|crm|slack/i.test(`${input.idea} ${profile.label}`),
  };
}

function bestPresetForInput(input: ProjectInput) {
  const ideaNormalized = normalizedIdeaInput(input);
  const ideaTokens = new Set(ideaNormalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]{1,}/gu) ?? []);
  const ideaScored = scorePresets(ideaNormalized, ideaTokens);
  const bestIdea = ideaScored[0];
  if (bestIdea && bestIdea.score >= 2) return bestIdea.preset;

  const normalized = normalizedInput(input);
  const tokens = new Set(normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]{1,}/gu) ?? []);
  const scored = scorePresets(normalized, tokens);

  const best = scored[0];
  return best && best.score >= 2 ? best.preset : undefined;
}

function scorePresets(normalized: string, tokens: Set<string>) {
  return presets
    .map((preset) => ({
      preset,
      score: preset.keywords.reduce((total, keyword) => total + keywordScore(keyword, normalized, tokens), 0),
    }))
    .sort((a, b) => b.score - a.score);
}

function shouldUseInferredAppType(input: ProjectInput, profile: ProjectProfile) {
  const selected = input.appType.trim();
  if (!selected || selected === "Other") return true;
  if (["Mobile app idea", "Custom web app"].includes(selected) && profile.id !== "custom-web-app") return true;
  if (selected.toLowerCase() === profile.label.toLowerCase()) return false;

  const ideaNormalized = normalizedIdeaInput(input);
  const ideaTokens = new Set(ideaNormalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]{1,}/gu) ?? []);
  const selectedTemplateScore = APP_TYPE_KEYWORDS[selected.toLowerCase()]?.reduce(
    (total, keyword) => total + keywordScore(keyword, ideaNormalized, ideaTokens),
    0,
  ) ?? 0;
  const inferredScore = profileKeywords(profile).reduce(
    (total, keyword) => total + keywordScore(keyword, ideaNormalized, ideaTokens),
    0,
  );

  return inferredScore >= 2 && selectedTemplateScore === 0;
}

const APP_TYPE_KEYWORDS: Record<string, string[]> = {
  "ai video app": ["ai video app", "product showcase", "showcase video", "product photos", "tiktok shop", "shopee", "video san pham", "anh san pham"],
  "english learning app": ["english", "tieng anh", "vocabulary", "listening", "quiz", "learn language", "hoc ngoai ngu"],
  "education app": ["education", "learning", "course", "language app", "english", "tieng anh", "hoc tieng anh", "vocabulary", "listening", "quiz", "tutor", "student"],
  "local crm for freelancers": ["local crm", "crm for freelancers", "freelancer crm", "client pipeline", "client follow-up", "proposal tracking"],
  "habit tracker mobile app": ["habit tracker", "habit tracking", "daily habits", "streaks", "check-ins", "mobile habit", "routine tracker"],
  "mobile app idea": ["mobile", "ios", "android", "habit tracker", "mobile habit"],
};

function profileKeywords(profile: ProjectProfile) {
  const preset = presets.find((item) => item.id === profile.id);
  return preset?.keywords ?? [profile.label];
}

function keywordScore(keyword: string, normalized: string, tokens: Set<string>) {
  const key = removeDiacritics(keyword).toLowerCase().trim();
  if (!key) return 0;

  if (key.includes(" ")) {
    return normalized.includes(key) ? Math.min(5, key.split(/\s+/).length + 1) : 0;
  }

  if (key.length <= 3) {
    return tokens.has(key) ? 2 : 0;
  }

  return tokens.has(key) ? 3 : normalized.includes(key) ? 1 : 0;
}

function inferPreferredStack(input: ProjectInput, profile: ProjectProfile) {
  const stack = input.preferredStack.filter((item) => item.trim());
  const isDefaultStack =
    stack.length <= 3 &&
    stack.some((item) => /next\.?js/i.test(item)) &&
    stack.some((item) => /tailwind|shadcn/i.test(item));
  if (!isDefaultStack && stack.length) return stack;

  if (profile.id === "lead-generation-automation") {
    return ["Next.js App Router", "localStorage demo mode", "shadcn/ui", "n8n webhook", "OpenRouter optional", "CRM and Slack webhooks later"];
  }
  if (profile.id === "freelancer-crm") {
    return ["Next.js App Router", "localStorage demo mode", "shadcn/ui", "CSV/JSON export", "Supabase later", "Resend later"];
  }
  if (profile.id === "habit-tracker-mobile") {
    return ["Next.js App Router", "localStorage demo mode", "shadcn/ui", "PWA-friendly responsive UI", "Capacitor or Expo later"];
  }
  return stack.length ? stack : ["Next.js App Router", "localStorage demo mode", "shadcn/ui"];
}

function inferApiProviders(input: ProjectInput, profile: ProjectProfile) {
  const providers = input.apiProviders.filter((item) => item.trim());
  if (providers.length) return providers;
  if (profile.id === "lead-generation-automation") return ["OpenRouter"];
  if (profile.usesAiProvider) return ["OpenRouter"];
  return providers;
}

function genericProfile(input: ProjectInput, template: AppTemplate): ProjectProfile {
  const appLabel = input.appType && input.appType !== "Other" ? input.appType : "custom web app";
  const slug = slugify(appLabel);
  const output = template.outputs.join(", ");
  return {
    id: template.id,
    label: appLabel,
    slug,
    targetUsers: "the first focused user segment described in the idea",
    problem: "they need a small, structured workflow that replaces scattered manual steps",
    desiredOutput: output,
    mvp: [
      ...template.mvp,
      "Local-first storage so the first version works without accounts or API keys",
      "Copy/export path for the key records or outputs",
    ],
    avoid: template.avoid,
    routes: [
      { path: "/", name: "Primary workspace", job: `help users create ${output}`, controls: "main form, sample data button, submit button" },
      { path: "/items", name: "Saved work", job: "show saved records or outputs", controls: "search, filters, open action" },
      { path: "/items/[id]", name: "Detail view", job: "review one saved item", controls: "edit, copy, export, delete" },
      { path: "/settings", name: "Settings", job: "configure optional local/provider settings", controls: "toggles, local reset, provider fields" },
    ],
    entities: [
      { name: "AppItem", purpose: "main record for the app workflow", fields: ["id", "title", "status", "input", "result", "createdAt", "updatedAt"] },
      { name: "UserPreference", purpose: "local settings", fields: ["theme", "defaultMode", "lastOpenedAt"] },
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/items", purpose: "create the main record or output" },
      { method: "GET", path: "/api/items/[id]", purpose: "read one saved record" },
      { method: "PATCH", path: "/api/items/[id]", purpose: "update status or edited fields" },
    ],
    tasks: [
      { title: `Build the ${appLabel} primary workflow`, files: ["src/app/page.tsx", `src/components/${slug}/PrimaryForm.tsx`, `src/types/${slug}.ts`], notes: "Use the user's idea to name fields and avoid generic placeholder copy.", acceptance: "User can complete the main workflow with minimal required fields.", command: "npm.cmd run build" },
      { title: "Add local storage and detail view", files: [`src/lib/${slug}/storage.ts`, "src/app/items/[id]/page.tsx"], notes: "Persist records locally first.", acceptance: "Saved work reopens after refresh.", command: "npm.cmd run lint" },
      { title: "Add export and empty states", files: [`src/lib/${slug}/export.ts`, "src/app/items/page.tsx"], notes: "Export JSON/CSV/Markdown depending on the record shape.", acceptance: "User can export and recover from empty/error states.", command: "npx tsc --noEmit" },
    ],
    tests: template.tests,
    primaryAction: "complete the main workflow",
    successMetric: "a first user can finish the core workflow and export the result without setup",
    launchAudience: ["Non-technical users with this exact workflow", "Solo builders validating the MVP", "Small teams replacing a spreadsheet or chat process"],
    usesAiProvider: appLabel.toLowerCase().includes("ai") || input.apiProviders.length > 0,
  };
}

function normalizedInput(input: ProjectInput) {
  return removeDiacritics(
    [input.idea, input.appType, input.targetUsers, input.problem, input.desiredOutput].filter(Boolean).join(" "),
  ).toLowerCase();
}

function normalizedIdeaInput(input: ProjectInput) {
  return removeDiacritics(
    [input.idea, input.targetUsers, input.problem, input.desiredOutput].filter(Boolean).join(" "),
  ).toLowerCase();
}

function removeDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\u0111/g, "d").replace(/\u0110/g, "D");
}
