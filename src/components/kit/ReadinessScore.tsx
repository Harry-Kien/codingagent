import type { ReadinessScore as ReadinessScoreType } from "@/types/vibeforge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const scoreItems = [
  ["Product clarity", "productClarity"],
  ["MVP focus", "mvpFocus"],
  ["Technical feasibility", "technicalFeasibility"],
  ["Cost efficiency", "costEfficiency"],
  ["Agent readiness", "agentReadiness"],
  ["Launch readiness", "launchReadiness"],
] as const;

export function ReadinessScore({ score }: { score: ReadinessScoreType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Readiness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {scoreItems.map(([label, key]) => (
            <div key={key} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-zinc-700">{label}</span>
                <span className="font-mono font-semibold text-zinc-950">{score[key]}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-200">
                <div className="h-2 rounded-full bg-teal-700" style={{ width: `${score[key]}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <ScoreList title="Strengths" items={score.strengths} />
          <ScoreList title="Risks" items={score.risks} />
          <ScoreList title="Next actions" items={score.nextActions} />
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm leading-5 text-zinc-600">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
