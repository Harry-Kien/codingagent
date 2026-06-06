"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cloud, CloudUpload, Copy, Download, ExternalLink, Trash2 } from "lucide-react";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SyncStatusBadge } from "@/components/auth/SyncStatusBadge";
import { useAuth } from "@/lib/auth-context";
import { useProjectStore } from "@/lib/use-project-store";
import { getProjects as getLocalProjects } from "@/lib/storage";
import { downloadZip } from "@/lib/export";

export function ProjectHistoryList() {
  const [projects, setProjects] = useState<ProjectKit[]>([]);
  const [importStatus, setImportStatus] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const store = useProjectStore();
  // Stable ref so the initial-load effect doesn't re-run on every store change.
  const storeRef = useRef(store);
  useEffect(() => { storeRef.current = store; }, [store]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        const list = await storeRef.current.getProjects();
        if (!cancelled) setProjects(list);
      })();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [store.mode]);
  // Re-fetch only when mode changes (local/cloud), not on every store ref change.

  async function refresh() {
    const list = await storeRef.current.getProjects();
    setProjects(list);
  }

  // Show import option: user is signed in + there are local projects
  const localProjects = useMemo(() => (user ? getLocalProjects() : []), [user]);

  async function handleImport(project: ProjectKit) {
    const result = await store.importToCloud(project);
    setImportStatus((prev) => ({ ...prev, [project.id]: result }));
    if (result === "imported") {
      void refresh();
    }
  }

  if (!projects.length && !localProjects.length) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-zinc-950">Projects</h1>
        <SyncStatusBadge />
      </div>

      {/* Import local projects to cloud */}
      {user && localProjects.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <CloudUpload className="h-4 w-4 text-teal-700" />
              <span className="text-sm font-semibold text-zinc-950">
                Import local projects to cloud
              </span>
              <Badge variant="amber">{localProjects.length} local</Badge>
            </div>
            <p className="mb-3 text-xs text-zinc-500">
              You have projects in browser storage. Import them to your cloud account for sync across devices.
            </p>
            <div className="flex flex-wrap gap-2">
              {localProjects.map((project) => (
                <Button
                  key={project.id}
                  variant="outline"
                  size="sm"
                  disabled={importStatus[project.id] === "imported" || importStatus[project.id] === "exists"}
                  onClick={() => void handleImport(project)}
                >
                  <Cloud className="h-3 w-3" />
                  {importStatus[project.id] === "imported"
                    ? "Imported"
                    : importStatus[project.id] === "exists"
                      ? "Already in cloud"
                      : importStatus[project.id] === "error"
                        ? "Failed - retry"
                        : project.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                </div>
                <p className="mt-2 line-clamp-2 max-w-4xl text-sm leading-6 text-zinc-600">{project.input.idea}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  Created {new Date(project.createdAt).toLocaleString()} - Stack: {project.input.preferredStack.join(", ") || "Recommended defaults"}
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
                  onClick={() => {
                    void store.duplicateProject(project.id).then(() => refresh());
                  }}
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
                  onClick={() => {
                    void store.deleteProject(project.id).then(() => refresh());
                  }}
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
