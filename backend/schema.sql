-- backend/schema.sql
-- Phase 2 target. Not needed for Phase 1, but defined now so LOREKEEPER/CRIER
-- have a stable target to build toward once activated.

create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  genre text,
  stack text check (stack in ('threejs','phaser','godot-web')),
  current_code text,             -- latest single-file game or godot export ref
  scope_v1 jsonb,
  deferred jsonb,
  status text default 'draft',   -- draft | published | archived
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table generations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects not null,
  agent text not null,           -- forgemaster | smith | whetstone | lorekeeper | crier
  input jsonb,
  output jsonb,
  created_at timestamptz default now()
);

create table templates (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  genre text,
  stack text,
  systems jsonb,
  file_ref text,
  last_validated_date date
);

create table credits_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  delta integer not null,        -- negative = spend, positive = grant/purchase
  reason text,
  created_at timestamptz default now()
);
