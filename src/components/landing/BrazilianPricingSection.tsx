import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Check, 
  X, 
  Heart, 
  MessageCircle, 
  Users, 
  Mic, 
  Lock, 
  Play,
  Quote,
  Volume2,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface BrazilianPricingSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onUpgrade?: (planId: string) => void;
}

// Simulated state variables - connect to backend when available
const mockState = {
  plan: 'free' as 'free' | 'essential' | 'complete',
  slotsDisponiveis: 30, // Current available slots
  maxSlots: 30,
  autoUpgradeThreshold: 30,
  waitlistLength: 0,
  free_voice_demo_seconds_total: 60,
  free_voice_demo_seconds_used: 0,
  require_onboarding_to_unlock_demo: true,
  monthly_voice_minutes_essential: 30,
  monthly_voice_minutes_complete: 120,
  monthly_chat_limits: { free: 20, essential: 200, complete: -1 },
  genericVoicesEnabled: { free: false, essential: true, complete: true },
  personalizedVoiceEnabled: { free: false, essential: false, complete: true }
};

export const BrazilianPricingSection: React.FC<BrazilianPricingSectionProps> = ({
  onTryFree,
  onSeePricing,
  onUpgrade
}) => {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '', consent: false });
  const [demoProgress, setDemoProgress] = useState(mockState.free_voice_demo_seconds_used);
  const { toast } = useToast();
  
  const slotsAvailable = mockState.slotsDisponiveis > 0;
  const demoExhausted = demoProgress >= mockState.free_voice_demo_seconds_total;

  // Event handlers with proper IDs
  const handleFreeTrial = () => {
    // pricing_free_start
    console.log('Analytics: pricing_free_start');
    onTryFree();
  };

  const handleVoiceDemo = () => {
    if (mockState.plan !== 'free') return;
    if (demoProgress >= mockState.free_voice_demo_seconds_total) return;
    
    // free_demo_play_start
    console.log('Analytics: free_demo_play_start');
    
    // Simulate demo playback
    const playDuration = Math.min(15, mockState.free_voice_demo_seconds_total - demoProgress);
    setDemoProgress(prev => Math.min(prev + playDuration, mockState.free_voice_demo_seconds_total));
    
    toast({
      title: "Demonstração reproduzida",
      description: `${playDuration}s de demonstração utilizada`,
    });

    if (demoProgress + playDuration >= mockState.free_voice_demo_seconds_total) {
      console.log('Analytics: free_demo_play_complete');
    }
  };

  const handleEssentialSubscribe = () => {
    console.log('Analytics: pricing_subscribe_essential');
    onUpgrade?.('essential');
  };

  const handleCompleteSubscribe = () => {
    console.log('Analytics: pricing_subscribe_complete');
    onUpgrade?.('complete');
  };

  const handleCreateVoice = () => {
    if (!slotsAvailable) return;
    console.log('Analytics: voice_create_now_click');
    toast({
      title: "Iniciando criação de voz",
      description: "Redirecionando para o processo de clonagem...",
    });
  };

  const handleJoinWaitlist = () => {
    console.log('Analytics: voice_join_waitlist_click');
    setShowWaitlistModal(true);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistForm.name || !waitlistForm.email || !waitlistForm.consent) return;
    
    console.log('Analytics: waitlist_submit_success', waitlistForm);
    toast({
      title: "Adicionado à lista de espera",
      description: "Você será notificado quando uma vaga for liberada.",
    });
    setShowWaitlistModal(false);
    setWaitlistForm({ name: '', email: '', consent: false });
  };

  const handleUpsellToEssential = () => {
    console.log('Analytics: upsell_to_essential');
    onUpgrade?.('essential');
  };

  // Plan definitions
  const plans = [
    {
      id: 'free',
      title: 'Primeiro Olhar',
      slogan: 'Uma memória em texto. Um começo.',
      price: 'Grátis por 7 dias',
      icon: Heart,
      features: [
        '1 pessoa (clone)',
        '20 interações de chat (TEXTO)',
        'Upload de memórias em texto e fotos (sem áudio contínuo)',
        'Demo único de 60s de voz (vozes genéricas, one-time) 🔒',
        'Sem exportação'
      ],
      note: 'O teste gratuito não inclui voz contínua. O demo de 60s é único por conta.',
      cta: 'Comece grátis',
      popular: false
    },
    {
      id: 'essential',
      title: 'Essencial',
      slogan: 'Presença contínua, com voz humana.',
      price: 'US$ 29',
      period: '/mês',
      icon: MessageCircle,
      features: [
        '1 pessoa',
        '30 minutos/mês de voz gerada (vozes pré-criadas, NÃO personalizadas)',
        '200 interações/mês de chat',
        'Personalidade básica (tom/estilo)',
        'Exportação básica de áudio'
      ],
      note: 'Vozes genéricas, sem uso de slots personalizados.',
      cta: 'Assine Essencial',
      popular: false
    },
    {
      id: 'complete',
      title: 'Completo',
      slogan: 'Para preservar uma presença real em família.',
      price: 'US$ 79',
      period: '/mês',
      icon: Users,
      features: [
        'Até 3 pessoas',
        '120 minutos/mês de voz',
        'Interações ilimitadas de chat',
        'Personalidade avançada (temperamento/emoção)',
        'Upload de textos, fotos e áudios',
        'Exportação completa de áudio',
        'Compartilhamento com até 3 convidados',
        'Voz personalizada com gravações reais (consome slot global)'
      ],
      cta: 'Assine Completo',
      ctaSecondary: slotsAvailable ? 'Criar minha voz agora' : 'Entrar na lista de espera',
      popular: true
    }
  ];

  // Testimonials
  const testimonials = [
    "Voltar a ouvir a voz da minha mãe foi como um abraço.",
    "Ela me chamou de filho de novo. Eu chorei.",
    "É como manter uma parte dela viva aqui comigo."
  ];

  // FAQ items
  const faqItems = [
    {
      question: "O teste grátis tem voz?",
      answer: "O Free não inclui voz contínua. Você tem um demo único de 60s com vozes genéricas para experimentar."
    },
    {
      question: "Qual a diferença entre voz pré-criada e personalizada?",
      answer: "A pré-criada usa timbres humanos genéricos; a personalizada é treinada com gravações reais (apenas no Completo e sujeita a slots)."
    },
    {
      question: "E se os slots acabarem?",
      answer: "Você pode entrar na lista de espera; avisaremos assim que houver vaga."
    },
    {
      question: "Posso mudar de plano depois?",
      answer: "Sim, a qualquer momento."
    }
  ];

  return (
    <>
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
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
              Escolha como manter quem você ama sempre por perto
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              Experimente o Eterna por 7 dias grátis (sem voz contínua). Depois, escolha um plano para desbloquear áudio e presença.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <motion.div
                  key={plan.id}
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
                          Mais popular
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-8 space-y-8">
                      {/* Plan header */}
                      <div className="text-center space-y-4">
                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                          plan.id === 'free' ? 'bg-gradient-to-br from-accent/20 to-accent/10' :
                          plan.id === 'essential' ? 'bg-gradient-to-br from-primary/20 to-primary/10' :
                          'bg-gradient-to-br from-primary/30 to-primary/20'
                        }`}>
                          <IconComponent className={`w-8 h-8 ${
                            plan.id === 'free' ? 'text-accent' : 'text-primary'
                          }`} />
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

                      {/* Free plan demo section */}
                      {plan.id === 'free' && (
                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Demo de voz (60s total)</span>
                            <span className="text-xs text-muted-foreground">
                              {demoProgress}/{mockState.free_voice_demo_seconds_total}s
                            </span>
                          </div>
                          <Progress value={(demoProgress / mockState.free_voice_demo_seconds_total) * 100} className="h-2" />
                          
                          {!demoExhausted ? (
                            <Button 
                              id="free_demo_play"
                              onClick={handleVoiceDemo}
                              variant="outline" 
                              size="sm"
                              className="w-full"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Ouvir demonstração (60s)
                            </Button>
                          ) : (
                            <Button 
                              id="upsell_to_essential"
                              onClick={handleUpsellToEssential}
                              variant="default" 
                              size="sm"
                              className="w-full"
                            >
                              Desbloqueie a voz no Essencial
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Complete plan slot availability */}
                      {plan.id === 'complete' && (
                        <div className={`p-4 rounded-lg border ${
                          slotsAvailable 
                            ? 'bg-green-50 border-green-200 availability-ok' 
                            : 'bg-amber-50 border-amber-200 availability-warn'
                        }`}>
                          <p className={`text-sm font-medium text-center ${
                            slotsAvailable ? 'text-green-700' : 'text-amber-700'
                          }`}>
                            {slotsAvailable 
                              ? "Vagas disponíveis para voz personalizada agora" 
                              : "Todas as vagas ocupadas — entre na lista de espera"
                            }
                          </p>
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
                          id={`pricing_${plan.id === 'free' ? 'free_start' : `subscribe_${plan.id}`}`}
                          onClick={
                            plan.id === 'free' ? handleFreeTrial :
                            plan.id === 'essential' ? handleEssentialSubscribe :
                            handleCompleteSubscribe
                          }
                          variant={plan.popular ? "default" : "outline"}
                          size="lg" 
                          className="w-full h-12 font-semibold"
                        >
                          {plan.cta}
                        </Button>

                        {/* Complete plan secondary CTA */}
                        {plan.id === 'complete' && plan.ctaSecondary && (
                          <Button 
                            id={slotsAvailable ? 'voice_create_now' : 'voice_join_waitlist'}
                            onClick={slotsAvailable ? handleCreateVoice : handleJoinWaitlist}
                            variant="ghost" 
                            size="lg"
                            className="w-full h-12 border border-primary/20 hover:bg-primary/5"
                          >
                            <Volume2 className="w-4 h-4 mr-2" />
                            {plan.ctaSecondary}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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
                Barra comparativa
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 font-semibold text-foreground">Recursos</th>
                      <th className="text-center py-4 px-4 font-semibold text-foreground">Free</th>
                      <th className="text-center py-4 px-4 font-semibold text-foreground">Essencial</th>
                      <th className="text-center py-4 px-4 font-semibold text-foreground">Completo</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Pessoas (clones)</td>
                      <td className="py-3 px-4 text-center">1</td>
                      <td className="py-3 px-4 text-center">1</td>
                      <td className="py-3 px-4 text-center">3</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Minutos de voz/mês</td>
                      <td className="py-3 px-4 text-center">—</td>
                      <td className="py-3 px-4 text-center">30</td>
                      <td className="py-3 px-4 text-center">120</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Interações de chat/mês</td>
                      <td className="py-3 px-4 text-center">20</td>
                      <td className="py-3 px-4 text-center">200</td>
                      <td className="py-3 px-4 text-center">Ilimitado</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Vozes pré-criadas</td>
                      <td className="py-3 px-4 text-center">—</td>
                      <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-primary mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Demo de voz (60s, one-time)</td>
                      <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-primary mx-auto" /></td>
                      <td className="py-3 px-4 text-center">—</td>
                      <td className="py-3 px-4 text-center">—</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Voz personalizada (slots)</td>
                      <td className="py-3 px-4 text-center">—</td>
                      <td className="py-3 px-4 text-center">—</td>
                      <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Exportação de áudio</td>
                      <td className="py-3 px-4 text-center">—</td>
                      <td className="py-3 px-4 text-center">Básica</td>
                      <td className="py-3 px-4 text-center">Completa</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-muted-foreground">Convidados</td>
                      <td className="py-3 px-4 text-center">—</td>
                      <td className="py-3 px-4 text-center">—</td>
                      <td className="py-3 px-4 text-center">Até 3</td>
                    </tr>
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
              {testimonials.map((testimonial, index) => (
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
              FAQ rápido
            </h3>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
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

      {/* Waitlist Modal */}
      <Dialog open={showWaitlistModal} onOpenChange={setShowWaitlistModal}>
        <DialogContent id="waitlist_modal" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Entrar na lista de espera</DialogTitle>
            <DialogDescription>
              Avisaremos você por email assim que uma vaga de voz personalizada for liberada.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                value={waitlistForm.name}
                onChange={(e) => setWaitlistForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={waitlistForm.email}
                onChange={(e) => setWaitlistForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={waitlistForm.consent}
                onCheckedChange={(checked) => setWaitlistForm(prev => ({ ...prev, consent: !!checked }))}
                required
              />
              <Label htmlFor="consent" className="text-sm text-muted-foreground">
                Concordo em receber notificações sobre disponibilidade de vagas
              </Label>
            </div>
            
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowWaitlistModal(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                id="waitlist_submit"
                disabled={!waitlistForm.name || !waitlistForm.email || !waitlistForm.consent}
              >
                Entrar na lista
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};