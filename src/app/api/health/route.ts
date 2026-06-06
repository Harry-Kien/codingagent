import { NextResponse } from "next/server";
import { getProductionReadinessReport } from "@/lib/production-readiness";

export async function GET() {
  const hasEnvProvider = Boolean(
    process.env.VIBEFORGE_SERVER_PROVIDER_API_KEY?.trim() ||
    process.env.VIBEFORGE_OPENROUTER_API_KEY?.trim() ||
    process.env.OPENROUTER_API_KEY?.trim()
  );
  const providerName =
    process.env.VIBEFORGE_SERVER_PROVIDER_NAME ||
    process.env.VIBEFORGE_OPENROUTER_PROVIDER_NAME ||
    (hasEnvProvider ? "OpenRouter" : null);
  const providerModel =
    process.env.VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL ||
    process.env.VIBEFORGE_OPENROUTER_DEFAULT_MODEL ||
    null;

  const readiness = await getProductionReadinessReport();

  return NextResponse.json({
    status: "ok",
    app: "VibeForge",
    version: process.env.npm_package_version ?? "0.1.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    providerConfigured: hasEnvProvider,
    providerName,
    providerModel,
    databaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
        process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    ),
    cloudSyncReady: readiness.checks.supabasePublicClient.ok && readiness.checks.supabaseAdmin.ok,
    providerVaultReady: readiness.checks.providerVault.ok,
    durableRateLimitReady: readiness.checks.durableRateLimit.ok,
    monitoringReady: readiness.checks.monitoring.ok,
    analyticsReady: readiness.checks.analytics.ok,
    productionReadiness: readiness.status,
  });
}
