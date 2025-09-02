import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Zap, Shield, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { creditService, type EternaPlan, type CreditPack } from '@/services/creditService';
interface NewPricingSectionProps {
  onTryFree?: () => void;
  onUpgrade?: (planCode: string) => void;
}
export function NewPricingSection({
  onTryFree,
  onUpgrade
}: NewPricingSectionProps) {
  const {
    currentLanguage
  } = useLanguage();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<EternaPlan[]>([]);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const currency = creditService.getCurrencyForLocale(currentLanguage);
  const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : currentLanguage === 'es' ? 'es-ES' : 'en-US';
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [plansData, packsData] = await Promise.all([creditService.getPlans(), creditService.getCreditPacks()]);
        setPlans(plansData);
        setPacks(packsData);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
        toast({
          title: t('errors.generic'),
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const t = (key: string, params?: Record<string, any>) => {
    // Simple translation function - in a real app, use react-i18next or similar
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'pricing.title': 'Choose how to keep your loved ones always close',
        'pricing.subtitle': 'Only pay for what you use. Simple, transparent credits.',
        'pricing.plans': 'Plans',
        'pricing.packs': 'Credit Packs',
        'pricing.selectPlan': 'Choose {plan}',
        'pricing.selectPack': 'Buy {pack}',
        'pricing.bestValue': 'Best value',
        'pricing.includedCredits': '{credits} credits/month',
        'pricing.voiceSlots': '{count} voice slot(s)',
        'pricing.rollover': '{pct}% rollover',
        'checkout.cta': 'Continue to secure checkout',
        'errors.generic': 'Something went wrong. Please try again.',
        'pricing.tryFree': 'Start free trial',
        'pricing.viewDetails': 'View full pricing',
        'pricing.howItWorks': 'How credits work'
      },
      'pt-BR': {
        'pricing.title': 'Escolha como manter quem você ama sempre por perto',
        'pricing.subtitle': 'Pague apenas pelo uso. Créditos simples e transparentes.',
        'pricing.plans': 'Planos',
        'pricing.packs': 'Pacotes de Créditos',
        'pricing.selectPlan': 'Escolher {plan}',
        'pricing.selectPack': 'Comprar {pack}',
        'pricing.bestValue': 'Melhor oferta',
        'pricing.includedCredits': '{credits} créditos/mês',
        'pricing.voiceSlots': '{count} vaga(s) de voz',
        'pricing.rollover': 'Rollover de {pct}%',
        'checkout.cta': 'Ir para o checkout seguro',
        'errors.generic': 'Algo deu errado. Tente novamente.',
        'pricing.tryFree': 'Começar teste grátis',
        'pricing.viewDetails': 'Ver preços completos',
        'pricing.howItWorks': 'Como os créditos funcionam'
      },
      'es': {
        'pricing.title': 'Elige cómo mantener a tus seres queridos siempre cerca',
        'pricing.subtitle': 'Paga solo por lo que usas. Créditos simples y transparentes.',
        'pricing.plans': 'Planes',
        'pricing.packs': 'Paquetes de Créditos',
        'pricing.selectPlan': 'Elegir {plan}',
        'pricing.selectPack': 'Comprar {pack}',
        'pricing.bestValue': 'Mejor valor',
        'pricing.includedCredits': '{credits} créditos/mes',
        'pricing.voiceSlots': '{count} espacio(s) de voz',
        'pricing.rollover': '{pct}% de rollover',
        'checkout.cta': 'Continuar al checkout seguro',
        'errors.generic': 'Algo salió mal. Inténtalo de nuevo.',
        'pricing.tryFree': 'Comenzar prueba gratis',
        'pricing.viewDetails': 'Ver precios completos',
        'pricing.howItWorks': 'Cómo funcionan los créditos'
      }
    };
    let text = translations[currentLanguage]?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value));
      });
    }
    return text;
  };
  const handlePlanSelect = async (plan: EternaPlan) => {
    if (plan.code === 'free') {
      onTryFree?.();
      return;
    }
    if (!user) {
      navigate('/auth?plan=' + plan.code);
      return;
    }
    onUpgrade?.(plan.code);
  };
  const handleViewFullPricing = () => {
    navigate('/pricing');
  };
  const formatPrice = (plan: EternaPlan) => {
    const price = currency === 'BRL' ? plan.monthly_price_brl : plan.monthly_price_usd;
    return creditService.formatCurrency(price, currency, locale);
  };
  if (loading) {
    return <section className="py-16 bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-muted rounded-lg"></div>)}
            </div>
          </div>
        </div>
      </section>;
  }
  return <section id="pricing" className="py-16 bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8
      }} className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            {t('pricing.title')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        {/* Main CTA Buttons - Maurice & Nora style */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto mb-16"
        >
          <Button 
            onClick={onTryFree}
            size="lg"
            className="group px-8 py-6 text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Começar Grátis ✨
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            onClick={handleViewFullPricing}
            size="lg"
            variant="outline"
            className="group px-8 py-6 text-lg border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
          >
            Ver Planos Completos ✨
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Compact Plans Preview - Single Line */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {plans.map((plan, index) => {
            const isRecommended = plan.code === 'family';
            return (
              <motion.div 
                key={plan.code}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative ${isRecommended ? 'scale-105' : ''}`}
              >
                {isRecommended && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-primary text-primary-foreground">
                    {t('pricing.bestValue')}
                  </Badge>
                )}
                <Card className={`h-full transition-all duration-300 border border-border/50 hover:border-primary/30 hover:shadow-md ${isRecommended ? 'border-primary shadow-md' : ''}`}>
                  <CardHeader className="text-center pb-3">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                      index === 0 ? 'bg-gradient-to-br from-accent/20 to-accent/10' : 
                      index === 1 ? 'bg-gradient-to-br from-primary/20 to-primary/10' : 
                      'bg-gradient-to-br from-primary/30 to-primary/20'
                    }`}>
                      {index === 0 && <Zap className="w-6 h-6 text-accent" />}
                      {index === 1 && <Shield className="w-6 h-6 text-primary" />}
                      {index === 2 && <CreditCard className="w-6 h-6 text-primary" />}
                    </div>
                    <CardTitle className="text-lg">
                      {plan.name[currentLanguage] || plan.name.en}
                    </CardTitle>
                    <div className="text-xl sm:text-2xl font-bold">
                      {plan.code === 'free' ? 'Grátis' : formatPrice(plan)}
                      {plan.code !== 'free' && <span className="text-xs font-normal text-muted-foreground block">/mês</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="text-xs text-center space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-3 w-3 text-primary" />
                        <span>
                          {plan.code === 'free' 
                            ? `${plan.monthly_credits.toLocaleString()} únicos`
                            : `${plan.monthly_credits.toLocaleString()}/mês`
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Shield className="h-3 w-3 text-primary" />
                        <span>{plan.limits.voice_slots} voz{plan.limits.voice_slots > 1 ? 'es' : ''}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>;
}