import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Group, PlayFilled, Security } from '@carbon/icons-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onLogin: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      badge: "AI-powered memory preservation",
      headline: "Keep precious memories alive forever ✨",
      subhead: "Create interactive memories that capture your loved one's voice, personality, and wisdom. Experience meaningful conversations powered by their authentic stories and cherished moments.",
      tryFree: "Get Started",
      seePricing: "See Pricing",
      trustBadge: "Secure & Private by Design",
      altText: "Family sharing warm moments together"
    },
    'pt-BR': {
      badge: "Preservação de memórias com IA",
      headline: "Mantenha memórias preciosas vivas para sempre ✨",
      subhead: "Crie memórias interativas que capturam a voz, personalidade e sabedoria dos seus entes queridos. Tenha conversas significativas alimentadas por suas histórias autênticas e momentos especiais.",
      tryFree: "Começar",
      seePricing: "Ver Preços",
      trustBadge: "Seguro e Privado por Design",
      altText: "Família compartilhando momentos especiais"
    },
    es: {
      badge: "Preservación de memorias con IA",
      headline: "Mantén memorias preciosas vivas para siempre ✨",
      subhead: "Crea memorias interactivas que capturan la voz, personalidad y sabiduría de tus seres queridos. Ten conversaciones significativas alimentadas por sus historias auténticas y momentos especiales.",
      tryFree: "Empezar",
      seePricing: "Ver Precios",
      trustBadge: "Seguro y Privado por Diseño",
      altText: "Familia compartilhando momentos especiales"
    }
  };
  return content[language as keyof typeof content] || content.en;
};
export const HeroSection: React.FC<HeroSectionProps> = ({
  onTryFree,
  onSeePricing,
  onLogin
}) => {
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  
  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const {
          count,
          error
        } = await supabase.from('user_settings').select('*', {
          count: 'exact',
          head: true
        });
        if (error) {
          console.error('Error getting user count:', error);
          setUserCount(0);
        } else {
          setUserCount(count || 0);
        }
      } catch (error) {
        console.error('Error in checkUserCount:', error);
        setUserCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserCount();
  }, []);
  
  const isWaitlistMode = userCount >= 10;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
      
      {/* Main content */}
      <div className="relative w-full max-w-4xl mx-auto px-6 py-24 text-center">
        
        {/* Status badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-muted-foreground text-sm font-medium">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            {content.badge}
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-[1.1] tracking-[-0.02em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {content.headline.replace(' ✨', '')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-16 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {content.subhead}
        </motion.p>

        {/* CTA buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {!isLoading && (
            <>
              <Button 
                onClick={isWaitlistMode ? onTryFree : onLogin}
                size="lg"
                className="px-6 py-3 text-sm font-medium bg-foreground hover:bg-foreground/90 text-background rounded-lg transition-all duration-200"
              >
                {content.tryFree}
              </Button>
              
              <Button 
                onClick={onSeePricing}
                variant="ghost"
                size="lg"
                className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {content.seePricing}
              </Button>
            </>
          )}
        </motion.div>

        {/* Trust indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70"
        >
          <Security className="w-3 h-3" />
          <span>{content.trustBadge}</span>
        </motion.div>
      </div>
    </section>
  );
};