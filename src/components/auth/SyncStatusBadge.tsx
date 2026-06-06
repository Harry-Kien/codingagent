"use client";

import { Cloud, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

/**
 * Small badge showing whether the user's data is local-only or cloud-synced.
 * Shows nothing during loading to avoid layout flicker.
 */
export function SyncStatusBadge() {
  const { user, loading, supabaseReady } = useAuth();

  if (loading) return null;

  if (!supabaseReady || !user) {
    return (
      <Badge variant="neutral" className="gap-1 text-[11px]">
        <HardDrive className="h-3 w-3" />
        Browser
      </Badge>
    );
  }

  return (
    <Badge variant="green" className="gap-1 text-[11px]">
      <Cloud className="h-3 w-3" />
      Cloud
    </Badge>
  );
}
