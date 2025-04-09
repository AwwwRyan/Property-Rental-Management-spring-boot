'use client';

import { useState, useEffect } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { Appointment } from '@/types/appointment';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Home,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock4
} from 'lucide-react';
import { format } from 'date-fns';

export default function AppointmentsPage() {
  const { appointments, isLoading, error, cancelAppointment } = useAppointments();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  // Filter and sort appointments
  const filteredAppointments = appointments?.filter(appointment => {
    if (selectedStatus === 'all') return true;
    return appointment.status.toLowerCase() === selectedStatus.toLowerCase();
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return 0;
  });

  // Handle appointment cancellation
  const handleCancelClick = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (selectedAppointmentId) {
      await cancelAppointment(selectedAppointmentId);
      setShowCancelDialog(false);
      setSelectedAppointmentId(null);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      PENDING: {
        bg: 'bg-gray-700',
        text: 'text-gray-400',
        icon: Clock4,
        label: 'Pending'
      },
      CONFIRMED: {
        bg: 'bg-green-900/30',
        text: 'text-green-400',
        icon: CheckCircle2,
        label: 'Confirmed'
      },
      CANCELLED: {
        bg: 'bg-red-900/30',
        text: 'text-red-400',
        icon: XCircle,
        label: 'Cancelled'
      }
    }[status] || {
      bg: 'bg-gray-700',
      text: 'text-gray-400',
      icon: Clock4,
      label: status
    };

    const Icon = statusConfig.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
        <Icon className="w-4 h-4 mr-1" />
        {statusConfig.label}
      </span>
    );
  };

  return (
    <ProtectedRoute allowedRoles={['TENANT']}>
      <div className="flex h-screen bg-gray-900">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">My Appointments</h1>
                <p className="text-gray-400">
                  {filteredAppointments?.length || 0} appointment{filteredAppointments?.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-white">All Status</SelectItem>
                    <SelectItem value="pending" className="text-white">Pending</SelectItem>
                    <SelectItem value="confirmed" className="text-white">Confirmed</SelectItem>
                    <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="date" className="text-white">Date</SelectItem>
                    <SelectItem value="status" className="text-white">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Appointments List */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 p-6 rounded-lg text-red-400 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>{error}</p>
              </div>
            ) : filteredAppointments?.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No appointments found</h3>
                <p className="text-gray-400">You haven't booked any appointments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments?.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="bg-gray-800 rounded-lg shadow-sm p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Property Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-2">
                          {appointment.property?.title || `Property #${appointment.propertyId}`}
                        </h3>
                        <div className="flex items-center text-gray-300 mb-2">
                          <Home className="h-4 w-4 mr-2" />
                          <span>{appointment.property?.property_type || 'Property Details Unavailable'}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{appointment.property?.location || 'Location unavailable'}</span>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(new Date(appointment.date), 'PPP')}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{format(new Date(`${appointment.date}T${appointment.time}`), 'p')}</span>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end">
                        {appointment.status !== 'CANCELLED' && (
                          <Button
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                            onClick={() => handleCancelClick(appointment.id)}
                          >
                            Cancel Appointment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Cancel Appointment</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Appointment
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCancelConfirm}
              >
                Yes, Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
} 