import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Heart, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Simplified pricing plans - no complex API calls
const SIMPLE_PLANS = [
  {
    id: 'starter',
    name: { en: 'Starter', 'pt-BR': 'Inicial', es: 'Inicial' },
    price: { monthly: 9, yearly: 90 },
    credits: 1000,
    popular: false,
    features: [
      { en: '1,000 credits/month', 'pt-BR': '1.000 créditos/mês', es: '1,000 créditos/mes' },
      { en: 'Basic voice cloning', 'pt-BR': 'Clonagem básica de voz', es: 'Clonación básica de voz' },
      { en: 'WhatsApp import', 'pt-BR': 'Importação WhatsApp', es: 'Importación WhatsApp' },
      { en: 'Email support', 'pt-BR': 'Suporte por email', es: 'Soporte por email' }
    ]
  },
  {
    id: 'family',
    name: { en: 'Family', 'pt-BR': 'Família', es: 'Familia' },
    price: { monthly: 19, yearly: 190 },
    credits: 3000,
    popular: true,
    features: [
      { en: '3,000 credits/month', 'pt-BR': '3.000 créditos/mês', es: '3,000 créditos/mes' },
      { en: 'Advanced voice cloning', 'pt-BR': 'Clonagem avançada de voz', es: 'Clonación avanzada de voz' },
      { en: 'Multiple loved ones', 'pt-BR': 'Múltiplos entes queridos', es: 'Múltiples seres queridos' },
      { en: 'Priority support', 'pt-BR': 'Suporte prioritário', es: 'Soporte prioritario' },
      { en: 'Audio/video uploads', 'pt-BR': 'Upload de áudio/vídeo', es: 'Subidas audio/video' }
    ]
  },
  {
    id: 'unlimited',
    name: { en: 'Unlimited', 'pt-BR': 'Ilimitado', es: 'Ilimitado' },
    price: { monthly: 39, yearly: 390 },
    credits: 10000,
    popular: false,
    features: [
      { en: '10,000 credits/month', 'pt-BR': '10.000 créditos/mês', es: '10,000 créditos/mes' },
      { en: 'Premium voice quality', 'pt-BR': 'Qualidade de voz premium', es: 'Calidad de voz premium' },
      { en: 'Unlimited conversations', 'pt-BR': 'Conversas ilimitadas', es: 'Conversaciones ilimitadas' },
      { en: '24/7 support', 'pt-BR': 'Suporte 24/7', es: 'Soporte 24/7' },
      { en: 'API access', 'pt-BR': 'Acesso à API', es: 'Acceso API' }
    ]
  }
];

const SimplePricingPage = memo(() => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  const t = (key: string) => {
    const translations = {
      en: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'Choose the perfect plan to keep your loved ones\' memories alive',
        monthly: 'Monthly',
        yearly: 'Yearly',
        yearlyDiscount: 'Save 2 months',
        mostPopular: 'Most Popular',
        getStarted: 'Get Started',
        currentPlan: 'Current Plan',
        tryFree: 'Try Free for 7 Days',
        howCreditsWork: 'How Credits Work',
        creditExplainer: 'Credits are used for AI conversations, voice generation, and processing uploads.',
        features: 'Everything you need to preserve precious memories',
        backToHome: 'Back to Home'
      },
      'pt-BR': {
        title: 'Preços Simples e Transparentes',
        subtitle: 'Escolha o plano perfeito para manter vivas as memórias dos seus entes queridos',
        monthly: 'Mensal',
        yearly: 'Anual',
        yearlyDiscount: 'Economize 2 meses',
        mostPopular: 'Mais Popular',
        getStarted: 'Começar',
        currentPlan: 'Plano Atual',
        tryFree: 'Teste Grátis por 7 Dias',
        howCreditsWork: 'Como os Créditos Funcionam',
        creditExplainer: 'Créditos são usados para conversas com IA, geração de voz e processamento de uploads.',
        features: 'Tudo que você precisa para preservar memórias preciosas',
        backToHome: 'Voltar ao Início'
      }
    };
    return translations[currentLanguage as keyof typeof translations]?.[key as keyof typeof translations['en']] || key;
  };

  const handlePlanSelect = (planId: string) => {
    if (!user) {
      navigate(`/auth?plan=${planId}`);
    } else {
      navigate(`/payment?plan=${planId}`);
    }
  };

  const formatPrice = (price: number) => {
    return currentLanguage === 'pt-BR' 
      ? `R$ ${price}`
      : `$${price}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Eterna</h1>
                <p className="text-sm text-muted-foreground">{t('features')}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              {t('backToHome')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t('subtitle')}
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            className="inline-flex items-center p-1 bg-muted rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all font-medium ${
                billingCycle === 'monthly'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-all font-medium relative ${
                billingCycle === 'yearly'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('yearly')}
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2">
                {t('yearlyDiscount')}
              </Badge>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {SIMPLE_PLANS.map((plan, index) => {
            const price = plan.price[billingCycle];
            const isPopular = plan.popular;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`relative ${isPopular ? 'scale-105' : ''}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                    {t('mostPopular')}
                  </Badge>
                )}
                
                <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                  isPopular ? 'border-primary shadow-lg' : 'hover:border-primary/50'
                }`}>
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold mb-2">
                      {plan.name[currentLanguage as keyof typeof plan.name] || plan.name.en}
                    </CardTitle>
                    
                    <div className="space-y-2">
                      <div className="text-4xl font-bold">
                        {formatPrice(price)}
                        <span className="text-lg font-normal text-muted-foreground">
                          /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                        </span>
                      </div>
                      
                      {billingCycle === 'yearly' && (
                        <div className="text-sm text-green-600 font-medium">
                          {t('yearlyDiscount')}
                        </div>
                      )}
                      
                      <div className="text-muted-foreground">
                        {plan.credits.toLocaleString()} créditos/{billingCycle === 'monthly' ? 'mês' : 'ano'}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            {feature[currentLanguage as keyof typeof feature] || feature.en}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={isPopular ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {!user ? t('tryFree') : t('getStarted')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* How Credits Work */}
        <motion.section 
          className="bg-muted/50 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">{t('howCreditsWork')}</h3>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('creditExplainer')}
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '💬', title: 'Chat', cost: '1 crédito', desc: 'Por conversa de até 500 palavras' },
              { icon: '🎵', title: 'Voz', cost: '5 créditos', desc: 'Por 30 segundos de áudio gerado' },
              { icon: '📁', title: 'Upload', cost: '10 créditos', desc: 'Por arquivo processado' },
              { icon: '🧠', title: 'Treinamento', cost: '100 créditos', desc: 'Por clone de voz criado' }
            ].map((item, index) => (
              <div key={index} className="bg-background rounded-lg p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-primary font-bold">{item.cost}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Trust Section */}
        <motion.section 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-green-500" />
            <span className="text-lg font-semibold">100% Seguro e Privado</span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Seus dados são criptografados e nunca compartilhados. Cancele a qualquer momento.
            Teste grátis por 7 dias, sem compromisso.
          </p>
        </motion.section>
      </div>
    </div>
  );
});

SimplePricingPage.displayName = 'SimplePricingPage';

export default SimplePricingPage;