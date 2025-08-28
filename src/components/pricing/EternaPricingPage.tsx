import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Zap, Shield, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { creditService, type EternaPlan, type CreditPack } from '@/services/creditService';

export function EternaPricingPage() {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<EternaPlan[]>([]);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);

  const currency = creditService.getCurrencyForLocale(currentLanguage);
  const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : currentLanguage === 'es' ? 'es-ES' : 'en-US';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [plansData, packsData] = await Promise.all([
          creditService.getPlans(),
          creditService.getCreditPacks()
        ]);
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
        'pricing.title': 'Pricing & Credits',
        'pricing.subtitle': 'Only pay for what you use. Simple, transparent credits.',
        'pricing.plans': 'Plans',
        'pricing.packs': 'Credit Packs',
        'pricing.selectPlan': 'Choose {plan}',
        'pricing.selectPack': 'Buy {pack}',
        'pricing.bestValue': 'Best value',
        'pricing.includedCredits': '{credits} credits/month',
        'pricing.voiceSlots': '{count} voice slots',
        'pricing.rollover': '{pct}% rollover',
        'checkout.cta': 'Continue to secure checkout',
        'errors.generic': 'Something went wrong. Please try again.'
      },
      'pt-BR': {
        'pricing.title': 'Preços & Créditos',
        'pricing.subtitle': 'Pague apenas pelo uso. Créditos simples e transparentes.',
        'pricing.plans': 'Planos',
        'pricing.packs': 'Pacotes de Créditos',
        'pricing.selectPlan': 'Escolher {plan}',
        'pricing.selectPack': 'Comprar {pack}',
        'pricing.bestValue': 'Melhor oferta',
        'pricing.includedCredits': '{credits} créditos/mês',
        'pricing.voiceSlots': '{count} vagas de voz',
        'pricing.rollover': 'Rollover de {pct}%',
        'checkout.cta': 'Ir para o checkout seguro',
        'errors.generic': 'Algo deu errado. Tente novamente.'
      },
      'es': {
        'pricing.title': 'Precios y Créditos',
        'pricing.subtitle': 'Paga solo por lo que usas. Créditos simples y transparentes.',
        'pricing.plans': 'Planes',
        'pricing.packs': 'Paquetes de Créditos',
        'pricing.selectPlan': 'Elegir {plan}',
        'pricing.selectPack': 'Comprar {pack}',
        'pricing.bestValue': 'Mejor valor',
        'pricing.includedCredits': '{credits} créditos/mes',
        'pricing.voiceSlots': '{count} espacios de voz',
        'pricing.rollover': '{pct}% de rollover',
        'checkout.cta': 'Continuar al checkout seguro',
        'errors.generic': 'Algo salió mal. Inténtalo de nuevo.'
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
    if (!user) {
      toast({
        title: 'Please sign in to continue',
        variant: 'destructive'
      });
      return;
    }

    const result = await creditService.createCheckoutSession(
      'plan',
      plan.code,
      `${window.location.origin}/checkout/success`,
      `${window.location.origin}/pricing`
    );

    if (result.error) {
      toast({
        title: result.error,
        variant: 'destructive'
      });
      return;
    }

    if (result.url) {
      window.open(result.url, '_blank');
    }
  };

  const handlePackSelect = async (pack: CreditPack) => {
    if (!user) {
      toast({
        title: 'Please sign in to continue',
        variant: 'destructive'
      });
      return;
    }

    const result = await creditService.createCheckoutSession(
      'pack',
      pack.sku,
      `${window.location.origin}/checkout/success`,
      `${window.location.origin}/pricing`
    );

    if (result.error) {
      toast({
        title: result.error,
        variant: 'destructive'
      });
      return;
    }

    if (result.url) {
      window.open(result.url, '_blank');
    }
  };

  const formatPrice = (plan: EternaPlan) => {
    const price = currency === 'BRL' ? plan.monthly_price_brl : plan.monthly_price_usd;
    return creditService.formatCurrency(price, currency, locale);
  };

  const formatPackPrice = (pack: CreditPack) => {
    const price = currency === 'BRL' ? pack.price_brl : pack.price_usd;
    return creditService.formatCurrency(price, currency, locale);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('pricing.title')}
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t('pricing.subtitle')}
        </motion.p>
      </div>

      {/* Plans Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-center">{t('pricing.plans')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isRecommended = plan.code === 'family';
            return (
              <motion.div
                key={plan.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${isRecommended ? 'scale-105' : ''}`}
              >
                {isRecommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    {t('pricing.bestValue')}
                  </Badge>
                )}
                <Card className={`h-full ${isRecommended ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                      {plan.name[currentLanguage] || plan.name.en}
                    </CardTitle>
                    <div className="text-3xl font-bold">
                      {formatPrice(plan)}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {t('pricing.includedCredits', { credits: plan.monthly_credits.toLocaleString() })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {t('pricing.voiceSlots', { count: plan.limits.voice_slots })}
                        </span>
                      </div>
                      {plan.rollover_pct > 0 && (
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {t('pricing.rollover', { pct: plan.rollover_pct })}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      variant={isRecommended ? 'default' : 'outline'}
                      onClick={() => handlePlanSelect(plan)}
                      disabled={plan.code === 'free'}
                    >
                      {plan.code === 'free' ? 'Current Plan' : t('pricing.selectPlan', { plan: plan.name[currentLanguage] || plan.name.en })}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Credit Packs Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-center">{t('pricing.packs')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packs.map((pack, index) => (
            <motion.div
              key={pack.sku}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {pack.best_value && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                  {t('pricing.bestValue')}
                </Badge>
              )}
              <Card className={`h-full ${pack.best_value ? 'border-accent' : ''}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">
                    {pack.name[currentLanguage] || pack.name.en}
                  </CardTitle>
                  <div className="text-2xl font-bold">
                    {formatPackPrice(pack)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pack.credits.toLocaleString()} credits
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant={pack.best_value ? 'default' : 'outline'}
                    onClick={() => handlePackSelect(pack)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t('pricing.selectPack', { pack: pack.name[currentLanguage] || pack.name.en })}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How Credits Work Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">How Credits Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { feature: 'Voice Clone', cost: '800 credits', desc: 'Initial training per clone' },
            { feature: 'TTS Generation', cost: '1 credit', desc: 'Per 5 seconds of audio' },
            { feature: 'Chat', cost: '1 credit', desc: 'Per 750 tokens (~500 words)' },
            { feature: 'Transcription', cost: '2 credits', desc: 'Per minute of audio' }
          ].map((item, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="font-medium">{item.feature}</div>
                <div className="text-2xl font-bold text-primary my-2">{item.cost}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}