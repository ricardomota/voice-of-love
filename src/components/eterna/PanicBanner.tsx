// Step 8: Panic Pause banner that shows when generation is paused
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PanicBannerProps {
  onResume: () => void;
  onDismiss?: () => void;
}

export const PanicBanner: React.FC<PanicBannerProps> = ({ onResume, onDismiss }) => {
  return (
    <div 
      data-testid="panic-banner"
      className="bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-between shadow-lg border-b"
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5" />
        <div>
          <h4 className="font-semibold text-sm">Generation Paused</h4>
          <p className="text-xs opacity-90">
            All AI generation and sharing is currently disabled. You can resume anytime.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onResume}
          className="bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Resume Generation
        </Button>
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};