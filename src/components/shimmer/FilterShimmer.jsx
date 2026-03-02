import React from 'react';

const ChevronDownIcon = () => (
  <svg 
    className="w-5 h-5 text-gray-400" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" 
      clipRule="evenodd" 
    />
  </svg>
);


const FilterCardShimmer = () => (
  <div 
    className="p-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="h-4 bg-gray-300 rounded w-28"></div>
      </div>
      <ChevronDownIcon />
    </div>
  </div>
);

const FiltersShimmer = () => {
  return (
    <div className="p-4 w-full max-w-sm mx-auto">
      {/* 1. Header Shimmer Area */}
      {/* <div 
        className="mb-6 p-4 rounded-xl 
          bg-white
          animate-pulse"
      >
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-400 rounded-md opacity-70"></div>
          <div className="h-6 bg-gray-500 rounded w-24 opacity-70"></div>
        </div>
      </div> */}

      <div className="space-y-4 animate-pulse">
        <FilterCardShimmer />
        <FilterCardShimmer />
        <FilterCardShimmer />
        <FilterCardShimmer />
      </div>
      
      {/* 3. Button Shimmer Area */}
      <div className="mt-8">
        <div 
          className="h-12 w-full 
            bg-blue-400/80 
            rounded-lg 
            animate-pulse 
            transition-all 
            duration-300"
        >
        </div>
      </div>
    </div>
  );
};

export default FiltersShimmer;