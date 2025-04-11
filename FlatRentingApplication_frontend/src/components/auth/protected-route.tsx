'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import { useTokenExpirationCheck } from '@/hooks/useTokenExpirationCheck';

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
  
  // Use the token expiration check hook
  useTokenExpirationCheck();

  useEffect(() => {
    // Add debug logs
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - User Role:', user?.role);
    console.log('ProtectedRoute - Allowed Roles:', allowedRoles);
    console.log('ProtectedRoute - Is Role Allowed:', allowedRoles?.includes(user?.role || ''));

    if (!isLoading && !isAuthenticated) {
      // Comment out the automatic redirection
      // router.push('/login');
      return;
    }

    // Only redirect if the user's role is not in the allowed roles
    if (
      !isLoading && 
      isAuthenticated && 
      allowedRoles && 
      allowedRoles.length > 0 && 
      user && 
      !allowedRoles.includes(user.role)
    ) {
      // Comment out the automatic redirection
      // if (user.role === 'TENANT') {
      //   router.push('/tenant/dashboard');
      // } else if (user.role === 'LANDLORD') {
      //   router.push('/landlord/dashboard');
      // } else {
      //   router.push('/dashboard');
      // }
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

  // Add a button to manually trigger redirection
  return (
    <>
      {children}
      <button onClick={() => {
        if (!isAuthenticated) {
          router.push('/login');
        } else if (user?.role === 'TENANT') {
          router.push('/tenant/dashboard');
        } else if (user?.role === 'LANDLORD') {
          router.push('/landlord/dashboard');
        } else {
          router.push('/dashboard');
        }
      }}>
        Redirect Manually
      </button>
    </>
  );
}; 