"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[VibeForge] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-zinc-950">Something went wrong</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
          An unexpected error occurred. Your data is safe in local storage.
          Try refreshing or click the button below.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-zinc-400">Error ID: {error.digest}</p>
        )}
      </div>
      <Button onClick={reset}>
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
