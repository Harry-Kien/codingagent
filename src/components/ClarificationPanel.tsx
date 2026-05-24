"use client";

import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClarificationPanel({
  questions,
  onDefaults,
}: {
  questions: string[];
  onDefaults: () => void;
}) {
  if (!questions.length) return null;
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-amber-950">A few details would sharpen the kit</h2>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {questions.map((question) => (
              <li key={question}>- {question}</li>
            ))}
          </ul>
        </div>
        <Button variant="secondary" size="sm" onClick={onDefaults}>
          <Wand2 className="h-4 w-4" />
          AI choose defaults
        </Button>
      </div>
    </div>
  );
}
