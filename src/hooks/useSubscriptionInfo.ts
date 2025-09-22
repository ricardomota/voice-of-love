import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionEntitlements {
  chat_limit_monthly: number;
  voice_minutes_monthly: number;
  demo_seconds_total: number;
  demo_requires_onboarding: boolean;
  generic_voices_enabled: boolean;
  personalized_voice_enabled: boolean;
}

interface SubscriptionUsage {
  chat_interactions_used: number;
  voice_seconds_used: number;
  free_demo_seconds_used: number;
}

interface CapacityInfo {
  plan_capacity: {
    name: string;
    max_slots: number;
  };
  buffer_slots: number;
  slots_active: number;
  slots_available: number;
}

interface SubscriptionInfo {
  user_id?: string;
  email?: string;
  email_verified?: boolean;
  plan: 'free' | 'essential' | 'complete';
  entitlements: SubscriptionEntitlements;
  usage: SubscriptionUsage;
  capacity: CapacityInfo;
}

export const useSubscriptionInfo = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setSubscriptionInfo(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke('subscription-info');
      
      if (error) {
        throw error;
      }

      setSubscriptionInfo(data);
    } catch (err) {
      console.error('Failed to fetch subscription info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription info');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionInfo();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchSubscriptionInfo();
        } else if (event === 'SIGNED_OUT') {
          setSubscriptionInfo(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchSubscriptionInfo]);

  // Helper functions for common checks
  const canUseVoiceDemo = useCallback(() => {
    if (!subscriptionInfo || subscriptionInfo.plan !== 'free') return false;
    
    const { demo_seconds_total } = subscriptionInfo.entitlements;
    const { free_demo_seconds_used } = subscriptionInfo.usage;
    
    return free_demo_seconds_used < demo_seconds_total;
  }, [subscriptionInfo]);

  const canUseGenericVoice = useCallback(() => {
    if (!subscriptionInfo) return false;
    
    const { generic_voices_enabled, voice_minutes_monthly } = subscriptionInfo.entitlements;
    const { voice_seconds_used } = subscriptionInfo.usage;
    
    return generic_voices_enabled && (voice_minutes_monthly === -1 || voice_seconds_used < voice_minutes_monthly * 60);
  }, [subscriptionInfo]);

  const canUsePersonalizedVoice = useCallback(() => {
    if (!subscriptionInfo) return false;
    
    const { personalized_voice_enabled } = subscriptionInfo.entitlements;
    return personalized_voice_enabled;
  }, [subscriptionInfo]);

  const canCreatePersonalizedVoice = useCallback(() => {
    if (!subscriptionInfo) return false;
    
    return canUsePersonalizedVoice() && subscriptionInfo.capacity.slots_available > 0;
  }, [subscriptionInfo, canUsePersonalizedVoice]);

  const canUseChat = useCallback(() => {
    if (!subscriptionInfo) return false;
    
    const { chat_limit_monthly } = subscriptionInfo.entitlements;
    const { chat_interactions_used } = subscriptionInfo.usage;
    
    return chat_limit_monthly === -1 || chat_interactions_used < chat_limit_monthly;
  }, [subscriptionInfo]);

  const getRemainingDemoSeconds = useCallback(() => {
    if (!subscriptionInfo || subscriptionInfo.plan !== 'free') return 0;
    
    const { demo_seconds_total } = subscriptionInfo.entitlements;
    const { free_demo_seconds_used } = subscriptionInfo.usage;
    
    return Math.max(0, demo_seconds_total - free_demo_seconds_used);
  }, [subscriptionInfo]);

  const getRemainingChatInteractions = useCallback(() => {
    if (!subscriptionInfo) return 0;
    
    const { chat_limit_monthly } = subscriptionInfo.entitlements;
    const { chat_interactions_used } = subscriptionInfo.usage;
    
    if (chat_limit_monthly === -1) return -1; // Unlimited
    
    return Math.max(0, chat_limit_monthly - chat_interactions_used);
  }, [subscriptionInfo]);

  const getRemainingVoiceMinutes = useCallback(() => {
    if (!subscriptionInfo) return 0;
    
    const { voice_minutes_monthly } = subscriptionInfo.entitlements;
    const { voice_seconds_used } = subscriptionInfo.usage;
    
    if (voice_minutes_monthly === 0) return 0;
    if (voice_minutes_monthly === -1) return -1; // Unlimited
    
    const remainingSeconds = Math.max(0, voice_minutes_monthly * 60 - voice_seconds_used);
    return Math.floor(remainingSeconds / 60);
  }, [subscriptionInfo]);

  return {
    subscriptionInfo,
    loading,
    error,
    refresh: fetchSubscriptionInfo,
    
    // Helper functions
    canUseVoiceDemo,
    canUseGenericVoice,
    canUsePersonalizedVoice,
    canCreatePersonalizedVoice,
    canUseChat,
    
    // Remaining usage
    getRemainingDemoSeconds,
    getRemainingChatInteractions,
    getRemainingVoiceMinutes,
    
    // Slot availability
    slotsAvailable: subscriptionInfo?.capacity.slots_available || 0,
    isSlotAvailable: (subscriptionInfo?.capacity.slots_available || 0) > 0
  };
};