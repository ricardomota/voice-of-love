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
  return <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 pt-32 sm:pt-40 lg:pt-48 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-accent/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        
        {/* Subtle Animated Background Elements */}
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" 
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
        <motion.div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" 
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.1, 0.3]
          }} 
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }} 
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] [background-size:60px_60px]" />
        </div>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Enhanced Content */}
          <motion.div className="text-center lg:text-left space-y-10 lg:space-y-14 order-2 lg:order-1" initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }}>
            <div className="space-y-10 lg:space-y-14">
              <motion.h1 className="text-5xl xs:text-6xl sm:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[1.1] tracking-tight mb-16 mt-12" initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }}>
                {content.headline}
              </motion.h1>
              <motion.p className="text-2xl sm:text-3xl lg:text-3xl text-primary-foreground/90 max-w-3xl mx-auto lg:mx-0 leading-relaxed font-light mt-8" initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.4
            }}>
                {content.subhead}
              </motion.p>
            </div>

            {/* Enhanced CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center lg:justify-start pt-8" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.6
          }}>
              {!isLoading && <>
                  <Button onClick={isWaitlistMode ? onTryFree : onLogin} size="xl" variant="secondary" className="w-full sm:w-auto min-w-[280px] h-20 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-secondary hover:bg-secondary/90 rounded-2xl">
                    <PlayFilled size={24} className="mr-4" />
                    {isWaitlistMode ? 'Entrar na Waitlist' : 'Começar Agora'}
                  </Button>
                  
                  <Button onClick={onSeePricing} variant="outline" size="xl" className="w-full sm:w-auto min-w-[240px] h-20 text-xl font-semibold bg-primary-foreground/5 backdrop-blur-lg border-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/15 hover:border-primary-foreground/40 transition-all duration-300 rounded-2xl">
                    {content.seePricing}
                  </Button>
                </>}
            </motion.div>

            {/* Enhanced Trust indicators */}
            <motion.div className="pt-12 lg:pt-16" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.8
          }}>
              <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-12 xs:gap-20 text-lg text-primary-foreground/80">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/20 rounded-2xl backdrop-blur-lg border border-secondary/20">
                    <Security size={24} className="text-secondary flex-shrink-0" />
                  </div>
                  <span className="font-semibold">Private by default</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/20 rounded-2xl backdrop-blur-lg border border-secondary/20">
                    <Group size={24} className="text-secondary flex-shrink-0" />
                  </div>
                  <span className="font-semibold">Family-first design</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Hero Image */}
          <motion.div className="relative order-1 lg:order-2" initial={{
          opacity: 0,
          scale: 0.9,
          y: 30
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} transition={{
          duration: 1,
          delay: 0.4,
          ease: "easeOut"
        }}>
            <div className="relative">
              {/* Enhanced Glow Effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-secondary/20 via-accent/15 to-secondary/20 rounded-4xl blur-3xl opacity-60" />
              
              <div className="relative rounded-4xl lg:rounded-5xl overflow-hidden shadow-3xl aspect-[16/10] sm:aspect-[4/3] bg-gradient-to-br from-primary-foreground/5 to-transparent backdrop-blur-lg border-2 border-primary-foreground/10">
                <img src="/lovable-uploads/fbc775df-e88c-44eb-b8e5-b8ada1ea8b9d.png" alt={content.altText} className="w-full h-full object-cover object-center" loading="eager" />
                
                {/* Enhanced overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Elements */}
                
                
                
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>;
};