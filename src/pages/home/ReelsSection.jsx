import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReelCard from "./ReelCard";

export default function ReelsSection({
  title = "Trending Reels",
  viewAllHref = "https://www.instagram.com/mayavriksh/reels/",
  reels = [],
}) {
  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleSelect = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const updateScrollButtons = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollSlider = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    
    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      resizeObserver.disconnect();
    };
  }, [reels]);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-10 tracking-tight">
          {title}
        </h2>

        <div className="relative">
          <button
            onClick={() => scrollSlider('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 border-2 border-gray-100 ${
              canScrollLeft 
                ? 'hover:scale-110 hover:shadow-2xl hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer' 
                : 'opacity-40 cursor-not-allowed'
            }`}
            aria-label="Previous reels"
          >
            <ChevronLeft className={`w-6 h-6 ${canScrollLeft ? 'text-gray-700' : 'text-gray-400'}`} />
          </button>

          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-2 py-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {reels.map((reel) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                isActive={activeId === reel.id}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <button
            onClick={() => scrollSlider('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 border-2 border-gray-100 ${
              canScrollRight 
                ? 'hover:scale-110 hover:shadow-2xl hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer' 
                : 'opacity-40 cursor-not-allowed'
            }`}
            aria-label="Next reels"
          >
            <ChevronRight className={`w-6 h-6 ${canScrollRight ? 'text-gray-700' : 'text-gray-400'}`} />
          </button>
        </div>

        {viewAllHref && (
          <div className="flex justify-center mt-10">
            <a
              href={viewAllHref}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              View All Reels
            </a>
          </div>
        )}

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
