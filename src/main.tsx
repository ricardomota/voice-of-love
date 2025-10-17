import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Note: CSP should be set via HTTP headers by the hosting platform
// Client-side CSP via meta tags causes warnings and is not recommended
// import { initializeCSP } from "./utils/cspHeaders";
// initializeCSP();

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