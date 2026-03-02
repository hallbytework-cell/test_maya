import React, { useMemo } from "react";
import ReelsSection from "./ReelsSection";
import { getActivePlantReels } from "../../api/customer/plant";
import { useQuery } from "@tanstack/react-query";

function Reels({ initialData }) {
    const reelTypeFilter = "PLANT_CARE";
    const {
        data: apiReels = initialData || [],  
        isLoading,     
        isError,        
        error,    
    } = useQuery({
        queryKey: ["plantReels", reelTypeFilter],  
        queryFn: () => getActivePlantReels(reelTypeFilter),
        staleTime: 5 * 10 * 1000,         
        cacheTime: Infinity,        
        initialData: initialData || undefined,     
    });

    const formattedReels = useMemo(() => {
        return (apiReels || []).map(reel => ({
            id: reel.id,
            title: reel.title,
            videoSrc: reel.cloudinaryVideoUrl || reel.youtubeVideoUrl,
            poster: reel.cloudinaryThumbnailUrl,
            plantId: reel.plant?.plantId,
            plantName: reel.plant?.name,
        }));
    }, [apiReels]); 

    if (isLoading) {
        return <ReelsLoadingSkeleton />;
    }


    if (isError) {
        return (
            <div className="container mx-auto py-10 text-center text-red-600">
                <h3 className="text-xl font-semibold mb-2">Oops!</h3>
                <p>Could not load trending reels. Please try again later.</p>
            </div>
        );
    }

    if (formattedReels.length === 0) {
        return (
            <div className="container mx-auto py-10 text-center text-gray-500">
                <h3 className="text-xl font-semibold">No Reels Found</h3>
                <p>Check back later for new content!</p>
            </div>
        );
    }

    return (
        <ReelsSection
            title="Trending Reels"
            reels={formattedReels.slice(0, 12)}
            viewAllHref="https://www.instagram.com/mayavriksh/reels"
        />
    );
}

export default Reels;


function ReelSkeleton() {
    return (
        <div className="relative flex-shrink-0 w-[180px] h-[320px] rounded-2xl overflow-hidden shadow-lg scroll-snap-align-start">
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        </div>
    );
}

function ReelsLoadingSkeleton() {
    const skeletonReels = Array(5).fill(0).map((_, index) => ({ id: `skeleton-${index}` }));
    const fakeReels = skeletonReels.map(r => ({ id: r.id }));

    return (
        <ReelsSection
            title="Trending Reels"
            viewAllHref="https://www.instagram.com/mayavriksh/reels"
            reels={fakeReels} 
            isLoading={true} 
        >
        </ReelsSection>
    );
}


const SimpleReelsLoadingSkeleton = () => (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-10 tracking-tight">
          FeedBack Reels
        </h2>
        <div className="relative">
          <div className="flex gap-6 overflow-hidden px-2 py-4">
            {Array(5).fill(0).map((_, index) => (
              <ReelSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
);
