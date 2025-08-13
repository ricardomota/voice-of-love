import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/hooks/useLanguage';
import { paymentsService } from '@/services/paymentsService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Crown, Users, Zap } from 'lucide-react';

const getContent = (language: string) => {
  const content = {
    en: {
      title: 'Subscription Management',
      currentPlan: 'Current Plan',
      free: 'Free Plan',
      premium: 'Premium',
      family: 'Family',
      subscribed: 'Active',
      notSubscribed: 'Not subscribed',
      manageSubscription: 'Manage Subscription',
      upgradeToFamily: 'Upgrade to Family',
      upgradeToPremium: 'Upgrade to Premium',
      loading: 'Loading...',
      error: 'Error loading subscription',
      refreshing: 'Refreshing...',
      refresh: 'Refresh Status',
      renewsOn: 'Renews on',
      unlimited: 'Unlimited'
    },
    'pt-BR': {
      title: 'Gerenciamento de Assinatura',
      currentPlan: 'Plano Atual',
      free: 'Plano Gratuito',
      premium: 'Premium',
      family: 'Família',
      subscribed: 'Ativo',
      notSubscribed: 'Não inscrito',
      manageSubscription: 'Gerenciar Assinatura',
      upgradeToFamily: 'Upgrade para Família',
      upgradeToPremium: 'Upgrade para Premium',
      loading: 'Carregando...',
      error: 'Erro ao carregar assinatura',
      refreshing: 'Atualizando...',
      refresh: 'Atualizar Status',
      renewsOn: 'Renova em',
      unlimited: 'Ilimitado'
    },
    es: {
      title: 'Gestión de Suscripción',
      currentPlan: 'Plan Actual',
      free: 'Plan Gratuito',
      premium: 'Premium',
      family: 'Familia',
      subscribed: 'Activo',
      notSubscribed: 'No suscrito',
      manageSubscription: 'Gestionar Suscripción',
      upgradeToFamily: 'Actualizar a Familia',
      upgradeToPremium: 'Actualizar a Premium',
      loading: 'Cargando...',
      error: 'Error al cargar suscripción',
      refreshing: 'Actualizando...',
      refresh: 'Actualizar Estado',
      renewsOn: 'Se renueva el',
      unlimited: 'Ilimitado'
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const SubscriptionManager: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { toast } = useToast();
  const {
    subscribed,
    subscription_tier,
    subscription_end,
    loading,
    error,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  } = useSubscription();

  const [actionLoading, setActionLoading] = React.useState(false);
  const plans = paymentsService.getPlans();

  const handleUpgrade = async (planId: string) => {
    try {
      setActionLoading(true);
      const checkoutUrl = await createCheckout(planId);
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível criar a sessão de checkout",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar sessão de checkout",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setActionLoading(true);
      const portalUrl = await openCustomerPortal();
      if (portalUrl) {
        window.open(portalUrl, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro",
        description: "Erro ao abrir portal do cliente",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const currentPlan = subscription_tier ? 
    plans.find(p => p.id === subscription_tier.toLowerCase()) : 
    plans.find(p => p.id === 'free');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {content.loading}
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{content.error}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkSubscription} variant="outline">
            {content.refresh}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{content.currentPlan}</span>
          <Badge variant={subscribed ? "default" : "secondary"}>
            {subscribed ? content.subscribed : content.notSubscribed}
          </Badge>
        </CardTitle>
        <CardDescription>
          {currentPlan?.name} - {paymentsService.formatPrice(currentPlan?.monthlyPriceUSD || 0, 'USD')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan Features */}
        <div>
          <h4 className="font-medium mb-2">Recursos inclusos:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>
                {currentPlan?.limits.messagesPerMonth === -1 
                  ? content.unlimited 
                  : `${currentPlan?.limits.messagesPerMonth} mensagens`
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <span>{currentPlan?.limits.ttsMinutesPerMonth} min TTS</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>
                {currentPlan?.limits.peopleLimit === -1 
                  ? content.unlimited 
                  : `${currentPlan?.limits.peopleLimit} pessoas`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Subscription End Date */}
        {subscribed && subscription_end && (
          <div className="text-sm text-muted-foreground">
            {content.renewsOn}: {new Date(subscription_end).toLocaleDateString()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {subscribed ? (
            <Button 
              onClick={handleManageSubscription}
              disabled={actionLoading}
              className="w-full"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {content.manageSubscription}
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleUpgrade('premium')}
                disabled={actionLoading}
                variant="outline"
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {content.upgradeToPremium}
              </Button>
              <Button 
                onClick={() => handleUpgrade('family')}
                disabled={actionLoading}
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {content.upgradeToFamily}
              </Button>
            </div>
          )}

          <Button 
            onClick={checkSubscription}
            variant="ghost"
            size="sm"
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {content.refresh}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};