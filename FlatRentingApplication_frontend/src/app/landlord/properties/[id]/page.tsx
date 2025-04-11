"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Property, PropertyResponse } from "@/types/property"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth.context"
import { LandlordSidebar } from "@/components/layout/LandlordSidebar"
import { Edit2, Trash2, MapPin, Home, IndianRupee, Bed, Bath, Users, Building2, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { PropertyService } from "@/services/property.service"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"

// Map of property types to their image directories
const propertyTypeToImageDir: Record<string, string> = {
  'APARTMENT': 'appartment',
  'DUPLEX': 'duplex',
  'STUDIO': 'studio',
  'PENTHOUSE': 'penthouse',
  'DORM': 'dorm'
};

// Map of property types to their default images
const propertyTypeToImages: Record<string, string[]> = {
  'APARTMENT': ['living.jpeg', 'bedroom.jpeg', 'kitchen.jpeg', 'washroom.jpeg', 'dining.jpeg'],
  'DUPLEX': ['home.jpeg', 'overview.jpeg', 'kitchen.jpeg', 'washroom.jpeg', 'wall.jpeg'],
  'STUDIO': ['hall.png', 'kitchen.png', 'window.png'],
  'PENTHOUSE': ['living.jpeg', 'bedroom.jpeg', 'washroom.jpeg', 'stairs.jpeg'],
  'DORM': ['dorm.jpeg', 'view.jpeg', 'wall.jpeg', 'washroom.jpeg']
};

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

  // Get images based on property type
  const getPropertyImages = () => {
    if (!property) return [];
    
    const imageDir = propertyTypeToImageDir[property.property_type.toUpperCase()] || 'appartment';
    const defaultImages = propertyTypeToImages[property.property_type.toUpperCase()] || propertyTypeToImages['APARTMENT'];
    
    return defaultImages.map(img => `/${imageDir}/${img}`);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyId = Number(params.id)
        if (!user?.accessToken) {
          throw new Error('Not authenticated')
        }
        const data = await PropertyService.getPropertyById(propertyId, user.accessToken)
        setProperty(data)
      } catch (err) {
        setError("Failed to fetch property details")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [params.id, user?.accessToken])

  const handleDelete = async () => {
    if (!property) return
    
    try {
      await PropertyService.deleteProperty(property.property_id)
      router.push("/landlord/properties")
    } catch (err) {
      setError("Failed to delete property")
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["LANDLORD"]}>
        <div className="flex h-screen bg-gray-900">
          <LandlordSidebar />
          <div className="flex-1 overflow-auto p-6">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !property) {
    return (
      <ProtectedRoute allowedRoles={["LANDLORD"]}>
        <div className="flex h-screen bg-gray-900">
          <LandlordSidebar />
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-red-900/30 p-6 rounded-lg text-red-300 border border-red-800/50 shadow-lg">
              {error || "Property not found"}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const propertyImages = getPropertyImages();

  return (
    <ProtectedRoute allowedRoles={["LANDLORD"]}>
      <div className="flex h-screen bg-gray-900">
        <LandlordSidebar />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">{property.title}</h1>
                <p className="text-gray-400 mt-1">Property Details</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-amber-400 border-amber-800/50 hover:bg-amber-900/20 hover:text-amber-300"
                  onClick={() => router.push(`/landlord/properties/${property.property_id}/edit`)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-red-400 border-red-800/50 hover:bg-red-900/20 hover:text-red-300"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {propertyImages.map((img, index) => (
                <div 
                  key={index}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={img}
                    alt={`${property.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">View Image</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Modal */}
            <Dialog open={activeImageIndex !== null} onOpenChange={() => setActiveImageIndex(null)}>
              <DialogContent className="max-w-3xl bg-gray-900 border-gray-800 p-4">
                {activeImageIndex !== null && propertyImages[activeImageIndex] && (
                  <div className="relative">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src={propertyImages[activeImageIndex]}
                        alt={`${property.title} - Full View`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Navigation Buttons */}
                    <div className="absolute inset-0 flex items-center justify-between p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-black/50 hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeImageIndex !== null) {
                            setActiveImageIndex(
                              activeImageIndex === 0 
                                ? propertyImages.length - 1 
                                : activeImageIndex - 1
                            );
                          }
                        }}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-black/50 hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeImageIndex !== null) {
                            setActiveImageIndex(
                              activeImageIndex === propertyImages.length - 1 
                                ? 0 
                                : activeImageIndex + 1
                            );
                          }
                        }}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Image Counter */}
                {activeImageIndex !== null && (
                  <div className="mt-4 text-center text-gray-300">
                    Image {activeImageIndex + 1} of {propertyImages.length}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/90 border-gray-700/50 overflow-hidden rounded-xl shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-blue-600/90 hover:bg-blue-600 text-white font-medium">
                      {property.property_type}
                    </Badge>
                    <div className="flex items-center text-blue-400 font-bold text-lg">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {property.price}
                      <span className="text-gray-400 text-sm ml-1">/month</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-300 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{property.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Bed className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{property.number_of_rooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Bath className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{property.number_of_rooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{property.number_of_rooms * 2} Max Occupancy</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{property.property_size} sq ft</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                      <p className="text-gray-300">{property.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Furnishing Status</h3>
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
                        {property.furnished_status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-gray-800/90 border-gray-700/50 rounded-xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Property Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Availability</span>
                      <Badge className={property.status === 'AVAILABLE' ? "bg-green-600/90" : "bg-red-600/90"}>
                        {property.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/90 border-gray-700/50 rounded-xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-400 block">Landlord</span>
                        <span className="text-white">{user?.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Email</span>
                        <span className="text-white">{user?.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Address</span>
                        <span className="text-white">{property.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 