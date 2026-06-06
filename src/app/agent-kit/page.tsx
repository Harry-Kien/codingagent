import { CopyButton } from "@/components/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AGENT_ROLES } from "@/lib/agent-kit";

export default function AgentKitPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="teal">Agent operating system</Badge>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">Agent Kit</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Role-specific agents for turning a VibeForge kit into controlled implementation work. Each role has a mission, input files, outputs, guardrails, and a copy-ready prompt.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <Metric label="Agents" value={AGENT_ROLES.length} />
          <Metric label="Core flow" value="8 roles" />
          <Metric label="Secrets" value="Excluded" />
          <Metric label="Repo use" value="Reference" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {AGENT_ROLES.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <CardTitle>{agent.name}</CardTitle>
                      <CardDescription>{agent.mission}</CardDescription>
                    </div>
                  </div>
                  <CopyButton text={agent.prompt} label="Copy prompt" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoBlock title="Use when" items={[agent.useWhen]} />
                <InfoBlock title="Reads" items={agent.reads} />
                <InfoBlock title="Outputs" items={agent.outputs} />
                <InfoBlock title="Guardrails" items={agent.guardrails} />
                <pre className="max-h-36 overflow-auto whitespace-pre-wrap rounded-md bg-zinc-950 p-3 text-xs leading-5 text-zinc-100">
                  {agent.prompt}
                </pre>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
      <p className="text-[11px] font-medium uppercase text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase text-zinc-500">{title}</h2>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Badge key={item} variant="neutral">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
