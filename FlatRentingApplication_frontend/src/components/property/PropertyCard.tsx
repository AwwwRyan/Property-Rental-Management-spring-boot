import React from 'react';
import { PropertyResponse } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff } from 'lucide-react';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import Link from 'next/link';

interface PropertyCardProps {
  property: PropertyResponse;
  showSaveButton?: boolean;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showSaveButton = true,
  className = '',
}) => {
  const { isPropertySaved, saveProperty, removeSavedProperty } = useSavedProperties();
  const isSaved = isPropertySaved(property.propertyId);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      removeSavedProperty(property.propertyId);
    } else {
      saveProperty(property);
    }
  };

  return (
    <Card className={`bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <Link href={`/tenant/properties/${property.propertyId}`}>
        <div className="relative h-48 w-full">
          <div className="absolute inset-0 bg-gray-700 rounded-t-xl">
            {/* In a real app, use actual property images */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Property Image
            </div>
          </div>
          
          {showSaveButton && (
            <button
              onClick={handleSaveToggle}
              className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 shadow-sm hover:bg-gray-700 transition-colors"
              aria-label={isSaved ? "Remove from saved properties" : "Save property"}
            >
              {isSaved ? (
                <Heart className="h-5 w-5 text-pink-400" />
              ) : (
                <HeartOff className="h-5 w-5 text-gray-400" />
              )}
            </button>
          )}
          
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              property.status === 'AVAILABLE' 
                ? 'bg-green-900/30 text-green-400' 
                : property.status === 'RENTED' 
                  ? 'bg-blue-900/30 text-blue-400' 
                  : 'bg-yellow-900/30 text-yellow-400'
            }`}>
              {property.status}
            </span>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/tenant/properties/${property.propertyId}`}>
          <h3 className="font-medium text-white hover:text-blue-400 transition-colors">
            {property.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-400">{property.location}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold text-white">${property.price}/month</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-400 border-blue-800 hover:bg-blue-900/30"
            asChild
          >
            <Link href={`/tenant/properties/${property.propertyId}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 