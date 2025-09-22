import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutForm } from '@/components/payments/CheckoutForm';
import { StripeProvider } from '@/components/StripeProvider';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { paymentsService } from '@/services/paymentsService';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const planId = searchParams.get('plan') || 'premium';
  const plan = paymentsService.getPlan(planId);

  useEffect(() => {
    if (!user) {
      const currentUrl = `/payment${window.location.search}`;
      navigate(`/auth?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (!plan) {
      toast({
        title: "Plan not found",
        description: "The selected plan does not exist",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    createPaymentIntent();
  }, [user, planId, plan]);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planId,
          mode: 'setup'
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      if (data.client_secret) {
        setClientSecret(data.client_secret);
      } else if (data.url) {
        // Fallback to redirect if no client secret
        window.location.href = data.url;
        return;
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Erro",
        description: "Não foi possível inicializar o pagamento",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate('/payment/success?plan=' + planId);
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!user) {
    return null;
  }

  if (!plan) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Preparando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Pagamento Seguro</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Plano Selecionado</span>
              </div>
              <div className="w-12 h-px bg-primary"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-sm font-medium text-primary">Pagamento</span>
              </div>
              <div className="w-12 h-px bg-muted"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="text-sm text-muted-foreground">Confirmação</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          {clientSecret ? (
            <StripeProvider clientSecret={clientSecret}>
              <CheckoutForm
                planId={planId}
                planName={plan.name}
                planPrice={`US$ ${plan.monthlyPriceUSD.toFixed(2)}/mês`}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </StripeProvider>
          ) : (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando opções de pagamento...</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Features Reminder */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 mt-12"
        >
          <h3 className="font-semibold text-center mb-4">O que você terá com o plano {plan.name}:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};