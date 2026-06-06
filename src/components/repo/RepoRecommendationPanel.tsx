"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import type { RepoRecommendation } from "@/types/vibeforge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const lanes: RepoRecommendation["lane"][] = [
  "use-now",
  "use-later",
  "reference-only",
  "avoid-mvp",
];

const laneLabels: Record<RepoRecommendation["lane"], string> = {
  "use-now": "Use now",
  "use-later": "Use later",
  "reference-only": "Reference only",
  "avoid-mvp": "Avoid for MVP",
};

export function RepoRecommendationPanel({ recommendations }: { recommendations: RepoRecommendation[] }) {
  const [liveRecommendations, setLiveRecommendations] = useState<RepoRecommendation[]>([]);
  const [liveUpdatedAt, setLiveUpdatedAt] = useState<string | null>(null);
  const [loadingLive, setLoadingLive] = useState(false);

  const topic = useMemo(() => {
    const source = recommendations
      .map((item) => `${item.tool.name} ${item.tool.category} ${item.tool.tags.join(" ")}`)
      .join(" ");
    const isVideo = /\b(video|remotion|ffmpeg|media|showcase)\b/i.test(source);
    const isCommerce = /\b(shop|commerce|product|store|shopify)\b/i.test(source);
    if (isVideo && isCommerce) return "ai video product showcase nextjs";
    if (isVideo) return "ai video nextjs remotion";
    if (isCommerce) return "ecommerce ai nextjs";
    return "ai agent nextjs";
  }, [recommendations]);

  useEffect(() => {
    let active = true;
    async function loadLiveRepos() {
      setLoadingLive(true);
      try {
        const response = await fetch(`/api/trending-repos?topic=${encodeURIComponent(topic)}`, { cache: "no-store" });
        const data = await response.json();
        if (!active || !Array.isArray(data.repos)) return;
        const items: RepoRecommendation[] = data.repos.slice(0, 6).map((tool: RepoRecommendation["tool"]) => ({
          tool,
          lane: "reference-only",
          reason: "Live GitHub reference. Use README/docs for architecture ideas only; do not clone automatically.",
        }));
        setLiveRecommendations(items);
        setLiveUpdatedAt(typeof data.updatedAt === "string" ? data.updatedAt : null);
      } catch {
        if (active) setLiveRecommendations([]);
      } finally {
        if (active) setLoadingLive(false);
      }
    }
    void loadLiveRepos();
    return () => {
      active = false;
    };
  }, [topic]);

  const mergedRecommendations = useMemo(() => {
    const seen = new Set<string>();
    return [...recommendations, ...liveRecommendations].filter((item) => {
      const key = item.tool.url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [recommendations, liveRecommendations]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Repo & Tool Recommendations</CardTitle>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {loadingLive && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            <span>{liveRecommendations.length ? `${liveRecommendations.length} live GitHub refs` : "Curated refs"}</span>
            {liveUpdatedAt && <span>{new Date(liveUpdatedAt).toLocaleTimeString()}</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane) => {
          const items = mergedRecommendations.filter((item) => item.lane === lane);
          return (
            <div key={lane} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <Badge variant={lane === "reference-only" ? "amber" : lane === "avoid-mvp" ? "coral" : lane === "use-later" ? "blue" : "teal"}>
                {laneLabels[lane]}
              </Badge>
              <div className="mt-3 space-y-2">
                {items.length ? (
                  items.map(({ tool, reason }) => (
                    <div key={tool.id} className="rounded border border-zinc-200 bg-white p-2">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-zinc-800 hover:text-teal-700"
                      >
                        {tool.name}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <p className="mt-1 break-all text-[11px] leading-4 text-teal-700">{tool.url}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{reason}</p>
                      <p className="mt-1 text-[11px] leading-4 text-zinc-400">
                        URL reference only. Do not clone automatically.
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">No items</p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
