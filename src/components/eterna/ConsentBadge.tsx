// Step 7: Consent Badge component
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';

interface ConsentBadgeProps {
  status: 'none' | 'on_file' | 'expired';
  className?: string;
  onClick?: () => void;
}

export const ConsentBadge: React.FC<ConsentBadgeProps> = ({ 
  status, 
  className = '',
  onClick 
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'on_file':
        return {
          variant: 'default' as const,
          icon: ShieldCheck,
          text: 'Consent on file',
          bgColor: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600'
        };
      case 'expired':
        return {
          variant: 'destructive' as const,
          icon: ShieldX,
          text: 'Consent expired',
          bgColor: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600'
        };
      case 'none':
      default:
        return {
          variant: 'outline' as const,
          icon: Shield,
          text: 'No consent',
          bgColor: 'bg-amber-100 text-amber-800 border-amber-200',
          iconColor: 'text-amber-600'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <Badge
      data-testid="consent-badge"
      variant={config.variant}
      className={`${config.bgColor} ${className} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} flex items-center gap-1 px-2 py-1`}
      onClick={onClick}
    >
      <Icon className={`h-3 w-3 ${config.iconColor}`} />
      <span className="text-xs font-medium">{config.text}</span>
    </Badge>
  );
};