import { lazy, Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LuxuryHeader } from '../components/layout/navigation/LuxuryHeader';
import { MobileBottomNavigation } from '../components/layout/navigation/MobileBottomNavigation';
import { Footer } from '../components/layout/Footer';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { CartDrawer } from "../components/cart/CartDrawer";

const SearchOverlay = lazy(() => import('../components/layout/navigation/SearchOverlay').then(module => ({ default: module.SearchOverlay })));

export const StorefrontLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <AnnouncementBar />
      <LuxuryHeader />
      <CartDrawer />
      <main className="grow lg:mb-0 mb-15 md:mb-17.5">
        <Outlet />
      </main>
      <Footer />
      
      {/* Search overlay needed here if opened from bottom nav */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </Suspense>
      )}
      
      {/* Pass the set state to bottom nav so it can trigger search */}
      <MobileBottomNavigation onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
};
