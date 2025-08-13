import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Check, Star, Zap } from 'lucide-react';
interface PricingSectionProps {
  onTryFree: () => void;
  onSeePricing: () => void;
  onUpgrade?: (planId: string) => void;
}
const getContent = (language: string) => {
  const content = {
    en: {
      title: "Simple, Family-Friendly Pricing",
      subtitle: "Start free, upgrade when you're ready to preserve more voices and memories",
      free: {
        title: "Free",
        price: "R$0",
        period: "/month",
        description: "Perfect for trying Eterna",
        features: ["5 messages per month", "1 minute voice generation", "Last 3 memories stored", "Base voices available", "All languages (EN, PT-BR, ES)"],
        cta: "Start Free",
        popular: false
      },
      paid: {
        title: "Family Plan",
        price: "R$29",
        period: "/month",
        usd: "(~US$5.99)",
        description: "Everything you need to preserve family voices",
        features: ["300 messages per month", "15 minutes voice generation", "Unlimited memories stored", "Personal voice clone*", "Priority support", "All languages (EN, PT-BR, ES)", "Advanced personality settings"],
        cta: "Upgrade Now",
        popular: true
      },
      note: "*Personal voice clone available when capacity allows",
      fullPricing: "See Full Pricing Details"
    },
    'pt-BR': {
      title: "Preços Simples e Amigáveis",
      subtitle: "Comece grátis, faça upgrade quando estiver pronto para preservar mais vozes e memórias",
      free: {
        title: "Gratuito",
        price: "R$0",
        period: "/mês",
        description: "Perfeito para experimentar o Eterna",
        features: ["5 mensagens por mês", "1 minuto de geração de voz", "Últimas 3 memórias armazenadas", "Vozes base disponíveis", "Todos os idiomas (EN, PT-BR, ES)"],
        cta: "Começar Grátis",
        popular: false
      },
      paid: {
        title: "Plano Família",
        price: "R$29",
        period: "/mês",
        usd: "(~US$5.99)",
        description: "Tudo que você precisa para preservar vozes da família",
        features: ["300 mensagens por mês", "15 minutos de geração de voz", "Memórias ilimitadas armazenadas", "Clone de voz pessoal*", "Suporte prioritário", "Todos os idiomas (EN, PT-BR, ES)", "Configurações avançadas de personalidade"],
        cta: "Fazer Upgrade",
        popular: true
      },
      note: "*Clone de voz pessoal disponível quando a capacidade permite",
      fullPricing: "Ver Detalhes Completos de Preços"
    },
    es: {
      title: "Precios Simples y Familiares",
      subtitle: "Comienza gratis, actualiza cuando estés listo para preservar más voces y memorias",
      free: {
        title: "Gratuito",
        price: "R$0",
        period: "/mes",
        description: "Perfecto para probar Eterna",
        features: ["5 mensajes por mes", "1 minuto de generación de voz", "Últimas 3 memorias almacenadas", "Voces base disponibles", "Todos los idiomas (EN, PT-BR, ES)"],
        cta: "Comenzar Gratis",
        popular: false
      },
      paid: {
        title: "Plan Familiar",
        price: "R$29",
        period: "/mes",
        usd: "(~US$5.99)",
        description: "Todo lo que necesitas para preservar voces familiares",
        features: ["300 mensajes por mes", "15 minutos de generación de voz", "Memorias ilimitadas almacenadas", "Clon de voz personal*", "Soporte prioritario", "Todos los idiomas (EN, PT-BR, ES)", "Configuraciones avanzadas de personalidad"],
        cta: "Actualizar Ahora",
        popular: true
      },
      note: "*Clon de voz personal disponible cuando la capacidad lo permite",
      fullPricing: "Ver Detalles Completos de Precios"
    }
  };
  return content[language as keyof typeof content] || content.en;
};
export const PricingSection: React.FC<PricingSectionProps> = ({
  onTryFree,
  onSeePricing,
  onUpgrade
}) => {
  const {
    currentLanguage
  } = useLanguage();
  const content = getContent(currentLanguage);
  const plans = [content.free, content.paid];
  return <section id="pricing" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map((plan, index) => <Card key={index} className={`relative group transition-all duration-300 ${plan.popular ? 'border-2 border-primary shadow-xl scale-105 lg:scale-110' : 'border-2 hover:border-primary/30 hover:shadow-lg'}`}>
              {/* Popular Badge */}
              {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  
                </div>}

              <CardContent className="p-6 sm:p-8 space-y-6">
                
                {/* Header */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                    {plan.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  {'usd' in plan && (plan as any).usd && <p className="text-sm text-muted-foreground">
                      {(plan as any).usd}
                    </p>}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        {feature}
                      </span>
                    </div>)}
                </div>

                {/* CTA */}
                <Button onClick={index === 0 ? onTryFree : onUpgrade ? () => onUpgrade('family') : onSeePricing} variant={plan.popular ? "cta" : "secondary"} size="lg" className="w-full">
                  {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                  {plan.cta}
                </Button>

              </CardContent>
            </Card>)}
        </div>

        {/* Footer Notes */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-xl px-6 py-4 inline-block max-w-2xl">
            {content.note}
          </p>
          
          <Button onClick={onSeePricing} variant="ghost" className="text-primary hover:text-primary/80">
            {content.fullPricing}
          </Button>
        </div>

      </div>
    </section>;
};