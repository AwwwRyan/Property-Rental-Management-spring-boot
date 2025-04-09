import { useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { SignupRequest, AuthError } from '@/types/auth';
import { useAuth } from '@/context/auth.context';
import { useRouter } from 'next/navigation';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = async (userData: SignupRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.signup(userData);
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
      setError(authError.message || 'An error occurred during signup');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSignup,
    isLoading,
    error,
  };
}; 