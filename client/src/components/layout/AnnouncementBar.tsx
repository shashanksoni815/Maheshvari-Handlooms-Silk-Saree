import React from 'react';

export const AnnouncementBar = () => {
  return (
    <div className="bg-primary text-background py-1.5 md:py-2 text-center text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase relative z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-2 md:space-x-4">
        <span className="hidden md:inline">FREE SHIPPING ACROSS INDIA</span>
        <span className="hidden md:inline text-accent">•</span>
        <span>HANDCRAFTED SILKS</span>
        <span className="hidden md:inline text-accent">•</span>
        <span className="hidden md:inline">SECURE PAYMENTS</span>
      </div>
    </div>
  );
};
