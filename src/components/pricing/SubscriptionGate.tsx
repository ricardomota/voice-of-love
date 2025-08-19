import React from 'react';
import { useSubscriptionInfo } from '@/hooks/useSubscriptionInfo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Zap, Users, AlertTriangle } from 'lucide-react';
import { SubscriptionService } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionGateProps {
  feature: 'voice-demo' | 'generic-voice' | 'personalized-voice' | 'chat' | 'create-voice';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  feature,
  children,
  fallback
}) => {
  const { 
    subscriptionInfo, 
    loading, 
    canUseVoiceDemo,
    canUseGenericVoice,
    canUsePersonalizedVoice,
    canCreatePersonalizedVoice,
    canUseChat,
    slotsAvailable
  } = useSubscriptionInfo();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subscriptionInfo) {
    return (
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Please log in to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  const handleUpgrade = async (planId: 'essential' | 'complete') => {
    try {
      const { url } = await SubscriptionService.createCheckoutSession(planId);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start upgrade process. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check feature access
  const checkAccess = () => {
    switch (feature) {
      case 'voice-demo':
        return canUseVoiceDemo();
      case 'generic-voice':
        return canUseGenericVoice();
      case 'personalized-voice':
        return canUsePersonalizedVoice();
      case 'create-voice':
        return canCreatePersonalizedVoice();
      case 'chat':
        return canUseChat();
      default:
        return false;
    }
  };

  const hasAccess = checkAccess();

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show appropriate fallback based on feature and plan
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback messages
  const getFallbackContent = () => {
    const { plan } = subscriptionInfo;

    switch (feature) {
      case 'voice-demo':
        return {
          icon: <Zap className="h-4 w-4" />,
          title: "Voice Demo Exhausted",
          description: "You've used your 60-second demo. Upgrade to Essential for continuous voice access.",
          upgrade: 'essential' as const
        };

      case 'generic-voice':
        if (plan === 'free') {
          return {
            icon: <Zap className="h-4 w-4" />,
            title: "Voice Access Required",
            description: "Generic voice generation is available with Essential and Complete plans.",
            upgrade: 'essential' as const
          };
        }
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: "Voice Limit Reached",
          description: "You've used your monthly voice minutes. They'll reset next month or upgrade for more.",
          upgrade: 'complete' as const
        };

      case 'personalized-voice':
        return {
          icon: <Users className="h-4 w-4" />,
          title: "Personalized Voice Access",
          description: "Create personalized voices with the Complete plan.",
          upgrade: 'complete' as const
        };

      case 'create-voice':
        if (!canUsePersonalizedVoice()) {
          return {
            icon: <Users className="h-4 w-4" />,
            title: "Complete Plan Required",
            description: "Personalized voice creation requires the Complete plan.",
            upgrade: 'complete' as const
          };
        }
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: "No Voice Slots Available",
          description: `All ${subscriptionInfo.capacity.plan_capacity.max_slots} personalized voice slots are in use. Join the waitlist to be notified when one becomes available.`,
          upgrade: null
        };

      case 'chat':
        if (plan === 'free') {
          return {
            icon: <Zap className="h-4 w-4" />,
            title: "Chat Limit Reached",
            description: "You've used your 20 free interactions this month. Upgrade for more!",
            upgrade: 'essential' as const
          };
        }
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: "Chat Limit Reached",
          description: "You've used your monthly chat interactions. They'll reset next month.",
          upgrade: 'complete' as const
        };

      default:
        return {
          icon: <Lock className="h-4 w-4" />,
          title: "Upgrade Required",
          description: "This feature requires a paid plan.",
          upgrade: 'essential' as const
        };
    }
  };

  const fallbackContent = getFallbackContent();

  return (
    <Alert>
      {fallbackContent.icon}
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">{fallbackContent.title}</h4>
            <p className="text-sm text-muted-foreground">
              {fallbackContent.description}
            </p>
          </div>

          {/* Current plan badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Current plan:</span>
            <Badge variant="outline" className="capitalize">
              {subscriptionInfo.plan}
            </Badge>
          </div>

          {/* Upgrade button */}
          {fallbackContent.upgrade && (
            <Button 
              onClick={() => handleUpgrade(fallbackContent.upgrade!)}
              size="sm"
              className="w-full"
            >
              Upgrade to {fallbackContent.upgrade === 'essential' ? 'Essential' : 'Complete'}
            </Button>
          )}

          {/* Special case for voice slots */}
          {feature === 'create-voice' && canUsePersonalizedVoice() && !canCreatePersonalizedVoice() && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>Slots in use: {subscriptionInfo.capacity.slots_active}/{subscriptionInfo.capacity.plan_capacity.max_slots}</p>
              <p>Available: {slotsAvailable}</p>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Usage examples:
/*
<SubscriptionGate feature="voice-demo">
  <VoiceDemoPlayer />
</SubscriptionGate>

<SubscriptionGate feature="generic-voice">
  <TTSControls />
</SubscriptionGate>

<SubscriptionGate feature="create-voice">
  <PersonalizeVoiceButton />
</SubscriptionGate>

<SubscriptionGate feature="chat">
  <ChatInterface />
</SubscriptionGate>
*/