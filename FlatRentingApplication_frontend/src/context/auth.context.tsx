'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginResponse, UserRole } from '@/types/auth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  login: (userData: LoginResponse) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup'];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Normalize the role when loading from storage
          if (parsedUser.role) {
            parsedUser.role = parsedUser.role.toUpperCase() as UserRole;
          }
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Add protection for authenticated routes
  useEffect(() => {
    // Don't redirect if still loading or if on a public route
    if (isLoading || PUBLIC_ROUTES.includes(pathname)) {
      return;
    }

    // Redirect to login if not authenticated and not on a public route
    if (!user) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  const login = (userData: LoginResponse) => {
    // Normalize the role to uppercase
    const normalizedUserData = {
      ...userData,
      role: userData.role.toUpperCase() as UserRole
    };
    setUser(normalizedUserData);
    localStorage.setItem('user', JSON.stringify(normalizedUserData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 