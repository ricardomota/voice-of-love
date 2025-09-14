import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CreditCounter } from '@/components/ui/credit-counter';
import { creditService, type CreditPack } from '@/services/creditService';

export function EternaPricingPage() {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currency = creditService.getCurrencyForLocale(currentLanguage);
  const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : currentLanguage === 'es' ? 'es-ES' : 'en-US';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const packsData = await creditService.getCreditPacks();
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
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'pricing.title': 'Credit Pricing',
        'pricing.subtitle': 'Pay only for what you use. Simple, transparent credits with monthly and yearly options.',
        'pricing.onetime': 'One-time Purchase',
        'pricing.monthly': 'Monthly Subscription',
        'pricing.yearly': 'Yearly Subscription',
        'pricing.yearlyDiscount': 'Save 20% annually',
        'pricing.selectPack': 'Buy {pack}',
        'pricing.bestValue': 'Best value',
        'pricing.mostPopular': 'Most popular',
        'pricing.creditUnit': 'credits',
        'pricing.perMonth': '/month',
        'pricing.perYear': '/year',
        'pricing.billedMonthly': 'Billed monthly',
        'pricing.billedYearly': 'Billed yearly (save 20%)',
        'errors.generic': 'Something went wrong. Please try again.'
      },
      'pt-BR': {
        'pricing.title': 'Preços de Créditos',
        'pricing.subtitle': 'Pague apenas pelo uso. Créditos simples e transparentes com opções mensais e anuais.',
        'pricing.onetime': 'Compra Única',
        'pricing.monthly': 'Assinatura Mensal',
        'pricing.yearly': 'Assinatura Anual',
        'pricing.yearlyDiscount': 'Economize 20% anualmente',
        'pricing.selectPack': 'Comprar {pack}',
        'pricing.bestValue': 'Melhor oferta',
        'pricing.mostPopular': 'Mais popular',
        'pricing.creditUnit': 'créditos',
        'pricing.perMonth': '/mês',
        'pricing.perYear': '/ano',
        'pricing.billedMonthly': 'Cobrança mensal',
        'pricing.billedYearly': 'Cobrança anual (economize 20%)',
        'errors.generic': 'Algo deu errado. Tente novamente.'
      },
      'es': {
        'pricing.title': 'Precios de Créditos',
        'pricing.subtitle': 'Paga solo por lo que usas. Créditos simples y transparentes con opciones mensuales y anuales.',
        'pricing.onetime': 'Compra Única',
        'pricing.monthly': 'Suscripción Mensual',
        'pricing.yearly': 'Suscripción Anual',
        'pricing.yearlyDiscount': 'Ahorra 20% anualmente',
        'pricing.selectPack': 'Comprar {pack}',
        'pricing.bestValue': 'Mejor valor',
        'pricing.mostPopular': 'Más popular',
        'pricing.creditUnit': 'créditos',
        'pricing.perMonth': '/mes',
        'pricing.perYear': '/año',
        'pricing.billedMonthly': 'Facturación mensual',
        'pricing.billedYearly': 'Facturación anual (ahorra 20%)',
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

  const formatPackPrice = (pack: CreditPack) => {
    const price = currency === 'BRL' ? pack.price_brl : pack.price_usd;
    return creditService.formatCurrency(price, currency, locale);
  };

  const getFilteredPacks = (frequency: string) => {
    return packs.filter(pack => pack.billing_frequency === frequency);
  };

  const getMonthlyPacks = () => getFilteredPacks('monthly');
  const getYearlyPacks = () => getFilteredPacks('yearly');
  const getOnetimePacks = () => getFilteredPacks('one-time');

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
        
        {/* Credit Counter for logged in users */}
        {user && (
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CreditCounter showDetails />
          </motion.div>
        )}
      </div>

      {/* Subscription Plans with Monthly/Yearly Toggle */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Subscription Plans</h2>
          <div className="inline-flex items-center p-1 bg-muted rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('pricing.billedMonthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('pricing.billedYearly')}
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                -20%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(billingCycle === 'monthly' ? getMonthlyPacks() : getYearlyPacks()).map((pack, index) => {
            const isRecommended = pack.best_value;
            return (
              <motion.div
                key={pack.sku}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${isRecommended ? 'scale-105' : ''}`}
              >
                {isRecommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    {t('pricing.mostPopular')}
                  </Badge>
                )}
                <Card className={`h-full ${isRecommended ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                      {pack.name[currentLanguage] || pack.name.en}
                    </CardTitle>
                    <div className="text-3xl font-bold">
                      {formatPackPrice(pack)}
                      <span className="text-sm font-normal text-muted-foreground">
                        {billingCycle === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear')}
                      </span>
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {pack.credits.toLocaleString()} {t('pricing.creditUnit')}
                      {billingCycle === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear')}
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-green-600 font-medium">
                        {t('pricing.yearlyDiscount')}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      variant={isRecommended ? 'default' : 'outline'}
                      onClick={() => handlePackSelect(pack)}
                    >
                      {t('pricing.selectPack', { pack: pack.name[currentLanguage] || pack.name.en })}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* One-time Credit Packs */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-center">{t('pricing.onetime')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getOnetimePacks().map((pack, index) => (
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
                    {pack.credits.toLocaleString()} {t('pricing.creditUnit')}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant={pack.best_value ? 'default' : 'outline'}
                    onClick={() => handlePackSelect(pack)}
                  >
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
        <h2 className="text-2xl font-semibold text-center">Como os Créditos Funcionam</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { feature: 'Clone de Voz', cost: '500 créditos', desc: 'Treinamento inicial por clone' },
            { feature: 'Geração TTS', cost: '1 crédito', desc: 'Por 5 segundos de áudio' },
            { feature: 'Chat', cost: '1 crédito', desc: 'Por 750 tokens (~500 palavras)' },
            { feature: 'Transcrição', cost: '2 créditos', desc: 'Por minuto de áudio' }
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