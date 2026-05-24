"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, KeyRound, Plus, Save, Trash2 } from "lucide-react";
import type { ProviderSettings } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { SyncStatusBadge } from "@/components/app/SyncStatusBadge";
import {
  localGetProviders,
  localSaveProviders,
  getCloudProviders,
  saveCloudProviders,
  resolveStoreMode,
  type SyncStatus,
} from "@/lib/project-store";
import { useAuth } from "@/lib/auth";
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
  const { user, isAuthenticated, isSupabaseAvailable } = useAuth();
  const storeMode = resolveStoreMode(isAuthenticated, isSupabaseAvailable);

  const [providers, setProviders] = useState<ProviderSettings[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local-only");

  const load = useCallback(async () => {
    if (storeMode === "cloud" && user) {
      const result = await getCloudProviders(user.id);
      if (result.error) {
        setSyncStatus("sync-failed");
        setProviders(localGetProviders());
      } else {
        setSyncStatus("cloud-synced");
        setProviders(result.data);
      }
    } else {
      setSyncStatus("local-only");
      setProviders(localGetProviders());
    }
  }, [storeMode, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function persist(next: ProviderSettings[]) {
    setProviders(next);
    // Always save locally (API keys are local-only)
    localSaveProviders(next);
    if (storeMode === "cloud" && user) {
      const result = await saveCloudProviders(next, user.id);
      setSyncStatus(result.error ? "sync-failed" : "cloud-synced");
    }
  }

  function addProvider() {
    void persist([
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
    void persist(providers.map((provider) => (provider.id === id ? { ...provider, ...patch } : provider)));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>AI Provider Settings</CardTitle>
              <SyncStatusBadge status={syncStatus} />
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              {storeMode === "cloud"
                ? "Provider metadata syncs to cloud. API keys stay in your browser."
                : "Stored in localStorage for this MVP. Do not use shared browsers for real keys."}
            </p>
          </div>
          <Button onClick={addProvider}>
            <Plus className="h-4 w-4" />
            Add provider
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              API keys are saved <strong>only in your browser</strong>. They are never uploaded to the cloud.
              {storeMode === "cloud" && " Provider names, models, and settings sync to your account."}
            </span>
          </div>
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
                <Button variant="outline" size="sm" onClick={() => void persist(providers.filter((item) => item.id !== provider.id))}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Provider name" value={provider.providerName} onChange={(value) => update(provider.id, { providerName: value })} />
              <div>
                <Label>Provider type</Label>
                <Select value={provider.providerType} onChange={(event) => update(provider.id, { providerType: event.target.value as ProviderSettings["providerType"] })}>
                  {providerTypes.map((type) => <option key={type}>{type}</option>)}
                </Select>
              </div>
              <Field label="Base URL" value={provider.baseUrl} onChange={(value) => update(provider.id, { baseUrl: value })} />
              <div>
                <Label>API key <span className="text-[10px] text-amber-700">(local only)</span></Label>
                <Input type="password" value={provider.apiKey} onChange={(event) => update(provider.id, { apiKey: event.target.value })} />
              </div>
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
            <Button variant="secondary" onClick={() => localSaveProviders(providers)}>
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
