-- Step 0: Core data entities for Eterna consent-first memory system

-- Create persons table
CREATE TABLE public.persons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  consent_status TEXT NOT NULL DEFAULT 'none' CHECK (consent_status IN ('none', 'on_file', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voices table (enhanced)
CREATE TABLE public.eterna_voices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES public.persons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  model_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memories table
CREATE TABLE public.eterna_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES public.persons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('audio', 'image', 'postcard')),
  preview_url TEXT,
  media_url TEXT,
  transcript TEXT,
  mood_tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consents table
CREATE TABLE public.consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES public.persons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recorder TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('audio', 'written', 'signature')),
  consent_data JSONB, -- stores url or signature data
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create circles table
CREATE TABLE public.circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  members JSONB DEFAULT '[]', -- array of person_ids
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create circle_memberships table for roles
CREATE TABLE public.circle_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.persons(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('keeper', 'contributor', 'listener')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_logs table for analytics
CREATE TABLE public.event_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  payload_json JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_id TEXT, -- for non-authenticated users
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feature_flags table
CREATE TABLE public.feature_flags (
  key TEXT NOT NULL PRIMARY KEY,
  variant TEXT NOT NULL DEFAULT 'default',
  enabled BOOLEAN NOT NULL DEFAULT true,
  user_targeting JSONB DEFAULT '{}', -- user_id specific overrides
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_settings table (enhanced)
CREATE TABLE public.eterna_user_settings (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  panic_pause_enabled BOOLEAN NOT NULL DEFAULT false,
  preferred_language TEXT DEFAULT 'en',
  accessibility_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{"default_private": true}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eterna_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eterna_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eterna_user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for persons
CREATE POLICY "Users can view their own persons" ON public.persons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own persons" ON public.persons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own persons" ON public.persons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own persons" ON public.persons
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for eterna_voices
CREATE POLICY "Users can view their own voices" ON public.eterna_voices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voices" ON public.eterna_voices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voices" ON public.eterna_voices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voices" ON public.eterna_voices
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for eterna_memories
CREATE POLICY "Users can view their own memories" ON public.eterna_memories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories" ON public.eterna_memories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories" ON public.eterna_memories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories" ON public.eterna_memories
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for consents
CREATE POLICY "Users can view their own consents" ON public.consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consents" ON public.consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents" ON public.consents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consents" ON public.consents
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for circles
CREATE POLICY "Users can view their own circles" ON public.circles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own circles" ON public.circles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own circles" ON public.circles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own circles" ON public.circles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for circle_memberships
CREATE POLICY "Users can view memberships for their circles" ON public.circle_memberships
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.circles 
    WHERE circles.id = circle_memberships.circle_id 
    AND circles.user_id = auth.uid()
  ));

CREATE POLICY "Users can create memberships for their circles" ON public.circle_memberships
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.circles 
    WHERE circles.id = circle_memberships.circle_id 
    AND circles.user_id = auth.uid()
  ));

-- RLS Policies for event_logs
CREATE POLICY "Users can view their own events" ON public.event_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert events" ON public.event_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for feature_flags
CREATE POLICY "Feature flags are publicly readable" ON public.feature_flags
  FOR SELECT USING (true);

-- RLS Policies for eterna_user_settings
CREATE POLICY "Users can view their own settings" ON public.eterna_user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" ON public.eterna_user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.eterna_user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_persons_updated_at
  BEFORE UPDATE ON public.persons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eterna_voices_updated_at
  BEFORE UPDATE ON public.eterna_voices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eterna_memories_updated_at
  BEFORE UPDATE ON public.eterna_memories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_circles_updated_at
  BEFORE UPDATE ON public.circles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eterna_user_settings_updated_at
  BEFORE UPDATE ON public.eterna_user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default feature flags
INSERT INTO public.feature_flags (key, variant, enabled) VALUES
  ('FF_DEMO_LENGTH', 'long_45s', true),
  ('FF_RITUAL_COPY', 'create_memory', true),
  ('FF_CONSENT_BADGE_VIS', 'visible', true)
ON CONFLICT (key) DO NOTHING;