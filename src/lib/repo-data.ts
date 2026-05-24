import type { ProjectInput, RepoRecommendation, RepoTool } from "@/types/vibeforge";

export const repoTools: RepoTool[] = [
  {
    id: "codex-cli",
    name: "Codex CLI",
    url: "https://github.com/openai/codex",
    category: "Agent workflow",
    useCase: "Main coding agent and terminal coding workflow",
    whenToUse: "Use when the user wants a repo-aware coding agent that can inspect, edit, and verify a local project.",
    whenNotToUse: "Do not copy it into the app or treat it as app source code.",
    howToUse: "external-tool",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Keep project instructions explicit and never paste secrets into prompts.",
    costNotes: "Costs depend on the configured model/provider, not the CLI repository.",
    suggestedPrompt: "Read AGENTS.md, PROJECT_BRIEF.md, and TASKS.md, then implement the next task with tests.",
    tags: ["agent", "codex", "workflow"],
  },
  {
    id: "cline",
    name: "Cline",
    url: "https://github.com/cline/cline",
    category: "Agent workflow",
    useCase: "IDE agent in VS Code",
    whenToUse: "Use when the builder prefers a visual IDE workflow with file-level changes and approvals.",
    whenNotToUse: "Do not bundle it into a product; it is an external developer tool.",
    howToUse: "external-tool",
    difficulty: "easy",
    productionReadiness: "high",
    riskNotes: "Review file changes before accepting them.",
    costNotes: "Model spend is controlled by the user's configured provider.",
    suggestedPrompt: "Use the generated TASKS.md and implement one milestone at a time with concise diffs.",
    tags: ["agent", "ide", "workflow"],
  },
  {
    id: "superpowers",
    name: "Superpowers",
    url: "https://github.com/obra/superpowers",
    category: "Agent methodology",
    useCase: "Agentic development methodology and skills",
    whenToUse: "Use as workflow instructions to improve agent planning, execution, and verification discipline.",
    whenNotToUse: "Do not treat it as a runtime dependency for the generated product.",
    howToUse: "external-tool",
    difficulty: "medium",
    productionReadiness: "medium",
    riskNotes: "Adapt the process to the repo instead of blindly importing every instruction.",
    costNotes: "No direct app runtime cost.",
    suggestedPrompt: "Adopt a skill-based workflow and keep each implementation step small, verified, and documented.",
    tags: ["agent", "skills", "workflow"],
  },
  {
    id: "openhands",
    name: "OpenHands",
    url: "https://github.com/OpenHands/OpenHands",
    category: "Agent platform",
    useCase: "AI software engineering agent platform",
    whenToUse: "Use as a reference or advanced orchestration path for teams that need a broader agent platform.",
    whenNotToUse: "Avoid for simple local-first MVPs unless the team has ops capacity.",
    howToUse: "reference-only",
    difficulty: "hard",
    productionReadiness: "medium",
    riskNotes: "Self-hosting and permissions need careful review.",
    costNotes: "Infrastructure plus model costs can exceed a simple CLI workflow.",
    suggestedPrompt: "Evaluate whether OpenHands is needed after the MVP has repeatable build tasks.",
    tags: ["agent", "orchestration"],
  },
  {
    id: "shadcn-ui",
    name: "shadcn/ui",
    url: "https://github.com/shadcn-ui/ui",
    category: "UI",
    useCase: "Accessible UI components for React apps",
    whenToUse: "Use when building a polished SaaS, dashboard, settings, or form-heavy interface.",
    whenNotToUse: "Avoid if the project is static content with almost no interface surface.",
    howToUse: "install",
    difficulty: "easy",
    productionReadiness: "high",
    riskNotes: "Components are copied into the repo, so keep them maintained.",
    costNotes: "No runtime service cost.",
    suggestedPrompt: "Build the UI with shadcn-style components, lucide icons, and compact responsive layouts.",
    tags: ["ui", "nextjs", "dashboard", "saas", "video"],
  },
  {
    id: "supabase",
    name: "Supabase",
    url: "https://github.com/supabase/supabase",
    category: "Backend",
    useCase: "Auth, Postgres database, storage, and edge functions",
    whenToUse: "Use when the app needs users, persistent projects, files, or collaborative data.",
    whenNotToUse: "Avoid requiring it for a purely local prototype.",
    howToUse: "install",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Row-level security policies must be tested before launch.",
    costNotes: "Free tier can carry MVPs; storage and auth usage may add cost.",
    suggestedPrompt: "Add Supabase only after the local-first flow works, then map local types to Postgres tables.",
    tags: ["backend", "database", "auth", "saas", "video"],
  },
  {
    id: "n8n",
    name: "n8n",
    url: "https://github.com/n8n-io/n8n",
    category: "Automation",
    useCase: "Automation workflows",
    whenToUse: "Use for CRM, notification, content pipeline, and agency automation workflows.",
    whenNotToUse: "Avoid embedding it inside the app unless workflow execution is core to the product.",
    howToUse: "import-workflow",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Webhook auth and data retention need explicit setup.",
    costNotes: "Cloud or self-hosted infrastructure cost depends on volume.",
    suggestedPrompt: "Design n8n workflows as external integrations with webhook contracts and retry notes.",
    tags: ["automation", "n8n", "workflow"],
  },
  {
    id: "remotion",
    name: "Remotion",
    url: "https://github.com/remotion-dev/remotion",
    category: "Video",
    useCase: "Video rendering with React",
    whenToUse: "Use when the app needs deterministic programmatic video generation, previews, or rendering queues.",
    whenNotToUse: "Avoid for a first MVP that only generates scripts, captions, and prompts.",
    howToUse: "install",
    difficulty: "hard",
    productionReadiness: "high",
    riskNotes: "Rendering workloads need queueing, storage, and cost controls.",
    costNotes: "Video rendering can create compute and storage costs.",
    suggestedPrompt: "Add Remotion as a phase-two video renderer after validating script and content-plan demand.",
    tags: ["video", "react", "ai video app"],
  },
  {
    id: "videosos",
    name: "VideoSOS",
    url: "https://github.com/timoncool/videosos",
    category: "Video reference",
    useCase: "AI video editor architecture reference",
    whenToUse: "Use as reference for product architecture, editor concepts, and pipeline decomposition.",
    whenNotToUse: "Do not clone into the MVP unless intentionally adopting its license and architecture.",
    howToUse: "reference-only",
    difficulty: "hard",
    productionReadiness: "medium",
    riskNotes: "Review license and dependencies before any code reuse.",
    costNotes: "Reference-only has no direct cost.",
    suggestedPrompt: "Review this repo for architecture patterns only, then design a smaller MVP-specific flow.",
    tags: ["video", "reference", "ai video app"],
  },
  {
    id: "storygen-atelier",
    name: "StoryGen-Atelier",
    url: "https://github.com/0xsline/StoryGen-Atelier",
    category: "Video reference",
    useCase: "Storyboard to AI video pipeline reference",
    whenToUse: "Use to study storyboard, scene, and generation pipeline patterns.",
    whenNotToUse: "Avoid copying code into a commercial MVP without license review.",
    howToUse: "reference-only",
    difficulty: "hard",
    productionReadiness: "medium",
    riskNotes: "Reference workflow ideas rather than implementation details.",
    costNotes: "Reference-only has no direct cost.",
    suggestedPrompt: "Extract scene planning concepts, not source code, and map them to the generated app scope.",
    tags: ["video", "storyboard", "ai video app"],
  },
  {
    id: "short-video-maker",
    name: "short-video-maker",
    url: "https://github.com/gyoridavid/short-video-maker",
    category: "Video reference",
    useCase: "Faceless short video automation with Remotion, FFmpeg, TTS, and captions",
    whenToUse: "Use as a reference or fork candidate for short-video automation workflows.",
    whenNotToUse: "Do not start here for a prompt-and-plan MVP aimed at non-technical users.",
    howToUse: "reference-only",
    difficulty: "medium",
    productionReadiness: "medium",
    riskNotes: "Validate licenses for media, fonts, and generated assets.",
    costNotes: "FFmpeg compute and TTS generation can add cost.",
    suggestedPrompt: "Use this as a reference for future rendering workflows after the planning app ships.",
    tags: ["video", "ffmpeg", "captions", "ai video app"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    url: "https://github.com/vercel/next.js",
    category: "Framework",
    useCase: "Full-stack React app with App Router and Vercel deployment",
    whenToUse: "Use for SaaS, dashboards, AI tools, and apps that need routes and API endpoints.",
    whenNotToUse: "Avoid for tiny static tools where Vite is enough.",
    howToUse: "install",
    difficulty: "medium",
    productionReadiness: "high",
    riskNotes: "Keep server actions free of hardcoded secrets.",
    costNotes: "Vercel free tier can run many MVPs; serverless usage can grow with traffic.",
    suggestedPrompt: "Use Next.js App Router with typed data models and build-safe environment access.",
    tags: ["nextjs", "saas", "dashboard", "video", "ai tool"],
  },
  {
    id: "ffmpeg",
    name: "FFmpeg",
    url: "https://ffmpeg.org/",
    category: "Video",
    useCase: "Video/audio processing, clipping, transcoding, and caption burn-in",
    whenToUse: "Use when generated assets need real media processing.",
    whenNotToUse: "Avoid in the first MVP if the product only outputs scripts and prompts.",
    howToUse: "external-tool",
    difficulty: "hard",
    productionReadiness: "high",
    riskNotes: "Serverless runtime support and licensing details must be checked.",
    costNotes: "Compute-heavy media processing needs cost controls.",
    suggestedPrompt: "Keep FFmpeg as a future processing service until user demand for rendered files is proven.",
    tags: ["video", "ffmpeg", "media"],
  },
];

export function recommendRepos(input: ProjectInput): RepoRecommendation[] {
  const appType = input.appType.toLowerCase();
  const text = `${input.idea} ${input.desiredOutput ?? ""} ${appType}`.toLowerCase();
  const isVideo = text.includes("video") || appType.includes("video");
  const isAutomation = input.wantsAutomation || text.includes("automation") || appType.includes("n8n");
  const base = ["nextjs", "shadcn-ui", "supabase", "codex-cli", "superpowers", "cline"];
  const ids = new Set(base);

  if (isVideo) {
    ["remotion", "ffmpeg", "videosos", "storygen-atelier", "short-video-maker"].forEach((id) =>
      ids.add(id),
    );
  }
  if (isAutomation) ids.add("n8n");
  if (input.skillLevel === "Developer") ids.add("openhands");

  return Array.from(ids)
    .map((id) => repoTools.find((tool) => tool.id === id))
    .filter((tool): tool is RepoTool => Boolean(tool))
    .map((tool) => {
      let lane: RepoRecommendation["lane"] = "use-directly";
      if (["codex-cli", "cline", "superpowers"].includes(tool.id)) lane = "agent-workflow";
      if (["videosos", "storygen-atelier", "short-video-maker", "openhands"].includes(tool.id)) lane = "reference";
      if (["remotion", "ffmpeg"].includes(tool.id) && isVideo) lane = "future";
      if (tool.id === "n8n") lane = "future";
      return {
        tool,
        lane,
        reason:
          lane === "reference"
            ? "Useful architecture reference, but not source code to copy into the MVP."
            : lane === "agent-workflow"
              ? "Helps turn the generated kit into controlled implementation work."
              : lane === "future"
                ? "Relevant after the first validated planning workflow is working."
                : "Strong fit for the first build path.",
      };
    });
}
