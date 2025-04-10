import { useState, useEffect } from 'react';
import { PropertyService } from '@/services/property.service';
import { Property, PropertyRequest, PropertyResponse } from '@/types/property';
import { useAuth } from '@/context/auth.context';

export const useProperties = () => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch all properties
  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await PropertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single property by ID
  const fetchPropertyById = async (id: number): Promise<Property | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const property = await PropertyService.getPropertyById(id);
      return property;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch property with ID ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new property
  const createProperty = async (propertyData: PropertyRequest): Promise<PropertyResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newProperty = await PropertyService.createProperty(propertyData);
      // Refresh the properties list
      await fetchProperties();
      return newProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing property
  const updateProperty = async (id: number, propertyData: PropertyRequest): Promise<PropertyResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProperty = await PropertyService.updateProperty(id, propertyData);
      // Refresh the properties list
      await fetchProperties();
      return updatedProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to update property with ID ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a property
  const deleteProperty = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await PropertyService.deleteProperty(id);
      // Refresh the properties list
      await fetchProperties();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete property with ID ${id}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch properties owned by the current landlord
  const fetchMyProperties = async (): Promise<PropertyResponse[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const myProperties = await PropertyService.getMyProperties();
      setProperties(myProperties);
      return myProperties;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch your properties');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Search properties with filters
  const searchProperties = async (filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    propertyType?: string;
  }): Promise<PropertyResponse[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await PropertyService.searchProperties(filters);
      setProperties(searchResults);
      return searchResults;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search properties');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    isLoading,
    error,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchMyProperties,
    searchProperties,
  };
}; 