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

const kitSections = readFileSync("src/lib/kit-sections.ts", "utf8");
const templates = readFileSync("src/lib/templates.ts", "utf8");
const exportLib = readFileSync("src/lib/export.ts", "utf8");
const exportCore = readFileSync("src/lib/export-core.ts", "utf8");
const generator = readFileSync("src/lib/generator.ts", "utf8");
const generatorShared = readFileSync("src/lib/generator-shared.ts", "utf8");
const serverGenerator = readFileSync("src/lib/server-generator.ts", "utf8");
const repoData = readFileSync("src/lib/repo-data.ts", "utf8");

const {
  agentPackFileEntries,
  exportContainsSensitiveMarkers,
  kitToMarkdown,
  projectJsonString,
  zipFileEntries,
} = require("../src/lib/export-core.ts");
const { generateMockKit } = require("../src/lib/generator-shared.ts");
const { ZIP_FILE_MAP } = require("../src/lib/kit-sections.ts");

const requiredPacks = {
  "Codex Pack": ["AGENTS.md", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "TOOLS.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "SECURITY_CHECKLIST.md", "TEST_PLAN.md", "IMPLEMENTATION_PHASES.md"],
  "Cline Pack": [".clinerules", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "TOOLS.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "SECURITY_CHECKLIST.md", "TEST_PLAN.md", "IMPLEMENTATION_PHASES.md"],
  "Cursor Pack": [".cursorrules", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "TOOLS.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "SECURITY_CHECKLIST.md", "TEST_PLAN.md", "IMPLEMENTATION_PHASES.md"],
  "Claude Code Pack": ["CLAUDE.md", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "TOOLS.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md", "VIBE_CODING_PROMPTS.md", "ARCHITECTURE.md", "SECURITY_CHECKLIST.md", "TEST_PLAN.md", "IMPLEMENTATION_PHASES.md"],
};

const requiredTemplates = [
  "AI video app",
  "SaaS dashboard",
  "n8n automation",
  "Internal business tool",
  "Content tool",
  "E-commerce helper",
];

const requiredExportFunctions = [
  "kitToMarkdown",
  "downloadMarkdown",
  "downloadProjectJson",
  "downloadZip",
  "downloadAgentPack",
];

const requiredLanes = ["use-now", "use-later", "reference-only", "avoid-mvp"];
const requiredVideoTools = ["remotion", "ffmpeg", "videosos", "storygen-atelier", "short-video-maker"];

const requiredExportFiles = [
  "AI_HANDOFF.md", "PRODUCT_REQUIREMENTS.md", "MVP_SCOPE.md", "ARCHITECTURE.md",
  "API_SPEC.md", "TASKS.md", "IMPLEMENTATION_PHASES.md", "REPO_REFERENCES.md",
  "TEST_PLAN.md", "SECURITY_CHECKLIST.md", "VIBE_CODING_PROMPTS.md", "NEXT_ACTIONS.md",
];

const missingPackFiles = Object.values(requiredPacks)
  .flat()
  .filter((filename, index, files) => files.indexOf(filename) === index)
  .filter((filename) => !kitSections.includes(filename));
const missingTemplates = requiredTemplates.filter((label) => !templates.includes(label));
const exportSource = `${exportLib}\n${exportCore}`;
const missingExports = requiredExportFunctions.filter((name) => !exportSource.includes(name));
const missingLanes = requiredLanes.filter((lane) => !repoData.includes(lane));
const missingVideoTools = requiredVideoTools.filter((tool) => !repoData.includes(tool));

for (const [pack, files] of Object.entries(requiredPacks)) {
  if (!kitSections.includes(pack)) fail(`Missing ${pack}`);
  for (const filename of files) {
    if (!kitSections.includes(filename)) fail(`Missing ${filename} in ${pack}`);
  }
}

if (!exportCore.includes("project.readinessScore?.nextActions")) {
  fail("NEXT_ACTIONS.md export does not defensively handle older kits without readinessScore.");
}

if (!generator.includes("generateMockKit") || !generatorShared.includes("selectAppTemplate(input)")) {
  fail("Generator is not using app-type templates.");
}

if (!generatorShared.includes("Acceptance criteria") || !generatorShared.includes("Test command")) {
  fail("Shared generator must emit task-quality markers for coding agents.");
}

if (!generatorShared.includes("Upload These Files Together") || !generatorShared.includes("Quality Gate Before Coding")) {
  fail("Shared generator must emit an upload-ready AI handoff brief.");
}

if (!exportSource.includes("AI_HANDOFF.md") || !exportSource.includes("aiHandoffFile")) {
  fail("Agent exports must include AI_HANDOFF.md.");
}

if (!generatorShared.includes("GitHub Discovery URLs") || !generatorShared.includes("Do not clone")) {
  fail("Shared generator must include repo URL fallback and no-clone policy.");
}

for (const architectureTerm of ["AI Provider Layer", "Backend And API Layer", "Deployment", "Risks"]) {
  if (!generatorShared.includes(architectureTerm)) {
    fail(`Shared generator architecture output is missing: ${architectureTerm}`);
  }
}

if (!serverGenerator.includes("implementation-ready project kit") || !serverGenerator.includes("Do not clone repositories automatically") || !serverGenerator.includes("AI Handoff Brief")) {
  fail("Server generator prompt must enforce implementation-ready output and no-clone repo policy.");
}

if (!repoData.includes('"remotion", "ffmpeg"') || !repoData.includes('lane = "use-later"')) {
  fail("AI video recommendations must include heavy video tools while delaying them for MVP.");
}

// Verify all required export files are mapped in agent pack export
for (const filename of requiredExportFiles) {
  if (!exportSource.includes(filename)) {
    fail(`Agent export is missing required file mapping: ${filename}`);
  }
}

// Verify export pack files include the full production-ready set
for (const [pack, expectedFiles] of Object.entries(requiredPacks)) {
  for (const filename of expectedFiles) {
    if (!kitSections.includes(filename)) {
      fail(`${pack} is missing required file: ${filename}`);
    }
  }
}

if (missingPackFiles.length || missingTemplates.length || missingExports.length || missingLanes.length || missingVideoTools.length) {
  console.error("Export/template verification failed.");
  if (missingPackFiles.length) console.error(`Missing pack files: ${missingPackFiles.join(", ")}`);
  if (missingTemplates.length) console.error(`Missing templates: ${missingTemplates.join(", ")}`);
  if (missingExports.length) console.error(`Missing export functions: ${missingExports.join(", ")}`);
  if (missingLanes.length) console.error(`Missing recommendation lanes: ${missingLanes.join(", ")}`);
  if (missingVideoTools.length) console.error(`Missing AI video tools: ${missingVideoTools.join(", ")}`);
  process.exit(1);
}

verifyGeneratedExportContents();

console.log("Export packs, templates, and generated file contents verified.");

function fail(message) {
  console.error(`Export/template verification failed: ${message}`);
  process.exit(1);
}

function verifyGeneratedExportContents() {
  const project = generateMockKit({
    idea: "Build an AI video app for small shops that turns product descriptions into video scripts and prompts.",
    targetUsers: "Small shop owners",
    problem: "They need weekly product videos but lack a production plan.",
    desiredOutput: "A 7-day plan with scripts, captions, shot lists, and AI video prompts.",
    appType: "AI video app",
    timeline: "7 day build",
    skillLevel: "Non-coder",
    budgetSensitivity: "high",
    preferredStack: ["Next.js", "Supabase"],
    apiProviders: ["OpenRouter"],
    wantsMcp: true,
    wantsAutomation: true,
  });

  const markdown = kitToMarkdown(project);
  for (const heading of ["Product Requirements", "Task Plan", "Security Checklist", "Vibe Coding Prompts"]) {
    if (!markdown.includes(`# ${heading}`)) fail(`Markdown export missing heading: ${heading}`);
  }

  const projectWithProviderMetadata = {
    ...project,
    generation: {
      mode: "deep",
      source: "provider",
      providerName: "Sensitive Provider Name",
      model: "sensitive/model",
      fallbackReason: "sk-test-sensitive-fallback",
      generatedAt: project.createdAt,
    },
  };
  const json = projectJsonString(projectWithProviderMetadata);
  for (const forbidden of ["Sensitive Provider Name", "sensitive/model", "sk-test-sensitive-fallback", "apiKey"]) {
    if (json.includes(forbidden)) fail(`Project JSON export leaked sensitive metadata: ${forbidden}`);
  }

  const zipEntries = zipFileEntries(project);
  for (const filename of Object.values(ZIP_FILE_MAP)) {
    if (!zipEntries[filename]) fail(`ZIP export missing file: ${filename}`);
  }
  if (!zipEntries["project.json"]) fail("ZIP export missing project.json.");
  if (!zipEntries["TASKS.md"]?.includes("Acceptance criteria")) fail("ZIP TASKS.md lacks acceptance criteria.");

  for (const packId of ["codex", "cline", "cursor", "claude-code"]) {
    const entries = agentPackFileEntries(project, packId);
    if (!entries["AI_HANDOFF.md"]?.includes("Primary Agent Prompt")) {
      fail(`${packId} pack missing usable AI_HANDOFF.md.`);
    }
    if (!entries["TASKS.md"]?.includes("Test command")) {
      fail(`${packId} pack missing task test commands.`);
    }
    if (!entries["project.json"]) fail(`${packId} pack missing project.json.`);
    const combined = Object.values(entries).join("\n");
    if (exportContainsSensitiveMarkers(combined)) fail(`${packId} pack includes sensitive export markers.`);
  }
}
