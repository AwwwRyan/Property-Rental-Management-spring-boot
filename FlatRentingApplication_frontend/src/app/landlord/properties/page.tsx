"use client"

import { useEffect, useState } from "react"
import { useProperties } from "@/hooks/useProperties"
import { ProtectedRoute } from "@/components/auth/protected-route"
import type { PropertyResponse } from "@/types/property"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/context/auth.context"
import { LandlordSidebar } from "@/components/layout/LandlordSidebar"
import { Plus, Eye, Edit2, Trash2, MapPin, Home, IndianRupee } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default function LandlordPropertiesPage() {
  const { properties, isLoading, error } = useProperties()
  const [myProperties, setMyProperties] = useState<PropertyResponse[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (properties && user) {
      // Filter properties owned by the current user
      const owned = properties.filter((prop) => prop.landlordId === user.userId)
      setMyProperties(owned)
    }
  }, [properties, user])

  // Get image path based on property type
  const getPropertyImage = (propertyType: string) => {
    const type = propertyType.toLowerCase()
    switch (type) {
      case "apartment":
        return "/appartment/living.jpeg"
      case "studio":
        return "/studio/hall.png"
      case "penthouse":
        return "/penthouse/living.jpeg"
      case "duplex":
        return "/duplex/overview.jpeg"
      case "dorm":
        return "/dorm/dorm.jpeg"
      default:
        return "/appartment/living.jpeg"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["LANDLORD"]}>
      <div className="flex h-screen bg-gray-900">
        <LandlordSidebar />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">My Listings</h1>
                <p className="text-gray-400 mt-1">Manage your property listings</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 rounded-lg shadow-lg shadow-blue-900/20">
                <Link href="/landlord/properties/new" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 p-6 rounded-lg text-red-300 border border-red-800/50 shadow-lg">
                {error}
              </div>
            ) : myProperties.length === 0 ? (
              <Card className="bg-gray-800/80 border-gray-700/50 shadow-xl overflow-hidden">
                <CardContent className="p-10 text-center">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-3">You don't have any properties yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Start by adding your first property to the platform and begin attracting potential tenants.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 shadow-lg shadow-blue-900/20">
                    <Link href="/landlord/properties/new" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Property
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map((property) => (
                  <Card
                    key={property.propertyId}
                    className="bg-gray-800/90 border-gray-700/50 overflow-hidden rounded-xl shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300"
                  >
                    <div className="relative h-52 w-full group">
                      <div className="absolute inset-0 bg-gray-700 overflow-hidden">
                        <Image
                          src={getPropertyImage(property.propertyType) || "/placeholder.svg"}
                          alt={property.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-blue-600/90 hover:bg-blue-600 text-white font-medium">
                        {property.propertyType}
                      </Badge>
                    </div>
                    
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-white text-xl font-bold line-clamp-1">{property.title}</CardTitle>
                      <CardDescription className="text-gray-300 flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span className="line-clamp-1">{property.location}</span>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center">
                        <div className="flex items-center text-blue-400 font-bold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {property.price}
                        </div>
                        <span className="text-gray-400 text-sm ml-1">/month</span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-2 flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-400 border-blue-800/50 hover:bg-blue-900/20 hover:text-blue-300 flex-1"
                      >
                        <Link
                          href={`/landlord/properties/${property.propertyId}`}
                          className="flex items-center justify-center w-full"
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-400 border-amber-800/50 hover:bg-amber-900/20 hover:text-amber-300 flex-1"
                      >
                        <Link
                          href={`/landlord/properties/${property.propertyId}/edit`}
                          className="flex items-center justify-center w-full"
                        >
                          <Edit2 className="h-4 w-4 mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-800/50 hover:bg-red-900/20 hover:text-red-300 flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
