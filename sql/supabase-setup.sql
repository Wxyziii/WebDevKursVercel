-- ========================================
-- SUPABASE DATABASE SETUP
-- ========================================
-- Kjør dette i Supabase SQL Editor (Database → SQL Editor)

-- 1. USERS TABLE
create table if not exists public.users (
    id uuid references auth.users(id) primary key,
    name text not null,
    email text unique not null,
    is_admin boolean default false,
    part1_completed boolean default false,
    part2_completed boolean default false,
    is_flagged boolean default false,
    flag_reason text,
    created_at timestamp with time zone default now()
);

-- 2. COMPLETIONS TABLE (Leaderboard)
create table if not exists public.completions (
    id bigint generated always as identity primary key,
    user_id uuid references public.users(id) on delete cascade,
    part1_time integer,
    part2_time integer,
    total_time integer,
    is_flagged boolean default false,
    flag_reason text,
    cheat_score integer default 0,
    completed_at timestamp with time zone default now()
);

-- 3. PROJECTS TABLE (Gallery)
create table if not exists public.projects (
    id bigint generated always as identity primary key,
    user_id uuid references public.users(id) on delete cascade,
    title text not null,
    html text not null,
    css text not null,
    js text,
    part integer not null,
    is_public boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone
);

-- 4. ACTIVITY TABLE (Cheat detection)
create table if not exists public.activity (
    id bigint generated always as identity primary key,
    user_id uuid references public.users(id) on delete cascade,
    session_id text not null,
    activity_type text not null,
    data jsonb,
    timestamp timestamp with time zone default now()
);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.completions enable row level security;
alter table public.projects enable row level security;
alter table public.activity enable row level security;

-- USERS policies
create policy "Users can view all users" on public.users
    for select using (true);

create policy "Users can insert their own profile" on public.users
    for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.users
    for update using (auth.uid() = id);

create policy "Admins can delete users" on public.users
    for delete using (
        exists (
            select 1 from public.users 
            where id = auth.uid() and is_admin = true
        )
    );

-- COMPLETIONS policies
create policy "Anyone can view completions" on public.completions
    for select using (true);

create policy "Users can insert their own completion" on public.completions
    for insert with check (auth.uid() = user_id);

create policy "Admins can delete completions" on public.completions
    for delete using (
        exists (
            select 1 from public.users 
            where id = auth.uid() and is_admin = true
        )
    );

-- PROJECTS policies
create policy "Anyone can view public projects" on public.projects
    for select using (is_public = true or auth.uid() = user_id);

create policy "Users can insert their own projects" on public.projects
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on public.projects
    for update using (auth.uid() = user_id);

create policy "Users and admins can delete projects" on public.projects
    for delete using (
        auth.uid() = user_id or
        exists (
            select 1 from public.users 
            where id = auth.uid() and is_admin = true
        )
    );

-- ACTIVITY policies
create policy "Users can insert their own activity" on public.activity
    for insert with check (auth.uid() = user_id);

create policy "Users can view their own activity" on public.activity
    for select using (auth.uid() = user_id);

-- ========================================
-- INDEXES for better performance
-- ========================================

create index if not exists idx_completions_total_time on public.completions(total_time);
create index if not exists idx_completions_user_id on public.completions(user_id);
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_is_public on public.projects(is_public);
create index if not exists idx_activity_user_id on public.activity(user_id);
create index if not exists idx_activity_session_id on public.activity(session_id);
