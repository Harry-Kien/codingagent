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
  const overall = Math.round(
    scoreItems.reduce((total, [, key]) => total + score[key], 0) / scoreItems.length,
  );
  const label = overall >= 90 ? "Agent-ready" : overall >= 80 ? "Strong draft" : overall >= 70 ? "Needs polish" : "Needs work";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Build Readiness</CardTitle>
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-900">
            <span>{label}</span>
            <span className="font-mono">{overall}/100</span>
          </div>
        </div>
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
