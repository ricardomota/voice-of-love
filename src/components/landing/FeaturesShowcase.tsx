import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Mic, Users, MessageCircle, Shield, Brain, Heart } from 'lucide-react';
import dashboardMockup from '@/assets/dashboard-mockup.png';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Everything you need",
      subtitle: "Preserve memories, connect hearts",
      features: [
        {
          title: "Voice cloning",
          description: "Advanced AI captures unique speech patterns and personality",
          icon: Mic
        },
        {
          title: "Family profiles",
          description: "Create detailed profiles for each loved one with photos and memories",
          icon: Users
        },
        {
          title: "Natural conversations",
          description: "Chat naturally with AI that responds like your loved one",
          icon: MessageCircle
        },
        {
          title: "Privacy first",
          description: "Your family's data is encrypted and never shared with third parties",
          icon: Shield
        },
        {
          title: "Memory preservation",
          description: "Specially designed for families facing Alzheimer's and dementia",
          icon: Brain
        },
        {
          title: "Built with love",
          description: "Created by someone who understands the pain of memory loss",
          icon: Heart
        }
      ]
    },
    'pt-BR': {
      title: "Tudo que você precisa",
      subtitle: "Preserve memórias, conecte corações",
      features: [
        {
          title: "Clonagem de voz",
          description: "IA avançada captura padrões únicos de fala e personalidade",
          icon: Mic
        },
        {
          title: "Perfis da família",
          description: "Crie perfis detalhados para cada ente querido com fotos e memórias",
          icon: Users
        },
        {
          title: "Conversas naturais",
          description: "Converse naturalmente com IA que responde como seu ente querido",
          icon: MessageCircle
        },
        {
          title: "Privacidade primeiro",
          description: "Os dados da sua família são criptografados e nunca compartilhados",
          icon: Shield
        },
        {
          title: "Preservação de memória",
          description: "Especialmente projetado para famílias enfrentando Alzheimer e demência",
          icon: Brain
        },
        {
          title: "Feito com amor",
          description: "Criado por alguém que entende a dor da perda de memória",
          icon: Heart
        }
      ]
    },
    es: {
      title: "Todo lo que necesitas",
      subtitle: "Preserva recuerdos, conecta corazones",
      features: [
        {
          title: "Clonación de voz",
          description: "IA avanzada captura patrones únicos de habla y personalidad",
          icon: Mic
        },
        {
          title: "Perfiles familiares",
          description: "Crea perfiles detallados para cada ser querido con fotos y recuerdos",
          icon: Users
        },
        {
          title: "Conversaciones naturales",
          description: "Conversa naturalmente con IA que responde como tu ser querido",
          icon: MessageCircle
        },
        {
          title: "Privacidad primero",
          description: "Los datos de tu familia están encriptados y nunca se comparten",
          icon: Shield
        },
        {
          title: "Preservación de memoria",
          description: "Específicamente diseñado para familias enfrentando Alzheimer y demencia",
          icon: Brain
        },
        {
          title: "Hecho con amor",
          description: "Creado por alguien que entiende el dolor de la pérdida de memoria",
          icon: Heart
        }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const FeaturesShowcase: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.75rem)] text-foreground mb-4 leading-none tracking-tight">
            {content.title}
          </h2>
          <p className="text-xl font-work text-muted-foreground max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl border-2 border-accent/20 p-8 shadow-2xl">
              <img 
                src={dashboardMockup} 
                alt="Eterna Dashboard Interface" 
                className="w-full rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/30 bg-card/80 backdrop-blur-sm animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 space-y-6">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-accent" />
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h3 className="font-serif text-[clamp(1.125rem,2.5vw,1.5rem)] text-foreground leading-tight">
                      {feature.title}
                    </h3>
                    
                    <p className="font-work text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};