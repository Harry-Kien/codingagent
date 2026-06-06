"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, ChevronDown, FlaskConical, Gauge, Server, ShieldCheck, SlidersHorizontal, Sparkles, Zap } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { QuickStartPanel } from "@/components/builder/QuickStartPanel";
import { TemplateGallery } from "@/components/builder/TemplateGallery";
import { defaultInput, generateProjectKit, sampleVideoInput } from "@/lib/generator";
import { generateKitFromServer, hasServerProvider } from "@/lib/generation-client";
import { useProjectStore } from "@/lib/use-project-store";
import { getActiveProvider } from "@/lib/storage";
import type { GenerationMode, ProjectInput, ProjectKit } from "@/types/vibeforge";

const appTypes = [
  "English learning app",
  "AI video app",
  "SaaS dashboard",
  "n8n automation",
  "Internal business tool",
  "Content tool",
  "E-commerce helper",
  "Education app",
  "Clinic app",
  "Local business app",
  "Marketplace",
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
type GenerationSource = "demo" | "provider" | "auto";
const generationSources: Array<{ value: GenerationSource; label: string; description: string }> = [
  { value: "demo", label: "Demo stable", description: "Reliable no-key kit generation." },
  { value: "provider", label: "Provider AI", description: "Use configured AI and validate output." },
  { value: "auto", label: "Auto fallback", description: "Try AI first, keep demo as backup." },
];
const serverProviderEnabled = process.env.NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_ENABLED === "true";
const serverProviderName = process.env.NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_NAME || "Server provider";
const serverProviderModel = process.env.NEXT_PUBLIC_VIBEFORGE_SERVER_PROVIDER_MODEL || "";

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
  generationSource: z.enum(["demo", "provider", "auto"]),
});

type BuilderFormValues = z.infer<typeof formSchema>;

export function BuilderForm() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const base = defaultInput();
  const form = useForm<BuilderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...base,
      preferredStackText: base.preferredStack.join(", "),
      apiProvidersText: base.apiProviders.join(", "),
      generationMode: "fast",
      generationSource: "demo",
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
    generationSource: watched.generationSource ?? "demo",
  };

  function applySample() {
    const sample = sampleVideoInput();
    form.reset({
      ...sample,
      preferredStackText: sample.preferredStack.join(", "),
      apiProvidersText: sample.apiProviders.join(", "),
      generationMode: "fast",
      generationSource: "demo",
    });
  }

  function applyTemplate(input: Partial<ProjectInput>) {
    form.setValue("idea", input.idea ?? "");
    form.setValue("targetUsers", input.targetUsers ?? "");
    form.setValue("problem", input.problem ?? "");
    form.setValue("desiredOutput", input.desiredOutput ?? "");
    form.setValue("appType", input.appType ?? "Other");
    form.setValue("timeline", input.timeline ?? "7 day build");
    form.setValue("skillLevel", input.skillLevel ?? "Non-coder");
    form.setValue("budgetSensitivity", input.budgetSensitivity ?? "high");
    form.setValue("preferredStackText", (input.preferredStack ?? []).join(", "));
    form.setValue("apiProvidersText", (input.apiProviders ?? []).join(", "));
    form.setValue("wantsMcp", input.wantsMcp ?? false);
    form.setValue("wantsAutomation", input.wantsAutomation ?? false);
    form.setValue("generationSource", "demo");
  }

  const store = useProjectStore();

  async function submit(values: BuilderFormValues) {
    setIsGenerating(true);
    setError("");
    try {
      track("kit_generate_started", {
        appType: values.appType,
        mode: values.generationMode,
        source: values.generationSource,
      });
      const input = toInput(values);
      const provider = getActiveProvider();
      const generationMode = values.generationMode;
      const generationSource = values.generationSource;
      // Prefer server-side generation so env-only providers work even when
      // the public UI hint was not available at build time.
      let project: ProjectKit | null = null;
      let serverError = "";
      const localProviderActive = hasServerProvider(provider);
      const providerForServer = localProviderActive && !serverProviderEnabled ? provider : undefined;
      if (generationSource !== "demo") {
        try {
          project = await generateKitFromServer(input, providerForServer, generationMode);
        } catch (err) {
          serverError = err instanceof Error ? err.message : "Server generation failed.";
          console.warn("[BuilderForm] Server generation failed:", serverError);
        }
      }
      // Fall back to client-side (demo mode) generation.
      if (!project) {
        project = await generateProjectKit(input);
        project = {
          ...project,
          generation: {
            mode: generationMode,
            source: "demo" as const,
            generatedAt: new Date().toISOString(),
            fallbackReason:
              generationSource === "demo"
                ? "Stable demo generation was selected. No provider call was made."
                : serverError || (provider || serverProviderEnabled ? "Provider generation failed; demo fallback was used." : "No active provider was used."),
          },
        };
      }
      await store.saveProject(project);
      track("kit_generate_completed", {
        appType: project.input.appType,
        source: project.generation?.source ?? "unknown",
        mode: project.generation?.mode ?? generationMode,
      });
      router.push(`/projects/${project.id}`);
    } catch (err) {
      track("kit_generate_failed", {
        source: values.generationSource,
        mode: values.generationMode,
      });
      setError(err instanceof Error ? err.message : "Generation failed. Try demo mode again.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (isGenerating) {
    const provider = getActiveProvider();
    const providerActive = (hasServerProvider(provider) || serverProviderEnabled) && currentValues.generationSource !== "demo";
    return (
      <LoadingState
        label={providerActive ? "Generating with your provider..." : "Generating demo project kit..."}
        detail={
          providerActive
            ? "VibeForge is asking the configured provider for a structured kit. If it fails, demo fallback keeps the flow usable."
            : "Demo mode is building a deterministic kit locally, with no account or API key required."
        }
        steps={providerActive ? ["Validate provider", "Generate kit", "Save project"] : ["Analyze idea", "Create demo kit", "Save locally"]}
      />
    );
  }

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
              Enter one strong idea. VibeForge infers the users, workflow, data model, APIs, tasks, repo guidance, and implementation prompts.
            </p>
          </div>
          <Button variant="secondary" onClick={applySample}>
            <FlaskConical className="h-4 w-4" />
            Load AI video sample
          </Button>
        </div>

        <AiModeStatus generationMode={currentValues.generationMode} generationSource={currentValues.generationSource} />

        {error ? (
          <ErrorState
            message={error}
            suggestion="Demo mode does not require API keys. Check local provider settings if provider generation failed."
          />
        ) : null}

        <form onSubmit={form.handleSubmit(submit)}>
          <Card>
            <CardHeader>
              <CardTitle>Project Idea</CardTitle>
              <CardDescription>One clear paragraph is enough. Add tuning only when you already know the constraints.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="idea">Project idea</Label>
                <Textarea
                  id="idea"
                  placeholder="Example: Lead generation automation that captures form submissions, enriches leads with AI, scores them, pushes qualified leads to CRM, and sends Slack notifications."
                  {...form.register("idea")}
                />
                <FieldError>{form.formState.errors.idea?.message}</FieldError>
              </div>

              <div>
                <Label>Generation source</Label>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                  {generationSources.map((source) => (
                    <button
                      type="button"
                      key={source.value}
                      onClick={() => form.setValue("generationSource", source.value)}
                      className={`rounded-lg border p-3 text-left transition ${
                        currentValues.generationSource === source.value
                          ? "border-teal-700 bg-teal-50 text-teal-950"
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {source.value === "demo" ? <ShieldCheck className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                        {source.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-zinc-500">{source.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <div className="border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
                    Optional tuning (users, scope, stack, providers)
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`} />
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-5 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <TextField label="Target users" name="targetUsers" form={form} />
                      <TextField label="Problem being solved" name="problem" form={form} />
                      <TextField label="Desired output" name="desiredOutput" form={form} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Segmented
                        label="Timeline"
                        value={currentValues.timeline}
                        options={timelines}
                        onChange={(value) => form.setValue("timeline", value)}
                      />
                      <Segmented
                        label="Experience level"
                        value={currentValues.skillLevel}
                        options={skillLevels}
                        onChange={(value) => form.setValue("skillLevel", value)}
                      />
                    </div>

                    <Segmented
                      label="App type"
                      value={currentValues.appType}
                      options={appTypes}
                      onChange={(value) => form.setValue("appType", value)}
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
                        <Label htmlFor="budgetSensitivity">API cost preference</Label>
                        <Select id="budgetSensitivity" {...form.register("budgetSensitivity")}>
                          <option value="high">Keep costs low</option>
                          <option value="medium">Balance cost & quality</option>
                          <option value="low">Optimize for quality</option>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preferredStackText">Preferred stack</Label>
                        <Input id="preferredStackText" placeholder="Next.js, Supabase" {...form.register("preferredStackText")} />
                      </div>
                      <div>
                        <Label htmlFor="apiProvidersText">AI providers available</Label>
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
                  </div>
                )}
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

        <TemplateGallery onSelect={applyTemplate} />
        <QuickStartPanel />
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

function AiModeStatus({ generationMode, generationSource }: { generationMode: GenerationMode; generationSource: GenerationSource }) {
  const provider = getActiveProvider();
  const localProviderActive = hasServerProvider(provider);
  const active = localProviderActive || serverProviderEnabled;
  const modeLabel = generationMode === "deep" ? "Deep planning" : generationMode === "fast" ? "Fast draft" : "Balanced";
  const modeBadge = generationMode === "deep" ? "amber" as const : generationMode === "fast" ? "blue" as const : "teal" as const;

  let statusLabel: string;
  let statusDescription: string;
  let statusStyle: string;

  if (generationSource === "demo") {
    statusLabel = "Demo stable";
    statusDescription = "No provider call will be made. VibeForge uses deterministic local generation so the core flow stays reliable without API keys.";
    statusStyle = "border-green-200 bg-green-50 text-green-900";
  } else if (active) {
    statusLabel = `${serverProviderEnabled ? serverProviderName : provider?.providerName} active`;
    statusDescription = `Generation uses ${
      serverProviderEnabled
        ? serverProviderModel || "the server-configured model"
        : provider?.defaultModel || provider?.strongModel || provider?.cheapModel || "your configured model"
    } via server routes.`;
    statusStyle = "border-teal-200 bg-teal-50 text-teal-900";
  } else {
    statusLabel = generationSource === "provider" ? "Provider not configured" : "Auto demo fallback";
    statusDescription = "No usable provider is configured. VibeForge will generate a deterministic demo kit and keep the project exportable.";
    statusStyle = "border-zinc-200 bg-zinc-50 text-zinc-700";
  }

  return (
    <div className={`rounded-lg border p-3 text-sm ${statusStyle}`}>
      <div className="flex flex-wrap items-center gap-2 font-medium">
        <Sparkles className="h-4 w-4" />
        AI mode: {statusLabel}
        <Badge variant={modeBadge}>{modeLabel}</Badge>
      </div>
      <p className="mt-1 text-xs leading-5 opacity-80">{statusDescription}</p>
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
    appType: values.appType ?? "Other",
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
