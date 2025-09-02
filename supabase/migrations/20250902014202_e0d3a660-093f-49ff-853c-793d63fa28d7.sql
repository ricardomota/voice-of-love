-- Create function to handle new user registration with free credits
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert initial credit balance for new users (100 free credits)
  INSERT INTO public.credit_balance (user_id, credits_available, credits_reserved, lifetime_spent)
  VALUES (NEW.id, 100, 0, 0);
  
  -- Log the initial credit grant
  INSERT INTO public.credit_transactions (user_id, delta, reason, metadata)
  VALUES (NEW.id, 100, 'initial_signup_bonus', '{"description": "Welcome bonus - 100 free credits"}');
  
  RETURN NEW;
END;
$$;

-- Create trigger to grant free credits on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();