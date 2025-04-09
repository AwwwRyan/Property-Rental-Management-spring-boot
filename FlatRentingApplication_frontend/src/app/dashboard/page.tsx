'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to role-specific dashboard if user has a role
    if (user) {
      if (user.role === 'TENANT') {
        router.push('/tenant/dashboard');
      } else if (user.role === 'LANDLORD') {
        router.push('/landlord/dashboard');
      }
    }
  }, [user, router]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Flat Renting</CardTitle>
              <CardDescription>
                You are logged in but don't have a specific role assigned.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Please select your role to access the appropriate dashboard:
              </p>
              <div className="flex flex-col gap-4">
                <Button asChild>
                  <Link href="/tenant/dashboard">I want to rent a property</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/landlord/dashboard">I want to list my property</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 