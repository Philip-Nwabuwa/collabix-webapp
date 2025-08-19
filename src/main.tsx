import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "@/components/auth/ErrorBoundary";
import ServerErrorPage from "@/pages/ServerErrorPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<ServerErrorPage />}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
