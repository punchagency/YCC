// API URL configuration - uses .env file with fallback to production URL
export const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://ycc-servers2-5368640ed4f5.herokuapp.com/api";
