"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DISMISSED_KEY = "vibeforge.quickstart.dismissed";

/**
 * Lightweight onboarding panel shown at the top of the builder.
 * Dismissible - once dismissed, stays hidden via localStorage.
 * Does NOT block the builder flow.
 */
export function QuickStartPanel() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(DISMISSED_KEY) === "1";
  });

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    }
  }

  return (
    <div className="rounded-lg border border-teal-200 bg-gradient-to-r from-teal-50 to-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-700" />
          <span className="text-sm font-semibold text-teal-900">Quick Start</span>
          <Badge variant="teal">3 steps</Badge>
        </div>
        <button
          onClick={dismiss}
          className="text-xs text-zinc-400 hover:text-zinc-600"
          aria-label="Dismiss quick start"
        >
          Dismiss
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Step number={1} title="Describe your idea" description="Enter your app concept, constraints, and build context." />
        <Step number={2} title="Generate kit" description="Click Generate - VibeForge creates 18 exportable sections." />
        <Step number={3} title="Export to agent" description="Download a Codex/Cline/Cursor pack and hand it to your coding agent." />
      </div>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
        {number}
      </div>
      <div>
        <div className="text-sm font-medium text-zinc-950">{title}</div>
        <div className="mt-0.5 text-xs leading-4 text-zinc-600">{description}</div>
      </div>
    </div>
  );
}
