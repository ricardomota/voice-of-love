import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png"
      }, {
        title: "Hybrid voices",
        description: "Base voices for all users, personal voice cloning for paid users when capacity allows - magic at work! ✨",
        icon: Microphone,
        highlight: "🚀 ElevenLabs powered",
        image: "/lovable-uploads/28e5692e-d7de-4041-a643-3d8bcc19f107.png"
      }, {
        title: "Cost-smart AI",
        description: "Together.ai (OSS-20B) for free users, OpenAI GPT-5o for premium conversations - the best of both worlds! 💫",
        icon: Flash,
        highlight: "👨‍👩‍👧‍👦 Optimized for families",
        image: "/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png"
      }, {
        title: "Multilingual",
        description: "Available in English, Portuguese (Brazil), and Spanish to serve global families everywhere! 🗣️",
        icon: Globe,
        highlight: "🌎 EN, PT-BR, ES",
        image: "/lovable-uploads/0d1a58a9-f5b7-441f-a99a-ee72d330aa78.png"
      }]
    },
    'pt-BR': {
      title: "Funcionalidades pensadas com carinho",
      features: [{
        title: "Privado por padrão",
        description: "Armazenamento seguro e privado que mantém as vozes e memórias da sua família protegidas e seguras! 🛡️",
        icon: Security,
        highlight: "Criptografado ponta a ponta",
        image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png"
      }, {
        title: "Vozes personalizadas",
        description: "Vozes base para todos os usuários, clone de voz pessoal para usuários pagos quando a capacidade permite - magia em funcionamento! ✨",
        icon: Microphone,
        highlight: "🚀 Powered by ElevenLabs",
        image: "/lovable-uploads/53170fb1-7796-436e-b100-99bb359fcd92.png"
      }, {
        title: "Conversas inteligentes",
        description: "IA avançada que entende o contexto familiar e se adapta ao estilo de cada pessoa querida para conversas mais naturais e envolventes! 🧠",
        icon: Flash,
        highlight: "✨ Conversas mais humanas",
        image: "/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png"
      }, {
        title: "Multilíngue",
        description: "Disponível em inglês, português (Brasil) e espanhol para servir famílias globais em todos os lugares! 🗣️",
        icon: Globe,
        highlight: "🌎 EN, PT-BR, ES",
        image: "/lovable-uploads/0d1a58a9-f5b7-441f-a99a-ee72d330aa78.png"
      }]
    },
    es: {
      title: "Características diseñadas con cuidado",
      features: [{
        title: "Privado por defecto",
        description: "Almacenamiento seguro y privado que mantiene las voces y memorias de tu familia protegidas y seguras! 🛡️",
        icon: Security,
        highlight: "Cifrado extremo a extremo",
        image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png"
      }, {
        title: "Voces híbridas",
        description: "Voces base para todos los usuarios, clonación personal para usuarios de pago cuando la capacidad lo permita - ¡magia en funcionamiento! ✨",
        icon: Microphone,
        highlight: "🚀 Powered by ElevenLabs",
        image: "/lovable-uploads/28e5692e-d7de-4041-a643-3d8bcc19f107.png"
      }, {
        title: "IA económica",
        description: "Together.ai (OSS-20B) para usuarios gratuitos, OpenAI GPT-5o para conversaciones premium - ¡lo mejor de ambos mundos! 💫",
        icon: Flash,
        highlight: "👨‍👩‍👧‍👦 Optimizado para familias",
        image: "/lovable-uploads/4a3edab3-4083-4a1c-a748-c8c1d4626206.png"
      }, {
        title: "Multilingüe",
        description: "Disponible en inglés, portugués (Brasil) y español para servir familias globales en todas partes! 🗣️",
        icon: Globe,
        highlight: "🌎 EN, PT-BR, ES",
        image: "/lovable-uploads/0d1a58a9-f5b7-441f-a99a-ee72d330aa78.png"
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
  return <section id="features" className="py-24 sm:py-28 lg:py-32 pb-16 sm:pb-20 lg:pb-24 bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
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
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        
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
      }} className="text-center max-w-5xl mx-auto mb-20 lg:mb-24">
          <motion.h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-12 lg:mb-16 tracking-tight" initial={{
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
      }} className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 xl:gap-28">
          {content.features.map((feature, index) => {
          const IconComponent = feature.icon;
          return <motion.div key={index} variants={itemVariants} className="group">
                <Card className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-card to-card/90 h-full border-2 hover:border-primary/30 rounded-3xl">
                  {/* Simple background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-0 h-full">
                    <div className="relative h-96 sm:h-104 lg:h-88 xl:h-96 overflow-hidden rounded-t-3xl">
                      {/* Simple Feature Image */}
                      <div className="relative w-full h-full">
                        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        
                        {/* Enhanced overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
                      </div>
                      
                      {/* Simple icon overlay */}
                      <div className="absolute top-8 right-8">
                        <div className="w-16 h-16 bg-card/95 backdrop-blur-lg rounded-3xl flex items-center justify-center transition-all duration-300 shadow-2xl border-2 border-primary/20">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      
                      
                    </div>

                    {/* Simple Content */}
                    <div className="p-10 lg:p-12 pb-10 lg:pb-12 space-y-10">
                      <h3 className="text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed text-xl">
                        {feature.description}
                      </p>
                      
                      <div className={`inline-flex items-center gap-4 px-6 py-4 rounded-3xl text-base font-semibold backdrop-blur-lg transition-all duration-300 cursor-pointer hover:scale-105 ${index === 0 ? "bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 border-2 border-violet-400/40 text-violet-800 dark:text-violet-200" : index === 1 ? "bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 border-2 border-blue-400/40 text-blue-800 dark:text-blue-200" : index === 2 ? "bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-lime-500/20 border-2 border-emerald-400/40 text-emerald-800 dark:text-emerald-200" : "bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 border-2 border-orange-400/40 text-orange-800 dark:text-orange-200"}`}>
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
      }} className="mt-20 lg:mt-24 text-center">
          <div className="inline-flex items-center gap-6 px-12 py-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
            <span className="text-primary font-semibold text-xl">Designed with families in mind</span>
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </motion.div>

      </div>
    </section>;
};