-- Adicionar campo birth_date para data de nascimento completa
ALTER TABLE public.people 
ADD COLUMN birth_date DATE;

-- Comentário: Este campo permitirá calcular a idade exata considerando dia, mês e ano
-- O campo birth_year será mantido para compatibilidade, mas birth_date será priorizado