"use client";

import { useState, useMemo } from "react";
import {
  ExternalLink,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/empty-state";
import { repoTools } from "@/lib/repo-data";
import { APP_TEMPLATES } from "@/lib/templates";
import type { RepoTool } from "@/types/vibeforge";

const categories = Array.from(new Set(repoTools.map((t) => t.category))).sort();
const difficulties: RepoTool["difficulty"][] = ["easy", "medium", "hard"];
const usageTypes: RepoTool["howToUse"][] = ["install", "clone", "reference-only", "external-tool", "import-workflow"];
const appTypeLabels = APP_TEMPLATES.map((template) => template.label);

const diffBadge: Record<string, "green" | "amber" | "coral"> = { easy: "green", medium: "amber", hard: "coral" };
const usageBadge: Record<string, "green" | "blue" | "amber" | "teal" | "neutral"> = {
  install: "green",
  clone: "blue",
  "reference-only": "amber",
  "external-tool": "teal",
  "import-workflow": "neutral",
};

export default function RepoMapPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [usage, setUsage] = useState("");
  const [appType, setAppType] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const selectedTemplate = APP_TEMPLATES.find((template) => template.label === appType);
    const appQueries = selectedTemplate ? [selectedTemplate.label, ...selectedTemplate.aliases] : [];
    return repoTools.filter((t) => {
      const haystack = `${t.name} ${t.useCase} ${t.category} ${t.tags.join(" ")}`.toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (appQueries.length && !appQueries.some((query) => haystack.includes(query.toLowerCase()))) return false;
      if (category && t.category !== category) return false;
      if (difficulty && t.difficulty !== difficulty) return false;
      if (usage && t.howToUse !== usage) return false;
      return true;
    });
  }, [search, appType, category, difficulty, usage]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">Repo & Tool Navigator</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
          Curated tools and repos for AI-powered product building. Each entry explains when to use it, how to integrate, and cost/risk considerations.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            className="pl-9"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All difficulty</option>
          {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800"
          value={usage}
          onChange={(e) => setUsage(e.target.value)}
        >
          <option value="">All usage types</option>
          {usageTypes.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800"
          value={appType}
          onChange={(e) => setAppType(e.target.value)}
        >
          <option value="">All app types</option>
          {appTypeLabels.map((label) => <option key={label} value={label}>{label}</option>)}
        </select>
      </div>

      <p className="mt-3 text-xs text-zinc-500">{filtered.length} tool{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No tools match those filters"
          description="Clear one filter or search for a broader app type such as video, dashboard, automation, content, or commerce."
        />
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tool) => (
          <Card key={tool.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-teal-700"
                    >
                      {tool.name}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </CardTitle>
                  <CardDescription>{tool.useCase}</CardDescription>
                </div>
                <Badge variant={diffBadge[tool.difficulty]}>{tool.difficulty}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant={usageBadge[tool.howToUse] ?? "neutral"}>{tool.howToUse}</Badge>
                <Badge variant="neutral">{tool.category}</Badge>
                <Badge variant={tool.productionReadiness === "high" ? "green" : tool.productionReadiness === "medium" ? "amber" : "coral"}>
                  {tool.productionReadiness} readiness
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 text-sm">
              <div>
                <h4 className="text-xs font-semibold text-zinc-800">When to use</h4>
                <p className="mt-0.5 text-zinc-600">{tool.whenToUse}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-800">When NOT to use</h4>
                <p className="mt-0.5 text-zinc-600">{tool.whenNotToUse}</p>
              </div>
              {tool.riskNotes && (
                <div>
                  <h4 className="text-xs font-semibold text-zinc-800">Risk / License</h4>
                  <p className="mt-0.5 text-zinc-600">{tool.riskNotes}</p>
                </div>
              )}
              {tool.costNotes && (
                <div>
                  <h4 className="text-xs font-semibold text-zinc-800">Cost</h4>
                  <p className="mt-0.5 text-zinc-600">{tool.costNotes}</p>
                </div>
              )}
              <div className="mt-auto border-t border-zinc-100 pt-3">
                <h4 className="text-xs font-semibold text-zinc-800">Suggested agent prompt</h4>
                <p className="mt-0.5 rounded bg-zinc-50 p-2 font-mono text-xs text-zinc-700">
                  {tool.suggestedPrompt}
                </p>
              </div>
            </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
