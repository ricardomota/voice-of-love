import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { EternaHeader } from "@/components/layout/EternaHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import RileyStyledLanding from "./components/landing/RileyStyledLanding";
import { HowItWorksPage } from "./pages/HowItWorks";
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
      <Route path="/" element={<RileyStyledLanding onTryFree={() => navigate('/auth')} onSignIn={() => navigate('/auth')} onLearnMore={() => navigate('/how-it-works')} />} />
      <Route path="/landing-original" element={<Landing onTryFree={() => navigate('/auth')} onSignIn={() => navigate('/auth')} onLearnMore={() => navigate('/how-it-works')} />} />
      <Route path="/how-it-works" element={<HowItWorksPage onTryFree={() => navigate('/auth')} onSignIn={() => navigate('/auth')} />} />
      <Route path="/auth" element={
        <div className="min-h-screen bg-background">
          <EternaHeader />
          <main>
            <Index />
          </main>
        </div>
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