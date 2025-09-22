-- Fix database function security by adding proper search_path configuration
-- This prevents search path injection attacks

-- Update handle_new_user_credits function
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert initial credit balance for new users (100 free credits)
  INSERT INTO public.credit_balance (user_id, credits_available, credits_reserved, lifetime_spent)
  VALUES (NEW.id, 100, 0, 0);
  
  -- Log the initial credit grant
  INSERT INTO public.credit_transactions (user_id, delta, reason, metadata)
  VALUES (NEW.id, 100, 'initial_signup_bonus', '{"description": "Welcome bonus - 100 free credits"}');
  
  RETURN NEW;
END;
$function$;

-- Update update_user_entitlements function
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

-- Update check_beta_access function
CREATE OR REPLACE FUNCTION public.check_beta_access(p_email text, p_access_code text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  access_record beta_access%ROWTYPE;
  result jsonb;
BEGIN
  -- If access_code is provided, validate both email and code
  IF p_access_code IS NOT NULL THEN
    SELECT * INTO access_record 
    FROM beta_access 
    WHERE email = p_email AND access_code = p_access_code;
    
    IF FOUND THEN
      -- Update used_at timestamp
      UPDATE beta_access 
      SET used_at = now() 
      WHERE email = p_email AND access_code = p_access_code;
      
      RETURN jsonb_build_object(
        'hasAccess', true,
        'used_at', access_record.used_at,
        'message', 'Access granted'
      );
    ELSE
      RETURN jsonb_build_object(
        'hasAccess', false,
        'message', 'Invalid email or access code'
      );
    END IF;
  ELSE
    -- Only check if email exists (for checking eligibility)
    SELECT * INTO access_record 
    FROM beta_access 
    WHERE email = p_email;
    
    IF FOUND THEN
      RETURN jsonb_build_object(
        'hasAccess', true,
        'used_at', access_record.used_at,
        'message', 'Email found in beta access'
      );
    ELSE
      RETURN jsonb_build_object(
        'hasAccess', false,
        'message', 'Email not found in beta access'
      );
    END IF;
  END IF;
END;
$function$;

-- Update update_voice_capacity function
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

-- Update compute_entitlements function
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

-- Update check_event_rate_limit function
CREATE OR REPLACE FUNCTION public.check_event_rate_limit(p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  event_count integer;
BEGIN
  -- Check events in last minute for this user
  SELECT COUNT(*) INTO event_count
  FROM public.event_logs
  WHERE user_id = p_user_id 
  AND created_at > now() - interval '1 minute';
  
  -- Allow max 60 events per minute per user
  RETURN event_count < 60;
END;
$function$;

-- Update handle_new_user_profile function
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

-- Update get_user_subscription_info function
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

-- Update charge_credits function
CREATE OR REPLACE FUNCTION public.charge_credits(p_user_id uuid, p_feature text, p_quantity integer, p_ref_id text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_pricing RECORD;
  v_credits_needed INTEGER;
  v_available_credits INTEGER;
  v_transaction_id UUID;
  v_usage_event_id UUID;
BEGIN
  -- Get feature pricing
  SELECT credits_per_unit INTO v_pricing
  FROM public.feature_pricing
  WHERE feature = p_feature;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Feature pricing not found');
  END IF;
  
  -- Calculate credits needed
  v_credits_needed := v_pricing.credits_per_unit * p_quantity;
  
  -- Get current available credits
  SELECT credits_available INTO v_available_credits
  FROM public.credit_balance
  WHERE user_id = p_user_id;
  
  IF v_available_credits IS NULL THEN
    v_available_credits := 0;
  END IF;
  
  -- Check if user has enough credits
  IF v_available_credits < v_credits_needed THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'insufficient_credits',
      'required', v_credits_needed,
      'available', v_available_credits
    );
  END IF;
  
  -- Check for duplicate ref_id
  IF p_ref_id IS NOT NULL THEN
    SELECT id INTO v_usage_event_id
    FROM public.usage_events
    WHERE ref_id = p_ref_id AND user_id = p_user_id;
    
    IF FOUND THEN
      RETURN jsonb_build_object('success', true, 'message', 'already_processed');
    END IF;
  END IF;
  
  -- Create credit transaction
  INSERT INTO public.credit_transactions (user_id, delta, reason, metadata)
  VALUES (
    p_user_id,
    -v_credits_needed,
    'usage_charge',
    jsonb_build_object('feature', p_feature, 'quantity', p_quantity)
  )
  RETURNING id INTO v_transaction_id;
  
  -- Create usage event
  INSERT INTO public.usage_events (user_id, feature, quantity, credits_charged, ref_id)
  VALUES (p_user_id, p_feature, p_quantity, v_credits_needed, p_ref_id)
  RETURNING id INTO v_usage_event_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'credits_charged', v_credits_needed,
    'transaction_id', v_transaction_id,
    'usage_event_id', v_usage_event_id
  );
END;
$function$;

-- Update update_credit_balance function
CREATE OR REPLACE FUNCTION public.update_credit_balance()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Update the credit balance based on the transaction
  INSERT INTO public.credit_balance (user_id, credits_available, lifetime_spent, last_updated)
  VALUES (
    NEW.user_id,
    GREATEST(0, NEW.delta),
    CASE WHEN NEW.delta < 0 THEN ABS(NEW.delta) ELSE 0 END,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    credits_available = GREATEST(0, credit_balance.credits_available + NEW.delta),
    lifetime_spent = credit_balance.lifetime_spent + CASE WHEN NEW.delta < 0 THEN ABS(NEW.delta) ELSE 0 END,
    last_updated = now();
  
  RETURN NEW;
END;
$function$;