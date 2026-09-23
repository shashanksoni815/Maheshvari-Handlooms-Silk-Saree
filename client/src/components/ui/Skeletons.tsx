import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full aspect-[2/3] bg-gray-200 mb-4 rounded-sm"></div>
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      <div className="space-y-4">
        <div className="aspect-[3/4] bg-gray-200 rounded-sm"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-200"></div>)}
        </div>
      </div>
      <div className="space-y-4 pt-4">
        <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
        <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
        <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
        <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          <div className="h-4 bg-gray-200 w-4/5 rounded"></div>
        </div>
        <div className="h-14 bg-gray-200 w-full rounded mt-6"></div>
      </div>
    </div>
  </div>
);
