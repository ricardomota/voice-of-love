-- Security fixes for critical vulnerabilities
-- Phase 1: Fix public data exposure and nullable user_id columns

-- 1. Secure subscribers table - remove public access
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;

CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR email = auth.email())
);

CREATE POLICY "Users can insert their own subscription" ON public.subscribers
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR email = auth.email())
);

CREATE POLICY "Users can update their own subscription" ON public.subscribers
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR email = auth.email())
);

-- 2. Secure beta_access table - remove public access for unauthenticated users
DROP POLICY IF EXISTS "Authenticated users can check their own beta access" ON public.beta_access;

CREATE POLICY "Authenticated users can check their own beta access" ON public.beta_access
FOR SELECT USING (
  auth.uid() IS NOT NULL AND email = auth.email()
);

-- 3. Secure profiles table - ensure only authenticated users can access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 4. Secure business configuration tables
DROP POLICY IF EXISTS "config is publicly readable" ON public.config;
DROP POLICY IF EXISTS "Feature flags are publicly readable" ON public.feature_flags;
DROP POLICY IF EXISTS "plans are publicly readable" ON public.plans;

-- Config table - only service role can read/write
CREATE POLICY "Service role can manage config" ON public.config
FOR ALL USING (auth.role() = 'service_role');

-- Feature flags - only service role can manage, authenticated users can read
CREATE POLICY "Authenticated users can read feature flags" ON public.feature_flags
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can manage feature flags" ON public.feature_flags
FOR ALL USING (auth.role() = 'service_role');

-- Plans - authenticated users can read, service role can manage
CREATE POLICY "Authenticated users can read plans" ON public.plans
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can manage plans" ON public.plans
FOR ALL USING (auth.role() = 'service_role');

-- 5. Fix nullable user_id columns to prevent RLS bypass
-- Update conversations table
UPDATE public.conversations 
SET user_id = (
  SELECT p.user_id 
  FROM public.people p 
  WHERE p.id = conversations.person_id
)
WHERE user_id IS NULL;

ALTER TABLE public.conversations ALTER COLUMN user_id SET NOT NULL;

-- Update voices table - should always have user_id
ALTER TABLE public.voices ALTER COLUMN user_id SET NOT NULL;

-- Update user_voice_assets table
ALTER TABLE public.user_voice_assets ALTER COLUMN user_id SET NOT NULL;