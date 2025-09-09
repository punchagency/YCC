import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css";
import "primeflex/primeflex.css"; // Icons
import "./index.css";
import "./assets/styles/scss/main.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import { sentryConfig } from "./config/sentry";

// Initialize Sentry
Sentry.init({
  dsn: sentryConfig.dsn,
  environment: sentryConfig.environment,
  integrations: [
    Sentry.browserTracingIntegration({
      tracePropagationTargets: sentryConfig.tracePropagationTargets,
    }),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: sentryConfig.tracesSampleRate,
  replaysSessionSampleRate: sentryConfig.replaysSessionSampleRate,
  replaysOnErrorSampleRate: sentryConfig.replaysOnErrorSampleRate,
  beforeSend: sentryConfig.beforeSend,
  initialScope: sentryConfig.initialScope,
});

// Make Sentry available globally for helper functions
window.Sentry = Sentry;

// Global error handler to suppress PrimeReact overlay errors
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  const errorMessage = args[0];
  if (
    typeof errorMessage === "string" &&
    (errorMessage.includes("hideOverlaysOnDocumentScrolling") ||
      errorMessage.includes("Cannot read properties of undefined"))
  ) {
    return; // Suppress PrimeReact overlay errors
  }
  originalError.apply(console, args);
};

console.warn = (...args) => {
  const warnMessage = args[0];
  if (
    typeof warnMessage === "string" &&
    warnMessage.includes("hideOverlaysOnDocumentScrolling")
  ) {
    return; // Suppress PrimeReact warnings
  }
  originalWarn.apply(console, args);
};

// Global error event handler
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && 
      event.error.message.includes('hideOverlaysOnDocumentScrolling')) {
    event.preventDefault();
    return false;
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && 
      event.reason.message.includes('hideOverlaysOnDocumentScrolling')) {
    event.preventDefault();
    return false;
  }
});

const SentryBrowserRouter = Sentry.withSentryRouting(BrowserRouter);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <SentryBrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </SentryBrowserRouter>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
