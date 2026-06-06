"use client";

import type { McpConnection, ProjectKit } from "@/types/vibeforge";
import {
  agentPackFileEntries,
  kitToMarkdown,
  mcpJsonString,
  projectJsonString,
  projectSlug,
  zipFileEntries,
} from "@/lib/export-core";
import { deriveReadinessScore, evaluateKitQuality, kitQualitySummary } from "@/lib/kit-quality";
import { type AgentExportPackId, AGENT_EXPORT_PACKS, sectionFilename, sectionTitle } from "@/lib/kit-sections";
import { downloadBlob, slugify } from "@/lib/utils";
import { showDownloadToast } from "@/components/ui/toast";

export { kitToMarkdown };

export function downloadMarkdown(project: ProjectKit, sectionKey?: string) {
  const name = slugify(project.name || "vibeforge-project");
  const content = sectionKey
    ? `# ${sectionTitle(sectionKey)}\n\n${project.sections[sectionKey] ?? ""}\n`
    : kitToMarkdown(project);
  const filename = sectionKey ? `${name}-${sectionFilename(sectionKey)}` : `${name}-project-kit.md`;
  downloadBlob(filename, new Blob([content], { type: "text/markdown;charset=utf-8" }));
  showDownloadToast(filename, sectionKey ? "Section exported" : "Full kit exported");
}

export function downloadProjectJson(project: ProjectKit) {
  const filename = `${projectSlug(project)}.json`;
  downloadBlob(
    filename,
    new Blob([projectJsonString(project)], { type: "application/json;charset=utf-8" }),
  );
  showDownloadToast(filename, "JSON exported");
}

export function downloadQualityReport(project: ProjectKit) {
  const checks = evaluateKitQuality(project);
  const summary = kitQualitySummary(project);
  const score = deriveReadinessScore(project);
  const overall = Math.round(
    (
      score.productClarity +
      score.mvpFocus +
      score.technicalFeasibility +
      score.costEfficiency +
      score.agentReadiness +
      score.launchReadiness
    ) / 6,
  );
  const report = [
    `# Quality Report - ${project.name}`,
    "",
    `Generated: ${new Date().toISOString()}`,
    `Overall readiness: ${overall}/100`,
    `Professional checks: ${summary.passed}/${summary.total}`,
    "",
    "## Readiness Scores",
    `- Product clarity: ${score.productClarity}`,
    `- MVP focus: ${score.mvpFocus}`,
    `- Technical feasibility: ${score.technicalFeasibility}`,
    `- Cost efficiency: ${score.costEfficiency}`,
    `- Agent readiness: ${score.agentReadiness}`,
    `- Launch readiness: ${score.launchReadiness}`,
    "",
    "## Strengths",
    ...score.strengths.map((item) => `- ${item}`),
    "",
    "## Risks",
    ...score.risks.map((item) => `- ${item}`),
    "",
    "## Next Actions",
    ...score.nextActions.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## Check Details",
    ...checks.map((check) => `- ${check.passed ? "[x]" : "[ ]"} ${check.label}${check.sectionKey ? ` (${sectionTitle(check.sectionKey)})` : ""}${check.passed ? "" : ` - ${check.guidance}`}`),
    "",
    "## Export Readiness",
    "- Markdown, JSON, ZIP, and agent packs should be re-exported after final polish.",
    "- Any section marked weak should be improved before handing the kit to a coding agent.",
  ].join("\n");
  const filename = `${projectSlug(project)}-quality-report.md`;
  downloadBlob(filename, new Blob([report], { type: "text/markdown;charset=utf-8" }));
  showDownloadToast(filename, "Quality report exported");
}

export async function downloadZip(project: ProjectKit) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  Object.entries(zipFileEntries(project)).forEach(([filename, content]) => {
    zip.file(filename, content);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const filename = `${projectSlug(project)}-kit.zip`;
  downloadBlob(filename, blob);
  showDownloadToast(filename, `${Object.keys(zip.files).length} files in ZIP`);
}

export async function downloadAgentPack(project: ProjectKit, packId: AgentExportPackId) {
  const pack = AGENT_EXPORT_PACKS.find((item) => item.id === packId);
  if (!pack) throw new Error("Unknown export pack.");

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  Object.entries(agentPackFileEntries(project, packId)).forEach(([filename, content]) => {
    zip.file(filename, content);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const zipFilename = `${projectSlug(project)}-${pack.id}-pack.zip`;
  downloadBlob(zipFilename, blob);
  showDownloadToast(zipFilename, `${pack.label} - ${pack.files.length} files`);
}

export function downloadMcpJson(connections: McpConnection[]) {
  const filename = "vibeforge-mcp-connections.json";
  downloadBlob(
    filename,
    new Blob([mcpJsonString(connections)], {
      type: "application/json;charset=utf-8",
    }),
  );
  showDownloadToast(filename, "MCP connections exported");
}
