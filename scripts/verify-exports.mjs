import { readFileSync } from "node:fs";

const kitSections = readFileSync("src/lib/kit-sections.ts", "utf8");
const templates = readFileSync("src/lib/templates.ts", "utf8");
const exportLib = readFileSync("src/lib/export.ts", "utf8");
const generator = readFileSync("src/lib/generator.ts", "utf8");
const repoData = readFileSync("src/lib/repo-data.ts", "utf8");

const requiredPacks = {
  "Codex Pack": ["AGENTS.md", "PROJECT_BRIEF.md", "TASKS.md", "TOOLS.md", "NEXT_ACTIONS.md", "CODEX_PROMPTS.md"],
  "Cline Pack": [".clinerules", "PROJECT_BRIEF.md", "TASKS.md", "NEXT_ACTIONS.md"],
  "Cursor Pack": [".cursorrules", "PROJECT_BRIEF.md", "TASKS.md", "NEXT_ACTIONS.md"],
  "Claude Code Pack": ["CLAUDE.md", "PROJECT_BRIEF.md", "TASKS.md", "NEXT_ACTIONS.md"],
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

const missingPackFiles = Object.values(requiredPacks)
  .flat()
  .filter((filename, index, files) => files.indexOf(filename) === index)
  .filter((filename) => !kitSections.includes(filename));
const missingTemplates = requiredTemplates.filter((label) => !templates.includes(label));
const missingExports = requiredExportFunctions.filter((name) => !exportLib.includes(`function ${name}`));
const missingLanes = requiredLanes.filter((lane) => !repoData.includes(lane));
const missingVideoTools = requiredVideoTools.filter((tool) => !repoData.includes(tool));

for (const [pack, files] of Object.entries(requiredPacks)) {
  if (!kitSections.includes(pack)) fail(`Missing ${pack}`);
  for (const filename of files) {
    if (!kitSections.includes(filename)) fail(`Missing ${filename} in ${pack}`);
  }
}

if (!exportLib.includes("project.readinessScore?.nextActions")) {
  fail("NEXT_ACTIONS.md export does not defensively handle older kits without readinessScore.");
}

if (!generator.includes("selectAppTemplate(input)")) {
  fail("Generator is not using app-type templates.");
}

if (!repoData.includes('"remotion", "ffmpeg"') || !repoData.includes('lane = "use-later"')) {
  fail("AI video recommendations must include heavy video tools while delaying them for MVP.");
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

console.log("Export packs and templates verified.");

function fail(message) {
  console.error(`Export/template verification failed: ${message}`);
  process.exit(1);
}
