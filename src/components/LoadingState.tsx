import { Sparkles } from "lucide-react";

export function LoadingState({
  label = "Generating project kit...",
  detail = "This may take a few seconds.",
  steps = ["Analyze idea", "Build sections", "Prepare exports"],
}: {
  label?: string;
  detail?: string;
  steps?: string[];
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-teal-700" />
        <Sparkles className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-teal-700" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-700">{label}</p>
      <p className="mt-1 max-w-md text-center text-xs leading-5 text-zinc-500">{detail}</p>
      <div className="mt-6 grid w-full max-w-lg gap-3 md:grid-cols-3">
        {steps.slice(0, 3).map((step, index) => (
          <div key={step} className="animate-pulse rounded-lg border border-zinc-200 bg-white p-4" style={{ animationDelay: `${index * 90}ms` }}>
            <div className="h-2 w-12 rounded-full bg-teal-100" />
            <p className="mt-3 text-xs font-medium text-zinc-600">{step}</p>
            <div className="mt-3 h-2 rounded-full bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
