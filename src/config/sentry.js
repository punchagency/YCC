// Sentry Configuration
// This file contains configuration options for Sentry error monitoring

export const sentryConfig = {
    // Your Sentry DSN - get this from your Sentry project settings
    dsn: process.env.REACT_APP_SENTRY_DSN || "",

    // Environment configuration
    environment: process.env.NODE_ENV || "development",

    // Performance monitoring sample rates
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session replay configuration
    replaysSessionSampleRate: 0.1, // 10% of sessions will be recorded
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors will be recorded

    // API domains for performance tracing (update these with your actual API domains)
    tracePropagationTargets: [
        "localhost",
        /^https:\/\/ycc-servers-82e51814e1e5.herokuapp.com\/api/,
        // Add your actual API domains here
    ],

    // Additional configuration options
    beforeSend(event) {
        // Filter out known issues that shouldn't be reported
        if (event.exception) {
            const errorMessage = event.exception.values?.[0]?.value;

            // Filter out PrimeReact overlay errors
            if (errorMessage && errorMessage.includes("hideOverlaysOnDocumentScrolling")) {
                return null;
            }

            // Filter out other known non-critical errors
            const ignoredErrors = [
                "ResizeObserver loop limit exceeded",
                "Non-Error promise rejection captured",
                "Network Error",
                "Loading chunk",
                "Loading CSS chunk"
            ];

            if (ignoredErrors.some(ignored => errorMessage && errorMessage.includes(ignored))) {
                return null;
            }
        }

        return event;
    },

    // User context configuration
    initialScope: {
        tags: {
            component: "react-app",
        },
    },
};

// Helper function to set user context
export const setSentryUser = (user) => {
    if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.setUser({
            id: user.id,
            email: user.email,
            username: user.username,
        });
    }
};

// Helper function to add breadcrumb
export const addSentryBreadcrumb = (message, category = "custom", level = "info") => {
    if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.addBreadcrumb({
            message,
            category,
            level,
            timestamp: Date.now() / 1000,
        });
    }
};

// Helper function to capture exception
export const captureException = (error, context = {}) => {
    if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.withScope((scope) => {
            Object.keys(context).forEach(key => {
                scope.setContext(key, context[key]);
            });
            window.Sentry.captureException(error);
        });
    }
};

