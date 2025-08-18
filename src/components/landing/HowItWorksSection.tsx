import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Mic, Settings, MessageCircle, Share, Play, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      note: "Personal voice cloning available on paid plans and only when capacity allows.",
      watchDemo: "Watch Demo",
      tryNow: "Try Now"
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
      note: "Clone de voz pessoal disponível em planos pagos e apenas quando a capacidade permite.",
      watchDemo: "Ver Demo",
      tryNow: "Experimente"
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
      note: "Clonación de voz personal disponible en planes pagos y solo cuando la capacidad lo permite.",
      watchDemo: "Ver Demo",
      tryNow: "Probar Ahora"
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const HowItWorksSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const icons = [Mic, Settings, MessageCircle, Share];
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const stepColors = [
    'from-blue-500/20 to-purple-500/20',
    'from-purple-500/20 to-pink-500/20', 
    'from-pink-500/20 to-orange-500/20',
    'from-orange-500/20 to-blue-500/20'
  ];

  const stepAccents = [
    'border-blue-500/30 text-blue-600 bg-blue-500/10',
    'border-purple-500/30 text-purple-600 bg-purple-500/10',
    'border-pink-500/30 text-pink-600 bg-pink-500/10', 
    'border-orange-500/30 text-orange-600 bg-orange-500/10'
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent)] opacity-70" />
      </div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl"
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Revolutionary Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={{ rotate: isHovered ? [0, 5, -5, 0] : 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          </motion.div>
          
          <motion.h2 
            className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-bold text-foreground mb-6 leading-tight"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-300% bg-clip-text text-transparent">
              {content.title}
            </span>
          </motion.h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Revolutionary Steps Layout */}
        <div className="relative">
          {/* Connection Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: 1 }}>
            <motion.path
              d="M 200 100 Q 600 50 800 300 Q 600 550 200 500"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="25%" stopColor="#8b5cf6" stopOpacity={0.5} />
                <stop offset="50%" stopColor="#ec4899" stopOpacity={0.5} />
                <stop offset="75%" stopColor="#f97316" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
            {content.steps.map((step, index) => {
              const IconComponent = icons[index];
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  className={`relative ${isLeft ? 'lg:justify-self-end' : 'lg:justify-self-start'} max-w-md lg:max-w-lg`}
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <Card className={`group relative overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl ${
                    activeStep === index 
                      ? 'border-primary/50 shadow-xl scale-105' 
                      : 'border-border/30 hover:border-primary/30'
                  }`}>
                    
                    {/* Animated Background Gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${stepColors[index]} opacity-0 group-hover:opacity-100`}
                      animate={activeStep === index ? {
                        background: [
                          `linear-gradient(45deg, ${stepColors[index].split(' ')[0].replace('from-', 'rgba(').replace('/20', ', 0.1)')}, ${stepColors[index].split(' ')[2].replace('to-', 'rgba(').replace('/20', ', 0.1)')})`,
                          `linear-gradient(225deg, ${stepColors[index].split(' ')[2].replace('to-', 'rgba(').replace('/20', ', 0.2)')}, ${stepColors[index].split(' ')[0].replace('from-', 'rgba(').replace('/20', ', 0.1)')})`,
                          `linear-gradient(45deg, ${stepColors[index].split(' ')[0].replace('from-', 'rgba(').replace('/20', ', 0.1)')}, ${stepColors[index].split(' ')[2].replace('to-', 'rgba(').replace('/20', ', 0.1)')})`,
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <CardContent className="p-8 sm:p-10 relative z-10">
                      {/* Step Header */}
                      <div className="flex items-start gap-6 mb-6">
                        {/* Mega Step Number */}
                        <motion.div
                          className={`flex-shrink-0 w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-bold text-2xl transition-all duration-300 ${stepAccents[index]}`}
                          animate={activeStep === index ? { 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {index + 1}
                        </motion.div>

                        {/* Icon with Animation */}
                        <motion.div 
                          className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent className="w-7 h-7 text-primary" />
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {step.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed text-base">
                          {step.description}
                        </p>

                        <motion.p 
                          className="text-sm text-muted-foreground/80 leading-relaxed"
                          initial={{ opacity: 0.7 }}
                          animate={activeStep === index ? { opacity: 1 } : { opacity: 0.7 }}
                        >
                          {step.detail}
                        </motion.p>

                        {/* Interactive Elements */}
                        <AnimatePresence>
                          {activeStep === index && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="flex gap-3 pt-4"
                            >
                              <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Play className="w-4 h-4" />
                                {content.watchDemo}
                              </motion.button>
                              
                              <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {content.tryNow}
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>

                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${stepColors[index].split(' ')[0].replace('from-', '').replace('/20', '/10')}, transparent 70%)`
                      }}
                    />
                  </Card>

                  {/* Step Connector Arrow */}
                  {index < content.steps.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index + 1) * 0.2 + 0.5 }}
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30">
                        <ArrowRight className="w-4 h-4 text-primary rotate-90" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Revolutionary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-20"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-xl"
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm rounded-2xl p-8 border border-primary/20">
              <p className="text-muted-foreground text-lg mb-2">
                <span className="text-primary font-semibold">{content.notePrefix}</span> {content.note}
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};