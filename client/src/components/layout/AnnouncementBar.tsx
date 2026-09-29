import React from 'react';

export const AnnouncementBar = () => {
  return (
    <div className="w-full overflow-hidden bg-[#063F35] text-[#F8F1E4] py-1 md:py-1.5 text-center text-[8.5px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.2em] uppercase shrink-0">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-2 sm:px-4">
        <span className="hidden md:inline">✦ FREE SHIPPING ACROSS INDIA</span>
        <span className="hidden md:inline text-[#D5B66A]">|</span>
        <span>✦ HANDCRAFTED PURE SILKS ✦</span>
        <span className="hidden md:inline text-[#D5B66A]">|</span>
        <span className="hidden md:inline">SECURE PAYMENTS ✦</span>
      </div>
    </div>
  );
};
