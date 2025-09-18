import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple test component
const TestPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Eterna is Loading...
        </h1>
        <p className="text-lg text-gray-600">
          Preview is working! 🎉
        </p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="*" element={<TestPage />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;