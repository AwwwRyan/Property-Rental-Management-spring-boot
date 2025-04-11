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
import { LandlordSidebar } from '@/components/layout/LandlordSidebar';

export default function LandlordDashboard() {
  const { properties, isLoading: propertiesLoading, error: propertiesError } = useProperties();
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointments();
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [myProperties, setMyProperties] = useState<PropertyResponse[]>([]);
  const { user } = useAuth();

  // Add console log to check user role
  useEffect(() => {
    console.log('User object:', user);
    console.log('User role:', user?.role);
  }, [user]);

  useEffect(() => {
    if (appointments) {
      // Filter pending appointments for my properties
      const pending = appointments.filter(
        app => app.status === 'PENDING' && app.userId === user?.userId
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

  // Format appointment date and time
  const formatAppointmentDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <ProtectedRoute allowedRoles={['LANDLORD']}>
      <div className="flex h-screen bg-gray-900">
        <LandlordSidebar />
        
        <div className="flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Property Landlord Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pending Appointments</CardTitle>
                <CardDescription className="text-gray-400">Appointments waiting for your approval</CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <p className="text-gray-300">Loading appointments...</p>
                ) : appointmentsError ? (
                  <p className="text-red-500">{appointmentsError}</p>
                ) : pendingAppointments.length === 0 ? (
                  <p className="text-gray-300">No pending appointments</p>
                ) : (
                  <ul className="space-y-4">
                    {pendingAppointments.map(appointment => {
                      const { date, time } = formatAppointmentDateTime(appointment.appointmentDateTime);
                      return (
                        <li key={appointment.appointmentId} className="border border-gray-700 p-4 rounded-md">
                          <p className="font-medium text-white">Date: {date}</p>
                          <p className="text-gray-300">Time: {time}</p>
                          <div className="flex space-x-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              onClick={() => {/* Handle confirm appointment */}}
                            >
                              Confirm
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              onClick={() => {/* Handle cancel appointment */}}
                            >
                              Cancel
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/landlord/appointments">View All Appointments</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">My Properties</CardTitle>
                <CardDescription className="text-gray-400">Properties you own</CardDescription>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <p className="text-gray-300">Loading properties...</p>
                ) : propertiesError ? (
                  <p className="text-red-500">{propertiesError}</p>
                ) : myProperties.length === 0 ? (
                  <p className="text-gray-300">You don't have any properties yet</p>
                ) : (
                  <ul className="space-y-4">
                    {myProperties.map(property => (
                      <li key={property.propertyId} className="border border-gray-700 p-4 rounded-md">
                        <p className="font-medium text-white">{property.title}</p>
                        <p className="text-gray-300">{property.description}</p>
                        <p className="text-sm text-gray-400">Status: {property.status}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Link href={`/landlord/properties/${property.propertyId}`}>View Details</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Link href={`/landlord/properties/${property.propertyId}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/landlord/properties/new">Add New Property</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 