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
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-muted/20 to-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <Card className="relative bg-gradient-to-r from-amber-50/95 via-orange-50/90 to-rose-50/85 backdrop-blur-md border border-amber-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                
                {/* Icon and Title */}
                <div className="flex items-center gap-4 sm:flex-col sm:text-center sm:gap-3 flex-shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent sm:max-w-[120px] sm:leading-tight">
                    {content.title}
                  </h3>
                </div>

                {/* Story Text */}
                <div className="flex-1 space-y-3">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {content.text}
                  </p>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-xl">{content.heart}</span>
                    <span className="text-xs font-medium opacity-80">Made with love</span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};