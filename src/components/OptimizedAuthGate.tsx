import React, { memo, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

// Memoized auth gate to prevent unnecessary re-renders
const AuthGate = memo<AuthGateProps>(({ children }) => {
  const { user, loading } = useAuth();

  // Memoize loading state to prevent re-renders
  const loadingComponent = useMemo(() => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  ), []);

  // Memoize auth component to prevent re-renders
  const authComponent = useMemo(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      
      // Redirect to /auth for authentication
      if (currentPath !== '/auth' && currentPath !== '/' && !currentPath.startsWith('/auth')) {
        window.location.href = '/auth';
        return loadingComponent;
      }
      
      // For root path, redirect to auth or show landing
      if (currentPath === '/') {
        window.location.href = '/auth';
        return loadingComponent;
      }
    }
    
    return loadingComponent;
  }, [loadingComponent]);

  if (loading) {
    return loadingComponent;
  }

  if (!user) {
    return authComponent;
  }

  return <>{children}</>;
});

AuthGate.displayName = 'AuthGate';

export { AuthGate };