import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Group, PlayFilled, Security } from '@carbon/icons-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { DemoModal } from '@/components/modals/DemoModal';
interface HeroSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onLogin: () => void;
  onTryDemo?: () => void;
}
const getContent = (language: string) => {
  const content = {
    en: {
      headline: "Where memories become eternal. ✨",
      subhead: "Preserve the essence of your loved ones through AI that captures their personality, stories, and wisdom forever.",
      tryFree: "Try Eterna Free",
      tryDemo: "Try a quick demo",
      seePricing: "See Pricing",
      altText: "Family sharing warm moments together"
    },
    'pt-BR': {
      headline: "Onde lembranças se tornam eternas✨",
      subhead: "Preserve a essência dos seus entes queridos através de IA que captura sua personalidade, histórias e sabedoria para sempre.",
      tryFree: "Testar Grátis",
      tryDemo: "Experimente uma demo rápida",
      seePricing: "Ver Preços",
      altText: "Família compartilhando momentos especiais"
    },
    es: {
      headline: "Donde los recuerdos se vuelven eternos. ✨",
      subhead: "Preserva la esencia de tus seres queridos a través de IA que captura su personalidad, historias y sabiduría para siempre.",
      tryFree: "Probar Gratis",
      tryDemo: "Prueba una demo rápida",
      seePricing: "Ver Precios",
      altText: "Familia compartiendo momentos especiales"
    }
  };
  return content[language as keyof typeof content] || content.en;
};
export const HeroSection: React.FC<HeroSectionProps> = ({
  onTryFree,
  onSeePricing,
  onLogin,
  onTryDemo
}) => {
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
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
  
  const handleDemoClick = () => {
    setIsDemoModalOpen(true);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 pt-32 sm:pt-36 lg:pt-40 xl:pt-44 overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />

          {/* Grainy noise overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 hero-grainy-noise opacity-30" />
          </div>
          
          {/* Enhanced Background Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/15 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/15 rounded-full blur-3xl opacity-30 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:50px_50px]" />
          </div>
        </div>
        
        {/* Centered Content Container */}
        <div className="relative w-full max-w-5xl mx-auto text-center">
          {/* Enhanced Content with centered design */}
          <motion.div className="text-center space-y-8 md:space-y-12 lg:space-y-16" initial={{
            opacity: 0,
            y: 50
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            ease: "easeOut"
          }}>
            <div className="space-y-8 md:space-y-10 lg:space-y-12">
              <motion.h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-primary-foreground leading-tight tracking-tight" initial={{
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
              <motion.p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed font-light" initial={{
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

            {/* Enhanced CTA Buttons with centered layout */}
            <motion.div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center" initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.6
            }}>
              {!isLoading && (
                <>
                  <Button 
                    onClick={isWaitlistMode ? onTryFree : onLogin} 
                    size="xl" 
                    variant="secondary" 
                    className="w-full sm:w-auto min-w-[280px] h-16 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-secondary hover:bg-secondary/90 hover:scale-105"
                  >
                    {isWaitlistMode ? 'Join Waitlist' : content.tryFree}
                  </Button>
                  
                  <Button 
                    onClick={handleDemoClick} 
                    variant="outline" 
                    size="xl" 
                    className="w-full sm:w-auto min-w-[240px] h-16 text-lg font-semibold bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
                  >
                    <PlayFilled size={20} className="mr-3" />
                    {content.tryDemo}
                  </Button>
                  
                  <Button 
                    onClick={onSeePricing} 
                    variant="ghost" 
                    size="lg" 
                    className="w-full sm:w-auto text-lg font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/5 transition-all duration-300"
                  >
                    {content.seePricing}
                  </Button>
                </>
              )}
            </motion.div>

            {/* Enhanced Trust indicators with centered layout */}
            <motion.div className="pt-8 md:pt-12" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.8
            }}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 text-base sm:text-lg text-primary-foreground/80">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl backdrop-blur-sm">
                    <Security size={24} className="text-secondary flex-shrink-0" />
                  </div>
                  <span className="font-semibold">Private by default</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl backdrop-blur-sm">
                    <Group size={24} className="text-secondary flex-shrink-0" />
                  </div>
                  <span className="font-semibold">Family-first design</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Demo Modal */}
      <DemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  );
};