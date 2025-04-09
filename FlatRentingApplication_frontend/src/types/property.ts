export interface Property {
  property_id: number;
  title: string;
  property_name: string;
  description: string;
  address: string;
  price: number;
  location: string;
  property_type: string;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
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
  status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
}

export interface PropertyResponse {
  propertyId: number;
  title: string;
  description: string;
  price: number;
  location: string;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  propertyType: string;
  landlordId: number;
  landlordName: string;
} 