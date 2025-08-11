import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Heart, Play } from 'lucide-react';

interface HeroSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      headline: "Preserve a Voice. Keep a Story Alive.",
      subhead: "Chat with an AI that sounds like your loved ones. Eterna turns memories into living voices.",
      tryFree: "Try Eterna Free",
      seePricing: "See Pricing",
      altText: "Family sharing warm moments together"
    },
    'pt-BR': {
      headline: "Preserve uma Voz. Mantenha uma História Viva.",
      subhead: "Converse com uma IA que soa como seus entes queridos. Eterna transforma memórias em vozes vivas.",
      tryFree: "Testar Grátis",
      seePricing: "Ver Preços", 
      altText: "Família compartilhando momentos especiais"
    },
    es: {
      headline: "Preserva una Voz. Mantén una Historia Viva.",
      subhead: "Chatea con una IA que suena como tus seres queridos. Eterna convierte memorias en voces vivas.",
      tryFree: "Probar Gratis",
      seePricing: "Ver Precios",
      altText: "Familia compartiendo momentos especiales"
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onTryFree, onSeePricing }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 lg:pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-primary/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
                {content.headline.split('.').map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && '.'}
                    {index === 0 && <br className="hidden sm:block" />}
                  </span>
                ))}
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {content.subhead}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={onTryFree} 
                size="xl" 
                variant="cta"
                className="w-full sm:w-auto min-w-[200px]"
              >
                <Play className="w-5 h-5 mr-2" />
                {content.tryFree}
              </Button>
              
              <Button 
                onClick={onSeePricing}
                variant="secondary" 
                size="xl"
                className="w-full sm:w-auto min-w-[160px]"
              >
                {content.seePricing}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-border/30">
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Private by default</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Family-first design</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-accent/5 aspect-[4/3]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-primary/30 to-transparent rounded-full mx-auto w-48" />
                    <div className="h-3 bg-gradient-to-r from-primary/20 to-transparent rounded-full mx-auto w-32" />
                    <div className="h-3 bg-gradient-to-r from-primary/15 to-transparent rounded-full mx-auto w-40" />
                  </div>
                  <p className="text-sm text-muted-foreground opacity-60">
                    {content.altText}
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm animate-float" />
              <div className="absolute bottom-6 left-6 w-12 h-12 bg-primary/20 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};