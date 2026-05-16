-- Handcraft — initial schema
-- Run via: supabase db push
-- DO NOT run manually; apply through Supabase CLI migrations.

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── users ─────────────────────────────────────────────────────────────────────
create table if not exists users (
  id              uuid primary key default uuid_generate_v4(),
  handle          text not null unique,
  role            text not null,         -- M3 | M4 | Intern | PGY-2 … Fellow | Attending
  specialty       text not null,         -- Plastic Surgery | Orthopaedic Surgery | Emergency Med | Other
  on_hand_service boolean not null default false,
  primary_goal    text not null,
  comfort_jsonb   jsonb not null default '{}', -- { anatomy: 1-5, trauma: 1-5, … }
  created_at      timestamptz not null default now()
);

-- ── sessions ──────────────────────────────────────────────────────────────────
create table if not exists sessions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references users(id) on delete cascade,
  mode         text not null,   -- tutor | case | pimping | preop | debrief | consult
  started_at   timestamptz not null default now(),
  ended_at     timestamptz,
  summary_jsonb jsonb
);

-- ── messages ──────────────────────────────────────────────────────────────────
create table if not exists messages (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid not null references sessions(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  citations_jsonb jsonb,
  confidence      numeric check (confidence between 0 and 100),
  created_at      timestamptz not null default now()
);

-- ── cases ─────────────────────────────────────────────────────────────────────
create table if not exists cases (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  stem        text not null,
  cards_jsonb jsonb not null default '{}',
  difficulty  text not null default 'intermediate' check (difficulty in ('intro', 'intermediate', 'advanced')),
  tags        text[] not null default '{}',
  author      text not null default 'Handcraft seed',
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── case_attempts ─────────────────────────────────────────────────────────────
create table if not exists case_attempts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references users(id) on delete cascade,
  case_id         uuid not null references cases(id) on delete cascade,
  transcript_jsonb jsonb not null default '[]',
  score           numeric,
  completed_at    timestamptz not null default now()
);

-- ── pearls ────────────────────────────────────────────────────────────────────
create table if not exists pearls (
  id          uuid primary key default uuid_generate_v4(),
  content     text not null,
  attribution text not null default 'Hand service',
  tags        text[] not null default '{}',
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── pearl_unlocks ─────────────────────────────────────────────────────────────
create table if not exists pearl_unlocks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references users(id) on delete cascade,
  pearl_id    uuid not null references pearls(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique(user_id, pearl_id)
);

-- ── kb_chunks ─────────────────────────────────────────────────────────────────
-- Note: vector column added in 0002_pgvector.sql once pgvector extension is enabled.
create table if not exists kb_chunks (
  id          uuid primary key default uuid_generate_v4(),
  content     text not null,
  source      text not null,
  source_type text not null default 'markdown',
  verified    boolean not null default false
);

-- ── streaks ───────────────────────────────────────────────────────────────────
create table if not exists streaks (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references users(id) on delete cascade,
  question_ring integer not null default 0,
  case_ring     integer not null default 0,
  review_ring   integer not null default 0,
  date          date not null default current_date,
  unique(user_id, date)
);

-- ── flags ─────────────────────────────────────────────────────────────────────
create table if not exists flags (
  id          uuid primary key default uuid_generate_v4(),
  message_id  uuid not null references messages(id) on delete cascade,
  user_id     uuid not null references users(id) on delete cascade,
  reason      text,
  status      text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved')),
  reviewed_by uuid references users(id),
  reviewed_at timestamptz
);

-- ── leaderboards ──────────────────────────────────────────────────────────────
create table if not exists leaderboards (
  id               uuid primary key default uuid_generate_v4(),
  scope            text not null check (scope in ('program', 'pgy', 'national')),
  period           text not null,   -- e.g. '2025-W22'
  jsonb_rankings   jsonb not null default '[]',
  opt_in_user_ids  uuid[] not null default '{}'
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists messages_session_id_idx    on messages(session_id);
create index if not exists case_attempts_user_id_idx  on case_attempts(user_id);
create index if not exists pearl_unlocks_user_id_idx  on pearl_unlocks(user_id);
create index if not exists flags_status_idx           on flags(status);
create index if not exists streaks_user_date_idx      on streaks(user_id, date);
