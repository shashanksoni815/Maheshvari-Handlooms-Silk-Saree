import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';

import { DesktopNavigation } from './DesktopNavigation';
import { MobileHeader } from './MobileHeader';
import { AccountDropdown } from './AccountDropdown';

const MobileMenu = lazy(() => import('./MobileMenu').then(module => ({ default: module.MobileMenu })));
const SearchOverlay = lazy(() => import('./SearchOverlay').then(module => ({ default: module.SearchOverlay })));

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
        className={`sticky top-0 z-50 bg-[#f8f1e4]/90 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'border-b border-[#d9c8a6] shadow-[0_8px_24px_-18px_rgba(6,63,53,0.45)]' : 'border-b border-[#e5d8bf]'
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px]">
          <div className={`hidden items-center justify-between px-6 transition-all duration-300 lg:flex ${isScrolled ? 'h-20' : 'h-24'}`}>
            <div className="w-[200px] shrink-0">
              <Link to="/" className="inline-flex items-center">
                <img src="/logo.png" alt="Maheshwari Silk Handloom Saree" className="h-12 w-auto object-contain lg:h-14" />
              </Link>
            </div>

            <DesktopNavigation />

            <div className="flex w-[200px] shrink-0 items-center justify-end gap-5">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-[#29231D] hover:text-[#B58A3A] transition-colors"
                aria-label="Search"
              >
                <Search className="h-4 w-4" strokeWidth={1.8} />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  onMouseEnter={() => setIsAccountOpen(true)}
                  className="text-[#29231D] hover:text-[#B58A3A] transition-colors"
                  aria-label="Account"
                >
                  <User className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <AccountDropdown isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
              </div>

              <Link to="/wishlist" className="relative text-[#29231D] hover:text-[#B58A3A] transition-colors" aria-label="Wishlist">
                <Heart className="h-4 w-4" strokeWidth={1.8} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B58A3A] px-1 text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={toggleDrawer} 
                className="relative text-[#29231D] hover:text-[#B58A3A] transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#063F35] px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <MobileHeader 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
            onSearchClick={() => setIsSearchOpen(true)} 
          />
        </div>
      </header>

      {/* Overlays */}
      {isMobileMenuOpen && (
        <Suspense fallback={null}>
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </Suspense>
      )}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </Suspense>
      )}
    </>
  );
};
