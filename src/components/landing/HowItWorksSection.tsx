import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SettingsAdjust, Microphone, FolderDetails, Chat, Share, ArrowRight } from '@carbon/icons-react';
import { motion } from 'framer-motion';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "How It Works",
      subtitle: "Five simple steps to preserve and interact with cherished voices 💖",
      steps: [{
        title: "Configure",
        description: "Pick language, style, and personality traits with love.",
        detail: "Customize how your loved one's voice sounds and responds 💖"
      }, {
        title: "Add Memories",
        description: "Upload texts, stories, and personal moments to build their essence.",
        detail: "Share voice notes, texts, and memories to create their unique personality 🧠"
      }, {
        title: "Record",
        description: "Upload a short voice sample or choose a base voice - it's that easy!",
        detail: "Just a few minutes of clear audio is enough to get started ✨"
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
      subtitle: "Cinco passos simples para preservar e interagir com vozes queridas 💖",
      steps: [{
        title: "Configurar",
        description: "Escolha idioma, estilo e traços de personalidade com carinho.",
        detail: "Personalize como a voz do seu ente querido soa e responde 💖"
      }, {
        title: "Adicionar Memórias",
        description: "Envie textos, histórias e momentos pessoais para criar sua essência.",
        detail: "Compartilhe notas de voz, textos e memórias para criar sua personalidade única 🧠"
      }, {
        title: "Gravar",
        description: "Envie uma amostra de voz ou escolha uma voz base - é assim fácil!",
        detail: "Apenas alguns minutos de áudio claro são suficientes para começar ✨"
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
      subtitle: "Cinco pasos simples para preservar e interactuar con voces queridas",
      steps: [{
        title: "Configurar",
        description: "Elige idioma, estilo y rasgos de personalidad.",
        detail: "Personaliza cómo suena y responde la voz de tu ser querido."
      }, {
        title: "Añadir Memorias",
        description: "Sube textos, historias y momentos personales para crear su esencia.",
        detail: "Comparte notas de voz, textos y memorias para crear su personalidad única 🧠"
      }, {
        title: "Grabar",
        description: "Sube una muestra de voz o elige una voz base.",
        detail: "Solo unos minutos de audio claro son suficientes para empezar."
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
  const icons = [SettingsAdjust, FolderDetails, Microphone, Chat, Share];
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative py-20 sm:py-24 lg:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
      
      {/* Minimalist Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/5 via-background to-muted/10" />
      
      {/* Subtle Elements */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/2 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Container */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20 lg:mb-24"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Modern Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6 lg:gap-8">
          {content.steps.map((step, index) => {
            const IconComponent = icons[index];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="relative group"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                
                {/* Modern Step Card */}
                <div className="relative bg-card/60 backdrop-blur-sm rounded-3xl p-8 lg:p-10 text-center border border-border/30 transition-all duration-500 hover:bg-card/80 hover:scale-105 hover:border-primary/20 hover:shadow-lg">
                  
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Large Icon */}
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <IconComponent className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {step.description}
                    </p>
                    
                    <motion.p 
                      className="text-sm text-muted-foreground/80 leading-relaxed"
                      initial={{ opacity: 0.7 }}
                      animate={hoveredStep === index ? { opacity: 1 } : { opacity: 0.7 }}
                    >
                      {step.detail}
                    </motion.p>
                  </div>
                </div>

                {/* Connection Line for large screens */}
                {index < content.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-border/30 -translate-y-1/2 z-0" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};