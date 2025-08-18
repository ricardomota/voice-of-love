/**
 * Performance utilities for optimizing React components and API calls
 */

import { useCallback, useMemo, useRef } from 'react';

// Cache for API calls to prevent duplicates
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
let cacheCleanupInterval: NodeJS.Timeout | null = null;

/**
 * Cache API responses to prevent duplicate requests
 */
export const cacheApiCall = <T>(
  key: string,
  apiCall: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): Promise<T> => {
  const now = Date.now();
  const cached = apiCache.get(key);

  if (cached && now - cached.timestamp < cached.ttl) {
    return Promise.resolve(cached.data);
  }

  return apiCall().then((data) => {
    apiCache.set(key, { data, timestamp: now, ttl });
    return data;
  }).catch((error) => {
    // Don't cache errors
    throw error;
  });
};

/**
 * Debounce hook for expensive operations
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
};

/**
 * Memoized expensive computations
 */
export const useMemoizedComputation = <T>(
  computation: () => T,
  dependencies: any[]
): T => {
  return useMemo(computation, dependencies);
};

/**
 * Performance monitoring for components (development only)
 */
export const measurePerformance = (name: string, fn: () => void) => {
  if (process.env.NODE_ENV !== 'development') {
    fn();
    return;
  }

  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

/**
 * Optimized image loading
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      apiCache.delete(key);
    }
  }
};

/**
 * Initialize cache cleanup (call once)
 */
export const initCacheCleanup = () => {
  if (cacheCleanupInterval) return;
  
  // Auto-clear expired cache every 10 minutes
  cacheCleanupInterval = setInterval(clearExpiredCache, 10 * 60 * 1000);
};

/**
 * Stop cache cleanup
 */
export const stopCacheCleanup = () => {
  if (cacheCleanupInterval) {
    clearInterval(cacheCleanupInterval);
    cacheCleanupInterval = null;
  }
};

// Initialize cleanup once
if (typeof window !== 'undefined') {
  initCacheCleanup();
}