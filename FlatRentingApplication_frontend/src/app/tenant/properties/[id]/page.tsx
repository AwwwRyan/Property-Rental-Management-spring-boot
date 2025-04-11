'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PropertyService } from '@/services/property.service';
import { useAppointments } from '@/hooks/useAppointments';
import { Property } from '@/types/property';
import { AppointmentRequest } from '@/types/appointment';
import { useAuth } from '@/context/auth.context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Bed, 
  Bath, 
  Square, 
  Home, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

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
  const { id } = useParams();
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Get images based on property type
  const getPropertyImages = () => {
    if (!property) return [];
    
    const imageDir = propertyTypeToImageDir[property.property_type.toUpperCase()] || 'appartment';
    const defaultImages = propertyTypeToImages[property.property_type.toUpperCase()] || propertyTypeToImages['APARTMENT'];
    
    return defaultImages.map(img => `/${imageDir}/${img}`);
  };

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const propertyData = await PropertyService.getPropertyById(Number(id));
        setProperty(propertyData);
      } catch (err) {
        setError('Failed to load property details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!property || !user) return;
    
    try {
      setIsBookingSuccess(false);
      setBookingError(null);
      
      // Combine date and time into ISO string format
      const appointmentDateTime = new Date(`${bookingDate}T${bookingTime}`).toISOString();
      
      const appointmentData: AppointmentRequest = {
        propertyId: property.property_id,
        appointmentDateTime: appointmentDateTime,
        message: bookingNotes
      };
      
      const result = await createAppointment(appointmentData);
      if (result) {
        setIsBookingSuccess(true);
        
        // Reset form
        setBookingDate('');
        setBookingTime('');
        setBookingNotes('');
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsBookingModalOpen(false);
        }, 2000);
      } else {
        setBookingError('Failed to book appointment. Please try again.');
      }
    } catch (err) {
      setBookingError('Failed to book appointment. Please try again.');
      console.error(err);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get current date in YYYY-MM-DD format for date input min value
  const getCurrentDate = () => {
    return format(new Date(), 'yyyy-MM-dd');
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['TENANT']}>
        <div className="flex h-screen bg-gray-900">
          <Sidebar />
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !property) {
    return (
      <ProtectedRoute allowedRoles={['TENANT']}>
        <div className="flex h-screen bg-gray-900">
          <Sidebar />
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            <div className="bg-red-900/30 p-6 rounded-lg text-red-300 max-w-md text-center">
              <X className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Property</h2>
              <p>{error || 'Property not found'}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const propertyImages = getPropertyImages();

  return (
    <ProtectedRoute allowedRoles={['TENANT']}>
      <div className="flex h-screen bg-gray-900">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          {/* Image Gallery */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {propertyImages.map((img, index) => (
                <div 
                  key={index}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={img} 
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Optional: Add an overlay on hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      View Image
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional: Image Modal for fullscreen view */}
            <Dialog open={activeImageIndex !== null} onOpenChange={() => setActiveImageIndex(null)}>
              <DialogContent className="max-w-3xl bg-gray-900 border-gray-800 p-4">
                {activeImageIndex !== null && propertyImages[activeImageIndex] && (
                  <div className="relative">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      <img 
                        src={propertyImages[activeImageIndex]} 
                        alt={`${property.title} - Full View`}
                        className="w-full h-full object-contain"
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
          </div>
          
          {/* Property Overview */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-2xl font-bold text-blue-400">
                    {formatPrice(property.price)}<span className="text-sm font-normal text-gray-400">/month</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-300">
                    {property.status === 'AVAILABLE' ? (
                      <span className="flex items-center text-green-400">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center text-red-400">
                        <X className="h-4 w-4 mr-1" />
                        {property.status === 'RENTED' ? 'Rented' : 'Under Maintenance'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-700">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-400">Bedrooms</div>
                    <div className="font-medium text-white">{property.number_of_rooms}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-400">Bathrooms</div>
                    <div className="font-medium text-white">{Math.ceil(property.number_of_rooms / 2)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-400">Area</div>
                    <div className="font-medium text-white">{property.property_size} sq ft</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-400">Furnished</div>
                    <div className="font-medium text-white">{property.furnished_status}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Details & Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Property Description */}
                <div className="bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">About this property</h2>
                  <p className="text-gray-300 whitespace-pre-line">{property.description}</p>
                </div>
                
                {/* Map View */}
                <div className="bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">Location</h2>
                  <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Map view coming soon</p>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-300">
                    <p className="font-medium">Address:</p>
                    <p>{property.address}</p>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Contact Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl shadow-sm p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Property Owner</div>
                      <div className="text-sm text-gray-400">Contact for more details</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>Contact via phone</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>Contact via email</span>
                    </div>
                  </div>
                  
                  <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={property.status !== 'AVAILABLE'}>
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
                      <DialogHeader>
                        <DialogTitle>Book a Viewing</DialogTitle>
                      </DialogHeader>
                      
                      {isBookingSuccess ? (
                        <div className="py-6 text-center">
                          <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">Booking Successful!</h3>
                          <p className="text-gray-300">Your appointment request has been sent to the landlord.</p>
                        </div>
                      ) : (
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="date" className="text-gray-300">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              min={getCurrentDate()}
                              required
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="time" className="text-gray-300">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={bookingTime}
                              onChange={(e) => setBookingTime(e.target.value)}
                              required
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="notes" className="text-gray-300">Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              value={bookingNotes}
                              onChange={(e) => setBookingNotes(e.target.value)}
                              placeholder="Any specific requirements or questions?"
                              rows={3}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          
                          {bookingError && (
                            <div className="text-sm text-red-400">{bookingError}</div>
                          )}
                        </div>
                      )}
                      
                      <DialogFooter>
                        {isBookingSuccess ? (
                          <DialogClose asChild>
                            <Button>Close</Button>
                          </DialogClose>
                        ) : (
                          <>
                            <DialogClose asChild>
                              <Button variant="outline" className="border-gray-600 text-gray-300">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleBookAppointment} disabled={!bookingDate || !bookingTime}>
                              Book Now
                            </Button>
                          </>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {property.status !== 'AVAILABLE' && (
                    <div className="mt-4 text-sm text-red-400 text-center">
                      This property is currently not available for viewing
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 