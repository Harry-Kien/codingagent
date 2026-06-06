import type { ProjectKit } from "@/types/vibeforge";
import { sectionTitle } from "@/lib/kit-sections";
import { getSectionQualityIssues, getWeakSectionKeys } from "@/lib/kit-quality";
import { updateSectionContent } from "@/lib/section-workspace";

export function polishWeakSections(project: ProjectKit): ProjectKit {
  return getWeakSectionKeys(project).reduce((next, sectionKey) => {
    const issues = getSectionQualityIssues(next, sectionKey);
    const current = next.sections[sectionKey] ?? "";
    const patch = professionalPatch(next, sectionKey, issues);
    if (!patch.trim() || current.includes("## VibeForge Professional Polish")) return next;

    return updateSectionContent(
      next,
      sectionKey,
      `${current.trim()}\n\n${patch}`,
      `Auto-polished ${sectionTitle(sectionKey)}`,
      "Needs review",
    );
  }, project);
}

function professionalPatch(project: ProjectKit, sectionKey: string, issues: string[]) {
  const input = project.input;
  const name = project.name;
  const targetUsers = input.targetUsers || "the primary users";
  const desiredOutput = input.desiredOutput || "the requested output";
  const appSlug = slug(input.appType || name);
  const issueLines = issues.length ? issues.map((issue) => `- ${issue}`).join("\n") : "- Tighten this section for implementation handoff.";
  const videoStyle = isVideoStyleLesson(project);

  const common = `## VibeForge Professional Polish\nQuality gaps addressed:\n${issueLines}\n\nProject anchor: ${name} helps ${targetUsers} produce ${desiredOutput}.`;

  if (sectionKey === "task-plan") {
    if (videoStyle) {
      return `${common}\n\n### Agent-Ready Task Contract\nFiles:\n- src/lib/lesson-schema.ts\n- src/data/seed-lessons.ts\n- src/app/page.tsx\n- src/app/lesson/[lessonId]/page.tsx\n- src/components/lesson-player.tsx\n- src/components/speak-button.tsx\n- src/lib/local-lessons.ts\n\nImplementation notes:\n- Build only the local-first video-style vocabulary lesson workflow.\n- Do not add /api/process, provider calls, Supabase, Auth, billing, team workspaces, repo cloning, or real video rendering.\n- Use timed LessonCard data, browser storage, and Web Speech API.\n\nDependencies:\n- Define lesson schema and seed content before the player.\n- Build the player before local persistence polish.\n- Add Web Speech API playback after the current-card state exists.\n\nAcceptance criteria:\n- A learner can open /, start /lesson/[lessonId], play/pause timed cards, move next/previous, restart, and hear narration.\n- Lesson edits or playback state survive refresh.\n- The core flow requires no API key, account, provider, or cloud database.\n\nTest command:\n\`\`\`powershell\nnpm.cmd exec -- tsc --noEmit\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\``;
    }

    return `${common}\n\n### Agent-Ready Task Contract\nFiles:\n- src/app/page.tsx\n- src/components/${appSlug}/IntakeForm.tsx\n- src/app/api/process/route.ts\n- src/lib/${appSlug}/validation.ts\n- src/lib/${appSlug}/storage.ts\n\nImplementation notes:\n- Build only the first end-to-end workflow for ${targetUsers}.\n- Keep the core flow local-first and usable without API keys.\n- Do not add billing, team workspaces, repo cloning, or paid rendering before the MVP proves value.\n\nDependencies:\n- Complete the intake form before API processing.\n- Complete API processing before preview/export.\n- Complete local storage before history or sharing.\n\nAcceptance criteria:\n- A user can enter the minimum input and receive ${desiredOutput}.\n- Empty, loading, validation, and provider-failure states are visible.\n- The generated result can be copied or exported.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\nnpm.cmd run check:exports\n\`\`\``;
  }

  if (sectionKey === "api-specification") {
    if (videoStyle) {
      return `${common}\n\n## Core MVP API Contract\nNo API route is required for the core flow. The MVP should use seeded lesson data plus browser persistence.\n\nLocal modules:\n- src/data/seed-lessons.ts: seeded VideoLesson records.\n- src/lib/lesson-schema.ts: VideoLesson, LessonCard, PlaybackState types and validation helpers.\n- src/lib/local-lessons.ts: IndexedDB/localStorage read/write helpers.\n\nFuture routes only after MVP validation:\n- POST /api/import-lessons for importing shared lesson JSON.\n- GET /api/export-lessons for cloud/export workflows.\n\nAcceptance criteria:\n- / and /lesson/[lessonId] work without network calls after the app loads.\n- No Supabase, Auth, Gemini, OpenRouter, or API key is required.\n- Any future route validates input and returns user-safe errors.`;
    }

    return `${common}\n\n## Minimum API Contract\nEndpoint: POST /api/process\n\nRequest body:\n\`\`\`json\n{\n  "title": "string",\n  "description": "string",\n  "targetUsers": "${targetUsers}",\n  "options": {\n    "mode": "demo | provider",\n    "format": "preview | export"\n  }\n}\n\`\`\`\n\nResponse body:\n\`\`\`json\n{\n  "id": "output_123",\n  "status": "complete",\n  "result": {\n    "summary": "string",\n    "sections": []\n  },\n  "source": "demo | provider"\n}\n\`\`\`\n\nError cases:\n- 400 invalid_request: required fields are missing.\n- 413 payload_too_large: uploaded content is too large.\n- 429 rate_limited: too many provider-backed attempts.\n- 500 processing_failed: demo fallback or provider processing failed.\n\nFiles to edit:\n- src/app/api/process/route.ts\n- src/lib/${appSlug}/validation.ts\n- src/lib/${appSlug}/processor.ts\n\nValidation:\n- Use Zod schemas for request and response types.\n- Never return provider API keys or internal error stacks.`;
  }

  if (sectionKey === "ai-handoff") {
    return `${common}\n\n## Upload These Files Together\n1. PROJECT_BRIEF.md\n2. MVP_SCOPE.md\n3. ARCHITECTURE.md\n4. API_SPEC.md\n5. TASKS.md\n6. SECURITY_CHECKLIST.md\n7. TEST_PLAN.md\n8. NEXT_ACTIONS.md\n\n## Primary Agent Prompt\n\`\`\`text\nRead the full VibeForge kit before editing. Implement only the smallest milestone that proves ${desiredOutput} for ${targetUsers}. Preserve local-first behavior. Do not require API keys for the core flow. Do not clone external repositories automatically. Before editing, inspect every file listed in TASKS.md. After editing, run the listed test command and report changed files, checks run, and remaining risks.\n\`\`\`\n\n## Quality Gate\n- The target user, problem, and desired output are visible in the implemented workflow.\n- Every edited route validates input and returns user-safe errors.\n- Export or copy behavior still works after the change.\n\n## Definition Of Done\n- Acceptance criteria in TASKS.md are satisfied.\n- Lint/build/export checks pass or the root cause is documented.\n- No secrets, unrelated rewrites, or external repo code are introduced.`;
  }

  if (sectionKey === "repo-tool-map") {
    return `${common}\n\n## Repo Reference Safety Policy\n- Repo URLs are for documentation, architecture ideas, package discovery, and UX pattern review only.\n- Do not clone repositories automatically.\n- Do not copy source files unless the user approves license review and code reuse.\n- Prefer official package installation commands and public docs over copied code.\n\n## Agent Usage Prompt\n\`\`\`text\nReview the listed repo URLs for inspiration only. Summarize useful package choices, file organization, and UX patterns. Do not clone, execute, or copy repository code. Recommend only the smallest patterns needed for the MVP.\n\`\`\``;
  }

  if (sectionKey === "security-checklist") {
    return `${common}\n\n## Production Safety Requirements\n- Secrets: never hardcode API keys, service-role keys, webhook secrets, or provider tokens.\n- Validation: validate every API request with Zod before processing.\n- Rate limits: apply limits before provider calls, uploads, exports, and expensive generation.\n- Logging: log status, model, route, and duration; never log prompts containing secrets or raw API keys.\n- Storage: keep local-first mode available; add owner-scoped RLS before cloud sync.\n- CORS and cookies: allow only trusted origins and use secure cookie settings in production.\n- Repo safety: keep all references URL-only unless the user approves license review.\n\nSmoke check:\n\`\`\`powershell\nnpm.cmd run check:production\nnpm.cmd run build\n\`\`\``;
  }

  if (sectionKey === "deployment-plan") {
    return `${common}\n\n## Deployment Smoke Test\n1. Deploy with provider and Supabase variables empty to prove demo mode works.\n2. Open / and generate one kit without login.\n3. Export Markdown, JSON, ZIP, Codex Pack, and Cline Pack.\n4. Disable or break the provider configuration and confirm demo fallback preserves the project.\n5. Confirm no generated file contains API keys or service-role secrets.\n\nVerification commands:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\nnpm.cmd run check:product\nnpm.cmd run check:exports\n\`\`\`\n\nRollback:\n- Disable provider-backed generation first.\n- Keep localStorage projects readable.\n- Do not block users from exporting existing kits.`;
  }

  if (sectionKey === "next-actions") {
    return `${common}\n\n## Next 5 Highest-Value Actions\n1. Review TASKS.md and approve only the first milestone.\n2. Export the Codex Pack or Cline Pack for the coding agent you will use.\n3. Build the smallest workflow that produces ${desiredOutput} for ${targetUsers}.\n4. Run lint, build, and export checks before adding provider-only features.\n5. Regenerate any section still marked weak before sharing the kit with another builder.`;
  }

  if (sectionKey === "codex-cline-prompts") {
    return `${common}\n\n## Codex Prompt\n\`\`\`text\nRead AGENTS.md, PROJECT_BRIEF.md, TASKS.md, API_SPEC.md, SECURITY_CHECKLIST.md, and TEST_PLAN.md. Implement the next unchecked task only. Preserve local-first behavior and export packs. Do not clone external repositories automatically. Run the listed test command and report changed files plus risks.\n\`\`\`\n\n## Cline Prompt\n\`\`\`text\nUse this kit as the implementation contract. Start with the smallest user-visible slice for ${desiredOutput}. Keep edits focused, inspect files before changing them, and avoid paid services unless TASKS.md explicitly asks for them.\n\`\`\`\n\n## Review Prompt\n\`\`\`text\nReview the implementation for broken local-first flow, missing validation, export regressions, leaked secrets, weak error states, and unapproved repo code reuse. Findings first, then checks run.\n\`\`\``;
  }

  if (videoStyle) {
    return `${common}\n\n## Implementation Readiness Addendum\nFiles to inspect first:\n- src/app/page.tsx\n- src/app/lesson/[lessonId]/page.tsx\n- src/components/lesson-player.tsx\n- src/components/speak-button.tsx\n- src/lib/lesson-schema.ts\n- src/lib/local-lessons.ts\n- src/data/seed-lessons.ts\n\nAcceptance criteria:\n- This section supports the local-first video-style lesson player without introducing API/provider/cloud requirements.\n- It preserves no-secret handling, browser persistence, Web Speech API playback, and no-clone repo policy.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\``;
  }

  return `${common}\n\n## Implementation Readiness Addendum\nFiles to inspect first:\n- src/app/page.tsx\n- src/app/api/process/route.ts\n- src/components/${appSlug}/\n- src/lib/${appSlug}/\n\nAcceptance criteria:\n- This section gives a coding agent enough context to act without another brief.\n- It preserves local-first behavior, no-secret handling, and no-clone repo policy.\n\nTest command:\n\`\`\`powershell\nnpm.cmd run lint\nnpm.cmd run build\n\`\`\``;
}

function isVideoStyleLesson(project: ProjectKit) {
  const text = [
    project.name,
    project.input.idea,
    project.input.appType,
    project.input.desiredOutput,
    project.sections["product-strategy"],
    project.sections["mvp-scope"],
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    (text.includes("video-style") || text.includes("timed card") || text.includes("lesson player")) &&
    (text.includes("english") || text.includes("tieng anh") || text.includes("vocabulary"))
  );
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "app";
}
