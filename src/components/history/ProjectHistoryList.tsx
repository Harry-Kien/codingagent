"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  Cloud,
  CloudUpload,
  Copy,
  Download,
  ExternalLink,
  HardDrive,
  Trash2,
} from "lucide-react";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SyncStatusBadge } from "@/components/app/SyncStatusBadge";
import {
  localGetProjects,
  localDeleteProject,
  localDuplicateProject,
  getCloudProjects,
  deleteCloudProject,
  saveCloudProject,
  importLocalProjectsToCloud,
  resolveStoreMode,
  type SyncStatus,
} from "@/lib/project-store";
import { downloadZip } from "@/lib/export";
import { useAuth } from "@/lib/auth";

export function ProjectHistoryList() {
  const { user, isAuthenticated, isSupabaseAvailable } = useAuth();
  const storeMode = resolveStoreMode(isAuthenticated, isSupabaseAvailable);

  const [projects, setProjects] = useState<ProjectKit[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local-only");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (storeMode === "cloud" && user) {
      const result = await getCloudProjects(user.id);
      if (result.error) {
        setSyncStatus("sync-failed");
        // Fall back to local
        setProjects(localGetProjects());
      } else {
        setSyncStatus("cloud-synced");
        setProjects(result.data);
      }
    } else {
      setSyncStatus("local-only");
      setProjects(localGetProjects());
    }
  }, [storeMode, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  async function handleDelete(id: string) {
    if (storeMode === "cloud") {
      await deleteCloudProject(id);
    }
    localDeleteProject(id);
    void refresh();
  }

  async function handleDuplicate(id: string) {
    const copy = localDuplicateProject(id);
    if (copy && storeMode === "cloud" && user) {
      await saveCloudProject(copy, user.id);
    }
    void refresh();
  }

  async function handleImportToCloud() {
    if (!user) return;
    setImporting(true);
    setImportResult(null);
    const result = await importLocalProjectsToCloud(user.id);
    setImporting(false);
    if (result.error) {
      setImportResult(`Import failed: ${result.error}`);
    } else {
      setImportResult(`Imported ${result.imported} project(s) to cloud.`);
      void refresh();
    }
  }

  const hasLocalProjects = localGetProjects().length > 0;

  if (!projects.length) {
    return (
      <EmptyState
        title="No project kits yet"
        description="Generate a kit from the builder, then reopen and export it from here."
        action={
          <Link href="/">
            <Button>Open builder</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <SyncStatusBadge status={syncStatus} />
        {storeMode === "cloud" && hasLocalProjects && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleImportToCloud()}
            disabled={importing}
          >
            <CloudUpload className="h-4 w-4" />
            {importing ? "Importing…" : "Import local projects to cloud"}
          </Button>
        )}
        {importResult && (
          <span className="text-xs text-zinc-600">{importResult}</span>
        )}
      </div>

      {/* Project list */}
      <div className="grid gap-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold text-zinc-950">{project.name}</h2>
                  <Badge variant="teal">{project.input.appType}</Badge>
                  <Badge variant="neutral">{project.input.timeline}</Badge>
                  {storeMode === "cloud" ? (
                    <Badge variant="blue" className="gap-1">
                      <Cloud className="h-3 w-3" /> Cloud
                    </Badge>
                  ) : (
                    <Badge variant="neutral" className="gap-1">
                      <HardDrive className="h-3 w-3" /> Local
                    </Badge>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 max-w-4xl text-sm leading-6 text-zinc-600">{project.input.idea}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  Created {new Date(project.createdAt).toLocaleString()} · Stack: {project.input.preferredStack.join(", ") || "Recommended defaults"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/projects/${project.id}`}>
                  <Button variant="primary" size="sm">
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleDuplicate(project.id)}
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" onClick={() => void downloadZip(project)}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
