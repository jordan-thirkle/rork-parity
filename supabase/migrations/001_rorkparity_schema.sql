-- RorkParity Phase 2 — Database Schema
-- Applies to: Supabase Postgres project xuwfpcogphhrkagwgzpf

-- ==============================
-- USERS (extends Supabase Auth)
-- ==============================
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE,
  display_name    TEXT,
  avatar_url      TEXT,
  plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'creator', 'studio')),
  credit_balance  INTEGER NOT NULL DEFAULT 35,
  total_generated INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    LOWER(SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================
-- GAME PROJECTS
-- ==============================
CREATE TABLE IF NOT EXISTS public.game_projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL DEFAULT 'Untitled Game',
  slug            TEXT,
  description     TEXT DEFAULT '',
  engine          TEXT NOT NULL DEFAULT 'phaser-3' CHECK (engine IN ('phaser-3', 'three-js', 'canvas-2d')),
  viewport_target TEXT NOT NULL DEFAULT 'desktop' CHECK (viewport_target IN ('desktop', 'mobile', 'tablet', 'vr')),
  zone_count      INTEGER NOT NULL DEFAULT 0,
  has_combat      BOOLEAN NOT NULL DEFAULT false,
  has_leveling    BOOLEAN NOT NULL DEFAULT false,
  tags            TEXT[] DEFAULT '{}',
  generation_count INTEGER NOT NULL DEFAULT 0,
  version         INTEGER NOT NULL DEFAULT 1,
  current_game_id UUID,
  thumbnail_url   TEXT,
  is_public       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================
-- GAME VERSIONS
-- ==============================
CREATE TABLE IF NOT EXISTS public.game_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES public.game_projects(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  commit_hash     TEXT,
  commit_message  TEXT DEFAULT 'Initial version',
  spec            JSONB,
  code_text       TEXT DEFAULT '',
  html_url        TEXT,
  file_size       INTEGER NOT NULL DEFAULT 0,
  validation_pass BOOLEAN,
  validation_log  JSONB,
  credits_spent   INTEGER NOT NULL DEFAULT 1,
  source          TEXT NOT NULL DEFAULT 'agent' CHECK (source IN ('agent', 'file-import', 'template')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, version_number)
);

-- Add FK from projects to latest version
ALTER TABLE public.game_projects DROP CONSTRAINT IF EXISTS fk_current_game;
ALTER TABLE public.game_projects
  ADD CONSTRAINT fk_current_game
  FOREIGN KEY (current_game_id) REFERENCES public.game_versions(id) ON DELETE SET NULL;

-- ==============================
-- ASSETS
-- ==============================
CREATE TABLE IF NOT EXISTS public.assets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID REFERENCES public.game_projects(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  filename        TEXT NOT NULL,
  file_type       TEXT NOT NULL,
  file_size       INTEGER NOT NULL DEFAULT 0,
  storage_url     TEXT NOT NULL,
  asset_category  TEXT NOT NULL CHECK (asset_category IN ('sprite', 'tilemap', 'sound', 'music', 'model', 'font', 'data')),
  width           INTEGER,
  height          INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================
-- CREDIT LEDGER
-- ==============================
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  change          INTEGER NOT NULL,
  balance_after   INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  reference_type  TEXT CHECK (reference_type IN ('generation', 'purchase', 'grant', 'refund', 'reset')),
  reference_id    UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================
-- LEADERBOARDS
-- ==============================
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES public.game_projects(id) ON DELETE CASCADE,
  player_name     TEXT NOT NULL,
  score           BIGINT NOT NULL,
  level_reached   INTEGER DEFAULT 1,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_project_score
  ON public.leaderboard_entries (project_id, score DESC);

-- ==============================
-- ROW LEVEL SECURITY
-- ==============================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/update their own
CREATE POLICY profile_owner_select ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY profile_owner_update ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects: owner has full access; public projects readable by anyone
CREATE POLICY project_owner_all ON public.game_projects
  FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY project_public_read ON public.game_projects
  FOR SELECT USING (is_public = true);

-- Versions: owner via project
CREATE POLICY version_owner_read ON public.game_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.game_projects WHERE id = project_id AND owner_id = auth.uid())
  );
CREATE POLICY version_owner_insert ON public.game_versions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.game_projects WHERE id = project_id AND owner_id = auth.uid())
  );

-- Assets: owner only
CREATE POLICY asset_owner_all ON public.assets
  FOR ALL USING (auth.uid() = owner_id);

-- Credits: owner only
CREATE POLICY credit_owner_select ON public.credit_ledger
  FOR SELECT USING (auth.uid() = user_id);

-- Leaderboards: public insert + read
CREATE POLICY leaderboard_read_all ON public.leaderboard_entries
  FOR SELECT USING (true);
CREATE POLICY leaderboard_insert_all ON public.leaderboard_entries
  FOR INSERT WITH CHECK (true);

-- ==============================
-- FUNCTIONS
-- ==============================

-- Consume credits and record ledger entry
CREATE OR REPLACE FUNCTION public.consume_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_ref_type TEXT,
  p_ref_id UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT credit_balance INTO v_balance FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits: have %, need %', v_balance, p_amount;
  END IF;

  UPDATE public.profiles SET
    credit_balance = credit_balance - p_amount,
    total_generated = total_generated + 1,
    updated_at = now()
  WHERE id = p_user_id
  RETURNING credit_balance INTO v_balance;

  INSERT INTO public.credit_ledger (user_id, change, balance_after, reason, reference_type, reference_id)
  VALUES (p_user_id, -p_amount, v_balance, p_reason, p_ref_type, p_ref_id);

  RETURN v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Init leaderboard for a project
CREATE OR REPLACE FUNCTION public.submit_score(
  p_project_id UUID,
  p_player_name TEXT,
  p_score BIGINT,
  p_level INTEGER DEFAULT 1,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.leaderboard_entries (project_id, player_name, score, level_reached, metadata)
  VALUES (p_project_id, p_player_name, p_score, p_level, p_metadata)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
