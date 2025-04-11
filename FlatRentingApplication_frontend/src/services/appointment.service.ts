import { API_BASE_URL, getAuthHeaders } from './api';
import { Appointment, AppointmentRequest, AppointmentResponse } from '@/types/appointment';
import { fetchWithAuthInterceptor } from './api-interceptor';

export class AppointmentService {
  static async getMyAppointments(token: string): Promise<Appointment[]> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await fetchWithAuthInterceptor(
        `${API_BASE_URL}/appointments/my-appointments`,
        {
          method: 'GET',
          headers: getAuthHeaders(token),
        },
        token
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch your appointments');
      }

      const data: Appointment[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching your appointments:', error);
      throw error;
    }
  }

  static async getLandlordAppointments(token: string): Promise<Appointment[]> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await fetchWithAuthInterceptor(
        `${API_BASE_URL}/appointments/landlord-appointments`,
        {
          method: 'GET',
          headers: getAuthHeaders(token),
        },
        token
      );

      if (!response.ok) {
        throw new Error('Failed to fetch landlord appointments');
      }

      const data: Appointment[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching landlord appointments:', error);
      throw error;
    }
  }

  static async getAppointmentById(id: number, token: string): Promise<Appointment> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await fetchWithAuthInterceptor(
        `${API_BASE_URL}/appointments/${id}`,
        {
          method: 'GET',
          headers: getAuthHeaders(token),
        },
        token
      );

      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }

      const data: Appointment = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  static async createAppointment(appointment: AppointmentRequest, token: string): Promise<AppointmentResponse> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const formattedDateTime = appointment.appointmentDateTime.replace(/\.\d{3}Z$/, '');
      
      const requestBody = {
        propertyId: String(appointment.propertyId),
        appointmentDateTime: formattedDateTime,
        message: appointment.message
      };

      console.log('Creating appointment with data:', requestBody);
      console.log('Using token:', token.substring(0, 10) + '...'); // Log first 10 chars of token for debugging
      
      const headers = getAuthHeaders(token);
      console.log('Request headers:', headers);

      const response = await fetchWithAuthInterceptor(
        `${API_BASE_URL}/appointments`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
        },
        token
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Appointment creation failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          headers: Object.fromEntries(response.headers.entries()),
          requestHeaders: headers
        });
        
        throw new Error(errorData.message || `Failed to create appointment: ${response.status} ${response.statusText}`);
      }

      const data: AppointmentResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  static async updateAppointmentStatus(
    id: number, 
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED', 
    token: string
  ): Promise<AppointmentResponse> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await fetchWithAuthInterceptor(
        `${API_BASE_URL}/appointments/${id}/status`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(token),
          body: JSON.stringify({ status }),
        },
        token
      );

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      const data: AppointmentResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  static async cancelAppointment(id: number, token: string): Promise<void> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await fetchWithAuthInterceptor(
        `${API_BASE_URL}/appointments/${id}/cancel`,
        {
          method: 'PUT',
          headers: getAuthHeaders(token)
        },
        token
      );

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
} 