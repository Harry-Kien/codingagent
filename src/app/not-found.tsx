import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
        <FileQuestion className="h-8 w-8 text-zinc-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-zinc-950">Page not found</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link href="/">
        <Button>Back to builder</Button>
      </Link>
    </div>
  );
}
