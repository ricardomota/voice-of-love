import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Heart, Users, MessageCircle, Globe } from 'lucide-react';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Trusted by families worldwide",
      stats: [
        { value: "50K+", label: "Families Connected", icon: Users },
        { value: "1M+", label: "Conversations", icon: MessageCircle },
        { value: "15+", label: "Languages", icon: Globe },
        { value: "99%", label: "Love Stories Preserved", icon: Heart }
      ]
    },
    'pt-BR': {
      title: "Confiado por famílias em todo o mundo",
      stats: [
        { value: "50K+", label: "Famílias Conectadas", icon: Users },
        { value: "1M+", label: "Conversas", icon: MessageCircle },
        { value: "15+", label: "Idiomas", icon: Globe },
        { value: "99%", label: "Histórias de Amor Preservadas", icon: Heart }
      ]
    },
    es: {
      title: "Confiado por familias en todo el mundo", 
      stats: [
        { value: "50K+", label: "Familias Conectadas", icon: Users },
        { value: "1M+", label: "Conversaciones", icon: MessageCircle },
        { value: "15+", label: "Idiomas", icon: Globe },
        { value: "99%", label: "Historias de Amor Preservadas", icon: Heart }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const ModernStats: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-20 lg:py-24 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.08),transparent_60%)]" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.02em]">
            {content.title}
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {content.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="space-y-2"
                >
                  <div className="text-4xl sm:text-5xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm border border-border/50">
            <p className="text-lg text-muted-foreground italic leading-relaxed">
              "Technology that brings families closer, preserving what matters most - the voices and memories of those we love."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};