import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Security, Microphone, Flash, Globe } from '@carbon/icons-react';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Thoughtfully designed features",
      features: [
        {
          title: "🔒 Private by default",
          description: "Secure, private storage that keeps your family's voices and memories safe and sound! 🛡️",
          icon: Security,
          highlight: "🔐 End-to-end encrypted"
        },
        {
          title: "🎭 Hybrid voices", 
          description: "Base voices for all users, personal voice cloning for paid users when capacity allows - magic at work! ✨",
          icon: Microphone,
          highlight: "🚀 ElevenLabs powered"
        },
        {
          title: "🧠 Cost-smart AI",
          description: "Together.ai (OSS-20B) for free users, OpenAI GPT-5o for premium conversations - the best of both worlds! 💫",
          icon: Flash,
          highlight: "👨‍👩‍👧‍👦 Optimized for families"
        },
        {
          title: "🌍 Multilingual",
          description: "Available in English, Portuguese (Brazil), and Spanish to serve global families everywhere! 🗣️",
          icon: Globe,
          highlight: "🌎 EN, PT-BR, ES"
        }
      ]
    },
    'pt-BR': {
      title: "Funcionalidades pensadas com carinho",
      features: [
        {
          title: "🔒 Privado por padrão",
          description: "Armazenamento seguro e privado que mantém as vozes e memórias da sua família protegidas e seguras! 🛡️",
          icon: Security,
          highlight: "🔐 Criptografado ponta a ponta"
        },
        {
          title: "🎭 Vozes híbridas",
          description: "Vozes base para todos os usuários, clone de voz pessoal para usuários pagos quando a capacidade permite - magia pura! ✨",
          icon: Microphone,
          highlight: "🚀 Alimentado por ElevenLabs"
        },
        {
          title: "🧠 IA econômica",
          description: "Together.ai (OSS-20B) para usuários gratuitos, OpenAI GPT-5o para conversas premium - o melhor dos dois mundos! 💫",
          icon: Flash,
          highlight: "👨‍👩‍👧‍👦 Otimizado para famílias"
        },
        {
          title: "🌍 Multilíngue",
          description: "Disponível em Inglês, Português (Brasil) e Espanhol para servir famílias globais em todos os lugares! 🗣️",
          icon: Globe,
          highlight: "🌎 EN, PT-BR, ES"
        }
      ]
    },
    es: {
      title: "Características diseñadas con cuidado",
      features: [
        {
          title: "Privado por defecto",
          description: "Almacenamiento seguro y privado que mantiene las voces y memorias de tu familia protegidas.",
          icon: Security,
          highlight: "Cifrado extremo a extremo"
        },
        {
          title: "Voces híbridas",
          description: "Voces base para todos los usuarios, clonación de voz personal para usuarios pagos cuando la capacidad lo permite.",
          icon: Microphone,
          highlight: "Impulsado por ElevenLabs"
        },
        {
          title: "IA económica",
          description: "Together.ai (OSS-20B) para usuarios gratuitos, OpenAI GPT-5o para conversaciones premium.",
          icon: Flash,
          highlight: "Optimizado para familias"
        },
        {
          title: "Multilingüe", 
          description: "Disponible en Inglés, Portugués (Brasil) y Español para servir a familias globales.",
          icon: Globe,
          highlight: "EN, PT-BR, ES"
        }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const FeaturesSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            {content.title}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  
                  {/* Icon and Highlight */}
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent size={20} />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {feature.highlight}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
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