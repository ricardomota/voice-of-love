import { supabase } from "@/integrations/supabase/client";
import { Person, Message } from "@/types/person";

export interface ConversationAnalysis {
  sentimentAnalysis: {
    userSentiment: { positive: number; negative: number; neutral: number };
    characterSentiment: { positive: number; negative: number; neutral: number };
    overallMood: string;
    emotionalIntensity: number;
    dominantEmotions: string[];
  };
  topicsDiscussed: string[];
  relationshipDynamics: {
    intimacyLevel: number;
    conflictDetected: boolean;
    emotionalDistance: number;
    communicationQuality: number;
    trustLevel: number;
    engagementLevel: number;
  };
  keyMoments: string[];
  suggestedMemories: Array<{
    text: string;
    type: 'conversation' | 'emotional' | 'factual' | 'preference' | 'relationship';
    importance: number;
    tags: string[];
  }>;
  personalityInsights: {
    observedTraits: string[];
    behaviorPatterns: string[];
    suggestedAdjustments: {
      temperature: number;
      verbosity: 'increase' | 'decrease' | 'maintain';
      emotionalTone: 'warmer' | 'cooler' | 'maintain';
    };
  };
  conversationQuality: {
    coherence: number;
    authenticity: number;
    emotional_resonance: number;
    engagement: number;
  };
}

export const conversationAnalyzer = {
  async analyzeConversation(
    person: Person, 
    messages: Message[]
  ): Promise<ConversationAnalysis> {
    try {
      // Buscar análises anteriores para contexto
      const { data: previousAnalytics } = await supabase
        .from('conversation_analytics')
        .select('*')
        .eq('person_id', person.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Chamar a Edge Function para análise
      const { data, error } = await supabase.functions.invoke('conversation-analyzer', {
        body: {
          conversation: messages,
          personProfile: person,
          previousAnalytics: previousAnalytics || []
        }
      });

      if (error) {
        console.error('Error analyzing conversation:', error);
        throw error;
      }

      return data as ConversationAnalysis;
    } catch (error) {
      console.error('Error in conversation analysis:', error);
      // Retorna análise básica em caso de erro
      return this.getDefaultAnalysis();
    }
  },

  async saveAnalysis(
    personId: string,
    userId: string,
    analysis: ConversationAnalysis
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversation_analytics')
        .insert({
          person_id: personId,
          user_id: userId,
          sentiment_analysis: analysis.sentimentAnalysis,
          topics_discussed: analysis.topicsDiscussed,
          relationship_dynamics: analysis.relationshipDynamics,
          personality_adaptations: analysis.personalityInsights.suggestedAdjustments,
          key_moments: analysis.keyMoments
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation analysis:', error);
    }
  },

  async saveDynamicMemories(
    personId: string,
    memories: ConversationAnalysis['suggestedMemories'],
    conversationId?: string
  ): Promise<void> {
    try {
      if (memories.length === 0) return;

      const memoriesToInsert = memories
        .filter(memory => memory.importance > 0.6) // Só salva memórias importantes
        .map(memory => ({
          person_id: personId,
          memory_text: memory.text,
          memory_type: memory.type,
          importance_score: memory.importance,
          context_tags: memory.tags,
          source_conversation_id: conversationId,
          auto_generated: true,
          confirmed_by_user: false,
          expires_at: memory.type === 'conversation' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
            : null // Memórias factual/preference não expiram
        }));

      if (memoriesToInsert.length > 0) {
        const { error } = await supabase
          .from('dynamic_memories')
          .insert(memoriesToInsert);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving dynamic memories:', error);
    }
  },

  async getDynamicMemories(personId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('dynamic_memories')
        .select('*')
        .eq('person_id', personId)
        .order('importance_score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching dynamic memories:', error);
      return [];
    }
  },

  async suggestPersonalityEvolution(
    person: Person,
    analysis: ConversationAnalysis
  ): Promise<void> {
    try {
      const suggestions = analysis.personalityInsights.suggestedAdjustments;
      
      // Só sugere evolução se houver mudanças significativas
      if (suggestions.temperature !== person.temperature || 
          suggestions.verbosity !== 'maintain' || 
          suggestions.emotionalTone !== 'maintain') {
        
        const newTraits = {
          temperature: suggestions.temperature,
          verbosity: person.verbosity,
          emotionalTone: person.emotionalTone,
          // Aplicar ajustes baseados na análise
          ...(suggestions.verbosity === 'increase' && { verbosity: 'Detalhado e expressivo' }),
          ...(suggestions.verbosity === 'decrease' && { verbosity: 'Conciso e direto' }),
          ...(suggestions.emotionalTone === 'warmer' && { emotionalTone: 'Mais caloroso e afetuoso' }),
          ...(suggestions.emotionalTone === 'cooler' && { emotionalTone: 'Mais reservado e formal' })
        };

        const { error } = await supabase
          .from('personality_evolution')
          .insert({
            person_id: person.id,
            previous_traits: {
              temperature: person.temperature,
              verbosity: person.verbosity,
              emotionalTone: person.emotionalTone
            },
            new_traits: newTraits,
            evolution_reason: `Baseado na análise de qualidade da conversa: ${
              analysis.conversationQuality.engagement > 0.8 ? 'alta' : 
              analysis.conversationQuality.engagement > 0.6 ? 'média' : 'baixa'
            } engagement`,
            confidence_score: analysis.conversationQuality.authenticity,
            applied: false
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error suggesting personality evolution:', error);
    }
  },

  getDefaultAnalysis(): ConversationAnalysis {
    return {
      sentimentAnalysis: {
        userSentiment: { positive: 0.6, negative: 0.2, neutral: 0.2 },
        characterSentiment: { positive: 0.7, negative: 0.1, neutral: 0.2 },
        overallMood: "neutral",
        emotionalIntensity: 0.5,
        dominantEmotions: ["curiosity"]
      },
      topicsDiscussed: ["conversa geral"],
      relationshipDynamics: {
        intimacyLevel: 0.5,
        conflictDetected: false,
        emotionalDistance: 0.3,
        communicationQuality: 0.7,
        trustLevel: 0.6,
        engagementLevel: 0.7
      },
      keyMoments: [],
      suggestedMemories: [],
      personalityInsights: {
        observedTraits: [],
        behaviorPatterns: [],
        suggestedAdjustments: {
          temperature: 0.7,
          verbosity: "maintain",
          emotionalTone: "maintain"
        }
      },
      conversationQuality: {
        coherence: 0.7,
        authenticity: 0.6,
        emotional_resonance: 0.5,
        engagement: 0.6
      }
    };
  }
};