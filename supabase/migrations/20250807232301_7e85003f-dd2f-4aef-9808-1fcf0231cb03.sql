-- 1) Core tables for Hybrid TTS + LLM MVP
-- Use UUIDs and enable RLS everywhere. Avoid FKs to auth.users; use RLS for ownership.

-- voices_base: reusable base voices (publicly readable)
CREATE TABLE IF NOT EXISTS public.voices_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  voice_key TEXT NOT NULL,
  gender TEXT,
  style_tags TEXT[],
  lang_supported TEXT[],
  default_params JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- user_settings: per-user language, plan, preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY,
  ui_language TEXT NOT NULL DEFAULT 'en',
  preferred_base_voice_id UUID REFERENCES public.voices_base(id),
  param_overrides JSONB,
  plan_id TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- user_voice_assets: stored and instant clones per user
CREATE TABLE IF NOT EXISTS public.user_voice_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('clone_stored','instant_temp')),
  provider_id TEXT,
  lang TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One stored clone per user/lang
CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_clone_per_lang
ON public.user_voice_assets(user_id, type, lang)
WHERE type = 'clone_stored';

-- usage_counters: track per-user monthly usage
CREATE TABLE IF NOT EXISTS public.usage_counters (
  user_id UUID NOT NULL,
  period TEXT NOT NULL,
  messages_used INT NOT NULL DEFAULT 0,
  tts_seconds_used INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, period)
);

-- plans: pricing and limits (publicly readable)
CREATE TABLE IF NOT EXISTS public.plans (
  plan_id TEXT PRIMARY KEY,
  monthly_price_brl NUMERIC,
  monthly_price_usd NUMERIC,
  limits JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- cost_inputs: admin-only costs and margin target
CREATE TABLE IF NOT EXISTS public.cost_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  openai_per_1k_tokens NUMERIC,
  elevenlabs_per_min NUMERIC,
  hosting_per_user_month NUMERIC,
  target_margin_pct NUMERIC NOT NULL DEFAULT 40,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- config: key/value flags (publicly readable)
CREATE TABLE IF NOT EXISTS public.config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- Attach triggers
DROP TRIGGER IF EXISTS trg_vox_base_updated ON public.voices_base;
CREATE TRIGGER trg_vox_base_updated
BEFORE UPDATE ON public.voices_base
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_settings_updated ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_usage_counters_updated ON public.usage_counters;
CREATE TRIGGER trg_usage_counters_updated
BEFORE UPDATE ON public.usage_counters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_plans_updated ON public.plans;
CREATE TRIGGER trg_plans_updated
BEFORE UPDATE ON public.plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_cost_inputs_updated ON public.cost_inputs;
CREATE TRIGGER trg_cost_inputs_updated
BEFORE UPDATE ON public.cost_inputs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_config_updated ON public.config;
CREATE TRIGGER trg_config_updated
BEFORE UPDATE ON public.config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.voices_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_voice_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- voices_base: public read
DROP POLICY IF EXISTS "voices_base are publicly readable" ON public.voices_base;
CREATE POLICY "voices_base are publicly readable"
ON public.voices_base FOR SELECT USING (true);

-- user_settings: owner full access
DROP POLICY IF EXISTS "Users can view their settings" ON public.user_settings;
CREATE POLICY "Users can view their settings" ON public.user_settings
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert their settings" ON public.user_settings;
CREATE POLICY "Users can upsert their settings" ON public.user_settings
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their settings" ON public.user_settings;
CREATE POLICY "Users can update their settings" ON public.user_settings
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their settings" ON public.user_settings;
CREATE POLICY "Users can delete their settings" ON public.user_settings
FOR DELETE USING (auth.uid() = user_id);

-- user_voice_assets: owner full access
DROP POLICY IF EXISTS "Users can view their voice assets" ON public.user_voice_assets;
CREATE POLICY "Users can view their voice assets" ON public.user_voice_assets
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their voice assets" ON public.user_voice_assets;
CREATE POLICY "Users can create their voice assets" ON public.user_voice_assets
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their voice assets" ON public.user_voice_assets;
CREATE POLICY "Users can update their voice assets" ON public.user_voice_assets
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their voice assets" ON public.user_voice_assets;
CREATE POLICY "Users can delete their voice assets" ON public.user_voice_assets
FOR DELETE USING (auth.uid() = user_id);

-- usage_counters: owner read/update/insert
DROP POLICY IF EXISTS "Users can view their usage" ON public.usage_counters;
CREATE POLICY "Users can view their usage" ON public.usage_counters
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their usage row" ON public.usage_counters;
CREATE POLICY "Users can insert their usage row" ON public.usage_counters
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their usage" ON public.usage_counters;
CREATE POLICY "Users can update their usage" ON public.usage_counters
FOR UPDATE USING (auth.uid() = user_id);

-- plans: public read
DROP POLICY IF EXISTS "plans are publicly readable" ON public.plans;
CREATE POLICY "plans are publicly readable"
ON public.plans FOR SELECT USING (true);

-- cost_inputs: admin only (no public policies)
-- config: public read
DROP POLICY IF EXISTS "config is publicly readable" ON public.config;
CREATE POLICY "config is publicly readable"
ON public.config FOR SELECT USING (true);

-- Seed defaults (idempotent)
INSERT INTO public.config (key, value) VALUES
  ('max_stored_clones_total','30'),
  ('allow_instant_clone','false'),
  ('max_stored_clones_per_user_per_lang','1'),
  ('llm_free','gpt-oss-20b'),
  ('llm_paid','gpt-4o'),
  ('target_margin_pct','40'),
  ('ui_default_language','en')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.plans (plan_id, monthly_price_brl, monthly_price_usd, limits)
VALUES
  ('free', 0, 0, '{"max_messages":5, "max_tts_seconds":60, "features":["basic"]}'),
  ('paid', 29, 5.99, '{"max_messages":300, "max_tts_seconds":900, "features":["voice_personalization","priority_support"]}')
ON CONFLICT (plan_id) DO UPDATE SET
  monthly_price_brl = EXCLUDED.monthly_price_brl,
  monthly_price_usd = EXCLUDED.monthly_price_usd,
  limits = EXCLUDED.limits,
  updated_at = now();

-- Seed a few ElevenLabs base voices (public examples)
INSERT INTO public.voices_base (provider, voice_key, gender, style_tags, lang_supported, default_params)
VALUES
  ('elevenlabs','9BWtsMINqrJLrRacOk9x','female', ARRAY['warm','natural'], ARRAY['en','pt-BR','es'], '{"stability":0.5, "similarityBoost":0.75, "style":0.3, "useSpeakerBoost":true}'), -- Aria
  ('elevenlabs','EXAVITQu4vr4xnSDxMaL','female', ARRAY['clear','friendly'], ARRAY['en','pt-BR','es'], '{"stability":0.5, "similarityBoost":0.7, "style":0.25, "useSpeakerBoost":true}'), -- Sarah
  ('elevenlabs','N2lVS1w4EtoT3dr4eOWO','male', ARRAY['calm','clear'], ARRAY['en','pt-BR','es'], '{"stability":0.55, "similarityBoost":0.7, "style":0.2, "useSpeakerBoost":true}') -- Callum
ON CONFLICT DO NOTHING;

-- Helper function: ensure usage row for a given period
CREATE OR REPLACE FUNCTION public.ensure_usage_row(p_user_id uuid, p_period text)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.usage_counters(user_id, period)
  VALUES (p_user_id, p_period)
  ON CONFLICT (user_id, period) DO NOTHING;
END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Optional: monthly scheduler (no-op if pg_cron missing)
CREATE OR REPLACE FUNCTION public.schedule_monthly_usage_rollover()
RETURNS void AS $$
BEGIN
  PERFORM cron.schedule('usage-rollover', '0 0 1 * *', $$
    INSERT INTO public.config(key, value) VALUES('last_rollover', to_char(now(),'YYYY-MM'))
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  $$);
EXCEPTION WHEN OTHERS THEN NULL;
END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
