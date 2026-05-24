-- VibeForge Phase 2: Supabase Schema & RLS
-- Run this migration in the Supabase SQL editor or via supabase db push.

-- ===========================================================================
-- 1. profiles
-- ===========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===========================================================================
-- 2. projects
-- ===========================================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  input_json jsonb not null default '{}'::jsonb,
  sections_json jsonb not null default '{}'::jsonb,
  section_status_json jsonb,
  favorites_json jsonb,
  readiness_json jsonb,
  repo_recommendations_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_opened_at timestamptz
);

alter table public.projects enable row level security;

create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_updated_at on public.projects(updated_at desc);

-- ===========================================================================
-- 3. project_versions
-- ===========================================================================
create table if not exists public.project_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  section_key text,
  content text,
  change_note text,
  created_at timestamptz default now()
);

alter table public.project_versions enable row level security;

create policy "Users can view own versions"
  on public.project_versions for select
  using (auth.uid() = user_id);

create policy "Users can insert own versions"
  on public.project_versions for insert
  with check (auth.uid() = user_id);

create index if not exists idx_versions_project_id on public.project_versions(project_id);

-- ===========================================================================
-- 4. provider_profiles
-- ===========================================================================
create table if not exists public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_name text,
  provider_type text,
  base_url text,
  default_model text,
  cheap_model text,
  strong_model text,
  vision_model text,
  token_limit integer,
  temperature numeric,
  enabled boolean default true,
  created_at timestamptz default now()
  -- NOTE: No api_key column. API keys stay in localStorage only.
);

alter table public.provider_profiles enable row level security;

create policy "Users can view own provider profiles"
  on public.provider_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own provider profiles"
  on public.provider_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own provider profiles"
  on public.provider_profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete own provider profiles"
  on public.provider_profiles for delete
  using (auth.uid() = user_id);

-- ===========================================================================
-- 5. mcp_connections
-- ===========================================================================
create table if not exists public.mcp_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  type text,
  command_or_url text,
  environment_variables text,
  status text,
  notes text,
  created_at timestamptz default now()
);

alter table public.mcp_connections enable row level security;

create policy "Users can view own mcp connections"
  on public.mcp_connections for select
  using (auth.uid() = user_id);

create policy "Users can insert own mcp connections"
  on public.mcp_connections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mcp connections"
  on public.mcp_connections for update
  using (auth.uid() = user_id);

create policy "Users can delete own mcp connections"
  on public.mcp_connections for delete
  using (auth.uid() = user_id);
