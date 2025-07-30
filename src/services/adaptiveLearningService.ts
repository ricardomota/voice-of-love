import { supabase } from "@/integrations/supabase/client";
import { Person } from "@/types/person";
import { ConversationAnalysis } from "@/services/conversationAnalyzer";

export interface LearningInsights {
  suggestedPersonalityChanges: {
    field: string;
    currentValue: any;
    suggestedValue: any;
    reason: string;
    confidence: number;
  }[];
  newPersonalityTraits: string[];
  newCommonPhrases: string[];
  communicationPatterns: {
    verbosity: 'increase' | 'decrease' | 'maintain';
    emotionalTone: 'warmer' | 'cooler' | 'maintain';
    temperature: number;
  };
  conversationQuality: number;
}

export const adaptiveLearningService = {
  /**
   * Aplica aprendizado baseado na análise de conversa
   */
  async applyLearning(
    person: Person,
    analysis: ConversationAnalysis,
    conversationCount: number
  ): Promise<Person | null> {
    // Só aplica mudanças após pelo menos 3 conversas
    if (conversationCount < 3) return null;

    const insights = this.extractLearningInsights(analysis, person, conversationCount);
    
    // Só aplica se houver alta confiança (>0.7)
    if (insights.conversationQuality < 0.7) return null;

    const updatedPerson = await this.applyPersonalityEvolution(person, insights);
    
    // Salva histórico de evolução
    await this.savePersonalityEvolution(person.id, person, updatedPerson, insights);
    
    return updatedPerson;
  },

  /**
   * Extrai insights de aprendizado da análise
   */
  extractLearningInsights(
    analysis: ConversationAnalysis, 
    person: Person,
    conversationCount: number
  ): LearningInsights {
    const { personalityInsights, conversationQuality, relationshipDynamics } = analysis;
    
    // Calcula mudanças baseadas na qualidade da conversa
    const qualityScore = (
      conversationQuality.authenticity + 
      conversationQuality.emotional_resonance + 
      conversationQuality.engagement
    ) / 3;

    // Sugere ajustes baseados na dinâmica
    const communicationPatterns = {
      verbosity: this.calculateVerbosityAdjustment(relationshipDynamics, person.verbosity),
      emotionalTone: this.calculateEmotionalToneAdjustment(relationshipDynamics, person.emotionalTone),
      temperature: this.calculateTemperatureAdjustment(analysis, person.temperature)
    };

    // Extrai novos traços observados
    const newPersonalityTraits = personalityInsights.observedTraits.filter(
      trait => !person.personality.includes(trait)
    );

    // Extrai novos padrões de fala
    const newCommonPhrases = this.extractNewPhrases(analysis, person.commonPhrases);

    return {
      suggestedPersonalityChanges: [],
      newPersonalityTraits,
      newCommonPhrases,
      communicationPatterns,
      conversationQuality: qualityScore
    };
  },

  /**
   * Aplica evolução na personalidade
   */
  async applyPersonalityEvolution(person: Person, insights: LearningInsights): Promise<Person> {
    const updatedPerson: Person = {
      ...person,
      // Adiciona novos traços de personalidade (máximo 10)
      personality: [
        ...person.personality,
        ...insights.newPersonalityTraits.slice(0, 10 - person.personality.length)
      ],
      
      // Adiciona novas frases (máximo 15)
      commonPhrases: [
        ...person.commonPhrases,
        ...insights.newCommonPhrases.slice(0, 15 - person.commonPhrases.length)
      ],
      
      // Ajusta comunicação gradualmente
      temperature: this.adjustValueGradually(
        person.temperature, 
        insights.communicationPatterns.temperature, 
        0.05
      ),
      
      // Atualiza timestamp
      updatedAt: new Date()
    };

    // Aplica ajustes de verbosidade se necessário
    if (insights.communicationPatterns.verbosity !== 'maintain') {
      updatedPerson.verbosity = this.adjustVerbosity(
        person.verbosity, 
        insights.communicationPatterns.verbosity
      );
    }

    // Aplica ajustes de tom emocional se necessário
    if (insights.communicationPatterns.emotionalTone !== 'maintain') {
      updatedPerson.emotionalTone = this.adjustEmotionalTone(
        person.emotionalTone, 
        insights.communicationPatterns.emotionalTone
      );
    }

    return updatedPerson;
  },

  /**
   * Salva histórico de evolução
   */
  async savePersonalityEvolution(
    personId: string, 
    previousPerson: Person, 
    newPerson: Person, 
    insights: LearningInsights
  ): Promise<void> {
    const reason = `Evolução automática baseada em ${insights.conversationQuality.toFixed(2)} de qualidade de conversa`;
    
    await supabase
      .from('personality_evolution')
      .insert({
        person_id: personId,
        previous_traits: {
          personality: previousPerson.personality,
          commonPhrases: previousPerson.commonPhrases,
          temperature: previousPerson.temperature,
          verbosity: previousPerson.verbosity,
          emotionalTone: previousPerson.emotionalTone
        },
        new_traits: {
          personality: newPerson.personality,
          commonPhrases: newPerson.commonPhrases,
          temperature: newPerson.temperature,
          verbosity: newPerson.verbosity,
          emotionalTone: newPerson.emotionalTone
        },
        evolution_reason: reason,
        confidence_score: insights.conversationQuality,
        applied: true
      });
  },

  // Métodos auxiliares para ajustes
  calculateVerbosityAdjustment(dynamics: any, currentVerbosity?: string): 'increase' | 'decrease' | 'maintain' {
    const engagement = dynamics.engagementLevel;
    const communication = dynamics.communicationQuality;
    
    if (engagement < 0.6 && communication < 0.7) {
      return currentVerbosity === 'concisa' ? 'increase' : 'maintain';
    }
    if (engagement > 0.8 && communication > 0.8) {
      return 'maintain';
    }
    return 'maintain';
  },

  calculateEmotionalToneAdjustment(dynamics: any, currentTone?: string): 'warmer' | 'cooler' | 'maintain' {
    const intimacy = dynamics.intimacyLevel;
    const trust = dynamics.trustLevel;
    
    if (intimacy > 0.7 && trust > 0.7) {
      return currentTone === 'formal' ? 'warmer' : 'maintain';
    }
    if (intimacy < 0.4) {
      return 'cooler';
    }
    return 'maintain';
  },

  calculateTemperatureAdjustment(analysis: ConversationAnalysis, currentTemp: number): number {
    const quality = analysis.conversationQuality;
    const avgQuality = (quality.authenticity + quality.emotional_resonance + quality.engagement) / 3;
    
    if (avgQuality < 0.6) {
      // Aumenta criatividade se a conversa está monótona
      return Math.min(1.0, currentTemp + 0.1);
    }
    if (avgQuality > 0.8) {
      // Mantém estabilidade se está funcionando bem
      return currentTemp;
    }
    return currentTemp;
  },

  adjustValueGradually(current: number, target: number, maxChange: number): number {
    const difference = target - current;
    const adjustment = Math.sign(difference) * Math.min(Math.abs(difference), maxChange);
    return Math.max(0, Math.min(1, current + adjustment));
  },

  adjustVerbosity(current?: string, adjustment?: 'increase' | 'decrease'): string {
    const levels = ['concisa', 'equilibrada', 'detalhada', 'expressiva'];
    const currentIndex = current ? levels.indexOf(current) : 1;
    
    if (adjustment === 'increase' && currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    if (adjustment === 'decrease' && currentIndex > 0) {
      return levels[currentIndex - 1];
    }
    return current || 'equilibrada';
  },

  adjustEmotionalTone(current?: string, adjustment?: 'warmer' | 'cooler'): string {
    const warmLevels = ['formal', 'amigável', 'caloroso', 'afetuoso'];
    const currentIndex = current ? warmLevels.indexOf(current) : 1;
    
    if (adjustment === 'warmer' && currentIndex < warmLevels.length - 1) {
      return warmLevels[currentIndex + 1];
    }
    if (adjustment === 'cooler' && currentIndex > 0) {
      return warmLevels[currentIndex - 1];
    }
    return current || 'amigável';
  },

  extractNewPhrases(analysis: ConversationAnalysis, existingPhrases: string[]): string[] {
    // Procura por frases repetidas ou padrões na conversa
    // Por enquanto retorna array vazio, mas poderia ser expandido
    // para detectar padrões de fala comuns nas mensagens
    return [];
  },

  /**
   * Obtém histórico de evolução de uma pessoa
   */
  async getPersonalityEvolutionHistory(personId: string) {
    const { data, error } = await supabase
      .from('personality_evolution')
      .select('*')
      .eq('person_id', personId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Obtém insights de aprendizado baseados no histórico
   */
  async getLearningProgress(personId: string) {
    const history = await this.getPersonalityEvolutionHistory(personId);
    const conversations = await supabase
      .from('conversations')
      .select('id')
      .eq('person_id', personId);

    return {
      totalConversations: conversations.data?.length || 0,
      evolutionCount: history.length,
      lastEvolution: history[0]?.created_at,
      averageConfidence: history.reduce((acc, curr) => acc + (curr.confidence_score || 0), 0) / history.length || 0
    };
  }
};