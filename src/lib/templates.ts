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
];

export function selectAppTemplate(input: ProjectInput) {
  const text = `${input.appType} ${input.idea} ${input.desiredOutput ?? ""}`.toLowerCase();
  return (
    APP_TEMPLATES.find((template) => template.aliases.some((alias) => text.includes(alias))) ??
    APP_TEMPLATES[1]
  );
}
