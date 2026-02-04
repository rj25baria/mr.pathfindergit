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
  // If VITE_API_URL is missing in Vercel, fallback to the known Render URL.
  // This ensures the app works even if the user forgets to set the environment variable.
  console.warn('⚠️ VITE_API_URL not found. Falling back to default Render URL.');
  return 'https://mr-pathfinder.onrender.com';
};

export const API_URL = getApiUrl();
