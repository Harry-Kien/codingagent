"use client";

import { useEffect, useState, useCallback } from "react";
import { Clipboard, Plus, Trash2 } from "lucide-react";
import type { McpConnection } from "@/types/vibeforge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/CopyButton";
import { SyncStatusBadge } from "@/components/app/SyncStatusBadge";
import { downloadMcpJson } from "@/lib/export";
import {
  localGetMcpConnections,
  localSaveMcpConnections,
  getCloudMcpConnections,
  saveCloudMcpConnections,
  resolveStoreMode,
  type SyncStatus,
} from "@/lib/project-store";
import { useAuth } from "@/lib/auth";
import { uid } from "@/lib/utils";

const types: McpConnection["type"][] = [
  "IDE / editor",
  "CLI coding agent",
  "GitHub",
  "Browser automation",
  "Filesystem",
  "Database",
  "n8n",
  "Custom MCP server",
];

export function McpConnectionCard() {
  const { user, isAuthenticated, isSupabaseAvailable } = useAuth();
  const storeMode = resolveStoreMode(isAuthenticated, isSupabaseAvailable);

  const [connections, setConnections] = useState<McpConnection[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local-only");

  const load = useCallback(async () => {
    if (storeMode === "cloud" && user) {
      const result = await getCloudMcpConnections(user.id);
      if (result.error) {
        setSyncStatus("sync-failed");
        setConnections(localGetMcpConnections());
      } else {
        setSyncStatus("cloud-synced");
        setConnections(result.data);
      }
    } else {
      setSyncStatus("local-only");
      setConnections(localGetMcpConnections());
    }
  }, [storeMode, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function persist(next: McpConnection[]) {
    setConnections(next);
    localSaveMcpConnections(next);
    if (storeMode === "cloud" && user) {
      const result = await saveCloudMcpConnections(next, user.id);
      setSyncStatus(result.error ? "sync-failed" : "cloud-synced");
    }
  }

  function addConnection() {
    void persist([
      ...connections,
      {
        id: uid("mcp"),
        name: "Codex project instructions",
        type: "CLI coding agent",
        commandOrUrl: "codex",
        environmentVariables: "CODEX_HOME=~/.codex",
        status: "Not configured",
        notes: "Use AGENTS.md, TASKS.md, and TOOLS.md as the project context.",
      },
    ]);
  }

  function update(id: string, patch: Partial<McpConnection>) {
    void persist(connections.map((connection) => (connection.id === id ? { ...connection, ...patch } : connection)));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>MCP & External Integrations</CardTitle>
              <SyncStatusBadge status={syncStatus} />
            </div>
            <p className="mt-1 text-sm text-zinc-600">Registry placeholders, config snippets, and integration plans for coding agents and external systems.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => downloadMcpJson(connections)}>Export JSON</Button>
            <Button onClick={addConnection}>
              <Plus className="h-4 w-4" />
              Add connection
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SnippetPanel />
        {connections.map((connection) => (
          <div key={connection.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="blue">{connection.type}</Badge>
                <Badge variant={connection.status === "Configured" ? "green" : "amber"}>{connection.status}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => void persist(connections.filter((item) => item.id !== connection.id))}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" value={connection.name} onChange={(value) => update(connection.id, { name: value })} />
              <div>
                <Label>Type</Label>
                <Select value={connection.type} onChange={(event) => update(connection.id, { type: event.target.value as McpConnection["type"] })}>
                  {types.map((type) => <option key={type}>{type}</option>)}
                </Select>
              </div>
              <Field label="Command or URL" value={connection.commandOrUrl} onChange={(value) => update(connection.id, { commandOrUrl: value })} />
              <div>
                <Label>Status</Label>
                <Select value={connection.status} onChange={(event) => update(connection.id, { status: event.target.value as McpConnection["status"] })}>
                  <option>Not configured</option>
                  <option>Configured</option>
                  <option>Needs testing</option>
                </Select>
              </div>
              <div>
                <Label>Environment variables</Label>
                <Textarea value={connection.environmentVariables} onChange={(event) => update(connection.id, { environmentVariables: event.target.value })} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={connection.notes} onChange={(event) => update(connection.id, { notes: event.target.value })} />
              </div>
            </div>
          </div>
        ))}
        {!connections.length ? (
          <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-600">
            Add a connection to export MCP settings or project-agent snippets.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function SnippetPanel() {
  const snippets = {
    "Codex/Cline project instructions": "Read AGENTS.md, PROJECT_BRIEF.md, TASKS.md, and TOOLS.md before editing. Do not clone external repos automatically. Verify with lint and build.",
    "Generic MCP server config": JSON.stringify(
      { mcpServers: { filesystem: { command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "."] } } },
      null,
      2,
    ),
    "n8n webhook integration plan": "Create an n8n workflow with a signed webhook, validate payloads, retry provider failures, and return workflow IDs to the app.",
    "GitHub repo integration plan": "Use GitHub OAuth later. For MVP, export files locally and let the user commit them manually.",
  };
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {Object.entries(snippets).map(([title, text]) => (
        <div key={title} className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
            <CopyButton text={text} label="Copy" />
          </div>
          <pre className="mt-3 max-h-28 overflow-auto whitespace-pre-wrap rounded-md bg-zinc-950 p-3 text-xs leading-5 text-zinc-100">
            <Clipboard className="mr-1 inline h-3 w-3" />
            {text}
          </pre>
        </div>
      ))}
    </div>
  );
}
