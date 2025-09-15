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
        image: "/lovable-uploads/3ab04a59-1bef-4ff6-9946-c15f52a79a26.png?v=2"
      }, {
        title: "Personalized voices",
        description: "Base voices for all users, personalized voice models for paid users when capacity allows - magic at work! ✨",
        icon: Microphone,
        highlight: "🚀 Powered by ElevenLabs",
        image: "/lovable-uploads/2973a344-d482-4b1e-b436-caa0d08347c5.png?v=3"
      }, {
        title: "Smart conversations",
        description: "Advanced AI that understands family context and adapts to each loved one's style for more natural and engaging conversations! 🧠",
        icon: Flash,
        highlight: "✨ More human conversations",
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
        title: "Vozes personalizadas",
        description: "Vozes base para todos os usuários, modelos de voz personalizados para usuários pagos quando a capacidade permite - magia em funcionamento! ✨",
        icon: Microphone,
        highlight: "🚀 Powered by ElevenLabs",
        image: "/lovable-uploads/2973a344-d482-4b1e-b436-caa0d08347c5.png?v=3"
      }, {
        title: "Conversas inteligentes",
        description: "IA avançada que entende o contexto familiar e se adapta ao estilo de cada pessoa querida para conversas mais naturais e envolventes! 🧠",
        icon: Flash,
        highlight: "✨ Conversas mais humanas",
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
        title: "Voces personalizadas",
        description: "Voces base para todos los usuarios, modelos de voz personalizados para usuarios de pago cuando la capacidad lo permita - ¡magia en funcionamiento! ✨",
        icon: Microphone,
        highlight: "🚀 Powered by ElevenLabs",
        image: "/lovable-uploads/2973a344-d482-4b1e-b436-caa0d08347c5.png?v=3"
      }, {
        title: "Conversaciones inteligentes",
        description: "IA avanzada que entiende el contexto familiar y se adapta al estilo de cada ser querido para conversaciones más naturales y atractivas! 🧠",
        icon: Flash,
        highlight: "✨ Conversaciones más humanas",
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
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export const FeaturesSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section id="features" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-background/98 to-muted/10 relative overflow-hidden">
      
      {/* Minimalist Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] [background-size:64px_64px]" />
      </div>
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 lg:mb-24"
        >
          <h2 className="font-inter text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 sm:mb-6 leading-tight tracking-[-0.02em] text-center font-bold">
            {content.title}
          </h2>
        </motion.div>

        {/* Large Modern Features Grid */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20"
        >
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants} 
                className="group"
              >
                <Card className="relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 bg-card/80 backdrop-blur-sm h-full border border-border/50 hover:border-primary/20 rounded-2xl">
                  
                  <CardContent className="p-0 h-full">
                    {/* Large Feature Image */}
                    <div className="relative h-80 sm:h-96 lg:h-[28rem] overflow-hidden rounded-t-2xl">
                      <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      
                      {/* Modern Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                      
                      {/* Modern Icon */}
                      <div className="absolute top-8 right-8">
                        <div className="w-16 h-16 bg-background/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-border/20">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Modern Content */}
                    <div className="p-8 sm:p-10 lg:p-12 space-y-6">
                      <h3 className="font-inter text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors duration-300 leading-tight font-semibold">
                        {feature.title}
                      </h3>
                      
                      <p className="font-inter text-muted-foreground leading-relaxed text-base sm:text-lg line-clamp-3">
                        {feature.description}
                      </p>
                      
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-primary/5 border border-primary/10 text-primary transition-all duration-300 hover:bg-primary/10 max-w-fit">
                        {feature.highlight}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Modern Bottom Element */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 lg:mt-24 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary/5 border border-primary/10 text-primary font-medium text-lg">
            Designed with families in mind ❤️
          </div>
        </motion.div>

      </div>
    </section>
  );
};