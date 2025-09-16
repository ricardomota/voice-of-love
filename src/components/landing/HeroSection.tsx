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

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTryFree,
  onSeePricing,
  onLogin
}) => {
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { currentLanguage } = useLanguage();
  
  const content = {
    en: {
      badge: "✨ Preserving memories for families affected by Alzheimer's",
      headline: "Keep their voice, wisdom & love alive forever",
      subhead: "Eterna helps families preserve precious memories, voices, and personality traits of loved ones. Share supportive messages, nutrition tips, and find hope during life's most challenging moments.",
      tryFree: "Join the Waitlist",
      seePricing: "Learn More",
      trustBadge: "Built with love for families going through Alzheimer's journey"
    },
    'pt-BR': {
      badge: "✨ Preservando memórias para famílias afetadas pelo Alzheimer",
      headline: "Mantenha a voz, sabedoria e amor deles vivos para sempre",
      subhead: "Eterna ajuda famílias a preservar memórias preciosas, vozes e traços de personalidade de entes queridos. Compartilhe mensagens de apoio, dicas nutricionais e encontre esperança durante os momentos mais desafiadores da vida.",
      tryFree: "Entrar na Lista de Espera",
      seePricing: "Saber Mais",
      trustBadge: "Construído com amor para famílias na jornada do Alzheimer"
    }
  };
  
  const text = content[currentLanguage as keyof typeof content] || content.en;
  
  useEffect(() => {
    const checkWaitlistCount = async () => {
      try {
        const { count, error } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          console.error('Error getting waitlist count:', error);
          setWaitlistCount(0);
        } else {
          setWaitlistCount(count || 0);
        }
      } catch (error) {
        console.error('Error in checkWaitlistCount:', error);
        setWaitlistCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    checkWaitlistCount();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
      
      {/* Main content */}
      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24 text-center">
        
        {/* Status badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-muted-foreground text-sm font-medium">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            {text.badge}
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-[1.1] tracking-[-0.02em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {text.headline.replace(' ✨', '')}<span className="ml-2">✨</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-16 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {text.subhead}
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
                onClick={onTryFree}
                size="lg"
                className="px-8 py-4 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {text.tryFree}
              </Button>
              
              <Button 
                onClick={onSeePricing}
                variant="ghost"
                size="lg"
                className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {text.seePricing}
              </Button>
            </>
          )}
        </motion.div>

        {/* Waitlist social proof */}
        {!isLoading && waitlistCount > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground/80 mb-8"
          >
            <span>💜 {waitlistCount} families already on the waitlist</span>
          </motion.div>
        )}

        {/* Trust indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70"
        >
          <Security className="w-3 h-3" />
          <span>{text.trustBadge}</span>
        </motion.div>
      </div>
    </section>
  );
};