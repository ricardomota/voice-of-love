import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Mic, Settings, MessageCircle, Share } from 'lucide-react';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "How It Works",
      subtitle: "Four simple steps to preserve and interact with cherished voices",
      steps: [
        {
          title: "Record",
          description: "Upload a short voice sample or choose a base voice.",
          detail: "Just a few minutes of clear audio is enough to get started."
        },
        {
          title: "Configure", 
          description: "Pick language, style, and personality traits.",
          detail: "Customize how your loved one's voice sounds and responds."
        },
        {
          title: "Chat & Listen",
          description: "Ask questions and hear authentic responses.",
          detail: "Have meaningful conversations powered by preserved memories."
        },
        {
          title: "Share",
          description: "Save curated moments for family.",
          detail: "Create lasting audio keepsakes for future generations."
        }
      ],
      notePrefix: "Note:",
      note: "Personal voice cloning available on paid plans and only when capacity allows."
    },
    'pt-BR': {
      title: "Como Funciona",
      subtitle: "Quatro passos simples para preservar e interagir com vozes queridas",
      steps: [
        {
          title: "Gravar",
          description: "Envie uma amostra de voz ou escolha uma voz base.",
          detail: "Apenas alguns minutos de áudio claro são suficientes para começar."
        },
        {
          title: "Configurar",
          description: "Escolha idioma, estilo e traços de personalidade.",
          detail: "Personalize como a voz do seu ente querido soa e responde."
        },
        {
          title: "Conversar",
          description: "Faça perguntas e ouça respostas autênticas.",
          detail: "Tenha conversas significativas alimentadas por memórias preservadas."
        },
        {
          title: "Compartilhar",
          description: "Salve momentos especiais para a família.",
          detail: "Crie recordações em áudio duradouras para as próximas gerações."
        }
      ],
      notePrefix: "Nota:",
      note: "Clone de voz pessoal disponível em planos pagos e apenas quando a capacidade permite."
    },
    es: {
      title: "Cómo Funciona", 
      subtitle: "Cuatro pasos simples para preservar e interactuar con voces queridas",
      steps: [
        {
          title: "Grabar",
          description: "Sube una muestra de voz o elige una voz base.",
          detail: "Solo unos minutos de audio claro son suficientes para empezar."
        },
        {
          title: "Configurar",
          description: "Elige idioma, estilo y rasgos de personalidad.",
          detail: "Personaliza cómo suena y responde la voz de tu ser querido."
        },
        {
          title: "Charlar",
          description: "Haz preguntas y escucha respuestas auténticas.",
          detail: "Ten conversaciones significativas alimentadas por memorias preservadas."
        },
        {
          title: "Compartir",
          description: "Guarda momentos especiales para la familia.",
          detail: "Crea recuerdos de audio duraderos para futuras generaciones."
        }
      ],
      notePrefix: "Nota:",
      note: "Clonación de voz personal disponible en planes pagos y solo cuando la capacidad lo permite."
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const HowItWorksSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const icons = [Mic, Settings, MessageCircle, Share];

  return (
    <section id="how-it-works" className="py-20 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {content.steps.map((step, index) => {
            const IconComponent = icons[index];
            return (
              <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 sm:p-8 text-center space-y-4">
                  
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Note */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground/80 bg-muted/50 rounded-xl px-6 py-4 inline-block max-w-2xl">
            <span className="font-medium">{content.notePrefix}</span> {content.note}
          </p>
        </div>

      </div>
    </section>
  );
};