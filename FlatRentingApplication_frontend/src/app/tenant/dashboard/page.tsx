'use client';

import { useEffect, useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { useAppointments } from '@/hooks/useAppointments';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { useAuth } from '@/context/auth.context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PropertyResponse } from '@/types/property';
import { Appointment } from '@/types/appointment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Heart, ChevronRight, User } from 'lucide-react';
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
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: number;
    title: string;
    image: string;
    status: 'Viewed' | 'Booked';
    date: string;
  }>>([]);

  useEffect(() => {
    if (appointments) {
      // Filter upcoming appointments (status is PENDING or CONFIRMED)
      const upcoming = appointments.filter(
        app => app.status === 'PENDING' || app.status === 'CONFIRMED'
      );
      setUpcomingAppointments(upcoming);
    }
  }, [appointments]);

  useEffect(() => {
    if (properties) {
      // Filter available properties
      const available = properties.filter(prop => prop.status === 'AVAILABLE');
      setAvailableProperties(available);
      
      // Create recent activity data
      const activity = available.slice(0, 5).map((prop, index) => ({
        id: prop.propertyId,
        title: prop.title,
        image: propertyImages[index % propertyImages.length],
        status: index % 2 === 0 ? 'Viewed' as const : 'Booked' as const,
        date: new Date(Date.now() - index * 86400000).toLocaleDateString(), // Last few days
      }));
      setRecentActivity(activity);
    }
  }, [properties]);

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
                        {upcomingAppointments.filter(app => app.status === 'CONFIRMED').length}
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

            {/* Recent Activity */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {recentActivity.map((item) => (
                    <Card key={item.id} className="min-w-[250px] bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-40 w-full">
                        <div className="absolute inset-0 bg-gray-700 rounded-t-xl">
                          {/* In a real app, use actual property images */}
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Property Image
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'Viewed' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-white truncate">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.date}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Properties */}
            <div>
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
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 