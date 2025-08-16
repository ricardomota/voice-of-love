import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Group, PlayFilled, Security } from '@carbon/icons-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
interface HeroSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onLogin: () => void;
}
const getContent = (language: string) => {
  const content = {
    en: {
      headline: "Where memories become eternal. ✨",
      subhead: "Preserve the essence of your loved ones through AI that captures their personality, stories, and wisdom forever.",
      tryFree: "Try Eterna Free",
      seePricing: "See Pricing",
      altText: "Family sharing warm moments together"
    },
    'pt-BR': {
      headline: "Onde lembranças se tornam eternas✨",
      subhead: "Preserve a essência dos seus entes queridos através de IA que captura sua personalidade, histórias e sabedoria para sempre.",
      tryFree: "Testar Grátis",
      seePricing: "Ver Preços",
      altText: "Família compartilhando momentos especiais"
    },
    es: {
      headline: "Donde los recuerdos se vuelven eternos. ✨",
      subhead: "Preserva la esencia de tus seres queridos a través de IA que captura su personalidad, historias y sabiduría para siempre.",
      tryFree: "Probar Gratis",
      seePricing: "Ver Precios",
      altText: "Familia compartiendo momentos especiales"
    }
  };
  return content[language as keyof typeof content] || content.en;
};
export const HeroSection: React.FC<HeroSectionProps> = ({
  onTryFree,
  onSeePricing,
  onLogin
}) => {
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const {
          count,
          error
        } = await supabase.from('user_settings').select('*', {
          count: 'exact',
          head: true
        });
        if (error) {
          console.error('Error getting user count:', error);
          setUserCount(0);
        } else {
          setUserCount(count || 0);
        }
      } catch (error) {
        console.error('Error in checkUserCount:', error);
        setUserCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserCount();
  }, []);
  const isWaitlistMode = userCount >= 10;
  return <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        
        {/* Animated Background Elements */}
        <motion.div className="absolute top-20 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.4, 0.2, 0.4]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:50px_50px]" />
        </div>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Enhanced Content */}
          <motion.div className="text-center lg:text-left space-y-10 lg:space-y-12 order-2 lg:order-1" initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }}>
            <div className="space-y-8">
              <motion.h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.05] tracking-tight" initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }}>
                {content.headline.split(' ').map((word, wordIndex, array) => <motion.span key={wordIndex} className="inline-block" initial={{
                opacity: 0,
                y: 50,
                rotateX: 90
              }} animate={{
                opacity: 1,
                y: 0,
                rotateX: 0
              }} transition={{
                duration: 0.8,
                delay: 0.3 + wordIndex * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94]
              }} whileHover={{
                scale: 1.05,
                textShadow: "0 0 8px rgba(255,255,255,0.5)",
                transition: {
                  duration: 0.3
                }
              }}>
                    {word}
                    {wordIndex === 2 && <br className="hidden sm:block" />}
                    {wordIndex < array.length - 1 && ' '}
                    {word === '✨' && <motion.span animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: wordIndex * 0.1
                }} className="inline-block">
                        ✨
                      </motion.span>}
                  </motion.span>)}
              </motion.h1>
              <motion.p className="text-xl sm:text-2xl lg:text-2xl text-primary-foreground/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light" initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.4
            }}>
                {content.subhead}
              </motion.p>
            </div>

            {/* Enhanced CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.6
          }}>
              {!isLoading && <>
                  <motion.div className="group relative" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.98
              }} onHoverStart={() => {}}>
                    <Button onClick={isWaitlistMode ? onTryFree : onLogin} size="xl" variant="secondary" className="w-full sm:w-auto min-w-[260px] h-16 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden bg-gradient-to-r from-secondary via-secondary/90 to-secondary hover:from-secondary/90 hover:via-secondary/80 hover:to-secondary/70">
                      <motion.div className="flex items-center relative z-10">
                        <PlayFilled size={20} className="mr-3" />
                        <motion.span initial={{
                      opacity: 0,
                      x: -10
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      delay: 0.8
                    }}>
                          {isWaitlistMode ? 'Entrar na Waitlist' : 'Começar Agora'}
                        </motion.span>
                      </motion.div>
                      {/* Magnetic ripple effect */}
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0" whileHover={{
                    opacity: 1,
                    scale: 1.1
                  }} transition={{
                    duration: 0.4
                  }} />
                    </Button>
                  </motion.div>
                  
                  <motion.div className="group relative" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.98
              }}>
                    <Button onClick={onSeePricing} variant="outline" size="xl" className="w-full sm:w-auto min-w-[220px] h-16 text-lg font-semibold bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-500 relative overflow-hidden group">
                      <motion.span className="relative z-10" initial={{
                    opacity: 0,
                    x: 10
                  }} animate={{
                    opacity: 1,
                    x: 0
                  }} transition={{
                    delay: 0.9
                  }}>
                        {content.seePricing}
                      </motion.span>
                      {/* Hover background sweep */}
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/20 to-primary-foreground/10 -translate-x-full" whileHover={{
                    x: 0
                  }} transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }} />
                    </Button>
                  </motion.div>
                </>}
            </motion.div>

            {/* Enhanced Trust indicators */}
            <motion.div className="pt-8" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.8
          }}>
              <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-8 xs:gap-12 text-base text-primary-foreground/75">
                <motion.div className="flex items-center gap-3" whileHover={{
                scale: 1.05
              }}>
                  <div className="p-2 bg-secondary/20 rounded-xl backdrop-blur-sm">
                    <Security size={20} className="text-secondary flex-shrink-0" />
                  </div>
                  <span className="font-medium">Private by default</span>
                </motion.div>
                <motion.div className="flex items-center gap-3" whileHover={{
                scale: 1.05
              }}>
                  <div className="p-2 bg-secondary/20 rounded-xl backdrop-blur-sm">
                    <Group size={20} className="text-secondary flex-shrink-0" />
                  </div>
                  <span className="font-medium">Family-first design</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Hero Image */}
          <motion.div className="relative order-1 lg:order-2" initial={{
          opacity: 0,
          scale: 0.9,
          y: 30
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} transition={{
          duration: 1,
          delay: 0.4,
          ease: "easeOut"
        }}>
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary/30 via-accent/20 to-secondary/30 rounded-3xl blur-2xl opacity-75" />
              
              <div className="relative rounded-3xl lg:rounded-4xl overflow-hidden shadow-2xl aspect-[16/10] sm:aspect-[4/3] bg-gradient-to-br from-primary-foreground/10 to-transparent backdrop-blur-sm border border-primary-foreground/20">
                <motion.img src="/lovable-uploads/fbc775df-e88c-44eb-b8e5-b8ada1ea8b9d.png" alt={content.altText} className="w-full h-full object-cover object-center" loading="eager" whileHover={{
                scale: 1.05
              }} transition={{
                duration: 0.6
              }} />
                
                {/* Enhanced overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Elements */}
                
                
                
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>;
};