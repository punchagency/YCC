/**
 * Sentry Integration Examples
 * 
 * This file contains examples of how to integrate Sentry into your existing components
 * and contexts. These are examples only - implement them in your actual components as needed.
 */

import React, { useEffect } from 'react';
import { setSentryUser, addSentryBreadcrumb, captureException } from '../config/sentry';

// Example 1: User Context Integration
// Add this to your existing user context or auth context
export const ExampleUserContextIntegration = () => {
  useEffect(() => {
    // Set user context when user data is available
    const user = getUserFromSomewhere(); // Your existing user data
    if (user) {
      setSentryUser({
        id: user.id,
        email: user.email,
        username: user.username || user.name,
        // Add any other relevant user data
        role: user.role,
        subscription: user.subscription_type,
      });
    }
  }, []);

  return null; // This is just an example
};

// Example 2: API Error Handling
// Use this pattern in your API service files
export const ExampleAPIErrorHandling = async () => {
  try {
    const response = await fetch('/api/some-endpoint');
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    // Add breadcrumb for context
    addSentryBreadcrumb(
      `API call failed: ${error.message}`,
      'http',
      'error'
    );
    
    // Capture the exception with additional context
    captureException(error, {
      api: {
        endpoint: '/api/some-endpoint',
        method: 'GET',
        timestamp: new Date().toISOString(),
      },
    });
    
    // Re-throw to handle in component
    throw error;
  }
};

// Example 3: Component Error Handling
// Use this pattern in components that might throw errors
export const ExampleComponentWithErrorHandling = () => {
  const handleButtonClick = async () => {
    try {
      // Add breadcrumb for user action
      addSentryBreadcrumb(
        'User clicked submit button',
        'ui',
        'info'
      );
      
      // Some operation that might fail
      await performSomeOperation();
      
    } catch (error) {
      // Add context about what the user was doing
      addSentryBreadcrumb(
        'Submit operation failed',
        'user',
        'error'
      );
      
      // Capture with component context
      captureException(error, {
        component: 'ExampleComponent',
        userAction: 'submit',
        formData: {
          // Add relevant form data (be careful with PII)
          hasData: true,
          fieldCount: 5,
        },
      });
      
      // Show user-friendly error message
      console.error('Operation failed:', error);
    }
  };

  return (
    <button onClick={handleButtonClick}>
      Submit
    </button>
  );
};

// Example 4: Route Change Tracking
// Add this to your main App component or routing logic
export const ExampleRouteTracking = () => {
  useEffect(() => {
    // Track route changes as breadcrumbs
    const currentPath = window.location.pathname;
    addSentryBreadcrumb(
      `Navigated to ${currentPath}`,
      'navigation',
      'info'
    );
  }, [window.location.pathname]);

  return null;
};

// Example 5: Form Validation Error Tracking
export const ExampleFormErrorTracking = ({ formErrors }) => {
  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0) {
      // Track form validation errors
      addSentryBreadcrumb(
        `Form validation errors: ${Object.keys(formErrors).join(', ')}`,
        'validation',
        'warning'
      );
      
      // Optionally capture as exception if it's a critical form
      if (isCriticalForm()) {
        captureException(new Error('Form validation failed'), {
          form: {
            errors: formErrors,
            errorCount: Object.keys(formErrors).length,
            formType: 'critical-form',
          },
        });
      }
    }
  }, [formErrors]);

  return null;
};

// Example 6: Performance Monitoring
export const ExamplePerformanceTracking = () => {
  useEffect(() => {
    // Track custom performance metrics
    const startTime = performance.now();
    
    // Your component logic here
    performExpensiveOperation().then(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Add breadcrumb for performance tracking
      addSentryBreadcrumb(
        `Operation completed in ${duration.toFixed(2)}ms`,
        'performance',
        duration > 1000 ? 'warning' : 'info'
      );
      
      // If operation is too slow, capture as performance issue
      if (duration > 5000) {
        captureException(new Error('Slow operation detected'), {
          performance: {
            operation: 'expensive-operation',
            duration: duration,
            threshold: 5000,
          },
        });
      }
    });
  }, []);

  return null;
};

// Helper function examples
const getUserFromSomewhere = () => {
  // Your existing user data retrieval logic
  return JSON.parse(localStorage.getItem('user') || '{}');
};

const performSomeOperation = async () => {
  // Your existing operation logic
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const performExpensiveOperation = async () => {
  // Your existing expensive operation
  return new Promise((resolve) => setTimeout(resolve, 2000));
};

const isCriticalForm = () => {
  // Determine if this is a critical form (payment, registration, etc.)
  return true;
};

export default {
  ExampleUserContextIntegration,
  ExampleAPIErrorHandling,
  ExampleComponentWithErrorHandling,
  ExampleRouteTracking,
  ExampleFormErrorTracking,
  ExamplePerformanceTracking,
};

