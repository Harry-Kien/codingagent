import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppShell } from "@/components/app/AppShell";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeForge - AI Project OS for Vibe Coding",
  description:
    "Turn rough app ideas into complete, AI-buildable project kits for Codex, Cline, Cursor, Claude Code, and Gemini CLI.",
  keywords: ["AI", "project planning", "vibe coding", "Codex", "Cline", "MVP", "project kit"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
        <ToastContainer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
