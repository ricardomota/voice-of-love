import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Security, Microphone, Flash, Globe } from '@carbon/icons-react';
import { motion } from 'framer-motion';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Thoughtfully designed features",
      features: [
        {
          title: "🔒 Private by default",
          description: "Secure, private storage that keeps your family's voices and memories safe and sound! 🛡️",
          icon: Security,
          highlight: "🔐 End-to-end encrypted",
          image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png"
        },
        {
          title: "🎭 Hybrid voices", 
          description: "Base voices for all users, personal voice cloning for paid users when capacity allows - magic at work! ✨",
          icon: Microphone,
          highlight: "🚀 ElevenLabs powered",
          image: "/lovable-uploads/28e5692e-d7de-4041-a643-3d8bcc19f107.png"
        },
        {
          title: "🧠 Cost-smart AI",
          description: "Together.ai (OSS-20B) for free users, OpenAI GPT-5o for premium conversations - the best of both worlds! 💫",
          icon: Flash,
          highlight: "👨‍👩‍👧‍👦 Optimized for families",
          image: "/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png"
        },
        {
          title: "🌍 Multilingual",
          description: "Available in English, Portuguese (Brazil), and Spanish to serve global families everywhere! 🗣️",
          icon: Globe,
          highlight: "🌎 EN, PT-BR, ES",
          image: "/lovable-uploads/0d1a58a9-f5b7-441f-a99a-ee72d330aa78.png"
        }
      ]
    },
    'pt-BR': {
      title: "Funcionalidades pensadas com carinho",
      features: [
        {
          title: "🔒 Privado por padrão",
          description: "Armazenamento seguro e privado que mantém as vozes e memórias da sua família protegidas e seguras! 🛡️",
          icon: Security,
          highlight: "🔐 Criptografado ponta a ponta",
          image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png"
        },
        {
          title: "🎭 Vozes híbridas",
          description: "Vozes base para todos os usuários, clone de voz pessoal para usuários pagos quando a capacidade permite - magia em funcionamento! ✨",
          icon: Microphone,
          highlight: "🚀 Powered by ElevenLabs",
          image: "/lovable-uploads/28e5692e-d7de-4041-a643-3d8bcc19f107.png"
        },
        {
          title: "🧠 IA econômica",
          description: "Together.ai (OSS-20B) para usuários gratuitos, OpenAI GPT-5o para conversas premium - o melhor dos dois mundos! 💫",
          icon: Flash,
          highlight: "👨‍👩‍👧‍👦 Otimizado para famílias",
          image: "/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png"
        },
        {
          title: "🌍 Multilíngue",
          description: "Disponível em inglês, português (Brasil) e espanhol para servir famílias globais em todos os lugares! 🗣️",
          icon: Globe,
          highlight: "🌎 EN, PT-BR, ES",
          image: "/lovable-uploads/0d1a58a9-f5b7-441f-a99a-ee72d330aa78.png"
        }
      ]
    },
    es: {
      title: "Características diseñadas con cuidado",
      features: [
        {
          title: "Privado por defecto",
          description: "Almacenamiento seguro y privado que mantiene las voces y memorias de tu familia protegidas y seguras! 🛡️",
          icon: Security,
          highlight: "🔐 Cifrado extremo a extremo",
          image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png"
        },
        {
          title: "Voces híbridas",
          description: "Voces base para todos los usuarios, clonación personal para usuarios de pago cuando la capacidad lo permita - ¡magia en funcionamiento! ✨",
          icon: Microphone,
          highlight: "🚀 Powered by ElevenLabs",
          image: "/lovable-uploads/28e5692e-d7de-4041-a643-3d8bcc19f107.png"
        },
        {
          title: "IA económica",
          description: "Together.ai (OSS-20B) para usuarios gratuitos, OpenAI GPT-5o para conversaciones premium - ¡lo mejor de ambos mundos! 💫",
          icon: Flash,
          highlight: "👨‍👩‍👧‍👦 Optimizado para familias",
          image: "/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png"
        },
        {
          title: "Multilingüe", 
          description: "Disponible en inglés, portugués (Brasil) y español para servir familias globales en todas partes! 🗣️",
          icon: Globe,
          highlight: "🌎 EN, PT-BR, ES",
          image: "/lovable-uploads/0d1a58a9-f5b7-441f-a99a-ee72d330aa78.png"
        }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
};

export const FeaturesSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section id="features" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            {content.title}
          </h2>
        </motion.div>

        {/* Interactive Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Card className="relative overflow-hidden border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-card to-card/80 h-full">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-48 overflow-hidden">
                      {/* Feature Image */}
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Icon overlay */}
                      <div className="absolute top-4 right-4">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-4">
                      <h3 className="text-xl lg:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                        {feature.highlight}
                      </div>
                    </div>

                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom visual element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-medium">Designed with families in mind</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};