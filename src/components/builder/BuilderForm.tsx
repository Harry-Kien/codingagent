"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, FlaskConical, Gauge, Sparkles, Zap } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ClarificationPanel } from "@/components/ClarificationPanel";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { defaultInput, generateProjectKit, sampleVideoInput } from "@/lib/generator";
import { clarificationQuestions } from "@/lib/generator";
import { generateKitFromServer, hasServerProvider } from "@/lib/generation-client";
import { useProjectStore } from "@/lib/use-project-store";
import { getActiveProvider } from "@/lib/storage";
import type { GenerationMode, ProjectInput } from "@/types/vibeforge";

const appTypes = [
  "AI video app",
  "SaaS dashboard",
  "n8n automation",
  "Internal business tool",
  "Content tool",
  "E-commerce helper",
  "AI tool",
  "n8n workflow",
  "Mobile app idea",
  "Other",
];

const timelines = ["1 night MVP", "1 day MVP", "7 day build", "30 day product", "Full production system"];
const skillLevels = ["Non-coder", "Beginner", "Builder", "Developer"];
const generationModes: Array<{ value: GenerationMode; label: string; description: string }> = [
  { value: "fast", label: "Fast draft", description: "Lower cost first pass." },
  { value: "balanced", label: "Balanced", description: "Best default for most kits." },
  { value: "deep", label: "Deep planning", description: "Richer architecture and tasks." },
];

const formSchema = z.object({
  idea: z.string().min(12, "Describe the project idea in at least one sentence."),
  targetUsers: z.string().optional(),
  problem: z.string().optional(),
  desiredOutput: z.string().optional(),
  appType: z.string(),
  timeline: z.string(),
  skillLevel: z.string(),
  budgetSensitivity: z.enum(["low", "medium", "high"]),
  preferredStackText: z.string().optional(),
  apiProvidersText: z.string().optional(),
  wantsMcp: z.boolean(),
  wantsAutomation: z.boolean(),
  generationMode: z.enum(["fast", "balanced", "deep"]),
});

type BuilderFormValues = z.infer<typeof formSchema>;

export function BuilderForm() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const base = defaultInput();
  const form = useForm<BuilderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...base,
      preferredStackText: base.preferredStack.join(", "),
      apiProvidersText: base.apiProviders.join(", "),
      generationMode: "balanced",
    },
  });
  const watched = useWatch({ control: form.control });
  const currentValues: BuilderFormValues = {
    idea: watched.idea ?? "",
    targetUsers: watched.targetUsers ?? "",
    problem: watched.problem ?? "",
    desiredOutput: watched.desiredOutput ?? "",
    appType: watched.appType ?? base.appType,
    timeline: watched.timeline ?? base.timeline,
    skillLevel: watched.skillLevel ?? base.skillLevel,
    budgetSensitivity: watched.budgetSensitivity ?? base.budgetSensitivity,
    preferredStackText: watched.preferredStackText ?? base.preferredStack.join(", "),
    apiProvidersText: watched.apiProvidersText ?? base.apiProviders.join(", "),
    wantsMcp: watched.wantsMcp ?? base.wantsMcp,
    wantsAutomation: watched.wantsAutomation ?? base.wantsAutomation,
    generationMode: watched.generationMode ?? "balanced",
  };
  const questions = clarificationQuestions(toInput(currentValues));

  function applySample() {
    const sample = sampleVideoInput();
    form.reset({
      ...sample,
      preferredStackText: sample.preferredStack.join(", "),
      apiProvidersText: sample.apiProviders.join(", "),
      generationMode: "balanced",
    });
  }

  function chooseDefaults() {
    const sample = {
      targetUsers: currentValues.targetUsers || "First-time founders, freelancers, and non-technical builders.",
      problem: currentValues.problem || "The user has a rough idea but lacks a structured build plan and agent-ready files.",
      desiredOutput:
        currentValues.desiredOutput ||
        "A complete project kit with Markdown files, repo recommendations, tasks, tests, deployment plan, and launch assets.",
    };
    form.setValue("targetUsers", sample.targetUsers);
    form.setValue("problem", sample.problem);
    form.setValue("desiredOutput", sample.desiredOutput);
  }

  const store = useProjectStore();

  async function submit(values: BuilderFormValues) {
    setIsGenerating(true);
    setError("");
    try {
      const input = toInput(values);
      const provider = getActiveProvider();
      const generationMode = values.generationMode;
      // Prefer server-side generation when a provider is configured.
      let project = hasServerProvider(provider)
        ? await generateKitFromServer(input, provider, generationMode).catch(() => null)
        : null;
      // Fall back to client-side (demo mode) generation.
      if (!project) {
        project = await generateProjectKit(input);
        project = {
          ...project,
          generation: {
            mode: generationMode,
            source: "demo",
            generatedAt: new Date().toISOString(),
            fallbackReason: provider ? "Provider generation failed; demo fallback was used." : "No active provider was used.",
          },
        };
      }
      await store.saveProject(project);
      router.push(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed. Try demo mode again.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (isGenerating) return <LoadingState />;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="teal">Local-first MVP</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-normal text-zinc-950 sm:text-3xl">
              Turn a rough idea into an AI-buildable project kit.
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Enter the idea, constraints, and build context. VibeForge returns exportable files, repo guidance, settings plans, and implementation prompts.
            </p>
          </div>
          <Button variant="secondary" onClick={applySample}>
            <FlaskConical className="h-4 w-4" />
            Load AI video sample
          </Button>
        </div>

        <ClarificationPanel questions={questions} onDefaults={chooseDefaults} />
        <AiModeStatus generationMode={currentValues.generationMode} />

        {error ? (
          <ErrorState
            message={error}
            suggestion="Demo mode does not require API keys. Check local provider settings if provider generation failed."
          />
        ) : null}

        <form onSubmit={form.handleSubmit(submit)}>
          <Card>
            <CardHeader>
              <CardTitle>Project Intake</CardTitle>
              <CardDescription>Keep it plain-language. Defaults are enough to generate a first kit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="idea">Project idea</Label>
                <Textarea
                  id="idea"
                  placeholder="I want to build an AI video app for small shops..."
                  {...form.register("idea")}
                />
                <FieldError>{form.formState.errors.idea?.message}</FieldError>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <TextField label="Target users" name="targetUsers" form={form} />
                <TextField label="Problem being solved" name="problem" form={form} />
                <TextField label="Desired output" name="desiredOutput" form={form} />
              </div>

              <Segmented
                label="App type"
                value={currentValues.appType}
                options={appTypes}
                onChange={(value) => form.setValue("appType", value)}
              />
              <Segmented
                label="Timeline"
                value={currentValues.timeline}
                options={timelines}
                onChange={(value) => form.setValue("timeline", value)}
              />
              <Segmented
                label="Skill level"
                value={currentValues.skillLevel}
                options={skillLevels}
                onChange={(value) => form.setValue("skillLevel", value)}
              />

              <div>
                <Label>Generation mode</Label>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                  {generationModes.map((mode) => (
                    <button
                      type="button"
                      key={mode.value}
                      onClick={() => form.setValue("generationMode", mode.value)}
                      className={`rounded-lg border p-3 text-left transition ${
                        currentValues.generationMode === mode.value
                          ? "border-teal-700 bg-teal-50 text-teal-950"
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {mode.value === "deep" ? <Gauge className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                        {mode.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-zinc-500">{mode.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="budgetSensitivity">Budget sensitivity</Label>
                  <Select id="budgetSensitivity" {...form.register("budgetSensitivity")}>
                    <option value="high">High - keep API cost low</option>
                    <option value="medium">Medium - balanced quality</option>
                    <option value="low">Low - optimize for quality</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferredStackText">Preferred stack</Label>
                  <Input id="preferredStackText" placeholder="Next.js, Supabase" {...form.register("preferredStackText")} />
                </div>
                <div>
                  <Label htmlFor="apiProvidersText">Providers already available</Label>
                  <Input id="apiProvidersText" placeholder="OpenRouter, Gemini" {...form.register("apiProvidersText")} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <CheckOption
                  label="Include MCP / IDE / CLI integration plan"
                  checked={currentValues.wantsMcp}
                  onChange={(checked) => form.setValue("wantsMcp", checked)}
                />
                <CheckOption
                  label="Include automation or n8n workflow plan"
                  checked={currentValues.wantsAutomation}
                  onChange={(checked) => form.setValue("wantsAutomation", checked)}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-zinc-500">
                  If no provider key is configured, generation uses deterministic demo mode and still saves the project.
                </p>
                <Button type="submit">
                  <Sparkles className="h-4 w-4" />
                  Generate project kit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>What you get</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-700">
            {["18 structured kit sections", "Repo/tool recommendations", "Markdown, JSON, ZIP, and agent packs", "Cost-aware AI model plan", "Codex, Cline, Cursor, and Claude Code prompts", "MCP config snippets"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-700" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Local storage notice</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-zinc-600">
            Projects, provider settings, and MCP entries are saved in this browser for the MVP. API keys are never hardcoded, but localStorage is not a secret vault.
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function AiModeStatus({ generationMode }: { generationMode: GenerationMode }) {
  const provider = getActiveProvider();
  const active = hasServerProvider(provider);
  return (
    <div className={`rounded-lg border p-3 text-sm ${active ? "border-teal-200 bg-teal-50 text-teal-900" : "border-zinc-200 bg-zinc-50 text-zinc-700"}`}>
      <div className="flex flex-wrap items-center gap-2 font-medium">
        <Sparkles className="h-4 w-4" />
        AI mode: {active ? `${provider?.providerName ?? "Provider"} active` : "Demo fallback"}
        <Badge variant={generationMode === "deep" ? "amber" : generationMode === "fast" ? "blue" : "teal"}>
          {generationMode === "deep" ? "Deep planning" : generationMode === "fast" ? "Fast draft" : "Balanced"}
        </Badge>
      </div>
      <p className="mt-1 text-xs leading-5 opacity-80">
        {active
          ? `Generation will use ${provider?.defaultModel || provider?.strongModel || provider?.cheapModel || "your configured model"} through server routes.`
          : "No active provider is available, so VibeForge will generate a deterministic demo kit."}
      </p>
    </div>
  );
}

function TextField({
  label,
  name,
  form,
}: {
  label: string;
  name: "targetUsers" | "problem" | "desiredOutput";
  form: ReturnType<typeof useForm<BuilderFormValues>>;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} {...form.register(name)} />
    </div>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
              value === option
                ? "border-teal-700 bg-teal-50 text-teal-900"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium text-zinc-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-teal-700"
      />
      {label}
    </label>
  );
}

function toInput(values: Partial<BuilderFormValues>): ProjectInput {
  return {
    idea: values.idea ?? "",
    targetUsers: values.targetUsers ?? "",
    problem: values.problem ?? "",
    desiredOutput: values.desiredOutput ?? "",
    appType: values.appType ?? "AI tool",
    timeline: values.timeline ?? "7 day build",
    skillLevel: values.skillLevel ?? "Non-coder",
    budgetSensitivity: values.budgetSensitivity ?? "high",
    preferredStack: splitList(values.preferredStackText),
    apiProviders: splitList(values.apiProvidersText),
    wantsMcp: Boolean(values.wantsMcp),
    wantsAutomation: Boolean(values.wantsAutomation),
  };
}

function splitList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
