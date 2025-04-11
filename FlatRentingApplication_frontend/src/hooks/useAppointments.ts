import { useState, useEffect } from 'react';
import { AppointmentService } from '@/services/appointment.service';
import { Appointment, AppointmentRequest, AppointmentStatus } from '@/types/appointment';
import { useAuth } from '@/context/auth.context';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get tenant's appointments
  const fetchMyAppointments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user?.accessToken) {
        throw new Error('User not authenticated');
      }
      
      const data = await AppointmentService.getMyAppointments(user.accessToken);
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch your appointments');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get landlord's appointments
  const fetchLandlordAppointments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user?.accessToken) {
        throw new Error('User not authenticated');
      }
      
      const data = await AppointmentService.getLandlordAppointments(user.accessToken);
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch landlord appointments');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAppointmentById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user?.accessToken) {
        throw new Error('User not authenticated');
      }
      
      const appointment = await AppointmentService.getAppointmentById(id, user.accessToken);
      return appointment;
    } catch (err) {
      setError('Failed to fetch appointment');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (appointment: AppointmentRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user?.accessToken) {
        throw new Error('User not authenticated');
      }
      
      console.log('Creating appointment with token:', user.accessToken.substring(0, 10) + '...');
      
      const newAppointment = await AppointmentService.createAppointment(appointment, user.accessToken);
      setAppointments(prev => [...prev, newAppointment as Appointment]);
      return newAppointment;
    } catch (err) {
      console.error('Error in createAppointment hook:', err);
      setError('Failed to create appointment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, status: AppointmentStatus) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user?.accessToken) {
        throw new Error('User not authenticated');
      }
      
      const updatedAppointment = await AppointmentService.updateAppointmentStatus(id, status, user.accessToken);
      setAppointments(prev => prev.map(a => a.appointmentId === id ? updatedAppointment as Appointment : a));
      return updatedAppointment;
    } catch (err) {
      setError('Failed to update appointment status');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (id: number) => {
    try {
      if (!user?.accessToken) {
        throw new Error('User not authenticated');
      }
      
      await AppointmentService.cancelAppointment(id, user.accessToken);
      await fetchMyAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      // Fetch appointments based on user role
      if (user.role === 'TENANT') {
        fetchMyAppointments();
      } else if (user.role === 'LANDLORD') {
        fetchLandlordAppointments();
      }
    }
  }, [user]);

  return {
    appointments,
    isLoading,
    error,
    fetchMyAppointments,
    fetchLandlordAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment
  };
}; 