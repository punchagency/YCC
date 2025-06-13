// API URL configuration
const isDevelopment = process.env.NODE_ENV === 'development';
export const API_URL = isDevelopment 
  ? "http://localhost:7000/api"
  : (process.env.REACT_APP_API_URL || "https://ycc-servers-82e51814e1e5.herokuapp.com/api");
