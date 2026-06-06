import { readFileSync } from "node:fs";

const files = {
  kitSections: read("src/lib/kit-sections.ts"),
  generatorShared: read("src/lib/generator-shared.ts"),
  serverGenerator: read("src/lib/server-generator.ts"),
  generationClient: read("src/lib/generation-client.ts"),
  templates: read("src/lib/templates.ts"),
  types: read("src/types/vibeforge.ts"),
  repoData: read("src/lib/repo-data.ts"),
  exportLib: `${read("src/lib/export.ts")}\n${read("src/lib/export-core.ts")}`,
  kitQuality: read("src/lib/kit-quality.ts"),
};

const requiredPacks = {
  "Codex Pack": ["AGENTS.md", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "TOOLS.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "SECURITY_CHECKLIST.md", "TEST_PLAN.md", "IMPLEMENTATION_PHASES.md"],
  "Cline Pack": [".clinerules", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "TOOLS.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "SECURITY_CHECKLIST.md"],
  "Cursor Pack": [".cursorrules", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "TOOLS.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "SECURITY_CHECKLIST.md"],
  "Claude Code Pack": ["CLAUDE.md", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "TOOLS.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "SECURITY_CHECKLIST.md"],
};

const requiredTemplates = [
  "AI video app",
  "SaaS dashboard",
  "n8n automation",
  "Internal business tool",
  "Content tool",
  "E-commerce helper",
];

const requiredLanes = ["use-now", "use-later", "reference-only", "avoid-mvp"];
const requiredZipFiles = ["PRODUCT_REQUIREMENTS.md", "TASKS.md", "REPO_REFERENCES.md", "API_SPEC.md", "TEST_PLAN.md", "SECURITY_CHECKLIST.md", "AI_HANDOFF.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "IMPLEMENTATION_PHASES.md"];
const requiredQualityTerms = ["Acceptance criteria", "Test command", "Do not clone", "GitHub Discovery URLs", "AI Provider Layer", "Frontend", "Backend And API Layer", "Storage", "Deployment", "Risks", "Upload These Files Together", "Quality Gate Before Coding", "Definition Of Done"];
const requiredServerPromptTerms = ["implementation-ready project kit", "Do not clone repositories automatically", "GitHub search URLs", "acceptance criteria", "test commands", "AI Handoff Brief"];

// Repo count check: minimum 80, ideal 100+
const repoIdMatches = files.repoData.match(/id:\s*"/g);
const repoCount = repoIdMatches ? repoIdMatches.length : 0;
if (repoCount < 80) {
  throw new Error(`Repo map has only ${repoCount} repos. Minimum is 80.`);
}
console.log(`Repo map: ${repoCount} repos (minimum 80, ideal 100+).`);

// Validate repo URLs are present
const repoUrlMatches = files.repoData.match(/url:\s*"https?:\/\/[^"]+"/g);
const repoUrlCount = repoUrlMatches ? repoUrlMatches.length : 0;
if (repoUrlCount < 80) {
  throw new Error(`Repo map has only ${repoUrlCount} valid URLs. Every repo must have a URL.`);
}

for (const [pack, filenames] of Object.entries(requiredPacks)) {
  assertIncludes(files.kitSections, pack, `Missing ${pack}`);
  filenames.forEach((filename) => assertIncludes(files.kitSections, filename, `Missing ${filename} in ${pack}`));
}

requiredTemplates.forEach((template) => {
  assertIncludes(files.templates, template, `Missing app template: ${template}`);
});

requiredLanes.forEach((lane) => {
  assertIncludes(files.types, lane, `Missing lane type: ${lane}`);
  assertIncludes(files.repoData, lane, `Missing recommendation lane usage: ${lane}`);
});

requiredZipFiles.forEach((filename) => {
  assertIncludes(files.kitSections, filename, `Missing ZIP/export file mapping: ${filename}`);
  assertIncludes(files.exportLib, filename, `Missing agent-pack file content mapping: ${filename}`);
});

requiredQualityTerms.forEach((term) => {
  assertIncludes(files.generatorShared, term, `Generator output contract is missing: ${term}`);
});

requiredServerPromptTerms.forEach((term) => {
  assertIncludes(files.serverGenerator, term, `Server generator prompt is missing: ${term}`);
});

// Verify generated kit includes AI_HANDOFF.md content
assertIncludes(files.generatorShared, "ai-handoff", "Generator must produce ai-handoff section.");
assertIncludes(files.generatorShared, "Primary Agent Prompt", "AI handoff must include a primary agent prompt.");

// Verify TASKS.md has acceptance criteria and test commands in generator
assertIncludes(files.generatorShared, "Acceptance criteria", "Task plan must include acceptance criteria.");
assertIncludes(files.generatorShared, "Test command", "Task plan must include test commands.");

// Verify API_SPEC.md has request/response in generator
assertIncludes(files.generatorShared, "Request body", "API spec must include request body examples.");
assertIncludes(files.generatorShared, "Response body", "API spec must include response body examples.");

// Verify export includes AI_HANDOFF.md and REPO_REFERENCES.md
assertIncludes(files.exportLib, "AI_HANDOFF.md", "Export must include AI_HANDOFF.md.");
assertIncludes(files.exportLib, "REPO_REFERENCES.md", "Export must include REPO_REFERENCES.md.");

// Verify no-clone policy in server prompt
assertIncludes(files.serverGenerator, "Do not clone", "Server prompt must include no-clone policy.");
assertIncludes(files.serverGenerator, "return 52_000", "Deep provider deadline should fit the 60s route budget.");
assertIncludes(files.serverGenerator, "return 42_000", "Balanced provider deadline should give providers enough time.");
assertIncludes(files.serverGenerator, "return 28_000", "Fast provider deadline should not be shorter than common model latency.");
assertIncludes(files.generationClient, "SERVER_GENERATION_TIMEOUT_MS = 58_000", "Browser generation timeout must be longer than server provider deadlines.");

// Verify demo generator has non-thin output
assertIncludes(files.generatorShared, "implementation-phases", "Demo generator must produce implementation phases.");
assertIncludes(files.generatorShared, "task-plan", "Demo generator must produce task plan.");
assertIncludes(files.generatorShared, "security-checklist", "Demo generator must produce security checklist.");

assertIncludes(files.exportLib, "downloadAgentPack", "Missing agent pack export function");
assertIncludes(files.exportLib, "downloadZip", "Missing ZIP export function");
assertIncludes(files.kitQuality, "evaluateKitQuality", "Missing public-beta kit quality evaluator.");
assertIncludes(files.kitQuality, "Has API error cases", "Quality evaluator must check API error cases.");
assertIncludes(files.kitQuality, "Has deployment smoke test", "Quality evaluator must check deployment readiness.");

console.log("Product checks passed.");

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function assertIncludes(content, needle, message) {
  if (!content.includes(needle)) {
    throw new Error(message);
  }
}
