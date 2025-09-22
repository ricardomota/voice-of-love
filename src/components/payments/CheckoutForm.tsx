import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  planId: string;
  planName: string;
  planPrice: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  planId,
  planName,
  planPrice,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?plan=${planId}`,
      },
      redirect: 'if_required'
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || 'An error occurred');
        toast({
          title: "Erro no pagamento",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setMessage("Um erro inesperado ocorreu.");
        toast({
          title: "Erro",
          description: "Um erro inesperado ocorreu",
          variant: "destructive",
        });
      }
    } else {
      // Payment succeeded
      toast({
        title: "Pagamento realizado!",
        description: `Assinatura ${planName} ativada com sucesso`,
      });
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Plan Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Assinatura {planName}
            </h3>
            <p className="text-2xl font-bold text-primary">
              {planPrice}
            </p>
            <p className="text-sm text-muted-foreground">
              Cobrança mensal recorrente
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h4 className="font-medium">Informações de Pagamento</h4>
                <div className="flex items-center gap-1 ml-auto">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Apple Pay disponível</span>
                </div>
              </div>
              
              <PaymentElement 
                options={{
                  layout: "tabs"
                }}
              />
            </div>

            {message && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{message}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !stripe || !elements}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? 'Processando...' : `Assinar ${planName}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>🔒 Pagamento seguro processado pela Stripe</p>
        <p>Aceita cartões de crédito, débito, Apple Pay, Google Pay e mais</p>
      </div>
    </div>
  );
};