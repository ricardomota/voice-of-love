import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { EternaHeader } from "@/components/layout/EternaHeader";
import { UserLimitGate } from "@/components/UserLimitGate";
import { LandingPage } from "@/pages/LandingPage";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import RileyLandingPage from "./components/landing/RileyLandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Changelog } from "./pages/Changelog";

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
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_settings')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error getting user count:', error);
          setUserCount(0);
        } else {
          setUserCount(count || 0);
        }
      } catch (error) {
        console.error('Error in checkUserCount:', error);
        setUserCount(0);
      } finally {
        setUserCountLoading(false);
      }
    };

    checkUserCount();
  }, []);

  if (loading || userCountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleTryFree = () => {
    if (userCount >= 10) {
      // Show waitlist directly
      setShowBetaGate(true);
    } else {
      // Show app with login
      setShowBetaGate(true);
    }
  };

  const handleLogin = () => {
    setShowBetaGate(true);
  };

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
              <main>
                <Index />
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
            <main>
              <Index />
            </main>
          </div>
        </UserLimitGate>
      } />
      
      {/* Legacy auth route redirect */}
      <Route path="/auth" element={<UserLimitGate><Index /></UserLimitGate>} />
      
      {/* Changelog Route */}
      <Route path="/changelog" element={<Changelog />} />
      
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