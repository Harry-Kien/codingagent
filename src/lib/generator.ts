"use client";

import type { ProjectInput, ProjectKit } from "@/types/vibeforge";

// Re-export shared utilities so existing client imports continue to work.
export {
  buildProjectKit,
  generateMockKit,
  inferName,
  normalizeSections,
  regenerateSection,
  scoreProject,
  projectSlug,
} from "@/lib/generator-shared";

export { clarificationQuestions, generateProjectKit, defaultInput, sampleVideoInput };

import {
  generateMockKit,
} from "@/lib/generator-shared";

function clarificationQuestions(input: Partial<ProjectInput>) {
  const questions: string[] = [];
  if (!input.idea || input.idea.trim().split(/\s+/).length < 8) {
    questions.push("What exact user result should the first version produce?");
  }
  if (!input.targetUsers) questions.push("Who is the first paying or active user group?");
  if (!input.problem) questions.push("What painful workflow does this replace or speed up?");
  if (!input.desiredOutput) questions.push("What should the generated output look like?");
  if (input.appType === "Other") questions.push("Which existing app is closest to the idea?");
  return questions.slice(0, 5);
}

async function generateProjectKit(input: ProjectInput): Promise<ProjectKit> {
  // Client-side generation uses demo mode only.
  // Provider-backed generation goes through /api/generate-kit (server-side).
  return generateMockKit(input);
}

function defaultInput(): ProjectInput {
  return {
    idea: "",
    targetUsers: "",
    problem: "",
    desiredOutput: "",
    appType: "Other",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Tailwind", "shadcn/ui"],
    apiProviders: [],
    wantsMcp: true,
    wantsAutomation: false,
  };
}

function sampleVideoInput(): ProjectInput {
  return {
    idea: "I want to build an AI video app for small shops. The user enters a product description and the app creates a 7-day video content plan, scripts, captions, and prompts for Veo/Gemini/Sora.",
    targetUsers: "Small shop owners who need weekly product videos but do not have a marketing team.",
    problem: "They do not know what to post, what to say, or how to turn product details into a video campaign.",
    desiredOutput: "A 7-day content plan with scripts, captions, shot lists, and AI video prompts.",
    appType: "AI video app",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Supabase", "shadcn/ui"],
    apiProviders: ["Gemini", "OpenRouter"],
    wantsMcp: true,
    wantsAutomation: true,
  };
}
