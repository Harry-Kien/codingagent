import type { ProjectKit, ReadinessScore } from "@/types/vibeforge";

export type QualityCheck = {
  label: string;
  passed: boolean;
  sectionKey?: string;
  guidance: string;
};

const sectionGuidance: Record<string, string> = {
  "task-plan": "Add file paths, acceptance criteria, dependencies, and a concrete test command for each first-phase task.",
  "api-specification": "Add endpoint paths, methods, request bodies, response bodies, error cases, and the files likely to change.",
  "database-schema": "Add local-first storage shape, production tables, owner scoping, indexes, and migration notes.",
  "security-checklist": "Add secret handling, validation, rate limits, RLS/auth, repo-reference safety, and provider failure handling.",
  "deployment-plan": "Add environment setup, deployment steps, smoke tests, monitoring, and rollback behavior.",
  "repo-tool-map": "Keep references URL-only and explain how an AI agent should use them without cloning automatically.",
  "ai-handoff": "Make this a single upload-ready brief with files to read, constraints, quality gate, and definition of done.",
  "next-actions": "List the next five concrete actions a builder should take before coding more.",
  "codex-cline-prompts": "Include direct prompts for Codex, Cline, Cursor, Claude Code, regeneration, and security review.",
};

export function evaluateKitQuality(project: ProjectKit): QualityCheck[] {
  const s = project.sections;
  const all = Object.values(s).join(" ");
  const tasks = s["task-plan"] ?? "";
  const api = s["api-specification"] ?? "";
  const handoff = s["ai-handoff"] ?? "";
  const security = s["security-checklist"] ?? "";
  const repo = s["repo-tool-map"] ?? "";
  const arch = s["stack-recommendation"] ?? "";
  const phases = s["implementation-phases"] ?? "";
  const database = s["database-schema"] ?? "";
  const deployment = s["deployment-plan"] ?? "";
  const nextActions = s["next-actions"] ?? "";
  const prompts = s["codex-cline-prompts"] ?? "";
  const sectionText = all.toLowerCase();
  const projectTerms = projectAnchorTerms(project);
  const projectTermHits = projectTerms.filter((term) => sectionText.includes(term.toLowerCase())).length;
  const isAiProduct = /\b(ai|chatbot|copilot|generator)\b/i.test(
    `${project.input.appType} ${project.input.idea} ${project.input.desiredOutput ?? ""}`,
  );
  const isCodingAgentKit = /coding agent|project kit|codex|cline|cursor|ai handoff|mcp settings|repo recommendations|markdown json zip|agent pack|local-first/i.test(
    `${project.name} ${project.input.appType} ${project.input.idea} ${project.input.desiredOutput ?? ""}`,
  );
  const codingAgentDomainLeak = /\bInventoryItem\b|\bInventoryRequest\b|\bBookingRequest\b|\bClinicAppointment\b|\bLeadSubmission\b|\bCrmPushResult\b|\/approvals\b|\/api\/requests\b/i.test(all);
  const codingAgentCoverage =
    /\bProjectKit\b/.test(all) &&
    /\bProjectInput\b/.test(all) &&
    /\bProviderProfile\b/.test(all) &&
    /\bMcpConnection\b/.test(all) &&
    /\bGenerationLog\b/.test(all);
  const genericTemplateLeak = /generated answer|prompt template|provider fallback plan|first focused user segment/i.test(all);
  const isContentPlanner = /content planner|content plan|social media|instagram|tiktok|caption|hashtags/i.test(
    `${project.name} ${project.input.appType} ${project.input.idea} ${project.input.desiredOutput ?? ""}`,
  );
  const contentPlannerLeak = /\bAI video app\b|\/api\/items\b|\/items(?:\/|\b)|\bAppItem\b/i.test(all);
  const isVideoStyleLesson = /video-style|video style|timed cards|lesson player|video lesson/i.test(
    `${project.name} ${project.input.appType} ${project.input.idea} ${project.input.desiredOutput ?? ""}`,
  );
  const videoStyleLeak = /\/api\/process\b|\bIntakeForm\b|\/topics\/\[topic\]\/quiz|generated result/i.test(all);
  const isLearningPlanner = /lesson plan|practice exercises|review schedule|progress checklist|adult learners|structured practice|momentum lessons/i.test(
    `${project.name} ${project.input.appType} ${project.input.idea} ${project.input.desiredOutput ?? ""}`,
  );
  const learningGenericLeak = /\/api\/items\b|\/items(?:\/|\b)|\bAppItem\b|\bUserPreference\b|saved work|detail view|primary workspace/i.test(all);
  const learningDomainCoverage =
    /\bLearnerProfile\b/.test(all) &&
    /\bLessonPlan\b/.test(all) &&
    /\bPracticeExercise\b/.test(all) &&
    /\bReviewScheduleItem\b/.test(all) &&
    /\bProgressChecklistItem\b/.test(all);
  const isLeadAutomation = /lead generation|lead capture|lead scoring|qualified leads|crm push|slack notification|form submissions|enrich(?:es)? leads/i.test(
    `${project.name} ${project.input.appType} ${project.input.idea} ${project.input.desiredOutput ?? ""}`,
  );
  const leadGenericLeak = /\/api\/items\b|\/items(?:\/|\b)|\bAppItem\b|\bUserPreference\b|saved work|primary workspace/i.test(all);
  const leadDomainCoverage =
    /\bLeadSubmission\b/.test(all) &&
    /\bEnrichedLead\b/.test(all) &&
    /\bLeadScore\b/.test(all) &&
    /\bCrmPushResult\b/.test(all) &&
    /\bSlackNotification\b/.test(all) &&
    /\bWorkflowRun\b/.test(all);
  const leadApiCoverage =
    /\/api\/leads\b/.test(all) &&
    /\/api\/n8n\/lead-webhook\b/.test(all) &&
    /\/api\/crm\/push\b/.test(all) &&
    /\/api\/slack\/notify\b/.test(all);
  const isClinicIntake = /clinic appointment|patient intake|visit notes|small clinics|appointment status|clinic app/i.test(
    `${project.name} ${project.input.appType} ${project.input.idea} ${project.input.desiredOutput ?? ""}`,
  );
  const clinicGenericLeak = /\/api\/items\b|\bAppItem\b|\bUserPreference\b|generic booking-only screens|marketplace discovery/i.test(all);
  const clinicDomainCoverage =
    /\bPatientIntake\b/.test(all) &&
    /\bClinicAppointment\b/.test(all) &&
    /\bVisitNote\b/.test(all) &&
    /\bStatusEvent\b/.test(all) &&
    /\bPrivacyChecklistItem\b/.test(all);

  return [
    check("Uses project-specific terms", projectTerms.length < 3 || projectTermHits >= Math.min(5, Math.ceil(projectTerms.length / 3))),
    check("Has no placeholder sections", !/\b(TODO|TBD|lorem ipsum|coming soon|placeholder|to be generated)\b/i.test(all)),
    check("Has no unrelated template leakage", isAiProduct || !genericTemplateLeak),
    check("Coding-agent kit avoids unrelated app domains", !isCodingAgentKit || !codingAgentDomainLeak),
    check("Coding-agent kit has core VibeForge entities", !isCodingAgentKit || codingAgentCoverage, "database-schema"),
    check("Content planner avoids generic item/video templates", !isContentPlanner || !contentPlannerLeak),
    check("Video-style lesson avoids generic process/topic templates", !isVideoStyleLesson || !videoStyleLeak),
    check("Learning planner avoids generic item templates", !isLearningPlanner || !learningGenericLeak),
    check("Learning planner has domain entities", !isLearningPlanner || learningDomainCoverage, "database-schema"),
    check("Lead automation avoids generic item templates", !isLeadAutomation || !leadGenericLeak),
    check("Lead automation has domain entities", !isLeadAutomation || leadDomainCoverage, "database-schema"),
    check("Lead automation has workflow APIs", !isLeadAutomation || leadApiCoverage, "api-specification"),
    check("Clinic intake avoids generic booking templates", !isClinicIntake || !clinicGenericLeak),
    check("Clinic intake has patient-safe domain entities", !isClinicIntake || clinicDomainCoverage, "database-schema"),
    check("Has task file paths", /(?:src\/|src\\|\.tsx?|\.jsx?|\.md)/i.test(tasks), "task-plan"),
    check("Has acceptance criteria", /acceptance\s+criteria/i.test(tasks), "task-plan"),
    check("Has task test commands", /test\s+command|npm(?:\.cmd)?\s+run/i.test(tasks), "task-plan"),
    check("Has task dependencies or phases", /phase\s+\d|dependencies|depends on/i.test(tasks), "task-plan"),
    check("Has agent-ready task instructions", /implementation\s+notes|agent\s+prompt|copy-paste|read\s+.*before\s+editing/i.test(tasks), "task-plan"),
    check("Has repo references", repo.length > 100 && /https?:\/\/github\.com/i.test(repo), "repo-tool-map"),
    check("Has no-clone repo policy", /do\s+not\s+clone|do not clone/i.test(repo || all), "repo-tool-map"),
    check("Has AI handoff brief", handoff.length > 300 && /upload\s+these|primary\s+agent\s+prompt/i.test(handoff), "ai-handoff"),
    check("Has handoff quality gate", /quality\s+gate|definition\s+of\s+done/i.test(handoff), "ai-handoff"),
    check("Has security checklist", security.length > 150 && /secret|api.?key|rate.?limit|validation/i.test(security), "security-checklist"),
    check("Has API request and response", /request\s+body|response\s+body|endpoint|POST|GET/i.test(api), "api-specification"),
    check("Has API error cases", /error|status\s+code|invalid|timeout|quota/i.test(api), "api-specification"),
    check("Has validation contract", /zod|schema|validate|validation/i.test(api || security), "api-specification"),
    check("Has database schema", /table|schema|localStorage|RLS|owner|index/i.test(database), "database-schema"),
    check("Has architecture sections", /frontend|backend|deployment|provider|storage/i.test(arch), "stack-recommendation"),
    check("Has implementation phases", phases.length > 150 && /phase\s+[0-3]/i.test(phases), "implementation-phases"),
    check("Has deployment smoke test", /smoke|rollback|environment|vercel|deploy/i.test(deployment), "deployment-plan"),
    check("Has export verification path", /markdown|json|zip|codex pack|cline pack|export/i.test(deployment || nextActions || prompts), "deployment-plan"),
    check("Has next actions", nextActions.length > 80 && /next|action|TASKS\.md|export/i.test(nextActions), "next-actions"),
    check("Has do-not-build-yet boundaries", /do\s+not\s+build\s+yet/i.test(all), "mvp-scope"),
    check("Has coding agent prompts", prompts.length > 150 && /Codex|Cline|Cursor|Claude/i.test(prompts), "codex-cline-prompts"),
  ];
}

export function getSectionQualityIssues(project: ProjectKit, sectionKey: string) {
  return evaluateKitQuality(project)
    .filter((check) => !check.passed && check.sectionKey === sectionKey)
    .map((check) => check.guidance);
}

export function getWeakSectionKeys(project: ProjectKit) {
  return Array.from(
    new Set(
      evaluateKitQuality(project)
        .filter((check) => !check.passed && check.sectionKey)
        .map((check) => check.sectionKey as string),
    ),
  );
}

export function kitQualitySummary(project: ProjectKit) {
  const checks = evaluateKitQuality(project);
  const passed = checks.filter((check) => check.passed).length;
  return {
    checks,
    passed,
    total: checks.length,
    weakSectionKeys: getWeakSectionKeys(project),
  };
}

export function deriveReadinessScore(project: ProjectKit): ReadinessScore {
  const summary = kitQualitySummary(project);
  const qualityRatio = summary.total ? summary.passed / summary.total : 0;
  const qualityScore = Math.round(qualityRatio * 100);
  const base = project.readinessScore;
  const weakLabels = summary.weakSectionKeys.slice(0, 3).map((key) => key.replace(/-/g, " "));
  const cap = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
  const qualityFloor = Math.max(54, qualityScore - 8);

  return {
    productClarity: cap(weight(base.productClarity, qualityScore, 0.72)),
    mvpFocus: cap(weight(base.mvpFocus, qualityScore, 0.7)),
    technicalFeasibility: cap(Math.min(weight(base.technicalFeasibility, qualityScore, 0.45), qualityFloor + 6)),
    costEfficiency: cap(weight(base.costEfficiency, qualityScore, 0.78)),
    agentReadiness: cap(Math.min(weight(base.agentReadiness, qualityScore, 0.35), qualityFloor)),
    launchReadiness: cap(Math.min(weight(base.launchReadiness, qualityScore, 0.38), qualityFloor - 2)),
    strengths: unique([
      `${summary.passed}/${summary.total} professional kit checks passed`,
      ...base.strengths,
    ]).slice(0, 4),
    risks: unique([
      ...(summary.weakSectionKeys.length
        ? [`Weak sections still need review: ${weakLabels.join(", ")}`]
        : ["No critical weak sections detected by the kit checklist"]),
      ...base.risks,
    ]).slice(0, 4),
    nextActions: unique([
      ...(summary.weakSectionKeys.length
        ? [`Improve or regenerate: ${weakLabels.join(", ")}`]
        : ["Approve the first TASKS.md milestone and export an agent pack"]),
      ...base.nextActions,
      "Run export checks before handing the kit to a coding agent",
    ]).slice(0, 5),
  };
}

function check(label: string, passed: boolean, sectionKey?: string): QualityCheck {
  return {
    label,
    passed,
    sectionKey,
    guidance:
      (sectionKey ? sectionGuidance[sectionKey] : undefined) ??
      "Make this section more concrete, exportable, and useful for a coding agent.",
  };
}

function weight(base: number, quality: number, baseWeight: number) {
  return base * baseWeight + quality * (1 - baseWeight);
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function projectAnchorTerms(project: ProjectKit) {
  const stopWords = new Set([
    "about",
    "after",
    "application",
    "build",
    "create",
    "from",
    "have",
    "into",
    "project",
    "should",
    "that",
    "this",
    "tool",
    "user",
    "users",
    "want",
    "with",
  ]);
  const source = [
    project.name,
    project.input.appType,
    project.input.idea,
    project.input.targetUsers,
    project.input.problem,
    project.input.desiredOutput,
    ...project.input.preferredStack,
    ...project.input.apiProviders,
  ]
    .filter(Boolean)
    .join(" ");

  return Array.from(
    new Set(
      source
        .toLowerCase()
        .normalize("NFC")
        .match(/[\p{L}\p{N}][\p{L}\p{N}-]{3,}/gu)
        ?.filter((word) => !stopWords.has(word)) ?? [],
    ),
  ).slice(0, 18);
}
