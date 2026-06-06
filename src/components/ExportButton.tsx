"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { AlertCircle, Archive, ClipboardCheck, Download, FileJson, FileText, Package } from "lucide-react";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { downloadAgentPack, downloadMarkdown, downloadProjectJson, downloadQualityReport, downloadZip } from "@/lib/export";
import type { AgentExportPackId } from "@/lib/kit-sections";

export function ExportButton({
  project,
  mode = "zip",
  sectionKey,
  packId,
  label,
}: {
  project: ProjectKit;
  mode?: "zip" | "markdown" | "json" | "section" | "agent-pack" | "quality-report";
  sectionKey?: string;
  packId?: AgentExportPackId;
  label?: string;
}) {
  const [status, setStatus] = useState<"idle" | "working" | "failed">("idle");
  const icon =
    mode === "quality-report" ? (
      <ClipboardCheck className="h-4 w-4" />
    ) : mode === "json" ? (
      <FileJson className="h-4 w-4" />
    ) : mode === "zip" ? (
      <Archive className="h-4 w-4" />
    ) : mode === "agent-pack" ? (
      <Package className="h-4 w-4" />
    ) : mode === "section" ? (
      <Download className="h-4 w-4" />
    ) : status === "failed" ? (
      <AlertCircle className="h-4 w-4" />
    ) : (
      <FileText className="h-4 w-4" />
    );
  const fallbackLabel =
    mode === "quality-report"
      ? "Quality Report"
      : mode === "json"
      ? "JSON"
      : mode === "zip"
        ? "ZIP"
        : mode === "agent-pack"
          ? "Agent pack"
          : mode === "section"
            ? "Download"
            : "Markdown";

  async function handleExport() {
    setStatus("working");
    try {
      if (mode === "zip") await downloadZip(project);
      if (mode === "json") downloadProjectJson(project);
      if (mode === "markdown") downloadMarkdown(project);
      if (mode === "quality-report") downloadQualityReport(project);
      if (mode === "section") downloadMarkdown(project, sectionKey);
      if (mode === "agent-pack") {
        if (!packId) throw new Error("Missing export pack.");
        await downloadAgentPack(project, packId);
      }
      track("kit_export_completed", {
        mode,
        packId: packId ?? "",
        appType: project.input.appType,
        section: sectionKey ?? "",
      });
      setStatus("idle");
    } catch {
      track("kit_export_failed", { mode, packId: packId ?? "", section: sectionKey ?? "" });
      setStatus("failed");
    }
  }

  return (
    <Button
      variant={status === "failed" ? "secondary" : "outline"}
      size="sm"
      disabled={status === "working"}
      title={status === "failed" ? "Export failed. Click to retry." : undefined}
      onClick={() => void handleExport()}
    >
      {icon}
      {status === "working" ? "Exporting..." : status === "failed" ? "Retry export" : label ?? fallbackLabel}
    </Button>
  );
}
