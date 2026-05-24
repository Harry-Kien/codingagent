"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase-client";

type AuthState = {
  /** Current authenticated user, null if unauthenticated. */
  user: User | null;
  /** Current Supabase session, null if unauthenticated. */
  session: Session | null;
  /** True while loading initial session from Supabase. */
  loading: boolean;
  /** True when Supabase env vars are present. */
  supabaseReady: boolean;
  /** Sign in with email/password. Returns error message on failure. */
  signIn: (email: string, password: string) => Promise<string | null>;
  /** Sign up with email/password. Returns error message on failure. */
  signUp: (email: string, password: string) => Promise<string | null>;
  /** Sign in with OAuth provider (GitHub, Google, etc). */
  signInWithOAuth: (provider: "github" | "google") => Promise<string | null>;
  /** Sign out. */
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  supabaseReady: false,
  signIn: async () => "Supabase not configured",
  signUp: async () => "Supabase not configured",
  signInWithOAuth: async () => "Supabase not configured",
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      // Deferred so it's not synchronous in the effect body (satisfies react-hooks/set-state-in-effect)
      queueMicrotask(() => setLoading(false));
      return;
    }

    // Get initial session
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) return "Supabase is not configured. Running in local-only mode.";
    const { error } = await client.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) return "Supabase is not configured.";
    const { error } = await client.auth.signUp({ email, password });
    return error?.message ?? null;
  }, []);

  const signInWithOAuth = useCallback(
    async (provider: "github" | "google") => {
      const client = getSupabaseClient();
      if (!client) return "Supabase is not configured.";
      const { error } = await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/` },
      });
      return error?.message ?? null;
    },
    [],
  );

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      session,
      loading,
      supabaseReady,
      signIn,
      signUp,
      signInWithOAuth,
      signOut,
    }),
    [user, session, loading, supabaseReady, signIn, signUp, signInWithOAuth, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
