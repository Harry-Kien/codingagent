import { Sparkles } from "lucide-react";

export function LoadingState({ label = "Generating project kit..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-teal-700" />
        <Sparkles className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-teal-700" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-700">{label}</p>
      <p className="mt-1 text-xs text-zinc-400">This may take a few seconds.</p>
      <div className="mt-6 grid w-full max-w-lg gap-3 md:grid-cols-3">
        <div className="h-20 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-20 animate-pulse rounded-lg bg-zinc-100 delay-75" />
        <div className="h-20 animate-pulse rounded-lg bg-zinc-100 delay-150" />
      </div>
    </div>
  );
}
