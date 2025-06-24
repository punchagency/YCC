/**
 * Utility functions for URL construction
 */

/**
 * Get the base URL for the application, excluding any subdirectories
 * @returns {string} The base URL without subdirectories
 */
export const getBaseUrl = () => {
  // First try to use environment variable
  if (process.env.REACT_APP_FRONTEND_URL) {
    return process.env.REACT_APP_FRONTEND_URL;
  }
  
  // Fallback to window.location.origin, removing common subdirectories
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  
  // Remove common admin subdirectories
  const adminSubdirs = ['/admin', '/dashboard', '/panel'];
  for (const subdir of adminSubdirs) {
    if (pathname.startsWith(subdir)) {
      return origin.replace(subdir, '');
    }
  }
  
  return origin;
};

/**
 * Construct onboarding URL for vendors/suppliers
 * @param {string} type - 'supplier' or 'service_provider'
 * @param {string} userId - The user ID
 * @returns {string} The complete onboarding URL
 */
export const constructOnboardingUrl = (type, userId) => {
  const baseUrl = getBaseUrl();
  const urlPath = type === 'supplier' ? 'vendors' : 'services';
  return `${baseUrl}/${urlPath}/onboarding/${userId}`;
};

/**
 * Validate and normalize website URLs
 * @param {string} url - The URL to normalize
 * @returns {string} The normalized URL
 */
export const normalizeWebsiteUrl = (url) => {
  if (!url) return '';
  
  // Remove leading/trailing whitespace
  url = url.trim();
  
  // If URL doesn't start with http:// or https://, add https://
  if (!url.match(/^https?:\/\//)) {
    url = 'https://' + url;
  }
  
  return url;
}; 