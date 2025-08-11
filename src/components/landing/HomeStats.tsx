import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight, Heart, Users, Clock } from 'lucide-react';

interface HomeStatsProps {
  onGetStarted: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Trusted by Families Worldwide",
      stats: [
        { number: "1,000+", label: "Voices Preserved", icon: Heart },
        { number: "50+", label: "Countries", icon: Users },
        { number: "24/7", label: "Always Available", icon: Clock }
      ],
      story: {
        title: "Born from Love, Built for Families",
        text: "Created with deep understanding of memory loss challenges, Eterna helps families maintain precious connections when words become difficult.",
        cta: "Start Your Journey"
      }
    },
    'pt-BR': {
      title: "Confiado por Famílias no Mundo Todo",
      stats: [
        { number: "1,000+", label: "Vozes Preservadas", icon: Heart },
        { number: "50+", label: "Países", icon: Users },
        { number: "24/7", label: "Sempre Disponível", icon: Clock }
      ],
      story: {
        title: "Nascido do Amor, Construído para Famílias",
        text: "Criado com profundo entendimento dos desafios da perda de memória, o Eterna ajuda famílias a manter conexões preciosas quando as palavras se tornam difíceis.",
        cta: "Comece Sua Jornada"
      }
    },
    es: {
      title: "Confiado por Familias en Todo el Mundo",
      stats: [
        { number: "1,000+", label: "Voces Preservadas", icon: Heart },
        { number: "50+", label: "Países", icon: Users },
        { number: "24/7", label: "Siempre Disponible", icon: Clock }
      ],
      story: {
        title: "Nacido del Amor, Construido para Familias",
        text: "Creado con profundo entendimiento de los desafíos de pérdida de memoria, Eterna ayuda a las familias a mantener conexiones preciosas cuando las palabras se vuelven difíciles.",
        cta: "Comienza Tu Viaje"
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const HomeStats: React.FC<HomeStatsProps> = ({ onGetStarted }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-16">
            {content.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {content.stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/30 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-accent" />
                    </div>
                    <div className="text-4xl font-bold text-primary">{stat.number}</div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-2 border-accent/20 shadow-2xl">
          <CardContent className="p-8 sm:p-12 text-center space-y-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              {content.story.title}
            </h3>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {content.story.text}
            </p>
            
            <Button 
              onClick={onGetStarted}
              size="xl"
              className="bg-accent hover:bg-accent/90 text-white font-bold text-lg h-16 min-w-[200px] rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {content.story.cta}
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};