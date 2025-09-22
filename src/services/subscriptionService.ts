import { supabase } from '@/integrations/supabase/client';

export interface VoiceDemoResponse {
  audio_content: string;
  remaining_seconds: number;
  demo_text: string;
}

export interface VoiceDemoConsumeResponse {
  remaining_seconds: number;
  demo_exhausted: boolean;
}

export interface VoicePersonalizeResponse {
  status: 'created' | 'exists' | 'queued';
  voice_id?: string;
  eleven_voice_id?: string;
  message: string;
}

export interface VoiceWaitlistResponse {
  status: 'queued' | 'already_queued' | 'not_found' | 'processing' | 'notified';
  waitlist_id?: string;
  position?: number;
  message: string;
  created_at?: string;
  processed_at?: string;
}

export interface ChatResponse {
  reply: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  interactions_remaining: number;
}

export class SubscriptionService {
  /**
   * Play voice demo (Free plan only)
   */
  static async playVoiceDemo(): Promise<VoiceDemoResponse> {
    const { data, error } = await supabase.functions.invoke('voice-demo', {
      body: { action: 'start' }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Consume demo seconds after playback
   */
  static async consumeVoiceDemo(seconds_played: number): Promise<VoiceDemoConsumeResponse> {
    const { data, error } = await supabase.functions.invoke('voice-demo', {
      body: { action: 'consume', seconds_played }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Create personalized voice (Complete plan only)
   */
  static async createPersonalizedVoice(params: {
    audio_files: string[];
    voice_name?: string;
    description?: string;
  }): Promise<VoicePersonalizeResponse> {
    const { data, error } = await supabase.functions.invoke('voice-personalize', {
      body: params
    });

    if (error) throw error;
    return data;
  }

  /**
   * Join voice slot waitlist
   */
  static async joinVoiceWaitlist(name: string, email: string): Promise<VoiceWaitlistResponse> {
    const { data, error } = await supabase.functions.invoke('voice-waitlist', {
      body: { action: 'join', name, email }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Check waitlist status
   */
  static async checkWaitlistStatus(email: string): Promise<VoiceWaitlistResponse> {
    const { data, error } = await supabase.functions.invoke('voice-waitlist', {
      body: { action: 'status', email }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Send chat message with usage tracking
   */
  static async sendChatMessage(params: {
    messages: Array<{ role: string; content: string }>;
    persona_id?: string;
  }): Promise<ChatResponse> {
    const { data, error } = await supabase.functions.invoke('chat-send', {
      body: params
    });

    if (error) throw error;
    return data;
  }

  /**
   * Generate voice using TTS (Essential/Complete plans)
   */
  static async generateVoice(params: {
    text: string;
    voice_id: string;
    mode: 'generic' | 'personalized';
  }): Promise<{ audio_content: string; seconds_billed: number }> {
    // This would integrate with your existing TTS functionality
    // For now, using the existing text-to-speech function
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text: params.text, voice: params.voice_id }
    });

    if (error) throw error;
    
    // Estimate duration for billing (rough calculation)
    const estimatedSeconds = Math.ceil(params.text.length / 10); // ~10 chars per second
    
    return {
      audio_content: data.audioContent,
      seconds_billed: estimatedSeconds
    };
  }

  /**
   * Create Stripe checkout session for subscription
   */
  static async createCheckoutSession(planId: 'essential' | 'complete'): Promise<{ url: string }> {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { plan: planId }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Access Stripe customer portal for subscription management
   */
  static async getCustomerPortalUrl(): Promise<{ url: string }> {
    const { data, error } = await supabase.functions.invoke('customer-portal');

    if (error) throw error;
    return data;
  }

  /**
   * Refresh subscription status (calls check-subscription)
   */
  static async refreshSubscriptionStatus(): Promise<any> {
    const { data, error } = await supabase.functions.invoke('check-subscription');

    if (error) throw error;
    return data;
  }
}