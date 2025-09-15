import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
const getContent = (language: string) => {
  const content = {
    en: {
      title: "Why I created Eterna",
      text: "After watching my grandmother struggle with Alzheimer's, I realized how precious our voices and stories are. Eterna was born from a simple wish: to keep the essence of our loved ones alive, allowing families to continue conversations and preserve memories that matter most.",
      heart: "💝"
    },
    'pt-BR': {
      title: "Por que criei o Eterna",
      text: "Depois de ver minha avó lutando contra o Alzheimer, percebi como nossas vozes e histórias são preciosas. O Eterna nasceu de um desejo simples: manter a essência dos nossos entes queridos viva, permitindo que as famílias continuem conversas e preservem memórias que mais importam.",
      heart: "💝"
    },
    es: {
      title: "Por qué creé Eterna",
      text: "Después de ver a mi abuela luchar contra el Alzheimer, me di cuenta de lo preciosas que son nuestras voces e historias. Eterna nació de un deseo simple: mantener viva la esencia de nuestros seres queridos, permitiendo que las familias continúen conversaciones y preserven recuerdos que más importan.",
      heart: "💝"
    }
  };
  return content[language as keyof typeof content] || content.en;
};
export const StoryCard: React.FC = () => {
  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  return <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        >
          {/* Left Side - Visual Element */}
          <div className="flex-shrink-0 lg:w-1/3">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-full flex items-center justify-center shadow-2xl shadow-primary/20">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-full blur-xl" />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  {content.title}
                </h2>
              </motion.div>
              
              <motion.p 
                className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {content.text}
              </motion.p>
            </div>

            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-2xl">{content.heart}</span>
                <span className="text-sm font-medium text-primary">Made with love</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>;
};