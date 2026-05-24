import { readFileSync } from "node:fs";

const files = {
  kitSections: read("src/lib/kit-sections.ts"),
  templates: read("src/lib/templates.ts"),
  types: read("src/types/vibeforge.ts"),
  repoData: read("src/lib/repo-data.ts"),
  exportLib: read("src/lib/export.ts"),
};

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

const requiredLanes = ["use-now", "use-later", "reference-only", "avoid-mvp"];
const requiredZipFiles = ["PROJECT_BRIEF.md", "TASKS.md", "TOOLS.md", "TEST_PLAN.md", "LAUNCH_KIT.md", "CODEX_PROMPTS.md"];

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
});

assertIncludes(files.exportLib, "downloadAgentPack", "Missing agent pack export function");
assertIncludes(files.exportLib, "downloadZip", "Missing ZIP export function");

console.log("Product checks passed.");

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function assertIncludes(content, needle, message) {
  if (!content.includes(needle)) {
    throw new Error(message);
  }
}
