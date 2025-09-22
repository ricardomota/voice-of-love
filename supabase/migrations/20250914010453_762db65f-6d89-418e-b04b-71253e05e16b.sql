-- Update credit packs to include monthly and yearly options
-- Remove plans dependency and focus on pure credit model

-- First, let's update the credit_packs table to include billing frequency
ALTER TABLE public.credit_packs 
ADD COLUMN billing_frequency TEXT NOT NULL DEFAULT 'one-time' CHECK (billing_frequency IN ('one-time', 'monthly', 'yearly'));

-- Add a yearly discount percentage column
ALTER TABLE public.credit_packs 
ADD COLUMN yearly_discount_pct INTEGER DEFAULT 0;

-- Update existing credit packs and add new monthly/yearly options
DELETE FROM public.credit_packs;

-- Insert new credit pack structure: One-time packs, Monthly packs, Yearly packs
INSERT INTO public.credit_packs (sku, name, credits, price_usd, price_brl, billing_frequency, yearly_discount_pct, best_value) VALUES
-- One-time credit packs
('starter_pack', '{"en": "Starter Pack", "pt-BR": "Pacote Inicial", "es": "Paquete Inicial"}', 100, 9.99, 49.99, 'one-time', 0, false),
('standard_pack', '{"en": "Standard Pack", "pt-BR": "Pacote Padrão", "es": "Paquete Estándar"}', 500, 39.99, 199.99, 'one-time', 0, false),
('premium_pack', '{"en": "Premium Pack", "pt-BR": "Pacote Premium", "es": "Paquete Premium"}', 1200, 79.99, 399.99, 'one-time', 0, true),
('enterprise_pack', '{"en": "Enterprise Pack", "pt-BR": "Pacote Empresa", "es": "Paquete Empresa"}', 3000, 179.99, 899.99, 'one-time', 0, false),

-- Monthly credit subscriptions
('monthly_essential', '{"en": "Essential Monthly", "pt-BR": "Mensal Essencial", "es": "Mensual Esencial"}', 200, 19.99, 99.99, 'monthly', 0, false),
('monthly_professional', '{"en": "Professional Monthly", "pt-BR": "Mensal Profissional", "es": "Mensual Profesional"}', 600, 49.99, 249.99, 'monthly', 0, true),
('monthly_business', '{"en": "Business Monthly", "pt-BR": "Mensal Negócios", "es": "Mensual Empresarial"}', 1500, 99.99, 499.99, 'monthly', 0, false),

-- Yearly credit subscriptions (with 20% discount)
('yearly_essential', '{"en": "Essential Yearly", "pt-BR": "Anual Essencial", "es": "Anual Esencial"}', 2400, 191.90, 959.90, 'yearly', 20, false),
('yearly_professional', '{"en": "Professional Yearly", "pt-BR": "Anual Profissional", "es": "Anual Profesional"}', 7200, 479.90, 2399.90, 'yearly', 20, true),
('yearly_business', '{"en": "Business Yearly", "pt-BR": "Anual Negócios", "es": "Anual Empresarial"}', 18000, 959.90, 4799.90, 'yearly', 20, false);

-- Update existing feature pricing to be more cost-effective
UPDATE public.feature_pricing SET 
    credits_per_unit = 500,
    unit_description = 'per voice clone training'
WHERE feature = 'voice_clone';

UPDATE public.feature_pricing SET 
    credits_per_unit = 1,
    unit_description = 'per 5 seconds of audio'
WHERE feature = 'tts';

UPDATE public.feature_pricing SET 
    credits_per_unit = 1,
    unit_description = 'per 750 tokens (~500 words)'
WHERE feature = 'chat';

UPDATE public.feature_pricing SET 
    credits_per_unit = 2,
    unit_description = 'per minute of audio'
WHERE feature = 'transcription';