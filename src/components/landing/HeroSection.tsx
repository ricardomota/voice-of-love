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
      badge: "Preserve memories with AI",
      headline: "Keep their voice and wisdom alive forever",
      subhead: "Help families affected by Alzheimer's preserve precious memories and stay connected through AI-powered conversations.",
      tryFree: "Join Waitlist",
      seePricing: "See Pricing",
      trustBadge: "Built for families"
    },
    'pt-BR': {
      badge: "Preserve memórias com IA",
      headline: "Mantenha a voz e sabedoria deles vivos para sempre",
      subhead: "Ajude famílias afetadas pelo Alzheimer a preservar memórias preciosas e permanecer conectadas através de conversas com IA.",
      tryFree: "Entrar na Lista",
      seePricing: "Ver Preços",
      trustBadge: "Feito para famílias"
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
    <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      
      {/* Main content */}
      <div className="relative w-full max-w-4xl mx-auto px-6 py-24 text-center">
        
        {/* Status badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm font-medium">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            {text.badge}
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.h1 
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {text.headline}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {text.subhead}
        </motion.p>

        {/* CTA buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {!isLoading && (
            <>
              <Button 
                onClick={onTryFree}
                size="lg"
                className="px-8 py-3 text-base font-medium bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                {text.tryFree}
              </Button>
              
              <Button 
                onClick={onSeePricing}
                variant="ghost"
                size="lg"
                className="px-6 py-3 text-base font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {text.seePricing}
              </Button>
            </>
          )}
        </motion.div>

        {/* Trust indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
        >
          <Security className="w-4 h-4" />
          <span>{text.trustBadge}</span>
        </motion.div>
      </div>
    </section>
  );
};