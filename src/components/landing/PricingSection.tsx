import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Check, Star, Heart, Users, Mic, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onUpgrade?: (planId: string) => void;
}

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: "Preserve memórias, reconquiste conexões",
      subtitle: "Experimente o poder da Eterna por 7 dias. Depois, escolha o plano ideal para manter quem você ama sempre presente.",
      plans: {
        free: {
          title: "Primeiro Olhar",
          subtitle: "Uma memória, uma voz, um começo.",
          price: "Gratuito",
          period: "7 dias",
          features: [
            "7 dias de acesso total gratuito",
            "1 pessoa registrada (clone)",
            "Até 5 minutos de voz gerada",
            "Até 20 interações com IA",
            "Sem personalização de personalidade",
            "Sem exportação de conteúdo"
          ],
          cta: "Comece grátis",
          highlight: "Depois: 50% de desconto no primeiro mês",
          popular: false
        },
        essential: {
          title: "Essencial",
          subtitle: "Para quem quer manter uma presença viva e reconfortante.",
          price: "US$ 29",
          period: "/mês",
          features: [
            "1 pessoa registrada",
            "Até 30 minutos de voz gerada/mês",
            "Até 200 interações com IA/mês",
            "Personalidade básica (voz, estilo e tom)",
            "Acesso contínuo ao conteúdo",
            "Exportação básica de áudio",
            "Sem convidados extras"
          ],
          cta: "Assine Essencial",
          popular: false,
          highlight: ""
        },
        complete: {
          title: "Completo",
          subtitle: "Para famílias que desejam homenagear profundamente quem amam.",
          price: "US$ 79",
          period: "/mês",
          features: [
            "Até 3 pessoas registradas",
            "Até 120 minutos de voz gerada/mês",
            "Interações de chat ilimitadas",
            "Personalidade avançada (temperamento, estilo emocional)",
            "Upload de memórias (texto, fotos, áudio)",
            "Exportação completa de áudio",
            "Compartilhamento com até 3 convidados",
            "Acesso contínuo às memórias"
          ],
          cta: "Assine Completo",
          popular: true,
          highlight: ""
        }
      },
      testimonials: [
        {
          text: "Senti minha avó falando comigo de novo — inacreditável.",
          author: "Maria, 42 anos"
        },
        {
          text: "Voltar a ouvir minha mãe dizendo meu nome me emocionou.",
          author: "Carlos, 35 anos"
        },
        {
          text: "É como manter uma parte dela viva aqui comigo.",
          author: "Ana, 28 anos"
        }
      ]
    },
    en: {
      title: "Preserve memories, reconnect hearts",
      subtitle: "Experience the power of Eterna for 7 days. Then choose the perfect plan to keep your loved ones always present.",
      plans: {
        free: {
          title: "First Look",
          subtitle: "One memory, one voice, one beginning.",
          price: "Free",
          period: "7 days",
          features: [
            "7 days of full free access",
            "1 registered person (clone)",
            "Up to 5 minutes of generated voice",
            "Up to 20 AI interactions",
            "No personality customization",
            "No content export"
          ],
          cta: "Start Free",
          highlight: "Then: 50% off first month",
          popular: false
        },
        essential: {
          title: "Essential",
          subtitle: "For those who want to keep a living and comforting presence.",
          price: "US$ 29",
          period: "/month",
          features: [
            "1 registered person",
            "Up to 30 minutes voice generation/month",
            "Up to 200 AI interactions/month",
            "Basic personality (voice, style and tone)",
            "Continuous content access",
            "Basic audio export",
            "No extra guests"
          ],
          cta: "Subscribe Essential",
          popular: false,
          highlight: ""
        },
        complete: {
          title: "Complete",
          subtitle: "For families who want to deeply honor those they love.",
          price: "US$ 79",
          period: "/month",
          features: [
            "Up to 3 registered persons",
            "Up to 120 minutes voice generation/month",
            "Unlimited chat interactions",
            "Advanced personality (temperament, emotional style)",
            "Memory uploads (text, photos, audio)",
            "Complete audio export",
            "Share with up to 3 guests",
            "Continuous memory access"
          ],
          cta: "Subscribe Complete",
          popular: true,
          highlight: ""
        }
      },
      testimonials: [
        {
          text: "I felt my grandmother speaking to me again — incredible.",
          author: "Maria, 42"
        },
        {
          text: "Hearing my mother say my name again moved me to tears.",
          author: "Carlos, 35"
        },
        {
          text: "It's like keeping a part of her alive here with me.",
          author: "Ana, 28"
        }
      ]
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const PricingSection: React.FC<PricingSectionProps> = ({
  onTryFree,
  onSeePricing,
  onUpgrade
}) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  
  const planOrder = [content.plans.free, content.plans.essential, content.plans.complete];

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-background via-background/90 to-muted/20 relative overflow-hidden">
      {/* Subtle background elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.2, 0.4]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16 sm:mb-20"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-6xl mx-auto mb-20">
          {planOrder.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              <Card className={`relative group transition-all duration-300 h-full border-2 ${
                plan.popular 
                  ? 'border-primary/50 shadow-2xl bg-gradient-to-br from-card via-primary/5 to-primary/10 scale-105' 
                  : 'border-border/50 hover:border-primary/30 hover:shadow-lg bg-gradient-to-br from-card to-card/95'
              }`}>
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold shadow-lg">
                      <Star className="w-4 h-4 mr-1" />
                      Mais popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8 space-y-6 relative">
                  {/* Plan header */}
                  <div className="text-center space-y-3">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                      index === 0 ? 'bg-gradient-to-br from-accent/20 to-accent/10' :
                      index === 1 ? 'bg-gradient-to-br from-primary/20 to-primary/10' :
                      'bg-gradient-to-br from-primary/30 to-primary/20'
                    }`}>
                      {index === 0 && <Heart className="w-8 h-8 text-accent" />}
                      {index === 1 && <MessageCircle className="w-8 h-8 text-primary" />}
                      {index === 2 && <Users className="w-8 h-8 text-primary" />}
                    </div>
                    
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      {plan.title}
                    </h3>
                    <p className="text-muted-foreground text-base italic leading-relaxed">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center space-y-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    {plan.highlight && (
                      <p className="text-sm text-primary font-medium">
                        {plan.highlight}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3 group/feature">
                        <div className="p-1 bg-primary/10 rounded-full mt-0.5 group-hover/feature:bg-primary/20 transition-colors">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground leading-relaxed text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={
                      index === 0 ? onTryFree : 
                      index === 1 ? (onUpgrade ? () => onUpgrade('essential') : onSeePricing) :
                      (onUpgrade ? () => onUpgrade('complete') : onSeePricing)
                    }
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    className={`w-full font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'hover:bg-primary hover:text-primary-foreground hover:scale-105'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                className="text-center space-y-4"
              >
                <div className="bg-gradient-to-br from-card/80 to-muted/20 p-6 rounded-2xl border border-border/50">
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <p className="text-sm text-primary font-medium mt-4">
                    — {testimonial.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};