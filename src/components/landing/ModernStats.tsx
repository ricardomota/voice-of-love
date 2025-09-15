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
    <section className="py-24 relative">
      
      <div className="max-w-4xl mx-auto px-6 relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            {content.title}
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {content.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground max-w-lg mx-auto">
            Join thousands of families who trust us to preserve their most precious memories
          </p>
        </motion.div>
      </div>
    </section>
  );
};