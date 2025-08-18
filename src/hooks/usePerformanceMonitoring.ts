import { useEffect, useRef } from 'react';

/**
 * Hook for monitoring website performance metrics
 */
export const usePerformanceMonitoring = () => {
  const observersRef = useRef<PerformanceObserver[]>([]);

  useEffect(() => {
    // Only run in development or if explicitly enabled
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const observers: PerformanceObserver[] = [];

    try {
      // Monitor Core Web Vitals - with proper error handling
      if ('PerformanceObserver' in window) {
        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
              }
            }
          } catch (e) {
            console.warn('LCP monitoring error:', e);
          }
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        observers.push(lcpObserver);

        // Monitor long tasks that block the main thread
        const longTaskObserver = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'longtask' && entry.duration > 50) {
                console.warn('Long task detected:', entry.duration + 'ms');
              }
            }
          } catch (e) {
            console.warn('Long task monitoring error:', e);
          }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        observers.push(longTaskObserver);
      }
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error);
    }

    observersRef.current = observers;

    return () => {
      observers.forEach(observer => observer.disconnect());
      observersRef.current = [];
    };
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    // Monitor memory usage if available - separate effect to avoid conflicts
    if (process.env.NODE_ENV !== 'development' || !('memory' in performance)) {
      return;
    }

    const checkMemory = () => {
      try {
        const memory = (performance as any).memory;
        if (memory) {
          console.log('Memory usage:', {
            used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
            total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
            limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
          });
        }
      } catch (e) {
        console.warn('Memory monitoring error:', e);
      }
    };

    // Check memory usage once on mount
    const timeout = setTimeout(checkMemory, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
};