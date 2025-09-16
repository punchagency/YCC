import React from "react";
import * as Sentry from "@sentry/react";

const SentryErrorBoundary = ({ children, fallback }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={fallback || ErrorFallback}
      beforeCapture={(scope, error, errorInfo) => {
        // Add additional context to Sentry error reports
        scope.setTag("errorBoundary", true);
        scope.setContext("errorInfo", errorInfo);
        scope.setLevel("error");
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

// Default fallback component
const ErrorFallback = ({ error, resetError }) => {
  return (
    <div
      role="alert"
      style={{
        padding: "20px",
        margin: "20px",
        border: "1px solid #ff6b6b",
        borderRadius: "8px",
        backgroundColor: "#fff5f5",
        color: "#c92a2a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#c92a2a" }}>Something went wrong:</h2>
      <details style={{ whiteSpace: "pre-wrap", marginBottom: "16px" }}>
        <summary style={{ cursor: "pointer", marginBottom: "8px" }}>
          Error Details
        </summary>
        {error?.message}
      </details>
      <button
        onClick={resetError}
        style={{
          backgroundColor: "#c92a2a",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "8px",
        }}
      >
        Try again
      </button>
      <button
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: "#868e96",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Reload page
      </button>
    </div>
  );
};

export default SentryErrorBoundary;

