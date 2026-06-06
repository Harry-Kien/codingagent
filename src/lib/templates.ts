import type { ProjectInput } from "@/types/vibeforge";

export type AppTemplate = {
  id: string;
  label: string;
  aliases: string[];
  mvp: string[];
  avoid: string[];
  stack: string[];
  outputs: string[];
  automations: string[];
  tests: string[];
};

export const APP_TEMPLATES: AppTemplate[] = [
  {
    id: "ai-video-app",
    label: "AI video app",
    aliases: ["ai video app", "video"],
    mvp: [
      "Idea intake for product, audience, tone, and publishing goal",
      "7-day content calendar with scripts, captions, shot lists, and generation prompts",
      "Project history, section regeneration, and export packs for coding agents",
    ],
    avoid: [
      "Full video rendering pipeline before validating prompt and script demand",
      "Unbounded media storage, background rendering queues, and paid video APIs in the first pass",
    ],
    stack: ["Next.js", "Supabase later", "shadcn/ui", "Gemini or OpenRouter provider option"],
    outputs: ["Content plan", "Video scripts", "Shot lists", "AI video prompts", "Caption variants"],
    automations: ["Optional n8n workflow to schedule generated scripts into a content tracker"],
    tests: ["Generate AI video sample", "Export ZIP", "Confirm Remotion and FFmpeg are use-later items"],
  },
  {
    id: "saas-dashboard",
    label: "SaaS dashboard",
    aliases: ["saas", "saas dashboard", "dashboard"],
    mvp: [
      "Authenticated dashboard shell after local prototype is validated",
      "Core CRUD workflow, saved records, filters, and status views",
      "Billing and teams kept behind a production milestone",
    ],
    avoid: ["Complex analytics warehouse", "Role matrix beyond owner/admin/member until needed"],
    stack: ["Next.js", "Supabase", "shadcn/ui", "Postgres", "Vercel"],
    outputs: ["Dashboard screens", "Data model", "API plan", "Admin tasks"],
    automations: ["Lifecycle emails or CRM handoff after the main workflow ships"],
    tests: ["Create record", "Filter list", "Open detail", "Verify RLS before production"],
  },
  {
    id: "n8n-automation",
    label: "n8n automation",
    aliases: ["n8n", "automation", "automation tool", "n8n workflow"],
    mvp: [
      "Webhook contract, input validation, and retry notes",
      "Human-readable workflow map before any workflow import",
      "Manual trigger path for testing without paid services",
    ],
    avoid: ["Embedding n8n runtime inside the product unless workflow execution is the product"],
    stack: ["n8n", "Next.js webhook UI", "Supabase logs later"],
    outputs: ["Workflow map", "Webhook schema", "Runbook", "Failure handling"],
    automations: ["n8n import workflow with credentials documented outside source control"],
    tests: ["Add MCP connection", "Export workflow plan", "Verify no secrets are in JSON export"],
  },
  {
    id: "internal-business-tool",
    label: "Internal business tool",
    aliases: ["internal business tool", "internal tool", "business tool"],
    mvp: [
      "Role-light operations workflow for one team",
      "Forms, tables, approvals, and CSV/JSON export",
      "Audit notes for sensitive actions",
    ],
    avoid: ["Enterprise SSO and complex permissions before the workflow is proven"],
    stack: ["Next.js", "Supabase", "shadcn/ui", "CSV export"],
    outputs: ["Operations screens", "Data schema", "Approval flow", "Admin checklist"],
    automations: ["n8n notifications for status changes when requested"],
    tests: ["Submit form", "Update status", "Export records", "Check empty table state"],
  },
  {
    id: "content-tool",
    label: "Content tool",
    aliases: ["content tool", "content"],
    mvp: [
      "Prompted content brief intake",
      "Generated drafts, variants, calendar, and exportable briefs",
      "Provider cost controls and section-by-section regeneration",
    ],
    avoid: ["Autopublishing to social accounts before review and approvals exist"],
    stack: ["Next.js", "localStorage first", "OpenRouter or Gemini optional"],
    outputs: ["Briefs", "Drafts", "Calendars", "SEO/social variants"],
    automations: ["Optional n8n handoff to Notion, Airtable, or scheduler"],
    tests: ["Generate content plan", "Copy section", "Regenerate output", "Export Markdown"],
  },
  {
    id: "e-commerce-helper",
    label: "E-commerce helper",
    aliases: ["e-commerce helper", "ecommerce", "e-commerce"],
    mvp: [
      "Product intake for title, audience, benefits, constraints, and channel",
      "Listings, ad copy, email snippets, and FAQ outputs",
      "CSV-friendly export for catalog workflows",
    ],
    avoid: ["Direct store writeback before human review and API permission checks"],
    stack: ["Next.js", "CSV export", "Supabase later", "Shopify API later"],
    outputs: ["Product listings", "Ad copy", "Email snippets", "FAQs", "CSV fields"],
    automations: ["Optional n8n workflow to move approved copy into a store task queue"],
    tests: ["Generate product copy", "Export JSON", "Confirm store sync is use-later"],
  },
  {
    id: "education-learning",
    label: "Education app",
    aliases: ["education", "learning", "course", "language app", "english", "tieng anh", "hoc tieng anh", "vocabulary", "listening", "quiz", "tutor", "student"],
    mvp: [
      "Learner intake for level, goal, available time, and preferred practice style",
      "Lesson plan, practice exercises, progress checklist, and feedback loop",
      "Local-first learner history before accounts, payments, or school admin features",
    ],
    avoid: ["Full LMS, live classes, certification, and complex teacher dashboards before learner retention is proven"],
    stack: ["Next.js", "localStorage first", "Supabase later", "OpenRouter or Gemini optional"],
    outputs: ["Lesson plan", "Practice exercises", "Progress tracker", "AI tutor prompts", "Review schedule"],
    automations: ["Optional reminders or weekly progress summary after the core learning loop works"],
    tests: ["Generate lesson", "Complete practice flow", "Save progress locally", "Export learner plan"],
  },
  {
    id: "healthcare-clinic",
    label: "Clinic app",
    aliases: ["clinic", "healthcare", "medical", "patient", "appointment", "doctor"],
    mvp: [
      "Appointment or intake workflow with clear staff and patient roles",
      "Patient-safe forms, status tracking, and exportable visit notes",
      "Privacy-first storage guidance with production RLS before cloud rollout",
    ],
    avoid: ["Diagnosis automation, regulated medical advice, insurance claims, and EHR integrations in the MVP"],
    stack: ["Next.js", "Supabase with RLS", "shadcn/ui", "audit logs"],
    outputs: ["Appointment workflow", "Patient intake schema", "Staff dashboard plan", "Privacy checklist"],
    automations: ["Optional appointment reminders only after consent and privacy rules are defined"],
    tests: ["Submit intake", "Update appointment status", "Verify owner/staff scoping", "Export visit summary"],
  },
  {
    id: "local-business",
    label: "Local business app",
    aliases: ["local business", "restaurant", "salon", "shop", "service business", "small business"],
    mvp: [
      "Customer-facing request or booking flow",
      "Owner dashboard for requests, schedule, and simple follow-up",
      "CSV export and manual operations before payment or complex CRM sync",
    ],
    avoid: ["Marketplace, dynamic pricing, and advanced loyalty programs before daily operations are validated"],
    stack: ["Next.js", "localStorage first", "Supabase later", "CSV export"],
    outputs: ["Booking flow", "Owner dashboard", "Customer messages", "Operations checklist"],
    automations: ["Optional n8n notification for new bookings or abandoned requests"],
    tests: ["Create booking", "Owner updates status", "Export CSV", "Check mobile layout"],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    aliases: ["marketplace", "two-sided", "seller", "buyer", "vendor"],
    mvp: [
      "One narrow supply and demand workflow with manual approval",
      "Listing creation, search/filter, inquiry flow, and admin moderation queue",
      "Payment, dispute, and messaging complexity deferred until transactions are validated",
    ],
    avoid: ["Escrow, ratings, full chat, seller subscriptions, and automated payouts in the first version"],
    stack: ["Next.js", "Supabase", "shadcn/ui", "Stripe later"],
    outputs: ["Marketplace scope", "Listing schema", "Inquiry flow", "Moderation checklist"],
    automations: ["Optional admin notification when a listing or inquiry needs review"],
    tests: ["Create listing", "Submit inquiry", "Moderate listing", "Verify no payment dependency"],
  },
  {
    id: "freelancer-crm",
    label: "Local CRM for freelancers",
    aliases: ["local crm", "crm", "freelancer crm", "crm for freelancers", "client pipeline", "client follow-up"],
    mvp: [
      "Client and lead intake with service need, stage, value, next follow-up, and notes",
      "Pipeline board, follow-up queue, client detail timeline, and local export",
      "Local-first storage before external CRM sync, email automation, or accounts",
    ],
    avoid: ["Enterprise CRM sync, team permissions, cold email automation, billing, and complex reporting before freelancer workflow demand is proven"],
    stack: ["Next.js", "localStorage first", "shadcn/ui", "CSV/JSON export", "Supabase later"],
    outputs: ["Client pipeline", "Follow-up queue", "Client detail model", "CRM export plan"],
    automations: ["Optional follow-up draft generation or CRM sync after the local workflow works"],
    tests: ["Add client", "Move deal stage", "Complete follow-up", "Export CRM records"],
  },
  {
    id: "habit-tracker-mobile",
    label: "Habit tracker mobile app",
    aliases: ["habit tracker", "habit tracking", "daily habits", "streaks", "check-ins", "routine tracker", "mobile habit"],
    mvp: [
      "Mobile-first habit setup, today check-ins, streaks, and progress calendar",
      "Local/offline persistence for habits, check-ins, reminder preferences, and progress exports",
      "Exportable weekly progress summary before social, native push, or wearable integrations",
    ],
    avoid: ["Social leaderboards, paid coaching, wearable integrations, native push infrastructure, and complex gamification before the local habit loop works"],
    stack: ["Next.js PWA-style web MVP", "localStorage first", "shadcn/ui", "Capacitor later", "Expo later"],
    outputs: ["Habit setup flow", "Daily check-in screen", "Streak logic", "Progress calendar", "Reminder settings"],
    automations: ["Optional local reminders first; native push notifications after mobile packaging is validated"],
    tests: ["Create habit", "Complete check-in", "Skip with reason", "Verify streak", "Export progress"],
  },
  {
    id: "custom-web-app",
    label: "Custom web app",
    aliases: ["other", "custom web app", "web app", "mobile app idea"],
    mvp: [
      "One focused user workflow based on the user's natural-language idea",
      "Domain-specific screens, local data model, and saved history",
      "Export or copy path for the main record or result",
    ],
    avoid: ["Accounts, payments, complex admin, and external integrations before the workflow is proven"],
    stack: ["Next.js", "localStorage first", "Tailwind", "shadcn/ui"],
    outputs: ["Focused MVP workflow", "Domain data model", "Screen plan", "Implementation tasks"],
    automations: ["Optional automation only after the primary workflow is useful"],
    tests: ["Complete primary flow", "Save locally", "Reopen after refresh", "Export result"],
  },
  {
    id: "ai-tool",
    label: "AI tool",
    aliases: ["ai tool", "ai assistant", "chatbot", "generator", "copilot"],
    mvp: [
      "Structured input form with prompt preview and deterministic demo fallback",
      "Provider-backed generation with cost controls, retries, and section-level regeneration",
      "Exportable output history with clear model/source metadata",
    ],
    avoid: ["Autonomous actions, tool execution, and multi-agent orchestration before the single output loop works"],
    stack: ["Next.js", "Zod", "localStorage first", "OpenRouter or Gemini optional"],
    outputs: ["Generated answer", "Prompt template", "Output history", "Provider fallback plan"],
    automations: ["Optional MCP or tool-calling plan after the user can trust generated output"],
    tests: ["Generate demo output", "Handle provider failure", "Copy result", "Export history"],
  },
];

export function selectAppTemplate(input: ProjectInput) {
  const ideaText = normalizeTemplateText(`${input.idea} ${input.problem ?? ""} ${input.desiredOutput ?? ""}`);
  const text = normalizeTemplateText(`${input.appType} ${input.idea} ${input.desiredOutput ?? ""}`);

  const ideaFirstTemplate = APP_TEMPLATES.find((template) =>
    template.id !== "custom-web-app" &&
    template.aliases.some((alias) => ideaText.includes(normalizeTemplateText(alias))),
  );
  if (ideaFirstTemplate) return ideaFirstTemplate;

  return (
    APP_TEMPLATES.find((template) => template.aliases.some((alias) => text.includes(normalizeTemplateText(alias)))) ??
    APP_TEMPLATES.find((template) => template.id === "custom-web-app") ??
    APP_TEMPLATES[1]
  );
}

function normalizeTemplateText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase();
}
