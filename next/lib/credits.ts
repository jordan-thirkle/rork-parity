export const CREDITS_SCHEMA_SQL = `
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled Project',
  platform text not null default 'expo',
  status text not null default 'draft',
  latest_version text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance int not null default 0,
  plan text not null default 'free',
  reset_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount int not null,
  reason text not null,
  project_id uuid references public.projects(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.credits enable row level security;
alter table public.credit_transactions enable row level security;

create policy "Users can read own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

create policy "Users can read own credits" on public.credits for select using (auth.uid() = user_id);
create policy "Service role can insert credits" on public.credits for insert with check (false);

create policy "Users can read own transactions" on public.credit_transactions for select using (auth.uid() = user_id);
create policy "Service role can insert transactions" on public.credit_transactions for insert with check (false);

create or replace function public.add_credits(p_user_id uuid, p_amount int, p_reason text, p_project_id uuid default null, p_metadata jsonb default '{}'::jsonb)
returns void language plpgsql security definer as $$
begin
  insert into public.credits (user_id, balance, plan, reset_at, updated_at)
  values (p_user_id, greatest(0, p_amount), 'free', now(), now())
  on conflict (user_id) do update set balance = greatest(0, public.credits.balance + p_amount), updated_at = now();

  insert into public.credit_transactions (user_id, amount, reason, project_id, metadata)
  values (p_user_id, p_amount, p_reason, p_project_id, p_metadata);
end;
$$;

create or replace function public.deduct_credits(p_user_id uuid, p_amount int, p_reason text, p_project_id uuid default null, p_metadata jsonb default '{}'::jsonb)
returns boolean language plpgsql security definer as $$
declare
  v_balance int;
begin
  select balance into v_balance from public.credits where user_id = p_user_id for update;

  if v_balance is null then
    insert into public.credits (user_id, balance, plan, reset_at, updated_at)
    values (p_user_id, 0, 'free', now(), now());
    v_balance := 0;
  end if;

  if v_balance < p_amount then
    return false;
  end if;

  update public.credits set balance = v_balance - p_amount, updated_at = now() where user_id = p_user_id;

  insert into public.credit_transactions (user_id, amount, reason, project_id, metadata)
  values (p_user_id, -p_amount, p_reason, p_project_id, p_metadata);

  return true;
end;
$$;
`;

export interface CreditRecord {
  user_id: string;
  balance: number;
  plan: string;
  reset_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  project_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ProjectRecord {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  status: string;
  latest_version?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export async function getCreditBalance(supabase: { from: (table: string) => { select: (cols: string, args?: { count?: string; head?: boolean; columns?: string[]; distinct?: string | boolean; order?: { ascending: boolean }; limit?: number; offset?: number; range?: [number, number] | null; equals?: { [key: string]: string | number | boolean | null; }; like?: { [key: string]: string }; gt?: { [key: string]: string | number | boolean }; gte?: { [key: string]: string | number | boolean }; lt?: { [key: string]: string | number | boolean }; lte?: { [key: string]: string | number | boolean }; not?: { [key: string]: string | number | boolean | null; }; or?: string; in?: { [key: string]: (string | number | boolean | null)[] }; contains?: { [key: string]: string | number | boolean }; containedBy?: { [key: string]: string | number | boolean | null }; rangeGt?: { [key: string]: string | number | boolean }; rangeGte?: { [key: string]: string | number | boolean }; rangeLt?: { [key: string]: string | number | boolean }; rangeLte?: { [key: string]: string | number | boolean }; is?: { [key: string]: string | number | boolean | null }; fullText?: { [key: string]: string }; phrase?: { [key: string]: string }; query?: string; foreignTable?: string; referencedTable?: string; column?: string; keyColumn?: string; foreignKey?: string; referencedColumn?: string; references?: string; onConflict?: { constraint: string; columns?: string[]; upsert?: boolean; ignoreDuplicates?: boolean }; returning?: string; filter?: string; single?: boolean; head?: boolean; count?: 'exact' | 'planned' | 'estimated'; }) => { data: T[] | T | null; error: { message: string } | null; }; }) => Promise<{ data: CreditRecord | null; error: { message: string } | null }> }) {
  const { data, error } = await supabase
    .from('credits')
    .select('balance')
    .maybeSingle<CreditRecord>();

  if (error) throw new Error(error.message);
  return data?.balance ?? 0;
}

export async function deductCredits(supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: boolean | null; error: { message: string } | null }> }, userId: string, amount: number, reason: string, projectId?: string) {
  const { data, error } = await supabase.rpc('deduct_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_project_id: projectId ?? null,
    p_metadata: {},
  });

  if (error) throw new Error(error.message);
  return data ?? false;
}

export async function addCredits(supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ error: { message: string } | null }> }, userId: string, amount: number, reason: string, projectId?: string) {
  const { error } = await supabase.rpc('add_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_project_id: projectId ?? null,
    p_metadata: {},
  });

  if (error) throw new Error(error.message);
}
