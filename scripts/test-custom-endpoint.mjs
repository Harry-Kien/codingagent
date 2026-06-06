import { existsSync, readFileSync } from "node:fs";

// Use global native fetch (supported in Node 18+).
// API keys must come from environment variables, never source code.

loadDotEnvLocal();

const apiKey =
  process.env.VIBEFORGE_SERVER_PROVIDER_API_KEY ||
  process.env.VIBEFORGE_OPENROUTER_API_KEY ||
  process.env.OPENROUTER_API_KEY ||
  "";
const baseUrl =
  process.env.VIBEFORGE_SERVER_PROVIDER_BASE_URL ||
  process.env.VIBEFORGE_OPENROUTER_BASE_URL ||
  "https://openrouter.ai/api/v1";
const configuredModel =
  process.env.VIBEFORGE_SERVER_PROVIDER_DEFAULT_MODEL ||
  process.env.VIBEFORGE_OPENROUTER_DEFAULT_MODEL ||
  "";

async function testConnection() {
  if (!apiKey.trim()) {
    console.error("ERROR: Missing provider API key in environment variables.");
    process.exitCode = 1;
    return;
  }

  console.log(`Connecting to endpoint: ${baseUrl}`);
  console.log(`Using API key: ${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`);

  try {
    // 1. Try listing models
    const modelsUrl = `${baseUrl.replace(/\/+$/, "")}/models`;
    console.log(`Fetching models from: ${modelsUrl}`);
    const modelsRes = await fetch(modelsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    console.log(`Models response status: ${modelsRes.status}`);
    const modelsData = await modelsRes.json().catch(() => null);

    let detectedModels = [];
    if (modelsRes.ok && modelsData && Array.isArray(modelsData.data)) {
      detectedModels = modelsData.data.map(m => m.id);
      console.log("Detected models:", detectedModels);
    } else {
      console.log("Failed to parse models list. Response body:", JSON.stringify(modelsData));
    }

    // 2. Try a quick chat completion to verify OpenAI-compatibility
    const completionUrl = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
    console.log(`Testing chat completion at: ${completionUrl}`);
    
    // Use first detected model or standard default
    const testModel = configuredModel || detectedModels[0] || "openai/gpt-4.1-mini";
    console.log(`Using model for test: ${testModel}`);

    const compRes = await fetch(completionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: testModel,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello, reply in 3 words." },
        ],
        max_tokens: 10,
      }),
    });

    console.log(`Completion response status: ${compRes.status}`);
    const compData = await compRes.json().catch(() => null);
    
    if (compRes.ok && compData) {
      console.log("SUCCESS: Connection verified! Reply:", compData.choices?.[0]?.message?.content);
      console.log("Connection format: OpenAI-compatible!");
    } else {
      console.log("FAILED chat completion. Response body:", JSON.stringify(compData));
    }
  } catch (error) {
    console.error("ERROR: Failed to establish connection:", error.message);
    if (error.cause?.code) {
      console.error("Cause:", error.cause.code);
    }
    process.exitCode = 1;
  }
}

testConnection();

function loadDotEnvLocal() {
  if (!existsSync(".env.local")) return;

  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  }
}
