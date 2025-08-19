// Step 8: Panic Pause component for instant comfort control
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { analyticsIntegrations } from '@/lib/integrations';

interface PanicPauseProps {
  onStateChange?: (isPaused: boolean) => void;
}

export const PanicPause: React.FC<PanicPauseProps> = ({ onStateChange }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load panic pause state on mount
  useEffect(() => {
    loadPanicPauseState();
  }, []);

  const loadPanicPauseState = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('eterna_user_settings')
        .select('panic_pause_enabled')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore not found error
        console.error('Error loading panic pause state:', error);
        return;
      }

      if (data) {
        setIsPaused(data.panic_pause_enabled);
        onStateChange?.(data.panic_pause_enabled);
      }
    } catch (error) {
      console.error('Error loading panic pause state:', error);
    }
  };

  const togglePanicPause = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newState = !isPaused;

      // Update user settings
      const { error } = await supabase
        .from('eterna_user_settings')
        .upsert({
          user_id: user.id,
          panic_pause_enabled: newState,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsPaused(newState);
      onStateChange?.(newState);

      // Track the event
      await analyticsIntegrations.trackEvent('panic_pause_toggled', { on: newState });

      // Show appropriate toast
      toast({
        title: newState ? 'Generation Paused' : 'Generation Resumed',
        description: newState 
          ? 'Generation paused everywhere. You can resume anytime.'
          : 'Generation has been resumed.',
        variant: newState ? 'destructive' : 'default'
      });

    } catch (error) {
      console.error('Error toggling panic pause:', error);
      toast({
        title: 'Error',
        description: 'Failed to update panic pause setting.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="panic-toggle"
        variant={isPaused ? 'destructive' : 'outline'}
        size="sm"
        onClick={togglePanicPause}
        disabled={loading}
        className="flex items-center gap-2"
      >
        {isPaused ? (
          <>
            <Play className="h-4 w-4" />
            Resume Generation
          </>
        ) : (
          <>
            <Pause className="h-4 w-4" />
            Panic Pause
          </>
        )}
      </Button>
      
      {isPaused && (
        <div className="flex items-center gap-1 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Paused</span>
        </div>
      )}
    </div>
  );
};