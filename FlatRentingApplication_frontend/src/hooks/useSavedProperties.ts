import { useState, useEffect } from 'react';
import { PropertyResponse } from '@/types/property';
import { useAuth } from '@/context/auth.context';

const STORAGE_KEY = 'saved_properties';

export const useSavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState<PropertyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load saved properties from localStorage
  const loadSavedProperties = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedProperties(parsed);
      }
    } catch (err) {
      console.error('Error loading saved properties:', err);
      setError('Failed to load saved properties');
    }
  };

  // Save properties to localStorage
  const saveToStorage = (properties: PropertyResponse[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      setError('Failed to save properties');
    }
  };

  // Fetch saved properties
  const fetchSavedProperties = () => {
    setIsLoading(true);
    setError(null);
    loadSavedProperties();
    setIsLoading(false);
  };

  // Save a property
  const saveProperty = (property: PropertyResponse) => {
    try {
      const isAlreadySaved = savedProperties.some(p => p.propertyId === property.propertyId);
      if (!isAlreadySaved) {
        const updatedProperties = [...savedProperties, property];
        setSavedProperties(updatedProperties);
        saveToStorage(updatedProperties);
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
      const updatedProperties = savedProperties.filter(p => p.propertyId !== propertyId);
      setSavedProperties(updatedProperties);
      saveToStorage(updatedProperties);
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

  // Load saved properties on component mount
  useEffect(() => {
    fetchSavedProperties();
  }, []);

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