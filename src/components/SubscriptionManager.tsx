import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubscriptionInfo } from '@/hooks/useSubscriptionInfo';
import { useLanguage } from '@/hooks/useLanguage';
import { SubscriptionService } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Crown, Users, Zap, ArrowUp, ArrowDown, ExternalLink, Settings } from 'lucide-react';

const getContent = (language: string) => {
  const content = {
    en: {
      title: 'Subscription Management',
      currentPlan: 'Current Plan',
      planTitles: {
        free: 'First Look',
        essential: 'Essential',
        complete: 'Complete'
      },
      planSlogans: {
        free: 'A text memory. A beginning.',
        essential: 'Continuous presence, with human voice.',
        complete: 'To preserve a real presence in the family.'
      },
      active: 'Active',
      notSubscribed: 'Free Plan',
      features: 'Included Features',
      actions: {
        manageSubscription: 'Manage Subscription',
        upgradeToEssential: 'Upgrade to Essential',
        upgradeToComplete: 'Upgrade to Complete',
        downgradeToEssential: 'Downgrade to Essential',
        downgradeToFree: 'Cancel Subscription',
        loading: 'Processing...',
        refresh: 'Refresh Status'
      },
      usage: {
        chatInteractions: 'Chat interactions',
        voiceMinutes: 'Voice minutes',
        people: 'People',
        unlimited: 'Unlimited',
        used: 'used',
        remaining: 'remaining',
        of: 'of'
      },
      renewsOn: 'Renews on',
      endsOn: 'Ends on',
      upgradePrompts: {
        fromFree: 'Ready for voice and advanced features?',
        fromEssential: 'Need unlimited chat and custom voices?'
      },
      downgradeWarning: 'Downgrading will limit your access to features. Are you sure?',
      success: {
        upgrade: 'Subscription upgraded successfully!',
        downgrade: 'Subscription downgraded successfully!',
        refresh: 'Subscription status updated!'
      }
    },
    'pt-BR': {
      title: 'Gerenciamento de Assinatura',
      currentPlan: 'Plano Atual',
      planTitles: {
        free: 'Primeiro Olhar',
        essential: 'Essencial',
        complete: 'Completo'
      },
      planSlogans: {
        free: 'Uma memória em texto. Um começo.',
        essential: 'Presença contínua, com voz humana.',
        complete: 'Para preservar uma presença real em família.'
      },
      active: 'Ativo',
      notSubscribed: 'Plano Gratuito',
      features: 'Recursos Inclusos',
      actions: {
        manageSubscription: 'Gerenciar Assinatura',
        upgradeToEssential: 'Upgrade para Essencial',
        upgradeToComplete: 'Upgrade para Completo',
        downgradeToEssential: 'Downgrade para Essencial',
        downgradeToFree: 'Cancelar Assinatura',
        loading: 'Processando...',
        refresh: 'Atualizar Status'
      },
      usage: {
        chatInteractions: 'Interações de chat',
        voiceMinutes: 'Minutos de voz',
        people: 'Pessoas',
        unlimited: 'Ilimitado',
        used: 'usado',
        remaining: 'restante',
        of: 'de'
      },
      renewsOn: 'Renova em',
      endsOn: 'Termina em',
      upgradePrompts: {
        fromFree: 'Pronto para voz e recursos avançados?',
        fromEssential: 'Precisa de chat ilimitado e vozes personalizadas?'
      },
      downgradeWarning: 'O downgrade limitará seu acesso a recursos. Tem certeza?',
      success: {
        upgrade: 'Assinatura atualizada com sucesso!',
        downgrade: 'Assinatura rebaixada com sucesso!',
        refresh: 'Status da assinatura atualizado!'
      }
    },
    es: {
      title: 'Gestión de Suscripción',
      currentPlan: 'Plan Actual',
      planTitles: {
        free: 'Primera Mirada',
        essential: 'Esencial',
        complete: 'Completo'
      },
      planSlogans: {
        free: 'Una memoria en texto. Un comienzo.',
        essential: 'Presencia continua, con voz humana.',
        complete: 'Para preservar una presencia real en familia.'
      },
      active: 'Activo',
      notSubscribed: 'Plan Gratuito',
      features: 'Características Incluidas',
      actions: {
        manageSubscription: 'Gestionar Suscripción',
        upgradeToEssential: 'Actualizar a Esencial',
        upgradeToComplete: 'Actualizar a Completo',
        downgradeToEssential: 'Bajar a Esencial',
        downgradeToFree: 'Cancelar Suscripción',
        loading: 'Procesando...',
        refresh: 'Actualizar Estado'
      },
      usage: {
        chatInteractions: 'Interacciones de chat',
        voiceMinutes: 'Minutos de voz',
        people: 'Personas',
        unlimited: 'Ilimitado',
        used: 'usado',
        remaining: 'restante',
        of: 'de'
      },
      renewsOn: 'Se renueva el',
      endsOn: 'Termina el',
      upgradePrompts: {
        fromFree: '¿Listo para voz y características avanzadas?',
        fromEssential: '¿Necesitas chat ilimitado y voces personalizadas?'
      },
      downgradeWarning: 'Bajar de plan limitará tu acceso a características. ¿Estás seguro?',
      success: {
        upgrade: '¡Suscripción actualizada exitosamente!',
        downgrade: '¡Suscripción rebajada exitosamente!',
        refresh: '¡Estado de suscripción actualizado!'
      }
    }
  };
  return content[language as keyof typeof content] || content.en;
};

export const SubscriptionManager: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const { toast } = useToast();
  const { 
    subscriptionInfo, 
    loading, 
    error, 
    refresh,
    canUseVoiceDemo,
    canUseChat,
    getRemainingChatInteractions,
    getRemainingVoiceMinutes 
  } = useSubscriptionInfo();

  const [actionLoading, setActionLoading] = React.useState(false);

  const currentPlan = subscriptionInfo?.plan || 'free';
  const entitlements = subscriptionInfo?.entitlements;
  const usage = subscriptionInfo?.usage;

  const handleSubscriptionAction = async (action: 'upgrade-essential' | 'upgrade-complete' | 'manage' | 'downgrade-essential' | 'cancel') => {
    try {
      setActionLoading(true);
      
      if (action === 'manage') {
        const { url } = await SubscriptionService.getCustomerPortalUrl();
        window.open(url, '_blank');
        return;
      }

      if (action === 'upgrade-essential') {
        const { url } = await SubscriptionService.createCheckoutSession('essential');
        window.open(url, '_blank');
        return;
      }

      if (action === 'upgrade-complete') {
        const { url } = await SubscriptionService.createCheckoutSession('complete');
        window.open(url, '_blank');
        return;
      }

      // For downgrades, we redirect to customer portal
      if (action === 'downgrade-essential' || action === 'cancel') {
        const { url } = await SubscriptionService.getCustomerPortalUrl();
        window.open(url, '_blank');
        toast({
          title: content.actions.manageSubscription,
          description: "Use the customer portal to modify or cancel your subscription.",
        });
        return;
      }

    } catch (error) {
      console.error('Subscription action error:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setActionLoading(true);
      await refresh();
      toast({
        title: content.success.refresh,
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Error",
        description: "Failed to refresh subscription status.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading subscription...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error loading subscription</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh} variant="outline" disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {content.actions.refresh}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const planTitle = content.planTitles[currentPlan as keyof typeof content.planTitles] || currentPlan;
  const planSlogan = content.planSlogans[currentPlan as keyof typeof content.planSlogans] || '';
  const isSubscribed = currentPlan !== 'free';

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  currentPlan === 'free' ? 'bg-muted' :
                  currentPlan === 'essential' ? 'bg-primary/10' :
                  'bg-gradient-to-br from-primary/20 to-accent/20'
                }`}>
                  {currentPlan === 'free' && <Zap className="w-5 h-5 text-muted-foreground" />}
                  {currentPlan === 'essential' && <Crown className="w-5 h-5 text-primary" />}
                  {currentPlan === 'complete' && <Users className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{planTitle}</h3>
                  <p className="text-sm text-muted-foreground italic">{planSlogan}</p>
                </div>
              </CardTitle>
            </div>
            <Badge variant={isSubscribed ? "default" : "secondary"}>
              {isSubscribed ? content.active : content.notSubscribed}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Usage Information */}
          {entitlements && usage && (
            <div className="space-y-4">
              <h4 className="font-medium">{content.features}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Chat Interactions */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{content.usage.chatInteractions}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entitlements.chat_limit_monthly === -1 ? (
                      content.usage.unlimited
                    ) : (
                      <>
                        {usage.chat_interactions_used || 0} {content.usage.used} / {entitlements.chat_limit_monthly}
                        <br />
                        <span className="text-primary font-medium">
                          {getRemainingChatInteractions()} {content.usage.remaining}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Voice Minutes */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{content.usage.voiceMinutes}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entitlements.voice_minutes_monthly === 0 ? (
                      'Not available'
                    ) : entitlements.voice_minutes_monthly === -1 ? (
                      content.usage.unlimited
                    ) : (
                      <>
                        {usage.voice_seconds_used ? Math.round(usage.voice_seconds_used / 60) : 0} {content.usage.used} / {entitlements.voice_minutes_monthly}
                        <br />
                        <span className="text-primary font-medium">
                          {getRemainingVoiceMinutes()} {content.usage.remaining}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* People Limit */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{content.usage.people}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentPlan === 'free' ? '1 person' :
                     currentPlan === 'essential' ? '1 person' :
                     'Up to 3 people'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Actions */}
          <div className="space-y-4">
            {/* Upgrade Options */}
            {currentPlan === 'free' && (
              <Alert>
                <ArrowUp className="h-4 w-4" />
                <AlertDescription>
                  {content.upgradePrompts.fromFree}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <Button 
                      onClick={() => handleSubscriptionAction('upgrade-essential')}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <ArrowUp className="mr-2 h-4 w-4" />
                      {content.actions.upgradeToEssential}
                    </Button>
                    <Button 
                      onClick={() => handleSubscriptionAction('upgrade-complete')}
                      disabled={actionLoading}
                      className="w-full"
                    >
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <ArrowUp className="mr-2 h-4 w-4" />
                      {content.actions.upgradeToComplete}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {currentPlan === 'essential' && (
              <Alert>
                <ArrowUp className="h-4 w-4" />
                <AlertDescription>
                  {content.upgradePrompts.fromEssential}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <Button 
                      onClick={() => handleSubscriptionAction('upgrade-complete')}
                      disabled={actionLoading}
                      className="w-full"
                    >
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <ArrowUp className="mr-2 h-4 w-4" />
                      {content.actions.upgradeToComplete}
                    </Button>
                    <Button 
                      onClick={() => handleSubscriptionAction('downgrade-essential')}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <ArrowDown className="mr-2 h-4 w-4" />
                      {content.actions.downgradeToFree}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {currentPlan === 'complete' && (
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Manage your subscription or change your plan.
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <Button 
                      onClick={() => handleSubscriptionAction('downgrade-essential')}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <ArrowDown className="mr-2 h-4 w-4" />
                      {content.actions.downgradeToEssential}
                    </Button>
                    <Button 
                      onClick={() => handleSubscriptionAction('manage')}
                      disabled={actionLoading}
                      className="w-full"
                    >
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {content.actions.manageSubscription}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Management Button for Subscribed Users */}
            {isSubscribed && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => handleSubscriptionAction('manage')}
                  disabled={actionLoading}
                  variant="outline"
                  className="w-full"
                >
                  {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {content.actions.manageSubscription}
                </Button>
              </div>
            )}

            {/* Refresh Button */}
            <Button 
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              className="w-full"
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {content.actions.refresh}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};