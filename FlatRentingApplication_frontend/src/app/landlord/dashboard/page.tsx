'use client';

import { useEffect, useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { useAppointments } from '@/hooks/useAppointments';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PropertyResponse } from '@/types/property';
import { Appointment } from '@/types/appointment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/auth.context';

export default function LandlordDashboard() {
  const { properties, isLoading: propertiesLoading, error: propertiesError } = useProperties();
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointments();
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [myProperties, setMyProperties] = useState<PropertyResponse[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (appointments) {
      // Filter pending appointments for my properties
      const pending = appointments.filter(
        app => app.status === 'PENDING' && app.ownerId === user?.userId
      );
      setPendingAppointments(pending);
    }
  }, [appointments, user]);

  useEffect(() => {
    if (properties && user) {
      // Filter properties owned by the current user
      const owned = properties.filter(prop => prop.landlordId === user.userId);
      setMyProperties(owned);
    }
  }, [properties, user]);

  return (
    <ProtectedRoute allowedRoles={['LANDLORD']}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Property Landlord Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Appointments</CardTitle>
              <CardDescription>Appointments waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <p>Loading appointments...</p>
              ) : appointmentsError ? (
                <p className="text-red-500">{appointmentsError}</p>
              ) : pendingAppointments.length === 0 ? (
                <p>No pending appointments</p>
              ) : (
                <ul className="space-y-4">
                  {pendingAppointments.map(appointment => (
                    <li key={appointment.id} className="border p-4 rounded-md">
                      <p className="font-medium">Date: {new Date(appointment.date).toLocaleDateString()}</p>
                      <p>Time: {appointment.time}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {/* Handle confirm appointment */}}
                        >
                          Confirm
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {/* Handle cancel appointment */}}
                        >
                          Cancel
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Button className="mt-4 w-full">
                <Link href="/appointments">View All Appointments</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>My Properties</CardTitle>
              <CardDescription>Properties you own</CardDescription>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <p>Loading properties...</p>
              ) : propertiesError ? (
                <p className="text-red-500">{propertiesError}</p>
              ) : myProperties.length === 0 ? (
                <p>You don't have any properties yet</p>
              ) : (
                <ul className="space-y-4">
                  {myProperties.map(property => (
                    <li key={property.propertyId} className="border p-4 rounded-md">
                      <p className="font-medium">{property.title}</p>
                      <p>{property.description}</p>
                      <p className="text-sm text-gray-500">Status: {property.status}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Link href={`/landlord/properties/${property.propertyId}`}>View Details</Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Link href={`/landlord/properties/${property.propertyId}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Button className="mt-4 w-full">
                <Link href="/landlord/properties/new">Add New Property</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 