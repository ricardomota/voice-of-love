-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS entitlements jsonb DEFAULT '{
  "chat_limit_monthly": 20,
  "voice_minutes_monthly": 0,
  "demo_seconds_total": 60,
  "demo_requires_onboarding": true,
  "generic_voices_enabled": false,
  "personalized_voice_enabled": false
}'::jsonb;

-- Update usage_counters to include demo usage
ALTER TABLE public.usage_counters ADD COLUMN IF NOT EXISTS free_demo_seconds_used integer DEFAULT 0;
ALTER TABLE public.usage_counters ADD COLUMN IF NOT EXISTS voice_seconds_used integer DEFAULT 0;
ALTER TABLE public.usage_counters ADD COLUMN IF NOT EXISTS chat_interactions_used integer DEFAULT 0;

-- Create voices table for personalized voice management
CREATE TABLE IF NOT EXISTS public.voices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('generic', 'personalized')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'archived')),
  eleven_voice_id text,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on voices table
ALTER TABLE public.voices ENABLE ROW LEVEL SECURITY;

-- Create policies for voices table
CREATE POLICY "Users can view their own voices" ON public.voices
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own voices" ON public.voices
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own voices" ON public.voices
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own voices" ON public.voices
FOR DELETE USING (user_id = auth.uid());

-- Create capacity table for slot management
CREATE TABLE IF NOT EXISTS public.capacity (
  id integer PRIMARY KEY DEFAULT 1,
  plan_name text NOT NULL DEFAULT 'starter',
  max_slots integer NOT NULL DEFAULT 30,
  buffer_slots integer NOT NULL DEFAULT 2,
  active_slots integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (id = 1) -- Ensure only one row
);

-- Insert initial capacity record
INSERT INTO public.capacity (id, plan_name, max_slots, buffer_slots, active_slots)
VALUES (1, 'starter', 30, 2, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on capacity table (admin only)
ALTER TABLE public.capacity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Capacity is viewable by authenticated users" ON public.capacity
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only service role can modify capacity" ON public.capacity
FOR ALL USING (auth.role() = 'service_role');

-- Update waitlist table to match spec
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS processed_at timestamptz;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS requested_at timestamptz DEFAULT now();
ALTER TABLE public.waitlist ALTER COLUMN status SET DEFAULT 'queued';

-- Create function to update voice capacity counters
CREATE OR REPLACE FUNCTION update_voice_capacity()
RETURNS trigger AS $$
BEGIN
  -- Update active_slots count in capacity table
  UPDATE public.capacity 
  SET 
    active_slots = (
      SELECT COUNT(*) 
      FROM public.voices 
      WHERE status = 'active' AND type = 'personalized'
    ),
    updated_at = now()
  WHERE id = 1;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update capacity when voices change
CREATE OR REPLACE TRIGGER voices_capacity_update
  AFTER INSERT OR UPDATE OR DELETE ON public.voices
  FOR EACH ROW
  EXECUTE FUNCTION update_voice_capacity();

-- Create function to compute entitlements based on plan
CREATE OR REPLACE FUNCTION compute_entitlements(user_plan text)
RETURNS jsonb AS $$
BEGIN
  CASE user_plan
    WHEN 'free' THEN
      RETURN '{
        "chat_limit_monthly": 20,
        "voice_minutes_monthly": 0,
        "demo_seconds_total": 60,
        "demo_requires_onboarding": true,
        "generic_voices_enabled": false,
        "personalized_voice_enabled": false
      }'::jsonb;
    WHEN 'essential' THEN
      RETURN '{
        "chat_limit_monthly": 200,
        "voice_minutes_monthly": 30,
        "demo_seconds_total": 0,
        "demo_requires_onboarding": false,
        "generic_voices_enabled": true,
        "personalized_voice_enabled": false
      }'::jsonb;
    WHEN 'complete' THEN
      RETURN '{
        "chat_limit_monthly": -1,
        "voice_minutes_monthly": 120,
        "demo_seconds_total": 0,
        "demo_requires_onboarding": false,
        "generic_voices_enabled": true,
        "personalized_voice_enabled": true
      }'::jsonb;
    ELSE
      RETURN '{
        "chat_limit_monthly": 20,
        "voice_minutes_monthly": 0,
        "demo_seconds_total": 60,
        "demo_requires_onboarding": true,
        "generic_voices_enabled": false,
        "personalized_voice_enabled": false
      }'::jsonb;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update entitlements when plan changes
CREATE OR REPLACE FUNCTION update_user_entitlements()
RETURNS trigger AS $$
BEGIN
  NEW.entitlements = compute_entitlements(NEW.plan);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update entitlements when plan changes
CREATE OR REPLACE TRIGGER profiles_entitlements_update
  BEFORE UPDATE OF plan ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_entitlements();

-- Create function to get current usage and capacity info
CREATE OR REPLACE FUNCTION get_user_subscription_info(user_id uuid)
RETURNS jsonb AS $$
DECLARE
  user_profile profiles%ROWTYPE;
  user_usage usage_counters%ROWTYPE;
  capacity_info capacity%ROWTYPE;
  current_period text;
  slots_available integer;
  result jsonb;
BEGIN
  -- Get current period (YYYY-MM format)
  current_period := to_char(date_trunc('month', CURRENT_DATE), 'YYYY-MM');
  
  -- Get user profile
  SELECT * INTO user_profile FROM profiles WHERE profiles.id = user_id;
  
  -- Get or create usage record for current period
  INSERT INTO usage_counters (user_id, period)
  VALUES (user_id, current_period)
  ON CONFLICT (user_id, period) DO NOTHING;
  
  SELECT * INTO user_usage FROM usage_counters 
  WHERE usage_counters.user_id = user_id AND period = current_period;
  
  -- Get capacity info
  SELECT * INTO capacity_info FROM capacity WHERE id = 1;
  
  -- Calculate available slots
  slots_available := GREATEST(0, capacity_info.max_slots - capacity_info.buffer_slots - capacity_info.active_slots);
  
  -- Build result
  result := jsonb_build_object(
    'plan', user_profile.plan,
    'entitlements', user_profile.entitlements,
    'usage', jsonb_build_object(
      'chat_interactions_used', COALESCE(user_usage.chat_interactions_used, 0),
      'voice_seconds_used', COALESCE(user_usage.voice_seconds_used, 0),
      'free_demo_seconds_used', COALESCE(user_usage.free_demo_seconds_used, 0)
    ),
    'capacity', jsonb_build_object(
      'plan_capacity', jsonb_build_object(
        'name', capacity_info.plan_name,
        'max_slots', capacity_info.max_slots
      ),
      'buffer_slots', capacity_info.buffer_slots,
      'slots_active', capacity_info.active_slots,
      'slots_available', slots_available
    )
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing triggers
CREATE OR REPLACE TRIGGER update_voices_updated_at
  BEFORE UPDATE ON public.voices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_capacity_updated_at
  BEFORE UPDATE ON public.capacity
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();