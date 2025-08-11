import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Language = 'en' | 'pt-BR' | 'es';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load user's saved language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        
        if (user.user) {
          const { data: settings } = await supabase
            .from('user_settings')
            .select('ui_language')
            .eq('user_id', user.user.id)
            .maybeSingle();

          if (settings?.ui_language) {
            setCurrentLanguage(settings.ui_language as Language);
          }
        } else {
          // For non-authenticated users, try to detect browser language
          const browserLang = navigator.language.toLowerCase();
          if (browserLang.startsWith('pt')) {
            setCurrentLanguage('pt-BR');
          } else if (browserLang.startsWith('es')) {
            setCurrentLanguage('es');
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = useCallback(async (language: Language) => {
    if (language === currentLanguage) return;

    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user) {
        // Save to database for authenticated users
        const { error } = await supabase
          .from('user_settings')
          .upsert(
            { 
              user_id: user.user.id, 
              ui_language: language 
            },
            { 
              onConflict: 'user_id',
              ignoreDuplicates: false 
            }
          );

        if (error) throw error;
      }

      setCurrentLanguage(language);
      
      // Store in localStorage as backup
      localStorage.setItem('eterna_language', language);
      
    } catch (error) {
      console.error('Error saving language preference:', error);
      toast({
        title: "Error",
        description: "Failed to save language preference",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, toast]);

  return {
    currentLanguage,
    setLanguage,
    isLoading,
  };
};