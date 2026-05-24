import { AlertCircle } from "lucide-react";

export function ErrorState({
  message,
  suggestion,
}: {
  message: string;
  suggestion?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-900">{message}</p>
      {suggestion && (
        <p className="mt-1 text-xs text-zinc-500">{suggestion}</p>
      )}
    </div>
  );
}
