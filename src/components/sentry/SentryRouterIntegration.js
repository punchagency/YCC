/**
 * Sentry React Router Integration
 * Tracks navigation events and route changes
 */

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { captureNavigation, captureUserAction } from "../../services/sentry/sentryService";
import * as Sentry from "@sentry/react";

/**
 * Component to track route changes and send to Sentry
 */
export const SentryRouteTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Track route changes
        captureNavigation(
            document.referrer || "direct",
            location.pathname + location.search,
            {
                hash: location.hash,
                state: location.state,
                timestamp: new Date().toISOString(),
            }
        );

        // Set route context for future errors
        Sentry.setContext("route", {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
            state: location.state,
        });

        // Track page view as user action
        captureUserAction("page_view", {
            path: location.pathname,
            search: location.search,
            timestamp: new Date().toISOString(),
        });

    }, [location]);

    return null;
};

/**
 * Hook to track navigation events
 * @returns {Function} - Function to track navigation with context
 */
export const useNavigationTracking = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return React.useCallback((to, options = {}) => {
        // Capture navigation intent
        captureUserAction("navigation_intent", {
            from: location.pathname,
            to: typeof to === "string" ? to : to.pathname,
            method: "programmatic",
            options,
        });

        // Perform navigation
        navigate(to, options);
    }, [navigate, location]);
};

/**
 * Hook to track user interactions on the current page
 * @returns {Function} - Function to track interactions
 */
export const usePageInteractionTracking = () => {
    const location = useLocation();

    return React.useCallback((interaction, context = {}) => {
        captureUserAction(`page_interaction_${interaction}`, {
            page: location.pathname,
            ...context,
        });
    }, [location]);
};

/**
 * Component wrapper that adds automatic interaction tracking
 */
export const withInteractionTracking = (WrappedComponent, interactionName) => {
    return React.forwardRef((props, ref) => {
        const trackInteraction = usePageInteractionTracking();

        const handleClick = (event) => {
            trackInteraction(interactionName || "click", {
                element: event.target.tagName,
                className: event.target.className,
                id: event.target.id,
            });

            // Call original onClick if it exists
            if (props.onClick) {
                props.onClick(event);
            }
        };

        return (
            <WrappedComponent
                {...props}
                ref={ref}
                onClick={handleClick}
            />
        );
    });
};

export default SentryRouteTracker;
