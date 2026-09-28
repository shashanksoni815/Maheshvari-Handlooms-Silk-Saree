import React from 'react';

export const AnnouncementBar = () => {
  return (
    <div className="relative z-50 bg-[#063F35] text-[#F8F1E4] py-1.5 md:py-2 text-center text-[9px] md:text-[10px] font-medium tracking-[0.25em] uppercase">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 md:gap-4">
        <span className="hidden md:inline">✦ FREE SHIPPING ACROSS INDIA</span>
        <span className="text-[#D5B66A]">|</span>
        <span>HANDCRAFTED SILKS</span>
        <span className="text-[#D5B66A]">|</span>
        <span className="hidden md:inline">SECURE PAYMENTS ✦</span>
      </div>
    </div>
  );
};
