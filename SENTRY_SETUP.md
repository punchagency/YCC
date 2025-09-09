# Sentry Integration Setup

This document explains how to complete the Sentry integration for error monitoring in your React application.

## 🚀 What's Already Done

✅ Sentry SDK packages installed (`@sentry/react`, `@sentry/tracing`)
✅ Sentry initialization configured in `src/index.js`
✅ React Router integration with Sentry routing
✅ Error Boundary component created (`src/components/SentryErrorBoundary.js`)
✅ Error Boundary integrated into main App component
✅ Performance monitoring and tracing configured
✅ Session replay configured
✅ Custom error filtering (e.g., PrimeReact overlay errors)
✅ Sentry configuration file created (`src/config/sentry.js`)
✅ Helper functions for Sentry operations

## 🔧 Required Setup Steps

### 1. Create a Sentry Account and Project

1. Go to [https://sentry.io/](https://sentry.io/) and create an account
2. Create a new project and select "React" as the platform
3. Copy your DSN (Data Source Name) from the project settings

### 2. Configure Environment Variables

Create a `.env` file in your project root and add:

```env
# Sentry Configuration
REACT_APP_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# Optional: Set your API domain for performance tracing
REACT_APP_API_DOMAIN=https://your-api-domain.com
```

**Important:** Never commit your `.env` file to version control. Add it to `.gitignore`.

### 3. Update API Domains (Optional)

If you want performance tracing for your API calls, update the `tracePropagationTargets` in `src/config/sentry.js`:

```javascript
tracePropagationTargets: [
  "localhost",
  /^https:\/\/your-actual-api-domain\.com\/api/,
  // Add your actual API domains here
],
```

## 🎯 Features Included

### Error Monitoring
- Automatic error capture and reporting
- Custom error filtering to exclude known non-critical errors
- Error context and user information

### Performance Monitoring
- Automatic performance tracking
- API request monitoring
- Page load performance
- Custom transaction tracking

### Session Replay
- 10% of normal sessions recorded
- 100% of error sessions recorded
- Helps debug user experience issues

### Error Boundary
- React Error Boundary with Sentry integration
- Graceful error handling with user-friendly fallback UI
- Option to retry or reload the page

### Helper Functions
Available in `src/config/sentry.js`:

```javascript
import { setSentryUser, addSentryBreadcrumb, captureException } from './config/sentry';

// Set user context
setSentryUser({ id: '123', email: 'user@example.com', username: 'user123' });

// Add custom breadcrumb
addSentryBreadcrumb('User clicked button', 'ui', 'info');

// Capture custom exception
captureException(new Error('Custom error'), { customContext: 'value' });
```

## 🔍 Testing the Integration

### 1. Test Error Capture
Add this button temporarily to any component to test error capture:

```javascript
<button onClick={() => { throw new Error('Test Sentry error!'); }}>
  Test Sentry Error
</button>
```

### 2. Test Performance Monitoring
Performance data will be automatically collected. Check your Sentry dashboard for:
- Page load times
- API request performance
- User interactions

### 3. Verify in Development
In development mode, you should see Sentry logs in the browser console indicating successful initialization.

## 📊 Monitoring Dashboard

Once configured, you can monitor your application through the Sentry dashboard:

- **Issues**: View and manage errors and exceptions
- **Performance**: Monitor application performance metrics
- **Releases**: Track deployments and their impact
- **Session Replay**: Watch user sessions to debug issues

## 🛠️ Customization Options

### Adjusting Sample Rates

In `src/config/sentry.js`, you can adjust:

```javascript
// Performance monitoring sample rate (0.0 to 1.0)
tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

// Session replay sample rates
replaysSessionSampleRate: 0.1, // 10% of sessions
replaysOnErrorSampleRate: 1.0, // 100% of error sessions
```

### Adding Custom Error Filters

Update the `beforeSend` function in `src/config/sentry.js` to filter out additional errors:

```javascript
beforeSend(event) {
  // Add your custom filters here
  if (event.exception) {
    const errorMessage = event.exception.values?.[0]?.value;
    
    // Example: Filter out specific errors
    if (errorMessage && errorMessage.includes('Your specific error')) {
      return null; // Don't send to Sentry
    }
  }
  
  return event;
}
```

## 🚨 Important Notes

1. **DSN Security**: Your DSN is safe to expose in client-side code - it only allows sending data to your Sentry project
2. **Sample Rates**: Adjust sample rates based on your traffic to control data volume and costs
3. **PII Data**: Be careful not to send personally identifiable information in error reports
4. **Performance Impact**: Sentry has minimal performance impact, but monitor your application after integration

## 📞 Support

If you encounter issues:
1. Check the browser console for Sentry initialization logs
2. Verify your DSN is correct
3. Check network tab for requests to Sentry
4. Review Sentry documentation: [https://docs.sentry.io/platforms/javascript/guides/react/](https://docs.sentry.io/platforms/javascript/guides/react/)

