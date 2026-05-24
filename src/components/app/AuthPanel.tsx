"use client";

import { useState } from "react";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";

export function AuthPanel() {
  const { user, loading, isAuthenticated, isSupabaseAvailable, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const [mode, setMode] = useState<"idle" | "login" | "signup">("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isSupabaseAvailable) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          <User className="h-3.5 w-3.5" />
          Local mode
        </div>
        <p className="mt-1 text-[11px] leading-4 text-zinc-400">
          Cloud sync is available when Supabase env vars are configured.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs text-zinc-400">Loading auth…</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="rounded-lg border border-teal-100 bg-teal-50/60 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800">
          <User className="h-3.5 w-3.5" />
          {user.email ?? "Signed in"}
        </div>
        <button
          onClick={() => void signOut()}
          className="mt-2 flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900"
        >
          <LogOut className="h-3 w-3" />
          Sign out
        </button>
      </div>
    );
  }

  if (mode === "idle") {
    return (
      <div className="space-y-1.5">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs"
          onClick={() => setMode("login")}
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign in
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs"
          onClick={() => setMode("signup")}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Create account
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fn = mode === "login" ? signInWithEmail : signUpWithEmail;
    const result = await fn(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? "Authentication failed");
    } else {
      setMode("idle");
      setEmail("");
      setPassword("");
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-2">
      <p className="text-xs font-semibold text-zinc-700">
        {mode === "login" ? "Sign in" : "Create account"}
      </p>
      <div>
        <Label className="text-[11px]">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="h-7 text-xs"
        />
      </div>
      <div>
        <Label className="text-[11px]">Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="h-7 text-xs"
          minLength={6}
        />
      </div>
      {error && (
        <p className="text-[11px] text-red-600">{error}</p>
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="text-xs" disabled={submitting}>
          {submitting ? "…" : mode === "login" ? "Sign in" : "Sign up"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            setMode("idle");
            setError(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
