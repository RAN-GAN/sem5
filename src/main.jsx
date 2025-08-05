import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

// Log that we're using real backend data
console.log("📚 SEM2V2 - Running with real backend API");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/sem5">
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
