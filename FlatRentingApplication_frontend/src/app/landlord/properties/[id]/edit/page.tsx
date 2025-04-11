'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import { PropertyService } from '@/services/property.service';
import { PropertyRequest, Property, PropertyStatus } from '@/types/property';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { LandlordSidebar } from '@/components/layout/LandlordSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyRequest>({
    title: '',
    propertyName: '',
    description: '',
    address: '',
    price: 0,
    location: '',
    propertyType: '',
    numberOfRooms: 0,
    furnishedStatus: '',
    propertySize: 0,
    status: 'AVAILABLE'
  });

  // Property types and status options
  const propertyTypes = [
    { value: "APARTMENT", label: "Apartment" },
    { value: "STUDIO", label: "Studio" },
    { value: "DORM", label: "Dorm" },
    { value: "DUPLEX", label: "Duplex" },
    { value: "PENTHOUSE", label: "Penthouse" },
  ];

  const bhkOptions = [
    { value: "1", label: "1 BHK" },
    { value: "2", label: "2 BHK" },
    { value: "3", label: "3 BHK" },
    { value: "4", label: "4+ BHK" },
  ];

  const furnishedStatusOptions = [
    { value: "furnished", label: "Fully Furnished" },
    { value: "semi-furnished", label: "Semi Furnished" },
    { value: "unfurnished", label: "Unfurnished" },
  ];

  const statusOptions: PropertyStatus[] = ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'NOT_AVAILABLE'];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!user?.accessToken) {
          throw new Error('Not authenticated');
        }
        const propertyId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
        const data = await PropertyService.getPropertyById(propertyId, user.accessToken);
        setProperty(data);
        setFormData({
          title: data.title,
          propertyName: data.property_name,
          description: data.description,
          address: data.address,
          price: data.price,
          location: data.location,
          propertyType: data.property_type,
          numberOfRooms: data.number_of_rooms,
          furnishedStatus: data.furnished_status,
          propertySize: data.property_size,
          status: data.status
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'propertySize' || name === 'numberOfRooms'
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (!user?.accessToken) {
        throw new Error('Not authenticated');
      }

      const propertyId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
      await PropertyService.updateProperty(propertyId, formData, user.accessToken);
      router.push('/landlord/properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['LANDLORD']}>
        <div className="flex h-screen bg-gray-900">
          <LandlordSidebar />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['LANDLORD']}>
      <div className="flex h-screen bg-gray-900">
        <LandlordSidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Edit Property</h1>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-300">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="propertyName" className="text-gray-300">Property Name</Label>
                      <Input
                        id="propertyName"
                        name="propertyName"
                        value={formData.propertyName}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-gray-300">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price" className="text-gray-300">Price (per month)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="propertySize" className="text-gray-300">Property Size (sq ft)</Label>
                        <Input
                          id="propertySize"
                          name="propertySize"
                          type="number"
                          value={formData.propertySize}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location" className="text-gray-300">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-gray-300">Full Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyType" className="text-gray-300">Property Type</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => handleSelectChange('propertyType', value)}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-white">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange('status', value as PropertyStatus)}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status} className="text-white">
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="numberOfRooms" className="text-gray-300">BHK</Label>
                      <Select
                        value={formData.numberOfRooms.toString()}
                        onValueChange={(value) => handleSelectChange('numberOfRooms', parseInt(value))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select BHK" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {bhkOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="furnishedStatus" className="text-gray-300">Furnished Status</Label>
                      <Select
                        value={formData.furnishedStatus}
                        onValueChange={(value) => handleSelectChange('furnishedStatus', value)}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select furnished status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {furnishedStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 