import { Property } from './property';

export interface Appointment {
  id: number;
  propertyId: number;
  property?: Property;
  tenantId: number;
  ownerId: number;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRequest {
  propertyId: number;
  date: string;
  time: string;
  notes?: string;
}

export interface AppointmentResponse {
  id: number;
  propertyId: number;
  tenantId: number;
  ownerId: number;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes: string;
  createdAt: string;
  updatedAt: string;
} 