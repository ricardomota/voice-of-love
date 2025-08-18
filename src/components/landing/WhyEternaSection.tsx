import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Heart, Shield, Brain } from 'lucide-react';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "💝 Why eterna",
      story: "Inspired by families facing Alzheimer's… Memories fade. Voices shouldn't. ✨",
      highlight: "🔒 Private by default. Yours to keep forever. 💖",
      features: [
        {
          title: "❤️ Built with love",
          description: "Created by someone who understands the pain of watching memories slip away. Every feature designed with families in mind, with deep care and understanding. 🤗",
          icon: Heart
        },
        {
          title: "🔒 Privacy first", 
          description: "Your voice models and conversations are stored securely and never shared. What you preserve stays with your family forever and ever! 🛡️",
          icon: Shield
        },
        {
          title: "🧠 Alzheimer's aware",
          description: "Specifically designed to help families maintain connection when traditional communication becomes difficult - because love finds a way. 💖",
          icon: Brain
        }
      ]
    },
    'pt-BR': {
      title: "💝 Por que eterna",
      story: "Inspirado por famílias enfrentando Alzheimer… Memórias desvanecem. Vozes não deveriam. ✨",
      highlight: "🔒 Privado por padrão. Seu para guardar para sempre. 💖",
      features: [
        {
          title: "❤️ Feito com amor",
          description: "Criado por alguém que entende a dor de ver memórias se desvanecendo. Cada funcionalidade pensada para famílias, com muito carinho e compreensão. 🤗",
          icon: Heart
        },
        {
          title: "🔒 Privacidade primeiro",
          description: "Seus modelos de voz e conversas são armazenados com segurança e nunca compartilhados. O que você preserva fica com sua família para sempre e sempre! 🛡️",
          icon: Shield
        },
        {
          title: "🧠 Consciente do alzheimer",
          description: "Especificamente projetado para ajudar famílias a manter conexão quando a comunicação tradicional se torna difícil - porque o amor sempre encontra um jeito. 💖",
          icon: Brain
        }
      ]
    },
    es: {
      title: "💝 Por qué eterna",
      story: "Inspirado por familias enfrentando Alzheimer… Los recuerdos se desvanecen. Las voces no deberían.",
      highlight: "Privado por defecto. Tuyo para guardar.",
      features: [
        {
          title: "❤️ Hecho con amor",
          description: "Creado por alguien que entiende el dolor de ver recuerdos desvaneciéndose. Cada característica diseñada pensando en las familias.",
          icon: Heart
        },
        {
          title: "🔒 Privacidad primero",
          description: "Tus modelos de voz y conversaciones se almacenan de forma segura y nunca se comparten. Lo que preservas queda con tu familia.",
          icon: Shield
        },
        {
          title: "🧠 Consciente del alzheimer",
          description: "Específicamente diseñado para ayudar a las familias a mantener conexión cuando la comunicación tradicional se vuelve difícil.",
          icon: Brain
        }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const WhyEternaSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Story Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground">
                {content.title}
              </h2>
              
              <blockquote className="text-xl sm:text-2xl text-muted-foreground italic leading-relaxed border-l-4 border-primary/30 pl-6 lg:pl-8">
                "{content.story}"
              </blockquote>
              
              <p className="text-lg text-primary font-medium">
                {content.highlight}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {content.features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4 text-left">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <Card className="p-8 sm:p-12 bg-gradient-to-br from-card to-card/50 border-2 shadow-2xl">
              <CardContent className="p-0 text-center space-y-8">
                
                {/* Voice Waveform Visualization */}
                <div className="space-y-4">
                  <div className="flex justify-center items-end gap-1 h-24">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div 
                        key={i}
                        className="bg-gradient-to-t from-primary to-primary/50 rounded-full animate-pulse"
                        style={{
                          width: '4px',
                          height: `${Math.random() * 60 + 20}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full mx-auto flex items-center justify-center">
                    <Heart className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === 'pt-BR' ? 'Forma de onda de voz se transformando em retrato' : currentLanguage === 'es' ? 'Forma de onda de voz transformándose en retrato' : 'Voice waveform blending into a portrait'}
                  </p>
                  <div className="h-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full mx-auto w-48" />
                </div>
                
              </CardContent>
            </Card>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full backdrop-blur-sm animate-float" />
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-accent/20 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '2s' }} />
          </div>

        </div>
        
      </div>
    </section>
  );
};