-- Criar tabela para análise de conversas e evolução da personalidade
CREATE TABLE public.conversation_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID NOT NULL,
  user_id UUID NOT NULL,
  conversation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sentiment_analysis JSONB, -- {positive: 0.8, negative: 0.1, neutral: 0.1, emotions: [...]}
  topics_discussed TEXT[],
  relationship_dynamics JSONB, -- {intimacy_level: 0.7, conflict_detected: false, emotional_distance: 0.3}
  personality_adaptations JSONB, -- {temperature_adjustment: 0.1, style_changes: [...]}
  key_moments TEXT[], -- Momentos importantes da conversa
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para memórias dinâmicas geradas automaticamente
CREATE TABLE public.dynamic_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID NOT NULL,
  memory_text TEXT NOT NULL,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('conversation', 'emotional', 'factual', 'preference', 'relationship')),
  importance_score NUMERIC(3,2) DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
  context_tags TEXT[],
  source_conversation_id UUID,
  auto_generated BOOLEAN DEFAULT true,
  confirmed_by_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE -- Memórias podem ter expiração
);

-- Criar tabela para evolução da personalidade ao longo do tempo
CREATE TABLE public.personality_evolution (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID NOT NULL,
  evolution_date DATE NOT NULL DEFAULT CURRENT_DATE,
  previous_traits JSONB,
  new_traits JSONB,
  evolution_reason TEXT,
  confidence_score NUMERIC(3,2) DEFAULT 0.5,
  applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.conversation_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_evolution ENABLE ROW LEVEL SECURITY;

-- Políticas para conversation_analytics
CREATE POLICY "Users can view their own conversation analytics" 
ON public.conversation_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversation analytics" 
ON public.conversation_analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversation analytics" 
ON public.conversation_analytics 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Políticas para dynamic_memories
CREATE POLICY "Users can view dynamic memories of their people" 
ON public.dynamic_memories 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = dynamic_memories.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can create dynamic memories for their people" 
ON public.dynamic_memories 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = dynamic_memories.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can update dynamic memories of their people" 
ON public.dynamic_memories 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = dynamic_memories.person_id 
  AND people.user_id = auth.uid()
));

-- Políticas para personality_evolution
CREATE POLICY "Users can view personality evolution of their people" 
ON public.personality_evolution 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = personality_evolution.person_id 
  AND people.user_id = auth.uid()
));

CREATE POLICY "Users can create personality evolution for their people" 
ON public.personality_evolution 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM people 
  WHERE people.id = personality_evolution.person_id 
  AND people.user_id = auth.uid()
));

-- Função para limpeza automática de memórias expiradas
CREATE OR REPLACE FUNCTION clean_expired_memories()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.dynamic_memories 
  WHERE expires_at IS NOT NULL 
  AND expires_at < now();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar limpeza diariamente
CREATE OR REPLACE FUNCTION schedule_memory_cleanup()
RETURNS void AS $$
BEGIN
  PERFORM cron.schedule('memory-cleanup', '0 2 * * *', 'SELECT clean_expired_memories();');
EXCEPTION
  WHEN OTHERS THEN
    -- Ignora erro se pg_cron não estiver disponível
    NULL;
END;
$$ LANGUAGE plpgsql;

-- Índices para performance
CREATE INDEX idx_conversation_analytics_person_date ON public.conversation_analytics(person_id, conversation_date);
CREATE INDEX idx_dynamic_memories_person_importance ON public.dynamic_memories(person_id, importance_score DESC);
CREATE INDEX idx_dynamic_memories_type ON public.dynamic_memories(memory_type);
CREATE INDEX idx_personality_evolution_person_date ON public.personality_evolution(person_id, evolution_date DESC);