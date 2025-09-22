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
        title: "Designed for families",
        items: [
          { title: "Private by design", description: "Your voice models and conversations stay within your family", icon: Shield },
          { title: "Always available", description: "Chat with your loved ones whenever you need them most", icon: Clock },
          { title: "Global families", description: "Supporting families worldwide in multiple languages", icon: Globe },
          { title: "Built with love", description: "Created with deep understanding of memory challenges", icon: Heart }
        ]
      },
      cta: {
        title: "Ready to preserve your family's voice?",
        description: "Join families who are creating lasting connections through Eterna's voice preservation technology.",
        button: "Start Your Journey"
      }
    },
    'pt-BR': {
      features: {
        title: "Projetado para famílias",
        items: [
          { title: "Privado por design", description: "Seus modelos de voz e conversas ficam dentro da sua família", icon: Shield },
          { title: "Sempre disponível", description: "Converse com seus entes queridos quando mais precisar", icon: Clock },
          { title: "Famílias globais", description: "Apoiando famílias no mundo todo em múltiplos idiomas", icon: Globe },
          { title: "Feito com amor", description: "Criado com profundo entendimento dos desafios de memória", icon: Heart }
        ]
      },
      cta: {
        title: "Pronto para preservar a voz da sua família?",
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
    },
    'zh-CN': {
      features: {
        title: "为家庭设计",
        items: [
          { title: "隐私设计", description: "您的语音模型和对话保留在家庭内部", icon: Shield },
          { title: "随时可用", description: "在最需要时与您所爱的人聊天", icon: Clock },
          { title: "全球家庭", description: "以多种语言支持世界各地的家庭", icon: Globe },
          { title: "用爱打造", description: "深入了解记忆挑战而创建", icon: Heart }
        ]
      },
      cta: {
        title: "准备好保存您家庭的声音了吗？",
        description: "加入通过Eterna语音保存技术创建持久连接的家庭。",
        button: "开始您的旅程"
      }
    },
    fr: {
      features: {
        title: "Conçu pour les familles",
        items: [
          { title: "Privé par conception", description: "Vos modèles vocaux et conversations restent dans votre famille", icon: Shield },
          { title: "Toujours disponible", description: "Chattez avec vos proches quand vous en avez le plus besoin", icon: Clock },
          { title: "Familles mondiales", description: "Soutenir les familles du monde entier en plusieurs langues", icon: Globe },
          { title: "Fait avec amour", description: "Créé avec une compréhension profonde des défis de mémoire", icon: Heart }
        ]
      },
      cta: {
        title: "Prêt à préserver la voix de votre famille ?",
        description: "Rejoignez les familles qui créent des connexions durables grâce à la technologie de préservation vocale d'Eterna.",
        button: "Commencez Votre Voyage"
      }
    },
    de: {
      features: {
        title: "Für Familien entworfen",
        items: [
          { title: "Privat by Design", description: "Ihre Stimmmodelle und Gespräche bleiben in Ihrer Familie", icon: Shield },
          { title: "Immer verfügbar", description: "Chatten Sie mit Ihren Liebsten, wenn Sie sie am meisten brauchen", icon: Clock },
          { title: "Globale Familien", description: "Unterstützung von Familien weltweit in mehreren Sprachen", icon: Globe },
          { title: "Mit Liebe gemacht", description: "Mit tiefem Verständnis für Gedächtnisherausforderungen erstellt", icon: Heart }
        ]
      },
      cta: {
        title: "Bereit, die Stimme Ihrer Familie zu bewahren?",
        description: "Schließen Sie sich Familien an, die dauerhafte Verbindungen durch Eternas Stimmbewahrungstechnologie schaffen.",
        button: "Beginnen Sie Ihre Reise"
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
          <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.75rem)] text-foreground mb-16 leading-none tracking-tight">
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
                        <h3 className="font-serif text-[clamp(1.125rem,2.5vw,1.5rem)] text-foreground mb-2 leading-tight">
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
            <h3 className="font-serif text-[clamp(1.25rem,3vw,2rem)] text-foreground leading-tight">
              {content.cta.title}
            </h3>
            
            <p className="text-xl font-work text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {content.cta.description}
            </p>
            
            <Button 
              onClick={onGetStarted}
              size="xl"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg h-16 min-w-[200px] rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-work"
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