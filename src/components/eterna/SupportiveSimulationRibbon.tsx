import React from 'react';
import { Heart, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportiveSimulationRibbonProps {
  className?: string;
  personName?: string;
}

export const SupportiveSimulationRibbon: React.FC<SupportiveSimulationRibbonProps> = ({ 
  className, 
  personName 
}) => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg px-4 py-2 mb-4",
      className
    )}>
      <div className="flex items-center gap-2 text-sm">
        <Heart className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-foreground">
          <span className="font-medium text-foreground">Interactive Memory:</span> This is an AI representation of{' '}
          {personName ? personName : 'your loved one'} designed for therapeutic comfort and remembrance.
        </span>
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </div>
    </div>
  );
};