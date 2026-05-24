"use client";

import { Cloud, CloudOff, HardDrive, AlertTriangle } from "lucide-react";
import type { SyncStatus } from "@/lib/project-store";
import { cn } from "@/lib/utils";

const config: Record<
  SyncStatus,
  { icon: typeof Cloud; label: string; color: string }
> = {
  "local-only": {
    icon: HardDrive,
    label: "Local only",
    color: "text-zinc-500 bg-zinc-100",
  },
  "cloud-synced": {
    icon: Cloud,
    label: "Cloud synced",
    color: "text-teal-700 bg-teal-50",
  },
  "sync-failed": {
    icon: AlertTriangle,
    label: "Sync failed",
    color: "text-amber-700 bg-amber-50",
  },
};

export function SyncStatusBadge({
  status,
  className,
}: {
  status: SyncStatus;
  className?: string;
}) {
  const { icon: Icon, label, color } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        color,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

/**
 * Offline indicator shown when cloud mode is active but sync failed.
 */
export function CloudOffBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <CloudOff className="h-3 w-3" />
      Offline
    </span>
  );
}
