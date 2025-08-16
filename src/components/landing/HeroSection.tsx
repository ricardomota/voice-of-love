import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Group, PlayFilled, Security } from '@carbon/icons-react';
import { supabase } from '@/integrations/supabase/client';
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
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_settings')
          .select('*', { count: 'exact', head: true });
        
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
  return <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
      
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 lg:space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary-foreground leading-[1.1] sm:leading-tight tracking-tight">
                {content.headline.split('.').map((part, index, array) => <span key={index}>
                    {part}
                    {index < array.length - 1 && '.'}
                    {index === 0 && <br className="hidden sm:block" />}
                  </span>)}
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {content.subhead}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {!isLoading && (
                <>
                  <Button 
                    onClick={isWaitlistMode ? onTryFree : onLogin} 
                    size="xl" 
                    variant="secondary" 
                    className="w-full sm:w-auto min-w-[220px] h-14 text-base font-medium"
                  >
                    <PlayFilled size={18} className="mr-2" />
                    {isWaitlistMode ? 'Entrar na Waitlist' : 'Começar Agora'}
                  </Button>
                  
                  <Button 
                    onClick={onSeePricing} 
                    variant="cta" 
                    size="xl" 
                    className="w-full sm:w-auto min-w-[180px] h-14 text-base font-medium"
                  >
                    {content.seePricing}
                  </Button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="pt-6">
              <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-6 xs:gap-8 text-sm text-primary-foreground/70">
                <div className="flex items-center gap-2.5">
                  <Security size={16} className="text-secondary flex-shrink-0" />
                  <span>Private by default</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Group size={16} className="text-secondary flex-shrink-0" />
                  <span>Family-first design</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl aspect-[16/10] sm:aspect-[4/3]">
              <img 
                src="/lovable-uploads/fbc775df-e88c-44eb-b8e5-b8ada1ea8b9d.png" 
                alt={content.altText} 
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
              
              {/* Subtle overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>;
};