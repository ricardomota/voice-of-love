import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { EternaHeader } from "@/components/layout/EternaHeader";
import { BetaGate } from "@/components/BetaGate";
import { LandingPage } from "@/pages/LandingPage";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
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
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleTryFree = () => {
    setShowBetaGate(true);
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
          <BetaGate>
            <div className="min-h-screen bg-background">
              <EternaHeader />
              <main>
                <Index />
              </main>
            </div>
          </BetaGate>
        )
      } />
      
      {/* Protected App Routes */}
      <Route path="/app/*" element={
        <BetaGate>
          <div className="min-h-screen bg-background">
            <EternaHeader />
            <main>
              <Index />
            </main>
          </div>
        </BetaGate>
      } />
      
      {/* Legacy auth route redirect */}
      <Route path="/auth" element={<BetaGate><Index /></BetaGate>} />
      
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
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </QueryClientProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;