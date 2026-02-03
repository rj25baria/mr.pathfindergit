const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const getApiUrl = () => {
  // 1️⃣ Vercel / Production
  if (import.meta.env.VITE_API_URL?.trim()) {
    return import.meta.env.VITE_API_URL;
  }

  // 2️⃣ Local development
  if (isLocal) {
    return `http://${window.location.hostname}:5000`;
  }

  // 3️⃣ Safety fallback (should never hit)
  throw new Error('API URL not configured');
};

export const API_URL = getApiUrl();
