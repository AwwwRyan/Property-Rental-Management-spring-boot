'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, Eye } from 'lucide-react'
import { LandlordSidebar } from '@/components/layout/LandlordSidebar'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppointments } from '@/hooks/useAppointments'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { AppointmentStatus } from '@/types/appointment'

const statusOptions = [
  { value: 'all', label: 'All Appointments' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
]

const statusStyles = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  APPROVED: 'bg-green-500/10 text-green-400 border-green-500/20',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  CANCELLED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  COMPLETED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [statusFilter, setStatusFilter] = useState('all')
  const { appointments, isLoading, updateAppointmentStatus } = useAppointments()
  const { toast } = useToast()

  // Filter appointments based on selected status and date
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    const matchesDate = !selectedDate || 
      format(new Date(appointment.appointmentDateTime), 'yyyy-MM-dd') === 
      format(selectedDate, 'yyyy-MM-dd')
    return matchesStatus && matchesDate
  })

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      if (!['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'].includes(newStatus)) {
        throw new Error('Invalid status');
      }
      
      console.log('Changing appointment status:', {
        appointmentId,
        newStatus,
        validStatus: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'].includes(newStatus)
      });
      
      const result = await updateAppointmentStatus(
        appointmentId, 
        newStatus as AppointmentStatus
      );
      
      if (!result) {
        toast({
          title: "Error updating appointment status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      toast({
        title: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <LandlordSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold text-white mb-6">Appointments</h1>
          
          {/* Filters */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {statusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-gray-700"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full md:w-auto justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600',
                    !selectedDate && 'text-gray-400'
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="bg-gray-800"
                />
              </PopoverContent>
            </Popover>

            {selectedDate && (
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => setSelectedDate(undefined)}
              >
                Clear date
              </Button>
            )}
          </div>

          {/* Appointments Table */}
          <div className="bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Tenant</TableHead>
                    <TableHead className="text-gray-300">Property</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Time</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        Loading appointments...
                      </TableCell>
                    </TableRow>
                  ) : filteredAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        No appointments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.appointmentId} className="border-gray-700">
                        <TableCell className="text-white">
                          User #{appointment.userId}
                        </TableCell>
                        <TableCell className="text-white">
                          {appointment.property.title}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {format(new Date(appointment.appointmentDateTime), 'PP')}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {format(new Date(appointment.appointmentDateTime), 'p')}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={appointment.status}
                            onValueChange={(value) => handleStatusChange(appointment.appointmentId, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue>
                                <Badge className={cn('font-normal', statusStyles[appointment.status])}>
                                  {appointment.status}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="PENDING" className="text-yellow-400">Pending</SelectItem>
                              <SelectItem value="APPROVED" className="text-green-400">Approved</SelectItem>
                              <SelectItem value="REJECTED" className="text-red-400">Rejected</SelectItem>
                              <SelectItem value="CANCELLED" className="text-gray-400">Cancelled</SelectItem>
                              <SelectItem value="COMPLETED" className="text-blue-400">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 