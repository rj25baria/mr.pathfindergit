// Check if running in browser
const isBrowser = typeof window !== 'undefined';

// Determine if running locally (safe)
const isLocal =
  isBrowser &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

// Build API URL safely
const getApiUrl = () => {
  // 1️⃣ Vercel / Production env
  if (import.meta.env.VITE_API_URL?.trim()) {
    return import.meta.env.VITE_API_URL;
  }

  // 2️⃣ Local development
  if (isLocal) {
    return `http://${window.location.hostname}:5000`;
  }

  // 3️⃣ Production / Fallback
  // Instead of crashing, we log a warning and return an empty string.
  // This allows the UI to load (white screen fix) even if API calls fail.
  if (!import.meta.env.VITE_API_URL) {
    console.error('⚠️ VITE_API_URL is missing! API calls will fail.');
  }
  
  return '';
};

export const API_URL = getApiUrl();
