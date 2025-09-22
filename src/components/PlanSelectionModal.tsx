import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { PRICING_PLANS } from '@/services/paymentsService';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (planId: string) => void;
  selectedPlan?: string;
}

const getContent = (language: string) => {
  const content = {
    en: {
      selectYourPlan: 'Select Your Plan',
      chooseThePlan: 'Choose the plan that best fits your needs',
      selectPlan: 'Select Plan',
      recommended: 'Recommended',
      freeForever: 'Free Forever',
      perMonth: '/month',
      createAccountWith: 'Create account with',
      confirmSelection: 'Confirm Selection'
    },
    'pt-BR': {
      selectYourPlan: 'Selecione Seu Plano',
      chooseThePlan: 'Escolha o plano que melhor se adequa às suas necessidades',
      selectPlan: 'Selecionar Plano',
      recommended: 'Recomendado',
      freeForever: 'Grátis Para Sempre',
      perMonth: '/mês',
      createAccountWith: 'Criar conta com',
      confirmSelection: 'Confirmar Seleção'
    },
    es: {
      selectYourPlan: 'Selecciona Tu Plan',
      chooseThePlan: 'Elige el plan que mejor se adapte a tus necesidades',
      selectPlan: 'Seleccionar Plan',
      recommended: 'Recomendado',
      freeForever: 'Gratis Para Siempre',
      perMonth: '/mes',
      createAccountWith: 'Crear cuenta con',
      confirmSelection: 'Confirmar Selección'
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onPlanSelect,
  selectedPlan
}) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);

  const formatPrice = (plan: any) => {
    if (plan.id === 'free') {
      return content.freeForever;
    }
    
    const price = currentLanguage === 'pt-BR' ? plan.monthlyPriceBRL : plan.monthlyPriceUSD;
    const currency = currentLanguage === 'pt-BR' ? 'BRL' : 'USD';
    
    return new Intl.NumberFormat(currentLanguage === 'pt-BR' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(price) + content.perMonth;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {content.selectYourPlan}
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            {content.chooseThePlan}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.id === 'complete' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {content.recommended}
                  </span>
                </div>
              )}
              
              <Card 
                className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-primary border-primary' 
                    : plan.id === 'complete' 
                    ? 'border-primary/50' 
                    : ''
                }`}
                onClick={() => onPlanSelect(plan.id)}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold">
                    {formatPrice(plan)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onPlanSelect(plan.id)}
                  >
                    {selectedPlan === plan.id ? content.confirmSelection : content.selectPlan}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};