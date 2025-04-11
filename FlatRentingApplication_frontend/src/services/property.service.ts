import { API_BASE_URL, getAuthHeaders } from './api';
import { Property, PropertyRequest, PropertyResponse } from '@/types/property';
import { fetchWithAuthInterceptor } from './api-interceptor';

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
   * @param token Authentication token
   * @returns Property details
   */
  static async getPropertyById(id: number, token: string): Promise<Property> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
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
  static async createProperty(propertyData: PropertyRequest, token: string): Promise<PropertyResponse> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      console.log('Creating property with data:', {
        ...propertyData,
        tokenLength: token.length,
        tokenFirstChars: token.substring(0, 10) + '...',
        hasToken: !!token
      });

      const headers = getAuthHeaders(token);
      console.log('Request headers:', headers);

      const response = await fetchWithAuthInterceptor(
        `${API_BASE_URL}/properties`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(propertyData),
        },
        token
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create property: ${response.status} ${response.statusText}`);
      }

      const data: PropertyResponse = await response.json();
      return data;
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
  static async updateProperty(id: number, propertyData: PropertyRequest, token: string): Promise<PropertyResponse> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      console.log('Updating property:', {
        propertyId: id,
        tokenLength: token.length,
        tokenFirstChars: token.substring(0, 10) + '...'
      });

      const headers = getAuthHeaders(token);
      console.log('Request headers:', headers);

      const response = await fetchWithAuthInterceptor(
        `${API_BASE_URL}/properties/${id}`,
        {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(propertyData),
        },
        token
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Property update failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          headers: Object.fromEntries(response.headers.entries()),
          requestHeaders: headers
        });
        throw new Error(errorData.message || `Failed to update property: ${response.status} ${response.statusText}`);
      }

      const data: PropertyResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating property:', error);
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
   * @param token The access token for authentication
   * @returns List of properties owned by the current landlord
   */
  static async getMyProperties(token: string): Promise<PropertyResponse[]> {
    const response = await fetch(`${API_BASE_URL}/properties/my-properties`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    return response.json();
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