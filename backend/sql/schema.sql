-- Telemetry table for crop metrics
create table if not exists public.telemetry (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  soil_moisture numeric,
  ph numeric,
  growth numeric
);

-- Tips table for community messages
create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS and permissive read policies (MVP)
alter table public.telemetry enable row level security;
alter table public.tips enable row level security;

create policy if not exists "telemetry_select_anon"
  on public.telemetry for select using (true);

create policy if not exists "tips_select_anon"
  on public.tips for select using (true);

-- Enable Realtime (Supabase)
alter publication supabase_realtime add table public.telemetry;
alter publication supabase_realtime add table public.tips;
