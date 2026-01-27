const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = import.meta.env.VITE_API_URL || (isLocal ? `http://${window.location.hostname}:5000` : 'https://mr-pathfinder1.onrender.com');
