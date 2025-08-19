import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/hooks/useLanguage';
import { useSubscriptionInfo } from '@/hooks/useSubscriptionInfo';
import { SubscriptionService } from '@/services/subscriptionService';
import { 
  Check, 
  X, 
  Heart, 
  MessageCircle, 
  Users, 
  Lock, 
  Quote,
  Volume2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface PricingSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onUpgrade?: (planId: string) => void;
}

interface PlanData {
  title: string;
  slogan: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  note?: string;
  popular: boolean;
  specialNote?: string;
  
}

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: "Escolha como manter quem você ama sempre por perto",
      subtitle: "Experimente o Eterna por 7 dias grátis (sem voz contínua). Depois, escolha um plano para desbloquear áudio e presença.",
      plans: {
        free: {
          title: "Primeiro Olhar",
          slogan: "Uma memória em texto. Um começo.",
          price: "Grátis por 7 dias",
          features: [
            "1 pessoa (clone)",
            "20 interações de chat (TEXTO)",
            "Upload de memórias em texto e fotos (sem áudio contínuo)",
            "Sem exportação"
          ],
          cta: "Comece grátis",
          popular: false
        } as PlanData,
        essential: {
          title: "Essencial",
          slogan: "Presença contínua, com voz humana.",
          price: "US$ 29",
          period: "/mês",
          features: [
            "1 pessoa",
            "30 minutos/mês de voz gerada (vozes pré-criadas, NÃO personalizadas)",
            "200 interações/mês de chat",
            "Personalidade básica (tom/estilo)",
            "Exportação básica de áudio"
          ],
          cta: "Assine Essencial",
          note: "Vozes genéricas, sem uso de slots personalizados.",
          popular: false
        } as PlanData,
        complete: {
          title: "Completo",
          slogan: "Para preservar uma presença real em família.",
          price: "US$ 79",
          period: "/mês",
          features: [
            "Até 3 pessoas",
            "120 minutos/mês de voz",
            "Interações ilimitadas de chat",
            "Personalidade avançada (temperamento/emoção)",
            "Upload de textos, fotos e áudios",
            "Exportação completa de áudio",
            "Compartilhamento com até 3 convidados",
            "Voz personalizada com gravações reais (consome slot global)"
          ],
          cta: "Assine Completo",
          
          popular: true,
          specialNote: "Limite global de capacidade: 30 vozes simultâneas"
        } as PlanData
      },
      comparison: {
        title: "Barra comparativa",
        buttonText: "Ver comparação detalhada",
        seeDetails: "Ver detalhes",
        headers: ["Recursos", "Free", "Essencial", "Completo"],
        features: [
          { name: "Pessoas (clones)", free: "1", essential: "1", complete: "3" },
          { name: "Minutos de voz/mês", free: "—", essential: "30", complete: "120" },
          { name: "Interações de chat/mês", free: "20", essential: "200", complete: "Ilimitado" },
          { name: "Vozes pré-criadas", free: "—", essential: "✔", complete: "✔" },
          { name: "Voz personalizada (slots)", free: "—", essential: "—", complete: "✔" },
          { name: "Exportação de áudio", free: "—", essential: "Básica", complete: "Completa" },
          { name: "Convidados", free: "—", essential: "—", complete: "✔ (até 3)" }
        ]
      },
      faq: {
        title: "FAQ rápido",
        items: [
          {
            question: "Qual a diferença entre voz pré-criada e personalizada?",
            answer: "A pré-criada usa timbres humanos genéricos; a personalizada é treinada com gravações reais (apenas no Completo e sujeita a slots)."
          },
          {
            question: "Posso mudar de plano depois?",
            answer: "Sim, a qualquer momento."
          }
        ]
      },
      footer: {
        notes: [
          "Voz personalizada sujeita à disponibilidade de slots.",
          "Minutos e interações são reiniciados mensalmente. Uso adicional pode exigir add-ons.",
          "Valores em USD. Impostos podem se aplicar conforme região."
        ]
      },
      slots: {
        available: "Vagas disponíveis para voz personalizada agora"
      },
      testimonials: [
        "Voltar a ouvir a voz da minha mãe foi como um abraço.",
        "Ela me chamou de filho de novo. Eu chorei.",
        "É como manter uma parte dela viva aqui comigo."
      ]
    },
    en: {
      title: "Choose how to keep your loved ones always close",
      subtitle: "Try Eterna for 7 days free (no continuous voice). Then choose a plan to unlock audio and presence.",
      plans: {
        free: {
          title: "First Look",
          slogan: "A text memory. A beginning.",
          price: "Free for 7 days",
          features: [
            "1 person (clone)",
            "20 chat interactions (TEXT)",
            "Upload text and photo memories (no continuous audio)",
            "No export"
          ],
          cta: "Start free",
          popular: false
        } as PlanData,
        essential: {
          title: "Essential",
          slogan: "Continuous presence, with human voice.",
          price: "US$ 29",
          period: "/month",
          features: [
            "1 person",
            "30 minutes/month of generated voice (pre-created voices, NOT personalized)",
            "200 chat interactions/month",
            "Basic personality (tone/style)",
            "Basic audio export"
          ],
          cta: "Subscribe Essential",
          note: "Generic voices, no personalized slots used.",
          popular: false
        } as PlanData,
        complete: {
          title: "Complete",
          slogan: "To preserve a real presence in the family.",
          price: "US$ 79",
          period: "/month",
          features: [
            "Up to 3 people",
            "120 minutes/month of voice",
            "Unlimited chat interactions",
            "Advanced personality (temperament/emotion)",
            "Upload texts, photos and audios",
            "Complete audio export",
            "Share with up to 3 guests",
            "Custom voice with real recordings (consumes global slot)"
          ],
          cta: "Subscribe Complete",
          
          popular: true,
          specialNote: "Global capacity limit: 30 simultaneous voices"
        } as PlanData
      },
      comparison: {
        title: "Comparison table",
        buttonText: "See detailed comparison",
        seeDetails: "See details",
        headers: ["Features", "Free", "Essential", "Complete"],
        features: [
          { name: "People (clones)", free: "1", essential: "1", complete: "3" },
          { name: "Voice minutes/month", free: "—", essential: "30", complete: "120" },
          { name: "Chat interactions/month", free: "20", essential: "200", complete: "Unlimited" },
          { name: "Pre-created voices", free: "—", essential: "✔", complete: "✔" },
          { name: "Custom voice (slots)", free: "—", essential: "—", complete: "✔" },
          { name: "Audio export", free: "—", essential: "Basic", complete: "Complete" },
          { name: "Guests", free: "—", essential: "—", complete: "✔ (up to 3)" }
        ]
      },
      faq: {
        title: "Quick FAQ",
        items: [
          {
            question: "What's the difference between pre-created and custom voice?",
            answer: "Pre-created uses generic human timbres; custom is trained with real recordings (Complete plan only, subject to slots)."
          },
          {
            question: "Can I change plans later?",
            answer: "Yes, at any time."
          }
        ]
      },
      footer: {
        notes: [
          "Custom voice subject to slot availability.",
          "Minutes and interactions are reset monthly. Additional usage may require add-ons.",
          "Values in USD. Taxes may apply according to region."
        ]
      },
      slots: {
        available: "Slots available for custom voice now"
      },
      testimonials: [
        "Hearing my mother's voice again was like a hug.",
        "She called me son again. I cried.",
        "It's like keeping a part of her alive with me."
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
  const { toast } = useToast();
  
  // Use real subscription data
  const { 
    subscriptionInfo, 
    loading: subscriptionLoading,
    slotsAvailable, 
    isSlotAvailable
  } = useSubscriptionInfo();
  
  const planOrder = [content.plans.free, content.plans.essential, content.plans.complete];

  // Event handlers with proper IDs for analytics
  const handleFreeTrial = () => {
    console.log('Analytics: pricing_free_start');
    onTryFree();
  };

  const handleEssentialSubscribe = async () => {
    console.log('Analytics: pricing_subscribe_essential');
    try {
      const { url } = await SubscriptionService.createCheckoutSession('essential');
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      toast({
        title: currentLanguage === 'pt-BR' ? "Erro" : "Error",
        description: currentLanguage === 'pt-BR' ? 
          "Falha ao iniciar processo de assinatura. Tente novamente." : 
          "Failed to start subscription process. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteSubscribe = async () => {
    console.log('Analytics: pricing_subscribe_complete');
    try {
      const { url } = await SubscriptionService.createCheckoutSession('complete');
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      toast({
        title: currentLanguage === 'pt-BR' ? "Erro" : "Error",
        description: currentLanguage === 'pt-BR' ? 
          "Falha ao iniciar processo de assinatura. Tente novamente." : 
          "Failed to start subscription process. Please try again.",
        variant: "destructive"
      });
    }
  };


  return (
    <>
      <section id="pricing" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight">
              {content.title}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              {content.subtitle}
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {planOrder.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${plan.popular ? 'md:scale-105 md:-mt-4' : ''}`}
              >
                <Card className={`relative h-full transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-2xl bg-gradient-to-br from-card via-card to-primary/5' 
                    : 'border border-border/50 hover:border-primary/30 hover:shadow-lg bg-card'
                }`}>
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold shadow-lg">
                        {currentLanguage === 'pt-BR' ? 'Mais popular' : 'Most popular'}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-8 space-y-8">
                    {/* Plan header */}
                    <div className="text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-br from-accent/20 to-accent/10' :
                        index === 1 ? 'bg-gradient-to-br from-primary/20 to-primary/10' :
                        'bg-gradient-to-br from-primary/30 to-primary/20'
                      }`}>
                        {index === 0 && <Heart className={`w-8 h-8 ${index === 0 ? 'text-accent' : 'text-primary'}`} />}
                        {index === 1 && <MessageCircle className="w-8 h-8 text-primary" />}
                        {index === 2 && <Users className="w-8 h-8 text-primary" />}
                      </div>
                      
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                          {plan.title}
                        </h3>
                        <p className="text-muted-foreground italic text-base leading-relaxed">
                          "{plan.slogan}"
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-lg text-muted-foreground">
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm leading-relaxed">
                            {feature.includes('🔒') ? (
                              <>
                                {feature.replace(' 🔒', '')}
                                <Lock className="inline w-4 h-4 ml-1 text-muted-foreground/60" />
                              </>
                            ) : feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Complete plan slot availability */}
                    {index === 2 && (
                      <div className="p-4 rounded-lg border bg-green-50 border-green-200 availability-ok">
                        <p className="text-sm font-medium text-center text-green-700">
                          {content.slots.available}
                        </p>
                        {subscriptionInfo && (
                          <p className="text-xs text-center mt-1 opacity-75">
                            {subscriptionInfo.capacity.slots_active}/{subscriptionInfo.capacity.plan_capacity.max_slots} slots em uso
                          </p>
                        )}
                      </div>
                    )}

                    {/* Plan note */}
                    {plan.note && (
                      <p className="text-xs text-muted-foreground italic text-center">
                        {plan.note}
                      </p>
                    )}

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Button 
                        id={`pricing_${index === 0 ? 'free_start' : index === 1 ? 'subscribe_essential' : 'subscribe_complete'}`}
                        onClick={
                          index === 0 ? handleFreeTrial :
                          index === 1 ? handleEssentialSubscribe :
                          handleCompleteSubscribe
                        }
                        variant={plan.popular ? "default" : "outline"}
                        size="lg" 
                        className="w-full h-12 font-semibold"
                        disabled={subscriptionLoading}
                      >
                        {plan.cta}
                      </Button>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden"
          >
            <div className="p-8">
              <h3 className="font-serif text-2xl font-bold text-center text-foreground mb-8">
                {content.comparison.title}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {content.comparison.headers.map((header, index) => (
                        <th key={index} className={`py-4 px-4 font-semibold text-foreground ${
                          index === 0 ? 'text-left' : 'text-center'
                        }`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {content.comparison.features.map((feature, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-4 text-muted-foreground">{feature.name}</td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            feature.free
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.essential === 'boolean' ? (
                            feature.essential ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            feature.essential
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.complete === 'boolean' ? (
                            feature.complete ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            feature.complete
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {content.testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors">
                    <Quote className="w-8 h-8 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground italic leading-relaxed">
                      "{testimonial}"
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="font-serif text-3xl font-bold text-center text-foreground mb-12">
              {content.faq.title}
            </h3>
            
            <Accordion type="single" collapsible className="space-y-4">
              {content.faq.items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </>
  );
};