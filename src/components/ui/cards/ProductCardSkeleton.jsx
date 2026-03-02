import React from 'react';

/**
 * A skeleton placeholder for the ProductCard.
 * It mimics the card's layout with pulsing, animated gray shapes.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-full overflow-hidden flex flex-col border border-gray-100">
      {/* Skeleton for Image */}
      <div className="w-full aspect-[3/4] h-36 lg:h-50 bg-gray-200 animate-pulse mb-1"></div>

      {/* Skeleton for Product Info */}
      <div className="px-2 lg:p-4 flex flex-col gap-3 flex-1 justify-between">
        <div className='gap-1'>
          {/* Skeleton for Title */}
          <div className="h-5 bg-gray-200 rounded-md animate-pulse w-3/4 mb-1"></div>

          {/* Skeleton for Price */}
          <div className="flex items-center gap-2 lg:mt-3 mb-1">
            <div className="h-6 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/4"></div>
          </div>

          {/* Skeleton for Rating */}
          <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/2 lg:mt-3"></div>
        </div>
      </div>

      {/* Skeleton for Button */}
      <div className="mt-2 h-9 bg-gray-200 animate-pulse"></div>
    </div>
  );
}