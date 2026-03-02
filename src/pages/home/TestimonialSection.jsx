import { useState, useRef, useEffect, useCallback, Suspense, lazy } from "react";
import { ChevronLeft, ChevronRight, Star, MessageSquarePlus, Loader2 } from "lucide-react";
import { submitFeedback, getPlatformFeedback } from "@/api/customer/feedback";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Lazy-load PlatformFeedbackModal (only shown when user wants to give feedback)
const PlatformFeedbackModal = lazy(() => import("./../../components/PlatformFeedbackModal"));

const Stars = ({ count }) => (
  <div className="flex gap-1 text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={i < count ? "fill-current" : "text-gray-300"} size={18} />
    ))}
  </div>
);

export default function TestimonialCarousel({ title = "🌟 What Our Customers Say" }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const getSpv = useCallback(() => (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 4 : 1), []);
  const [spv, setSpv] = useState(1);
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const touchStartX = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading: isLoadingData } = useQuery({
    queryKey: ['platform-feedback'],
    queryFn: getPlatformFeedback,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (apiResponse) => {
      if (!apiResponse?.success || !apiResponse?.data) {
        return { testimonials: [], userContext: null };
      }

      const feedbackList = apiResponse.data.feedback || [];
      const formattedTestimonials = Array.isArray(feedbackList)
        ? feedbackList.map((item) => {
            const city = item.address?.city;
            const state = item.address?.state;
            const locationStr = [city, state].filter(Boolean).join(", ") || "Verified Customer";

            let displayName = item.customerName;
            if (!displayName || displayName.trim() === "") {
              displayName = "Anonymous Customer";
            }

            return {
              id: item.id,
              name: displayName,
              location: locationStr,
              rating: item.rating || 5,
              review: item.message || "No review text provided.",
            };
          })
        : [];

      return {
        testimonials: formattedTestimonials,
        userContext: apiResponse.data.userContext || null,
      };
    },
  });

  const testimonials = data?.testimonials || [];
  const userContext = data?.userContext || null;

  const { mutate: submitReview, isPending: isSubmitting } = useMutation({
    mutationFn: (formData) => submitFeedback(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-feedback'] });
      setIsModalOpen(false);
      setIndex(0); 
    },
    onError: (error) => {
      console.error("Failed to submit feedback", error);
      alert("Something went wrong while submitting your feedback. Please try again.");
    },
  });

  const handleFeedbackSubmit = (modalData) => {
    const apiData = new FormData();
    apiData.append('context', 'PLATFORM');
    apiData.append('rating', modalData.rating);
    const formattedMessage = modalData.review || '';
    apiData.append('message', formattedMessage);

    submitReview(apiData);
  };

  const total = testimonials.length;
  const maxIndex = Math.max(total - spv, 0);
  const pageCount = Math.ceil(total / spv);

  useEffect(() => {
    setSpv(getSpv());
    const handleResize = () => {
      const newSpv = getSpv();
      setSpv((prev) => {
        if (prev !== newSpv) {
          setIndex((i) => Math.min(i, Math.max(total - newSpv, 0)));
        }
        return newSpv;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getSpv, total]);

  useEffect(() => {
    if (trackRef.current) {
      const percentage = total > 0 ? (index / total) * 100 : 0;
      trackRef.current.style.transform = `translateX(-${percentage}%)`;
    }
  }, [index, spv, total]);

  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      next();
    } else if (diff < -50) {
      prev(); 
    }
    touchStartX.current = null;
  };

  return (
    <section className="bg-green-50 w-full px-8 py-10 sm:py-16 relative min-h-[400px]">

      {/* Lazy-load PlatformFeedbackModal (only rendered when user opens it) */}
      <Suspense fallback={null}>
        {isModalOpen && (
          <PlatformFeedbackModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFeedbackSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Suspense>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 tracking-tight">
          {title}
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-3">
          <p className="text-gray-600 text-sm sm:text-base">
            Real reviews from real plant lovers.
          </p>

          {isAuthenticated && (
             !userContext?.hasReviewed && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  Write a Review
                </button>
             )
          )}
        </div>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          <div
            className="relative overflow-hidden mx-auto px-4 sm:px-6 lg:px-8 touch-pan-y select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-out"
              style={{ width: `${(100 / spv) * total}%` }}
            >
              {testimonials.map(({ id, name, location, rating, review }) => (
                <div
                  key={id}
                  className="flex-shrink-0 px-2 sm:px-3 lg:px-4 mb-2"
                  style={{ width: `${100 / total}%` }}
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-shadow p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <Stars count={rating} />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-grow italic">
                      “{review}”
                    </p>
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{name}</p>
                      <p className="text-emerald-600 text-xs sm:text-sm font-medium">{location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {total > spv && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 sm:p-3 hover:bg-emerald-50 text-gray-800 transition-all border border-gray-100 z-10 hidden sm:block"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 sm:p-3 hover:bg-emerald-50 text-gray-800 transition-all border border-gray-100 z-10 hidden sm:block"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {pageCount > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pageCount }).map((_, p) => (
                <button
                  key={p}
                  onClick={() => setIndex(p * spv)}
                  aria-label={`Go to slide ${p + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index >= p * spv && index < (p + 1) * spv
                      ? "w-8 bg-emerald-600"
                      : "w-2 bg-gray-300 hover:bg-emerald-300"
                    }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}