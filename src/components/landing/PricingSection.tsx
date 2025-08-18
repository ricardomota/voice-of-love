import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Check, Star, Bolt } from '@mui/icons-material';
import { motion } from 'framer-motion';
interface PricingSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onUpgrade?: (planId: string) => void;
}
const getContent = (language: string) => {
  const content = {
    en: {
      title: "Simple, family-friendly pricing",
      subtitle: "Start free, upgrade when you're ready to preserve more voices and memories ✨",
      free: {
        title: "Free",
        price: "R$0",
        period: "/month",
        description: "Perfect for trying Eterna",
        features: ["5 messages per month", "1 minute voice generation", "Last 3 memories stored", "Base voices available", "All languages (EN, PT-BR, ES)"],
        cta: "Start Free",
        popular: false
      },
      paid: {
        title: "Family plan",
        price: "R$29",
        period: "/month",
        usd: "(~US$5.99)",
        description: "Everything you need to preserve family voices",
        features: ["300 messages per month", "15 minutes voice generation", "Unlimited memories stored", "Personal voice clone*", "Priority support", "All languages (EN, PT-BR, ES)", "Advanced personality settings"],
        cta: "Upgrade Now",
        popular: true
      },
      note: "*Personal voice clone available when capacity allows",
      fullPricing: "See Full Pricing Details"
    },
    'pt-BR': {
      title: "Preços simples e amigáveis",
      subtitle: "Comece grátis, faça upgrade quando estiver pronto para preservar mais vozes e memórias ✨",
      free: {
        title: "Gratuito",
        price: "R$0",
        period: "/mês",
        description: "Perfeito para experimentar o Eterna",
        features: ["5 mensagens por mês", "1 minuto de geração de voz", "Últimas 3 memórias armazenadas", "Vozes base disponíveis", "Todos os idiomas (EN, PT-BR, ES)"],
        cta: "Começar Grátis",
        popular: false
      },
      paid: {
        title: "Plano família",
        price: "R$29",
        period: "/mês",
        usd: "(~US$5.99)",
        description: "Tudo que você precisa para preservar vozes da família",
        features: ["300 mensagens por mês", "15 minutos de geração de voz", "Memórias ilimitadas armazenadas", "Clone de voz pessoal*", "Suporte prioritário", "Todos os idiomas (EN, PT-BR, ES)", "Configurações avançadas de personalidade"],
        cta: "Fazer Upgrade",
        popular: true
      },
      note: "*Clone de voz pessoal disponível quando a capacidade permite",
      fullPricing: "Ver Detalhes Completos de Preços"
    },
    es: {
      title: "Precios simples y familiares",
      subtitle: "Comienza gratis, actualiza cuando estés listo para preservar más voces y memorias",
      free: {
        title: "Gratuito",
        price: "R$0",
        period: "/mes",
        description: "Perfecto para probar Eterna",
        features: ["5 mensajes por mes", "1 minuto de generación de voz", "Últimas 3 memorias almacenadas", "Voces base disponibles", "Todos los idiomas (EN, PT-BR, ES)"],
        cta: "Comenzar Gratis",
        popular: false
      },
      paid: {
        title: "Plan familiar",
        price: "R$29",
        period: "/mes",
        usd: "(~US$5.99)",
        description: "Todo lo que necesitas para preservar voces familiares",
        features: ["300 mensajes por mes", "15 minutos de generación de voz", "Memorias ilimitadas almacenadas", "Clon de voz personal*", "Soporte prioritario", "Todos los idiomas (EN, PT-BR, ES)", "Configuraciones avanzadas de personalidad"],
        cta: "Actualizar Ahora",
        popular: true
      },
      note: "*Clon de voz personal disponible cuando la capacidad lo permite",
      fullPricing: "Ver Detalles Completos de Precios"
    }
  };
  return content[language as keyof typeof content] || content.en;
};
export const PricingSection: React.FC<PricingSectionProps> = ({
  onTryFree,
  onSeePricing,
  onUpgrade
}) => {
  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  const plans = [content.free, content.paid];
  return <section id="pricing" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <motion.div className="absolute top-0 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3]
    }} transition={{
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut"
    }} />
      <motion.div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl" animate={{
      scale: [1.2, 1, 1.2],
      opacity: [0.4, 0.2, 0.4]
    }} transition={{
      duration: 18,
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
        duration: 0.8
      }} className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <motion.h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 sm:mb-8 tracking-tight" initial={{
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
          <motion.p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed font-light" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            {content.subtitle}
          </motion.p>
        </motion.div>

        {/* Enhanced Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24 max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          {plans.map((plan, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-100px"
        }} transition={{
          duration: 0.6,
          delay: index * 0.2
        }}>
              <div className="hover:scale-105 transition-transform duration-300">
                <Card className={`relative group transition-all duration-300 h-full ${plan.popular ? 'border-2 border-primary shadow-xl scale-105 lg:scale-110 bg-gradient-to-br from-card to-primary/5' : 'border-2 hover:border-primary/30 hover:shadow-lg bg-gradient-to-br from-card to-card/80'}`}>
                  {/* Enhanced Popular Badge */}
                  {plan.popular && <motion.div className="absolute -top-6 left-1/2 transform -translate-x-1/2" initial={{
                scale: 0,
                rotate: -10
              }} animate={{
                scale: 1,
                rotate: 0
              }} transition={{
                duration: 0.5,
                delay: 0.3
              }}>
                      
                    </motion.div>}

                  <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 space-y-8 lg:space-y-10 relative">
                    
                    {/* Header with responsive text */}
                    <div className="text-center space-y-4 sm:space-y-6">
                      <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                        {plan.title}
                      </h3>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price with responsive sizing */}
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-lg sm:text-xl text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                      {'usd' in plan && (plan as any).usd && <p className="text-base text-muted-foreground">
                          {(plan as any).usd}
                        </p>}
                    </div>

                    {/* Features with better mobile spacing */}
                    <div className="space-y-4 sm:space-y-6">
                      {plan.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start gap-3 sm:gap-4 hover:translate-x-1 transition-transform duration-200">
                          <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                          </div>
                          <span className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                            {feature}
                          </span>
                        </div>)}
                    </div>

                    {/* CTA with responsive sizing */}
                    <Button onClick={index === 0 ? onTryFree : onUpgrade ? () => onUpgrade('family') : onSeePricing} variant={plan.popular ? "default" : "secondary"} size="xl" className={`w-full h-12 sm:h-14 text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 ${plan.popular ? 'bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl' : 'shadow-lg hover:shadow-xl'}`}>
                      {plan.popular && <Bolt className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                      {plan.cta}
                    </Button>

                    {/* Remove floating elements */}

                  </CardContent>
                </Card>
              </div>
            </motion.div>)}
        </div>

        {/* Enhanced Footer Notes */}
        

      </div>
    </section>;
};