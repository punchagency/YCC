/**
 * Centralized Sentry Service
 * Provides enhanced error tracking, breadcrumbs, and context management
 */

import * as Sentry from "@sentry/react";
import { addSentryBreadcrumb, captureException, setSentryUser } from "../../config/sentry";

/**
 * Enhanced API error capture with context
 * @param {Error} error - The error object
 * @param {Object} context - Additional context (endpoint, method, payload, etc.)
 * @param {string} operation - Description of the operation that failed
 */
export const captureApiError = (error, context = {}, operation = "API Call") => {
    // Add breadcrumb for the failed API call
    addSentryBreadcrumb(
        `${operation} failed: ${error.message}`,
        "http",
        "error"
    );

    // Capture the exception with enhanced context
    captureException(error, {
        api: {
            operation,
            endpoint: context.endpoint || "unknown",
            method: context.method || "unknown",
            statusCode: error.response?.status,
            responseData: error.response?.data,
            requestPayload: context.payload,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
        },
        user: {
            authenticated: !!localStorage.getItem("token"),
            role: getUserRole(),
        },
        ...context.additional,
    });
};

/**
 * Capture user action with context
 * @param {string} action - The action performed
 * @param {Object} context - Additional context
 * @param {string} level - Sentry level (info, warning, error)
 */
export const captureUserAction = (action, context = {}, level = "info") => {
    addSentryBreadcrumb(
        `User action: ${action}`,
        "user",
        level
    );

    // For critical actions, also capture as an event
    if (level === "error" || context.critical) {
        Sentry.addBreadcrumb({
            message: `Critical user action: ${action}`,
            category: "user.critical",
            level: "warning",
            data: context,
        });
    }
};

/**
 * Capture service operation with performance tracking
 * @param {string} operation - Operation name
 * @param {Function} serviceFunction - The service function to execute
 * @param {Object} context - Additional context
 * @returns {Promise} - The result of the service function
 */
export const captureServiceOperation = async (operation, serviceFunction, context = {}) => {
    const startTime = performance.now();

    addSentryBreadcrumb(
        `Starting ${operation}`,
        "service",
        "info"
    );

    try {
        const result = await serviceFunction();
        const duration = performance.now() - startTime;

        // Track successful operations
        addSentryBreadcrumb(
            `${operation} completed in ${duration.toFixed(2)}ms`,
            "service",
            duration > 3000 ? "warning" : "info"
        );

        // Capture slow operations as performance issues
        if (duration > 5000) {
            captureException(new Error(`Slow operation: ${operation}`), {
                performance: {
                    operation,
                    duration,
                    threshold: 5000,
                    ...context,
                },
            });
        }

        return result;
    } catch (error) {
        const duration = performance.now() - startTime;

        addSentryBreadcrumb(
            `${operation} failed after ${duration.toFixed(2)}ms`,
            "service",
            "error"
        );

        captureApiError(error, { ...context, duration }, operation);
        throw error;
    }
};

/**
 * Set user context from localStorage or user object
 * @param {Object} user - User object (optional, will try to get from localStorage)
 */
export const updateUserContext = (user = null) => {
    try {
        let userData = user;

        if (!userData) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                userData = JSON.parse(storedUser);
            }
        }

        if (userData) {
            setSentryUser({
                id: userData.id || userData._id,
                email: userData.email,
                username: userData?.firstName + " " + userData?.lastName || userData?.name,
                role: userData.role?.name || userData.role,
            });

            addSentryBreadcrumb(
                `User context updated: ${userData.email}`,
                "auth",
                "info"
            );
        }
    } catch (error) {
        console.warn("Failed to update Sentry user context:", error);
    }
};

/**
 * Clear user context on logout
 */
export const clearUserContext = () => {
    Sentry.setUser(null);
    addSentryBreadcrumb("User logged out", "auth", "info");
};

/**
 * Capture form validation errors
 * @param {Object} errors - Form errors object
 * @param {string} formType - Type of form
 * @param {boolean} critical - Whether this is a critical form
 */
export const captureFormErrors = (errors, formType, critical = false) => {
    const errorCount = Object.keys(errors).length;

    addSentryBreadcrumb(
        `Form validation errors in ${formType}: ${Object.keys(errors).join(", ")}`,
        "validation",
        "warning"
    );

    if (critical || errorCount > 5) {
        captureException(new Error(`Form validation failed: ${formType}`), {
            form: {
                type: formType,
                errors,
                errorCount,
                critical,
            },
        });
    }
};

/**
 * Capture navigation events
 * @param {string} from - Previous route
 * @param {string} to - New route
 * @param {Object} context - Additional context
 */
export const captureNavigation = (from, to, context = {}) => {
    addSentryBreadcrumb(
        `Navigation: ${from} → ${to}`,
        "navigation",
        "info"
    );

    // Capture navigation context
    Sentry.setContext("navigation", {
        from,
        to,
        timestamp: new Date().toISOString(),
        ...context,
    });
};

/**
 * Helper function to get user role
 */
const getUserRole = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.role?.name || user.role || "unknown";
    } catch {
        return "unknown";
    }
};

/**
 * Create axios interceptors for automatic error capture
 * @param {Object} axiosInstance - Axios instance to add interceptors to
 */
export const setupAxiosInterceptors = (axiosInstance) => {
    // Request interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            addSentryBreadcrumb(
                `API Request: ${config.method?.toUpperCase()} ${config.url}`,
                "http",
                "info"
            );
            return config;
        },
        (error) => {
            captureApiError(error, { stage: "request" }, "API Request Setup");
            return Promise.reject(error);
        }
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
        (response) => {
            addSentryBreadcrumb(
                `API Response: ${response.status} ${response.config.url}`,
                "http",
                "info"
            );
            return response;
        },
        (error) => {
            const context = {
                endpoint: error.config?.url,
                method: error.config?.method?.toUpperCase(),
                payload: error.config?.data,
            };

            captureApiError(error, context, "API Response");
            return Promise.reject(error);
        }
    );
};
