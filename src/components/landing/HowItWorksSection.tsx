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
  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  const icons = [Mic, Settings, MessageCircle, Share];
  return <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/30" />
      
      {/* Animated Background Orbs */}
      <motion.div className="absolute top-20 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" animate={{
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.7, 0.3]
    }} transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }} />
      <motion.div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" animate={{
      scale: [1.2, 1, 1.2],
      opacity: [0.4, 0.2, 0.4]
    }} transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }} />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        
        {/* Enhanced Header */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.8
      }} className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            {content.title}
          </motion.h2>
          <motion.p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            {content.subtitle}
          </motion.p>
        </motion.div>

        {/* Enhanced Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10 mb-20 lg:mb-24">
          {content.steps.map((step, index) => {
          const IconComponent = icons[index];
          return <motion.div key={index} initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: "-100px"
          }} transition={{
            duration: 0.6,
            delay: index * 0.2
          }}>
                <div className="group hover:scale-105 transition-transform duration-300">
                  <Card className="relative group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 bg-gradient-to-br from-card to-card/80 h-full min-h-[420px]">
                    <CardContent className="p-8 sm:p-10 lg:p-8 xl:p-10 text-center space-y-6 lg:space-y-8 relative flex flex-col justify-between h-full">
                      
                      {/* Simple Step Number */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl flex items-center justify-center text-base font-bold shadow-lg border-2 border-background">
                          {index + 1}
                        </div>
                      </div>

                       <div className="pt-4">

                       {/* Simple Icon */}
                       <div className="w-16 h-16 bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-md">
                         <IconComponent className="w-8 h-8 text-primary" />
                       </div>

                       {/* Simple Content */}
                       <div className="space-y-4 lg:space-y-6 flex-1 flex flex-col justify-center">
                         <h3 className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                           {step.title}
                         </h3>
                         <p className="text-muted-foreground leading-relaxed text-base lg:text-lg px-2">
                           {step.description}
                         </p>
                         <p className="text-sm text-muted-foreground/70 leading-relaxed font-light px-2">
                           {step.detail}
                         </p>
                       </div>
                       </div>

                       {/* Connection Line (for larger screens) */}
                       {index < content.steps.length - 1 && <div className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />}
                      

                    </CardContent>
                  </Card>
                </div>
              </motion.div>;
        })}
        </div>

        {/* Enhanced Note */}
        <motion.div className="text-center" initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8,
        delay: 0.6
      }}>
          
        </motion.div>

      </div>
    </section>;
};