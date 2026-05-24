"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Boxes,
  FolderClock,
  Home,
  Info,
  Map,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthPanel } from "@/components/app/AuthPanel";

const navItems = [
  { href: "/", label: "Builder", icon: Home, description: "Create a project kit" },
  { href: "/projects", label: "Projects", icon: FolderClock, description: "History & exports" },
  { href: "/repo-map", label: "Repo Map", icon: Map, description: "Tools & repos" },
  { href: "/settings", label: "Settings", icon: Settings, description: "Providers & MCP" },
  { href: "/about", label: "About", icon: Info, description: "How it works" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prevPathname = useRef(pathname);

  // Close mobile menu on navigation (avoids direct setState in effect)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      requestAnimationFrame(() => setMobileMenuOpen(false));
    }
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-zinc-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-zinc-200 bg-white px-3 py-4 lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
            <Boxes className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold leading-tight">VibeForge</span>
            <span className="block text-[11px] text-zinc-400">AI project OS</span>
          </span>
        </Link>

        <nav className="mt-6 flex-1 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-teal-50 text-teal-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-teal-700" : "text-zinc-400 group-hover:text-zinc-600")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-lg border border-teal-100 bg-teal-50/60 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800">
            <Sparkles className="h-3.5 w-3.5" />
            Demo mode ready
          </div>
          <p className="mt-1 text-[11px] leading-4 text-teal-700">
            Works without API keys.
          </p>
        </div>

        <div className="mt-3">
          <AuthPanel />
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-out menu */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-200 bg-white px-3 py-4 transition-transform duration-200 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-teal-700" />
            <span className="text-sm font-semibold">VibeForge</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-6 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-teal-50 text-teal-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-teal-700" : "text-zinc-400")} />
                <div>
                  <div>{item.label}</div>
                  <div className="text-[11px] font-normal text-zinc-400">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 px-2">
          <AuthPanel />
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-1.5">
              <Boxes className="h-4 w-4 text-teal-700" />
              <span className="text-sm font-semibold">VibeForge</span>
            </Link>
          </div>
          <nav className="flex gap-0.5">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    active ? "bg-teal-50 text-teal-700" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
