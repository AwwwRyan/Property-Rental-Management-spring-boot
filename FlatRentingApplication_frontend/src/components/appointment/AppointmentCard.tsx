import React from 'react';
import { Appointment } from '@/types/appointment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface AppointmentCardProps {
  appointment: Appointment;
  className?: string;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  className = '',
}) => {
  // Get status badge color and icon
  const getStatusInfo = () => {
    switch (appointment.status) {
      case 'CONFIRMED':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: 'Confirmed'
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="h-4 w-4 mr-1" />,
          text: 'Cancelled'
        };
      case 'COMPLETED':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: 'Completed'
        };
      case 'PENDING':
      default:
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          text: 'Pending'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-gray-800">Property Viewing</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.text}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{new Date(appointment.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{appointment.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>Property ID: {appointment.propertyId}</span>
          </div>
        </div>
        
        {appointment.notes && (
          <div className="mb-4 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p className="font-medium mb-1">Notes:</p>
            <p>{appointment.notes}</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            asChild
          >
            <Link href={`/appointments/${appointment.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 