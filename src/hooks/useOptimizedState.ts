import { useState, useCallback, useMemo } from 'react';
import { debounce } from '@/utils/performance';

interface OptimizedStateOptions<T> {
  debounceMs?: number;
  equalityFn?: (a: T, b: T) => boolean;
}

export function useOptimizedState<T>(
  initialValue: T,
  options: OptimizedStateOptions<T> = {}
) {
  const { debounceMs = 0, equalityFn } = options;
  const [value, setValue] = useState<T>(initialValue);
  const [isPending, setIsPending] = useState(false);

  const debouncedSetValue = useMemo(() => {
    if (debounceMs === 0) return setValue;
    
    return debounce((newValue: T) => {
      setValue(prev => {
        if (equalityFn && equalityFn(prev, newValue)) {
          return prev;
        }
        return newValue;
      });
      setIsPending(false);
    }, debounceMs);
  }, [debounceMs, equalityFn]);

  const optimizedSetValue = useCallback((newValue: T | ((prev: T) => T)) => {
    if (debounceMs > 0) {
      setIsPending(true);
    }
    
    if (typeof newValue === 'function') {
      const computedValue = (newValue as (prev: T) => T)(value);
      debouncedSetValue(computedValue);
    } else {
      debouncedSetValue(newValue);
    }
  }, [value, debouncedSetValue, debounceMs]);

  return [value, optimizedSetValue, isPending] as const;
}