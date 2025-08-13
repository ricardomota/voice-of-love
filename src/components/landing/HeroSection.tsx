import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Favorite, PlayFilled } from '@carbon/icons-react';

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
    <section className="relative min-h-screen flex items-center justify-center pt-16 lg:pt-20 bg-black">
      {/* Background gradient with dark theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/95 to-gray-800/30" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[size:24px_24px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
                {content.headline.split('.').map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && '.'}
                    {index === 0 && <br className="hidden sm:block" />}
                  </span>
                ))}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
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
                <PlayFilled size={16} className="mr-2" />
                {content.tryFree}
              </Button>
              
              <Button 
                onClick={onSeePricing}
                variant="outline" 
                size="xl"
                className="w-full sm:w-auto min-w-[160px] border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                {content.seePricing}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-white/20">
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span>Private by default</span>
                </div>
                <div className="flex items-center gap-2">
                  <Favorite size={16} className="text-blue-400" />
                  <span>Family-first design</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 aspect-[4/3] border border-white/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500/30 to-purple-600/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                    <Favorite size={24} className="text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-blue-500/40 to-transparent rounded-full mx-auto w-48" />
                    <div className="h-3 bg-gradient-to-r from-purple-500/30 to-transparent rounded-full mx-auto w-32" />
                    <div className="h-3 bg-gradient-to-r from-blue-400/25 to-transparent rounded-full mx-auto w-40" />
                  </div>
                  <p className="text-sm text-gray-400 opacity-60">
                    {content.altText}
                  </p>
                </div>
              </div>
              
              {/* Floating elements with enhanced glow */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-blue-500/20 rounded-full backdrop-blur-sm animate-float shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
              <div className="absolute bottom-6 left-6 w-12 h-12 bg-purple-500/20 rounded-full backdrop-blur-sm animate-float shadow-[0_0_15px_rgba(147,51,234,0.3)]" style={{ animationDelay: '1s' }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};