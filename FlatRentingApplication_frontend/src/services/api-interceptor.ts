import { isTokenExpired } from '@/utils/token-utils';

// This function will be used to check if a response is unauthorized
export const isUnauthorizedResponse = (status: number): boolean => {
  return status === 401 || status === 403;
};

// This function will be used to handle unauthorized responses
export const handleUnauthorizedResponse = () => {
  // Clear the user data from localStorage
  localStorage.removeItem('user');
  
  // Redirect to the login page
  window.location.href = '/login';
};

// This function will be used to wrap fetch calls to handle unauthorized responses
export const fetchWithAuthInterceptor = async (
  url: string, 
  options: RequestInit, 
  token?: string
): Promise<Response> => {
  try {
    // Check if token is provided and not expired
    if (token && isTokenExpired(token)) {
      handleUnauthorizedResponse();
      throw new Error('Token expired. Please log in again.');
    }
    
    const response = await fetch(url, options);
    
    // Check if the response is unauthorized
    if (isUnauthorizedResponse(response.status)) {
      // Handle unauthorized response
      handleUnauthorizedResponse();
      throw new Error('Unauthorized access. Please log in again.');
    }
    
    return response;
  } catch (error) {
    // If the error is due to network issues, rethrow it
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw error;
    }
    
    // For other errors, check if they're related to authentication
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      handleUnauthorizedResponse();
    }
    
    throw error;
  }
}; 