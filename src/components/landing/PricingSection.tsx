import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Check, Star, Zap } from 'lucide-react';
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
  return (
    <section id="pricing" className="py-32 sm:py-40 lg:py-48 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-0 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 18,
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
          transition={{ duration: 0.8 }}
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
          <motion.p 
            className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {content.subtitle}
          </motion.p>
        </motion.div>

        {/* Enhanced Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <motion.div
                whileHover={{ 
                  scale: plan.popular ? 1.02 : 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className={`relative group transition-all duration-500 h-full ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-2xl scale-105 lg:scale-110 bg-gradient-to-br from-card to-primary/5' 
                    : 'border-2 hover:border-primary/30 hover:shadow-xl bg-gradient-to-br from-card to-card/80'
                }`}>
                  {/* Enhanced Popular Badge */}
                  {plan.popular && (
                    <motion.div 
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </div>
                    </motion.div>
                  )}

                  <CardContent className="p-8 sm:p-10 space-y-8 relative">
                    
                    {/* Enhanced Header */}
                    <div className="text-center space-y-4">
                      <motion.h3 
                        className="text-2xl sm:text-3xl font-bold text-foreground"
                        whileHover={{ scale: 1.05 }}
                      >
                        {plan.title}
                      </motion.h3>
                      <p className="text-muted-foreground text-lg">
                        {plan.description}
                      </p>
                    </div>

                    {/* Enhanced Price */}
                    <div className="text-center space-y-2">
                      <div className="flex items-baseline justify-center gap-2">
                        <motion.span 
                          className="text-4xl sm:text-5xl font-bold text-foreground"
                          whileHover={{ scale: 1.1 }}
                        >
                          {plan.price}
                        </motion.span>
                        <span className="text-xl text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                      {'usd' in plan && (plan as any).usd && (
                        <p className="text-base text-muted-foreground">
                          {(plan as any).usd}
                        </p>
                      )}
                    </div>

                    {/* Enhanced Features */}
                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex} 
                          className="flex items-start gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          </div>
                          <span className="text-muted-foreground text-lg leading-relaxed">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Enhanced CTA */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={index === 0 ? onTryFree : onUpgrade ? () => onUpgrade('family') : onSeePricing} 
                        variant={plan.popular ? "default" : "secondary"} 
                        size="xl" 
                        className={`w-full h-14 text-lg font-semibold transition-all duration-300 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl hover:shadow-2xl' 
                            : 'shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {plan.popular && <Zap className="w-5 h-5 mr-2" />}
                        {plan.cta}
                      </Button>
                    </motion.div>

                    {/* Floating Elements for Popular Plan */}
                    {plan.popular && (
                      <>
                        <motion.div
                          className="absolute top-4 right-4 w-8 h-8 bg-secondary/60 backdrop-blur-sm rounded-xl flex items-center justify-center"
                          animate={{
                            y: [-3, 3, -3],
                            rotate: [0, 5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <span className="text-sm">✨</span>
                        </motion.div>
                        <motion.div
                          className="absolute bottom-4 left-4 w-6 h-6 bg-accent/60 backdrop-blur-sm rounded-lg flex items-center justify-center"
                          animate={{
                            y: [3, -3, 3],
                            rotate: [0, -5, 0],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                          }}
                        >
                          <span className="text-xs">💖</span>
                        </motion.div>
                      </>
                    )}

                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Footer Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center space-y-6"
        >
          <motion.p 
            className="text-base text-muted-foreground bg-gradient-to-r from-muted/70 to-muted/50 backdrop-blur-sm rounded-2xl px-8 py-6 inline-block max-w-3xl shadow-lg border border-muted-foreground/10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {content.note}
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onSeePricing} 
              variant="ghost" 
              className="text-primary hover:text-primary/80 text-lg font-semibold px-8 py-4 rounded-2xl hover:bg-primary/5 transition-all duration-300"
            >
              {content.fullPricing} →
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};