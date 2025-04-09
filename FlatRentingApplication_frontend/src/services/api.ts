// API base URL
export const API_BASE_URL = 'http://localhost:8080/api';

// Default headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Function to get headers with authorization token
export const getAuthHeaders = (token?: string) => {
  if (!token) return defaultHeaders;
  
  return {
    ...defaultHeaders,
    'Authorization': `Bearer ${token}`,
  };
}; 