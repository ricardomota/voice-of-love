import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { EternaHeader } from "@/components/layout/EternaHeader";
import { UserLimitGate } from "@/components/UserLimitGate";
import { LandingPage } from "@/pages/LandingPage";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Loader2 } from 'lucide-react';
import { useState, useEffect, memo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cacheApiCall } from '@/utils/performanceUtils';
import { Auth } from "@/pages/Auth";

import RileyLandingPage from "./components/landing/RileyLandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Changelog } from "./pages/Changelog";
import { Payment } from "./pages/Payment";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { About } from "./pages/About";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Support } from "./pages/Support";

// Lazy load heavy components for better performance
const LazyIndex = memo(() => <Index />);
const LazyChangelog = memo(() => <Changelog />);

// Auth component with URL params
const LazyAuth = memo(() => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  return <Auth initialPlan={plan || undefined} />;
});

// Create QueryClient outside component to avoid re-creation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showBetaGate, setShowBetaGate] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [userCountLoading, setUserCountLoading] = useState(true);
  
  // Performance monitoring enabled for debugging
  // usePerformanceMonitoring();

  // Optimized user count check with caching to prevent duplicate API calls
  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const result = await cacheApiCall(
          'user_settings_count',
          async () => {
            const { count, error } = await supabase
              .from('user_settings')
              .select('*', { count: 'exact', head: true });
            
            if (error) throw error;
            return count || 0;
          },
          2 * 60 * 1000 // 2 minutes cache
        );
        
        setUserCount(result);
      } catch (error) {
        console.error('Error getting user count:', error);
        setUserCount(0);
      } finally {
        setUserCountLoading(false);
      }
    };

    checkUserCount();
  }, []);

  // Memoized handlers to prevent unnecessary re-renders
  const handleTryFree = useCallback(() => {
    setShowBetaGate(true);
  }, []);

  const handleLogin = useCallback(() => {
    setShowBetaGate(true);
  }, []);

  if (loading || userCountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show the actual app routes
  return (
    <Routes>
      <Route path="/" element={
        !user && !showBetaGate ? (
          <LandingPage 
            onTryFree={handleTryFree}
            onLogin={handleLogin}
          />
        ) : (
          <UserLimitGate>
            <div className="min-h-screen bg-background">
              <EternaHeader />
              <main className="pt-16">
                <LazyIndex />
              </main>
            </div>
          </UserLimitGate>
        )
      } />
      
      {/* Protected App Routes */}
      <Route path="/app/*" element={
        <UserLimitGate>
          <div className="min-h-screen bg-background">
            <EternaHeader />
            <main className="pt-16">
              <LazyIndex />
            </main>
          </div>
        </UserLimitGate>
      } />
      
      {/* Auth route with plan parameter support */}
      <Route path="/auth" element={<LazyAuth />} />
      
      {/* Changelog Route */}
      <Route path="/changelog" element={<LazyChangelog />} />
      
      {/* Payment Routes */}
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      
      {/* New Pages */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/support" element={<Support />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </LanguageProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;