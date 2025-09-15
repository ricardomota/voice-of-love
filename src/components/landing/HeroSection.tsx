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
    <>
      {/* Modern Hero Section - Maurice & Nora Style */}
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-24 sm:py-32 lg:py-40 overflow-hidden">
        
        {/* Minimalist Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-muted/20" />
        
        {/* Subtle Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/2 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Main Content Container */}
        <div className="relative w-full max-w-6xl mx-auto text-center">
          
          {/* Elegant Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary font-medium text-sm backdrop-blur-sm">
              ✨ {content.badge}
            </div>
          </motion.div>

          {/* Modern Headline - Better Typography */}
          <motion.h1 
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight mb-6 sm:mb-8 lg:mb-10 max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {content.headline}
          </motion.h1>

          {/* Subtitle - Modern Typography */}
          <motion.p 
            className="font-inter text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light mb-10 sm:mb-12 lg:mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {content.subhead}
          </motion.p>

          {/* Modern CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {!isLoading && (
              <>
                <Button 
                  onClick={isWaitlistMode ? onTryFree : onLogin}
                  size="lg"
                  className="group px-8 py-4 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  {content.tryFree}
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </Button>
                
                <Button 
                  onClick={onSeePricing}
                  variant="outline"
                  size="lg"
                  className="group px-8 py-4 text-base font-medium border-2 border-border/30 hover:border-primary/60 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl backdrop-blur-sm"
                >
                  {content.seePricing}
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  >
                    →
                  </motion.div>
                </Button>
              </>
            )}
          </motion.div>

          {/* Simple Trust Badge */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/8 border border-primary/15 text-primary font-medium text-sm backdrop-blur-sm">
              <Security className="w-4 h-4" />
              {content.trustBadge}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};