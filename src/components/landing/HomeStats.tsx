import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight, Heart, Globe, Clock, Shield } from 'lucide-react';

interface HomeStatsProps {
  onGetStarted: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      features: {
        title: "Designed for Families",
        items: [
          { title: "Private by Design", description: "Your voice models and conversations stay within your family", icon: Shield },
          { title: "Always Available", description: "Chat with your loved ones whenever you need them most", icon: Clock },
          { title: "Global Families", description: "Supporting families worldwide in multiple languages", icon: Globe },
          { title: "Built with Love", description: "Created with deep understanding of memory challenges", icon: Heart }
        ]
      },
      cta: {
        title: "Ready to Preserve Your Family's Voice?",
        description: "Join families who are creating lasting connections through Eterna's voice preservation technology.",
        button: "Start Your Journey"
      }
    },
    'pt-BR': {
      features: {
        title: "Projetado para Famílias",
        items: [
          { title: "Privado por Design", description: "Seus modelos de voz e conversas ficam dentro da sua família", icon: Shield },
          { title: "Sempre Disponível", description: "Converse com seus entes queridos quando mais precisar", icon: Clock },
          { title: "Famílias Globais", description: "Apoiando famílias no mundo todo em múltiplos idiomas", icon: Globe },
          { title: "Feito com Amor", description: "Criado com profundo entendimento dos desafios de memória", icon: Heart }
        ]
      },
      cta: {
        title: "Pronto para Preservar a Voz da Sua Família?",
        description: "Junte-se a famílias que estão criando conexões duradouras através da tecnologia de preservação de voz do Eterna.",
        button: "Comece Sua Jornada"
      }
    },
    es: {
      features: {
        title: "Diseñado para Familias",
        items: [
          { title: "Privado por Diseño", description: "Tus modelos de voz y conversaciones quedan dentro de tu familia", icon: Shield },
          { title: "Siempre Disponible", description: "Chatea con tus seres queridos cuando más los necesites", icon: Clock },
          { title: "Familias Globales", description: "Apoyando familias en todo el mundo en múltiples idiomas", icon: Globe },
          { title: "Hecho con Amor", description: "Creado con profundo entendimiento de los desafíos de memoria", icon: Heart }
        ]
      },
      cta: {
        title: "¿Listo para Preservar la Voz de Tu Familia?",
        description: "Únete a familias que están creando conexiones duraderas a través de la tecnología de preservación de voz de Eterna.",
        button: "Comienza Tu Viaje"
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const HomeStats: React.FC<HomeStatsProps> = ({ onGetStarted }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground mb-16">
            {content.features.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.features.items.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/30 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7 text-accent" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-zilla font-medium text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="font-work text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-2 border-accent/20 shadow-2xl">
          <CardContent className="p-8 sm:p-12 text-center space-y-8">
            <h3 className="text-3xl sm:text-4xl font-zilla font-medium italic text-foreground">
              {content.cta.title}
            </h3>
            
            <p className="text-xl font-work text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {content.cta.description}
            </p>
            
            <Button 
              onClick={onGetStarted}
              size="xl"
              className="bg-accent hover:bg-accent/90 text-white font-bold text-lg h-16 min-w-[200px] rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-work"
            >
              {content.cta.button}
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};