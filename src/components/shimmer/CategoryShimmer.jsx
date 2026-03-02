import React from 'react';

const ShimmerPlaceholder = ({ width, height, className = '', isCircle = false }) => {
    const baseClasses = 'bg-gray-200 animate-pulse';
    const shapeClasses = isCircle ? 'rounded-full' : 'rounded-md';
    const style = { width: width, height: height };

    return (
        <div
            className={`
        ${baseClasses} 
        ${shapeClasses} 
        ${className} 
        shimmer-animation 
      `}
            style={style}
        ></div>
    );
};

const ProductGridShimmerCard = () => {
    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm p-3 md:p-4 w-full h-auto">
            <ShimmerPlaceholder width="100%" height="auto" className="aspect-square mb-3" />
            <ShimmerPlaceholder width="85%" height="18px" className="mb-1" />
            <ShimmerPlaceholder width="40%" height="24px" className="mb-3" />

            <div className="flex justify-between items-center mt-2">
                <ShimmerPlaceholder width="30%" height="18px" />
                <ShimmerPlaceholder width="35%" height="32px" className="rounded-full" />
            </div>
        </div>
    );
};

const CategoryPageShimmer = () => {
    return (
        <div className="flex flex-col bg-white min-h-screen">
            <div className="container mx-auto p-4 flex flex-col md:flex-row mt-4">
                <div className="hidden md:block md:w-1/4 pr-6">
                    <ShimmerPlaceholder width="70%" height="28px" className="mb-6" />

                    {[...Array(3)].map((_, sectionIndex) => (
                        <div key={sectionIndex} className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm">
                            <ShimmerPlaceholder width="70%" height="20px" className="mb-4" />
                            <div className="space-y-2">
                                <ShimmerPlaceholder width="90%" height="20px" />
                                <ShimmerPlaceholder width="80%" height="20px" />
                                <ShimmerPlaceholder width="75%" height="20px" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-3/4 md:pl-6">

                    

                    <div className="flex space-x-3 mb-6 overflow-x-hidden pb-2">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex flex-col items-center flex-shrink-0 w-[60px] md:w-[80px]">
                                <ShimmerPlaceholder width="60px" height="60px" isCircle={true} className="mb-1 md:w-[80px] md:h-[80px]" />
                                <ShimmerPlaceholder width="50px" height="14px" />
                            </div>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {[...Array(10)].map((_, index) => (

                            <div
                                key={index}
                                style={{ animationDelay: `${index * 75}ms` }}
                                className="w-full"
                            >
                                <ProductGridShimmerCard />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPageShimmer;