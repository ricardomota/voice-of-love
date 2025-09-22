-- Remove the current plans and insert new ones with correct free plan structure
DELETE FROM eterna_plans;

-- Insert the updated plans with free plan having one-time credits
INSERT INTO eterna_plans (code, name, monthly_price_usd, monthly_price_brl, monthly_credits, limits, perks, rollover_pct) VALUES
('free', '{"en": "Free", "pt-BR": "Grátis", "es": "Gratis"}', 0, 0, 100, '{"voice_slots": 1, "max_conversations": 5}', '{"features": ["basic_chat", "voice_demo"]}', 0),
('starter', '{"en": "Starter", "pt-BR": "Iniciante", "es": "Principiante"}', 9.99, 39.99, 500, '{"voice_slots": 3, "max_conversations": -1}', '{"features": ["unlimited_chat", "voice_cloning", "priority_support"]}', 25),
('family', '{"en": "Family", "pt-BR": "Família", "es": "Familia"}', 19.99, 79.99, 1500, '{"voice_slots": 10, "max_conversations": -1}', '{"features": ["unlimited_chat", "voice_cloning", "family_sharing", "priority_support", "advanced_analytics"]}', 50),
('pro', '{"en": "Pro", "pt-BR": "Profissional", "es": "Profesional"}', 39.99, 159.99, 4000, '{"voice_slots": 25, "max_conversations": -1}', '{"features": ["unlimited_chat", "voice_cloning", "api_access", "priority_support", "advanced_analytics", "custom_integrations"]}', 75);

-- Update credit packs
DELETE FROM credit_packs;
INSERT INTO credit_packs (sku, name, credits, price_usd, price_brl, best_value) VALUES
('pack_small', '{"en": "Small Pack", "pt-BR": "Pacote Pequeno", "es": "Paquete Pequeño"}', 200, 4.99, 19.99, false),
('pack_medium', '{"en": "Medium Pack", "pt-BR": "Pacote Médio", "es": "Paquete Mediano"}', 500, 9.99, 39.99, true),
('pack_large', '{"en": "Large Pack", "pt-BR": "Pacote Grande", "es": "Paquete Grande"}', 1200, 19.99, 79.99, false),
('pack_xl', '{"en": "XL Pack", "pt-BR": "Pacote XL", "es": "Paquete XL"}', 2500, 39.99, 159.99, false);