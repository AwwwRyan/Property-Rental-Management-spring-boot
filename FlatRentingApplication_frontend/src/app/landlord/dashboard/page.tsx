"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { LandlordSidebar } from "@/components/layout/LandlordSidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useLandlordProperties } from "@/hooks/useLandlordProperties";
import { useAppointments } from "@/hooks/useAppointments";
import Link from "next/link";

export default function LandlordDashboard() {
  const { properties, isLoading: propertiesLoading, error: propertiesError } = useLandlordProperties();
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointments();
  
  const activeProperties = properties.filter(prop => prop.status === 'AVAILABLE');
  
  // Prepare recent activity
  const recentActivity = [
    ...appointments.slice(0, 3).map(appointment => ({
      type: "appointment" as const,
      propertyName: appointment.property.title,
      tenantName: "Tenant", // Since tenant name is not in the Appointment type
      date: new Date(appointment.appointmentDateTime).toLocaleString(),
    })),
    ...properties.slice(0, 3).map(property => ({
      type: "listing" as const,
      title: property.title,
      date: new Date().toLocaleDateString(), // Since createdAt is not in PropertyResponse
    })),
  ].sort((a, b) => {
    const dateA = a.type === "appointment" ? new Date(a.date!) : new Date(a.date!);
    const dateB = b.type === "appointment" ? new Date(b.date!) : new Date(b.date!);
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 5);

  const isLoading = propertiesLoading || appointmentsLoading;
  const error = propertiesError || appointmentsError;

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['LANDLORD']}>
        <div className="flex h-screen bg-gray-900">
          <LandlordSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={['LANDLORD']}>
        <div className="flex h-screen bg-gray-900">
          <LandlordSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-900/30 p-6 rounded-lg text-red-300">
              {error}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['LANDLORD']}>
      <div className="flex h-screen bg-gray-900">
        <LandlordSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Top Section */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <Link href="/landlord/properties/new">
                            <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  size="lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Property
                </Button>
              </Link>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <p className="text-gray-400 text-sm mb-2">Total Listings</p>
                  <p className="text-white text-3xl font-semibold">
                    {properties.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <p className="text-gray-400 text-sm mb-2">Total Appointments</p>
                  <p className="text-white text-3xl font-semibold">
                    {appointments.length}
                  </p>
              </CardContent>
            </Card>
            
              <Card className="bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <p className="text-gray-400 text-sm mb-2">Active Properties</p>
                  <p className="text-white text-3xl font-semibold">
                    {activeProperties.length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl text-white font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {activity.type === "appointment" ? (
                        <div>
                          <p className="text-white">
                            New appointment booked for{" "}
                            <span className="text-blue-400">{activity.propertyName}</span>
                          </p>
                          <p className="text-gray-300 text-sm">
                            Tenant: {activity.tenantName} • Date: {activity.date}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-white">
                            New property listed:{" "}
                            <span className="text-blue-400">{activity.title}</span>
                          </p>
                          <p className="text-gray-300 text-sm">
                            Listed on: {activity.date}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 