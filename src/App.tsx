import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { EternaHeader } from "@/components/layout/EternaHeader";
import { BetaGate } from "@/components/BetaGate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import RileyLandingPage from "./components/landing/RileyLandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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

const AppRoutes = () => {
  const navigate = useNavigate();
  
  return (
    <Routes>
      <Route path="/" element={<RileyLandingPage onTryFree={() => navigate('/auth')} onSignIn={() => navigate('/auth')} onLearnMore={() => navigate('/auth')} onSeePricing={() => navigate('/auth')} />} />
      <Route path="/auth" element={
        <BetaGate>
          <div className="min-h-screen bg-background">
            <EternaHeader />
            <main>
              <Index />
            </main>
          </div>
        </BetaGate>
      } />
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
            <AppRoutes />
          </BrowserRouter>
        </QueryClientProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;