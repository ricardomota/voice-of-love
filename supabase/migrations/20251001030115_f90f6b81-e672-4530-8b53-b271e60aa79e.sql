-- Security Enhancement: Make user_id fields non-nullable where appropriate
-- This prevents orphaned records and improves data integrity

-- Ensure all existing records have user_id set (safety check)
-- If any records are missing user_id, this will fail and prevent data corruption

-- Make user_id non-nullable in chat_sessions
ALTER TABLE public.chat_sessions 
  ALTER COLUMN user_id SET NOT NULL;

-- Make user_id non-nullable in loved_ones
ALTER TABLE public.loved_ones 
  ALTER COLUMN user_id SET NOT NULL;

-- Make user_id non-nullable in circles
ALTER TABLE public.circles 
  ALTER COLUMN user_id SET NOT NULL;

-- Make user_id non-nullable in persons
ALTER TABLE public.persons 
  ALTER COLUMN user_id SET NOT NULL;

-- Make user_id non-nullable in eterna_voices
ALTER TABLE public.eterna_voices 
  ALTER COLUMN user_id SET NOT NULL;

-- Make user_id non-nullable in eterna_users
ALTER TABLE public.eterna_users 
  ALTER COLUMN user_id SET NOT NULL;

-- Add check constraints to ensure user_id references valid users
-- This is a belt-and-suspenders approach for extra security

COMMENT ON COLUMN public.chat_sessions.user_id IS 
  'Required: Every chat session must belong to a user';

COMMENT ON COLUMN public.loved_ones.user_id IS 
  'Required: Every loved one must belong to a user';

COMMENT ON COLUMN public.circles.user_id IS 
  'Required: Every circle must belong to a user';

COMMENT ON COLUMN public.persons.user_id IS 
  'Required: Every person must belong to a user';

COMMENT ON COLUMN public.eterna_voices.user_id IS 
  'Required: Every voice must belong to a user';

COMMENT ON COLUMN public.eterna_users.user_id IS 
  'Required: Links to auth.users for authentication';