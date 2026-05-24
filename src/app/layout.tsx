import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
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
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
