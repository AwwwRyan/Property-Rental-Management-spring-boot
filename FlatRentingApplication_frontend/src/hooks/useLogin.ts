import { useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { LoginRequest, LoginResponse, AuthError } from '@/types/auth';
import { useAuth } from '@/context/auth.context';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(credentials);
      login(response);
      
      // Redirect based on user role
      if (response.role === 'TENANT') {
        router.push('/tenant/dashboard');
      } else if (response.role === 'LANDLORD') {
        router.push('/landlord/dashboard');
      } else {
        router.push('/dashboard');
      }
      
      return response;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
}; 