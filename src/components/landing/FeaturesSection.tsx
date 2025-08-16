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
          title: "Private by default",
          description: "Secure, private storage that keeps your family's voices and memories safe and sound! 🛡️",
          icon: Security,
          highlight: "End-to-end encrypted",
          image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png"
        },
        {
          title: "Hybrid voices", 
          description: "Base voices for all users, personal voice cloning for paid users when capacity allows - magic at work! ✨",
          icon: Microphone,
          highlight: "🚀 ElevenLabs powered",
          image: "/lovable-uploads/28e5692e-d7de-4041-a643-3d8bcc19f107.png"
        },
        {
          title: "Cost-smart AI",
          description: "Together.ai (OSS-20B) for free users, OpenAI GPT-5o for premium conversations - the best of both worlds! 💫",
          icon: Flash,
          highlight: "👨‍👩‍👧‍👦 Optimized for families",
          image: "/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png"
        },
        {
          title: "Multilingual",
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
          title: "Privado por padrão",
          description: "Armazenamento seguro e privado que mantém as vozes e memórias da sua família protegidas e seguras! 🛡️",
          icon: Security,
          highlight: "Criptografado ponta a ponta",
          image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png"
        },
        {
          title: "Vozes personalizadas",
          description: "Vozes base para todos os usuários, clone de voz pessoal para usuários pagos quando a capacidade permite - magia em funcionamento! ✨",
          icon: Microphone,
          highlight: "🚀 Powered by ElevenLabs",
          image: "/lovable-uploads/53170fb1-7796-436e-b100-99bb359fcd92.png"
        },
        {
          title: "Conversas inteligentes",
          description: "IA avançada que entende o contexto familiar e se adapta ao estilo de cada pessoa querida para conversas mais naturais e envolventes! 🧠",
          icon: Flash,
          highlight: "✨ Conversas mais humanas",
          image: "/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png"
        },
        {
          title: "Multilíngue",
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
          highlight: "Cifrado extremo a extremo",
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
    <section id="features" className="py-32 sm:py-40 lg:py-48 bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Floating Orbs */}
      <motion.div 
        className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-20 lg:mb-28"
        >
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {content.title}
          </motion.h2>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 2,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                className="group perspective-1000"
                style={{ 
                  transformStyle: "preserve-3d",
                }}
              >
                <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-card to-card/90 h-full border-2 hover:border-primary/20 transform-gpu">
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <CardContent className="p-0 h-full">
                    <div className="relative h-80 sm:h-96 overflow-hidden">
                      {/* Enhanced Feature Image */}
                      <div className="relative w-full h-full">
                        <motion.img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        {/* Enhanced overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
                      </div>
                      
                      {/* Enhanced icon overlay with magnetic effect */}
                      <motion.div 
                        className="absolute top-6 right-6"
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: 8,
                          y: -2,
                          transition: { type: "spring", stiffness: 300, damping: 10 }
                        }}
                      >
                        <motion.div 
                          className="w-14 h-14 bg-card/95 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-xl border border-primary/10 relative overflow-hidden"
                          whileHover={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
                          }}
                        >
                          <IconComponent className="w-7 h-7 text-primary relative z-10" />
                          {/* Ripple effect */}
                          <motion.div
                            className="absolute inset-0 bg-primary/20 rounded-full scale-0"
                            whileHover={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 0.6 }}
                          />
                        </motion.div>
                      </motion.div>
                      
                      {/* Enhanced floating accent with magnetic trail */}
                      <motion.div
                        className="absolute bottom-6 left-6"
                        animate={{
                          y: [-5, 5, -5],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5,
                        }}
                        whileHover={{
                          scale: 1.2,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.div 
                          className="w-8 h-8 bg-gradient-to-br from-secondary/90 to-secondary/70 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-secondary/20 relative overflow-hidden"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                          <span className="text-sm relative z-10">✨</span>
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="p-8 pb-6 space-y-6">
                      <motion.h3 
                        className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300"
                        whileHover={{ scale: 1.02, x: 3 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {feature.description}
                      </p>
                      
                      <motion.div 
                        className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold backdrop-blur-sm transition-all duration-300 cursor-pointer relative overflow-hidden ${
                          index === 0 
                            ? "bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 border border-violet-400/40 text-violet-800 dark:text-violet-200"
                            : index === 1
                            ? "bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 border border-blue-400/40 text-blue-800 dark:text-blue-200"
                            : index === 2
                            ? "bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-lime-500/20 border border-emerald-400/40 text-emerald-800 dark:text-emerald-200"
                            : "bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 border border-orange-400/40 text-orange-800 dark:text-orange-200"
                        } hover:scale-105 group-hover:scale-105`}
                        whileHover={{ 
                          scale: 1.1,
                          y: -2,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {feature.highlight}
                        {/* Interactive background glow */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-current/10 to-current/5 opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    </div>

                    {/* Enhanced animated border gradient */}
                    <motion.div 
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Bottom visual element */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <motion.div 
            className="inline-flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-3 h-3 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-primary font-semibold text-lg">Designed with families in mind</span>
            <motion.div 
              className="w-3 h-3 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};