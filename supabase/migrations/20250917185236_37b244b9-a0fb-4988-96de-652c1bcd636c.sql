-- Security Fix: Restrict access to business-sensitive pricing data
-- Remove public read access from critical business tables

-- Update credit_packs table policies
DROP POLICY IF EXISTS "Credit packs are publicly readable" ON public.credit_packs;
CREATE POLICY "Authenticated users can view credit packs" 
ON public.credit_packs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update eterna_plans table policies  
DROP POLICY IF EXISTS "Plans are publicly readable" ON public.eterna_plans;
CREATE POLICY "Authenticated users can view plans" 
ON public.eterna_plans 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update feature_pricing table policies (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feature_pricing') THEN
        DROP POLICY IF EXISTS "Feature pricing is publicly readable" ON public.feature_pricing;
        CREATE POLICY "Service role can view feature pricing" 
        ON public.feature_pricing 
        FOR SELECT 
        USING (auth.role() = 'service_role'::text);
    END IF;
END $$;

-- Update voices_base table policies (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voices_base') THEN
        DROP POLICY IF EXISTS "Voices base are publicly readable" ON public.voices_base;
        CREATE POLICY "Authenticated users can view voices base" 
        ON public.voices_base 
        FOR SELECT 
        USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- Security Fix: Update database functions to have proper search paths
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT public.has_role(auth.uid(), 'admin')
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