import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight, Heart, Shield, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface PersonalStoryProps {
  onGetStarted: () => void;
}

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Why I Created Eterna",
      personalStory: "I built this tool with love, motivated by the need to keep my mother present, even with Alzheimer's. I want to help other families preserve the memories and personalities of their loved ones.",
      mission: {
        title: "Our Mission",
        description: "Every family facing memory challenges deserves to keep their loved one's voice and personality alive. Eterna bridges the gap between technology and human connection."
      },
      values: [
        {
          title: "Built with Love",
          description: "Created by someone who understands the pain of watching memories slip away.",
          icon: Heart
        },
        {
          title: "Privacy First",
          description: "Your family's voices and memories are sacred. We protect them with the highest security.",
          icon: Shield
        },
        {
          title: "Alzheimer's Aware",
          description: "Specifically designed for families navigating memory loss and cognitive challenges.",
          icon: Brain
        }
      ],
      cta: "Begin Your Journey"
    },
    'pt-BR': {
      title: "Por que Criei o Eterna",
      personalStory: "Criei esta ferramenta com amor, motivado pela necessidade de manter minha mãe presente, mesmo com o Alzheimer. Quero ajudar outras famílias a preservarem as memórias e personalidades de seus entes queridos.",
      mission: {
        title: "Nossa Missão",
        description: "Toda família enfrentando desafios de memória merece manter viva a voz e personalidade de seus entes queridos. O Eterna conecta tecnologia com conexão humana."
      },
      values: [
        {
          title: "Feito com Amor",
          description: "Criado por alguém que entende a dor de ver memórias se desvanecendo.",
          icon: Heart
        },
        {
          title: "Privacidade Primeiro",
          description: "As vozes e memórias da sua família são sagradas. Protegemos com a mais alta segurança.",
          icon: Shield
        },
        {
          title: "Consciente do Alzheimer",
          description: "Especificamente projetado para famílias navegando perda de memória e desafios cognitivos.",
          icon: Brain
        }
      ],
      cta: "Comece Sua Jornada"
    },
    es: {
      title: "Por qué Creé Eterna",
      personalStory: "Creé esta herramienta con amor, motivado por la necesidad de mantener a mi madre presente, incluso con Alzheimer. Quiero ayudar a otras familias a preservar los recuerdos y personalidades de sus seres queridos.",
      mission: {
        title: "Nuestra Misión",
        description: "Cada familia enfrentando desafíos de memoria merece mantener viva la voz y personalidad de sus seres queridos. Eterna conecta tecnología con conexión humana."
      },
      values: [
        {
          title: "Hecho con Amor",
          description: "Creado por alguien que entiende el dolor de ver recuerdos desvaneciéndose.",
          icon: Heart
        },
        {
          title: "Privacidad Primero",
          description: "Las voces y recuerdos de tu familia son sagrados. Los protegemos con la más alta seguridad.",
          icon: Shield
        },
        {
          title: "Consciente del Alzheimer",
          description: "Específicamente diseñado para familias navegando pérdida de memoria y desafíos cognitivos.",
          icon: Brain
        }
      ],
      cta: "Comienza Tu Viaje"
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const PersonalStory: React.FC<PersonalStoryProps> = ({ onGetStarted }) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  // Netflix-style animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const heroCardVariants = {
    hidden: { opacity: 0, x: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        delay: 0.3
      }
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-background via-background/95 to-accent/5 relative overflow-hidden">
      {/* Enhanced background with animated elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/4 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Personal Story Header with enhanced animations */}
        <motion.div 
          className="max-w-6xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div 
            className="text-center mb-12"
            variants={cardVariants}
          >
            <motion.h2 
              className="font-serif text-[clamp(1.5rem,3.5vw,2.75rem)] text-foreground mb-6 leading-none tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
            >
              {content.title}
            </motion.h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Story text with typing effect */}
            <motion.div 
              className="space-y-6"
              variants={cardVariants}
            >
              <motion.p 
                className="text-xl sm:text-2xl font-work text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                {content.personalStory}
              </motion.p>
              
              {/* Alzheimer's Association Logo with hover effect */}
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.a 
                  href="https://www.alz.org/?form=FUNDHYMMBXU" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 w-fit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.img 
                    src="/lovable-uploads/da7c745c-758a-4054-a38a-03a05da9fb7b.png" 
                    alt="Alzheimer's Association" 
                    className="h-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="text-sm font-work text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    Supporting Alzheimer's awareness
                  </span>
                </motion.a>
              </motion.div>
            </motion.div>
            
            {/* Right side - Mission card with Netflix-style hover */}
            <motion.div 
              className="lg:pl-8"
              variants={heroCardVariants}
            >
              <motion.div
                className="group cursor-pointer"
                whileHover={{ scale: 1.03, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1000
                }}
              >
                <Card className="relative overflow-hidden bg-card/90 backdrop-blur-md border-2 border-accent/20 shadow-2xl group-hover:shadow-3xl group-hover:border-accent/40 transition-all duration-500">
                  {/* Netflix-style gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Floating light effect */}
                  <motion.div
                    className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-60"
                    transition={{ duration: 0.7, ease: "easeOut" as const }}
                  />
                  
                  <CardContent className="relative p-8 z-10">
                    <motion.div 
                      className="flex items-center gap-4 mb-6"
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart className="w-8 h-8 text-accent group-hover:text-accent/80 transition-colors duration-300" />
                      </motion.div>
                      <motion.h3 
                        className="font-serif text-[clamp(1.125rem,2.5vw,1.5rem)] text-foreground leading-tight group-hover:text-primary transition-colors duration-300"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                      >
                        {content.mission.title}
                      </motion.h3>
                    </motion.div>
                    <motion.p 
                      className="text-lg font-work text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 1 }}
                    >
                      {content.mission.description}
                    </motion.p>
                  </CardContent>
                  
                  {/* Subtle shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full"
                    transition={{ duration: 0.8, ease: "easeInOut" as const }}
                  />
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Values Grid with staggered Netflix-style animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {content.values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 3,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94] as const
                }}
                style={{
                  transformStyle: "preserve-3d"
                }}
                className="group cursor-pointer"
              >
                <Card className="relative overflow-hidden h-full bg-card/80 backdrop-blur-md border-2 border-border hover:border-accent/40 shadow-xl hover:shadow-3xl transition-all duration-500">
                  {/* Netflix-style background animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Floating orb effect */}
                  <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-50"
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                  
                  <CardContent className="relative p-8 text-center space-y-6 z-10">
                    <motion.div 
                      className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-all duration-300"
                      whileHover={{ 
                        scale: 1.15, 
                        rotate: [0, -5, 5, 0],
                        backgroundColor: "hsl(var(--accent) / 0.25)"
                      }}
                      transition={{ 
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.6 },
                        backgroundColor: { duration: 0.3 }
                      }}
                    >
                      <IconComponent className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    
                    <motion.h4 
                      className="text-xl font-zilla font-medium text-foreground group-hover:text-primary transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {value.title}
                    </motion.h4>
                    
                    <motion.p 
                      className="font-work text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                    >
                      {value.description}
                    </motion.p>
                  </CardContent>
                  
                  {/* Shimmer effect like Apple TV */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full"
                    transition={{ duration: 0.8, ease: "easeInOut" as const }}
                  />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced CTA Section with Apple TV-style depth */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.02,
              rotateX: 2,
              z: 30
            }}
            transition={{ duration: 0.4 }}
            style={{
              transformStyle: "preserve-3d"
            }}
            className="group inline-block"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/30 shadow-2xl group-hover:shadow-3xl group-hover:border-primary/50 transition-all duration-500">
              {/* Enhanced background effects */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.6 }}
              />
              
              {/* Multiple floating orbs for depth */}
              <motion.div
                className="absolute -top-16 -left-16 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-40"
                transition={{ duration: 0.7 }}
              />
              <motion.div
                className="absolute -bottom-16 -right-16 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-50"
                transition={{ duration: 0.8, delay: 0.1 }}
              />
              
              <CardContent className="relative p-8 sm:p-12 z-10">
                <motion.div 
                  className="flex items-center justify-center gap-4 mb-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className="w-8 h-8 text-accent" />
                  </motion.div>
                  <span className="font-work text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    Made with ❤️ for families
                  </span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    onClick={onGetStarted}
                    className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-16 min-w-[200px] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-work group/btn"
                  >
                    {/* Button shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full"
                      transition={{ duration: 0.6, ease: "easeInOut" as const }}
                    />
                    
                    <span className="relative z-10 flex items-center">
                      {content.cta}
                      <motion.div
                        className="ml-3"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};