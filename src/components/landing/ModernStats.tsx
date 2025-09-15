import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Heart, Users, MessageCircle, Globe } from 'lucide-react';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Built with love for families",
      features: [
        { label: "Multi-language support", icon: Globe },
        { label: "Voice preservation", icon: MessageCircle },
        { label: "Secure & private", icon: Heart }
      ]
    },
    'pt-BR': {
      title: "Feito com amor para famílias",
      features: [
        { label: "Suporte a múltiplos idiomas", icon: Globe },
        { label: "Preservação de voz", icon: MessageCircle },
        { label: "Seguro e privado", icon: Heart }
      ]
    },
    es: {
      title: "Hecho con amor para familias", 
      features: [
        { label: "Soporte multiidioma", icon: Globe },
        { label: "Preservación de voz", icon: MessageCircle },
        { label: "Seguro y privado", icon: Heart }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const ModernStats: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-6 relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-xl font-medium text-muted-foreground mb-8">
            {content.title}
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center gap-3">
                  <IconComponent className="w-5 h-5 text-muted-foreground/70" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {feature.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};