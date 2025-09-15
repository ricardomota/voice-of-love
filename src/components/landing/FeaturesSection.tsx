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
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden">
      
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.03),transparent_70%)]" />
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0]
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            {content.badge}
          </div>
          
          <h2 className="font-inter text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-[-0.02em]">
            {content.title}
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-8 lg:p-10 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-500 hover:bg-card/80 h-full">
                  
                  {/* Icon with gradient */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6`}>
                    <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-foreground" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    
                    {/* Benefits */}
                    <div className="space-y-3 pt-4">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <motion.div
                          key={benefitIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: (index * 0.1) + (benefitIndex * 0.1) }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground font-medium">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <span className="text-lg font-medium text-foreground">Built with families in mind</span>
            <span className="text-2xl">❤️</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};