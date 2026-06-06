import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { RepoTool } from "@/types/vibeforge";

// Disable Next.js routing caching to ensure fresh fetches during dev/production
export const dynamic = "force-dynamic";

const CACHE_DURATION_SEC = 1800;
const GITHUB_FETCH_TIMEOUT_MS = 7000;
const GITHUB_FAILURE_COOLDOWN_MS = 15 * 60_000;
let liveGitHubDisabledUntil = 0;

interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  license: { name: string } | null;
  topics: string[];
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rl = await checkRateLimit(ip, { maxRequests: 30, windowMs: 60_000 });
  
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const topic = sanitizeTopic(searchParams.get("topic") || "");
    const queryTexts = topic ? topicQueries(topic) : ["stars:>3000 ai agent llm in:name,description,topics"];
    if (Date.now() < liveGitHubDisabledUntil) {
      throw new Error("Live GitHub trends are temporarily cooling down after a failed request.");
    }

    const items = await fetchGitHubRepos(queryTexts);

    if (!items || items.length === 0) {
      throw new Error("GitHub Search API returned an empty list.");
    }

    // Map GitHub objects into VibeForge RepoTool format
    const trendingRepos: RepoTool[] = items.map((repo) => {
      const difficulty: RepoTool["difficulty"] =
        repo.stargazers_count > 25000 ? "hard" : repo.stargazers_count > 10000 ? "medium" : "easy";
      
      const licenseName = repo.license?.name ?? "MIT / Open Source";

      return {
        id: `github-${repo.id}`,
        name: repo.full_name,
        url: repo.html_url,
        category: "GitHub live trend",
        useCase: repo.description ?? "Open-source AI development reference or component.",
        whenToUse: `Use as a highly-rated, community-vetted reference (${repo.stargazers_count.toLocaleString()} stars on GitHub) for advanced AI patterns.`,
        whenNotToUse: "Do not clone or run code blindly. Inspect license permissions and adapt patterns safely to your stack.",
        howToUse: "reference-only",
        difficulty,
        productionReadiness: repo.stargazers_count > 15000 ? "high" : "medium",
        riskNotes: `Verify license (${licenseName}) and check active repository issues before copying architectural patterns.`,
        costNotes: "Free and open source. Self-hosted or hosted infrastructure costs may apply.",
        suggestedPrompt: `Study the open-source implementation guidelines and coding structure at ${repo.html_url} to plan our next feature interface.`,
        tags: ["github-trend", "ai", ...repo.topics.slice(0, 3)],
      };
    });

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      repos: trendingRepos,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GitHub trend fetch error.";
    if (/403|429|timeout|timed out|cooling down/i.test(message)) {
      liveGitHubDisabledUntil = Date.now() + GITHUB_FAILURE_COOLDOWN_MS;
      console.info(`[API] trending-repos: live GitHub unavailable (${message}). Using local snapshot fallback.`);
    } else {
      console.warn(`[API] trending-repos: live GitHub failed (${message}). Using local snapshot fallback.`);
    }
    
    // Robust local fallback: read and parse GITHUB_TRENDS_SNAPSHOT.md if it exists!
    try {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const snapshotPath = path.resolve(process.cwd(), "GITHUB_TRENDS_SNAPSHOT.md");
      const content = await fs.readFile(snapshotPath, "utf8");
      
      const lines = content.split("\n");
      const parsedRepos: RepoTool[] = [];
      
      for (const line of lines) {
        if (line.startsWith("|") && !line.includes("Repository") && !line.includes("---|---")) {
          const parts = line.split("|").map(p => p.trim());
          if (parts.length >= 6) {
            const repoMatch = parts[2].match(/\[(.*?)\]\((.*?)\)/);
            if (repoMatch) {
              const fullName = repoMatch[1];
              const url = repoMatch[2];
              const starsStr = parts[3].replace(/,/g, "");
              const stars = parseInt(starsStr, 10) || 3000;
              const language = parts[4];
              const description = parts[5];
              
              const difficulty: RepoTool["difficulty"] =
                stars > 25000 ? "hard" : stars > 10000 ? "medium" : "easy";
              
              parsedRepos.push({
                id: `github-fallback-${fullName.replace(/\//g, "-")}`,
                name: fullName,
                url: url,
                category: "GitHub trend snapshot",
                useCase: description,
                whenToUse: `Use as a highly-rated, community-vetted reference (${stars.toLocaleString()} stars on GitHub) for advanced AI patterns.`,
                whenNotToUse: "Do not clone or run code blindly. Inspect license permissions and adapt patterns safely to your stack.",
                howToUse: "reference-only",
                difficulty,
                productionReadiness: stars > 15000 ? "high" : "medium",
                riskNotes: `Verify license and check active repository issues before copying architectural patterns.`,
                costNotes: "Free and open source. Self-hosted or hosted infrastructure costs may apply.",
                suggestedPrompt: `Study the open-source implementation guidelines and coding structure at ${url} to plan our next feature interface.`,
                tags: ["github-trend", "ai", language.toLowerCase()],
              });
            }
          }
        }
      }
      
      if (parsedRepos.length > 0) {
        console.info(`[API] trending-repos: loaded ${parsedRepos.length} fallback repos from GITHUB_TRENDS_SNAPSHOT.md`);
        return NextResponse.json({
          ok: true,
          updatedAt: new Date().toISOString(),
          repos: parsedRepos,
          fallback: true,
        });
      }
    } catch (fallbackError) {
      console.error("[API] trending-repos: fallback parsing failed", fallbackError);
    }

    // Ultimate hardcoded emergency fallback to prevent empty state
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch live trends from GitHub. Falling back to built-in map.",
        repos: [],
      },
      { status: 200 }
    );
  }
}

async function fetchGitHubRepos(queryTexts: string[]) {
  const byId = new Map<number, GitHubRepoItem>();

  for (const queryText of queryTexts) {
    const query = encodeURIComponent(queryText);
    const githubUrl = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=20&page=1`;
    const token = process.env.GITHUB_TOKEN || process.env.VIBEFORGE_GITHUB_TOKEN;
    const response = await fetch(githubUrl, {
      signal: AbortSignal.timeout(GITHUB_FETCH_TIMEOUT_MS),
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "VibeForge-App",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: CACHE_DURATION_SEC },
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned status: ${response.status}`);
    }

    const data = await response.json();
    const items = (data?.items ?? []) as GitHubRepoItem[];
    for (const item of items) byId.set(item.id, item);
  }

  return Array.from(byId.values()).sort((a, b) => b.stargazers_count - a.stargazers_count);
}

function sanitizeTopic(value: string) {
  return value
    .replace(/[^a-zA-Z0-9\s._/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function topicQueries(topic: string) {
  const lower = topic.toLowerCase();
  if (lower.includes("video") || lower.includes("showcase")) {
    return [
      "stars:>500 ai video in:name,description,topics",
      "stars:>500 remotion video in:name,description,topics",
      "stars:>200 product video nextjs in:name,description,topics",
      "stars:>200 short video maker in:name,description,topics",
    ];
  }
  if (lower.includes("commerce") || lower.includes("shop")) {
    return [
      "stars:>500 ecommerce nextjs in:name,description,topics",
      "stars:>500 shopify ai in:name,description,topics",
      "stars:>500 product catalog ai in:name,description,topics",
    ];
  }
  return [
    `stars:>500 ${topic} in:name,description,topics`,
    "stars:>3000 ai agent nextjs in:name,description,topics",
  ];
}
