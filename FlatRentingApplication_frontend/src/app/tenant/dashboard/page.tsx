'use client';

import { useEffect, useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { useAppointments } from '@/hooks/useAppointments';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { useAuth } from '@/context/auth.context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PropertyResponse } from '@/types/property';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Heart, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Sidebar } from '@/components/layout/Sidebar';

// Sample property images for the recent activity section
const propertyImages = [
  '/images/apartment1.jpg',
  '/images/studio1.jpg',
  '/images/dorm1.jpg',
  '/images/duplex1.jpg',
  '/images/penthouse1.jpg',
];

export default function TenantDashboard() {
  const { user } = useAuth();
  const { properties, isLoading: propertiesLoading, error: propertiesError } = useProperties();
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointments();
  const { savedProperties, isLoading: savedPropertiesLoading } = useSavedProperties();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [availableProperties, setAvailableProperties] = useState<PropertyResponse[]>([]);

  useEffect(() => {
    if (appointments) {
      // Filter upcoming appointments (status is PENDING or APPROVED)
      const upcoming = appointments.filter(
        app => app.status === 'PENDING' || app.status === 'APPROVED'
      );
      setUpcomingAppointments(upcoming);
    }
  }, [appointments]);

  useEffect(() => {
    if (properties) {
      // Filter available properties
      const available = properties.filter(prop => prop.status === 'AVAILABLE');
      setAvailableProperties(available);
    }
  }, [properties]);

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'APPROVED':
        return 'bg-green-900/30 text-green-400';
      case 'REJECTED':
        return 'bg-red-900/30 text-red-400';
      case 'CANCELLED':
        return 'bg-gray-900/30 text-gray-400';
      case 'COMPLETED':
        return 'bg-blue-900/30 text-blue-400';
      default:
        return '';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['TENANT']}>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-gray-800 shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Hello, {user?.email.split('@')[0] || 'Tenant'}
                </h1>
                <p className="text-gray-400">Welcome to your dashboard</p>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Appointments Booked</p>
                      <h3 className="text-2xl font-bold mt-1 text-white">{upcomingAppointments.length}</h3>
                    </div>
                    <div className="bg-blue-900/30 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Upcoming Viewings</p>
                      <h3 className="text-2xl font-bold mt-1 text-white">
                        {upcomingAppointments.filter(app => app.status === 'APPROVED').length}
                      </h3>
                    </div>
                    <div className="bg-green-900/30 p-3 rounded-full">
                      <Eye className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Saved Properties</p>
                      <h3 className="text-2xl font-bold mt-1 text-white">{savedProperties.length}</h3>
                    </div>
                    <div className="bg-pink-900/30 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-pink-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Properties */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Available Properties</h2>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProperties.slice(0, 3).map((property) => (
                  <PropertyCard 
                    key={property.propertyId} 
                    property={property} 
                    showSaveButton={true}
                  />
                ))}
              </div>
            </div>

            {/* Appointments Status */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Appointments Status</h2>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {appointments.slice(0, 5).map((appointment) => (
                    <Card key={appointment.appointmentId} className="min-w-[300px] bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white truncate">
                            {appointment.property.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            {appointment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {new Date(appointment.appointmentDateTime).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {appointment.message || 'No message provided'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 