# Sentry Integration Guide

This guide explains how Sentry has been integrated across your YCC application for comprehensive error monitoring, performance tracking, and user experience insights.

## 🚀 What's Been Implemented

### 1. Centralized Sentry Service (`src/services/sentry/sentryService.js`)

A comprehensive service that provides:

- **Enhanced API error capture** with context
- **User action tracking** with breadcrumbs
- **Service operation monitoring** with performance metrics
- **User context management** for error attribution
- **Form validation error tracking**
- **Navigation event monitoring**
- **Axios interceptor setup** for automatic API monitoring

### 2. Enhanced Axios Configuration (`src/services/api/axiosConfig.js`)

- Automatic request/response interceptors with Sentry integration
- Performance tracking for API calls
- Enhanced error context capture
- Centralized API methods with built-in error handling

### 3. React Components Integration

#### Error Boundaries (`src/components/sentry/SentryErrorBoundaryWrapper.js`)
- Higher-order component for wrapping components with error boundaries
- Enhanced error fallback UI with retry functionality
- Component-specific error context
- Manual error capture hooks

#### Router Integration (`src/components/sentry/SentryRouterIntegration.js`)
- Automatic route change tracking
- Navigation performance monitoring
- Page interaction tracking
- Programmatic navigation tracking

### 4. Context Integration

#### User Context (`src/context/userContext.js`)
- Automatic user context updates in Sentry
- Login/logout event tracking
- User session management

### 5. Service Integration Examples

#### Auth Service (`src/services/authService.js`)
- Login/signup attempt tracking
- Success/failure event capture
- User context updates on authentication

#### Crew Order Service (`src/services/crew/crewOrderService.js`)
- Order creation monitoring
- Performance tracking for order operations
- Enhanced error context for order failures

#### Inventory Service (`src/services/inventory/inventoryService.js`)
- Inventory operation tracking
- Form data handling monitoring
- Success/failure event capture

## 🔧 How to Use in Your Components

### 1. Wrap Components with Error Boundaries

```javascript
import { withSentryErrorBoundary } from '../components/sentry/SentryErrorBoundaryWrapper';

const MyComponent = () => {
  // Your component code
};

export default withSentryErrorBoundary(MyComponent, {
  componentName: 'MyComponent',
  beforeCapture: (scope, error, errorInfo, props) => {
    // Add custom context
    scope.setContext('customData', { someValue: props.someValue });
  }
});
```

### 2. Track User Actions

```javascript
import { useComponentActionCapture } from '../components/sentry/SentryErrorBoundaryWrapper';

const MyComponent = () => {
  const captureAction = useComponentActionCapture('MyComponent');
  
  const handleButtonClick = () => {
    captureAction('button_click', { buttonType: 'submit' });
    // Your button logic
  };
  
  return <button onClick={handleButtonClick}>Submit</button>;
};
```

### 3. Track Navigation

```javascript
import { useNavigationTracking } from '../components/sentry/SentryRouterIntegration';

const MyComponent = () => {
  const navigate = useNavigationTracking();
  
  const handleNavigation = () => {
    navigate('/dashboard', { state: { from: 'menu' } });
  };
  
  return <button onClick={handleNavigation}>Go to Dashboard</button>;
};
```

### 4. Manual Error Capture

```javascript
import { useComponentErrorCapture } from '../components/sentry/SentryErrorBoundaryWrapper';

const MyComponent = () => {
  const captureError = useComponentErrorCapture('MyComponent');
  
  const handleAsyncOperation = async () => {
    try {
      await someAsyncOperation();
    } catch (error) {
      captureError(error, { operationType: 'async_operation' });
      // Handle error in UI
    }
  };
};
```

## 📊 Service Integration Pattern

### For New Services

```javascript
import { captureApiError, captureServiceOperation, captureUserAction } from '../sentry/sentryService';

export const myServiceFunction = async (data) => {
  return await captureServiceOperation(
    "My Service Operation",
    async () => {
      captureUserAction("service_attempt", { dataType: typeof data });
      
      const response = await axios.post('/api/endpoint', data);
      
      captureUserAction("service_success", { responseId: response.data.id });
      
      return { success: true, data: response.data };
    },
    {
      endpoint: "/api/endpoint",
      method: "POST",
      dataSize: JSON.stringify(data).length,
    }
  ).catch(error => {
    return {
      success: false,
      error: error.response?.data?.message || "Operation failed",
    };
  });
};
```

### For Existing Services

1. Import Sentry utilities:
   ```javascript
   import { captureApiError, captureServiceOperation, captureUserAction } from '../sentry/sentryService';
   ```

2. Wrap main operations with `captureServiceOperation`
3. Add user action tracking for important events
4. Provide context for errors

## 🎯 What Gets Tracked

### Automatic Tracking
- All API requests and responses
- Route changes and navigation
- Component errors and crashes
- User authentication events
- Performance metrics for slow operations

### Manual Tracking
- User interactions (clicks, form submissions)
- Business logic errors
- Custom events and milestones
- Form validation errors

## 📈 Performance Monitoring

### Automatic Performance Tracking
- API response times
- Route navigation timing
- Component render performance
- Service operation duration

### Slow Operation Alerts
- Operations taking > 5 seconds are flagged
- API calls > 3 seconds are logged as warnings
- Context includes operation details and user information

## 🔍 Error Context

Each error includes:
- **User context**: ID, email, role, subscription
- **Route context**: Current page, navigation state
- **Component context**: Component name, props, error boundary info
- **API context**: Endpoint, method, payload, response status
- **Performance context**: Operation duration, timestamps
- **Browser context**: User agent, viewport size

## 🛠️ Customization

### Adding Custom Context

```javascript
import * as Sentry from "@sentry/react";

// Add custom context for specific operations
Sentry.setContext("business", {
  operation: "order_processing",
  orderId: "12345",
  customerType: "premium"
});
```

### Custom Breadcrumbs

```javascript
import { addSentryBreadcrumb } from '../config/sentry';

addSentryBreadcrumb(
  "User completed checkout process",
  "business",
  "info"
);
```

### Custom Tags

```javascript
import * as Sentry from "@sentry/react";

Sentry.setTag("feature", "inventory_management");
Sentry.setTag("user_tier", "premium");
```

## 🚨 Best Practices

### DO:
- Wrap critical components with error boundaries
- Track important user actions
- Provide meaningful context for errors
- Use service operation wrappers for API calls
- Update user context on authentication changes

### DON'T:
- Track sensitive information (passwords, API keys)
- Over-track minor interactions
- Include large payloads in error context
- Track PII without user consent
- Ignore performance implications of tracking

## 📞 Troubleshooting

### Common Issues:

1. **Sentry not capturing errors**
   - Check DSN configuration in `.env`
   - Verify Sentry initialization in `index.js`
   - Ensure error boundaries are properly wrapped

2. **Performance issues**
   - Review breadcrumb frequency
   - Check context data size
   - Verify sample rates in configuration

3. **Missing user context**
   - Ensure `updateUserContext` is called on login
   - Check localStorage user data format
   - Verify context clearing on logout

### Debug Mode:
Set `debug: true` in Sentry configuration to see console logs of all Sentry operations.

## 📋 Next Steps

1. **Review Error Patterns**: Check Sentry dashboard for common error patterns
2. **Optimize Performance**: Adjust sample rates based on traffic
3. **Custom Alerts**: Set up alerts for critical errors
4. **Team Training**: Ensure team understands how to use Sentry utilities
5. **Regular Review**: Weekly review of error trends and user experience issues

## 📚 Additional Resources

- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Error Boundaries](https://docs.sentry.io/platforms/javascript/guides/react/components/errorboundary/)
