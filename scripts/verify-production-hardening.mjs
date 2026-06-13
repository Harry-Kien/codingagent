import { readFileSync } from "node:fs";

const files = {
  generateRoute: read("src/app/api/generate-kit/route.ts"),
  testProviderRoute: read("src/app/api/test-provider/route.ts"),
  providerVault: read("src/lib/provider-vault.ts"),
  generationLogs: read("src/lib/generation-logs.ts"),
  rateLimit: read("src/lib/rate-limit.ts"),
  monitoring: read("src/lib/monitoring.ts"),
  productionReadiness: read("src/lib/production-readiness.ts"),
  generationClient: read("src/lib/generation-client.ts"),
  userFacingErrors: read("src/lib/user-facing-errors.ts"),
  supabaseServer: read("src/lib/supabase-server.ts"),
  serverAuth: read("src/lib/server-auth.ts"),
  layout: read("src/app/layout.tsx"),
  healthRoute: read("src/app/api/health/route.ts"),
  productionReadinessRoute: read("src/app/api/production-readiness/route.ts"),
  nextConfig: read("next.config.ts"),
  packageJson: read("package.json"),
  prodReadinessScript: read("scripts/check-production-readiness.mjs"),
  vercelEnvScript: read("scripts/check-vercel-env.mjs"),
  migration: read("supabase/migrations/002_production_provider_vault.sql"),
  rlsMigration: read("supabase/migrations/003_production_rls_data_api_hardening.sql"),
  envExample: read(".env.example"),
  readme: read("README.md"),
};

requireIncludes(files.providerVault, 'import "server-only"', "Provider vault must be server-only.");
requireIncludes(files.generationLogs, 'import "server-only"', "Generation logs must be server-only.");
requireIncludes(files.supabaseServer, 'import "server-only"', "Supabase admin helper must be server-only.");
requireIncludes(files.serverAuth, 'import "server-only"', "Server auth helper must be server-only.");

requireIncludes(files.providerVault, "createCipheriv", "Provider vault must encrypt API keys.");
requireIncludes(files.providerVault, "createDecipheriv", "Provider vault must decrypt API keys server-side.");
requireIncludes(files.providerVault, "VIBEFORGE_PROVIDER_KEY_SECRET", "Provider vault must use server encryption secret.");
requireIncludes(files.providerVault, ".eq(\"user_id\", userId)", "Vault provider lookup must be owner-scoped.");

requireIncludes(files.generationLogs, "generation_logs", "Generation logs must write to Supabase table.");
requireIncludes(files.generationLogs, "duration_ms", "Generation logs must include duration.");
forbidIncludes(files.generationLogs, "apiKey", "Generation logs must not log API keys.");
forbidIncludes(files.generationLogs, "api_key", "Generation logs must not log encrypted key fields.");
requireIncludes(files.generationLogs, "sanitizeGenerationLogValue", "Generation logs must redact secret-like error text.");

requireIncludes(files.generateRoute, "checkRateLimit", "Generate route must apply rate limiting.");
requireIncludes(files.testProviderRoute, "checkRateLimit", "Test-provider route must apply rate limiting.");
requireIncludes(files.rateLimit, "VIBEFORGE_REDIS_REST_URL", "Rate limiter must support durable Redis REST env.");
requireIncludes(files.rateLimit, "UPSTASH_REDIS_REST_URL", "Rate limiter must support Upstash env.");
requireIncludes(files.rateLimit, "AbortSignal.timeout", "Redis rate limiter must have upstream timeout protection.");
requireIncludes(files.rateLimit, "encodeURIComponent(redisKey)", "Redis rate-limit keys must be URL-encoded.");
requireIncludes(files.generateRoute, "writeGenerationLog", "Generate route must write generation logs.");
requireIncludes(files.testProviderRoute, "writeGenerationLog", "Test-provider route must write generation logs.");
requireIncludes(files.generateRoute, "resolveProviderForRequest", "Generate route must support providerProfileId resolution.");
requireIncludes(files.testProviderRoute, "resolveProviderForRequest", "Test-provider route must support providerProfileId resolution.");
requireIncludes(files.generateRoute, "userFacingError", "Generate route must return structured user-facing errors.");
requireIncludes(files.testProviderRoute, "userFacingError", "Test-provider route must return structured user-facing errors.");

for (const code of [
  "invalid_api_key",
  "provider_timeout",
  "quota_exceeded",
  "invalid_model",
  "provider_unreachable",
  "rate_limited",
  "supabase_not_configured",
  "unauthorized",
]) {
  requireIncludes(files.userFacingErrors, code, `Missing user-facing error mapping: ${code}`);
}

requireIncludes(files.generateRoute, "Retry-After", "Generate route should expose retry guidance.");
requireIncludes(files.testProviderRoute, "Retry-After", "Test-provider route should expose retry guidance.");
requireIncludes(files.generationClient, "json?.error?.message", "Client must read structured API errors.");

requireIncludes(files.monitoring, "reportError", "Monitoring helper must report structured errors.");
requireIncludes(files.monitoring, "ERROR_WEBHOOK_URL", "Monitoring helper must support external error webhook.");
requireIncludes(files.monitoring, "sanitizeLogPayload", "Monitoring helper must sanitize log payloads.");
requireIncludes(files.monitoring, "redactSecretText", "Monitoring helper must redact secret-like text values.");

requireIncludes(files.productionReadiness, "getProductionReadinessReport", "Missing production readiness report helper.");
requireIncludes(files.productionReadiness, "providerVault", "Readiness report must check provider vault.");
requireIncludes(files.productionReadiness, "durableRateLimit", "Readiness report must check durable quota/rate-limit.");
requireIncludes(files.productionReadiness, "monitoring", "Readiness report must check monitoring.");
requireIncludes(files.productionReadiness, "analytics", "Readiness report must check analytics.");
requireIncludes(files.productionReadinessRoute, "getProductionReadinessReport", "Missing production readiness API route.");
requireIncludes(files.healthRoute, "productionReadiness", "Health route must expose production readiness summary.");

requireIncludes(files.layout, "@vercel/analytics/next", "Layout must mount Vercel Analytics.");
requireIncludes(files.layout, "@vercel/speed-insights/next", "Layout must mount Vercel Speed Insights.");
requireIncludes(files.packageJson, "@vercel/analytics", "Package must include Vercel Analytics dependency.");
requireIncludes(files.packageJson, "@vercel/speed-insights", "Package must include Vercel Speed Insights dependency.");
requireIncludes(files.packageJson, "check:production-readiness", "Package must expose production readiness check script.");
requireIncludes(files.packageJson, "check:vercel-env", "Package must expose Vercel env check script.");
requireIncludes(files.prodReadinessScript, "/api/production-readiness", "Production readiness script must call readiness API.");
requireIncludes(files.vercelEnvScript, "vercel", "Vercel env script must inspect Vercel production env names.");

for (const header of ["X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options", "Permissions-Policy"]) {
  requireIncludes(files.nextConfig, header, `Missing security header: ${header}`);
}

requireIncludes(files.migration, "api_key_ciphertext", "Migration must include encrypted key storage.");
requireIncludes(files.migration, "generation_logs", "Migration must include generation logs table.");
requireIncludes(files.migration, "generation_logs_select_own", "Generation logs need owner-scoped select policy.");
requireIncludes(files.migration, "No client INSERT policy", "Generation logs insert policy should stay server-owned.");
requireIncludes(files.rlsMigration, "CREATE SCHEMA IF NOT EXISTS private", "RLS hardening migration must create private schema.");
requireIncludes(files.rlsMigration, "private.handle_new_user", "Security definer auth trigger should live in private schema.");
requireIncludes(files.rlsMigration, "REVOKE ALL ON TABLE", "RLS hardening migration must revoke anon table access.");
requireIncludes(files.rlsMigration, "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects TO authenticated", "RLS hardening migration must explicitly grant authenticated project access.");
requireIncludes(files.rlsMigration, "REVOKE INSERT, UPDATE, DELETE ON TABLE public.generation_logs FROM authenticated", "Generation logs must stay server-insert-only.");
requireIncludes(files.rlsMigration, "anon remains revoked", "Migration must document authenticated-only Data API grants.");

requireIncludes(files.envExample, "SUPABASE_SERVICE_ROLE_KEY=", ".env.example must document server service role key.");
requireIncludes(files.envExample, "VIBEFORGE_PROVIDER_KEY_SECRET=", ".env.example must document provider key secret.");
requireIncludes(files.envExample, "VIBEFORGE_REDIS_REST_URL=", ".env.example must document durable Redis rate-limit URL.");
requireIncludes(files.envExample, "ERROR_WEBHOOK_URL=", ".env.example must document external error monitoring webhook.");
forbidSecretValues(files.envExample);

for (const section of [
  "Production Provider Vault",
  "Production setup",
  "Provider Profiles",
  "Generation logs",
  "Rate limiting",
  "Demo",
  "Environment Variables",
  "Security",
  "How to run checks",
]) {
  requireIncludes(files.readme, section, `README missing production docs section/content: ${section}`);
}

console.log("Production hardening checks passed.");

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireIncludes(content, needle, message) {
  if (!content.includes(needle)) fail(message);
}

function forbidIncludes(content, needle, message) {
  if (content.includes(needle)) fail(message);
}

function forbidSecretValues(content) {
  const suspicious = [
    /sk-[a-z0-9_-]{16,}/i,
    /sk-or-v1-[a-z0-9]{16,}/i,
    /eyJ[a-z0-9_-]{20,}/i,
  ];
  if (suspicious.some((pattern) => pattern.test(content))) {
    fail(".env.example appears to contain a real secret-like value.");
  }
}

function fail(message) {
  console.error(`Production hardening verification failed: ${message}`);
  process.exit(1);
}
