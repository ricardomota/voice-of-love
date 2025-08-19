/**
 * Serviço de pagamentos para o Eterna
 * Integração com Stripe (placeholder para implementação futura)
 */

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPriceUSD: number;
  monthlyPriceBRL: number;
  limits: {
    messagesPerMonth: number;
    ttsMinutesPerMonth: number;
    voiceCloneSlots: number;
    peopleLimit: number;
  };
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Primeiro Olhar',
    monthlyPriceUSD: 0,
    monthlyPriceBRL: 0,
    limits: {
      messagesPerMonth: 20,
      ttsMinutesPerMonth: 0,
      voiceCloneSlots: 0,
      peopleLimit: 1
    },
    features: [
      '1 pessoa (clone)',
      '20 interações de chat (TEXTO)',
      'Upload de memórias em texto e fotos',
      'Sem exportação'
    ]
  },
  {
    id: 'essential',
    name: 'Essencial',
    monthlyPriceUSD: 29.00,
    monthlyPriceBRL: 149.99,
    limits: {
      messagesPerMonth: 200,
      ttsMinutesPerMonth: 30,
      voiceCloneSlots: 0,
      peopleLimit: 1
    },
    features: [
      '1 pessoa',
      '30 minutos/mês de voz gerada (vozes pré-criadas)',
      '200 interações/mês de chat',
      'Personalidade básica (tom/estilo)',
      'Exportação básica de áudio'
    ]
  },
  {
    id: 'complete',
    name: 'Completo',
    monthlyPriceUSD: 79.00,
    monthlyPriceBRL: 399.99,
    limits: {
      messagesPerMonth: -1, // Unlimited
      ttsMinutesPerMonth: 120,
      voiceCloneSlots: 1,
      peopleLimit: 3
    },
    features: [
      'Até 3 pessoas',
      '120 minutos/mês de voz',
      'Interações ilimitadas de chat',
      'Personalidade avançada (temperamento/emoção)',
      'Upload de textos, fotos e áudios',
      'Exportação completa de áudio',
      'Compartilhamento com até 3 convidados',
      'Voz personalizada com gravações reais'
    ]
  }
];

export const paymentsService = {
  /**
   * Retorna os planos disponíveis
   */
  getPlans(): PricingPlan[] {
    return PRICING_PLANS;
  },

  /**
   * Retorna um plano específico por ID
   */
  getPlan(planId: string): PricingPlan | null {
    return PRICING_PLANS.find(plan => plan.id === planId) || null;
  },

  /**
   * Cria sessão de checkout do Stripe
   */
  async createCheckoutSession(planId: string): Promise<{ url: string } | null> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;
      return { url: data.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  },

  /**
   * Verifica se o usuário pode usar uma funcionalidade baseada no plano
   */
  canUseFeature(currentPlan: string, feature: 'messages' | 'tts' | 'voiceClone' | 'people', usage: number): boolean {
    const plan = this.getPlan(currentPlan);
    if (!plan) return false;
    
    switch (feature) {
      case 'messages':
        return plan.limits.messagesPerMonth === -1 || usage < plan.limits.messagesPerMonth;
      case 'tts':
        return plan.limits.ttsMinutesPerMonth === -1 || usage < plan.limits.ttsMinutesPerMonth;
      case 'voiceClone':
        return usage < plan.limits.voiceCloneSlots;
      case 'people':
        return plan.limits.peopleLimit === -1 || usage < plan.limits.peopleLimit;
      default:
        return false;
    }
  },

  /**
   * Calcula o preço com desconto anual
   */
  getAnnualPrice(monthlyPrice: number): number {
    return monthlyPrice * 12 * 0.8; // 20% de desconto anual
  },

  /**
   * Formata preço para exibição
   */
  formatPrice(price: number, currency: 'USD' | 'BRL'): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    });
    return formatter.format(price);
  },

  /**
   * Retorna a URL do portal de gerenciamento do cliente
   */
  async getCustomerPortalUrl(): Promise<string> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Error getting customer portal URL:', error);
      throw error;
    }
  }
};