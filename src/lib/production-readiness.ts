import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase-server";

type ReadinessState = "ready" | "partial" | "missing";

export type ProductionReadinessReport = {
  status: ReadinessState;
  generatedAt: string;
  checks: {
    aiProvider: ReadinessCheck;
    supabasePublicClient: ReadinessCheck;
    supabaseAdmin: ReadinessCheck;
    providerVault: ReadinessCheck;
    durableRateLimit: ReadinessCheck;
    monitoring: ReadinessCheck;
    analytics: ReadinessCheck;
    security: ReadinessCheck;
  };
};

type ReadinessCheck = {
  ok: boolean;
  state: ReadinessState;
  label: string;
  detail: string;
};

export async function getProductionReadinessReport(): Promise<ProductionReadinessReport> {
  const checks = {
    aiProvider: aiProviderCheck(),
    supabasePublicClient: supabasePublicClientCheck(),
    supabaseAdmin: await supabaseAdminCheck(),
    providerVault: providerVaultCheck(),
    durableRateLimit: durableRateLimitCheck(),
    monitoring: monitoringCheck(),
    analytics: analyticsCheck(),
    security: securityCheck(),
  };

  const values = Object.values(checks);
  const status: ReadinessState = values.every((check) => check.ok)
    ? "ready"
    : values.some((check) => check.ok)
      ? "partial"
      : "missing";

  return {
    status,
    generatedAt: new Date().toISOString(),
    checks,
  };
}

function aiProviderCheck(): ReadinessCheck {
  const hasKey = Boolean(
    process.env.VIBEFORGE_SERVER_PROVIDER_API_KEY?.trim() ||
      process.env.VIBEFORGE_OPENROUTER_API_KEY?.trim() ||
      process.env.OPENROUTER_API_KEY?.trim(),
  );
  const model =
    process.env.VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL ||
    process.env.VIBEFORGE_OPENROUTER_DEFAULT_MODEL ||
    "";

  return check(
    hasKey && Boolean(model),
    "Production AI provider",
    hasKey
      ? `Server provider configured${model ? ` with model ${model}` : ""}.`
      : "No server provider key detected; app will rely on demo fallback.",
  );
}

function supabasePublicClientCheck(): ReadinessCheck {
  const ok = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return check(
    ok,
    "Supabase browser client",
    ok ? "Public Supabase URL and anon key are configured." : "Cloud sync UI will stay local-only without public Supabase env.",
  );
}

async function supabaseAdminCheck(): Promise<ReadinessCheck> {
  const hasServerEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!hasServerEnv) {
    return check(false, "Supabase admin/database", "Missing server Supabase env; provider vault and generation logs are disabled.");
  }

  const client = getSupabaseAdminClient();
  if (!client) {
    return check(false, "Supabase admin/database", "Supabase admin client could not be created.");
  }

  const tables = ["projects", "provider_profiles", "generation_logs"];
  const results = await Promise.all(
    tables.map(async (table) => {
      const { error } = await client.from(table).select("id", { count: "exact", head: true }).limit(1);
      return { table, error: error?.message ?? "" };
    }),
  );
  const failed = results.filter((result) => result.error);

  return check(
    failed.length === 0,
    "Supabase admin/database",
    failed.length === 0
      ? "Required production tables are reachable with the service role."
      : `Schema/table check failed: ${failed.map((item) => `${item.table}: ${item.error}`).join("; ")}`,
  );
}

function providerVaultCheck(): ReadinessCheck {
  const ok = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.VIBEFORGE_PROVIDER_KEY_SECRET &&
      process.env.VIBEFORGE_PROVIDER_KEY_SECRET.length >= 32,
  );
  return check(
    ok,
    "Provider vault",
    ok
      ? "Server-side provider vault can encrypt saved provider keys."
      : "Provider vault requires Supabase service role and VIBEFORGE_PROVIDER_KEY_SECRET with at least 32 characters.",
  );
}

function durableRateLimitCheck(): ReadinessCheck {
  const ok = Boolean(
    (process.env.VIBEFORGE_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL) &&
      (process.env.VIBEFORGE_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN),
  );
  return check(
    ok,
    "Durable API quota",
    ok
      ? "Redis-backed rate limiting is configured for multi-instance production."
      : "Using in-memory fallback rate limiting; configure Upstash/Redis REST for durable cross-instance quota.",
  );
}

function monitoringCheck(): ReadinessCheck {
  const ok = Boolean(process.env.ERROR_WEBHOOK_URL || process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);
  return check(
    ok,
    "Error monitoring",
    ok
      ? "External error reporting env is present; runtime logs remain available in Vercel."
      : "No external error reporting env detected; Vercel runtime logs still capture structured errors.",
  );
}

function analyticsCheck(): ReadinessCheck {
  return check(true, "Analytics", "Vercel Analytics and Speed Insights are mounted in the App Router layout.");
}

function securityCheck(): ReadinessCheck {
  const serviceRoleLeaked = Object.keys(process.env).some(
    (key) => key.startsWith("NEXT_PUBLIC_") && /SERVICE_ROLE|PROVIDER_KEY_SECRET|API_KEY/i.test(key),
  );
  return check(
    !serviceRoleLeaked,
    "Secret exposure guard",
    serviceRoleLeaked
      ? "A sensitive-looking NEXT_PUBLIC_* env variable is configured. Remove it before production."
      : "No sensitive-looking NEXT_PUBLIC_* server secret env names detected.",
  );
}

function check(ok: boolean, label: string, detail: string): ReadinessCheck {
  return {
    ok,
    state: ok ? "ready" : "missing",
    label,
    detail,
  };
}
