import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight, Heart, Shield, Brain } from 'lucide-react';

interface PersonalStoryProps {
  onGetStarted: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Why I Created Eterna",
      personalStory: "I built this tool with love using Lovable, motivated by the need to keep my mother present, even with Alzheimer's. I want to help other families preserve the memories and personalities of their loved ones.",
      mission: {
        title: "Our Mission",
        description: "Every family facing memory challenges deserves to keep their loved one's voice and personality alive. Eterna bridges the gap between technology and human connection."
      },
      values: [
        {
          title: "Built with Love",
          description: "Created by someone who understands the pain of watching memories slip away.",
          icon: Heart
        },
        {
          title: "Privacy First",
          description: "Your family's voices and memories are sacred. We protect them with the highest security.",
          icon: Shield
        },
        {
          title: "Alzheimer's Aware",
          description: "Specifically designed for families navigating memory loss and cognitive challenges.",
          icon: Brain
        }
      ],
      cta: "Begin Your Journey"
    },
    'pt-BR': {
      title: "Por que Criei o Eterna",
      personalStory: "Criei esta ferramenta com amor usando o Lovable, motivado pela necessidade de manter minha mãe presente, mesmo com o Alzheimer. Quero ajudar outras famílias a preservarem as memórias e personalidades de seus entes queridos.",
      mission: {
        title: "Nossa Missão",
        description: "Toda família enfrentando desafios de memória merece manter viva a voz e personalidade de seus entes queridos. O Eterna conecta tecnologia com conexão humana."
      },
      values: [
        {
          title: "Feito com Amor",
          description: "Criado por alguém que entende a dor de ver memórias se desvanecendo.",
          icon: Heart
        },
        {
          title: "Privacidade Primeiro",
          description: "As vozes e memórias da sua família são sagradas. Protegemos com a mais alta segurança.",
          icon: Shield
        },
        {
          title: "Consciente do Alzheimer",
          description: "Especificamente projetado para famílias navegando perda de memória e desafios cognitivos.",
          icon: Brain
        }
      ],
      cta: "Comece Sua Jornada"
    },
    es: {
      title: "Por qué Creé Eterna",
      personalStory: "Creé esta herramienta con amor usando Lovable, motivado por la necesidad de mantener a mi madre presente, incluso con Alzheimer. Quiero ayudar a otras familias a preservar los recuerdos y personalidades de sus seres queridos.",
      mission: {
        title: "Nuestra Misión",
        description: "Cada familia enfrentando desafíos de memoria merece mantener viva la voz y personalidad de sus seres queridos. Eterna conecta tecnología con conexión humana."
      },
      values: [
        {
          title: "Hecho con Amor",
          description: "Creado por alguien que entiende el dolor de ver recuerdos desvaneciéndose.",
          icon: Heart
        },
        {
          title: "Privacidad Primero",
          description: "Las voces y recuerdos de tu familia son sagrados. Los protegemos con la más alta seguridad.",
          icon: Shield
        },
        {
          title: "Consciente del Alzheimer",
          description: "Específicamente diseñado para familias navegando pérdida de memoria y desafíos cognitivos.",
          icon: Brain
        }
      ],
      cta: "Comienza Tu Viaje"
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const PersonalStory: React.FC<PersonalStoryProps> = ({ onGetStarted }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Personal Story Header */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-zilla font-medium italic text-foreground mb-6">
              {content.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xl sm:text-2xl font-work text-muted-foreground leading-relaxed">
                {content.personalStory}
              </p>
              
              {/* Alzheimer's Association Logo */}
              <div className="pt-6">
                <a 
                  href="https://www.alz.org/?form=FUNDHYMMBXU" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity flex items-center gap-3 w-fit"
                >
                  <img 
                    src="/lovable-uploads/da7c745c-758a-4054-a38a-03a05da9fb7b.png" 
                    alt="Alzheimer's Association" 
                    className="h-10 opacity-80"
                  />
                  <span className="text-sm font-work text-muted-foreground">
                    Supporting Alzheimer's awareness
                  </span>
                </a>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-accent/20 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Heart className="w-8 h-8 text-accent" />
                    <h3 className="text-2xl font-zilla font-medium italic text-foreground">
                      {content.mission.title}
                    </h3>
                  </div>
                  <p className="text-lg font-work text-muted-foreground leading-relaxed">
                    {content.mission.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-zilla font-medium italic text-foreground mb-6">
            {content.mission.title}
          </h3>
          <p className="text-xl font-work text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {content.mission.description}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {content.values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/30 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-accent" />
                  </div>
                  
                  <h4 className="text-xl font-zilla font-medium text-foreground">
                    {value.title}
                  </h4>
                  
                  <p className="font-work text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20 shadow-2xl inline-block">
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Heart className="w-8 h-8 text-accent" />
                <span className="font-work text-muted-foreground">Made with ❤️ for families</span>
              </div>
              
              <Button 
                onClick={onGetStarted}
                size="xl"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-16 min-w-[200px] rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-work"
              >
                {content.cta}
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};