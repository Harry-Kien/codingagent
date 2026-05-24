import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  neutral: "border-zinc-200 bg-zinc-100 text-zinc-700",
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  green: "border-green-200 bg-green-50 text-green-800",
  coral: "border-red-200 bg-red-50 text-red-800",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
