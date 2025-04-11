// Function to check if a token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    // JWT tokens are base64 encoded and contain three parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Not a valid JWT token
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if the token has an expiration time
    if (!payload.exp) {
      return true; // No expiration time found
    }

    // Check if the token is expired
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, assume the token is expired
  }
};

// Function to get token expiration time
export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return null;
  }
}; 