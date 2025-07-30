import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorConfig {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
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
      variant = "destructive" 
    } = config;

    toast({
      title,
      description,
      variant
    });
  }, [toast]);

  const handleSuccess = useCallback((
    title: string, 
    description: string
  ) => {
    toast({
      title,
      description,
      variant: "default"
    });
  }, [toast]);

  return {
    handleError,
    handleSuccess
  };
}