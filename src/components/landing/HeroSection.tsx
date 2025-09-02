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
      headline: "Where memories become eternal. ✨",
      subhead: "Preserve the essence of your loved ones through AI that captures their personality, stories, and wisdom forever.",
      tryFree: "Try Eterna Free",
      seePricing: "See Pricing",
      altText: "Family sharing warm moments together"
    },
    'pt-BR': {
      headline: "Onde lembranças se tornam eternas✨",
      subhead: "Preserve a essência dos seus entes queridos através de IA que captura sua personalidade, histórias e sabedoria para sempre.",
      tryFree: "Testar Grátis",
      seePricing: "Ver Preços",
      altText: "Família compartilhando momentos especiais"
    },
    es: {
      headline: "Donde los recuerdos se vuelven eternos. ✨",
      subhead: "Preserva la esencia de tus seres queridos a través de IA que captura su personalidad, historias y sabiduría para siempre.",
      tryFree: "Probar Gratis",
      seePricing: "Ver Precios",
      altText: "Familia compartiendo momentos especiales"
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
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-32 overflow-hidden">
        
        {/* Minimalist Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-muted/30" />
        
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
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/5 border border-primary/10 text-primary font-medium text-sm">
              ✨ Betrouwbaar AI platform
            </div>
          </motion.div>

          {/* Large Modern Headline */}
          <motion.h1 
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground leading-[1.1] tracking-tight mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Lembranças se tornam{" "}
            <span className="block text-primary">eternas ✨</span>
          </motion.h1>

          {/* Elegant Subtitle */}
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground max-w-5xl mx-auto leading-relaxed font-light mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Preserve a essência dos seus entes queridos através de IA que captura personalidade, histórias e sabedoria para sempre.
          </motion.p>

          {/* Modern CTA Buttons - Maurice & Nora Style */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center mb-16 sm:mb-20 lg:mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {!isLoading && (
              <>
                <Button 
                  onClick={isWaitlistMode ? onTryFree : onLogin}
                  size="lg"
                  className="group px-10 py-6 text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                >
                  {isWaitlistMode ? 'Começar grátis' : content.tryFree} ✨
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
                  className="group px-10 py-6 text-lg border-2 border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 rounded-full"
                >
                  {content.seePricing} ✨
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

          {/* Modern Trust Indicators */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Famílias conectadas</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">4.9/5</div>
              <div className="text-sm sm:text-base text-muted-foreground">Avaliação média</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">&lt; 12h</div>
              <div className="text-sm sm:text-base text-muted-foreground">Tempo de resposta</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">100%</div>
              <div className="text-sm sm:text-base text-muted-foreground">Totalmente seguro</div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};