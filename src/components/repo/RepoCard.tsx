import { ExternalLink } from "lucide-react";
import type { RepoRecommendation, RepoTool } from "@/types/vibeforge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const laneLabel: Record<RepoRecommendation["lane"], string> = {
  "use-now": "Use now",
  "use-later": "Use later",
  "reference-only": "Reference only",
  "avoid-mvp": "Avoid for MVP",
};

export function RepoCard({
  tool,
  recommendation,
}: {
  tool: RepoTool;
  recommendation?: RepoRecommendation;
}) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{tool.name}</CardTitle>
            <p className="mt-1 text-sm text-zinc-600">{tool.useCase}</p>
          </div>
          <a href={tool.url} target="_blank" rel="noreferrer" className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100">
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="blue">{tool.category}</Badge>
          <Badge variant="teal">{tool.howToUse}</Badge>
          {recommendation ? <Badge variant="amber">{laneLabel[recommendation.lane]}</Badge> : null}
          <Badge variant={tool.productionReadiness === "high" ? "green" : "amber"}>
            {tool.productionReadiness} readiness
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-zinc-700">
        {recommendation ? <p className="font-medium text-teal-900">{recommendation.reason}</p> : null}
        <p><span className="font-semibold text-zinc-900">Use when:</span> {tool.whenToUse}</p>
        <p><span className="font-semibold text-zinc-900">Avoid when:</span> {tool.whenNotToUse}</p>
        <p><span className="font-semibold text-zinc-900">Risk:</span> {tool.riskNotes}</p>
        <p><span className="font-semibold text-zinc-900">Cost:</span> {tool.costNotes}</p>
      </CardContent>
    </Card>
  );
}
