import React from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, onSearchClick }) => {
  const toggleDrawer = useCartStore(state => state.toggleDrawer);
  const cartCount = useCartStore(state => state.items.reduce((total, item) => total + item.quantity, 0));

  return (
    <div className="flex h-[48px] items-center justify-between px-4 md:h-[52px] md:px-6 lg:hidden">
      <div className="flex flex-1 justify-start">
        <button 
          onClick={onMenuClick}
          className="-ml-1 rounded-full border border-[#d9c8a6] bg-white/60 p-1.5 text-[#063F35] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-1 justify-center">
        <Link to="/">
          <img src="/logo.png" alt="Maheshwari Silk" className="h-7 w-auto object-contain md:h-8" />
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
        <button 
          onClick={onSearchClick}
          className="rounded-full border border-[#d9c8a6] bg-white/60 p-1.5 text-[#063F35] transition-colors"
          aria-label="Search"
        >
          <Search className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button 
          onClick={toggleDrawer}
          className="relative -mr-1 rounded-full border border-[#d9c8a6] bg-white/60 p-1.5 text-[#063F35] transition-colors"
          aria-label="Cart"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#063F35] px-1 text-[8px] font-bold leading-none text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
