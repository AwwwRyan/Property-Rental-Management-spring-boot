'use client';

import { useEffect, useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PropertyResponse } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/auth.context';
import { LandlordSidebar } from '@/components/layout/LandlordSidebar';
import { Plus } from 'lucide-react';

export default function LandlordPropertiesPage() {
  const { properties, isLoading, error } = useProperties();
  const [myProperties, setMyProperties] = useState<PropertyResponse[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (properties && user) {
      // Filter properties owned by the current user
      const owned = properties.filter(prop => prop.landlordId === user.userId);
      setMyProperties(owned);
    }
  }, [properties, user]);

  return (
    <ProtectedRoute allowedRoles={['LANDLORD']}>
      <div className="flex h-screen bg-gray-900">
        <LandlordSidebar />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My Properties</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Link href="/landlord/properties/new" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 p-4 rounded-lg text-red-300">
              {error}
            </div>
          ) : myProperties.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-medium text-white mb-2">You don't have any properties yet</h3>
                <p className="text-gray-400 mb-6">Start by adding your first property to the platform</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/landlord/properties/new" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map(property => (
                <Card key={property.propertyId} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">{property.title}</CardTitle>
                    <CardDescription className="text-gray-400">{property.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4 line-clamp-2">{property.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.status === 'AVAILABLE' 
                          ? 'bg-green-900/30 text-green-400' 
                          : property.status === 'RENTED' 
                            ? 'bg-blue-900/30 text-blue-400' 
                            : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {property.status}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Link href={`/landlord/properties/${property.propertyId}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Link href={`/landlord/properties/${property.propertyId}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 