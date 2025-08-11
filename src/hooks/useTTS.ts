import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TTSOptions {
  language?: string;
  voiceSettings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export const useTTS = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSpeech = useCallback(async (
    text: string, 
    options: TTSOptions = {}
  ) => {
    if (!text.trim()) return null;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text.trim(),
          language: options.language || 'en',
          voiceSettings: options.voiceSettings
        }
      });

      if (error) {
        // Handle limit reached
        if (error.message?.includes('tts_limit_reached') || data?.error === 'tts_limit_reached') {
          throw new Error('TTS_LIMIT_REACHED');
        }
        throw error;
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Convert base64 to blob URL
      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });

      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioUrl,
        voiceId: data.voiceId,
        useClonedVoice: data.useClonedVoice,
        duration: data.duration,
        remainingSeconds: data.remainingSeconds
      };

    } catch (error) {
      console.error('TTS generation error:', error);
      
      if (error instanceof Error) {
        if (error.message === 'TTS_LIMIT_REACHED') {
          throw error; // Re-throw to be handled by calling component
        }
        
        toast({
          title: "Voice generation failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  return {
    generateSpeech,
    isGenerating
  };
};