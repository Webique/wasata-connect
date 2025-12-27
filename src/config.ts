// API Configuration
// For production domain deployment:
// - Set VITE_API_BASE_URL to your API server URL (e.g., https://wasata-connect-api.onrender.com)
// - Or leave unset to use same origin (if API is on same domain as frontend)
// For local development, defaults to http://localhost:5000
const getApiBaseUrl = () => {
  // Priority 1: Explicitly set via environment variable (for production)
  if (import.meta.env.VITE_API_BASE_URL) {
    const url = import.meta.env.VITE_API_BASE_URL;
    // Remove trailing /api if present (endpoints already have /api prefix)
    return url.endsWith('/api') ? url.slice(0, -4) : url;
  }
  
  // Priority 2: If running on a domain (not localhost), use same origin
  // This assumes API is on the same domain (e.g., yourdomain.com/api)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
    
    if (!isLocalhost) {
      // Production: Use same origin (relative URLs will work)
      // API endpoints will be: https://yourdomain.com/api/...
      return window.location.origin;
    }
  }
  
  // Priority 3: Default to localhost for development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

