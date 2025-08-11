import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Mic, Users, MessageCircle, Shield, Brain, Heart } from 'lucide-react';
import dashboardMockup from '@/assets/dashboard-mockup.png';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Everything You Need",
      subtitle: "Preserve Memories, Connect Hearts",
      features: [
        {
          title: "Voice Cloning",
          description: "Advanced AI captures unique speech patterns and personality",
          icon: Mic
        },
        {
          title: "Family Profiles",
          description: "Create detailed profiles for each loved one with photos and memories",
          icon: Users
        },
        {
          title: "Natural Conversations",
          description: "Chat naturally with AI that responds like your loved one",
          icon: MessageCircle
        },
        {
          title: "Privacy First",
          description: "Your family's data is encrypted and never shared with third parties",
          icon: Shield
        },
        {
          title: "Memory Preservation",
          description: "Specially designed for families facing Alzheimer's and dementia",
          icon: Brain
        },
        {
          title: "Built with Love",
          description: "Created by someone who understands the pain of memory loss",
          icon: Heart
        }
      ]
    },
    'pt-BR': {
      title: "Tudo Que Você Precisa",
      subtitle: "Preserve Memórias, Conecte Corações",
      features: [
        {
          title: "Clonagem de Voz",
          description: "IA avançada captura padrões únicos de fala e personalidade",
          icon: Mic
        },
        {
          title: "Perfis da Família",
          description: "Crie perfis detalhados para cada ente querido com fotos e memórias",
          icon: Users
        },
        {
          title: "Conversas Naturais",
          description: "Converse naturalmente com IA que responde como seu ente querido",
          icon: MessageCircle
        },
        {
          title: "Privacidade Primeiro",
          description: "Os dados da sua família são criptografados e nunca compartilhados",
          icon: Shield
        },
        {
          title: "Preservação de Memória",
          description: "Especialmente projetado para famílias enfrentando Alzheimer e demência",
          icon: Brain
        },
        {
          title: "Feito com Amor",
          description: "Criado por alguém que entende a dor da perda de memória",
          icon: Heart
        }
      ]
    },
    es: {
      title: "Todo Lo Que Necesitas",
      subtitle: "Preserva Recuerdos, Conecta Corazones",
      features: [
        {
          title: "Clonación de Voz",
          description: "IA avanzada captura patrones únicos de habla y personalidad",
          icon: Mic
        },
        {
          title: "Perfiles Familiares",
          description: "Crea perfiles detallados para cada ser querido con fotos y recuerdos",
          icon: Users
        },
        {
          title: "Conversaciones Naturales",
          description: "Conversa naturalmente con IA que responde como tu ser querido",
          icon: MessageCircle
        },
        {
          title: "Privacidad Primero",
          description: "Los datos de tu familia están encriptados y nunca se comparten",
          icon: Shield
        },
        {
          title: "Preservación de Memoria",
          description: "Específicamente diseñado para familias enfrentando Alzheimer y demencia",
          icon: Brain
        },
        {
          title: "Hecho con Amor",
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
          <h2 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground mb-4">
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
                    <h3 className="text-xl font-zilla font-medium text-foreground">
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