const BASE_URL = (process.env.VIBEFORGE_API_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const REQUIRE_PROVIDER = process.env.VIBEFORGE_REQUIRE_PROVIDER === "1";
const STRICT_PROVIDER_QUALITY = process.env.VIBEFORGE_STRICT_PROVIDER_QUALITY !== "0";

const sampleInput = {
  idea: "Build an AI video app for small shops that turns product photos and offers into short product showcase scripts, captions, storyboard shots, and prompts for Veo/Gemini/Sora.",
  targetUsers: "Small shop owners, local retailers, Shopee sellers, and TikTok Shop sellers",
  problem: "They need frequent product videos but cannot afford editors, marketers, or complex video tools.",
  desiredOutput: "A project kit with storyboard-first MVP scope, local-first workflow, API plan, database schema, task plan, test plan, exports, and AI coding-agent handoff.",
  appType: "AI video app",
  timeline: "7 day build",
  skillLevel: "Builder",
  budgetSensitivity: "high",
  preferredStack: ["Next.js", "Supabase later", "localStorage first"],
  apiProviders: ["Custom Homeseeker Router", "Gemini later", "Veo later"],
  wantsMcp: true,
  wantsAutomation: true,
};

const failures = [];
const rows = [];

function record(name, result) {
  rows.push({ name, ...result });
  if (!result.ok) failures.push(`${name}: ${result.error || `HTTP ${result.status}`}`);
}

async function call(name, path, init = {}, timeoutMs = 75_000) {
  const started = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // Keep raw text for diagnostics.
    }
    return {
      name,
      status: response.status,
      ok: response.ok,
      ms: Date.now() - started,
      json,
      text,
      error: response.ok ? undefined : json?.error?.message || json?.message || text.slice(0, 180),
    };
  } catch (error) {
    return {
      name,
      status: 0,
      ok: false,
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function section(project, key) {
  return project?.sections?.[key] || "";
}

function checkProject(project, scope) {
  assert(Boolean(project?.id), `${scope}: missing project id.`);
  assert(Boolean(project?.name), `${scope}: missing project name.`);
  assert(Object.keys(project?.sections || {}).length >= 18, `${scope}: expected at least 18 sections.`);
  assert((project?.repoRecommendations?.length || 0) >= 8, `${scope}: expected useful repo recommendations.`);

  const all = Object.values(project?.sections || {}).join("\n");
  assert(!/\b(TODO|TBD|lorem ipsum|coming soon|placeholder|to be generated)\b/i.test(all), `${scope}: placeholder language detected.`);
  assert(/small shop|product|video|storyboard|caption/i.test(all), `${scope}: project-specific AI video/shop terms are missing.`);
  assert(/do\s+not\s+clone/i.test(all), `${scope}: no-clone repo policy is missing.`);

  const taskPlan = section(project, "task-plan");
  assert(/Files:/i.test(taskPlan), `${scope}: Task Plan missing Files labels.`);
  assert(/Acceptance criteria:/i.test(taskPlan), `${scope}: Task Plan missing Acceptance criteria labels.`);
  assert(/Dependencies:/i.test(taskPlan), `${scope}: Task Plan missing Dependencies labels.`);
  assert(/Test command:/i.test(taskPlan), `${scope}: Task Plan missing Test command labels.`);
  assert(/local-first|without\s+(?:api\s+keys|accounts)|browser\s+storage|demo\s+workflow/i.test(taskPlan), `${scope}: Task Plan missing local-first/no-key path.`);
  assert(/optional\s+provider|provider.*optional|after.*demo|after.*local/i.test(taskPlan), `${scope}: Task Plan does not make provider work optional.`);
  assert(/npm(?:\.cmd)?\s+run\s+(?:lint|build|check:exports)/i.test(taskPlan), `${scope}: Task Plan missing concrete npm verification command.`);

  const api = section(project, "api-specification");
  assert(/request\s+body/i.test(api) && /response\s+body/i.test(api), `${scope}: API spec missing request/response bodies.`);

  const handoff = section(project, "ai-handoff");
  assert(/primary\s+agent\s+prompt|upload\s+these\s+files/i.test(handoff), `${scope}: AI handoff missing primary agent prompt.`);
  assert(/quality\s+gate|definition\s+of\s+done/i.test(handoff), `${scope}: AI handoff missing quality gate.`);

  if (STRICT_PROVIDER_QUALITY && project?.generation?.source === "provider") {
    assert(!project.generation.fallbackReason, `${scope}: provider kit still used local fallback: ${project.generation.fallbackReason}`);
  }
}

const health = await call("health", "/api/health", {}, 30_000);
record("health", health);
if (health.json) {
  assert(health.json.status === "ok", "health: status must be ok.");
  if (REQUIRE_PROVIDER) assert(health.json.providerConfigured === true, "health: provider must be configured.");
}

const providerTest = await call(
  "test-provider",
  "/api/test-provider",
  { method: "POST", headers: { "content-type": "application/json" }, body: "{}" },
  45_000,
);
rows.push({ name: "test-provider", ...providerTest, optional: !REQUIRE_PROVIDER });
if (REQUIRE_PROVIDER && !providerTest.ok) failures.push(`test-provider: ${providerTest.error || `HTTP ${providerTest.status}`}`);
if (REQUIRE_PROVIDER) assert(providerTest.json?.ok === true, "test-provider: provider did not connect.");
if (!REQUIRE_PROVIDER) assert(providerTest.status === 200, "test-provider: diagnostic provider failures should return HTTP 200 with ok=false.");

const generate = await call(
  "generate-kit",
  "/api/generate-kit",
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ input: sampleInput, provider: null, generationMode: "fast" }),
  },
);
record("generate-kit", generate);
if (generate.json?.project) checkProject(generate.json.project, "generate-kit");
if (REQUIRE_PROVIDER) assert(generate.json?.project?.generation?.source === "provider", "generate-kit: expected provider source.");

const project = generate.json?.project;
if (project) {
  const improve = await call(
    "improve-section",
    "/api/improve-section",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        project,
        sectionKey: "task-plan",
        instruction: "Make Task Plan pass the strict VibeForge quality contract: local-first first, provider optional, Files, Implementation notes, Acceptance criteria, Dependencies, and Test command.",
        provider: null,
        generationMode: "fast",
      }),
    },
  );
  record("improve-section", improve);
  if (improve.json?.project) checkProject(improve.json.project, "improve-section");

  const regenerate = await call(
    "regenerate-section",
    "/api/regenerate-section",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ project, sectionKey: "api-specification", provider: null, generationMode: "fast" }),
    },
  );
  record("regenerate-section", regenerate);
  if (regenerate.json?.project) checkProject(regenerate.json.project, "regenerate-section");
}

const repos = await call("trending-repos", "/api/trending-repos?topic=ai%20video%20app%20nextjs", {}, 45_000);
record("trending-repos", repos);
assert((repos.json?.repos?.length || 0) >= 8, "trending-repos: expected at least 8 repo recommendations.");

const job = await call(
  "generation-job",
  "/api/generation-job",
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ input: sampleInput, provider: null, generationMode: "fast" }),
  },
);
record("generation-job", job);
assert(["completed", "queued", "processing"].includes(job.json?.status), "generation-job: unexpected status.");
if (job.json?.status === "completed") checkProject(job.json.project, "generation-job");

console.log(`API flow verification target: ${BASE_URL}`);
for (const row of rows) {
  const status = row.ok ? "PASS" : row.optional ? "OPTIONAL" : "FAIL";
  console.log(`${status} ${row.name} status=${row.status} time=${row.ms}ms`);
}

if (failures.length) {
  console.error("\nAPI flow verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nAPI flow verification passed.");
