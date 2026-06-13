"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, RefreshCw, ServerCog, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReadinessState = "ready" | "partial" | "missing";

type ReadinessCheck = {
  ok: boolean;
  state: ReadinessState;
  label: string;
  detail: string;
};

type ProductionReadinessReport = {
  status: ReadinessState;
  generatedAt: string;
  checks: Record<string, ReadinessCheck>;
};

type ProviderTestState =
  | { status: "idle"; message: string; model?: string }
  | { status: "testing"; message: string; model?: string }
  | { status: "ok"; message: string; model?: string }
  | { status: "failed"; message: string; model?: string };

const CHECK_ORDER = [
  "aiProvider",
  "providerVault",
  "durableRateLimit",
  "monitoring",
  "supabasePublicClient",
  "supabaseAdmin",
  "analytics",
  "security",
];

export function ProductionReadinessPanel() {
  const [report, setReport] = useState<ProductionReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providerTest, setProviderTest] = useState<ProviderTestState>({
    status: "idle",
    message: "Run this after changing production provider environment variables.",
  });

  useEffect(() => {
    void loadReadiness();
  }, []);

  async function loadReadiness() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/production-readiness", { cache: "no-store" });
      const json = (await response.json()) as ProductionReadinessReport;
      setReport(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load production readiness.");
    } finally {
      setLoading(false);
    }
  }

  async function testServerProvider() {
    setProviderTest({ status: "testing", message: "Testing server provider without exposing the key..." });
    try {
      const response = await fetch("/api/test-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const json = await response.json().catch(() => null);
      const message =
        typeof json?.error?.message === "string"
          ? `${json.error.title ?? "Provider failed"}: ${json.error.message} ${json.error.nextStep ?? ""}`.trim()
          : typeof json?.message === "string"
            ? json.message
            : response.ok
              ? "Server provider responded successfully."
              : "Server provider test failed.";

      setProviderTest({
        status: response.ok && Boolean(json?.ok) ? "ok" : "failed",
        message,
        model: typeof json?.model === "string" ? json.model : undefined,
      });
    } catch (err) {
      setProviderTest({
        status: "failed",
        message: err instanceof Error ? err.message : "Server provider test failed.",
      });
    }
  }

  const status = report?.status ?? "partial";
  const checks = report ? orderedChecks(report.checks) : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle>Production readiness</CardTitle>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Operational checks for provider mode, vault, durable limits, monitoring, cloud sync, analytics, and secret exposure.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={status === "ready" ? "green" : status === "partial" ? "amber" : "coral"}>
              {status === "ready" ? "Ready" : status === "partial" ? "Partial" : "Missing"}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => void loadReadiness()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="secondary" size="sm" onClick={() => void testServerProvider()} disabled={providerTest.status === "testing"}>
              <ServerCog className="h-4 w-4" />
              Test server provider
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
            {error}
          </div>
        ) : null}

        <div className={providerTestClasses(providerTest.status)}>
          <div className="flex items-start gap-2">
            {providerTest.status === "ok" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : providerTest.status === "failed" ? (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : providerTest.status === "testing" ? (
              <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <Activity className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-semibold">Server provider connection</p>
              <p className="mt-1">{providerTest.message}</p>
              {providerTest.model ? <p className="mt-1 text-xs">Model: {providerTest.model}</p> : null}
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {loading && !checks.length ? (
            <ReadinessSkeleton />
          ) : (
            checks.map(([key, check]) => (
              <div key={key} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex items-start gap-2">
                  {check.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-zinc-950">{check.label}</p>
                      <Badge variant={check.ok ? "green" : "amber"}>{check.state}</Badge>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-zinc-600">{check.detail}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function orderedChecks(checks: Record<string, ReadinessCheck>) {
  const known = CHECK_ORDER.filter((key) => checks[key]).map((key) => [key, checks[key]] as const);
  const rest = Object.entries(checks).filter(([key]) => !CHECK_ORDER.includes(key));
  return [...known, ...rest];
}

function providerTestClasses(status: ProviderTestState["status"]) {
  if (status === "ok") return "rounded-lg border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-800";
  if (status === "failed") return "rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800";
  if (status === "testing") return "rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-800";
  return "rounded-lg border border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-700";
}

function ReadinessSkeleton() {
  return (
    <>
      {["AI provider", "Provider vault", "Durable API quota", "Error monitoring"].map((label) => (
        <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-500">
          Loading {label}...
        </div>
      ))}
    </>
  );
}
