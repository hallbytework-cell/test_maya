import React from 'react';

const CheckoutShimmer = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center animate-pulse">
          <div className="flex items-center gap-4">
            {/* Back Arrow Placeholder */}
            <div className="w-6 h-6 bg-gray-200 rounded-full md:hidden"></div>
            {/* Logo Text Placeholder */}
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          
          {/* Desktop Stepper Placeholder */}
          <div className="hidden md:flex items-center gap-4">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>

          <div className="w-6 h-6 bg-gray-200 rounded md:hidden"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (Steps) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Step 1: Login (Completed State) */}
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center animate-pulse">
              <div className="flex items-start gap-4 w-full">
                {/* Check Icon Box */}
                <div className="w-8 h-8 bg-gray-200 rounded shrink-0"></div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-48 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-12 bg-gray-200 rounded ml-4"></div>
            </div>

            {/* Step 2: Address (Completed State) */}
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center animate-pulse">
              <div className="flex items-start gap-4 w-full">
                {/* Check Icon Box */}
                <div className="w-8 h-8 bg-gray-200 rounded shrink-0"></div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-3 w-64 bg-gray-100 rounded hidden md:block"></div>
                  <div className="h-3 w-40 bg-gray-100 rounded md:hidden"></div>
                </div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded ml-4"></div>
            </div>

            {/* Step 3: Order Summary (Active State) */}
            <div className="bg-white rounded-lg border border-green-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-green-50/30 p-4 border-b border-green-50 flex items-center gap-4 animate-pulse">
                <div className="w-8 h-8 bg-green-200 rounded flex items-center justify-center text-white font-bold">
                   {/* Mimicking the number '3' box */}
                </div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
              </div>

              <div className="p-4 md:p-6 flex flex-col gap-6 animate-pulse">
                
                {/* Product Item 1 */}
                <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-6">
                  {/* Image */}
                  <div className="w-full md:w-32 h-48 md:h-32 bg-gray-200 rounded-lg shrink-0"></div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 w-full">
                        <div className="h-5 w-3/5 bg-gray-200 rounded"></div>
                        <div className="h-3 w-1/4 bg-gray-100 rounded"></div>
                        <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-5 w-16 bg-gray-200 rounded shrink-0"></div>
                    </div>
                    
                    {/* Controls Row */}
                    <div className="flex justify-between items-end mt-4 md:mt-0">
                       <div className="flex gap-4 items-center">
                          {/* Qty Counter */}
                          <div className="w-24 h-8 bg-gray-100 rounded border border-gray-200"></div>
                          {/* Delete Icon */}
                          <div className="w-6 h-6 bg-gray-100 rounded"></div>
                       </div>
                       <div className="flex flex-col items-end gap-1">
                          <div className="h-3 w-24 bg-gray-100 rounded"></div>
                          <div className="h-3 w-32 bg-gray-100 rounded"></div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Product Item 2 */}
                <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-6">
                  <div className="w-full md:w-32 h-48 md:h-32 bg-gray-200 rounded-lg shrink-0"></div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 w-full">
                        <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-3 w-1/4 bg-gray-100 rounded"></div>
                        <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-5 w-16 bg-gray-200 rounded shrink-0"></div>
                    </div>
                    <div className="flex justify-between items-end mt-4 md:mt-0">
                       <div className="flex gap-4 items-center">
                          <div className="w-24 h-8 bg-gray-100 rounded border border-gray-200"></div>
                          <div className="w-6 h-6 bg-gray-100 rounded"></div>
                       </div>
                       <div className="flex flex-col items-end gap-1">
                          <div className="h-3 w-24 bg-gray-100 rounded"></div>
                          <div className="h-3 w-32 bg-gray-100 rounded"></div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="w-full h-12 bg-green-200 rounded-md mt-2"></div>

              </div>
            </div>

             {/* Step 4: Payment (Inactive State) */}
             <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-center animate-pulse opacity-60">
                <div className="w-8 h-8 bg-gray-200 rounded mr-4"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>

          </div>

          {/* Right Column (Price Summary) - Hidden on Mobile mostly, or stacked */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm animate-pulse sticky top-24">
              
              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>

              {/* Coupons */}
              <div className="mb-6">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                 </div>
                 <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-gray-100 rounded border border-gray-200"></div>
                    <div className="h-10 w-20 bg-gray-200 rounded"></div>
                 </div>
                 
                 {/* Coupon Slider Skeleton */}
                 <div className="flex gap-2 mt-4 overflow-hidden">
                    <div className="w-32 h-16 bg-orange-50 rounded border border-orange-100 shrink-0"></div>
                    <div className="w-32 h-16 bg-orange-50 rounded border border-orange-100 shrink-0"></div>
                 </div>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* Donation / Wallet Rows */}
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="flex flex-col gap-1">
                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                            <div className="h-2 w-16 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    <div className="w-10 h-5 bg-gray-200 rounded-full"></div>
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="flex flex-col gap-1">
                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                            <div className="h-2 w-32 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                 </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-12 bg-green-100 rounded"></div>
                </div>
              </div>

              <hr className="border-dashed border-gray-200 my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                  <div className="h-5 w-24 bg-gray-300 rounded"></div>
                  <div className="h-5 w-24 bg-gray-300 rounded"></div>
              </div>

              {/* Security Footer */}
              <div className="bg-gray-50 h-8 w-full rounded flex items-center justify-center gap-2">
                 <div className="w-4 h-4 bg-gray-200 rounded"></div>
                 <div className="w-20 h-2 bg-gray-200 rounded"></div>
              </div>

            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default CheckoutShimmer;