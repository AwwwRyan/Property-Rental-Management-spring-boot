import { useEffect } from 'react';
import { useAuth } from '@/context/auth.context';
import { isTokenExpired } from '@/utils/token-utils';
import { useRouter } from 'next/navigation';

export const useTokenExpirationCheck = (checkInterval = 60000) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If there's no user, no need to check token expiration
    if (!user || !user.accessToken) {
      return;
    }

    // Function to check token expiration
    const checkTokenExpiration = () => {
      if (isTokenExpired(user.accessToken)) {
        // Token is expired, log out the user and redirect to login page
        logout();
        router.push('/login');
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Set up interval to check periodically
    const intervalId = setInterval(checkTokenExpiration, checkInterval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [user, logout, router, checkInterval]);
}; 