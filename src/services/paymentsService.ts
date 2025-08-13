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
    name: 'Free',
    monthlyPriceUSD: 0,
    monthlyPriceBRL: 0,
    limits: {
      messagesPerMonth: 50,
      ttsMinutesPerMonth: 5,
      voiceCloneSlots: 0,
      peopleLimit: 2
    },
    features: [
      '50 mensagens por mês',
      '5 minutos de TTS',
      'Até 2 pessoas',
      'Suporte básico'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPriceUSD: 19.99,
    monthlyPriceBRL: 99.99,
    limits: {
      messagesPerMonth: 1000,
      ttsMinutesPerMonth: 60,
      voiceCloneSlots: 5,
      peopleLimit: 10
    },
    features: [
      '1000 mensagens por mês',
      '60 minutos de TTS',
      'Até 10 pessoas',
      'Clonagem de voz',
      'Análises avançadas',
      'Suporte prioritário'
    ]
  },
  {
    id: 'family',
    name: 'Family',
    monthlyPriceUSD: 39.99,
    monthlyPriceBRL: 199.99,
    limits: {
      messagesPerMonth: -1, // Unlimited
      ttsMinutesPerMonth: 180,
      voiceCloneSlots: 15,
      peopleLimit: -1 // Unlimited
    },
    features: [
      'Mensagens ilimitadas',
      '180 minutos de TTS',
      'Pessoas ilimitadas',
      'Clonagem de voz avançada',
      'Análises premium',
      'Histórico completo',
      'Suporte dedicado'
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