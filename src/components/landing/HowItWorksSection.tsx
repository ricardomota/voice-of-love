import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Settings, FileStack, Mic, MessageCircle, Share2, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const getContent = (language: string) => {
  const content = {
    en: {
      badge: "Simple process, powerful results",
      title: "From memories to conversations",
      subtitle: "Transform precious memories into living conversations in just five simple steps.",
      steps: [
        {
          title: "Setup Profile",
          description: "Choose language, personality traits, and conversation style with care.",
          detail: "Customize voice, personality, and response patterns to match your loved one's unique character.",
          icon: Settings
        },
        {
          title: "Share Memories",
          description: "Upload stories, photos, voice notes, and cherished moments that define them.",
          detail: "Import from texts, photos, voice messages, or social media to build their digital essence.",
          icon: FileStack
        },
        {
          title: "Voice Training", 
          description: "Record a short voice sample or select from our premium voice library.",
          detail: "Just 2-3 minutes of clear audio creates a personalized voice model.",
          icon: Mic
        },
        {
          title: "Start Chatting",
          description: "Have meaningful conversations powered by their authentic personality and memories.",
          detail: "Ask questions, share updates, or simply talk - just like you always did.",
          icon: MessageCircle
        },
        {
          title: "Preserve & Share",
          description: "Save special conversation moments and share them with family members.",
          detail: "Create audio keepsakes and family memory archives for future generations.",
          icon: Share2
        }
      ],
      cta: {
        title: "Ready to preserve precious voices?", 
        button: "Get Started Today"
      }
    },
    'pt-BR': {
      badge: "Processo simples, resultados poderosos",
      title: "De memórias a conversas",
      subtitle: "Transforme memórias preciosas em conversas vivas em apenas cinco passos simples.",
      steps: [
        {
          title: "Configurar Perfil",
          description: "Escolha idioma, traços de personalidade e estilo de conversa com carinho.",
          detail: "Personalize voz, personalidade e padrões de resposta para combinar com o caráter único da pessoa.",
          icon: Settings
        },
        {
          title: "Compartilhar Memórias",
          description: "Envie histórias, fotos, notas de voz e momentos queridos que a definem.",
          detail: "Importe de textos, fotos, mensagens de voz ou redes sociais para construir sua essência digital.",
          icon: FileStack
        },
        {
          title: "Treinar Voz",
          description: "Grave uma amostra curta de voz ou selecione de nossa biblioteca premium.",
          detail: "Apenas 2-3 minutos de áudio claro criam um modelo de voz personalizado.",
          icon: Mic
        },
        {
          title: "Começar a Conversar",
          description: "Tenha conversas significativas alimentadas por sua personalidade autêntica e memórias.",
          detail: "Faça perguntas, compartilhe atualizações ou simplesmente converse - como sempre fez.",
          icon: MessageCircle
        },
        {
          title: "Preservar e Compartilhar",
          description: "Salve momentos especiais de conversa e compartilhe com familiares.",
          detail: "Crie recordações em áudio e arquivos de memória familiar para futuras gerações.",
          icon: Share2
        }
      ],
      cta: {
        title: "Pronto para preservar vozes preciosas?",
        button: "Começar Hoje"
      }
    },
    es: {
      badge: "Proceso simple, resultados poderosos",
      title: "De memorias a conversaciones",
      subtitle: "Transforma memorias preciosas en conversaciones vivas en solo cinco pasos simples.",
      steps: [
        {
          title: "Configurar Perfil",
          description: "Elige idioma, rasgos de personalidad y estilo de conversación con cuidado.",
          detail: "Personaliza voz, personalidad y patrones de respuesta para combinar con el carácter único de la persona.",
          icon: Settings
        },
        {
          title: "Compartir Memorias",
          description: "Sube historias, fotos, notas de voz y momentos queridos que la definen.",
          detail: "Importa de textos, fotos, mensajes de voz o redes sociales para construir su esencia digital.",
          icon: FileStack
        },
        {
          title: "Entrenar Voz",
          description: "Graba una muestra corta de voz o selecciona de nuestra biblioteca premium.",
          detail: "Solo 2-3 minutos de audio claro crean un modelo de voz personalizado.",
          icon: Mic
        },
        {
          title: "Empezar a Charlar",
          description: "Ten conversaciones significativas alimentadas por su personalidad auténtica y memorias.",
          detail: "Haz preguntas, comparte actualizaciones o simplemente habla - como siempre hiciste.",
          icon: MessageCircle
        },
        {
          title: "Preservar y Compartir",
          description: "Guarda momentos especiales de conversación y compártelos con familiares.",
          detail: "Crea recuerdos de audio y archivos de memoria familiar para futuras generaciones.",
          icon: Share2
        }
      ],
      cta: {
        title: "¿Listo para preservar voces preciosas?",
        button: "Empezar Hoy"
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const HowItWorksSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-background to-muted/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-32 left-32 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium text-sm mb-6">
            <Play className="w-4 h-4" />
            {content.badge}
          </div>
          
          <h2 className="font-inter text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-[-0.02em]">
            {content.title}
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Interactive Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Steps List */}
          <div className="lg:col-span-1 space-y-4">
            {content.steps.map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    activeStep === index ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                    activeStep === index 
                      ? 'bg-primary/10 border-primary/30 shadow-lg' 
                      : 'bg-card/60 border-border/50 hover:bg-card/80'
                  }`}>
                    
                    {/* Step Number & Icon */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        activeStep === index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        activeStep === index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className={`font-bold text-lg transition-colors duration-300 ${
                        activeStep === index ? 'text-primary' : 'text-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <motion.div 
                      className="mt-4 flex justify-end"
                      animate={activeStep === index ? { x: 8 } : { x: 0 }}
                    >
                      <ArrowRight className={`w-5 h-5 transition-colors duration-300 ${
                        activeStep === index ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Active Step Detail */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-32"
            >
              <div className="p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                    {React.createElement(content.steps[activeStep].icon, { className: "w-8 h-8 text-primary-foreground" })}
                  </div>
                  
                  <div>
                    <div className="text-sm text-primary font-semibold mb-1">
                      Step {activeStep + 1} of {content.steps.length}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {content.steps[activeStep].title}
                    </h3>
                  </div>
                </div>
                
                {/* Description */}
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {content.steps[activeStep].description}
                  </p>
                  
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-foreground font-medium">
                      {content.steps[activeStep].detail}
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{Math.round(((activeStep + 1) / content.steps.length) * 100)}%</span>
                  </div>
                  
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((activeStep + 1) / content.steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="inline-flex flex-col items-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground">
              {content.cta.title}
            </h3>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center gap-3"
            >
              {content.cta.button}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};