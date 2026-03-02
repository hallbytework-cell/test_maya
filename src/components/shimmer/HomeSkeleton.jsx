import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-white animate-pulse">
      
      <div className="relative w-full h-[350px] md:h-[500px] bg-gray-100 overflow-hidden">
        <div className="w-full h-full bg-gray-200"></div>
        <div className="md:hidden absolute top-6 left-6 right-6 bottom-20 bg-gray-300 rounded-lg opacity-60"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
        <div className="flex justify-center mb-10">
          <div className="h-8 w-48 md:w-80 bg-gray-200 rounded-full"></div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 mb-12">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className={`relative aspect-[3/4] rounded-xl bg-gray-200 overflow-hidden ${index > 2 ? 'hidden md:block' : 'block'}`}
            >
              <div className="absolute bottom-3 left-3 right-3 h-4 bg-gray-300/80 rounded"></div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-20">
          <div className="h-10 w-40 bg-gray-100 rounded-full border border-gray-200"></div>
        </div>

        <div className="flex justify-center mb-10">
          <div className="h-8 w-48 bg-gray-200 rounded-full"></div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index}
              className={`${index > 2 ? 'hidden md:block' : 'block'}`}
            >

              <div className="w-full aspect-[9/16] bg-gray-200 rounded-xl relative mb-3">

                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>
              

              <div className="h-3 w-10/12 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HomeSkeleton;