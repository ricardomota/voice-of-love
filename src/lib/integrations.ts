// Step 0: Integration adapters with mock functionality and proper delays
// All integrations use consistent IDs and mock delays as specified

import { supabase } from "@/integrations/supabase/client";

// Types for the integration system
export interface Person {
  id: string;
  display_name: string;
  avatar_url?: string;
  consent_status: 'none' | 'on_file' | 'expired';
  created_at: string;
}

export interface Memory {
  id: string;
  person_id: string;
  title: string;
  kind: 'audio' | 'image' | 'postcard';
  preview_url?: string;
  media_url?: string;
  transcript?: string;
  mood_tags: string[];
  is_private: boolean;
  created_at: string;
}

export interface Consent {
  id: string;
  person_id: string;
  recorder: string;
  type: 'audio' | 'written' | 'signature';
  consent_data?: any;
  timestamp: string;
  expires_at?: string;
}

export interface EventPayload {
  [key: string]: any;
}

// Mock delay helper
const mockDelay = (min = 800, max = 1200) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

// Auth integrations
export const authIntegrations = {
  // INTG_AUTH_SIGNIN
  async signIn(email: string, password: string) {
    await mockDelay();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // INTG_AUTH_SIGNUP  
  async signUp(email: string, password: string) {
    await mockDelay();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { data, error };
  },

  // INTG_AUTH_SESSION
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }
};

// Storage/Upload integrations
export const storageIntegrations = {
  // INTG_UPLOAD_IMAGE
  async uploadImage(file: File): Promise<{ url?: string; error?: string }> {
    await mockDelay(1000, 2000);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
  },

  // INTG_UPLOAD_AUDIO
  async uploadAudio(file: File): Promise<{ url?: string; error?: string }> {
    await mockDelay(1500, 3000);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `audio/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }
};

// Preview generation integrations  
export const previewIntegrations = {
  // INTG_GENERATE_IMAGE_PREVIEW
  async generateImagePreview(imageUrl: string, style: string, intensity: number): Promise<{ previewUrl?: string; error?: string }> {
    await mockDelay(2000, 4000);
    
    // Mock preview generation - in reality this would call AI services
    console.log('Mock: Generating image preview', { imageUrl, style, intensity });
    
    // Return the original image with a mock watermark indicator
    return { 
      previewUrl: imageUrl + '?preview=demo&style=' + style + '&intensity=' + intensity 
    };
  },

  // INTG_GENERATE_AUDIO_PREVIEW  
  async generateAudioPreview(audioUrl: string, style: string, intensity: number): Promise<{ previewUrl?: string; transcript?: string; error?: string }> {
    await mockDelay(3000, 5000);
    
    // Mock preview generation
    console.log('Mock: Generating audio preview', { audioUrl, style, intensity });
    
    return { 
      previewUrl: audioUrl + '?preview=demo&style=' + style,
      transcript: "This is a mock transcript of the audio preview. The actual implementation would use speech-to-text services."
    };
  }
};

// Memory management integrations
export const memoryIntegrations = {
  // INTG_SAVE_MEMORY
  async saveMemory(memory: Omit<Memory, 'id' | 'created_at'>): Promise<{ memory?: Memory; error?: string }> {
    await mockDelay();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('eterna_memories')
        .insert({
          ...memory,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      return { memory: data as Memory };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to save memory' };
    }
  },

  // INTG_LIST_MEMORIES
  async listMemories(personId?: string, moodFilter?: string): Promise<{ memories: Memory[]; error?: string }> {
    await mockDelay();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('eterna_memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (personId) {
        query = query.eq('person_id', personId);
      }

      if (moodFilter) {
        query = query.contains('mood_tags', [moodFilter]);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { memories: (data || []) as Memory[] };
    } catch (error) {
      return { memories: [], error: error instanceof Error ? error.message : 'Failed to list memories' };
    }
  },

  // INTG_GET_MEMORY
  async getMemory(memoryId: string): Promise<{ memory?: Memory; error?: string }> {
    await mockDelay();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('eterna_memories')
        .select('*')
        .eq('id', memoryId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return { memory: data as Memory };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to get memory' };
    }
  }
};

// Consent management integrations
export const consentIntegrations = {
  // INTG_SAVE_CONSENT_RECORD
  async saveConsent(consent: Omit<Consent, 'id' | 'timestamp'>): Promise<{ consent?: Consent; error?: string }> {
    await mockDelay();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('consents')
        .insert({
          ...consent,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update person's consent status
      await supabase
        .from('persons')
        .update({ consent_status: 'on_file' })
        .eq('id', consent.person_id)
        .eq('user_id', user.id);

      return { consent: data as Consent };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to save consent' };
    }
  },

  // INTG_GET_CONSENT_STATUS
  async getConsentStatus(personId: string): Promise<{ status: 'none' | 'on_file' | 'expired'; consents: Consent[]; error?: string }> {
    await mockDelay();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: consents, error: consentsError } = await supabase
        .from('consents')
        .select('*')
        .eq('person_id', personId)
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (consentsError) throw consentsError;

      const { data: person, error: personError } = await supabase
        .from('persons')
        .select('consent_status')
        .eq('id', personId)
        .eq('user_id', user.id)
        .single();

      if (personError) throw personError;

      return { 
        status: person.consent_status as 'none' | 'on_file' | 'expired',
        consents: (consents || []) as Consent[]
      };
    } catch (error) {
      return { 
        status: 'none', 
        consents: [], 
        error: error instanceof Error ? error.message : 'Failed to get consent status' 
      };
    }
  }
};

// Analytics integration
export const analyticsIntegrations = {
  // INTG_TRACK_EVENT
  async trackEvent(name: string, payload: EventPayload = {}, sessionId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const eventData = {
        name,
        payload_json: payload,
        user_id: user?.id || null,
        anon_id: !user ? sessionId || crypto.randomUUID() : null,
        session_id: sessionId || crypto.randomUUID()
      };

      const { error } = await supabase
        .from('event_logs')
        .insert(eventData);

      if (error) throw error;

      // Also log to console in development
      console.log('Analytics Event:', name, payload);

      return { success: true };
    } catch (error) {
      console.error('Analytics error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to track event' 
      };
    }
  }
};

// Feature flags integration
export const featureFlagsIntegrations = {
  // INTG_FLAGS_GET
  async getFlags(userId?: string): Promise<{ flags: Record<string, string>; error?: string }> {
    await mockDelay(200, 400);
    
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('key, variant, enabled, user_targeting')
        .eq('enabled', true);

      if (error) throw error;

      const flags: Record<string, string> = {};
      
      data?.forEach(flag => {
        // Check for user-specific overrides
        if (userId && flag.user_targeting && flag.user_targeting[userId]) {
          flags[flag.key] = flag.user_targeting[userId];
        } else {
          flags[flag.key] = flag.variant;
        }
      });

      return { flags };
    } catch (error) {
      return { 
        flags: {
          FF_DEMO_LENGTH: 'long_45s',
          FF_RITUAL_COPY: 'create_memory',
          FF_CONSENT_BADGE_VIS: 'visible'
        },
        error: error instanceof Error ? error.message : 'Failed to get feature flags' 
      };
    }
  }
};

// Export all integrations
export const integrations = {
  auth: authIntegrations,
  storage: storageIntegrations,
  previews: previewIntegrations,
  memories: memoryIntegrations,
  consent: consentIntegrations,
  analytics: analyticsIntegrations,
  flags: featureFlagsIntegrations
};