import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCreditBalance } from '@/hooks/useCreditBalance';

interface CreditCounterProps {
  className?: string;
  showDetails?: boolean;
}

export const CreditCounter: React.FC<CreditCounterProps> = ({ 
  className = "", 
  showDetails = false 
}) => {
  const { balance, loading, availableCredits, refreshBalance } = useCreditBalance();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-muted rounded w-20"></div>
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  const totalCredits = balance.credits_available + balance.lifetime_spent;
  const usagePercentage = totalCredits > 0 ? (balance.lifetime_spent / totalCredits) * 100 : 0;

  if (!showDetails) {
    return (
      <motion.div 
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        <span>{availableCredits.toLocaleString()} créditos</span>
      </motion.div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">Créditos Disponíveis</div>
          <motion.button
            onClick={refreshBalance}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            ↻ Atualizar
          </motion.button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {availableCredits.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              {balance.lifetime_spent.toLocaleString()} usados
            </span>
          </div>
          
          {totalCredits > 0 && (
            <div className="space-y-1">
              <Progress value={100 - usagePercentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                {((100 - usagePercentage)).toFixed(1)}% restante
              </div>
            </div>
          )}
        </div>

        {balance.credits_reserved > 0 && (
          <div className="text-xs text-muted-foreground">
            {balance.credits_reserved} créditos reservados
          </div>
        )}
      </CardContent>
    </Card>
  );
};