# DEPLOYMENT_PLAN.md

## MVP Deployment
1. Deploy the Next.js app to Vercel.
2. Leave provider and Supabase environment variables empty for demo-only launch.
3. Confirm / opens the builder, not a landing page.
4. Generate one demo kit and export ZIP from production.
5. Confirm the localStorage warning is visible in Settings.

## Production Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PROVIDER_KEY_ENCRYPTION_SECRET=
RATE_LIMIT_MAX=
RATE_LIMIT_WINDOW_MS=
```

## Supabase Launch Path
- Create projects, project_versions, provider_profiles, generation_logs, and mcp_connections tables.
- Enable RLS and owner scoping before inviting users.
- Store provider keys only through server-owned provider profile routes.
- Keep localStorage fallback available when Supabase is not configured.

## Monitoring And Rollback
- Track generation success, provider failures, rate-limit events, and export errors.
- Roll back by disabling provider mode and keeping demo generation online.
- Do not block users from exporting existing local projects during provider outages.
