-- Fix security issues: Set search_path for functions

-- Update existing functions to have proper search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION update_user_entitlements()
RETURNS trigger AS $$
BEGIN
  NEW.entitlements = compute_entitlements(NEW.plan);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;