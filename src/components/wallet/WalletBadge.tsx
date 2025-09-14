import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus } from 'lucide-react';
import { useCreditBalance } from '@/hooks/useCreditBalance';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

export function WalletBadge() {
  const { balance, loading } = useCreditBalance();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const t = (key: string, params?: Record<string, any>) => {
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'wallet.balance': '{balance} credits',
        'wallet.add': 'Add Credits'
      },
      'pt-BR': {
        'wallet.balance': '{balance} créditos',
        'wallet.add': 'Adicionar Créditos'
      },
      'es': {
        'wallet.balance': '{balance} créditos',
        'wallet.add': 'Agregar Créditos'
      }
    };

    let text = translations[currentLanguage]?.[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return text;
  };

  const handleWalletClick = () => {
    navigate('/wallet');
  };

  const handleAddCreditsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/simple-pricing');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse h-6 w-20 bg-muted rounded"></div>
      </div>
    );
  }

  const availableCredits = balance?.credits_available ?? 0;
  const isLow = availableCredits < 200;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleWalletClick}
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        <Badge 
          variant={isLow ? "destructive" : "secondary"}
          className="font-mono"
        >
          {t('wallet.balance', { balance: availableCredits.toLocaleString() })}
        </Badge>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddCreditsClick}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">{t('wallet.add')}</span>
      </Button>
    </div>
  );
}