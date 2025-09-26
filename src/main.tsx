import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize security features
import { initializeCSP } from "./utils/cspHeaders";

// Apply CSP headers for security
initializeCSP();
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

// Component to handle document title updates
const AppWithTitleUpdates = () => {
  useDocumentTitle();
  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <AppWithTitleUpdates />
    </LanguageProvider>
  </StrictMode>,
);