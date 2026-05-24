"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase browser client if env vars are configured, otherwise null.
 * This is the single entry point for all Supabase interactions.
 * When env vars are missing, the app falls back to local-only mode.
 */

let _client: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (_client !== undefined) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    _client = null;
    return null;
  }

  try {
    _client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return _client;
  } catch {
    _client = null;
    return null;
  }
}

/** Quick check: are Supabase env vars configured? */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
