import { API_BASE_URL, getAuthHeaders } from './api';
import { Property, PropertyRequest, PropertyResponse } from '@/types/property';

export class PropertyService {
  /**
   * Get all properties
   * @returns List of properties
   */
  static async getAllProperties(): Promise<PropertyResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  /**
   * Get a single property by ID
   * @param id Property ID
   * @returns Property details
   */
  static async getPropertyById(id: number): Promise<Property> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new property (landlord only)
   * @param property Property data
   * @returns Created property
   */
  static async createProperty(property: PropertyRequest): Promise<PropertyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: You must be a landlord to create properties');
        }
        throw new Error('Failed to create property');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  /**
   * Update an existing property (landlord only)
   * @param id Property ID
   * @param property Updated property data
   * @returns Updated property
   */
  static async updateProperty(id: number, property: PropertyRequest): Promise<PropertyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: You must be a landlord to update properties');
        }
        throw new Error('Failed to update property');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating property with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a property (landlord only)
   * @param id Property ID
   */
  static async deleteProperty(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: You must be a landlord to delete properties');
        }
        throw new Error('Failed to delete property');
      }
    } catch (error) {
      console.error(`Error deleting property with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get properties owned by the current landlord
   * @returns List of properties owned by the current landlord
   */
  static async getMyProperties(): Promise<PropertyResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/my-properties`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: You must be a landlord to view your properties');
        }
        throw new Error('Failed to fetch your properties');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching your properties:', error);
      throw error;
    }
  }

  /**
   * Search properties with filters
   * @param filters Search filters
   * @returns List of properties matching the filters
   */
  static async searchProperties(filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    propertyType?: string;
  }): Promise<PropertyResponse[]> {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/properties/search${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to search properties');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }
} 