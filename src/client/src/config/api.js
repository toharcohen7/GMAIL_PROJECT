// API Configuration for flexible URL management
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:12345';

export { API_BASE_URL };

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};