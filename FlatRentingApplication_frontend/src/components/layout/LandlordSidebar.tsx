import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Calendar, 
  Settings, 
  LogOut,
  User,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/auth.context';

interface LandlordSidebarProps {
  className?: string;
}

export const LandlordSidebar: React.FC<LandlordSidebarProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className={`w-64 bg-gray-800 shadow-md h-full flex flex-col ${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white">ApnaGhar</h2>
      </div>
      
      <nav className="flex-1">
        <Link 
          href="/landlord/dashboard" 
          className={`flex items-center px-4 py-3 ${
            isActive('/landlord/dashboard') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        
        <Link 
          href="/landlord/properties" 
          className={`flex items-center px-4 py-3 ${
            isActive('/landlord/properties') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Building2 className="h-5 w-5 mr-3" />
          My Properties
        </Link>
        
        <Link 
          href="/landlord/appointments" 
          className={`flex items-center px-4 py-3 ${
            isActive('/landlord/appointments') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Calendar className="h-5 w-5 mr-3" />
          Appointments
        </Link>
        
        <Link 
          href="/landlord/properties/new" 
          className={`flex items-center px-4 py-3 ${
            isActive('/landlord/properties/new') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Plus className="h-5 w-5 mr-3" />
          Add Property
        </Link>
        
        <Link 
          href="/landlord/settings" 
          className={`flex items-center px-4 py-3 ${
            isActive('/landlord/settings') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-md"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}; 