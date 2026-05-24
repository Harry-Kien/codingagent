"use client";

import { Archive, Download, FileJson, FileText } from "lucide-react";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { downloadMarkdown, downloadProjectJson, downloadZip } from "@/lib/export";

export function ExportButton({
  project,
  mode = "zip",
  sectionKey,
}: {
  project: ProjectKit;
  mode?: "zip" | "markdown" | "json" | "section";
  sectionKey?: string;
}) {
  const icon =
    mode === "json" ? (
      <FileJson className="h-4 w-4" />
    ) : mode === "zip" ? (
      <Archive className="h-4 w-4" />
    ) : mode === "section" ? (
      <Download className="h-4 w-4" />
    ) : (
      <FileText className="h-4 w-4" />
    );
  const label =
    mode === "json" ? "JSON" : mode === "zip" ? "ZIP" : mode === "section" ? "Download" : "Markdown";
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        if (mode === "zip") void downloadZip(project);
        if (mode === "json") downloadProjectJson(project);
        if (mode === "markdown") downloadMarkdown(project);
        if (mode === "section") downloadMarkdown(project, sectionKey);
      }}
    >
      {icon}
      {label}
    </Button>
  );
}
