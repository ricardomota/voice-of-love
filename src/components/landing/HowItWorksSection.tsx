import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SettingsAdjust, Microphone, Chat, Share, ArrowRight } from '@carbon/icons-react';
import { motion } from 'framer-motion';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Como funciona",
      subtitle: "Four simple steps to preserve and interact with cherished voices 💖",
      steps: [{
        title: "Configure",
        description: "Pick language, style, and personality traits with love.",
        detail: "Customize how your loved one's voice sounds and responds 💖"
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
      subtitle: "Quatro passos simples para preservar e interagir com vozes queridas 💖",
      steps: [{
        title: "Configurar",
        description: "Escolha idioma, estilo e traços de personalidade com carinho.",
        detail: "Personalize como a voz do seu ente querido soa e responde 💖"
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
      subtitle: "Cuatro pasos simples para preservar e interactuar con voces queridas",
      steps: [{
        title: "Configurar",
        description: "Elige idioma, estilo y rasgos de personalidad.",
        detail: "Personaliza cómo suena y responde la voz de tu ser querido."
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
  const icons = [SettingsAdjust, Microphone, Chat, Share];
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 overflow-hidden">
      
      {/* Hero-style Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Additional Gradient Blur Elements */}
        <motion.div 
          className="absolute top-1/3 left-1/3 w-64 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [-20, 20, -20],
            y: [-10, 10, -10],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/5 w-48 h-48 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-56 h-28 bg-gradient-to-l from-orange-400/25 to-red-400/25 rounded-full blur-3xl"
          animate={{
            y: [10, -10, 10],
            x: [5, -5, 5],
            opacity: [0.15, 0.35, 0.15]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Container with consistent max-width */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header with better responsive typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Steps Flow */}
        <div className="relative">
          
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4">
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
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="relative group"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  
                  {/* Step Card */}
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:border-white/40">
                    
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Icon with responsive sizing */}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-white/30 transition-colors duration-300"
                    >
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" size={40} />
                    </div>
                    
                    {/* Content with responsive text */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                        {step.title}
                      </h3>
                      
                      <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                        {step.description}
                      </p>
                      
                      <motion.p 
                        className="text-xs sm:text-sm text-white/60 leading-relaxed"
                        initial={{ opacity: 0.7 }}
                        animate={hoveredStep === index ? { opacity: 1 } : { opacity: 0.7 }}
                      >
                        {step.detail}
                      </motion.p>
                    </div>
                  </div>

                  {/* Connection Arrow */}
                  {index < content.steps.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-1/2 -right-2 w-4 h-4 -translate-y-1/2 z-10"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index + 1) * 0.15 + 0.5 }}
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <ArrowRight className="w-4 h-4 text-primary" size={16} />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>


      </div>
    </section>
  );
};