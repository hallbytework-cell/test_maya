import { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react"; 
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import OrderTrackingTimeline from "@/components/tracking/OrderTrackingTimeline";
import TrackingUpdateModal from "@/components/tracking/TrackingUpdateModel";
import TrackingSearchCard from "@/components/tracking/TrackingSearchCard"; 
import { Button } from "@/components/ui/button";
import { getTrackingInfo } from "@/api/customer/tracking";

export default function TrackingPage() {
  const [showModal, setShowModal] = useState(false);
  const [trackingData, setTrackingData] = useState(null); 
  const [searchCardKey, setSearchCardKey] = useState(Date.now());

  const trackingMutation = useMutation({
    mutationFn: getTrackingInfo,
    onSuccess: (data) => {
      if (data?.tracking_data?.error) {
        toast.error("Tracking info not found for this ID.");
        return;
      }
      setTrackingData(data);
      toast.success("Tracking updates found!");
    },
    onError: (error) => {
      toast.error("Failed to fetch tracking details. Please try again.");
    }
  });

  const handleTrackOrder = async (searchParams) => {
    trackingMutation.mutate(searchParams);
  };

  return (
    <> 
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
          
          <div className="flex items-center justify-between mb-8">
             <h1 className="text-2xl font-bold text-gray-900">Track Orders</h1>
             
             {trackingData && (
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={() => {
                   setTrackingData(null);
                   setSearchCardKey(Date.now()); 
                 }}
                 className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md"
               >
                 <Search className="w-4 h-4" />
                 Clear Search
               </Button>
             )}
          </div>

          <TrackingSearchCard 
            key={searchCardKey} 
            onTrack={handleTrackOrder} 
            isLoading={trackingMutation.isPending} 
          />

          {/* Loading State */}
          {trackingMutation.isPending && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-500 animate-pulse">Fetching live updates...</p>
            </div>
          )}

          {trackingData && !trackingMutation.isPending && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              <div className="flex items-center gap-2 px-1">
                <span className="text-sm text-gray-500">Showing results for:</span>
                <span className="text-sm font-bold text-gray-900">
                  {trackingMutation.variables?.value}
                </span>
              </div>

              {/* Pass the real API data to your timeline component */}
              <OrderTrackingTimeline data={trackingData} />

              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setShowModal(true)}
                >
                  View Detailed History
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TrackingUpdateModal 
        open={showModal} 
        onOpenChange={setShowModal} 
        history={trackingData?.tracking_data?.shipment_track_activities} 
      />
    </>
  );
}