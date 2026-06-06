import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const rootDir = process.cwd();
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(rootDir, "src", request.slice(2)),
      parent,
      isMain,
      options,
    );
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function compileTypescript(module, filename) {
  const source = readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};

const { generateMockKit } = require("../src/lib/generator-shared.ts");
const { SECTION_ORDER } = require("../src/lib/kit-sections.ts");
const { repoTools } = require("../src/lib/repo-data.ts");

const sampleInputs = [
  {
    idea: "Build an AI video app for small shops that turns product photos and offers into short social videos.",
    targetUsers: "Small shop owners, local marketers, and solo sellers with limited design skills.",
    problem: "They need regular product videos but do not have time, budget, or editing knowledge.",
    desiredOutput: "A project kit for generating short video scripts, captions, shot lists, and export-ready production tasks.",
    appType: "AI video app",
    timeline: "7 day build",
    skillLevel: "Builder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Supabase", "OpenRouter", "Remotion later"],
    apiProviders: ["OpenRouter"],
    wantsMcp: true,
    wantsAutomation: false,
  },
  {
    idea: "Create an n8n automation for lead qualification from website forms and CRM notes.",
    targetUsers: "B2B sales teams and founders who receive messy inbound leads.",
    problem: "Manual lead triage is slow and good prospects are missed.",
    desiredOutput: "A workflow plan with trigger, enrichment, scoring, notifications, and handoff tasks.",
    appType: "n8n automation",
    timeline: "1 day MVP",
    skillLevel: "Beginner",
    budgetSensitivity: "medium",
    preferredStack: ["n8n", "Postgres", "Slack", "HubSpot"],
    apiProviders: ["OpenAI-compatible"],
    wantsMcp: false,
    wantsAutomation: true,
  },
  {
    idea: "Build a SaaS dashboard for freelance finance tracking with invoices and cashflow reminders.",
    targetUsers: "Freelancers, consultants, and small agency owners.",
    problem: "They cannot see upcoming cashflow, unpaid invoices, and tax reserve needs in one place.",
    desiredOutput: "A build plan for a dashboard with invoice tracking, alerts, charts, and monthly summaries.",
    appType: "SaaS dashboard",
    timeline: "30 day product",
    skillLevel: "Developer",
    budgetSensitivity: "medium",
    preferredStack: ["Next.js", "Supabase", "Stripe", "Resend"],
    apiProviders: ["OpenRouter"],
    wantsMcp: true,
    wantsAutomation: true,
  },
  {
    idea: "Create an internal business tool for inventory approvals across purchasing and warehouse teams.",
    targetUsers: "Operations managers, purchasing staff, and warehouse supervisors.",
    problem: "Inventory requests get lost in chat messages and approvals are not auditable.",
    desiredOutput: "A project kit for request intake, approval workflow, audit trail, and role-based views.",
    appType: "Internal business tool",
    timeline: "7 day build",
    skillLevel: "Builder",
    budgetSensitivity: "low",
    preferredStack: ["Next.js", "Supabase", "shadcn/ui"],
    apiProviders: [],
    wantsMcp: false,
    wantsAutomation: true,
  },
  {
    idea: "Build an e-commerce helper that generates product descriptions, SEO titles, and marketplace bullets.",
    targetUsers: "Online sellers, Shopify store owners, and marketplace operators.",
    problem: "Writing consistent product copy for many SKUs takes too long.",
    desiredOutput: "A generator workflow with product intake, tone settings, bulk review, and exportable copy.",
    appType: "E-commerce helper",
    timeline: "1 night MVP",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "localStorage", "OpenRouter"],
    apiProviders: ["OpenRouter"],
    wantsMcp: true,
    wantsAutomation: false,
  },
  {
    idea: "Local CRM for freelancers to track clients, leads, follow-ups, proposals, invoice notes, and export client history without any API key.",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "Other",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "localStorage", "shadcn/ui"],
    apiProviders: [],
    wantsMcp: true,
    wantsAutomation: false,
  },
  {
    idea: "Habit tracker mobile app where users create daily habits, check in, see streaks, skip with a reason, review a progress calendar, and export a weekly summary.",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "Mobile app idea",
    timeline: "7 day build",
    skillLevel: "Beginner",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Tailwind", "Capacitor later"],
    apiProviders: [],
    wantsMcp: false,
    wantsAutomation: false,
  },
  {
    idea: "Weekly social media content planner for solo creators. User enters niche, audience, offer, tone, Instagram/TikTok platforms, and gets a 7-day plan with captions, hashtags, image prompts, video prompts, and best posting times.",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "Other",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "shadcn/ui"],
    apiProviders: ["Gemini"],
    wantsMcp: false,
    wantsAutomation: false,
  },
  {
    idea: "Toi muon lam mot web hoc tieng Anh cho nguoi moi bat dau. Nguoi dung co the hoc tu vung theo chu de, luyen nghe cau ngan, lam quiz sau moi bai va xem tien do hoc moi ngay.",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "Other",
    timeline: "1 night MVP",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Tailwind"],
    apiProviders: [],
    wantsMcp: false,
    wantsAutomation: false,
  },
  {
    idea: "Tôi cần xây app học tiếng anh",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "AI video app",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Tailwind", "shadcn/ui"],
    apiProviders: [],
    wantsMcp: false,
    wantsAutomation: false,
  },
  {
    idea: "Local-first English video-style lesson app. Learners play timed vocabulary cards with word, Vietnamese meaning, example sentence, narration text, duration, image, and Web Speech hear button. No Supabase, no auth, no Gemini, no OpenRouter, no API keys, no real video rendering.",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "Other",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Tailwind", "shadcn/ui"],
    apiProviders: [],
    wantsMcp: false,
    wantsAutomation: false,
  },
  {
    idea: "Tao web dat lich cho tiem salon nho. Khach chon dich vu, ngay gio, de lai so dien thoai, nhan vien xem danh sach va xac nhan lich hen.",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "Other",
    timeline: "1 night MVP",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Tailwind"],
    apiProviders: [],
    wantsMcp: false,
    wantsAutomation: false,
  },
  {
    idea: "Lam app quan ly kho va phe duyet yeu cau mua hang cho doi van hanh. Nhan vien gui yeu cau, quan ly duyet, co lich su audit va xuat CSV.",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "Other",
    timeline: "7 day build",
    skillLevel: "Builder",
    budgetSensitivity: "medium",
    preferredStack: ["Next.js", "Supabase"],
    apiProviders: [],
    wantsMcp: false,
    wantsAutomation: true,
  },
];

const requiredSections = {
  "product-strategy": ["Product Brief", "Target Users", "Outcome", "Success Metrics"],
  "mvp-scope": ["Feature Scope", "MVP Requirements", "Build First", "Do Not Build Yet", "Acceptance Criteria"],
  "stack-recommendation": ["Technical Architecture", "Recommended Stack", "Risks & Edge Cases"],
  "database-schema": ["Data Models", "ProjectKit", "Supabase"],
  "api-specification": ["Request body", "Response body", "Error cases"],
  "ui-screens": ["Component Plan", "Screen", "state"],
  "user-flows": ["Core User Flow", "Happy Path", "Failure"],
  "repo-tool-map": ["https://", "Do not clone", "GitHub Discovery URLs"],
  "ai-handoff": ["Upload These Files Together", "Primary Agent Prompt", "Definition Of Done"],
  "task-plan": ["Implementation Tasks", "Files:", "Acceptance criteria", "Test command"],
  "implementation-phases": ["Phase", "Acceptance criteria", "Test command"],
  "test-plan": ["Test Checklist", "Manual Flow Checklist", "Automated Checks", "Acceptance Criteria"],
  "security-checklist": ["Secret Handling", "Never clone external repositories"],
  "codex-cline-prompts": ["Agent Prompts", "Codex Implementation Prompt", "Cline Implementation Prompt", "Cursor Implementation Prompt"],
  "next-actions": ["Next 5 Actions", "First Coding-Agent Handoff"],
  "launch-kit": ["Launch/Export Notes", "Launch Checklist", "Success Metrics"],
};

const placeholderPatterns = [
  /\bTODO\b/i,
  /\bTBD\b/i,
  /lorem ipsum/i,
  /coming soon/i,
  /To be generated\./i,
  /\[placeholder\]/i,
];

const failures = [];
const generatedSummaries = [];

for (const input of sampleInputs) {
  const project = generateMockKit(input);
  generatedSummaries.push(`${project.name} (${input.appType})`);
  assert(project.generation?.source === "demo", input.appType, "Demo generation source should stay available.");
  assert(project.sections && typeof project.sections === "object", input.appType, "Generated project has no sections.");
  assert(project.repoRecommendations?.length > 0, input.appType, "Generated project has no repo recommendations.");

  for (const [sectionKey, terms] of Object.entries(requiredSections)) {
    const content = project.sections[sectionKey] ?? "";
    assert(content.trim().length > 80, input.appType, `Section ${sectionKey} is missing or too thin.`);
    for (const term of terms) {
      assert(content.includes(term), input.appType, `Section ${sectionKey} is missing required marker: ${term}`);
    }
  }

  for (const [sectionKey, content] of Object.entries(project.sections)) {
    for (const pattern of placeholderPatterns) {
      assert(!pattern.test(content), input.appType, `Section ${sectionKey} contains placeholder pattern: ${pattern}`);
    }
  }

  assert(
    project.sections["product-strategy"].toLowerCase().includes(input.targetUsers.toLowerCase().split(",")[0]),
    input.appType,
    "Product requirements do not reflect target users.",
  );
  assert(
    project.sections["ai-handoff"].includes(input.desiredOutput),
    input.appType,
    "AI handoff does not reflect desired output.",
  );

  const all = Object.values(project.sections).join("\n");
  const isAiProduct = /\b(ai|chatbot|copilot|generator)\b/i.test(`${input.appType} ${input.idea} ${input.desiredOutput}`);
  if (!isAiProduct) {
    assert(!/Generated answer|Prompt template|Provider fallback plan|first focused user segment/i.test(all), input.appType, "Generated kit leaked unrelated AI-tool template terms.");
  }
  if (input.appType === "AI video app") {
    if (/tiáº¿ng Anh|tieng anh|tiếng anh|English|hoc tieng anh/i.test(input.idea)) {
      assert(project.name === "Easy English Daily", input.appType, "English-learning idea should infer a clean project name even when appType is stale.");
      assert(project.input.appType === "English learning app", input.appType, "English-learning idea should override stale AI video app type.");
      assert(project.sections["ui-screens"].includes("/topics/[topic]/quiz"), input.appType, "English-learning kit should include lesson quiz routes.");
      assert(project.sections["database-schema"].includes("LessonTopic"), input.appType, "English-learning kit should include lesson data entities.");
      assert(!project.sections["task-plan"].includes("product showcase"), input.appType, "English-learning task plan should not leak AI video product showcase work.");
      assert(!project.sections["database-schema"].includes("StoryboardScene"), input.appType, "English-learning schema should not include AI video storyboard entities.");
    } else {
      assert(project.name === "AI Video App For Small Shops", input.appType, "AI video sample should infer a video-specific project name, not a content planner name.");
      assert(project.input.appType === "AI video app", input.appType, "AI video sample should preserve its app type.");
      assert(project.sections["ui-screens"].includes("/videos/[id]"), input.appType, "AI video sample should include video project detail route.");
      assert(project.sections["database-schema"].includes("StoryboardScene"), input.appType, "AI video sample should include storyboard scene entity.");
      assert(!project.sections["ai-handoff"].includes("Weekly Social Media Content Planner"), input.appType, "AI video handoff should not leak content planner naming.");
    }
  } else if (/weekly social media|content planner|instagram|tiktok/i.test(input.idea)) {
    assert(project.name === "Weekly Social Media Content Planner", input.appType, "Content planner should infer a clean project name.");
    assert(project.input.appType === "Weekly social media content planner", input.appType, "Content planner should save the inferred app type.");
    assert(project.sections["ui-screens"].includes("/plan/new"), input.appType, "Content planner should include new plan route.");
    assert(project.sections["ui-screens"].includes("/plan/[id]"), input.appType, "Content planner should include plan detail route.");
    assert(project.sections["database-schema"].includes("ContentPlan"), input.appType, "Content planner should include ContentPlan entity.");
    assert(project.sections["database-schema"].includes("SocialPost"), input.appType, "Content planner should include SocialPost entity.");
    assert(project.sections["api-specification"].includes("/api/generate-plan"), input.appType, "Content planner should include generate-plan API.");
    assert(project.sections["task-plan"].includes("planner-form.tsx"), input.appType, "Content planner task plan should include planner form.");
    assert(!project.sections["ai-handoff"].includes("AI video app"), input.appType, "Content planner handoff should not call the app AI video app.");
    assert(!project.sections["database-schema"].includes("AppItem"), input.appType, "Content planner schema should not use generic AppItem.");
    assert(!project.sections["api-specification"].includes("/api/items"), input.appType, "Content planner API should not use generic /api/items.");
  } else if (/video-style|timed vocabulary cards|lesson player/i.test(input.idea)) {
    assert(project.input.appType === "Local-first English video-style lesson app", input.appType, "Video-style lesson idea should save the inferred app type.");
    assert(project.sections["ui-screens"].includes("/lesson/[lessonId]"), input.appType, "Video-style lesson kit should include player route.");
    assert(project.sections["database-schema"].includes("VideoLesson"), input.appType, "Video-style lesson kit should include VideoLesson entity.");
    assert(project.sections["database-schema"].includes("LessonCard"), input.appType, "Video-style lesson kit should include LessonCard entity.");
    assert(project.sections["api-specification"].includes("No API routes are required"), input.appType, "Video-style lesson core MVP should not require API routes.");
    assert(!project.sections["task-plan"].includes("/api/process"), input.appType, "Video-style lesson task plan should not include generic /api/process.");
    assert(!project.sections["task-plan"].includes("IntakeForm"), input.appType, "Video-style lesson task plan should not include generic IntakeForm.");
  } else if (/tiếng Anh|tieng anh|English/i.test(input.idea)) {
    assert(project.name === "Easy English Daily", input.appType, "English-learning idea should infer a clean project name.");
    assert(project.input.appType === "English learning app", input.appType, "English-learning idea should save the inferred app type.");
    assert(project.sections["ui-screens"].includes("/topics/[topic]/quiz"), input.appType, "English-learning kit should include lesson quiz routes.");
    assert(project.sections["database-schema"].includes("LessonTopic"), input.appType, "English-learning kit should include lesson data entities.");
  }
  if (/dat lich|lich hen|booking|appointment/i.test(input.idea)) {
    assert(project.input.appType === "Booking app", input.appType, "Booking idea should save the inferred app type.");
    assert(project.sections["ui-screens"].includes("/calendar"), input.appType, "Booking kit should include schedule route.");
    assert(project.sections["database-schema"].includes("BookingRequest"), input.appType, "Booking kit should include booking data entities.");
  }
  if (/crm for freelancers|local crm|freelancer/i.test(input.idea)) {
    assert(project.input.appType === "Local CRM for freelancers", input.appType, "Freelancer CRM idea should save the inferred app type.");
    assert(project.sections["ui-screens"].includes("/clients/[clientId]"), input.appType, "Freelancer CRM kit should include client detail route.");
    assert(project.sections["database-schema"].includes("ClientNote"), input.appType, "Freelancer CRM kit should include client note entity.");
    assert(project.sections["database-schema"].includes("FollowUp"), input.appType, "Freelancer CRM kit should include follow-up entity.");
    assert(project.sections["task-plan"].includes("freelancer-crm"), input.appType, "Freelancer CRM task plan should include CRM-specific file paths.");
    assert(project.sections["test-plan"].includes("Complete follow-up"), input.appType, "Freelancer CRM test plan should include follow-up verification.");
    assert(!project.sections["database-schema"].includes("AppItem"), input.appType, "Freelancer CRM schema should not use generic AppItem.");
    assert(!project.sections["api-specification"].includes("/api/items"), input.appType, "Freelancer CRM API should not use generic /api/items.");
  }
  if (/habit tracker|daily habits|streaks|check in|check-ins/i.test(input.idea)) {
    assert(project.input.appType === "Habit tracker mobile app", input.appType, "Habit tracker idea should save the inferred app type.");
    assert(project.sections["ui-screens"].includes("/habits/[habitId]"), input.appType, "Habit tracker kit should include habit detail route.");
    assert(project.sections["ui-screens"].includes("/progress"), input.appType, "Habit tracker kit should include progress route.");
    assert(project.sections["database-schema"].includes("HabitCheckIn"), input.appType, "Habit tracker kit should include check-in entity.");
    assert(project.sections["database-schema"].includes("StreakSummary"), input.appType, "Habit tracker kit should include streak summary entity.");
    assert(project.sections["task-plan"].includes("src/lib/habits/streaks.ts"), input.appType, "Habit tracker task plan should include streak engine file path.");
    assert(project.sections["test-plan"].includes("Verify streak calculation"), input.appType, "Habit tracker test plan should include streak verification.");
    assert(!project.sections["database-schema"].includes("AppItem"), input.appType, "Habit tracker schema should not use generic AppItem.");
    assert(!project.sections["api-specification"].includes("/api/items"), input.appType, "Habit tracker API should not use generic /api/items.");
  }
  if (input.appType === "Other" && /quan ly kho|inventory|warehouse|approval|phe duyet/i.test(input.idea)) {
    assert(project.input.appType === "Inventory approval app", input.appType, "Inventory idea should save the inferred app type.");
    assert(project.sections["ui-screens"].includes("/approvals"), input.appType, "Inventory kit should include approval route.");
    assert(project.sections["database-schema"].includes("AuditEvent"), input.appType, "Inventory kit should include audit data entities.");
  }
}

const sectionKeys = SECTION_ORDER.map(([key]) => key);
for (const sectionKey of Object.keys(requiredSections)) {
  assert(sectionKeys.includes(sectionKey), "section-map", `SECTION_ORDER is missing required section: ${sectionKey}`);
}

assert(repoTools.length >= 80, "repo-data", `Repo map has ${repoTools.length} repos; minimum is 80.`);
for (const repo of repoTools) {
  assert(/^https?:\/\//.test(repo.url), "repo-data", `${repo.id} has an invalid URL.`);
  for (const field of ["category", "useCase", "whenToUse", "riskNotes"]) {
    assert(Boolean(repo[field]?.trim?.()), "repo-data", `${repo.id} is missing ${field}.`);
  }
  assert(Array.isArray(repo.tags) && repo.tags.length > 0, "repo-data", `${repo.id} must include tags.`);
  assert(repo.howToUse !== "clone", "repo-data", `${repo.id} uses clone workflow; references must stay URL-only.`);
}

const repoSource = readFileSync("src/lib/repo-data.ts", "utf8");
assert(!repoSource.includes("git clone"), "repo-data", "Repo data must not include automatic git clone commands.");

if (failures.length) {
  console.error("Sample output verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Sample output verification passed.");
console.log(`Generated and checked ${sampleInputs.length} sample kits:`);
for (const summary of generatedSummaries) console.log(`- ${summary}`);
console.log(`Repo data verified: ${repoTools.length} URL-only references.`);

function assert(condition, scope, message) {
  if (!condition) failures.push(`[${scope}] ${message}`);
}
