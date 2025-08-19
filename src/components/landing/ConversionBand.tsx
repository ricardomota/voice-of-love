import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Play, Sparkles } from 'lucide-react';

interface ConversionBandProps {
  onTryFree: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Ready to hear a memory come alive?",
      subtitle: "Join families worldwide who are preserving the voices they love most.",
      cta: "Try Eterna Free",
      features: ["No credit card required", "5 messages to start", "1 minute of voice generation"]
    },
    'pt-BR': {
      title: "Pronto para ouvir uma memória ganhar vida?",
      subtitle: "Junte-se a famílias no mundo todo que estão preservando as vozes que mais amam.",
      cta: "Testar Grátis",
      features: ["Não precisa cartão de crédito", "5 mensagens para começar", "1 minuto de geração de voz"]
    },
    es: {
      title: "¿Listo para escuchar un recuerdo cobrar vida?",
      subtitle: "Únete a familias de todo el mundo que están preservando las voces que más aman.",
      cta: "Probar Gratis",
      features: ["No requiere tarjeta de crédito", "5 mensajes para empezar", "1 minuto de generación de voz"]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const ConversionBand: React.FC<ConversionBandProps> = ({ onTryFree }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Content */}
        <div className="space-y-8">
          
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
              {content.title}
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          {/* CTA Button */}
          <div className="space-y-6">
            <Button 
              onClick={onTryFree} 
              size="xl" 
              variant="cta"
              className="mx-auto min-w-[240px]"
            >
              <Play className="w-5 h-5 mr-2" />
              {content.cta}
            </Button>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
        
      </div>
    </section>
  );
};