import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { paymentsService } from '@/services/paymentsService';
import { useToast } from '@/hooks/use-toast';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { checkSubscription } = useSubscription();
  const { toast } = useToast();

  const planId = searchParams.get('plan') || 'premium';
  const plan = paymentsService.getPlan(planId);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Refresh subscription status after successful payment
    const refreshSubscription = async () => {
      try {
        await checkSubscription();
        toast({
          title: "Assinatura Ativada!",
          description: `Bem-vindo ao plano ${plan?.name}`,
        });
      } catch (error) {
        console.error('Error refreshing subscription:', error);
      }
    };

    // Small delay to ensure payment is processed
    setTimeout(refreshSubscription, 2000);
  }, [user, checkSubscription, plan]);

  const handleContinue = () => {
    navigate('/');
  };

  if (!user || !plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-2xl font-bold text-foreground">
                Pagamento Realizado!
              </h1>
              <p className="text-muted-foreground">
                Sua assinatura do plano <strong>{plan.name}</strong> foi ativada com sucesso
              </p>
            </motion.div>

            {/* Plan Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Plano {plan.name}</h3>
              </div>
              <p className="text-xl font-bold text-primary">
                US$ {plan.monthlyPriceUSD.toFixed(2)}/mês
              </p>
              <p className="text-sm text-muted-foreground">
                Próxima cobrança em 30 dias
              </p>
            </motion.div>

            {/* Features Highlight */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-left space-y-2"
            >
              <h4 className="font-medium text-center mb-3">Agora você tem acesso a:</h4>
              <div className="grid gap-2">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    + {plan.features.length - 3} recursos adicionais
                  </p>
                )}
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="pt-4"
            >
              <Button
                onClick={handleContinue}
                size="lg"
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                Começar a usar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Support Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-xs text-muted-foreground"
            >
              <p>Precisa de ajuda? Entre em contato com nosso suporte.</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};