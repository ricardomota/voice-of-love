import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Mic, Brain, Globe, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const getContent = (language: string) => {
  const content = {
    en: {
      badge: "Why families choose us",
      title: "Built for what matters most",
      subtitle: "Every feature designed with love, security, and your family's unique story in mind.",
      features: [
        {
          title: "Privacy First",
          description: "Your family's memories stay yours. End-to-end encryption ensures your most precious moments remain private and secure.",
          icon: Shield,
          gradient: "from-blue-500 to-cyan-500",
          benefits: ["Military-grade encryption", "Zero data sharing", "GDPR compliant"]
        },
        {
          title: "Authentic Voices",
          description: "Advanced AI captures the unique essence of how your loved ones speak, creating truly personal voice experiences.",
          icon: Mic,
          gradient: "from-purple-500 to-pink-500", 
          benefits: ["Natural speech patterns", "Emotional nuance", "Multiple languages"]
        },
        {
          title: "Smart Memory",
          description: "Our AI understands context, relationships, and personal history to create meaningful, authentic conversations.",
          icon: Brain,
          gradient: "from-orange-500 to-red-500",
          benefits: ["Context awareness", "Emotional intelligence", "Adaptive responses"]
        },
        {
          title: "Global Reach",
          description: "Supporting families worldwide with multilingual capabilities and cultural understanding built-in.",
          icon: Globe,
          gradient: "from-green-500 to-teal-500",
          benefits: ["15+ languages", "Cultural context", "Local support"]
        }
      ]
    },
    'pt-BR': {
      badge: "Por que as famílias nos escolhem", 
      title: "Construído para o que mais importa",
      subtitle: "Cada funcionalidade pensada com amor, segurança e a história única da sua família em mente.",
      features: [
        {
          title: "Privacidade em Primeiro",
          description: "As memórias da sua família permanecem suas. Criptografia ponta a ponta garante que seus momentos mais preciosos se mantêm privados e seguros.",
          icon: Shield,
          gradient: "from-blue-500 to-cyan-500",
          benefits: ["Criptografia militar", "Zero compartilhamento", "Conformidade LGPD"]
        },
        {
          title: "Vozes Autênticas", 
          description: "IA avançada captura a essência única de como seus entes queridos falam, criando experiências de voz verdadeiramente pessoais.",
          icon: Mic,
          gradient: "from-purple-500 to-pink-500",
          benefits: ["Padrões naturais de fala", "Nuance emocional", "Múltiplos idiomas"]
        },
        {
          title: "Memória Inteligente",
          description: "Nossa IA entende contexto, relacionamentos e história pessoal para criar conversas significativas e autênticas.",
          icon: Brain,
          gradient: "from-orange-500 to-red-500", 
          benefits: ["Consciência contextual", "Inteligência emocional", "Respostas adaptativas"]
        },
        {
          title: "Alcance Global",
          description: "Apoiando famílias em todo o mundo com capacidades multilíngues e compreensão cultural integrada.",
          icon: Globe,
          gradient: "from-green-500 to-teal-500",
          benefits: ["15+ idiomas", "Contexto cultural", "Suporte local"]
        }
      ]
    },
    es: {
      badge: "Por qué las familias nos eligen",
      title: "Construido para lo que más importa", 
      subtitle: "Cada característica diseñada con amor, seguridad y la historia única de tu familia en mente.",
      features: [
        {
          title: "Privacidad Primero",
          description: "Los recuerdos de tu familia siguen siendo tuyos. El cifrado extremo a extremo asegura que tus momentos más preciosos permanezcan privados y seguros.",
          icon: Shield,
          gradient: "from-blue-500 to-cyan-500",
          benefits: ["Cifrado de grado militar", "Cero intercambio de datos", "Conforme a GDPR"]
        },
        {
          title: "Voces Auténticas",
          description: "IA avanzada captura la esencia única de cómo hablan tus seres queridos, creando experiencias de voz verdaderamente personales.",
          icon: Mic,
          gradient: "from-purple-500 to-pink-500",
          benefits: ["Patrones naturales de habla", "Matiz emocional", "Múltiples idiomas"]
        },
        {
          title: "Memoria Inteligente", 
          description: "Nuestra IA entiende contexto, relaciones e historia personal para crear conversaciones significativas y auténticas.",
          icon: Brain,
          gradient: "from-orange-500 to-red-500",
          benefits: ["Conciencia contextual", "Inteligencia emocional", "Respuestas adaptativas"]
        },
        {
          title: "Alcance Global",
          description: "Apoyando familias en todo el mundo con capacidades multilingües y comprensión cultural integrada.",
          icon: Globe, 
          gradient: "from-green-500 to-teal-500",
          benefits: ["15+ idiomas", "Contexto cultural", "Soporte local"]
        }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const FeaturesSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section id="features" className="py-32 relative">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
      
      <div className="max-w-6xl mx-auto px-6 relative">
        
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-24"
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

        {/* Features grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-8 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm hover:border-border/50 hover:bg-card/50 transition-all duration-500 h-full">
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Benefits list */}
                    <div className="space-y-2 pt-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <motion.div
                          key={benefitIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: (index * 0.1) + (benefitIndex * 0.05) }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
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
          className="text-center mt-20"
        >
          <p className="text-muted-foreground">Designed for families who care about privacy, authenticity, and meaningful connections.</p>
        </motion.div>

      </div>
    </section>
  );
};