-- Fix critical security vulnerabilities in subscribers, waitlist, and event_logs tables

-- Secure subscribers table - only subscribers can view their own data
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;  
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

CREATE POLICY "Users can insert their own subscription"
ON public.subscribers
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can view their own subscription" 
ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can update their own subscription"
ON public.subscribers  
FOR UPDATE
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Service role can manage all subscriptions"
ON public.subscribers
FOR ALL
USING (auth.role() = 'service_role');

-- Secure waitlist table - restrict public insertion and visibility
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;

CREATE POLICY "Authenticated users can join waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own waitlist entries"
ON public.waitlist
FOR SELECT 
USING (email = auth.email());

CREATE POLICY "Service role can manage waitlist"
ON public.waitlist
FOR ALL
USING (auth.role() = 'service_role');

-- Secure event_logs table - restrict anonymous insertion
DROP POLICY IF EXISTS "Anyone can insert events" ON public.event_logs;

CREATE POLICY "Authenticated users can insert events"
ON public.event_logs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Service role can insert system events"
ON public.event_logs  
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Add rate limiting for event insertion (optional enhancement)
CREATE OR REPLACE FUNCTION public.check_event_rate_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;