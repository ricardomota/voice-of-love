import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorConfig {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((
    error: any, 
    config: ErrorConfig = {}
  ) => {
    console.error('Error:', error);
    
    const { 
      title = "Erro", 
      description = error.message || "Ocorreu um erro inesperado",
      variant = "destructive",
      duration = 5000
    } = config;

    toast({
      title,
      description,
      variant,
      duration
    });
  }, [toast]);

  const handleSuccess = useCallback((
    title: string, 
    description: string,
    duration: number = 3000
  ) => {
    toast({
      title,
      description,
      variant: "default",
      duration
    });
  }, [toast]);

  const handleLoading = useCallback((
    title: string,
    description: string
  ) => {
    toast({
      title,
      description,
      variant: "default",
      duration: 10000
    });
  }, [toast]);

  return {
    handleError,
    handleSuccess,
    handleLoading
  };
}