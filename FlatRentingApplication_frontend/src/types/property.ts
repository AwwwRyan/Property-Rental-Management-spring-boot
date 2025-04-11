export type PropertyStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'NOT_AVAILABLE'

export interface Property {
  property_id: number;
  title: string;
  property_name: string;
  description: string;
  address: string;
  price: number;
  location: string;
  property_type: string;
  status: PropertyStatus;
  number_of_rooms: number;
  furnished_status: string;
  property_size: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyRequest {
  title: string;
  propertyName: string;
  description: string;
  address: string;
  price: number;
  location: string;
  propertyType: string;
  numberOfRooms: number;
  furnishedStatus: string;
  propertySize: number;
  status?: PropertyStatus;
}

export interface PropertyResponse {
  propertyId: number;
  title: string;
  description: string;
  price: number;
  location: string;
  status: PropertyStatus;
  propertyType: string;
  landlordId: number;
  landlordName: string;
} 