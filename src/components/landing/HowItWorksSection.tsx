import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Mic, Settings, MessageCircle, Share } from 'lucide-react';
import { motion } from 'framer-motion';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Como funciona",
      subtitle: "Four simple steps to preserve and interact with cherished voices 💖",
      steps: [{
        title: "Record",
        description: "Upload a short voice sample or choose a base voice - it's that easy!",
        detail: "Just a few minutes of clear audio is enough to get started ✨"
      }, {
        title: "Configure",
        description: "Pick language, style, and personality traits with love.",
        detail: "Customize how your loved one's voice sounds and responds 💖"
      }, {
        title: "Chat & listen",
        description: "Ask questions and hear authentic responses - pure magic!",
        detail: "Have meaningful conversations powered by preserved memories 🌟"
      }, {
        title: "Share",
        description: "Save curated moments for family to treasure forever.",
        detail: "Create lasting audio keepsakes for future generations 💝"
      }],
      notePrefix: "Note:",
      note: "Personal voice cloning available on paid plans and only when capacity allows."
    },
    'pt-BR': {
      title: "Como funciona",
      subtitle: "Quatro passos simples para preservar e interagir com vozes queridas 💖",
      steps: [{
        title: "Gravar",
        description: "Envie uma amostra de voz ou escolha uma voz base - é assim fácil!",
        detail: "Apenas alguns minutos de áudio claro são suficientes para começar ✨"
      }, {
        title: "Configurar",
        description: "Escolha idioma, estilo e traços de personalidade com carinho.",
        detail: "Personalize como a voz do seu ente querido soa e responde 💖"
      }, {
        title: "Conversar",
        description: "Faça perguntas e ouça respostas autênticas - pura magia!",
        detail: "Tenha conversas significativas alimentadas por memórias preservadas 🌟"
      }, {
        title: "Compartilhar",
        description: "Salve momentos especiais para a família guardar para sempre.",
        detail: "Crie recordações em áudio duradouras para as próximas gerações 💝"
      }],
      notePrefix: "Nota:",
      note: "Clone de voz pessoal disponível em planos pagos e apenas quando a capacidade permite."
    },
    es: {
      title: "Cómo funciona",
      subtitle: "Cuatro pasos simples para preservar e interactuar con voces queridas",
      steps: [{
        title: "Grabar",
        description: "Sube una muestra de voz o elige una voz base.",
        detail: "Solo unos minutos de audio claro son suficientes para empezar."
      }, {
        title: "Configurar",
        description: "Elige idioma, estilo y rasgos de personalidad.",
        detail: "Personaliza cómo suena y responde la voz de tu ser querido."
      }, {
        title: "Charlar",
        description: "Haz preguntas y escucha respuestas auténticas.",
        detail: "Ten conversaciones significativas alimentadas por memorias preservadas."
      }, {
        title: "Compartir",
        description: "Guarda momentos especiales para la familia.",
        detail: "Crea recuerdos de audio duraderos para futuras generaciones."
      }],
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
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-secondary/20 rounded-full animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="text-center max-w-4xl mx-auto mb-16 lg:mb-20"
        >
          <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-foreground mb-6">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Steps with Timeline Design */}
        <div className="relative">
          {/* Central Timeline Line (hidden on mobile) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent transform -translate-x-1/2"></div>
          
          <div className="space-y-12 lg:space-y-16">
            {content.steps.map((step, index) => {
              const IconComponent = icons[index];
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative lg:flex lg:items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Timeline Dot (hidden on mobile) */}
                  <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                  </div>
                  
                  {/* Card */}
                  <div className={`lg:w-5/12 ${isEven ? '' : 'lg:ml-auto'}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-6 sm:p-8">
                        {/* Mobile Step Number */}
                        <div className="lg:hidden flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full text-sm font-bold mb-4 mx-auto">
                          {index + 1}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4 sm:gap-6 lg:gap-4 xl:gap-6">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-primary/10">
                              <IconComponent className="w-8 h-8 text-primary" />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 text-center sm:text-left lg:text-center xl:text-left">
                            {/* Desktop Step Number */}
                            <div className="hidden lg:block lg:mb-2">
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                                {index + 1}
                              </span>
                            </div>
                            
                            <h3 className="font-serif text-[clamp(1.125rem,2.5vw,1.5rem)] font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                              {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-2">
                              {step.description}
                            </p>
                            <p className="text-sm text-muted-foreground/80 leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Desktop Step Label */}
                  <div className={`hidden lg:block lg:w-2/12 ${isEven ? 'lg:text-right lg:pr-8' : 'lg:text-left lg:pl-8'}`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-2xl font-bold text-lg border border-primary/20`}>
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
            <p className="text-muted-foreground mb-4">
              <span className="text-primary font-semibold">{content.notePrefix}</span> {content.note}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};