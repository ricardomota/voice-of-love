-- Fix function search path security issues by setting explicit search_path

-- Update existing functions to have secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_usage_row(p_user_id uuid, p_period text)
RETURNS void
LANGUAGE plpgsql  
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.usage_counters(user_id, period)
  VALUES (p_user_id, p_period)
  ON CONFLICT (user_id, period) DO NOTHING;
END; 
$function$;

CREATE OR REPLACE FUNCTION public.update_user_entitlements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.entitlements = compute_entitlements(NEW.plan);
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_voice_capacity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.compute_entitlements(user_plan text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_user_subscription_info(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.clean_expired_memories()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.dynamic_memories 
  WHERE expires_at IS NOT NULL 
  AND expires_at < now();
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.schedule_memory_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM cron.schedule('memory-cleanup', '0 2 * * *', 'SELECT public.clean_expired_memories();');
EXCEPTION
  WHEN OTHERS THEN
    -- Ignora erro se pg_cron não estiver disponível
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;