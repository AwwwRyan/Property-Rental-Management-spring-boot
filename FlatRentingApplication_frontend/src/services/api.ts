// API base URL
export const API_BASE_URL = 'http://localhost:8080/api';

// Default headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Function to get headers with authorization token
export const getAuthHeaders = (token?: string) => {
  if (!token) return defaultHeaders;
  
  // Always add 'Bearer ' prefix to the token
  const formattedToken = `Bearer ${token}`;
  
  console.log('Auth headers debug:', {
    tokenLength: token.length,
    formattedTokenLength: formattedToken.length,
    hasBearerPrefix: formattedToken.startsWith('Bearer '),
    tokenFirstChars: token.substring(0, 10) + '...'
  });
  
  return {
    ...defaultHeaders,
    'Authorization': formattedToken,
  };
}; 