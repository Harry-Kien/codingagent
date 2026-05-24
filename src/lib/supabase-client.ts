"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null | undefined;

/**
 * Returns a browser Supabase client, or null when env vars are absent.
 * Safe to call during SSR (returns null).
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;

  if (_client !== undefined) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    _client = null;
    return null;
  }

  try {
    _client = createBrowserClient(url, key);
    return _client;
  } catch {
    console.warn("[VibeForge] Failed to create Supabase client. Running local-only.");
    _client = null;
    return null;
  }
}

/**
 * Returns true when Supabase env vars are configured.
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
