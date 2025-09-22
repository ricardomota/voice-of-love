import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface AsyncOperationConfig {
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}

export function useAsyncOperation<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  
  const { handleError, handleSuccess, handleLoading } = useErrorHandler();

  const execute = useCallback(async (
    operation: () => Promise<T>,
    config: AsyncOperationConfig = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      if (config.loadingMessage) {
        handleLoading("Processando...", config.loadingMessage);
      }
      
      const result = await operation();
      setData(result);
      
      if (config.successMessage) {
        handleSuccess("Sucesso!", config.successMessage);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      
      handleError(error, {
        title: "Erro",
        description: config.errorMessage || error.message
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError, handleSuccess, handleLoading]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
}