"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProperties } from "@/hooks/useProperties"
import { PropertyRequest, PropertyStatus } from "@/types/property"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { LandlordSidebar } from "@/components/layout/LandlordSidebar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const propertyTypes = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "STUDIO", label: "Studio" },
  { value: "DORM", label: "Dorm" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "PENTHOUSE", label: "Penthouse" },
]

const bhkOptions = [
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4+ BHK" },
]

const furnishedStatusOptions = [
  { value: "furnished", label: "Fully Furnished" },
  { value: "semi-furnished", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
]

export default function NewPropertyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createProperty } = useProperties()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<PropertyRequest>({
    title: "",
    propertyName: "",
    description: "",
    address: "",
    price: 0,
    location: "",
    propertyType: "APARTMENT",
    numberOfRooms: 1,
    furnishedStatus: "semi-furnished",
    propertySize: 0,
    status: "AVAILABLE",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newProperty = await createProperty(formData)
      if (newProperty) {
        toast({
          title: "Success",
          variant: "default",
        })
        router.push("/landlord/properties")
      } else {
        toast({
          title: "Error",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating property:', error)
      toast({
        title: "Error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "propertySize" ? Number(value) : value,
    }))
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <LandlordSidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" asChild>
              <Link href="/landlord/properties">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold text-white">Add New Property</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="e.g., Spacious 2BHK Apartment"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyName" className="text-gray-300">Property Name</Label>
                  <Input
                    id="propertyName"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="e.g., City Heights Residency"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">Price (₹/month)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="e.g., 35000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="e.g., Mumbai"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-gray-300">Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select property type" />
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

                <div className="space-y-2">
                  <Label htmlFor="numberOfRooms" className="text-gray-300">BHK</Label>
                  <Select
                    value={formData.numberOfRooms.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfRooms: parseInt(value) }))}
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

                <div className="space-y-2">
                  <Label htmlFor="furnishedStatus" className="text-gray-300">Furnished Status</Label>
                  <Select
                    value={formData.furnishedStatus}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, furnishedStatus: value }))}
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

                <div className="space-y-2">
                  <Label htmlFor="propertySize" className="text-gray-300">Property Size (sq. ft.)</Label>
                  <Input
                    id="propertySize"
                    name="propertySize"
                    type="number"
                    value={formData.propertySize}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="e.g., 850"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-300">Full Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="e.g., 202, Skyline Towers, Dadar West"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Availability</Label>
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value: PropertyStatus) => setFormData(prev => ({ ...prev, status: value }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="AVAILABLE" id="available" className="text-blue-500" />
                      <Label htmlFor="available" className="text-gray-300">Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NOT_AVAILABLE" id="not-available" className="text-blue-500" />
                      <Label htmlFor="not-available" className="text-gray-300">Not Available</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px]"
                  placeholder="Describe your property in detail..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Property"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 