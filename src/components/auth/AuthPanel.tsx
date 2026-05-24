"use client";

import { useState } from "react";
import { LogIn, LogOut, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export function AuthPanel() {
  const { user, loading, supabaseReady, signIn, signUp, signInWithOAuth, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!supabaseReady) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Local-only mode</span>
        </div>
        <p className="mt-1 text-[11px] leading-4 text-zinc-400">
          Supabase not configured. Projects are stored in your browser.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs text-zinc-500">Checking auth...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-lg border border-teal-100 bg-teal-50/60 p-3">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-teal-700" />
          <span className="truncate text-xs font-medium text-teal-800">
            {user.email ?? "Signed in"}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="green">Cloud sync</Badge>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-7 text-xs"
            onClick={() => void signOut()}
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left text-xs text-zinc-600 transition hover:border-teal-200 hover:bg-teal-50/40"
      >
        <LogIn className="h-3.5 w-3.5 shrink-0" />
        <span>Sign in for cloud sync</span>
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const err = await fn(email, password);
    if (err) setError(err);
    setBusy(false);
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-2">
        <div>
          <Label className="text-[11px]">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-8 text-xs"
            required
          />
        </div>
        <div>
          <Label className="text-[11px]">Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-8 text-xs"
            required
            minLength={6}
          />
        </div>
        {error && (
          <p className="text-[11px] text-red-600">{error}</p>
        )}
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="h-7 flex-1 text-xs" disabled={busy}>
            {mode === "signin" ? "Sign in" : "Sign up"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </Button>
        </div>
      </form>
      <div className="mt-2 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 text-xs"
          onClick={() => void signInWithOAuth("github")}
        >
          GitHub
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 text-xs"
          onClick={() => void signInWithOAuth("google")}
        >
          Google
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setExpanded(false)}
        className="mt-2 w-full text-center text-[11px] text-zinc-400 hover:text-zinc-600"
      >
        Cancel
      </button>
    </div>
  );
}
