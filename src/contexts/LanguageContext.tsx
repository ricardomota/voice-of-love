import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Language = 
  | 'en'    // English
  | 'pt-BR' // Portuguese (Brazil)
  | 'es'    // Spanish
  | 'fr'    // French
  | 'de'    // German
  | 'it'    // Italian
  | 'ru'    // Russian
  | 'ja'    // Japanese
  | 'zh-CN' // Chinese (Simplified)
  | 'zh-TW' // Chinese (Traditional)
  | 'ko'    // Korean
  | 'ar'    // Arabic
  | 'hi'    // Hindi
  | 'nl'    // Dutch
  | 'sv'    // Swedish
  | 'no'    // Norwegian
  | 'da'    // Danish
  | 'fi';   // Finnish

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load user's saved language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        // First, check localStorage for saved preference
        const savedLanguage = localStorage.getItem('eterna_language') as Language;
        const supportedLanguages: Language[] = [
          'en', 'pt-BR', 'es', 'fr', 'de', 'it', 'ru', 'ja', 
          'zh-CN', 'zh-TW', 'ko', 'ar', 'hi', 'nl', 'sv', 'no', 'da', 'fi'
        ];
        if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage);
        }

        // Then check if user is authenticated and has database preference
        const { data: user } = await supabase.auth.getUser();
        
        if (user.user) {
          const { data: settings } = await supabase
            .from('user_settings')
            .select('ui_language')
            .eq('user_id', user.user.id)
            .maybeSingle();

          if (settings?.ui_language) {
            const dbLanguage = settings.ui_language as Language;
            setCurrentLanguage(dbLanguage);
            localStorage.setItem('eterna_language', dbLanguage);
          } else if (!savedLanguage) {
            // Only detect browser language if no preference exists at all
            detectBrowserLanguage();
          }
        } else if (!savedLanguage) {
          // For non-authenticated users without saved preference, detect browser language
          detectBrowserLanguage();
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
        // Only fallback to browser detection if no localStorage preference exists
        const savedLanguage = localStorage.getItem('eterna_language') as Language;
        const supportedLanguages: Language[] = [
          'en', 'pt-BR', 'es', 'fr', 'de', 'it', 'ru', 'ja', 
          'zh-CN', 'zh-TW', 'ko', 'ar', 'hi', 'nl', 'sv', 'no', 'da', 'fi'
        ];
        if (!savedLanguage || !supportedLanguages.includes(savedLanguage)) {
          detectBrowserLanguage();
        }
      }
    };

    const detectBrowserLanguage = () => {
      const browserLang = navigator.language.toLowerCase();
      const browserLangs = navigator.languages?.map(lang => lang.toLowerCase()) || [browserLang];
      
      // Language detection mapping
      const languageMap: Record<string, Language> = {
        'pt': 'pt-BR',
        'pt-br': 'pt-BR',
        'es': 'es',
        'fr': 'fr',
        'de': 'de',
        'it': 'it',
        'ru': 'ru',
        'ja': 'ja',
        'zh': 'zh-CN',
        'zh-cn': 'zh-CN',
        'zh-tw': 'zh-TW',
        'ko': 'ko',
        'ar': 'ar',
        'hi': 'hi',
        'nl': 'nl',
        'sv': 'sv',
        'no': 'no',
        'da': 'da',
        'fi': 'fi'
      };
      
      // Check if any of the browser languages match our supported languages
      for (const lang of browserLangs) {
        // Direct match
        if (languageMap[lang]) {
          const detectedLanguage = languageMap[lang];
          setCurrentLanguage(detectedLanguage);
          localStorage.setItem('eterna_language', detectedLanguage);
          return;
        }
        
        // Check language prefix
        const prefix = lang.split('-')[0];
        if (languageMap[prefix]) {
          const detectedLanguage = languageMap[prefix];
          setCurrentLanguage(detectedLanguage);
          localStorage.setItem('eterna_language', detectedLanguage);
          return;
        }
      }
      
      // Default to English if no supported language is detected
      const defaultLanguage = 'en';
      setCurrentLanguage(defaultLanguage);
      localStorage.setItem('eterna_language', defaultLanguage);
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

      // Update state immediately
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

  const value = {
    currentLanguage,
    setLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};