import React from 'react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

interface MobileBottomNavigationProps {
  onSearchClick: () => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({ onSearchClick }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-supporting z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-[60px] md:h-[70px] px-2">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-secondary/60 hover:text-primary'}`}
        >
          <Home className="w-5 h-5 md:w-6 md:h-6" strokeWidth={isActive('/') ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wider">HOME</span>
        </Link>
        
        <Link 
          to="/shop" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/shop') ? 'text-primary' : 'text-secondary/60 hover:text-primary'}`}
        >
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={isActive('/shop') ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wider">SHOP</span>
        </Link>

        <button 
          onClick={onSearchClick}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-secondary/60 hover:text-primary transition-colors"
        >
          <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          <span className="text-[10px] font-medium tracking-wider">SEARCH</span>
        </button>

        <Link 
          to="/wishlist" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/wishlist') ? 'text-primary' : 'text-secondary/60 hover:text-primary'}`}
        >
          <Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={isActive('/wishlist') ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wider">WISHLIST</span>
        </Link>

        <Link 
          to={isAuthenticated ? "/account" : "/login"} 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/account') || isActive('/login') ? 'text-primary' : 'text-secondary/60 hover:text-primary'}`}
        >
          <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={isActive('/account') || isActive('/login') ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wider">ACCOUNT</span>
        </Link>
      </div>
    </div>
  );
};
