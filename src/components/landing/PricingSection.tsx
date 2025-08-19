import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Check, X, Heart, MessageCircle, Users, Mic, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { WaitlistModal } from './WaitlistModal';
import { Separator } from '@/components/ui/separator';

interface PricingSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onUpgrade?: (planId: string) => void;
}

// Simulated slots availability - connect to backend when available
const AVAILABLE_SLOTS = 30;

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
  ctaCustomVoice?: string;
  ctaWaitlist?: string;
}

const getContent = (language: string) => {
  const content = {
    'pt-BR': {
      title: "Escolha como manter quem você ama sempre por perto",
      subtitle: "Experimente a Eterna por 7 dias grátis. Depois, escolha seu plano para continuar ouvindo, lembrando e sentindo.",
      plans: {
        free: {
          title: "Primeiro Olhar",
          slogan: "Uma voz. Uma memória. Um começo.",
          price: "Grátis por 7 dias",
          features: [
            "1 pessoa (clone)",
            "5 minutos de voz gerada",
            "20 interações de chat",
            "Vozes humanas genéricas (pré-criadas)",
            "Sem exportação de conteúdo",
            "Sem personalização de personalidade"
          ],
          cta: "Comece grátis",
          note: "Ao final do teste, escolha um plano para continuar usando.",
          popular: false
        } as PlanData,
        essential: {
          title: "Essencial",
          slogan: "Presença contínua, simples e reconfortante.",
          price: "US$ 29",
          period: "/mês",
          features: [
            "1 pessoa",
            "30 minutos/mês de voz gerada",
            "200 interações/mês de chat",
            "Vozes humanas pré-criadas (não personalizadas)",
            "Personalidade básica (tom e estilo)",
            "Exportação básica de áudio"
          ],
          cta: "Assine Essencial",
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
            "Personalidade avançada (temperamento e emoção)",
            "Upload de textos, áudios, fotos e memórias",
            "Exportação completa de áudio",
            "Compartilhamento com até 3 convidados",
            "Voz personalizada baseada em gravações reais"
          ],
          cta: "Assine Completo",
          ctaCustomVoice: "Criar minha voz agora",
          ctaWaitlist: "Entrar na fila",
          popular: true,
          specialNote: "Limite global de capacidade: 30 vozes simultâneas"
        } as PlanData
      },
      comparison: {
        title: "Compare todos os recursos",
        features: [
          { name: "Pessoas (clones)", free: "1", essential: "1", complete: "3" },
          { name: "Minutos de voz/mês", free: "5", essential: "30", complete: "120" },
          { name: "Interações de chat/mês", free: "20", essential: "200", complete: "Ilimitado" },
          { name: "Vozes genéricas pré-criadas", free: true, essential: true, complete: true },
          { name: "Personalidade avançada", free: false, essential: false, complete: true },
          { name: "Exportação completa de áudio", free: false, essential: false, complete: true },
          { name: "Compartilhamento com convidados", free: false, essential: false, complete: "Até 3" },
          { name: "Voz personalizada (slots limitados)", free: false, essential: false, complete: true }
        ]
      },
      faq: {
        title: "Dúvidas Frequentes",
        items: [
          {
            question: "Como funciona o teste grátis?",
            answer: "Você tem 7 dias de acesso. Ao final, escolha um plano para continuar usando suas memórias e vozes."
          },
          {
            question: "O que é voz personalizada?",
            answer: "Criamos uma voz única baseada em gravações reais. Há 30 slots globais ativos; se estiver cheio, você pode entrar na fila."
          },
          {
            question: "Perco minha voz personalizada se eu cancelar?",
            answer: "Podemos desativá-la após um período sem uso para liberar o slot. Avisaremos antes."
          },
          {
            question: "Posso mudar de plano depois?",
            answer: "Sim, você pode alterar ou cancelar a qualquer momento."
          }
        ]
      },
      footer: {
        notes: [
          "Voz personalizada sujeita à disponibilidade de slots. Em caso de fila, avisaremos por email.",
          "Minutos e interações são reiniciados mensalmente. Uso adicional pode exigir add-ons.",
          "Valores em USD. Impostos podem se aplicar conforme região."
        ]
      },
      slots: {
        available: "Vagas disponíveis para voz personalizada agora",
        unavailable: "Todas as vagas ocupadas no momento. Entre na fila e avisaremos assim que liberar."
      }
    },
    en: {
      title: "Choose how to keep your loved ones always close",
      subtitle: "Try Eterna for 7 days free. Then choose your plan to keep listening, remembering and feeling.",
      plans: {
        free: {
          title: "First Look",
          slogan: "One voice. One memory. A beginning.",
          price: "Free for 7 days",
          features: [
            "1 person (clone)",
            "5 minutes of generated voice",
            "20 chat interactions",
            "Generic human voices (pre-created)",
            "No content export",
            "No personality customization"
          ],
          cta: "Start free",
          note: "At the end of the test, choose a plan to continue using.",
          popular: false
        } as PlanData,
        essential: {
          title: "Essential",
          slogan: "Continuous, simple and comforting presence.",
          price: "US$ 29",
          period: "/month",
          features: [
            "1 person",
            "30 minutes/month of generated voice",
            "200 chat interactions/month",
            "Pre-created human voices (not personalized)",
            "Basic personality (tone and style)",
            "Basic audio export"
          ],
          cta: "Subscribe Essential",
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
            "Advanced personality (temperament and emotion)",
            "Upload texts, audios, photos and memories",
            "Complete audio export",
            "Share with up to 3 guests",
            "Custom voice based on real recordings"
          ],
          cta: "Subscribe Complete",
          ctaCustomVoice: "Create my voice now",
          ctaWaitlist: "Join waitlist",
          popular: true,
          specialNote: "Global capacity limit: 30 simultaneous voices"
        } as PlanData
      },
      comparison: {
        title: "Compare all features",
        features: [
          { name: "People (clones)", free: "1", essential: "1", complete: "3" },
          { name: "Voice minutes/month", free: "5", essential: "30", complete: "120" },
          { name: "Chat interactions/month", free: "20", essential: "200", complete: "Unlimited" },
          { name: "Generic pre-created voices", free: true, essential: true, complete: true },
          { name: "Advanced personality", free: false, essential: false, complete: true },
          { name: "Complete audio export", free: false, essential: false, complete: true },
          { name: "Guest sharing", free: false, essential: false, complete: "Up to 3" },
          { name: "Custom voice (limited slots)", free: false, essential: false, complete: true }
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "How does the free trial work?",
            answer: "You have 7 days of access. At the end, choose a plan to continue using your memories and voices."
          },
          {
            question: "What is custom voice?",
            answer: "We create a unique voice based on real recordings. There are 30 global active slots; if it's full, you can join the queue."
          },
          {
            question: "Do I lose my custom voice if I cancel?",
            answer: "We may deactivate it after a period without use to free up the slot. We'll notify you beforehand."
          },
          {
            question: "Can I change plans later?",
            answer: "Yes, you can change or cancel at any time."
          }
        ]
      },
      footer: {
        notes: [
          "Custom voice subject to slot availability. In case of queue, we'll notify by email.",
          "Minutes and interactions are reset monthly. Additional usage may require add-ons.",
          "Values in USD. Taxes may apply according to region."
        ]
      },
      slots: {
        available: "Slots available for custom voice now",
        unavailable: "All slots occupied at the moment. Join the queue and we'll notify you when available."
      }
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
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  
  const slotsAvailable = AVAILABLE_SLOTS > 0;
  const planOrder = [content.plans.free, content.plans.essential, content.plans.complete];

  return (
    <>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {planOrder.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`${plan.popular ? 'lg:scale-105' : ''}`}
              >
                <Card className={`relative group transition-all duration-300 h-full border-2 ${
                  plan.popular 
                    ? 'border-primary shadow-2xl bg-gradient-to-br from-card via-primary/5 to-primary/10' 
                    : 'border-border/50 hover:border-primary/30 hover:shadow-lg bg-gradient-to-br from-card to-card/95'
                }`}>
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold shadow-lg">
                        Mais Popular
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-8 space-y-6">
                    {/* Plan header */}
                    <div className="text-center space-y-3">
                      <div className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center ${
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
                        "{plan.slogan}"
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center space-y-2">
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
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                            <Check className="w-3 h-3 text-primary flex-shrink-0" />
                          </div>
                          <span className="text-muted-foreground leading-relaxed text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Special note for Complete plan */}
                    {index === 2 && (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground italic text-center">
                          {plan.specialNote}
                        </p>
                        <div className={`text-center p-3 rounded-lg ${
                          slotsAvailable 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-amber-50 border border-amber-200'
                        }`}>
                          <p className={`text-sm font-medium ${
                            slotsAvailable ? 'text-green-700' : 'text-amber-700'
                          }`}>
                            {slotsAvailable ? content.slots.available : content.slots.unavailable}
                          </p>
                        </div>
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
                        onClick={
                          index === 0 ? onTryFree : 
                          index === 1 ? (onUpgrade ? () => onUpgrade('essential') : onSeePricing) :
                          (onUpgrade ? () => onUpgrade('complete') : onSeePricing)
                        }
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        className="w-full font-semibold transition-all duration-300"
                      >
                        {plan.cta}
                      </Button>

                      {/* Secondary CTA for Complete plan */}
                      {index === 2 && (
                        <Button 
                          onClick={slotsAvailable ? () => {
                            // Navigate to voice creation
                            if (onUpgrade) onUpgrade('complete-voice');
                          } : () => setShowWaitlistModal(true)}
                          variant="ghost"
                          size="sm"
                          className="w-full text-sm"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          {slotsAvailable ? plan.ctaCustomVoice : plan.ctaWaitlist}
                        </Button>
                      )}
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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-serif font-bold text-center mb-8">
              {content.comparison.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto bg-card rounded-lg border border-border">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Recurso</th>
                    <th className="text-center p-4 font-semibold text-foreground">Free</th>
                    <th className="text-center p-4 font-semibold text-foreground">Essencial</th>
                    <th className="text-center p-4 font-semibold text-foreground bg-primary/5">Completo</th>
                  </tr>
                </thead>
                <tbody>
                  {content.comparison.features.map((feature, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="p-4 text-muted-foreground">{feature.name}</td>
                      <td className="p-4 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-foreground font-medium">{feature.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof feature.essential === 'boolean' ? (
                          feature.essential ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-foreground font-medium">{feature.essential}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        {typeof feature.complete === 'boolean' ? (
                          feature.complete ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-foreground font-medium">{feature.complete}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-serif font-bold text-center mb-8">
              {content.faq.title}
            </h3>
            <div className="max-w-3xl mx-auto space-y-6">
              {content.faq.items.map((item, index) => (
                <Card key={index} className="p-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {item.question}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Footer notes */}
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            {content.footer.notes.map((note, index) => (
              <p key={index} className="text-xs text-muted-foreground">
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <WaitlistModal 
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </>
  );
};