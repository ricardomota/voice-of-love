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
      startNow: "Start Now",
      joinWaitlist: "Join Waitlist",
      altText: "Family sharing warm moments together"
    },
    'pt-BR': {
      headline: "Onde lembranças se tornam eternas✨",
      subhead: "Preserve a essência dos seus entes queridos através de IA que captura sua personalidade, histórias e sabedoria para sempre.",
      tryFree: "Testar Grátis",
      seePricing: "Ver Preços",
      startNow: "Começar Agora",
      joinWaitlist: "Entrar na Waitlist",
      altText: "Família compartilhando momentos especiais"
    },
    es: {
      headline: "Donde los recuerdos se vuelven eternos. ✨",
      subhead: "Preserva la esencia de tus seres queridos a través de IA que captura su personalidad, historias y sabiduría para siempre.",
      tryFree: "Probar Gratis",
      seePricing: "Ver Precios",
      startNow: "Empezar Ahora",
      joinWaitlist: "Unirse a la Lista",
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
  return <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 pt-32 sm:pt-40 lg:pt-48 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Base animated gradient */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--secondary)) 100%)",
              "linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--secondary)) 50%, hsl(var(--primary)) 100%)",
              "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 50%, hsl(var(--accent)) 100%)",
              "linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--secondary)) 100%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10" />
        
        {/* Large floating orbs */}
        <motion.div 
          className="absolute top-10 left-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-10 right-10 w-80 h-80 bg-accent/40 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.8, 0.4],
            x: [0, -80, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/25 rounded-full blur-3xl"
          animate={{
            scale: [0.8, 1.5, 0.8],
            opacity: [0.2, 0.5, 0.2],
            x: [-150, 150, -150],
            y: [-100, 100, -100]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] [background-size:60px_60px]" />
        </motion.div>
      </div>
      {/* Content Grid Container */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 flex flex-col items-center justify-center text-center">
              
              {/* Typography Hierarchy */}
              <motion.div 
                className="max-w-5xl mx-auto space-y-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Primary Headline */}
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-primary-foreground leading-[1.1] tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {content.headline}
                </motion.h1>
                
                {/* Supporting Text */}
                <motion.p 
                  className="text-lg sm:text-xl lg:text-2xl text-primary-foreground/85 max-w-3xl mx-auto leading-relaxed font-light"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {content.subhead}
                </motion.p>
              </motion.div>

              {/* CTA Button Grid */}
              <motion.div 
                className="mt-12 w-full max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  {!isLoading && (
                    <>
                      <Button 
                        onClick={isWaitlistMode ? onTryFree : onLogin} 
                        size="xl" 
                        variant="secondary" 
                        className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary hover:bg-secondary/90"
                      >
                        <PlayFilled size={20} className="mr-3" />
                        {isWaitlistMode ? content.joinWaitlist : content.startNow}
                      </Button>
                      
                      <Button 
                        onClick={onSeePricing} 
                        variant="outline" 
                        size="xl" 
                        className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-300"
                      >
                        {content.seePricing}
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Trust Indicators Grid */}
              <motion.div 
                className="mt-16 w-full max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 sm:gap-8">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-secondary/20 rounded-xl backdrop-blur-sm">
                      <Security size={20} className="text-secondary" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-primary-foreground/75">Private by default</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-secondary/20 rounded-xl backdrop-blur-sm">
                      <Group size={20} className="text-secondary" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-primary-foreground/75">Family-first design</span>
                  </div>
                </div>
              </motion.div>
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};