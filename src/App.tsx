import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ModernHeader } from "@/components/layout/ModernHeader";
import { UserLimitGate } from "@/components/UserLimitGate";
import { LandingPage } from "@/pages/LandingPage";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, Navigate, useLocation } from "react-router-dom";
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
import { EternaPricingPage } from "./components/pricing/EternaPricingPage";
import { Wallet } from "./pages/Wallet";
import Eterna from "./pages/Eterna";

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

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <UserLimitGate>
      <div className="min-h-screen bg-background">
        <ModernHeader />
        <main className="pt-24">
          {children}
        </main>
      </div>
    </UserLimitGate>
  );
};

// Public Route with header wrapper
const PublicRoute = ({ children, showHeader = true }: { children: React.ReactNode; showHeader?: boolean }) => {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <ModernHeader />}
      <main className={showHeader ? "pt-24" : ""}>
        {children}
      </main>
    </div>
  );
};

// Auth component with URL params
const LazyAuth = memo(() => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  return <Auth initialPlan={plan || undefined} />;
});

const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PublicRoute showHeader={true}>
              <LandingPage 
                onTryFree={() => window.location.href = '/auth'}
                onLogin={() => window.location.href = '/auth'}
              />
            </PublicRoute>
          )
        } 
      />
      
      {/* Authentication */}
      <Route 
        path="/auth" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PublicRoute showHeader={false}>
              <LazyAuth />
            </PublicRoute>
          )
        } 
      />
      
      {/* Protected Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected App Pages */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/wallet" 
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        } 
      />
      
      {/* Public Pages with Header */}
      <Route 
        path="/pricing" 
        element={
          <PublicRoute>
            <EternaPricingPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/about" 
        element={
          <PublicRoute>
            <About />
          </PublicRoute>
        } 
      />
      <Route 
        path="/privacy" 
        element={
          <PublicRoute>
            <Privacy />
          </PublicRoute>
        } 
      />
      <Route 
        path="/terms" 
        element={
          <PublicRoute>
            <Terms />
          </PublicRoute>
        } 
      />
      <Route 
        path="/support" 
        element={
          <PublicRoute>
            <Support />
          </PublicRoute>
        } 
      />
      <Route 
        path="/changelog" 
        element={
          <PublicRoute>
            <Changelog />
          </PublicRoute>
        } 
      />
      
      {/* Payment Pages */}
      <Route 
        path="/payment" 
        element={
          <PublicRoute>
            <Payment />
          </PublicRoute>
        } 
      />
      <Route 
        path="/payment/success" 
        element={
          <PublicRoute>
            <PaymentSuccess />
          </PublicRoute>
        } 
      />
      
      {/* Special Pages */}
      <Route 
        path="/eterna" 
        element={
          <PublicRoute showHeader={false}>
            <Eterna />
          </PublicRoute>
        } 
      />
      
      {/* Catch-all 404 */}
      <Route 
        path="*" 
        element={
          <PublicRoute>
            <NotFound />
          </PublicRoute>
        } 
      />
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