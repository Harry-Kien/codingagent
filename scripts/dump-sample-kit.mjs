/**
 * Dump a sample kit's sections to individual Markdown files for QA review.
 * Uses tsx to run TypeScript with path aliases resolved.
 * Since we can't import TS directly, we'll parse the generator output by
 * calling the Next.js API route via a local dev server, or we can 
 * replicate the logic inline using the compiled output.
 * 
 * Instead: we'll start the dev server, hit the API, and dump the result.
 */
import http from "node:http";
import { writeFileSync, mkdirSync } from "node:fs";

const OUTPUT_DIR = "scripts/qa-review";

const sampleInput = {
  idea: "AI video app for small shops that generates product showcase videos from product photos and descriptions",
  targetUsers: "Small shop owners, local retailers, Shopee/TikTok Shop sellers",
  problem: "Small shops can't afford professional video production for their products",
  desiredOutput: "30-second product showcase videos with text overlays, background music, and transitions",
  appType: "AI video app",
  timeline: "7 day build",
  skillLevel: "Builder",
  budgetSensitivity: "high",
  preferredStack: ["Next.js", "Supabase"],
  apiProviders: ["OpenRouter"],
  wantsMcp: true,
  wantsAutomation: true,
};

// Section key -> export filename mapping
const FILE_MAP = {
  "product-strategy": "PRODUCT_REQUIREMENTS.md",
  "mvp-scope": "MVP_SCOPE.md",
  "feature-roadmap": "ROADMAP.md",
  "stack-recommendation": "ARCHITECTURE.md",
  "repo-tool-map": "REPO_REFERENCES.md",
  "cost-aware-ai-plan": "AI_PLAN.md",
  "database-schema": "DATABASE_SCHEMA.md",
  "api-specification": "API_SPEC.md",
  "ui-screens": "UI_SCREENS.md",
  "user-flows": "USER_FLOWS.md",
  "coding-agent-rules": "AGENTS.md",
  "ai-handoff": "AI_HANDOFF.md",
  "task-plan": "TASKS.md",
  "implementation-phases": "IMPLEMENTATION_PHASES.md",
  "next-actions": "NEXT_ACTIONS.md",
  "test-plan": "TEST_PLAN.md",
  "deployment-plan": "DEPLOYMENT_PLAN.md",
  "security-checklist": "SECURITY_CHECKLIST.md",
  "launch-kit": "LAUNCH_KIT.md",
  "codex-cline-prompts": "VIBE_CODING_PROMPTS.md",
};

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const body = JSON.stringify({
    input: sampleInput,
    generationMode: "balanced",
  });

  const result = await new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/generate-kit",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error(`Invalid JSON: ${data.slice(0, 500)}`));
          }
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });

  if (result.error) {
    console.error("API error:", result.error);
    process.exit(1);
  }

  const project = result.project;
  console.log(`Project: ${project.name}`);
  console.log(`Generation: ${project.generation?.source} / ${project.generation?.mode}`);
  console.log(`Sections: ${Object.keys(project.sections).length}`);
  console.log(`Repo recommendations: ${project.repoRecommendations?.length ?? 0}`);
  console.log("");

  // Dump each section
  for (const [key, filename] of Object.entries(FILE_MAP)) {
    const content = project.sections[key] ?? "";
    const filePath = `${OUTPUT_DIR}/${filename}`;
    writeFileSync(filePath, `# ${filename}\n\n${content}\n`);
    console.log(`  ${filename}: ${content.length} chars`);
  }

  // Dump full project JSON
  writeFileSync(`${OUTPUT_DIR}/project.json`, JSON.stringify(project, null, 2));
  console.log(`\n  project.json: ${JSON.stringify(project).length} chars`);
  console.log(`\nAll files written to ${OUTPUT_DIR}/`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
