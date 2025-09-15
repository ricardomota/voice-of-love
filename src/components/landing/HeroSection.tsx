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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ultra-clean background with subtle depth */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.05),transparent_70%)]" />
      </div>
      
      {/* Minimal floating orbs */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/2 rounded-full blur-[80px]"
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Main content */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-32 text-center">
        
        {/* Status badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium">
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
            {content.badge}
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.h1 
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.05] tracking-[-0.025em] bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {content.headline.replace(' ✨', '')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {content.subhead}
        </motion.p>

        {/* CTA buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {!isLoading && (
            <>
              <Button 
                onClick={isWaitlistMode ? onTryFree : onLogin}
                size="lg"
                className="group relative px-8 py-4 text-base font-medium bg-foreground hover:bg-foreground/90 text-background rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <span className="relative z-10">{content.tryFree}</span>
                <motion.div
                  className="ml-2 relative z-10"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.div>
              </Button>
              
              <Button 
                onClick={onSeePricing}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-base font-medium border border-border hover:border-foreground/20 hover:bg-muted/50 rounded-xl transition-all duration-300"
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
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Security className="w-4 h-4" />
          <span className="font-medium">{content.trustBadge}</span>
        </motion.div>
      </div>
    </section>
  );
};