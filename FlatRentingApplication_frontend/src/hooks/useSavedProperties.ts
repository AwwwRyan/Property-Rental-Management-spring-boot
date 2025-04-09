import { useState, useEffect } from 'react';
import { PropertyResponse } from '@/types/property';
import { useAuth } from '@/context/auth.context';

export const useSavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState<PropertyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch saved properties from localStorage
  const fetchSavedProperties = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use localStorage to simulate saved properties
      const savedPropertyIds = JSON.parse(localStorage.getItem('savedProperties') || '[]');
      
      // If we have property data in localStorage, use it
      const savedPropertyData = localStorage.getItem('savedPropertyData');
      if (savedPropertyData) {
        setSavedProperties(JSON.parse(savedPropertyData));
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch saved properties');
      console.error(err);
      setIsLoading(false);
    }
  };

  // Save a property
  const saveProperty = (property: PropertyResponse) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use localStorage to simulate saving properties
      const savedPropertyIds = JSON.parse(localStorage.getItem('savedProperties') || '[]');
      
      if (!savedPropertyIds.includes(property.propertyId)) {
        savedPropertyIds.push(property.propertyId);
        localStorage.setItem('savedProperties', JSON.stringify(savedPropertyIds));
        
        // Also save the property data
        const currentSavedProperties = [...savedProperties];
        if (!currentSavedProperties.some(p => p.propertyId === property.propertyId)) {
          currentSavedProperties.push(property);
          setSavedProperties(currentSavedProperties);
          localStorage.setItem('savedPropertyData', JSON.stringify(currentSavedProperties));
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error saving property:', err);
      return false;
    }
  };

  // Remove a saved property
  const removeSavedProperty = (propertyId: number) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use localStorage to simulate removing saved properties
      const savedPropertyIds = JSON.parse(localStorage.getItem('savedProperties') || '[]');
      
      const updatedIds = savedPropertyIds.filter((id: number) => id !== propertyId);
      localStorage.setItem('savedProperties', JSON.stringify(updatedIds));
      
      // Also update the property data
      const updatedProperties = savedProperties.filter(p => p.propertyId !== propertyId);
      setSavedProperties(updatedProperties);
      localStorage.setItem('savedPropertyData', JSON.stringify(updatedProperties));
      
      return true;
    } catch (err) {
      console.error('Error removing saved property:', err);
      return false;
    }
  };

  // Check if a property is saved
  const isPropertySaved = (propertyId: number): boolean => {
    return savedProperties.some(p => p.propertyId === propertyId);
  };

  // Fetch saved properties on component mount
  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  return {
    savedProperties,
    isLoading,
    error,
    saveProperty,
    removeSavedProperty,
    isPropertySaved,
    fetchSavedProperties,
  };
}; 