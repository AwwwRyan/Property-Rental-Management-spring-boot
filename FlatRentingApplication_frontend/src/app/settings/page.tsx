'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth.context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Lock, 
  Mail, 
  Phone, 
  Shield, 
  User,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    propertyUpdates: true,
    appointmentReminders: true,
    marketing: false
  });

  return (
    <ProtectedRoute allowedRoles={['TENANT']}>
      <div className="flex h-screen bg-gray-900">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
            
            <Tabs defaultValue="account" className="space-y-6">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="account" className="data-[state=active]:bg-gray-700">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Account Settings */}
              <TabsContent value="account" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Account Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Update your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                        <Input
                          id="name"
                          defaultValue="Full Name"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user?.email || ''}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue="+91 9876543210"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Notification Preferences</CardTitle>
                    <CardDescription className="text-gray-400">
                      Choose how you want to receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Email Notifications</Label>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">SMS Notifications</Label>
                        <p className="text-sm text-gray-400">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Property Updates</Label>
                        <p className="text-sm text-gray-400">Get notified about property updates</p>
                      </div>
                      <Switch
                        checked={notifications.propertyUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, propertyUpdates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Appointment Reminders</Label>
                        <p className="text-sm text-gray-400">Get reminders for your appointments</p>
                      </div>
                      <Switch
                        checked={notifications.appointmentReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Marketing Communications</Label>
                        <p className="text-sm text-gray-400">Receive marketing and promotional emails</p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Security Settings</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-gray-300">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          className="bg-gray-700 border-gray-600 text-white pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-300">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <Button className="w-full md:w-auto">Update Password</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 