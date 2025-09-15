import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Upload, MessageCircle, Heart, Settings, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getContent = (language: string) => {
  const content = {
    en: {
      badge: "Simple process",
      title: "How it works",
      subtitle: "Three simple steps to preserve your loved one's digital presence",
      steps: [
        {
          title: "Share their story",
          description: "Upload photos, voice recordings, messages, and memories that capture their essence and personality.",
          details: "Our AI analyzes speech patterns, favorite phrases, and emotional expressions to understand their unique communication style.",
          icon: Upload,
          demo: "Upload memories, photos, voice notes..."
        },
        {
          title: "AI learns their voice", 
          description: "Advanced AI technology learns their speech patterns, personality traits, and way of expressing emotions.",
          details: "Using cutting-edge machine learning, we create a digital representation that captures not just how they sound, but how they think and respond.",
          icon: Settings,
          demo: "Processing voice patterns and personality..."
        },
        {
          title: "Start conversations",
          description: "Have meaningful conversations that feel authentic, preserving their wisdom and love for future generations.",
          details: "The AI responds in their voice and style, sharing memories, offering comfort, and maintaining that special connection.",
          icon: MessageCircle,
          demo: "Having a conversation with your loved one..."
        }
      ],
      tryNow: "Try it now"
    },
    'pt-BR': {
      badge: "Processo simples",
      title: "Como funciona",
      subtitle: "Três passos simples para preservar a presença digital do seu ente querido",
      steps: [
        {
          title: "Compartilhe a história deles",
          description: "Faça upload de fotos, gravações de voz, mensagens e memórias que capturam sua essência e personalidade.",
          details: "Nossa IA analisa padrões de fala, frases favoritas e expressões emocionais para entender seu estilo único de comunicação.",
          icon: Upload,
          demo: "Enviando memórias, fotos, notas de voz..."
        },
        {
          title: "IA aprende a voz deles",
          description: "Tecnologia de IA avançada aprende seus padrões de fala, traços de personalidade e forma de expressar emoções.",
          details: "Usando aprendizado de máquina de ponta, criamos uma representação digital que captura não apenas como eles soam, mas como pensam e respondem.",
          icon: Settings,
          demo: "Processando padrões de voz e personalidade..."
        },
        {
          title: "Inicie conversas",
          description: "Tenha conversas significativas que parecem autênticas, preservando sua sabedoria e amor para gerações futuras.",
          details: "A IA responde com a voz e estilo deles, compartilhando memórias, oferecendo conforto e mantendo aquela conexão especial.",
          icon: MessageCircle,
          demo: "Conversando com seu ente querido..."
        }
      ],
      tryNow: "Experimente agora"
    },
    es: {
      badge: "Proceso simple",
      title: "Cómo funciona", 
      subtitle: "Tres pasos simples para preservar la presencia digital de tu ser querido",
      steps: [
        {
          title: "Comparte su historia",
          description: "Sube fotos, grabaciones de voz, mensajes y recuerdos que capturan su esencia y personalidad.",
          details: "Nuestra IA analiza patrones de habla, frases favoritas y expresiones emocionales para entender su estilo único de comunicación.",
          icon: Upload,
          demo: "Subiendo recuerdos, fotos, notas de voz..."
        },
        {
          title: "IA aprende su voz",
          description: "Tecnología de IA avanzada aprende sus patrones de habla, rasgos de personalidad y forma de expresar emociones.",
          details: "Usando aprendizaje automático de vanguardia, creamos una representación digital que captura no solo cómo suenan, sino cómo piensan y responden.",
          icon: Settings,
          demo: "Procesando patrones de voz y personalidad..."
        },
        {
          title: "Inicia conversaciones",
          description: "Ten conversaciones significativas que se sienten auténticas, preservando su sabiduría y amor para generaciones futuras.",
          details: "La IA responde en su voz y estilo, compartiendo recuerdos, ofreciendo consuelo y manteniendo esa conexión especial.",
          icon: MessageCircle,
          demo: "Conversando con tu ser querido..."
        }
      ],
      tryNow: "Pruébalo ahora"
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const InteractiveHowItWorks: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
      
      <div className="max-w-6xl mx-auto px-6 relative">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-4">
            {content.badge}
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-[-0.02em]">
            {content.title}
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Interactive Steps */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Steps Navigation */}
          <div className="space-y-6">
            {content.steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = activeStep === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`cursor-pointer group transition-all duration-300 ${
                    isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? 'border-primary/30 bg-primary/5 shadow-lg' 
                      : 'border-border/30 bg-card/30 hover:border-border/50 hover:bg-card/50'
                  }`}>
                    
                    {/* Step number and icon */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            Step {index + 1}
                          </span>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                            isActive ? 'text-primary rotate-90' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {step.description}
                    </p>
                    
                    {/* Expanded details */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="pt-3 border-t border-border/20">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.details}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-card/50 rounded-3xl border border-border/30 p-8 backdrop-blur-sm">
              
              {/* Demo content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {content.steps[activeStep].title}
                  </h4>
                  
                  <div className="bg-muted/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
                      {content.steps[activeStep].demo}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    {content.tryNow}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-2xl blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/5 rounded-2xl blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};