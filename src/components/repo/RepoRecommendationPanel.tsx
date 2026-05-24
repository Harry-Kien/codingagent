import type { RepoRecommendation } from "@/types/vibeforge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const lanes: RepoRecommendation["lane"][] = [
  "use-directly",
  "install",
  "future",
  "reference",
  "agent-workflow",
];

export function RepoRecommendationPanel({ recommendations }: { recommendations: RepoRecommendation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repo & Tool Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-5">
        {lanes.map((lane) => {
          const items = recommendations.filter((item) => item.lane === lane);
          return (
            <div key={lane} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <Badge variant={lane === "reference" ? "amber" : lane === "agent-workflow" ? "blue" : "teal"}>
                {lane.replace("-", " ")}
              </Badge>
              <div className="mt-3 space-y-2">
                {items.length ? (
                  items.map(({ tool }) => (
                    <div key={tool.id} className="text-sm font-medium text-zinc-800">
                      {tool.name}
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
