// API Configuration
// In production, set VITE_API_BASE_URL in Netlify environment variables
// Should be: https://wasata-connect-api.onrender.com/api
const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Normalize URL - ensure it ends with /api
export const API_BASE_URL = envUrl.endsWith('/api') 
  ? envUrl 
  : envUrl.endsWith('/') 
    ? `${envUrl.slice(0, -1)}/api`
    : `${envUrl}/api`;

