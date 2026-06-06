// Script to fetch 60 live trending AI repos and save them as a snapshot in the project
const query = encodeURIComponent("stars:>3000 (ai OR agent OR llm OR langchain)");
const githubUrl = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=60&page=1`;

async function fetchAndSave() {
  console.log("Fetching 60 trending AI/Vibe Coding repositories from GitHub...");
  try {
    const res = await fetch(githubUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "VibeForge-App",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API returned status: ${res.status}`);
    }

    const data = await res.json();
    const items = data.items || [];
    console.log(`Successfully fetched ${items.length} repositories from GitHub.`);

    let markdown = `# 🔥 Live GitHub AI & Vibe Coding Trends Snapshot\n\n`;
    markdown += `*Automatically fetched and generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}*\n`;
    markdown += `*Criteria: Topic matches AI/AI-Agent/Vibe-Coding/LLM and Star count exceeds 3,000 ⭐, sorted by stars descending.*\n\n`;
    markdown += `| # | Repository | Stars ⭐ | Primary Topic / Language | Description |\n`;
    markdown += `|---|---|---|---|---|\n`;

    items.forEach((repo, idx) => {
      const name = repo.full_name;
      const url = repo.html_url;
      const stars = repo.stargazers_count.toLocaleString();
      const lang = repo.language || "TypeScript";
      const desc = repo.description ? repo.description.replace(/\|/g, "\\|") : "No description provided.";
      
      markdown += `| ${idx + 1} | [${name}](${url}) | ${stars} | ${lang} | ${desc} |\n`;
    });

    markdown += `\n---\n\n## 🛠️ How to use these in VibeForge / Vibe Coding:\n`;
    markdown += `1. Open these links in your browser to inspect their \`README.md\` and folder structures.\n`;
    markdown += `2. Copy the URL of any repository you want to use as an architectural reference.\n`;
    markdown += `3. Paste the URL into VibeForge's intake form or settings under Repo references.\n`;
    markdown += `4. Your AI coding agent (Cursor, Cline, Claude Code) will inspect the template structure to build your features cleanly!\n`;

    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    
    const outputPath = path.resolve("D:/CODING AGENT/GITHUB_TRENDS_SNAPSHOT.md");
    await fs.writeFile(outputPath, markdown, "utf8");
    console.log(`SUCCESS: Saved trending catalog snapshot to: ${outputPath}`);
  } catch (error) {
    console.error("FAILED to fetch and save trends:", error.message);
  }
}

fetchAndSave();
