-- Immersio schema. Run this in the Supabase SQL editor for the shared
-- lukeswift.net project (Project > SQL Editor > New query).
--
-- Reuses the same anonymous-auth pattern as Budget-App: every browser gets
-- a stable anonymous auth.uid() via supabase.auth.signInAnonymously(), and
-- rows are scoped to that id with RLS. Tables are prefixed immersio_ so
-- they stay clearly separated from Budget-App's tables in the same project.

create table if not exists immersio_languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  color text not null default '#3b82f6',
  is_dormant boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists immersio_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  language_id uuid not null references immersio_languages(id) on delete cascade,
  activity text not null check (activity in ('listening','reading','speaking','writing','output','srs','grammar','other')),
  minutes integer not null check (minutes > 0),
  log_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

-- Query patterns are always scoped by user_id, then filtered/sorted by date
-- or grouped by language, so these are the two indexes that matter.
create index if not exists idx_immersio_logs_user_date on immersio_logs (user_id, log_date desc);
create index if not exists idx_immersio_logs_user_language on immersio_logs (user_id, language_id);
create index if not exists idx_immersio_languages_user on immersio_languages (user_id, position);

alter table immersio_languages enable row level security;
alter table immersio_logs enable row level security;

create policy "immersio_languages_owner" on immersio_languages
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "immersio_logs_owner" on immersio_logs
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
