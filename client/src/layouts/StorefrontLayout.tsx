import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LuxuryHeader } from '../components/layout/navigation/LuxuryHeader';
import { MobileBottomNavigation } from '../components/layout/navigation/MobileBottomNavigation';
import { Footer } from '../components/layout/Footer';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { CartDrawer } from "../components/cart/CartDrawer";
import { SearchOverlay } from '../components/layout/navigation/SearchOverlay';

export const StorefrontLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <AnnouncementBar />
      <LuxuryHeader />
      <CartDrawer />
      <main className="flex-grow lg:mb-0 mb-[60px] md:mb-[70px]">
        <Outlet />
      </main>
      <Footer />
      
      {/* Search overlay needed here if opened from bottom nav */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Pass the set state to bottom nav so it can trigger search */}
      <MobileBottomNavigation onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
};
