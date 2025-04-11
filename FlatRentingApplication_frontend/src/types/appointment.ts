import { Property } from './property';

export interface Appointment {
  appointmentId: number;
  property: {
    property_id: number;
    title: string;
    property_name: string;
    description: string;
    address: string;
    price: number;
    location: string;
    property_type: string;
    status: string;
    number_of_rooms: number;
    furnished_status: string;
    property_size: number;
    created_at: string;
    updated_at: string;
  };
  userId: number;
  appointmentDateTime: string;
  message: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export interface AppointmentRequest {
  propertyId: number;
  appointmentDateTime: string;
  message: string;
}

export interface AppointmentResponse {
  appointmentId: number;
  property: {
    property_id: number;
    title: string;
    property_name: string;
    description: string;
    address: string;
    price: number;
    location: string;
    property_type: string;
    status: string;
    number_of_rooms: number;
    furnished_status: string;
    property_size: number;
    created_at: string;
    updated_at: string;
  };
  userId: number;
  appointmentDateTime: string;
  message: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
} 