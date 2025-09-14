// src/apiConfig.js
const getApiBaseUrl = () => {
  // Check if we're in development or production
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  } else {
    // Use the environment variable if available, otherwise fallback to production URL
    return process.env.REACT_APP_API_URL || 'https://backend-phi-coral-55.vercel.app';
  }
};

export const API_BASE_URL = getApiBaseUrl();