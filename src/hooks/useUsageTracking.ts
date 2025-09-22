import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { paymentsService } from '@/services/paymentsService';

interface UsageData {
  messagesUsed: number;
  messagesLimit: number;
  ttsUsed: number;
  ttsLimit: number;
  planId: string;
}

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData>({
    messagesUsed: 0,
    messagesLimit: 5,
    ttsUsed: 0,
    ttsLimit: 60,
    planId: 'free'
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      if (!user) return;

      // Get current period
      const now = new Date();
      const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

      // First check if user has subscription
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('subscription_tier, subscribed')
        .eq('user_id', user.id)
        .maybeSingle();

      // Determine plan ID from subscription or fallback to user_settings
      let planId = 'free';
      if (subscriber?.subscribed && subscriber.subscription_tier) {
        planId = subscriber.subscription_tier.toLowerCase();
      } else {
        // Fallback to user_settings
        const { data: settings } = await supabase
          .from('user_settings')
          .select('plan_id')
          .eq('user_id', user.id)
          .maybeSingle();
        planId = settings?.plan_id ?? 'free';
      }

      // Get plan limits from paymentsService
      const plan = paymentsService.getPlan(planId);
      const limits = plan ? plan.limits : { messagesPerMonth: 50, ttsMinutesPerMonth: 5 };

      // Get current usage
      const { data: usageData } = await supabase
        .from('usage_counters')
        .select('messages_used, tts_seconds_used')
        .eq('user_id', user.id)
        .eq('period', period)
        .maybeSingle();

      setUsage({
        messagesUsed: usageData?.messages_used ?? 0,
        messagesLimit: limits.messagesPerMonth === -1 ? 999999 : limits.messagesPerMonth,
        ttsUsed: Math.floor((usageData?.tts_seconds_used ?? 0) / 60), // Convert to minutes
        ttsLimit: limits.ttsMinutesPerMonth === -1 ? 999999 : limits.ttsMinutesPerMonth,
        planId
      });

    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const refreshUsage = useCallback(() => {
    setIsLoading(true);
    fetchUsage();
  }, [fetchUsage]);

  const canSendMessage = usage.messagesUsed < usage.messagesLimit;
  const canUseTTS = usage.ttsUsed < usage.ttsLimit;

  return {
    usage,
    isLoading,
    refreshUsage,
    canSendMessage,
    canUseTTS
  };
};