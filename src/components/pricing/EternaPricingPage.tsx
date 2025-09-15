import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CreditCounter } from '@/components/ui/credit-counter';
import { creditService, type EternaPlan, type CreditPack } from '@/services/creditService';
import { Check, Zap, Users, Heart, ArrowRight, Plus, TrendingUp, Shield, Clock } from 'lucide-react';

export function EternaPricingPage() {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
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
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'pricing.title': 'Simple, transparent pricing',
        'pricing.subtitle': 'Choose the plan that fits your needs perfectly.',
        'pricing.freeTrial': 'Get started',
        'pricing.choosePlan': 'Choose {plan}',
        'pricing.popular': 'Most popular',
        'pricing.forever': 'Forever',
        'pricing.perMonth': '/month',
        'pricing.features': 'What\'s included:',
        'pricing.creditPacks': 'Need more credits?',
        'pricing.creditPacksDesc': 'Top up your account instantly with flexible credit packs',
        'pricing.creditPacksSubDesc': 'Perfect for scaling during busy periods or trying premium features',
        'pricing.buyCreditPack': 'Get {credits} credits',
        'pricing.creditValue': '{value} per credit',
        'pricing.instantTopup': 'Instant top-up',
        'pricing.noExpiry': 'Never expires',
        'pricing.flexibleUse': 'Use anywhere',
        'pricing.creditsPerMonth': '{credits} credits/month',
        'pricing.voiceSlots': '{slots} voice slot{plural}',
        'pricing.peopleLimit': 'Up to {count} person{plural}',
        'pricing.creditRollover': '{percentage}% credit rollover',
        'pricing.credits': 'credits',
        'errors.generic': 'Something went wrong. Please try again.'
      },
      'pt-BR': {
        'pricing.title': 'Preços simples e transparentes',
        'pricing.subtitle': 'Escolha o plano que atende perfeitamente suas necessidades.',
        'pricing.freeTrial': 'Começar agora',
        'pricing.choosePlan': 'Escolher {plan}',
        'pricing.popular': 'Mais popular',
        'pricing.forever': 'Para sempre',
        'pricing.perMonth': '/mês',
        'pricing.features': 'O que está incluído:',
        'pricing.creditPacks': 'Precisa de mais créditos?',
        'pricing.creditPacksDesc': 'Recarregue sua conta instantaneamente com pacotes flexíveis',
        'pricing.creditPacksSubDesc': 'Perfeito para escalar durante períodos intensos ou testar recursos premium',
        'pricing.buyCreditPack': 'Obter {credits} créditos',
        'pricing.creditValue': '{value} por crédito',
        'pricing.instantTopup': 'Recarga instantânea',
        'pricing.noExpiry': 'Nunca expira',
        'pricing.flexibleUse': 'Use em qualquer lugar',
        'pricing.creditsPerMonth': '{credits} créditos/mês',
        'pricing.voiceSlots': '{slots} slot{plural} de voz',
        'pricing.peopleLimit': 'Até {count} pessoa{plural}',
        'pricing.creditRollover': '{percentage}% rollover de créditos',
        'pricing.credits': 'créditos',
        'errors.generic': 'Algo deu errado. Tente novamente.'
      },
      'es': {
        'pricing.title': 'Precios simples y transparentes',
        'pricing.subtitle': 'Elige el plan que se adapte perfectamente a tus necesidades.',
        'pricing.freeTrial': 'Empezar ahora',
        'pricing.choosePlan': 'Elegir {plan}',
        'pricing.popular': 'Más popular',
        'pricing.forever': 'Para siempre',
        'pricing.perMonth': '/mes',
        'pricing.features': 'Qué incluye:',
        'pricing.creditPacks': '¿Necesitas más créditos?',
        'pricing.creditPacksDesc': 'Recarga tu cuenta al instante con paquetes flexibles',
        'pricing.creditPacksSubDesc': 'Perfecto para escalar durante períodos ocupados o probar funciones premium',
        'pricing.buyCreditPack': 'Obtener {credits} créditos',
        'pricing.creditValue': '{value} por crédito',
        'pricing.instantTopup': 'Recarga instantánea',
        'pricing.noExpiry': 'Nunca caduca',
        'pricing.flexibleUse': 'Usa en cualquier lugar',
        'pricing.creditsPerMonth': '{credits} créditos/mes',
        'pricing.voiceSlots': '{slots} slot{plural} de voz',
        'pricing.peopleLimit': 'Hasta {count} persona{plural}',
        'pricing.creditRollover': '{percentage}% rollover de créditos',
        'pricing.credits': 'créditos',
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
      navigate('/auth?plan=' + plan.code);
      return;
    }

    try {
      const result = await creditService.createCheckoutSession(
        'plan',
        plan.code,
        `${window.location.origin}/payment/success`,
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
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: t('errors.generic'),
        variant: 'destructive'
      });
    }
  };

  const handlePackSelect = async (pack: CreditPack) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const result = await creditService.createCheckoutSession(
        'pack',
        pack.sku,
        `${window.location.origin}/payment/success`,
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
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: t('errors.generic'),
        variant: 'destructive'
      });
    }
  };

  const formatPlanPrice = (plan: EternaPlan) => {
    return creditService.formatCurrency(plan.monthly_price_usd, 'USD', 'en-US');
  };

  const formatPackPrice = (pack: CreditPack) => {
    return creditService.formatCurrency(pack.price_usd, 'USD', 'en-US');
  };

  const getOnetimePacks = () => packs.filter(pack => pack.billing_frequency === 'one-time');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-12">
            <div className="text-center space-y-4">
              <div className="h-12 bg-muted rounded w-2/3 mx-auto"></div>
              <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('pricing.subtitle')}
          </p>
          
          {/* Credit Counter for logged in users */}
          {user && (
            <div className="flex justify-center mt-8">
              <CreditCounter showDetails />
            </div>
          )}
        </motion.div>

        {/* Main Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.filter(plan => plan.code !== 'free').map((plan, index) => {
            const isPopular = plan.code === 'family';
            
            return (
              <motion.div
                key={plan.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${isPopular ? 'md:scale-105 z-10' : ''}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 bg-primary text-primary-foreground shadow-lg">
                    {t('pricing.popular')}
                  </Badge>
                )}
                
                <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                  isPopular ? 'border-primary shadow-lg ring-1 ring-primary/20' : 
                  'border-border hover:border-primary/30'
                }`}>
                  <CardHeader className="text-center space-y-4 p-6">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                      index === 0 ? 'bg-accent/50 dark:bg-accent/60' :
                      index === 1 ? 'bg-primary/50 dark:bg-primary/60' :
                      'bg-secondary/50 dark:bg-secondary/60'
                    }`}>
                      {index === 0 && <Heart className="w-6 h-6 text-foreground" />}
                      {index === 1 && <Zap className="w-6 h-6 text-foreground" />}
                      {index === 2 && <Users className="w-6 h-6 text-foreground" />}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {plan.name[currentLanguage] || plan.name.en}
                      </h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-foreground">
                          {formatPlanPrice(plan)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t('pricing.perMonth')}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6 space-y-6">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {t('pricing.creditsPerMonth', { 
                            credits: plan.monthly_credits.toLocaleString() 
                          })}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {t('pricing.voiceSlots', { 
                            slots: plan.limits.voice_slots,
                            plural: plan.limits.voice_slots > 1 ? 's' : ''
                          })}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {t('pricing.peopleLimit', { 
                            count: plan.limits.people_count,
                            plural: plan.limits.people_count > 1 ? 's' : ''
                          })}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {t('pricing.creditRollover', { 
                            percentage: plan.limits.monthly_rollover 
                          })}
                        </span>
                      </li>
                    </ul>
                    
                    <Button 
                      className="w-full h-12 px-6 py-3 text-sm font-medium whitespace-nowrap overflow-hidden"
                      variant={isPopular ? 'default' : 'outline'}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <span className="truncate">
                        {t('pricing.choosePlan', { plan: plan.name[currentLanguage] || plan.name.en })}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Credit Packs Section */}
        {getOnetimePacks().length > 0 && (
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                  <Plus className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Flexible Credits</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('pricing.creditPacks')}
                </h2>
                <p className="text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
                  {t('pricing.creditPacksDesc')}
                </p>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  {t('pricing.creditPacksSubDesc')}
                </p>
              </div>

              {/* Benefits Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{t('pricing.instantTopup')}</div>
                    <div className="text-xs text-muted-foreground">Available immediately</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{t('pricing.noExpiry')}</div>
                    <div className="text-xs text-muted-foreground">Use anytime</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{t('pricing.flexibleUse')}</div>
                    <div className="text-xs text-muted-foreground">All features</div>
                  </div>
                </div>
              </div>
              
              {/* Credit Packs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {getOnetimePacks().map((pack, index) => {
                  const creditValue = (pack.price_usd / pack.credits).toFixed(3);
                  const isPopular = pack.best_value;
                  
                  return (
                    <motion.div
                      key={pack.sku}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="relative"
                    >
                      {isPopular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg text-xs px-2 py-1">
                            Best Value
                          </Badge>
                        </div>
                      )}
                      
                      <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                        isPopular ? 
                          'border-primary/50 shadow-md bg-gradient-to-br from-background to-primary/5 ring-1 ring-primary/20' : 
                          'border-border hover:border-primary/30 bg-gradient-to-br from-background to-muted/30'
                      }`}>
                        <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                          <div>
                            {/* Icon */}
                            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                              isPopular ? 'bg-primary/20' : 'bg-muted/50'
                            }`}>
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                isPopular ? 'bg-primary/30' : 'bg-muted'
                              }`}>
                                <span className={`text-lg font-bold ${
                                  isPopular ? 'text-primary' : 'text-foreground/70'
                                }`}>
                                  {pack.credits.toString().charAt(0)}
                                </span>
                              </div>
                            </div>
                            
                            {/* Credits */}
                            <div className="mb-4">
                              <div className="text-2xl font-bold text-foreground mb-1">
                                {pack.credits.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {t('pricing.credits')}
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="mb-4">
                              <div className="text-3xl font-bold text-foreground mb-1">
                                {formatPackPrice(pack)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ${creditValue} per credit
                              </div>
                            </div>
                          </div>
                          
                          {/* Button */}
                          <Button 
                            className={`w-full h-11 text-sm font-medium group ${
                              isPopular ? 'bg-primary hover:bg-primary/90' : ''
                            }`}
                            variant={isPopular ? 'default' : 'outline'}
                            onClick={() => handlePackSelect(pack)}
                          >
                            <span className="flex items-center gap-2">
                              {t('pricing.buyCreditPack', { credits: pack.credits.toLocaleString() })}
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Bottom CTA */}
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  All credit purchases are one-time payments with no recurring charges. Credits never expire.
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}