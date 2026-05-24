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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repo & Tool Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane) => {
          const items = recommendations.filter((item) => item.lane === lane);
          return (
            <div key={lane} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <Badge variant={lane === "reference-only" ? "amber" : lane === "avoid-mvp" ? "coral" : lane === "use-later" ? "blue" : "teal"}>
                {laneLabels[lane]}
              </Badge>
              <div className="mt-3 space-y-2">
                {items.length ? (
                  items.map(({ tool, reason }) => (
                    <div key={tool.id} className="rounded border border-zinc-200 bg-white p-2">
                      <div className="text-sm font-medium text-zinc-800">{tool.name}</div>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{reason}</p>
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
