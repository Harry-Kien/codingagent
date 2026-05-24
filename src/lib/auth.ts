"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// External store for auth state — shared across all consumers
// ---------------------------------------------------------------------------

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

let _state: AuthState = { user: null, session: null, loading: true };
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((listener) => listener());
}

function setAuth(next: Partial<AuthState>) {
  _state = { ..._state, ...next };
  notify();
}

/** Subscribe to auth changes. Used by useSyncExternalStore. */
function subscribe(listener: () => void) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

function getSnapshot() {
  return _state;
}

// ---------------------------------------------------------------------------
// Initialize once
// ---------------------------------------------------------------------------

let _initialized = false;

function initAuth() {
  if (_initialized) return;
  _initialized = true;

  const client = getSupabaseClient();
  if (!client) {
    setAuth({ loading: false });
    return;
  }

  // Get initial session
  client.auth.getSession().then(({ data }) => {
    setAuth({
      user: data.session?.user ?? null,
      session: data.session,
      loading: false,
    });
  });

  // Listen for changes
  client.auth.onAuthStateChange((_event, session) => {
    setAuth({
      user: session?.user ?? null,
      session,
      loading: false,
    });
  });
}

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

export function useAuth() {
  // Ensure init runs once
  useEffect(() => {
    initAuth();
  }, []);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const client = getSupabaseClient();
      if (!client) return { error: new Error("Supabase not configured") };
      const result = await client.auth.signInWithPassword({ email, password });
      return { error: result.error };
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      const client = getSupabaseClient();
      if (!client) return { error: new Error("Supabase not configured") };
      const result = await client.auth.signUp({ email, password });
      return { error: result.error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
  }, []);

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    isAuthenticated: !!state.user,
    isSupabaseAvailable: isSupabaseConfigured(),
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
