-- Update plans table to match Eterna pricing
UPDATE public.plans SET 
  monthly_price_brl = 29.00,
  monthly_price_usd = 5.99,
  limits = '{"messages_per_month": 300, "tts_seconds_per_month": 900}'::jsonb
WHERE plan_id = 'paid';

UPDATE public.plans SET
  limits = '{"messages_per_month": 5, "tts_seconds_per_month": 60}'::jsonb  
WHERE plan_id = 'free';

-- Add language support to user_settings
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS ui_language TEXT DEFAULT 'en' CHECK (ui_language IN ('en', 'pt-BR', 'es'));

-- Update voices_base table for ElevenLabs base voices
TRUNCATE TABLE public.voices_base;
INSERT INTO public.voices_base (voice_key, provider, gender, lang_supported, style_tags, default_params) VALUES
('9BWtsMINqrJLrRacOk9x', 'elevenlabs', 'female', ARRAY['en'], ARRAY['warm', 'conversational'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}}'),
('CwhRBWXzGAHq8TQ4Fs17', 'elevenlabs', 'male', ARRAY['en'], ARRAY['mature', 'authoritative'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.6, "similarity_boost": 0.7}}'),
('EXAVITQu4vr4xnSDxMaL', 'elevenlabs', 'female', ARRAY['en'], ARRAY['professional', 'clear'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}}'),
('FGY2WhTYpPnrIDTdsKH5', 'elevenlabs', 'female', ARRAY['en'], ARRAY['gentle', 'storytelling'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.4, "similarity_boost": 0.8}}'),
('IKne3meq5aSn9XLyUdCD', 'elevenlabs', 'male', ARRAY['en'], ARRAY['friendly', 'casual'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}}');

-- Add multilingual voices for pt-BR and es
INSERT INTO public.voices_base (voice_key, provider, gender, lang_supported, style_tags, default_params) VALUES
('9BWtsMINqrJLrRacOk9x', 'elevenlabs', 'female', ARRAY['pt-BR'], ARRAY['warm', 'conversational'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}}'),
('CwhRBWXzGAHq8TQ4Fs17', 'elevenlabs', 'male', ARRAY['pt-BR'], ARRAY['mature', 'authoritative'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.6, "similarity_boost": 0.7}}'),
('9BWtsMINqrJLrRacOk9x', 'elevenlabs', 'female', ARRAY['es'], ARRAY['warm', 'conversational'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}}'),
('CwhRBWXzGAHq8TQ4Fs17', 'elevenlabs', 'male', ARRAY['es'], ARRAY['mature', 'authoritative'], '{"model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.6, "similarity_boost": 0.7}}');

-- Create waitlist table for voice clone capacity
CREATE TABLE IF NOT EXISTS public.voice_clone_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notified_at TIMESTAMPTZ,
  UNIQUE(user_id, language)
);

-- Enable RLS
ALTER TABLE public.voice_clone_waitlist ENABLE ROW LEVEL SECURITY;

-- Policies for waitlist
CREATE POLICY "Users can view their waitlist entries" ON public.voice_clone_waitlist
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their waitlist entries" ON public.voice_clone_waitlist  
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their waitlist entries" ON public.voice_clone_waitlist
FOR DELETE USING (auth.uid() = user_id);