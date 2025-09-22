import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wallet as WalletIcon, CreditCard, History, ExternalLink, Download, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useCreditBalance } from '@/hooks/useCreditBalance';
import { creditService, type CreditTransaction } from '@/services/creditService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function Wallet() {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { balance, loading: balanceLoading, refreshBalance } = useCreditBalance();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoTopup, setAutoTopup] = useState(false);

  useEffect(() => {
    async function fetchTransactions() {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await creditService.getCreditTransactions(20);
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: t('errors.generic'),
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [user]);

  const t = (key: string, params?: Record<string, any>) => {
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'wallet.title': 'Wallet',
        'wallet.balance': '{balance} credits',
        'wallet.add': 'Add Credits',
        'wallet.lowBalance': 'Running low on credits — top up to keep your memories flowing.',
        'wallet.autoTopup': 'Enable auto top-up at {threshold} credits',
        'wallet.manageBilling': 'Manage Billing',
        'wallet.history': 'Transaction History',
        'wallet.topupCta': 'Top up',
        'misc.loading': 'Loading...',
        'errors.generic': 'Something went wrong. Please try again.'
      },
      'pt-BR': {
        'wallet.title': 'Carteira',
        'wallet.balance': '{balance} créditos',
        'wallet.add': 'Adicionar Créditos',
        'wallet.lowBalance': 'Créditos acabando — recarregue para manter suas lembranças fluindo.',
        'wallet.autoTopup': 'Habilitar recarga automática em {threshold} créditos',
        'wallet.manageBilling': 'Gerenciar Cobrança',
        'wallet.history': 'Histórico de Transações',
        'wallet.topupCta': 'Recarregar',
        'misc.loading': 'Carregando...',
        'errors.generic': 'Algo deu errado. Tente novamente.'
      },
      'es': {
        'wallet.title': 'Billetera',
        'wallet.balance': '{balance} créditos',
        'wallet.add': 'Agregar Créditos',
        'wallet.lowBalance': 'Créditos bajos — recarga para mantener tus recuerdos fluyendo.',
        'wallet.autoTopup': 'Habilitar recarga automática en {threshold} créditos',
        'wallet.manageBilling': 'Administrar Facturación',
        'wallet.history': 'Historial de Transacciones',
        'wallet.topupCta': 'Recargar',
        'misc.loading': 'Cargando...',
        'errors.generic': 'Algo salió mal. Inténtalo de nuevo.'
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

  const handleAddCredits = () => {
    navigate('/pricing');
  };

  const handleManageBilling = async () => {
    const result = await creditService.getCustomerPortalUrl();
    if (result.error) {
      toast({
        title: result.error,
        variant: 'destructive'
      });
      return;
    }

    if (result.url) {
      window.open(result.url, '_blank');
    }
  };

  const formatTransactionReason = (reason: string) => {
    const reasonMap: Record<string, string> = {
      'pack_purchase': 'Credit Pack Purchase',
      'subscription_monthly_grant': 'Monthly Credits',
      'usage_charge': 'Feature Usage',
      'refund': 'Refund',
      'promo_grant': 'Promotional Credits',
      'admin_adjust': 'Admin Adjustment'
    };
    return reasonMap[reason] || reason;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Please sign in to view your wallet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableCredits = balance?.credits_available ?? 0;
  const isLow = availableCredits < 200;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <WalletIcon className="h-8 w-8" />
          {t('wallet.title')}
        </h1>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Current Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {balanceLoading ? (
              <div className="animate-pulse h-12 w-32 bg-muted rounded mx-auto"></div>
            ) : (
              <div className="text-5xl font-bold text-primary">
                {availableCredits.toLocaleString()}
                <span className="text-lg font-normal text-muted-foreground ml-2">credits</span>
              </div>
            )}

            {/* Low Balance Warning */}
            {isLow && (
              <div className="flex items-center justify-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{t('wallet.lowBalance')}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleAddCredits} className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t('wallet.topupCta')}
              </Button>
              <Button variant="outline" onClick={handleManageBilling} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                {t('wallet.manageBilling')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Auto Top-up Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Auto Top-up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-topup" className="text-sm">
                {t('wallet.autoTopup', { threshold: 200 })}
              </Label>
              <Switch
                id="auto-topup"
                checked={autoTopup}
                onCheckedChange={setAutoTopup}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Separator />

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t('wallet.history')}
            </CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{formatTransactionReason(transaction.reason)}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(transaction.created_at), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={transaction.delta > 0 ? 'default' : 'secondary'}>
                        {transaction.delta > 0 ? '+' : ''}{transaction.delta.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}