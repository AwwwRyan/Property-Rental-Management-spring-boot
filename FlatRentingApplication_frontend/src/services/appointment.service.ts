import { API_BASE_URL, getAuthHeaders } from './api';
import { Appointment, AppointmentRequest, AppointmentResponse } from '@/types/appointment';
import axios from 'axios';

export class AppointmentService {
  static async getMyAppointments(token: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch your appointments');
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
      const response = await fetch(`${API_BASE_URL}/appointments/landlord-appointments`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

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
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

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
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      const data: AppointmentResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  static async updateAppointmentStatus(id: number, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED', token: string): Promise<AppointmentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status }),
      });

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

  static async cancelAppointment(id: number): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/appointments/${id}/cancel`);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
} 