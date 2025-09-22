-- Hybrid TTS/LLM MVP: indices, seeds, and base voices
-- 1) Unique stored clone per user/lang (partial index)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_clone_per_lang 
ON public.user_voice_assets (user_id, lang) 
WHERE type = 'clone_stored';

-- 2) Index for counting global stored clones
CREATE INDEX IF NOT EXISTS user_voice_assets_type_idx 
ON public.user_voice_assets (type);

-- 3) Ensure monthly usage uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS usage_unique_user_period 
ON public.usage_counters (user_id, period);

-- 4) Seed/Upsert plans with limits
INSERT INTO public.plans (plan_id, monthly_price_brl, monthly_price_usd, limits)
VALUES 
  ('free', 0, 0, '{"max_messages":5,"max_tts_seconds":60,"features":["base_voice"]}'),
  ('paid', 29, 5.99, '{"max_messages":300,"max_tts_seconds":900,"features":["base_voice","personal_voice","priority_support"]}')
ON CONFLICT (plan_id) DO UPDATE 
SET monthly_price_brl = EXCLUDED.monthly_price_brl,
    monthly_price_usd = EXCLUDED.monthly_price_usd,
    limits = EXCLUDED.limits;

-- 5) Seed/Upsert config flags
INSERT INTO public.config (key, value) VALUES
  ('max_stored_clones_total','30'),
  ('allow_instant_clone','false'),
  ('max_stored_clones_per_user_per_lang','1'),
  ('llm_free','gpt-oss-20b'),
  ('llm_paid','gpt-4o'),
  ('target_margin_pct','40'),
  ('ui_default_language','en')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6) Seed base voices if missing
-- Aria
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.voices_base WHERE voice_key = '9BWtsMINqrJLrRacOk9x') THEN
    INSERT INTO public.voices_base (provider, voice_key, gender, style_tags, lang_supported, default_params)
    VALUES ('elevenlabs', '9BWtsMINqrJLrRacOk9x', 'female', ARRAY['warm','clear','friendly'], ARRAY['en','pt-BR','es'], '{"stability":0.5,"similarity":0.75,"style":0.1}'::jsonb);
  END IF;
END $$;

-- Liam
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.voices_base WHERE voice_key = 'TX3LPaxmHKxFdv7VOQHJ') THEN
    INSERT INTO public.voices_base (provider, voice_key, gender, style_tags, lang_supported, default_params)
    VALUES ('elevenlabs', 'TX3LPaxmHKxFdv7VOQHJ', 'male', ARRAY['neutral','calm','balanced'], ARRAY['en','pt-BR','es'], '{"stability":0.6,"similarity":0.7,"style":0.1}'::jsonb);
  END IF;
END $$;

-- Sarah
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.voices_base WHERE voice_key = 'EXAVITQu4vr4xnSDxMaL') THEN
    INSERT INTO public.voices_base (provider, voice_key, gender, style_tags, lang_supported, default_params)
    VALUES ('elevenlabs', 'EXAVITQu4vr4xnSDxMaL', 'female', ARRAY['expressive','bright'], ARRAY['en','pt-BR','es'], '{"stability":0.45,"similarity":0.8,"style":0.15}'::jsonb);
  END IF;
END $$;

-- Charlotte
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.voices_base WHERE voice_key = 'XB0fDUnXU5powFXDhCwa') THEN
    INSERT INTO public.voices_base (provider, voice_key, gender, style_tags, lang_supported, default_params)
    VALUES ('elevenlabs', 'XB0fDUnXU5powFXDhCwa', 'female', ARRAY['warm','natural'], ARRAY['en','pt-BR','es'], '{"stability":0.55,"similarity":0.75,"style":0.1}'::jsonb);
  END IF;
END $$;

-- Daniel
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.voices_base WHERE voice_key = 'onwK4e9ZLuTAKqWW03F9') THEN
    INSERT INTO public.voices_base (provider, voice_key, gender, style_tags, lang_supported, default_params)
    VALUES ('elevenlabs', 'onwK4e9ZLuTAKqWW03F9', 'male', ARRAY['confident','rich'], ARRAY['en','pt-BR','es'], '{"stability":0.5,"similarity":0.78,"style":0.12}'::jsonb);
  END IF;
END $$;
