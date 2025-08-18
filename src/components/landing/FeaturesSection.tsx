import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Security, Microphone, Flash, Globe } from '@carbon/icons-react';
import { motion } from 'framer-motion';
const getContent = (language: string) => {
  const content = {
    en: {
      title: "Thoughtfully designed features",
      features: [{
        title: "Private by default",
        description: "Secure, private storage that keeps your family's voices and memories safe and sound! 🛡️",
        icon: Security,
        highlight: "End-to-end encrypted",
        image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png?v=2"
      }, {
        title: "Hybrid voices",
        description: "Base voices for all users, personal voice cloning for paid users when capacity allows - magic at work! ✨",
        icon: Microphone,
        highlight: "🚀 Powered by ElevenLabs",
        image: "/lovable-uploads/2973a344-d482-4b1e-b436-caa0d08347c5.png?v=3"
      }, {
        title: "Cost-smart AI",
        description: "Together.ai (OSS-20B) for free users, OpenAI GPT-5o for premium conversations - the best of both worlds! 💫",
        icon: Flash,
        highlight: "👨‍👩‍👧‍👦 Optimized for families",
        image: "/lovable-uploads/a7a421f7-b128-4025-836f-a9cbdec7c230.png?v=3"
      }, {
        title: "Multilingual",
        description: "Available in English, Portuguese (Brazil), and Spanish to serve global families everywhere! 🗣️",
        icon: Globe,
        highlight: "🌎 EN, PT-BR, ES",
        image: "/lovable-uploads/91a8b058-4624-4dfd-a844-b72b970ebf11.png?v=2"
      }]
    },
    'pt-BR': {
      title: "Funcionalidades pensadas com carinho",
      features: [{
        title: "Privado por padrão",
        description: "Armazenamento seguro e privado que mantém as vozes e memórias da sua família protegidas e seguras! 🛡️",
        icon: Security,
        highlight: "Criptografado ponta a ponta",
        image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png?v=2"
      }, {
        title: "Vozes híbridas",
        description: "Vozes base para todos os usuários, clonação de voz pessoal para usuários pagos quando a capacidade permite - magia em ação! ✨",
        icon: Microphone,
        highlight: "🚀 Powered by ElevenLabs",
        image: "/lovable-uploads/2973a344-d482-4b1e-b436-caa0d08347c5.png?v=3"
      }, {
        title: "IA econômica",
        description: "Together.ai (OSS-20B) para usuários gratuitos, OpenAI GPT-5o para conversas premium - o melhor dos dois mundos! 💫",
        icon: Flash,
        highlight: "👨‍👩‍👧‍👦 Otimizado para famílias",
        image: "/lovable-uploads/a7a421f7-b128-4025-836f-a9cbdec7c230.png?v=3"
      }, {
        title: "Multilíngue",
        description: "Disponível em inglês, português (Brasil) e espanhol para servir famílias globais em todos os lugares! 🗣️",
        icon: Globe,
        highlight: "🌎 EN, PT-BR, ES",
        image: "/lovable-uploads/91a8b058-4624-4dfd-a844-b72b970ebf11.png?v=2"
      }]
    },
    es: {
      title: "Características diseñadas con cuidado",
      features: [{
        title: "Privado por defecto",
        description: "Almacenamiento seguro y privado que mantiene las voces y memorias de tu familia protegidas y seguras! 🛡️",
        icon: Security,
        highlight: "Cifrado extremo a extremo",
        image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png?v=2"
      }, {
        title: "Voces híbridas",
        description: "Voces base para todos los usuarios, clonación de voz personal para usuarios de pago cuando la capacidad lo permita - ¡magia en acción! ✨",
        icon: Microphone,
        highlight: "🚀 Powered by ElevenLabs",
        image: "/lovable-uploads/2973a344-d482-4b1e-b436-caa0d08347c5.png?v=3"
      }, {
        title: "IA económica",
        description: "Together.ai (OSS-20B) para usuarios gratuitos, OpenAI GPT-5o para conversaciones premium - ¡lo mejor de ambos mundos! 💫",
        icon: Flash,
        highlight: "👨‍👩‍👧‍👦 Optimizado para familias",
        image: "/lovable-uploads/a7a421f7-b128-4025-836f-a9cbdec7c230.png?v=3"
      }, {
        title: "Multilingüe",
        description: "Disponible en inglés, portugués (Brasil) y español para servir familias globales en todas partes! 🗣️",
        icon: Globe,
        highlight: "🌎 EN, PT-BR, ES",
        image: "/lovable-uploads/91a8b058-4624-4dfd-a844-b72b970ebf11.png?v=2"
      }]
    }
  };
  return content[language as keyof typeof content] || content.en;
};
const containerVariants = {
  hidden: {
    opacity: 0
  },
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
  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  return <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Floating Orbs */}
      <motion.div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3]
    }} transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut"
    }} />
      <motion.div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" animate={{
      scale: [1.2, 1, 1.2],
      opacity: [0.4, 0.2, 0.4]
    }} transition={{
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 3
    }} />
      
      {/* Container with consistent padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Enhanced Header */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <motion.h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 sm:mb-8 leading-tight tracking-tight" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            {content.title}
          </motion.h2>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        margin: "-100px"
      }} className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24">
          {content.features.map((feature, index) => {
          const IconComponent = feature.icon;
          return <motion.div key={index} variants={itemVariants} className="group">
                <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/90 h-full border-2 hover:border-primary/20">
                  {/* Simple background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-0 h-full">
                    <div className="relative h-64 sm:h-80 md:h-88 lg:h-80 xl:h-88 overflow-hidden">
                      {/* Feature Image with responsive sizing */}
                      <div className="relative w-full h-full">
                        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        
                        {/* Enhanced overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
                      </div>
                      
                      {/* Simple icon overlay */}
                      <div className="absolute top-6 right-6">
                        <div className="w-14 h-14 bg-card/95 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl border border-primary/10">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                      </div>
                      
                      
                    </div>

                    {/* Simple Content */}
                    <div className="p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 lg:space-y-8">
                      <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                        {feature.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                        {feature.description}
                      </p>
                      
                      <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold backdrop-blur-sm transition-all duration-300 cursor-pointer hover:scale-105 ${index === 0 ? "bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 border border-violet-400/40 text-violet-800 dark:text-violet-200" : index === 1 ? "bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 border border-blue-400/40 text-blue-800 dark:text-blue-200" : index === 2 ? "bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-lime-500/20 border border-emerald-400/40 text-emerald-800 dark:text-emerald-200" : "bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 border border-orange-400/40 text-orange-800 dark:text-orange-200"}`}>
                        {feature.highlight}
                      </div>
                    </div>

                    {/* Simple border effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </CardContent>
                </Card>
              </motion.div>;
        })}
        </motion.div>

        {/* Enhanced Bottom visual element */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="mt-16 lg:mt-20 text-center">
          <Badge variant="outline" className="px-4 py-2 text-base font-medium bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors duration-300">
            Designed with families in mind ❤️
          </Badge>
        </motion.div>

      </div>
    </section>;
};