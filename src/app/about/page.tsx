import Link from "next/link";
import {
  Code2,
  FileText,
  GitBranch,
  Lightbulb,
  PackageCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: Sparkles, title: "Project Kit Generator", desc: "Turn a rough idea into 17+ structured sections covering strategy, tasks, architecture, security, and launch." },
  { icon: PackageCheck, title: "Repo & Tool Navigator", desc: "Curated database of repos with use-now, use-later, reference-only, and avoid-for-MVP guidance." },
  { icon: Workflow, title: "Cost-Aware AI Routing", desc: "Cheap models for drafts, strong models for architecture. Budget controls and caching built in." },
  { icon: Code2, title: "Agent Export Packs", desc: "Generate Codex, Cline, Cursor, and Claude Code packs with rules, briefs, tasks, prompts, and next actions." },
  { icon: GitBranch, title: "MCP Integration Registry", desc: "Configure and export MCP connections for IDE, CLI, GitHub, n8n, and custom servers." },
  { icon: FileText, title: "Multi-Format Export", desc: "Export as Markdown, JSON, full ZIP, or agent-specific ZIP. Each section can be downloaded individually." },
];

const steps = [
  "Describe your app idea and constraints in the Builder.",
  "VibeForge generates a structured project kit with 17+ sections.",
  "Review tabs, approve sections, and refine details.",
  "Export as ZIP, Markdown, JSON, or an agent-specific pack.",
  "Hand the kit to your coding agent and start building.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero */}
      <div>
        <Badge variant="teal">AI Project Operating System</Badge>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-950">About VibeForge</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          VibeForge helps non-technical users convert rough software ideas into complete AI-buildable project systems:
          strategy, scope, files, agent rules, tool recommendations, settings plans, and launch kits.
        </p>
      </div>

      {/* What makes it different */}
      <div className="rounded-lg border border-teal-200 bg-teal-50 p-5 text-sm leading-7 text-teal-900">
        <p className="font-medium">Why VibeForge instead of just chatting with an AI?</p>
        <p className="mt-2 text-teal-800">
          Instead of chatting endlessly, you describe your idea once. VibeForge produces structured files, repo recommendations,
          implementation prompts, and export-ready artifacts that Codex, Cline, Cursor, Claude Code, Gemini CLI, or Antigravity can use to build.
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-950">Core Features</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title}>
                <CardContent className="flex gap-3 pt-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{f.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-600">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-950">How It Works</h2>
        <div className="mt-4 space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-6 text-zinc-700">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supported agents */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-950">Supported Agents & Tools</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Codex CLI", "Cline", "Cursor", "Claude Code", "Gemini CLI", "Antigravity", "OpenHands", "Superpowers"].map((name) => (
            <Badge key={name} variant="teal">{name}</Badge>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 border-t border-zinc-100 pt-6">
        <Link href="/">
          <Button>
            <Lightbulb className="h-4 w-4" />
            Start building
          </Button>
        </Link>
        <Link href="/repo-map">
          <Button variant="secondary">
            <Zap className="h-4 w-4" />
            Browse tools
          </Button>
        </Link>
      </div>

      <p className="text-xs text-zinc-400">
        VibeForge v0.1 - Local-first MVP. Projects and settings are stored in your browser.
        No API key required for demo mode.
      </p>
    </div>
  );
}
