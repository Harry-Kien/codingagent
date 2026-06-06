"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ClipboardList,
  FolderClock,
  Map,
  PlayCircle,
  Settings,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectKit } from "@/types/vibeforge";
import { useProjectStore } from "@/lib/use-project-store";
import { AGENT_ROLES } from "@/lib/agent-kit";

const productFlow = [
  { label: "Builder", href: "/", detail: "Create task/run from a rough idea" },
  { label: "Project detail", href: "/projects", detail: "Agent plan, generated kit, execution notes, exports" },
  { label: "Repo Map", href: "/repo-map", detail: "Route, component, API, dependency, risk, and reference map" },
  { label: "Agent Kit", href: "/agent-kit", detail: "Specialized agents and prompts" },
  { label: "Settings", href: "/settings", detail: "Provider profiles and MCP connections" },
];

const readinessItems = [
  "Generate a kit in demo mode",
  "Open generated project detail from history",
  "Export Markdown, JSON, ZIP, and agent packs",
  "Copy and regenerate a section",
  "Save provider settings locally",
  "Add an MCP connection",
  "View repo recommendations for an AI video app",
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectKit[]>([]);
  const store = useProjectStore();

  useEffect(() => {
    let active = true;
    void store.getProjects().then((items) => {
      if (active) setProjects(items);
    });
    return () => {
      active = false;
    };
  }, [store]);

  const latest = projects[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="teal">Launch cockpit</Badge>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            A compact control room for demo readiness: generate a kit, inspect history, map the repo, choose an agent role, and verify settings.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/">
            <Button>
              <Sparkles className="h-4 w-4" />
              Create task/run
            </Button>
          </Link>
          <Link href="/agent-kit">
            <Button variant="secondary">
              <Bot className="h-4 w-4" />
              Open Agent Kit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={FolderClock} label="Projects" value={projects.length} detail="Local/cloud kits in history" />
        <Metric icon={Bot} label="Agent roles" value={AGENT_ROLES.length} detail="Review, fix, map, test, deploy" />
        <Metric icon={Map} label="Repo map" value="Live" detail="Curated and trending references" />
        <Metric icon={ClipboardList} label="Core mode" value="Demo" detail="Works without API keys" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Product Flow</CardTitle>
            <CardDescription>Normalized route sequence for a launch demo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {productFlow.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition hover:border-teal-200 hover:bg-teal-50"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-teal-700">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-zinc-950">{item.label}</span>
                  <span className="block text-xs leading-5 text-zinc-500">{item.detail}</span>
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Run</CardTitle>
            <CardDescription>Resume the most recent generated kit.</CardDescription>
          </CardHeader>
          <CardContent>
            {latest ? (
              <div className="space-y-3">
                <Badge variant="blue">{latest.input.appType}</Badge>
                <h2 className="text-base font-semibold text-zinc-950">{latest.name}</h2>
                <p className="line-clamp-4 text-sm leading-6 text-zinc-600">{latest.input.idea}</p>
                <Link href={`/projects/${latest.id}`}>
                  <Button className="w-full">
                    <PlayCircle className="h-4 w-4" />
                    Open result/report
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 p-5 text-center">
                <p className="text-sm font-semibold text-zinc-900">No generated runs yet</p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">Create a demo kit first, then return here for the report cockpit.</p>
                <Link href="/" className="mt-3 inline-flex">
                  <Button size="sm">Open builder</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Demo Readiness Checklist</CardTitle>
              <CardDescription>Manual checks that mirror the launch criteria in AGENTS.md.</CardDescription>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          {readinessItems.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-700" />
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof FolderClock;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <Icon className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-xs font-medium uppercase text-zinc-500">{label}</span>
          <span className="mt-1 block text-xl font-semibold text-zinc-950">{value}</span>
          <span className="mt-1 block text-xs leading-5 text-zinc-500">{detail}</span>
        </span>
      </CardContent>
    </Card>
  );
}
