import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsageData {
  messagesUsed: number;
  messagesLimit: number;
  ttsUsed: number;
  ttsLimit: number;
  planId: string;
}

export const useUsageTracking = () => {
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
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get current period
      const now = new Date();
      const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

      // Get user settings and plan
      const { data: settings } = await supabase
        .from('user_settings')
        .select('plan_id')
        .eq('user_id', user.user.id)
        .maybeSingle();

      const planId = settings?.plan_id ?? 'free';

      // Get plan limits
      const { data: plan } = await supabase
        .from('plans')
        .select('limits')
        .eq('plan_id', planId)
        .maybeSingle();

      const defaultLimits = { messages_per_month: 5, tts_seconds_per_month: 60 };
      const limits = (plan?.limits as any) ?? defaultLimits;

      // Get current usage
      const { data: usageData } = await supabase
        .from('usage_counters')
        .select('messages_used, tts_seconds_used')
        .eq('user_id', user.user.id)
        .eq('period', period)
        .maybeSingle();

      setUsage({
        messagesUsed: usageData?.messages_used ?? 0,
        messagesLimit: limits.messages_per_month ?? defaultLimits.messages_per_month,
        ttsUsed: usageData?.tts_seconds_used ?? 0,
        ttsLimit: limits.tts_seconds_per_month ?? defaultLimits.tts_seconds_per_month,
        planId
      });

    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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