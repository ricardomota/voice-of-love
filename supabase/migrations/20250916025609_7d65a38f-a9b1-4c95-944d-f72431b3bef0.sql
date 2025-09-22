-- Fix credit_transactions constraint to allow 'initial_signup_bonus' reason
-- First drop the existing constraint
ALTER TABLE public.credit_transactions DROP CONSTRAINT IF EXISTS credit_transactions_reason_check;

-- Add the correct constraint with valid reason values
ALTER TABLE public.credit_transactions 
ADD CONSTRAINT credit_transactions_reason_check 
CHECK (reason IN ('usage_charge', 'credit_purchase', 'refund', 'initial_signup_bonus', 'bonus', 'adjustment'));