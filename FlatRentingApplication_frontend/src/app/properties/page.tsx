'use client';

import { useState, useEffect } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { PropertyResponse } from '@/types/property';
import { Sidebar } from '@/components/layout/Sidebar';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  SlidersHorizontal, 
  X,
  ChevronDown
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Slider 
} from '@/components/ui/slider';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';
import { ProtectedRoute } from '@/components/auth/protected-route';

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

export default function PropertiesPage() {
  const { properties, isLoading, error, searchProperties } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<PropertyResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedBHK, setSelectedBHK] = useState<string>('all');
  const [availability, setAvailability] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    if (properties) {
      let filtered = [...properties];
      
      // Apply search query filter
      if (searchQuery) {
        filtered = filtered.filter(property => 
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply city filter
      if (selectedCity && selectedCity !== 'all') {
        filtered = filtered.filter(property => 
          property.location.includes(selectedCity)
        );
      }
      
      // Apply price range filter
      filtered = filtered.filter(property => 
        property.price >= priceRange[0] && property.price <= priceRange[1]
      );
      
      // Apply BHK filter
      if (selectedBHK && selectedBHK !== 'all') {
        // This is a simplified filter - in a real app, you'd have BHK info in the property data
        filtered = filtered.filter(property => {
          const title = property.title.toLowerCase();
          if (selectedBHK === 'studio') {
            return title.includes('studio');
          } else {
            return title.includes(`${selectedBHK}bhk`) || title.includes(`${selectedBHK} bhk`);
          }
        });
      }
      
      // Apply availability filter
      if (availability !== 'all') {
        filtered = filtered.filter(property => 
          property.status === availability.toUpperCase()
        );
      }
      
      setFilteredProperties(filtered);
    }
  }, [properties, searchQuery, selectedCity, priceRange, selectedBHK, availability]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is handled in the useEffect
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

  return (
    <ProtectedRoute allowedRoles={['TENANT']}>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-gray-800 shadow-lg p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Find Your Perfect Home</h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by location, property name, or features..."
                className="pl-10 pr-4 py-3 w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            {/* Filter Bar - Desktop */}
            {!isMobile && (
              <div className="flex flex-wrap gap-4 items-center">
                <div className="w-48">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-white">All Cities</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city} className="text-white">{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-64">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Price:</span>
                    <span className="text-sm font-medium text-white">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                  </div>
                  <Slider
                    min={0}
                    max={100000}
                    step={1000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mt-2"
                  />
                </div>
                
                <div className="w-40">
                  <Select value={selectedBHK} onValueChange={setSelectedBHK}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="BHK" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-white">All Types</SelectItem>
                      {bhkOptions.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-white">{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-48">
                  <RadioGroup value={availability} onValueChange={setAvailability} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" className="border-gray-600" />
                      <Label htmlFor="all" className="text-white">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="available" id="available" className="border-gray-600" />
                      <Label htmlFor="available" className="text-white">Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rented" id="rented" className="border-gray-600" />
                      <Label htmlFor="rented" className="text-white">Rented</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="ml-auto border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Reset Filters
                </Button>
              </div>
            )}
            
            {/* Filter Button - Mobile */}
            {isMobile && (
              <div className="flex justify-end">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-gray-800 border-gray-700">
                    <SheetHeader>
                      <SheetTitle className="text-white">Filter Properties</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div>
                        <Label htmlFor="city-mobile">City</Label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger id="city-mobile" className="w-full mt-1 bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="all" className="text-white">All Cities</SelectItem>
                            {cities.map(city => (
                              <SelectItem key={city} value={city} className="text-white">{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Price Range</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-white">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                        </div>
                        <Slider
                          min={0}
                          max={100000}
                          step={1000}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bhk-mobile">BHK</Label>
                        <Select value={selectedBHK} onValueChange={setSelectedBHK}>
                          <SelectTrigger id="bhk-mobile" className="w-full mt-1 bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="BHK" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="all" className="text-white">All Types</SelectItem>
                            {bhkOptions.map(option => (
                              <SelectItem key={option.value} value={option.value} className="text-white">{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Availability</Label>
                        <RadioGroup value={availability} onValueChange={setAvailability} className="flex flex-col space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all-mobile" className="border-gray-600" />
                            <Label htmlFor="all-mobile" className="text-white">All</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="available" id="available-mobile" className="border-gray-600" />
                            <Label htmlFor="available-mobile" className="text-white">Available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rented" id="rented-mobile" className="border-gray-600" />
                            <Label htmlFor="rented-mobile" className="text-white">Rented</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <Button 
                          variant="outline" 
                          onClick={resetFilters}
                        >
                          Reset
                        </Button>
                        <SheetClose asChild>
                          <Button>
                            Apply Filters
                          </Button>
                        </SheetClose>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </header>

          {/* Main Content Area */}
          <main className="p-6 bg-gray-900">
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
              </h2>
            </div>
            
            {/* Property Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 p-4 rounded-lg text-red-300">
                {error}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                <h3 className="text-lg font-medium text-white mb-2">No properties found</h3>
                <p className="text-gray-400">Try adjusting your filters or search criteria</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.propertyId} 
                    property={property} 
                    showSaveButton={true}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 