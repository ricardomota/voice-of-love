-- Fix critical security vulnerability: Remove public read access to profiles table
-- Replace the overly permissive policy with a secure one

-- Drop the dangerous "Profiles are viewable by everyone" policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Additionally, ensure authenticated users can view profiles (if needed for app functionality)
-- This is more restrictive than the previous policy but still allows necessary access