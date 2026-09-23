import React from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, onSearchClick }) => {
  const { toggleDrawer, getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  return (
    <div className="lg:hidden flex items-center justify-between h-[60px] md:h-[68px] px-4 md:px-6">
      <div className="flex-1 flex justify-start">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-secondary hover:text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 flex justify-center">
        <Link to="/" className="text-xl md:text-2xl font-serif text-primary tracking-wide font-bold">
          MAHESHWARI
        </Link>
      </div>

      <div className="flex-1 flex justify-end items-center space-x-2 md:space-x-4">
        <button 
          onClick={onSearchClick}
          className="p-2 text-secondary hover:text-primary transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </button>
        <button 
          onClick={toggleDrawer}
          className="p-2 -mr-2 text-secondary hover:text-primary transition-colors relative"
          aria-label="Cart"
        >
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-0 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
