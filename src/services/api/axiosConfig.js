/**
 * Enhanced Axios Configuration with Sentry Integration
 * Provides centralized API configuration with automatic error tracking
 */

import axios from "axios";
import { setupAxiosInterceptors, captureApiError } from "../sentry/sentryService";
import { buildApiUrl } from "../../utils/apiUtils";
import { getAuthHeader } from "../../utils/authHeader";

// Create enhanced axios instance
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Setup Sentry interceptors
setupAxiosInterceptors(apiClient);

// Enhanced request interceptor with auth
apiClient.interceptors.request.use(
    (config) => {
        // Add auth headers automatically
        const authHeaders = getAuthHeader();
        config.headers = { ...config.headers, ...authHeaders };

        // Add request timestamp for performance tracking
        config.metadata = { startTime: performance.now() };

        return config;
    },
    (error) => {
        captureApiError(error, { stage: "request_auth" }, "Request Authentication");
        return Promise.reject(error);
    }
);

// Enhanced response interceptor with performance tracking
apiClient.interceptors.response.use(
    (response) => {
        // Calculate request duration
        if (response.config.metadata) {
            const duration = performance.now() - response.config.metadata.startTime;
            response.duration = duration;

            // Log slow requests
            if (duration > 3000) {
                console.warn(`Slow API request: ${response.config.url} took ${duration.toFixed(2)}ms`);
            }
        }

        return response;
    },
    (error) => {
        // Enhanced error context
        const context = {
            endpoint: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            payload: error.config?.data,
            duration: error.config?.metadata ?
                performance.now() - error.config.metadata.startTime : undefined,
            status: error.response?.status,
            statusText: error.response?.statusText,
        };

        captureApiError(error, context, "API Request");
        return Promise.reject(error);
    }
);

/**
 * Enhanced API methods with automatic error capture
 */
export const apiMethods = {
    get: async (url, config = {}) => {
        try {
            const response = await apiClient.get(buildApiUrl(url), config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    post: async (url, data, config = {}) => {
        try {
            const response = await apiClient.post(buildApiUrl(url), data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    put: async (url, data, config = {}) => {
        try {
            const response = await apiClient.put(buildApiUrl(url), data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    patch: async (url, data, config = {}) => {
        try {
            const response = await apiClient.patch(buildApiUrl(url), data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (url, config = {}) => {
        try {
            const response = await apiClient.delete(buildApiUrl(url), config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default apiClient;
