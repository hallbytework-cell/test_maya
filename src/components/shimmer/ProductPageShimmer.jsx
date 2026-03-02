import React from 'react';

const ProductPageShimmer = () => {
   return (
      <>
         {/* UPDATED STYLES:
         1. Changed .shimmer-wrapper background to #e0e0e0 to match Home Shimmer.
         2. Kept the animation identical.
      */}
         <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-wrapper {
          position: relative;
          overflow: hidden;
          background-color: #e0e0e0; /* UPDATED: Changed from #f3f4f6 to #e0e0e0 */
          border-radius: 8px; /* Ensure default radius if class is missing */
        }
        .shimmer-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
        }
      `}</style>

         <div className="w-full min-h-screen bg-white">

            {/* Navbar */}
            <div className="w-full h-20 border-b border-gray-300 px-4 md:px-8 flex items-center justify-between">
               <div className="shimmer-wrapper w-32 h-8 rounded" />

               <div className="hidden md:block shimmer-wrapper w-1/3 h-10 rounded-full" />

               <div className="flex gap-4">
                  <div className="shimmer-wrapper w-8 h-8 rounded-full" />
                  <div className="shimmer-wrapper w-8 h-8 rounded-full" />
               </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-10">

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                  {/* Left Column: Images */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                     <div className="w-full aspect-[4/5] md:aspect-square lg:aspect-[5/4] shimmer-wrapper rounded-2xl" />

                     <div className="hidden md:grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                           <div key={i} className="aspect-square shimmer-wrapper rounded-xl" />
                        ))}
                     </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="lg:col-span-5 flex flex-col space-y-8">

                     {/* Title & Price */}
                     <div className="space-y-4">
                        <div className="shimmer-wrapper h-10 w-3/4 rounded-lg" />
                        <div className="flex items-center gap-4">
                           <div className="shimmer-wrapper h-8 w-24 rounded-lg" />
                           <div className="shimmer-wrapper h-6 w-16 rounded-lg" />
                        </div>
                     </div>

                     {/* Info Box - Updated border to be slightly darker (gray-200) to match the darker shimmer theme */}
                     <div className="border border-gray-200 p-5 rounded-2xl bg-gray-50">
                        <div className="shimmer-wrapper h-4 w-32 rounded mb-6" />
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                           {[1, 2, 3, 4].map((item) => (
                              <div key={item} className="flex items-center gap-3">
                                 <div className="shimmer-wrapper w-10 h-10 rounded-full flex-shrink-0" />
                                 <div className="space-y-2 w-full">
                                    <div className="shimmer-wrapper h-2 w-full rounded" />
                                    <div className="shimmer-wrapper h-2 w-2/3 rounded" />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Description Bar */}
                     <div className="shimmer-wrapper h-12 w-full rounded-xl" />

                     {/* Size Selector */}
                     <div className="space-y-3">
                        <div className="shimmer-wrapper h-4 w-24 rounded" />
                        <div className="flex gap-4">
                           {[1, 2, 3].map((i) => (
                              <div key={i} className="shimmer-wrapper w-24 h-14 rounded-lg" />
                           ))}
                        </div>
                     </div>

                     {/* Color Selector */}
                     <div className="space-y-3">
                        <div className="shimmer-wrapper h-4 w-24 rounded" />
                        <div className="shimmer-wrapper w-12 h-12 rounded-full ring-4 ring-white shadow-sm" />
                     </div>

                     {/* Grid Options */}
                     <div className="space-y-3">
                        <div className="shimmer-wrapper h-4 w-24 rounded" />
                        <div className="grid grid-cols-4 gap-3">
                           {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="shimmer-wrapper h-20 rounded-xl border border-white" />
                           ))}
                        </div>
                     </div>

                     {/* Social Icons */}
                     <div className="space-y-3">
                        <div className="shimmer-wrapper h-4 w-24 rounded" />
                        <div className="flex gap-3">
                           {[1, 2, 3].map((i) => (
                              <div key={i} className="shimmer-wrapper w-10 h-10 rounded-full" />
                           ))}
                        </div>
                     </div>

                     {/* Add to Cart Button */}
                     <div className="pt-6">
                        <div className="shimmer-wrapper h-14 w-full rounded-xl" />
                     </div>

                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default ProductPageShimmer;