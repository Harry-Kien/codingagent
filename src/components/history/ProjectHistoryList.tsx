"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, Download, ExternalLink, Trash2 } from "lucide-react";
import type { ProjectKit } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteProject, duplicateProject, getProjects } from "@/lib/storage";
import { downloadZip } from "@/lib/export";

export function ProjectHistoryList() {
  const [projects, setProjects] = useState<ProjectKit[]>([]);

  function refresh() {
    setProjects(getProjects());
  }

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(timer);
  }, []);

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
                onClick={() => {
                  duplicateProject(project.id);
                  refresh();
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
                  deleteProject(project.id);
                  refresh();
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
  );
}
