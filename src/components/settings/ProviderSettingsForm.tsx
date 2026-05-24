"use client";

import { useEffect, useState } from "react";
import { KeyRound, PlugZap, Plus, Save, Trash2 } from "lucide-react";
import type { ProviderSettings } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { getProviders, saveProviders } from "@/lib/storage";
import { testProvider } from "@/lib/generation-client";
import { uid } from "@/lib/utils";

const providerTypes: ProviderSettings["providerType"][] = [
  "openai-compatible",
  "openrouter",
  "gemini",
  "anthropic-compatible",
  "ollama",
  "custom",
];

export function ProviderSettingsForm() {
  const [providers, setProviders] = useState<ProviderSettings[]>([]);
  const [testResults, setTestResults] = useState<Record<string, { status: "testing" | "ok" | "failed"; message: string }>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setProviders(getProviders()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function persist(next: ProviderSettings[]) {
    setProviders(next);
    saveProviders(next);
  }

  function addProvider() {
    persist([
      ...providers,
      {
        id: uid("provider"),
        providerName: "OpenRouter",
        providerType: "openrouter",
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: "",
        defaultModel: "openai/gpt-4.1-mini",
        cheapModel: "openai/gpt-4.1-mini",
        strongModel: "openai/gpt-4.1",
        visionModel: "google/gemini-2.5-flash",
        maxBudgetPerGeneration: 0.5,
        temperature: 0.4,
        tokenLimit: 6000,
        enabled: true,
      },
    ]);
  }

  function update(id: string, patch: Partial<ProviderSettings>) {
    persist(providers.map((provider) => (provider.id === id ? { ...provider, ...patch } : provider)));
  }

  async function testConnection(provider: ProviderSettings) {
    setTestResults((current) => ({
      ...current,
      [provider.id]: { status: "testing", message: "Testing provider..." },
    }));
    const result = await testProvider(provider);
    setTestResults((current) => ({
      ...current,
      [provider.id]: {
        status: result.ok ? "ok" : "failed",
        message: result.model ? `${result.message} Model: ${result.model}` : result.message,
      },
    }));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>AI Provider Settings</CardTitle>
            <p className="mt-1 text-sm text-zinc-600">Stored in localStorage for this MVP. Do not use shared browsers for real keys.</p>
          </div>
          <Button onClick={addProvider}>
            <Plus className="h-4 w-4" />
            Add provider
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          API keys are saved only in your browser and sent to server routes only for generation or connection tests.
          Production should add encrypted storage, auth, rate limits, and usage logs.
        </div>
        {providers.map((provider) => (
          <div key={provider.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-teal-700" />
                <span className="font-semibold text-zinc-950">{provider.providerName}</span>
                {provider.enabled ? <Badge variant="green">Enabled</Badge> : <Badge>Disabled</Badge>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => update(provider.id, { enabled: !provider.enabled })}>
                  {provider.enabled ? "Disable" : "Enable"}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => void testConnection(provider)}>
                  <PlugZap className="h-4 w-4" />
                  Test connection
                </Button>
                <Button variant="outline" size="sm" onClick={() => persist(providers.filter((item) => item.id !== provider.id))}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            {testResults[provider.id] ? (
              <div
                className={`mb-4 rounded-lg border p-3 text-sm ${
                  testResults[provider.id].status === "ok"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : testResults[provider.id].status === "testing"
                      ? "border-blue-200 bg-blue-50 text-blue-800"
                      : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {testResults[provider.id].message}
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Provider name" value={provider.providerName} onChange={(value) => update(provider.id, { providerName: value })} />
              <div>
                <Label>Provider type</Label>
                <Select value={provider.providerType} onChange={(event) => update(provider.id, { providerType: event.target.value as ProviderSettings["providerType"] })}>
                  {providerTypes.map((type) => <option key={type}>{type}</option>)}
                </Select>
              </div>
              <Field label="Base URL" value={provider.baseUrl} onChange={(value) => update(provider.id, { baseUrl: value })} />
              <Field label="API key" type="password" value={provider.apiKey} onChange={(value) => update(provider.id, { apiKey: value })} />
              <Field label="Default model" value={provider.defaultModel} onChange={(value) => update(provider.id, { defaultModel: value })} />
              <Field label="Fast/cheap model" value={provider.cheapModel} onChange={(value) => update(provider.id, { cheapModel: value })} />
              <Field label="Strong/reasoning model" value={provider.strongModel} onChange={(value) => update(provider.id, { strongModel: value })} />
              <Field label="Vision model" value={provider.visionModel} onChange={(value) => update(provider.id, { visionModel: value })} />
              <Field label="Max budget/generation" type="number" value={String(provider.maxBudgetPerGeneration)} onChange={(value) => update(provider.id, { maxBudgetPerGeneration: Number(value) })} />
              <Field label="Temperature" type="number" value={String(provider.temperature)} onChange={(value) => update(provider.id, { temperature: Number(value) })} />
              <Field label="Token/output limit" type="number" value={String(provider.tokenLimit)} onChange={(value) => update(provider.id, { tokenLimit: Number(value) })} />
            </div>
          </div>
        ))}
        {!providers.length ? (
          <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-600">
            No provider configured. Demo generation still works.
          </div>
        ) : (
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => saveProviders(providers)}>
              <Save className="h-4 w-4" />
              Saved locally
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
