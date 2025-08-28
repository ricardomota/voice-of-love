-- Create credit balance table
CREATE TABLE public.credit_balance (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_available INTEGER NOT NULL DEFAULT 0,
  credits_reserved INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create credit transactions table
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL, -- positive for credits added, negative for usage
  reason TEXT NOT NULL CHECK (reason IN ('pack_purchase', 'subscription_monthly_grant', 'usage_charge', 'refund', 'promo_grant', 'admin_adjust')),
  sku TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create usage events table
CREATE TABLE public.usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL CHECK (feature IN ('voice_clone', 'tts', 'transcription', 'chat', 'fingerprint', 'verify', 'storage')),
  quantity INTEGER NOT NULL,
  credits_charged INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('reserved', 'completed', 'failed')),
  ref_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create plans table
CREATE TABLE public.eterna_plans (
  code TEXT PRIMARY KEY,
  name JSONB NOT NULL, -- {"en": "Family", "pt-BR": "Família", "es": "Familiar"}
  monthly_price_usd DECIMAL(10,2) NOT NULL,
  monthly_price_brl DECIMAL(10,2) NOT NULL,
  monthly_credits INTEGER NOT NULL,
  limits JSONB NOT NULL DEFAULT '{}', -- voice slots, etc.
  perks JSONB NOT NULL DEFAULT '{}',
  rollover_pct INTEGER NOT NULL DEFAULT 0 CHECK (rollover_pct >= 0 AND rollover_pct <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create credit packs table
CREATE TABLE public.credit_packs (
  sku TEXT PRIMARY KEY,
  name JSONB NOT NULL, -- {"en": "Starter 1k", "pt-BR": "Starter 1k", "es": "Starter 1k"}
  credits INTEGER NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  price_brl DECIMAL(10,2) NOT NULL,
  best_value BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create feature pricing table
CREATE TABLE public.feature_pricing (
  feature TEXT PRIMARY KEY CHECK (feature IN ('voice_clone', 'tts', 'transcription', 'chat', 'fingerprint', 'verify', 'storage')),
  credits_per_unit INTEGER NOT NULL,
  unit_description TEXT NOT NULL, -- "per clone", "per 5 seconds", etc.
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.credit_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eterna_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_pricing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credit_balance
CREATE POLICY "Users can view their own credit balance" ON public.credit_balance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit balance" ON public.credit_balance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage credit balances" ON public.credit_balance
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for credit_transactions
CREATE POLICY "Users can view their own credit transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage credit transactions" ON public.credit_transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for usage_events
CREATE POLICY "Users can view their own usage events" ON public.usage_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage events" ON public.usage_events
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for plans and packs (public read, service role write)
CREATE POLICY "Plans are publicly readable" ON public.eterna_plans
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage plans" ON public.eterna_plans
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Credit packs are publicly readable" ON public.credit_packs
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage credit packs" ON public.credit_packs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Feature pricing is publicly readable" ON public.feature_pricing
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage feature pricing" ON public.feature_pricing
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at);
CREATE INDEX idx_usage_events_user_id ON public.usage_events(user_id);
CREATE INDEX idx_usage_events_created_at ON public.usage_events(created_at);
CREATE INDEX idx_usage_events_ref_id ON public.usage_events(ref_id) WHERE ref_id IS NOT NULL;

-- Create function to update credit balance
CREATE OR REPLACE FUNCTION public.update_credit_balance()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update credit balance on transaction insert
CREATE TRIGGER update_credit_balance_trigger
  AFTER INSERT ON public.credit_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_credit_balance();

-- Create function to charge credits atomically
CREATE OR REPLACE FUNCTION public.charge_credits(
  p_user_id UUID,
  p_feature TEXT,
  p_quantity INTEGER,
  p_ref_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert seed data for plans
INSERT INTO public.eterna_plans (code, name, monthly_price_usd, monthly_price_brl, monthly_credits, limits, rollover_pct) VALUES
('free', '{"en": "Free", "pt-BR": "Gratuito", "es": "Gratis"}', 0.00, 0.00, 100, '{"voice_slots": 1}', 0),
('family', '{"en": "Family", "pt-BR": "Família", "es": "Familiar"}', 19.00, 49.00, 2000, '{"voice_slots": 30}', 50),
('scale', '{"en": "Scale", "pt-BR": "Scale", "es": "Scale"}', 89.00, 229.00, 12000, '{"voice_slots": 660}', 50);

-- Insert seed data for credit packs
INSERT INTO public.credit_packs (sku, name, credits, price_usd, price_brl, best_value) VALUES
('PACK_1K', '{"en": "Starter 1k", "pt-BR": "Starter 1k", "es": "Starter 1k"}', 1000, 9.00, 24.00, false),
('PACK_5K', '{"en": "Value 5k", "pt-BR": "Value 5k", "es": "Value 5k"}', 5000, 39.00, 99.00, true),
('PACK_25K', '{"en": "Pro 25k", "pt-BR": "Pro 25k", "es": "Pro 25k"}', 25000, 169.00, 429.00, false),
('PACK_100K', '{"en": "Enterprise 100k", "pt-BR": "Enterprise 100k", "es": "Enterprise 100k"}', 100000, 599.00, 1499.00, false);

-- Insert seed data for feature pricing
INSERT INTO public.feature_pricing (feature, credits_per_unit, unit_description) VALUES
('voice_clone', 800, 'per clone'),
('tts', 1, 'per 5 seconds'),
('transcription', 2, 'per minute'),
('chat', 1, 'per 750 tokens'),
('fingerprint', 5, 'per minute'),
('verify', 1, 'per call'),
('storage', 1, 'per GB-month');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_eterna_plans_updated_at
  BEFORE UPDATE ON public.eterna_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_credit_packs_updated_at
  BEFORE UPDATE ON public.credit_packs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();