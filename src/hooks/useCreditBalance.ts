import { useState, useEffect } from 'react';
import { creditService, type CreditBalance } from '@/services/creditService';
import { useAuth } from '@/hooks/useAuth';

export function useCreditBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!user) {
      setBalance(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await creditService.getCreditBalance();
      setBalance(data);
    } catch (err) {
      console.error('Error fetching credit balance:', err);
      setError('Failed to fetch credit balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  return {
    balance,
    loading,
    error,
    refreshBalance: fetchBalance,
    hasCredits: (balance?.credits_available ?? 0) > 0,
    availableCredits: balance?.credits_available ?? 0
  };
}