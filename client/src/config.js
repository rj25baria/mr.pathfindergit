// Determine if running locally
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Build API URL with proper fallbacks
const getApiUrl = () => {
  // First priority: Environment variable (from Vercel)
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Second priority: Local development
  if (isLocal) {
    return `http://${window.location.hostname}:5000`;
  }
  
  // Third priority: Production fallback
  return 'https://mr-pathfinder.onrender.com';
};

export const API_URL = getApiUrl();

// Debug log (remove in production if needed)
console.log('API_URL configured:', API_URL);
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Is Local:', isLocal);
