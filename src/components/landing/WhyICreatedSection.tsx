import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

const getContent = (language: string) => {
  const content = {
    en: {
      title: "Why I Created Eterna",
      subtitle: "A Personal Journey",
      story: [
        "When my grandmother passed away, I realized that while we preserve photos and videos, we lose something irreplaceable—their voice, their wisdom, their unique way of seeing the world.",
        "I spent countless nights wondering: What if technology could help us preserve not just memories, but the essence of who someone is? What if we could have one more conversation?",
        "Eterna was born from this deeply personal need—to create a bridge between memory and presence, allowing love to transcend time itself."
      ],
      conclusion: "Every conversation on Eterna is a testament to the enduring power of human connection.",
      founder: "— Riley Chen, Founder"
    },
    'pt-BR': {
      title: "Por Que Criei a Eterna",
      subtitle: "Uma Jornada Pessoal",
      story: [
        "Quando minha avó faleceu, percebi que embora preservemos fotos e vídeos, perdemos algo insubstituível—sua voz, sua sabedoria, seu jeito único de ver o mundo.",
        "Passei inúmeras noites me perguntando: E se a tecnologia pudesse nos ajudar a preservar não apenas memórias, mas a essência de quem alguém é? E se pudéssemos ter mais uma conversa?",
        "A Eterna nasceu dessa necessidade profundamente pessoal—criar uma ponte entre memória e presença, permitindo que o amor transcenda o próprio tempo."
      ],
      conclusion: "Cada conversa na Eterna é um testemunho do poder duradouro da conexão humana.",
      founder: "— Riley Chen, Fundadora"
    },
    es: {
      title: "Por Qué Creé Eterna",
      subtitle: "Un Viaje Personal",
      story: [
        "Cuando mi abuela falleció, me di cuenta de que aunque preservamos fotos y videos, perdemos algo irreemplazable: su voz, su sabiduría, su forma única de ver el mundo.",
        "Pasé incontables noches preguntándome: ¿Y si la tecnología pudiera ayudarnos a preservar no solo recuerdos, sino la esencia de quien es alguien? ¿Y si pudiéramos tener una conversación más?",
        "Eterna nació de esta necesidad profundamente personal: crear un puente entre la memoria y la presencia, permitiendo que el amor trascienda el tiempo mismo."
      ],
      conclusion: "Cada conversación en Eterna es un testimonio del poder duradero de la conexión humana.",
      founder: "— Riley Chen, Fundadora"
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const WhyICreatedSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Netflix/Apple TV style dark background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
      
      {/* Ambient lighting effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-30" />
      
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="inline-block px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/80 text-sm font-medium tracking-wide uppercase">
              {content.subtitle}
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[0.9] tracking-tight mb-8"
          >
            {content.title}
          </motion.h2>
        </motion.div>

        {/* Story content */}
        <div className="max-w-4xl mx-auto">
          {content.story.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + (index * 0.2) }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed mb-12 font-light tracking-wide"
            >
              {paragraph}
            </motion.p>
          ))}

          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <p className="text-2xl md:text-3xl text-white/95 leading-relaxed mb-8 font-medium italic">
              "{content.conclusion}"
            </p>
            <p className="text-lg text-white/70 font-light tracking-wider">
              {content.founder}
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-1/4 left-10 w-2 h-32 bg-gradient-to-b from-primary/30 to-transparent rounded-full"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          viewport={{ once: true }}
          className="absolute bottom-1/4 right-10 w-2 h-24 bg-gradient-to-t from-accent/30 to-transparent rounded-full"
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 8}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </section>
  );
};