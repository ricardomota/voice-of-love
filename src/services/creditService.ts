import { supabase } from '@/integrations/supabase/client';

export interface CreditBalance {
  user_id: string;
  credits_available: number;
  credits_reserved: number;
  lifetime_spent: number;
  last_updated: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  delta: number;
  reason: 'pack_purchase' | 'subscription_monthly_grant' | 'usage_charge' | 'refund' | 'promo_grant' | 'admin_adjust';
  sku?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UsageEvent {
  id: string;
  user_id: string;
  feature: 'voice_clone' | 'tts' | 'transcription' | 'chat' | 'fingerprint' | 'verify' | 'storage';
  quantity: number;
  credits_charged: number;
  status: 'reserved' | 'completed' | 'failed';
  ref_id?: string;
  created_at: string;
}

export interface EternaPlan {
  code: string;
  name: Record<string, string>;
  monthly_price_usd: number;
  monthly_price_brl: number;
  monthly_credits: number;
  limits: Record<string, any>;
  perks: Record<string, any>;
  rollover_pct: number;
}

export interface CreditPack {
  sku: string;
  name: Record<string, string>;
  credits: number;
  price_usd: number;
  price_brl: number;
  best_value: boolean;
  billing_frequency: 'one-time' | 'monthly' | 'yearly';
  yearly_discount_pct: number;
}

export interface FeaturePricing {
  feature: string;
  credits_per_unit: number;
  unit_description: string;
}

export const creditService = {
  /**
   * Get user's credit balance
   */
  async getCreditBalance(): Promise<CreditBalance | null> {
    const { data, error } = await supabase
      .from('credit_balance')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching credit balance:', error);
      return null;
    }

    return data;
  },

  /**
   * Get user's credit transactions
   */
  async getCreditTransactions(limit = 50): Promise<CreditTransaction[]> {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching credit transactions:', error);
      return [];
    }

    return (data || []) as CreditTransaction[];
  },

  /**
   * Get user's usage events
   */
  async getUsageEvents(limit = 50): Promise<UsageEvent[]> {
    const { data, error } = await supabase
      .from('usage_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching usage events:', error);
      return [];
    }

    return (data || []) as UsageEvent[];
  },

  /**
   * Get all available plans
   */
  async getPlans(): Promise<EternaPlan[]> {
    const { data, error } = await supabase
      .from('eterna_plans')
      .select('*')
      .order('monthly_price_usd', { ascending: true });

    if (error) {
      console.error('Error fetching plans:', error);
      return [];
    }

    return (data || []) as EternaPlan[];
  },

  /**
   * Get all available credit packs
   */
  async getCreditPacks(): Promise<CreditPack[]> {
    const { data, error } = await supabase
      .from('credit_packs')
      .select('*')
      .order('credits', { ascending: true });

    if (error) {
      console.error('Error fetching credit packs:', error);
      return [];
    }

    return (data || []) as CreditPack[];
  },

  /**
   * Get feature pricing
   */
  async getFeaturePricing(): Promise<FeaturePricing[]> {
    const { data, error } = await supabase
      .from('feature_pricing')
      .select('*')
      .order('feature');

    if (error) {
      console.error('Error fetching feature pricing:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Charge credits for a feature usage
   */
  async chargeCredits(
    feature: string,
    quantity: number,
    refId?: string
  ): Promise<{ success: boolean; error?: string; required?: number; available?: number }> {
    try {
      const { data, error } = await supabase.rpc('charge_credits', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_feature: feature,
        p_quantity: quantity,
        p_ref_id: refId
      });

      if (error) {
        console.error('Error charging credits:', error);
        return { success: false, error: error.message };
      }

      return data as { success: boolean; error?: string; required?: number; available?: number };
    } catch (error) {
      console.error('Exception charging credits:', error);
      return { success: false, error: 'Failed to charge credits' };
    }
  },

  /**
   * Create Stripe checkout session for plan or pack
   */
  async createCheckoutSession(
    type: 'plan' | 'pack',
    sku: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-billing-checkout', {
        body: { 
          type, 
          sku, 
          success_url: successUrl,
          cancel_url: cancelUrl 
        }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        return { error: error.message };
      }

      return data;
    } catch (error) {
      console.error('Exception creating checkout session:', error);
      return { error: 'Failed to create checkout session' };
    }
  },

  /**
   * Get Stripe customer portal URL
   */
  async getCustomerPortalUrl(): Promise<{ url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        console.error('Error getting customer portal URL:', error);
        return { error: error.message };
      }

      return data;
    } catch (error) {
      console.error('Exception getting customer portal URL:', error);
      return { error: 'Failed to get customer portal URL' };
    }
  },

  /**
   * Format currency based on locale
   */
  formatCurrency(amount: number, currency: 'USD' | 'BRL', locale: string): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  },

  /**
   * Get currency for locale
   */
  getCurrencyForLocale(locale: string): 'USD' | 'BRL' {
    return locale === 'pt-BR' ? 'BRL' : 'USD';
  }
};