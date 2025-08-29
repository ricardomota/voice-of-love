import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Zap, Shield, CreditCard, ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useCreditBalance } from '@/hooks/useCreditBalance';
import { creditService, type EternaPlan, type CreditPack } from '@/services/creditService';

interface UpgradeSectionProps {
  className?: string;
}

export function UpgradeSection({ className }: UpgradeSectionProps) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { balance, loading: balanceLoading } = useCreditBalance();
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
        setPacks(packsData.slice(0, 3)); // Show only first 3 packs
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
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'upgrade.title': 'Upgrade your plan',
        'upgrade.subtitle': 'Get more credits and unlock premium features',
        'upgrade.currentBalance': 'Current balance: {balance} credits',
        'upgrade.quickTopup': 'Quick top-up',
        'upgrade.viewAllPlans': 'View all plans',
        'upgrade.addCredits': 'Add {credits} credits',
        'pricing.bestValue': 'Best value',
        'pricing.includedCredits': '{credits} credits/month',
        'pricing.voiceSlots': '{count} voice slot(s)',
        'pricing.rollover': '{pct}% rollover',
        'checkout.cta': 'Upgrade now',
        'errors.generic': 'Something went wrong. Please try again.',
        'upgrade.chooseplan': 'Choose plan',
        'upgrade.buycredits': 'Buy credits'
      },
      'pt-BR': {
        'upgrade.title': 'Atualize seu plano',
        'upgrade.subtitle': 'Obtenha mais créditos e desbloqueie recursos premium',
        'upgrade.currentBalance': 'Saldo atual: {balance} créditos',
        'upgrade.quickTopup': 'Recarga rápida',
        'upgrade.viewAllPlans': 'Ver todos os planos',
        'upgrade.addCredits': 'Adicionar {credits} créditos',
        'pricing.bestValue': 'Melhor oferta',
        'pricing.includedCredits': '{credits} créditos/mês',
        'pricing.voiceSlots': '{count} vaga(s) de voz',
        'pricing.rollover': 'Rollover de {pct}%',
        'checkout.cta': 'Atualizar agora',
        'errors.generic': 'Algo deu errado. Tente novamente.',
        'upgrade.chooseplan': 'Escolher plano',
        'upgrade.buycredits': 'Comprar créditos'
      },
      'es': {
        'upgrade.title': 'Actualiza tu plan',
        'upgrade.subtitle': 'Obtén más créditos y desbloquea funciones premium',
        'upgrade.currentBalance': 'Saldo actual: {balance} créditos',
        'upgrade.quickTopup': 'Recarga rápida',
        'upgrade.viewAllPlans': 'Ver todos los planes',
        'upgrade.addCredits': 'Agregar {credits} créditos',
        'pricing.bestValue': 'Mejor valor',
        'pricing.includedCredits': '{credits} créditos/mes',
        'pricing.voiceSlots': '{count} espacio(s) de voz',
        'pricing.rollover': '{pct}% de rollover',
        'checkout.cta': 'Actualizar ahora',
        'errors.generic': 'Algo salió mal. Inténtalo de nuevo.',
        'upgrade.chooseplan': 'Elegir plan',
        'upgrade.buycredits': 'Comprar créditos'
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
      `${window.location.origin}/profile?upgraded=true`,
      `${window.location.origin}/profile`
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
      `${window.location.origin}/profile?credits_added=true`,
      `${window.location.origin}/profile`
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
      <div className={className}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-primary" />
            {t('upgrade.title')}
          </h2>
          <p className="text-muted-foreground">{t('upgrade.subtitle')}</p>
          {!balanceLoading && balance && (
            <p className="text-sm font-medium text-primary">
              {t('upgrade.currentBalance', { balance: balance.credits_available })}
            </p>
          )}
        </div>

        {/* Plans */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('upgrade.chooseplan')}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {plans.filter(plan => plan.code !== 'free').map((plan, index) => {
              const isRecommended = plan.code === 'family';
              return (
                <Card 
                  key={plan.code} 
                  className={`relative ${isRecommended ? 'border-primary ring-2 ring-primary/20' : ''}`}
                >
                  {isRecommended && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                      {t('pricing.bestValue')}
                    </Badge>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {plan.name[currentLanguage] || plan.name.en}
                    </CardTitle>
                    <div className="text-2xl font-bold">
                      {formatPrice(plan)}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-primary" />
                        <span>{t('pricing.includedCredits', { credits: plan.monthly_credits.toLocaleString() })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-primary" />
                        <span>{t('pricing.voiceSlots', { count: plan.limits.voice_slots })}</span>
                      </div>
                      {plan.rollover_pct > 0 && (
                        <div className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary" />
                          <span>{t('pricing.rollover', { pct: plan.rollover_pct })}</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      variant={isRecommended ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePlanSelect(plan)}
                    >
                      {t('checkout.cta')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Credit Packs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('upgrade.quickTopup')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packs.map((pack, index) => (
              <Card key={pack.sku} className={pack.best_value ? 'border-accent ring-1 ring-accent/20' : ''}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    {pack.name[currentLanguage] || pack.name.en}
                  </CardTitle>
                  {pack.best_value && (
                    <Badge variant="secondary" className="w-fit text-xs">
                      {t('pricing.bestValue')}
                    </Badge>
                  )}
                  <div className="text-xl font-bold">
                    {formatPackPrice(pack)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-3">
                    {pack.credits.toLocaleString()} credits
                  </div>
                  <Button 
                    className="w-full gap-2" 
                    variant="outline"
                    size="sm"
                    onClick={() => handlePackSelect(pack)}
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    {t('upgrade.addCredits', { credits: pack.credits.toLocaleString() })}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View all plans CTA */}
        <div className="text-center pt-4">
          <Button variant="ghost" className="gap-2" onClick={() => window.open('/pricing', '_blank')}>
            {t('upgrade.viewAllPlans')}
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}