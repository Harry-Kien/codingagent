import { readFile } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import JSZip from "jszip";

const SAMPLE_IDEA =
  "I want to build an AI video app for small shops. The user enters a product description and the app creates a 7-day video content plan, scripts, captions, and prompts for Veo/Gemini/Sora. I am a non-coder and want the full product with low API cost, MCP integrations, and a workflow that Codex/Cline can continue building.";

function main(page: Page) {
  return page.locator("main");
}

async function generateDemoKit(page: Page) {
  await page.goto("/");
  await page.getByLabel(/project idea/i).fill(SAMPLE_IDEA);
  await page.getByRole("button", { name: /generate project kit/i }).click();
  await page.waitForURL(/\/projects\/.+/, { timeout: 60_000 });
  await expect(main(page).getByRole("heading", { level: 1 })).toBeVisible();
}

async function downloadText(page: Page, buttonName: RegExp) {
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 10_000 }),
    main(page).getByRole("button", { name: buttonName }).first().click(),
  ]);
  const path = await download.path();
  expect(path).toBeTruthy();
  return readFile(path as string, "utf8");
}

async function downloadBuffer(page: Page, buttonName: RegExp) {
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 10_000 }),
    main(page).getByRole("button", { name: buttonName }).first().click(),
  ]);
  const path = await download.path();
  expect(path).toBeTruthy();
  return readFile(path as string);
}

test.describe("Public beta core flow", () => {
  test("keeps the root route as the usable builder", async ({ page }) => {
    await page.goto("/");
    await expect(main(page).getByRole("heading", { level: 1 })).toContainText(/project kit/i);
    await expect(page.getByLabel(/project idea/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /generate project kit/i })).toBeVisible();

    await page.getByRole("button", { name: /load ai video sample/i }).click();
    await expect(page.getByLabel(/project idea/i)).toHaveValue(/AI video app/i);
    await expect(main(page).getByText(/AI mode: (Demo stable|Demo mode|.+ active)/i).first()).toBeVisible();
  });

  test("generates a demo kit, opens history, and shows AI video repo recommendations", async ({ page }) => {
    await generateDemoKit(page);
    const projectUrl = page.url();

    await expect(main(page).getByText(/Project kit ready/i)).toBeVisible();
    await expect(main(page).getByText(/Kit Quality:/i)).toBeVisible();
    await expect(main(page).getByText(/Repo & Tool Recommendations/i)).toBeVisible();
    await expect(main(page).getByText(/do not clone automatically/i).first()).toBeVisible();

    await page.goto("/projects");
    await expect(main(page).getByText(/AI Video App For Small Shops/i).first()).toBeVisible();
    await main(page).getByRole("link", { name: /open/i }).first().click();
    await expect(page).toHaveURL(projectUrl);
  });

  test("exports Markdown, JSON, ZIP, and Codex pack with complete safe content", async ({ page }) => {
    await generateDemoKit(page);

    const markdown = await downloadText(page, /markdown/i);
    expect(markdown).toContain("# Product Requirements");
    expect(markdown).toContain("# Task Plan");
    expect(markdown).toContain("Do not clone");

    const jsonText = await downloadText(page, /json/i);
    const json = JSON.parse(jsonText);
    expect(json.sections["task-plan"]).toContain("Acceptance criteria");
    expect(json.generation.providerName).toBeUndefined();
    expect(json.generation.model).toBeUndefined();
    expect(jsonText).not.toContain("apiKey");
    expect(jsonText).not.toContain("ciphertext");

    const zip = await JSZip.loadAsync(await downloadBuffer(page, /^zip$/i));
    for (const filename of ["PRODUCT_REQUIREMENTS.md", "TASKS.md", "AI_HANDOFF.md", "SECURITY_CHECKLIST.md", "project.json"]) {
      expect(zip.file(filename), `${filename} should be present`).toBeTruthy();
    }
    expect(await zip.file("TASKS.md")?.async("string")).toContain("Test command");

    const codexPack = await JSZip.loadAsync(await downloadBuffer(page, /codex pack/i));
    for (const filename of ["AGENTS.md", "PROJECT_BRIEF.md", "TASKS.md", "REPO_REFERENCES.md", "AI_HANDOFF.md", "NEXT_ACTIONS.md"]) {
      expect(codexPack.file(filename), `${filename} should be present in Codex pack`).toBeTruthy();
    }
    const handoff = await codexPack.file("AI_HANDOFF.md")?.async("string");
    expect(handoff).toContain("Primary Agent Prompt");
    expect(handoff).toContain("Do not clone external repositories automatically");
  });

  test("copies, searches, improves, regenerates, and approves a section", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await generateDemoKit(page);
    const sectionApiCalls: string[] = [];
    page.on("request", (request) => {
      if (/\/api\/(improve-section|regenerate-section)/.test(request.url())) {
        sectionApiCalls.push(request.url());
      }
    });

    await main(page).getByPlaceholder(/search sections/i).fill("task");
    await main(page).getByRole("tab", { name: /task plan/i }).click();
    await expect(main(page).getByRole("heading", { name: /task plan/i })).toBeVisible();

    await main(page).getByRole("button", { name: /^copy$/i }).click();
    await expect(main(page).getByRole("button", { name: /copied/i })).toBeVisible();

    await main(page).getByRole("button", { name: /improve/i }).click();
    await expect(main(page).locator("article").getByText(/Files:|Acceptance criteria:|Local-First Guardrail/i).first()).toBeVisible({ timeout: 20_000 });

    await main(page).getByRole("button", { name: /regenerate/i }).click();
    await expect(main(page).locator("article").getByText(/Files:|Acceptance criteria:|Local-First Guardrail|Regenerated Note/i).first()).toBeVisible({ timeout: 20_000 });

    await main(page).getByRole("button", { name: /approve/i }).click();
    await expect(main(page).getByRole("tab", { name: /task plan.*approved/i })).toBeVisible();
    expect(sectionApiCalls).toEqual([]);
  });

  test("saves local provider settings and MCP connection settings", async ({ page }) => {
    await page.goto("/settings");
    await expect(main(page).getByRole("heading", { level: 1 })).toContainText(/settings/i);
    await expect(main(page).getByText(/local fallback/i)).toBeVisible();

    await main(page).getByRole("button", { name: /add provider/i }).click();
    await main(page).getByLabel(/provider name/i).first().fill("Public Beta Test Provider");
    await main(page).getByLabel(/api key/i).first().fill("test-key-not-real");
    await expect(main(page).getByText(/Public Beta Test Provider/i)).toBeVisible();

    const providers = await page.evaluate(() => localStorage.getItem("vibeforge.providers"));
    expect(providers).toContain("Public Beta Test Provider");

    await main(page).getByRole("button", { name: /add connection/i }).click();
    const connectionName = main(page).getByLabel(/^name$/i).last();
    await connectionName.fill("Public beta Codex MCP");
    await expect(connectionName).toHaveValue("Public beta Codex MCP");

    const connections = await page.evaluate(() => localStorage.getItem("vibeforge.mcpConnections"));
    expect(connections).toContain("Public beta Codex MCP");
  });

  test("filters the repo map for AI video tools", async ({ page }) => {
    await page.goto("/repo-map");
    await expect(main(page).getByRole("heading", { level: 1 })).toBeVisible();
    await main(page).getByPlaceholder(/search/i).fill("video");
    await expect(main(page).getByText(/\d+ tools? found/i)).toBeVisible();
    await expect(main(page).getByText(/when to use/i).first()).toBeVisible();
  });

  test("responds to health checks", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.version).toBeTruthy();
  });
});
