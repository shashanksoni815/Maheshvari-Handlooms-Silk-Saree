import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';

import { DesktopNavigation } from './DesktopNavigation';
import { MobileHeader } from './MobileHeader';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';
import { AccountDropdown } from './AccountDropdown';

export const LuxuryHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  const toggleDrawer = useCartStore(state => state.toggleDrawer);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore(state => state.items.reduce((total, item) => total + item.quantity, 0));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 bg-background transition-all duration-300 ${
          isScrolled ? 'border-b border-supporting/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]' : 'border-b border-supporting/30'
        }`}
      >
        <div className="max-w-[1440px] mx-auto w-full">
          {/* Desktop Header */}
          <div className={`hidden lg:flex justify-between items-center px-8 transition-all duration-300 ${isScrolled ? 'h-[70px]' : 'h-[86px]'}`}>
            
            {/* Logo */}
            <div className="w-[200px] flex-shrink-0">
              <Link to="/">
                <img src="/logo.png" alt="Maheshwari Silk Handloom Saree" className="h-14 lg:h-16 w-auto object-contain" />
              </Link>
            </div>

            {/* Main Navigation */}
            <DesktopNavigation />

            {/* Right Icons */}
            <div className="w-[200px] flex justify-end items-center space-x-6 flex-shrink-0">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-secondary hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  onMouseEnter={() => setIsAccountOpen(true)}
                  className="text-secondary hover:text-primary transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <AccountDropdown isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
              </div>

              <Link to="/wishlist" className="text-secondary hover:text-primary relative transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-accent rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={toggleDrawer} 
                className="text-secondary hover:text-primary relative transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-primary rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <MobileHeader 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
            onSearchClick={() => setIsSearchOpen(true)} 
          />
        </div>
      </header>

      {/* Overlays */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
