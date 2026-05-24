import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "icon";
};

const variants = {
  primary:
    "bg-teal-700 text-white hover:bg-teal-800 border-teal-700 shadow-sm",
  secondary:
    "bg-white text-zinc-900 hover:bg-zinc-50 border-zinc-200 shadow-sm",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 border-transparent",
  outline:
    "bg-transparent text-zinc-800 hover:bg-zinc-50 border-zinc-300 shadow-sm",
  danger:
    "bg-coral-600 text-white hover:bg-coral-700 border-coral-600 shadow-sm",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  icon: "h-9 w-9 p-0",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
