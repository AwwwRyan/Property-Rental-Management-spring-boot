import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Calendar, 
  Heart, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/context/auth.context';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  console.log('Sidebar - User:', user);
  console.log('Sidebar - User Role:', user?.role);
  console.log('Sidebar - Current Pathname:', pathname);
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  const handleLogout = () => {
    logout();
    // Clear browser history and redirect to login
    window.history.pushState(null, '', '/login');
    router.push('/login');
  };
  
  return (
    <div className={`w-64 bg-gray-800 shadow-md h-full flex flex-col ${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white">ApnaGhar</h2>
      </div>
      
      <nav className="flex-1">
        <Link 
          href="/tenant/dashboard" 
          className={`flex items-center px-4 py-3 ${
            isActive('/tenant/dashboard') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        
        <Link 
          href="/tenant/properties" 
          className={`flex items-center px-4 py-3 ${
            isActive('/tenant/properties') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Building2 className="h-5 w-5 mr-3" />
          Properties
        </Link>
        
        <Link 
          href="/tenant/appointments" 
          className={`flex items-center px-4 py-3 ${
            isActive('/tenant/appointments') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Calendar className="h-5 w-5 mr-3" />
          Appointments
        </Link>
        
        <Link 
          href="/tenant/saved-properties" 
          className={`flex items-center px-4 py-3 ${
            isActive('/tenant/saved-properties') 
              ? 'bg-blue-900/30 text-blue-400 font-medium' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Heart className="h-5 w-5 mr-3" />
          Saved Properties
        </Link>
        
        <Link 
          href="/settings" 
          className={`flex items-center px-4 py-3 ${
            isActive('/settings') 
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