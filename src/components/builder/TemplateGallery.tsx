"use client";

import { BarChart3, BookOpen, Bot, Building2, Clapperboard, HeartPulse, MapPin, PenTool, ShoppingBag, Store, Workflow } from "lucide-react";
import type { ProjectInput } from "@/types/vibeforge";

const templates: Array<{
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  input: Partial<ProjectInput>;
}> = [
  {
    id: "ai-video",
    icon: <Clapperboard className="h-6 w-6" />,
    title: "AI Video App",
    subtitle: "Generate product showcase videos from photos",
    gradient: "from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:to-fuchsia-500/20 border-violet-200",
    input: {
      idea: "AI video app for small shops that generates product showcase videos from product photos and descriptions.",
      targetUsers: "Small shop owners, local retailers, Shopee/TikTok Shop sellers.",
      problem: "Small shops can't afford professional video production for their products.",
      desiredOutput: "30-second product showcase videos with text overlays, background music, and transitions.",
      appType: "AI video app",
      timeline: "7 day build",
      skillLevel: "Non-coder",
      budgetSensitivity: "high",
      preferredStack: ["Next.js", "Supabase", "shadcn/ui"],
      apiProviders: ["Gemini", "OpenRouter"],
      wantsMcp: true,
      wantsAutomation: true,
    },
  },
  {
    id: "saas-dashboard",
    icon: <BarChart3 className="h-6 w-6" />,
    title: "SaaS Dashboard",
    subtitle: "Analytics & metrics dashboard for your SaaS",
    gradient: "from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20 border-teal-200",
    input: {
      idea: "SaaS analytics dashboard that tracks user signups, revenue, churn, and feature usage with real-time charts.",
      targetUsers: "Indie SaaS founders and small startup teams tracking their product metrics.",
      problem: "Most analytics tools are expensive or too complex for early-stage SaaS products.",
      desiredOutput: "A real-time dashboard with signup trends, MRR charts, churn analysis, and feature usage heatmaps.",
      appType: "SaaS dashboard",
      timeline: "7 day build",
      skillLevel: "Builder",
      budgetSensitivity: "medium",
      preferredStack: ["Next.js", "Supabase", "shadcn/ui"],
      apiProviders: [],
      wantsMcp: true,
      wantsAutomation: false,
    },
  },
  {
    id: "n8n-automation",
    icon: <Workflow className="h-6 w-6" />,
    title: "n8n Automation",
    subtitle: "Automate workflows with n8n + webhooks",
    gradient: "from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border-orange-200",
    input: {
      idea: "Lead generation automation that captures form submissions, enriches leads with AI, scores them, and pushes qualified ones to CRM.",
      targetUsers: "Marketing teams and agencies running lead generation campaigns.",
      problem: "Manual lead qualification is slow and inconsistent, causing sales teams to waste time on bad leads.",
      desiredOutput: "Automated pipeline: form capture -> AI enrichment -> lead scoring -> CRM push with Slack notifications.",
      appType: "n8n automation",
      timeline: "7 day build",
      skillLevel: "Builder",
      budgetSensitivity: "medium",
      preferredStack: ["Next.js", "n8n"],
      apiProviders: ["OpenRouter"],
      wantsMcp: true,
      wantsAutomation: true,
    },
  },
  {
    id: "internal-tool",
    icon: <Building2 className="h-6 w-6" />,
    title: "Internal Tool",
    subtitle: "Operations dashboard for your team",
    gradient: "from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-blue-200",
    input: {
      idea: "Internal operations tool for managing employee leave requests, approvals, and team availability calendar.",
      targetUsers: "HR teams and team managers at companies with 20-200 employees.",
      problem: "Leave tracking is done in spreadsheets, causing scheduling conflicts and approval delays.",
      desiredOutput: "Dashboard with leave request form, manager approval workflow, team calendar view, and CSV export.",
      appType: "Internal business tool",
      timeline: "7 day build",
      skillLevel: "Builder",
      budgetSensitivity: "high",
      preferredStack: ["Next.js", "Supabase"],
      apiProviders: [],
      wantsMcp: false,
      wantsAutomation: false,
    },
  },
  {
    id: "content-tool",
    icon: <PenTool className="h-6 w-6" />,
    title: "Content Tool",
    subtitle: "AI-powered content creation & planning",
    gradient: "from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20 border-pink-200",
    input: {
      idea: "AI content planner that generates weekly social media content plans with captions, hashtags, and image prompts for Instagram and TikTok.",
      targetUsers: "Solo creators, freelance social media managers, and small brand teams.",
      problem: "Creating consistent social media content is time-consuming and requires constant idea generation.",
      desiredOutput: "7-day content plan with post captions, hashtag sets, image/video prompts, and best posting times.",
      appType: "Content tool",
      timeline: "7 day build",
      skillLevel: "Non-coder",
      budgetSensitivity: "high",
      preferredStack: ["Next.js", "shadcn/ui"],
      apiProviders: ["Gemini"],
      wantsMcp: false,
      wantsAutomation: false,
    },
  },
  {
    id: "ecommerce-helper",
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "E-commerce Helper",
    subtitle: "Product listings, ad copy & SEO content",
    gradient: "from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 border-emerald-200",
    input: {
      idea: "E-commerce product listing generator that creates optimized titles, descriptions, bullet points, and SEO metadata from product photos and basic info.",
      targetUsers: "Shopee, Lazada, and TikTok Shop sellers who manage 50+ product listings.",
      problem: "Writing unique, SEO-optimized product descriptions for hundreds of SKUs is tedious and repetitive.",
      desiredOutput: "Optimized product title, 5 bullet points, long description, SEO tags, and ad copy variants for each product.",
      appType: "E-commerce helper",
      timeline: "7 day build",
      skillLevel: "Non-coder",
      budgetSensitivity: "high",
      preferredStack: ["Next.js", "shadcn/ui"],
      apiProviders: ["Gemini"],
      wantsMcp: false,
      wantsAutomation: false,
    },
  },
  {
    id: "education-learning",
    icon: <BookOpen className="h-6 w-6" />,
    title: "Education App",
    subtitle: "Lessons, practice, progress tracking",
    gradient: "from-sky-500/10 to-teal-500/10 hover:from-sky-500/20 hover:to-teal-500/20 border-sky-200",
    input: {
      idea: "AI learning app that creates personalized lesson plans, practice exercises, and review schedules for busy adult learners.",
      targetUsers: "Adult learners who want structured practice without joining a full course.",
      problem: "Learners lose momentum because lessons are generic and progress is hard to track.",
      desiredOutput: "Personalized lesson plan, daily exercises, review schedule, and progress checklist.",
      appType: "Education app",
      timeline: "7 day build",
      skillLevel: "Non-coder",
      budgetSensitivity: "high",
      preferredStack: ["Next.js", "localStorage", "shadcn/ui"],
      apiProviders: ["Gemini"],
      wantsMcp: false,
      wantsAutomation: true,
    },
  },
  {
    id: "clinic-app",
    icon: <HeartPulse className="h-6 w-6" />,
    title: "Clinic App",
    subtitle: "Appointments, intake, staff workflow",
    gradient: "from-red-500/10 to-cyan-500/10 hover:from-red-500/20 hover:to-cyan-500/20 border-red-200",
    input: {
      idea: "Clinic appointment and patient intake app for small clinics that need simple scheduling and staff status tracking.",
      targetUsers: "Clinic receptionists, doctors, and patients at small healthcare practices.",
      problem: "Appointments and intake forms are scattered across phone calls, paper forms, and spreadsheets.",
      desiredOutput: "Appointment workflow, patient intake form, staff dashboard, privacy checklist, and exportable visit summary.",
      appType: "Clinic app",
      timeline: "30 day product",
      skillLevel: "Builder",
      budgetSensitivity: "medium",
      preferredStack: ["Next.js", "Supabase", "RLS"],
      apiProviders: [],
      wantsMcp: true,
      wantsAutomation: false,
    },
  },
  {
    id: "local-business",
    icon: <MapPin className="h-6 w-6" />,
    title: "Local Business",
    subtitle: "Bookings and owner operations",
    gradient: "from-lime-500/10 to-emerald-500/10 hover:from-lime-500/20 hover:to-emerald-500/20 border-lime-200",
    input: {
      idea: "Booking and request management app for a local service business with customer requests, owner status updates, and CSV export.",
      targetUsers: "Local service business owners and customers booking appointments from mobile.",
      problem: "Owners lose requests across messages, calls, and paper notes.",
      desiredOutput: "Mobile booking flow, owner dashboard, request status tracker, and CSV export.",
      appType: "Local business app",
      timeline: "7 day build",
      skillLevel: "Non-coder",
      budgetSensitivity: "high",
      preferredStack: ["Next.js", "Supabase later"],
      apiProviders: [],
      wantsMcp: false,
      wantsAutomation: true,
    },
  },
  {
    id: "marketplace",
    icon: <Store className="h-6 w-6" />,
    title: "Marketplace",
    subtitle: "Listings, inquiry, moderation",
    gradient: "from-indigo-500/10 to-violet-500/10 hover:from-indigo-500/20 hover:to-violet-500/20 border-indigo-200",
    input: {
      idea: "Niche marketplace for local vendors to list services and receive customer inquiries with admin moderation.",
      targetUsers: "Local vendors, customers searching for trusted providers, and marketplace admins.",
      problem: "Customers cannot compare trusted local vendors, and vendors rely on manual messages for discovery.",
      desiredOutput: "Listing creation, search and filter, inquiry flow, moderation queue, and no-payment MVP plan.",
      appType: "Marketplace",
      timeline: "30 day product",
      skillLevel: "Builder",
      budgetSensitivity: "medium",
      preferredStack: ["Next.js", "Supabase", "shadcn/ui"],
      apiProviders: [],
      wantsMcp: true,
      wantsAutomation: false,
    },
  },
  {
    id: "ai-tool",
    icon: <Bot className="h-6 w-6" />,
    title: "AI Tool",
    subtitle: "Prompted generation with fallback",
    gradient: "from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border-cyan-200",
    input: {
      idea: "AI assistant tool that turns messy notes into structured briefs, tasks, and exportable implementation plans.",
      targetUsers: "Solo builders, freelancers, and small teams planning software projects.",
      problem: "Raw notes are hard to turn into clear tasks a coding agent can execute.",
      desiredOutput: "Structured brief, task list, API plan, handoff prompt, and exportable project files.",
      appType: "AI tool",
      timeline: "7 day build",
      skillLevel: "Builder",
      budgetSensitivity: "high",
      preferredStack: ["Next.js", "Zod", "localStorage"],
      apiProviders: ["OpenRouter", "Gemini"],
      wantsMcp: true,
      wantsAutomation: false,
    },
  },
];

type TemplateGalleryProps = {
  onSelect: (input: Partial<ProjectInput>) => void;
};

export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-zinc-700">
        Quick start - pick a template or describe your own idea below
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.input)}
            className="group rounded-lg border border-zinc-200 bg-white p-3 text-left transition hover:border-teal-300 hover:bg-teal-50/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-teal-200 group-hover:bg-white group-hover:text-teal-800">
                {tpl.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-900">{tpl.title}</div>
                <div className="mt-0.5 text-xs leading-4 text-zinc-600">{tpl.subtitle}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
