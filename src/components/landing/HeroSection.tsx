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

import { getLandingContent } from '@/utils/translations';
export const HeroSection: React.FC<HeroSectionProps> = ({
  onTryFree,
  onSeePricing,
  onLogin
}) => {
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { currentLanguage } = useLanguage();
  const content = getLandingContent(currentLanguage).hero;
  
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