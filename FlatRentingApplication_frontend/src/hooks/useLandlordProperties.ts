import { useState, useEffect } from 'react';
import { PropertyService } from '@/services/property.service';
import { PropertyResponse } from '@/types/property';
import { useAuth } from '@/context/auth.context';

export const useLandlordProperties = () => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch properties owned by the current landlord
  const fetchMyProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user?.accessToken) {
        throw new Error('User not authenticated');
      }
      const myProperties = await PropertyService.getMyProperties(user.accessToken);
      setProperties(myProperties);
      return myProperties;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch your properties');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch properties on component mount
  useEffect(() => {
    if (user) {
      fetchMyProperties();
    }
  }, [user]);

  return {
    properties,
    isLoading,
    error,
    fetchMyProperties,
  };
}; 