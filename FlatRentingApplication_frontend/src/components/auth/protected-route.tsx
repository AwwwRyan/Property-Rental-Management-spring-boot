'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (
      !isLoading && 
      isAuthenticated && 
      allowedRoles && 
      allowedRoles.length > 0 && 
      user && 
      !allowedRoles.includes(user.role)
    ) {
      // Redirect based on user role
      if (user.role === 'TENANT') {
        router.push('/tenant/dashboard');
      } else if (user.role === 'LANDLORD') {
        router.push('/landlord/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}; 