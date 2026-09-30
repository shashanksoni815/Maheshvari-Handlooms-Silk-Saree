import React from 'react';

interface ProductSkeletonGridProps {
  count?: number;
}

export const ProductSkeletonGrid: React.FC<ProductSkeletonGridProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col bg-[#F6F6F8] rounded-[2rem] p-3 sm:p-4 border border-neutral-200/60 animate-pulse w-full box-border"
        >
          {/* Image Placeholder */}
          <div className="aspect-[3/4] w-full bg-neutral-200/80 rounded-[1.5rem] mb-3" />

          {/* Title Placeholder */}
          <div className="h-4 bg-neutral-200/80 rounded-full w-3/4 mb-2" />

          {/* Price & Rating Row */}
          <div className="flex items-center justify-between mt-1 mb-4">
            <div className="h-3 bg-neutral-200/80 rounded-full w-1/3" />
            <div className="h-4 bg-neutral-200/80 rounded-full w-1/4" />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
            <div className="h-9 bg-neutral-200/80 rounded-full w-full" />
            <div className="h-9 bg-neutral-200/80 rounded-full w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
