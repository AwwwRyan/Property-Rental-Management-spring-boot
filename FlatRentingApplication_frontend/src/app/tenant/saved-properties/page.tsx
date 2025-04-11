'use client';

import { useState, useEffect } from 'react';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { PropertyResponse } from '@/types/property';
import { Sidebar } from '@/components/layout/Sidebar';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  SlidersHorizontal, 
  X,
  ChevronDown,
  Heart,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Sample cities for the dropdown
const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow'
];

// BHK options
const bhkOptions = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5', label: '5+ BHK' },
  { value: 'studio', label: 'Studio' }
];

export default function SavedPropertiesPage() {
  const { savedProperties, isLoading, error, removeSavedProperty } = useSavedProperties();
  const [filteredProperties, setFilteredProperties] = useState<PropertyResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedBHK, setSelectedBHK] = useState<string>('all');
  const [availability, setAvailability] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Apply filters when properties or filter values change
  useEffect(() => {
    if (savedProperties) {
      let filtered = [...savedProperties];
      
      // Apply search query filter
      if (searchQuery) {
        filtered = filtered.filter(property => 
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply city filter
      if (selectedCity !== 'all') {
        filtered = filtered.filter(property => 
          property.location.toLowerCase().includes(selectedCity.toLowerCase())
        );
      }
      
      // Apply price range filter
      filtered = filtered.filter(property => 
        property.price >= priceRange[0] && property.price <= priceRange[1]
      );
      
      // Apply BHK filter - using propertyType as a proxy for BHK
      if (selectedBHK !== 'all') {
        filtered = filtered.filter(property => 
          property.propertyType.toLowerCase().includes(selectedBHK)
        );
      }
      
      // Apply availability filter
      if (availability !== 'all') {
        filtered = filtered.filter(property => 
          property.status === availability.toUpperCase()
        );
      }
      
      setFilteredProperties(filtered);
      setShowEmptyState(filtered.length === 0);
    }
  }, [savedProperties, searchQuery, selectedCity, priceRange, selectedBHK, availability]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setPriceRange([0, 100000]);
    setSelectedBHK('all');
    setAvailability('all');
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle removing a property from saved properties
  const handleRemoveProperty = (propertyId: number) => {
    removeSavedProperty(propertyId);
  };

  // Handle slider value change
  const handleSliderChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  return (
    <ProtectedRoute allowedRoles={['TENANT']}>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar - hidden on mobile */}
        {!isMobile && <Sidebar />}
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Saved Properties</h1>
              
              {/* Mobile menu button - only shown on mobile */}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="bg-gray-800 text-white border-gray-700">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-gray-900 border-gray-800">
                    <SheetHeader>
                      <SheetTitle className="text-white">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Filter content - same as desktop but in a sheet */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white">Search</Label>
                          <Input 
                            placeholder="Search properties..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-white">City</Label>
                          <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="all">All Cities</SelectItem>
                              {cities.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-white">Price Range</Label>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm text-gray-400">{formatPrice(priceRange[0])}</span>
                            <Slider 
                              value={priceRange} 
                              onValueChange={handleSliderChange}
                              min={0}
                              max={100000}
                              step={1000}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-400">{formatPrice(priceRange[1])}</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-white">BHK</Label>
                          <Select value={selectedBHK} onValueChange={setSelectedBHK}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Select BHK" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="all">All BHK</SelectItem>
                              {bhkOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-white">Availability</Label>
                          <RadioGroup value={availability} onValueChange={setAvailability} className="mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="all" className="border-gray-700" />
                              <Label htmlFor="all" className="text-white">All</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="available" id="available" className="border-gray-700" />
                              <Label htmlFor="available" className="text-white">Available</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="rented" id="rented" className="border-gray-700" />
                              <Label htmlFor="rented" className="text-white">Rented</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={resetFilters}
                          className="bg-gray-800 text-white border-gray-700"
                        >
                          Reset
                        </Button>
                        <SheetClose asChild>
                          <Button className="bg-blue-600 text-white hover:bg-blue-700">
                            Apply Filters
                          </Button>
                        </SheetClose>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
            
            {/* Search and filter bar - hidden on mobile */}
            {!isMobile && (
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search properties..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Cities</SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedBHK} onValueChange={setSelectedBHK}>
                      <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="BHK" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All BHK</SelectItem>
                        {bhkOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="bg-gray-700 border-gray-600 text-white"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                </form>
                
                {/* Advanced filters - shown when filter button is clicked */}
                {isFilterOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white">Price Range</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-400">{formatPrice(priceRange[0])}</span>
                        <Slider 
                          value={priceRange} 
                          onValueChange={handleSliderChange}
                          min={0}
                          max={100000}
                          step={1000}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-400">{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-white">Availability</Label>
                      <RadioGroup value={availability} onValueChange={setAvailability} className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all" className="border-gray-700" />
                          <Label htmlFor="all" className="text-white">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="available" id="available" className="border-gray-700" />
                          <Label htmlFor="available" className="text-white">Available</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rented" id="rented" className="border-gray-700" />
                          <Label htmlFor="rented" className="text-white">Rented</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={resetFilters}
                        className="bg-gray-700 border-gray-600 text-white"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Properties grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : showEmptyState ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">No Saved Properties Found</CardTitle>
                  <CardDescription className="text-gray-400">
                    {searchQuery || selectedCity !== 'all' || selectedBHK !== 'all' || availability !== 'all' 
                      ? "No properties match your current filters. Try adjusting your search criteria."
                      : "You haven't saved any properties yet. Browse properties and save the ones you like."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    <Heart className="h-16 w-16 text-gray-600 mb-4" />
                    <Button 
                      variant="outline" 
                      className="bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
                      onClick={() => window.location.href = '/tenant/properties'}
                    >
                      Browse Properties
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <div key={property.propertyId} className="relative group">
                    <PropertyCard 
                      property={property} 
                      showSaveButton={false} 
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveProperty(property.propertyId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 