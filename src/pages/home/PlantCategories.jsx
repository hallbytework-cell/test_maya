import { mapCategoryDBToUI } from "@/utils/utils";
import { Leaf, LeafIcon } from "lucide-react";
import React, { useMemo, useRef } from "react";
import { Link } from "react-router-dom";

// --- ICONS ---
const SparkleIconFilled = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const ChevronLeftIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// New Tree Icon
const TreeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-2"
  >
    <path d="M12 19V5M5 11l7-7 7 7M5 19l7-7 7 7M12 12V5" />
    <path d="M12 22v-3" />
  </svg>
);

// --- CONSTANTS ---
const CARD_THEMES = [
  { bg: "bg-[#DDEBDE]", accent: "bg-[#2F5E36]", text: "text-[#1B3022]" }, 
  { bg: "bg-[#D6EAF8]", accent: "bg-[#2E86C1]", text: "text-[#1A3A4F]" }, 
  { bg: "bg-[#FADBD8]", accent: "bg-[#CB4335]", text: "text-[#4A2322]" }, 
];

const PlantCategories = ({ categories: rawCategories = [] }) => {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const categories = useMemo(() => {
    if (!Array.isArray(rawCategories)) return [];
    const sorted = [...rawCategories].sort((cat1, cat2) => (cat1.categoryId || 0) - (cat2.categoryId || 0));
    return sorted.map((cat) => ({
      id: cat?.value || cat?.id || "",
      label: cat?.label || cat?.name || "",
      img: cat?.mediaUrl || cat?.img || "",
      slug: cat?.value || cat?.slug || cat?.id || "",
    }));
  }, [rawCategories]);

  const error = null;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollWidth <= clientWidth) { setActiveIndex(0); return; }
      const scrollFraction = scrollLeft / (scrollWidth - clientWidth);
      const index = Math.round(scrollFraction * (categories.length - 1));
      setActiveIndex(index);
    }
  };

  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const target = (index / (categories.length - 1)) * (scrollWidth - clientWidth);
      scrollContainerRef.current.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  const isLoading = !rawCategories || rawCategories.length === 0;

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main className="bg-[#FFFCF8] py-4 sm:py-6 overflow-hidden">
        <div className="mx-auto px-4">
          {/* --- HEADER --- */}
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tighter">
              What’s Your <span className="text-[#2F5E36]">Vibe?</span>
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="h-[2px] w-8 bg-[#2F5E36]/20" />
                <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase opacity-40">Choose Your Path</span>
                <div className="h-[2px] w-8 bg-[#2F5E36]/20" />
              </div>
            </h1>
          </div>

          {/* --- LOGIC PRESERVED --- */}
          {isLoading && (
            <div className="flex flex-col items-center py-20">
              <div className="w-12 h-12 border-4 border-[#2F5E36] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-black text-xs uppercase tracking-widest text-gray-400">Loading...</p>
            </div>
          )}
          {error && <div className="text-center text-red-500 font-bold py-10">{error}</div>}

          <div className="relative group  mx-auto">
            {!isLoading && categories.length > 1 && (
              <>
                <button onClick={() => scroll("left")} className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-2xl items-center justify-center hover:bg-[#2F5E36] hover:text-white transition-all opacity-0 group-hover:opacity-100">
                  <ChevronLeftIcon />
                </button>
                <button onClick={() => scroll("right")} className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-2xl items-center justify-center hover:bg-[#2F5E36] hover:text-white transition-all opacity-0 group-hover:opacity-100">
                  <ChevronRightIcon />
                </button>
              </>
            )}

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={`flex overflow-x-auto pb-10 no-scrollbar snap-x snap-mandatory scroll-smooth px-4 space-x-6 sm:space-x-10 justify-start ${categories.length <= 3 ? 'md:justify-center' : ''}`}
            >
              {categories.map((item, index) => {
                const theme = CARD_THEMES[index % CARD_THEMES.length];
                return (
                  <Link
                    key={item.id}
                    to={`/category/${mapCategoryDBToUI(item.slug)}`}
                    className={`
                      group relative flex-shrink-0 
                      w-[75vw] sm:w-72 md:w-92 
                      h-[380px] sm:h-[480px] 
                      snap-center 
                      ${theme.bg} rounded-[40px] sm:rounded-[60px] 
                      overflow-hidden transition-all duration-500
                      hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]
                    `}
                  >
                    {/* The Image - Fills nearly the whole card background */}
                    <div className="absolute inset-x-4 top-4 bottom-24 sm:inset-x-6 sm:top-6 sm:bottom-28">
                       <div className="w-full h-full rounded-[30px] sm:rounded-[45px] overflow-hidden shadow-md">
                          <img 
                            src={item.img} 
                            alt={item.label} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                          />
                       </div>
                    </div>

                    {/* Bottom Content Area - Solid and tight to the bottom */}
                    <div className="absolute bottom-0 inset-x-0 h-24 sm:h-28 px-8 flex items-center justify-between">
                      <div className="min-w-0">
                        <h3 className={`text-xl sm:text-2xl font-black ${theme.text} leading-none truncate`}>
                          {item.label}
                        </h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 opacity-40 ${theme.text}`}>Explore vibes</p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <ArrowRightIcon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* --- DOTS --- */}
          {!isLoading && categories.length > 1 && (
            <div className="flex justify-center items-center space-x-3 mt-2 mb-12">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToCard(index)}
                  className={`transition-all duration-500 rounded-full ${index === activeIndex ? "w-12 h-2 bg-[#2F5E36]" : "w-2 h-2 bg-gray-200"}`}
                />
              ))}
            </div>
          )}

          {/* --- CTA BUTTON --- */}
          <div className="text-center">
            <Link
              to="/category/plants"
              className="inline-flex items-center justify-center bg-[#2F5E36] text-white font-black px-12 py-5 rounded-2xl shadow-2xl hover:bg-black transition-all hover:-translate-y-1 active:scale-95 text-base sm:text-lg"
            >
              Shop All Vibes &nbsp; <LeafIcon />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default PlantCategories;