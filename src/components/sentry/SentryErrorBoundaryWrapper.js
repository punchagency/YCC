/**
 * Enhanced Sentry Error Boundary Wrapper
 * Provides component-specific error boundaries with context
 */

import React from "react";
import * as Sentry from "@sentry/react";
import { captureUserAction } from "../../services/sentry/sentryService";

/**
 * Enhanced Error Fallback Component
 */
const EnhancedErrorFallback = ({ error, resetError, componentName }) => {
    const handleRetry = () => {
        captureUserAction("error_boundary_retry", {
            componentName,
            errorMessage: error.message
        });
        resetError();
    };

    const handleReload = () => {
        captureUserAction("error_boundary_reload", {
            componentName,
            errorMessage: error.message
        });
        window.location.reload();
    };

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
                fontFamily: '"Plus Jakarta Sans", Arial, sans-serif',
                textAlign: "center",
            }}
        >
            <h2 style={{ marginTop: 0, color: "#c92a2a", fontSize: "1.5rem" }}>
                Something went wrong in {componentName || "this component"}
            </h2>

            <div style={{ margin: "16px 0" }}>
                <details style={{ textAlign: "left", marginBottom: "16px" }}>
                    <summary style={{ cursor: "pointer", marginBottom: "8px", fontWeight: "bold" }}>
                        Error Details
                    </summary>
                    <pre style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "0.875rem",
                        backgroundColor: "#f8f9fa",
                        padding: "12px",
                        borderRadius: "4px",
                        border: "1px solid #e9ecef",
                    }}>
                        {error?.message}
                    </pre>
                </details>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button
                    onClick={handleRetry}
                    style={{
                        backgroundColor: "#c92a2a",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                    }}
                >
                    Try Again
                </button>
                <button
                    onClick={handleReload}
                    style={{
                        backgroundColor: "#868e96",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                    }}
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
};

/**
 * Higher-Order Component for Sentry Error Boundaries
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} options - Configuration options
 * @param {string} options.componentName - Name of the component for error reporting
 * @param {React.Component} options.fallback - Custom fallback component
 * @param {Function} options.beforeCapture - Function to run before capturing error
 * @returns {React.Component} - Wrapped component with error boundary
 */
export const withSentryErrorBoundary = (WrappedComponent, options = {}) => {
    const {
        componentName = WrappedComponent.displayName || WrappedComponent.name || "Unknown",
        fallback,
        beforeCapture,
    } = options;

    const SentryWrappedComponent = React.forwardRef((props, ref) => {
        return (
            <Sentry.ErrorBoundary
                fallback={(errorProps) => {
                    if (fallback) {
                        return React.createElement(fallback, { ...errorProps, componentName });
                    }
                    return <EnhancedErrorFallback {...errorProps} componentName={componentName} />;
                }}
                beforeCapture={(scope, error, errorInfo) => {
                    // Add component-specific context
                    scope.setTag("component", componentName);
                    scope.setContext("errorBoundary", {
                        component: componentName,
                        props: Object.keys(props),
                        errorInfo,
                    });
                    scope.setLevel("error");

                    // Run custom beforeCapture if provided
                    if (beforeCapture) {
                        beforeCapture(scope, error, errorInfo, props);
                    }

                    // Capture user action
                    captureUserAction("component_error", {
                        component: componentName,
                        errorMessage: error.message,
                        errorStack: error.stack,
                    }, "error");
                }}
            >
                <WrappedComponent {...props} ref={ref} />
            </Sentry.ErrorBoundary>
        );
    });

    SentryWrappedComponent.displayName = `withSentryErrorBoundary(${componentName})`;

    return SentryWrappedComponent;
};

/**
 * Hook to manually capture component errors
 * @param {string} componentName - Name of the component
 * @returns {Function} - Function to capture errors
 */
export const useComponentErrorCapture = (componentName) => {
    return React.useCallback((error, context = {}) => {
        Sentry.withScope((scope) => {
            scope.setTag("component", componentName);
            scope.setContext("componentError", {
                component: componentName,
                ...context,
            });

            captureUserAction("manual_component_error", {
                component: componentName,
                errorMessage: error.message,
            }, "error");

            Sentry.captureException(error);
        });
    }, [componentName]);
};

/**
 * Hook to capture user interactions within components
 * @param {string} componentName - Name of the component
 * @returns {Function} - Function to capture user actions
 */
export const useComponentActionCapture = (componentName) => {
    return React.useCallback((action, context = {}) => {
        captureUserAction(`${componentName.toLowerCase()}_${action}`, {
            component: componentName,
            ...context,
        });
    }, [componentName]);
};

export default withSentryErrorBoundary;
