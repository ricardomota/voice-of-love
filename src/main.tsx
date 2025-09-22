import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
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