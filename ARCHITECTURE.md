# Architecture

## System Overview

```mermaid
graph TB
    subgraph Client["Browser (Client)"]
        UI["React UI<br/>shadcn/ui + Tailwind"]
        LS["localStorage<br/>(projects, providers, MCP)"]
        UI --> LS
    end

    subgraph Server["Next.js Server"]
        API["API Routes<br/>/api/generate-kit<br/>/api/regenerate-section<br/>/api/improve-section<br/>/api/health"]
        SG["Server Generator<br/>(multi-provider)"]
        RL["Rate Limiter<br/>(in-memory)"]
        VAL["Zod Validation"]
        API --> RL --> VAL --> SG
    end

    subgraph Providers["AI Providers"]
        OAI["OpenAI / OpenRouter"]
        GEM["Google Gemini"]
        ANT["Anthropic Claude"]
        OLL["Ollama (local)"]
    end

    subgraph Cloud["Supabase (optional)"]
        AUTH["Auth"]
        DB["PostgreSQL<br/>(RLS-secured)"]
    end

    UI -->|"demo mode"| UI
    UI -->|"provider mode"| API
    SG --> OAI & GEM & ANT & OLL
    UI -.->|"cloud sync"| AUTH --> DB
```

## Data Flow

### Demo Mode (Default)
1. User fills builder form
2. `generator.ts` generates a deterministic kit using templates + repo data
3. Kit is saved to localStorage
4. User browses sections, exports files

### Provider Mode
1. User fills builder form
2. Client calls `/api/generate-kit` with input + provider config (from localStorage)
3. Server validates with Zod, checks rate limit
4. `server-generator.ts` calls the AI provider
5. Response is parsed, validated, and returned
6. Kit is saved to localStorage (or Supabase if authenticated)

### Cloud Sync (Optional)
1. User authenticates via Supabase Auth
2. `useProjectStore` switches from localStorage to cloud store
3. Projects CRUD goes through `cloud-store.ts` → Supabase
4. RLS policies enforce owner-only access
5. API keys remain in localStorage (never synced to cloud)

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Local-first** | App must work without accounts, API keys, or internet |
| **API keys in localStorage only** | Security: never stored in database or env files |
| **Server-side AI calls** | Prevents API key exposure in browser network tab |
| **Demo mode fallback** | Every feature works without provider configuration |
| **Per-section editing** | Workspace model allows granular review and approval |
| **In-memory rate limiting** | Simple, no Redis needed for single-instance deployment |
| **Zod validation everywhere** | Type-safe input/output at API boundaries |

## Module Dependencies

```mermaid
graph LR
    subgraph Pages
        P1["/"] --> BF["BuilderForm"]
        P2["/projects"] --> PHL["ProjectHistoryList"]
        P3["/projects/id"] --> PDC["ProjectDetailClient"]
        P4["/repo-map"] --> RM["RepoMapPage"]
        P5["/settings"] --> SP["SettingsPage"]
    end

    subgraph Lib
        GEN["generator.ts"]
        SGEN["server-generator.ts"]
        EXP["export.ts"]
        SW["section-workspace.ts"]
        STORE["use-project-store.ts"]
        CLOUD["cloud-store.ts"]
        STORAGE["storage.ts"]
        VALID["validation.ts"]
    end

    BF --> GEN & STORE
    PDC --> STORE & SW
    PHL --> STORE
    SGEN --> GEN & VALID
    STORE --> STORAGE & CLOUD
```
