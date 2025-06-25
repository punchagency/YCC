/**
 * Utility function to construct API URLs consistently
 * Handles the case where API_URL might already include /api
 */
export const buildApiUrl = (endpoint) => {
  const API_URL =
    process.env.REACT_APP_API_URL || "https://ycc-servers2-5368640ed4f5.herokuapp.com/api";

  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  // Check if API_URL already includes /api
  if (API_URL.includes("/api")) {
    return `${API_URL}/${cleanEndpoint}`;
  } else {
    return `${API_URL}/api/${cleanEndpoint}`;
  }
};
