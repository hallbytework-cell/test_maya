"use client";
<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
=======
import { useState, useEffect, useRef, memo, useCallback } from "react";
>>>>>>> 048fdb4 (Initial commit from dev-akash)
import { useNavigate } from "react-router-dom";
import { Star, Eye, StarHalf, Droplets, Leaf, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { nameToSlug } from "@/utils/utils";

// --- Mock Constants & Utils (Injected for Preview) ---
const PLANT_TAGS = {
  CAMPAIGN_TAGS: "campaign_tags",
};

const sizeToAbbreviation = (size) => {
  if (!size) return "";
  const map = { Small: "S", Medium: "M", Large: "L", "Extra Large": "XL" };
  return map[size] || size.charAt(0).toUpperCase();
};
// --------------------------------------------------------------

<<<<<<< HEAD
export default function ProductCardTwo({ product }) {
=======
// Memoized ProductCardTwo to prevent unnecessary re-renders
const ProductCardTwo = memo(function ProductCardTwo({ product }) {
>>>>>>> 048fdb4 (Initial commit from dev-akash)
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // --- Swipe & Drag State ---
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const minSwipeDistance = 50;

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : [{ mediaUrl: "/images/placeholder.jpg" }];

  const campaignTag = product.catalogAttributes?.find(
    (attr) => attr.group === PLANT_TAGS.CAMPAIGN_TAGS
  );

<<<<<<< HEAD
  // --- Navigation Handlers ---
  const nextImage = (e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
=======
  // --- Navigation Handlers (Memoized) ---
  const nextImage = useCallback((e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);
>>>>>>> 048fdb4 (Initial commit from dev-akash)

  // --- Universal Swipe Logic (Mouse + Touch) ---
  const onInputStart = (clientX) => {
    setDragEnd(null);
    setDragStart(clientX);
    setIsDragging(false);
  };

  const onInputMove = (clientX) => {
    if (dragStart !== null) {
      setDragEnd(clientX);
      // If moved more than 5px, consider it a drag (to prevent accidental clicks)
      if (Math.abs(clientX - dragStart) > 5) {
        setIsDragging(true);
      }
    }
  };

  const onInputEnd = () => {
    if (dragStart === null || dragEnd === null) {
      setDragStart(null);
      return;
    }

    const distance = dragStart - dragEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }

    // Reset
    setDragStart(null);
    setDragEnd(null);
    // Note: isDragging state is used to block the click, reset it slightly later or handle in click
    setTimeout(() => setIsDragging(false), 100);
  };

  // --- Render Helpers ---
  const renderStars = (rating) => {
    const r = rating || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= r) {
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400 w-3 h-3" />);
      } else if (i - 1 < r && r < i) {
        stars.push(<StarHalf key={i} className="fill-yellow-400 text-yellow-400 w-3 h-3" />);
      } else {
        stars.push(<Star key={i} className="text-gray-300 w-3 h-3" />);
      }
    }
    return stars;
  };

  const careIcons = [
    { icon: Leaf, tooltip: "Air Purifying", color: "text-emerald-600" },
    { icon: Droplets, tooltip: "Low Water", color: "text-blue-500" },
    { icon: Sun, tooltip: "Medium Light", color: "text-amber-500" },
  ];

  const getDiscount = (mrp, sp) => {
    if (mrp <= 0 || sp >= mrp) return 0;
    return Math.floor(((mrp - sp) / mrp) * 100);
  };
  const discount = getDiscount(product.mrp, product.sellingPrice);

  // Handlers
  const handleCardClick = (e) => {
    // If we were dragging the image, don't navigate
    if (isDragging) return;
    navigate(`/product/${nameToSlug(product.name)}/${product.variantId}`);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${nameToSlug(product.name)}/${product.variantId}`);
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(index);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer select-none"
    >
      {/* --- TOP BADGES --- */}
      {discount > 0 && (
        <div className="absolute top-0 left-0  bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg shadow-sm z-10" >
          {discount}% OFF
        </div>
      )}

      <div className="absolute top-0 right-0 z-10 bg-gradient-to-l from-emerald-600 to-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm tracking-wide uppercase">
        {campaignTag?.name || "BESTSELLER"}
      </div>

      {/* --- IMAGE SECTION (Swipeable + Drag + Arrows) --- */}
      <div
        className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-gray-50 touch-pan-y"
        // Touch Events
        onTouchStart={(e) => onInputStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => onInputMove(e.targetTouches[0].clientX)}
        onTouchEnd={onInputEnd}
        // Mouse Events (for Desktop Drag)
        onMouseDown={(e) => onInputStart(e.clientX)}
        onMouseMove={(e) => onInputMove(e.clientX)}
        onMouseUp={onInputEnd}
        onMouseLeave={onInputEnd}
      >
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {/* Images - All lazy loaded to prevent grid overfetching */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img.mediaUrl}
            alt={product.name}
            width={400}
            height={500}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            draggable="false"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${currentImageIndex === index ? "opacity-100 z-0" : "opacity-0 z-0"
              }`}
          />
        ))}

        {/* {images.map((img, index) => (
          <img
            key={index}
            src={img.mediaUrl}
            alt={product.name}
            loading="lazy"
            // CHANGE BELOW: 'object-fill' forces the image to touch all 4 corners
            className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-500 ${currentImageIndex === index ? "opacity-100 z-0" : "opacity-0 z-0"
              }`}
          />
        ))} */}

        {/* Desktop Hover Arrows (Hidden on mobile, block on group-hover for desktop) */}
        {isMounted && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Hover Overlay (Desktop) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none z-10" />

        {/* Carousel Dots */}
        {isMounted && images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-20 pointer-events-none">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={(e) => handleDotClick(e, index)}
                className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${currentImageIndex === index ? "w-4 bg-white shadow" : "w-1.5 bg-white/60 hover:bg-white/90"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Care Icons */}
        <div className="absolute bottom-2 left-2 flex gap-1 z-20">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-white/50">
            {careIcons.map((Tag, idx) => (
              <Tag.icon key={idx} className={`w-3 h-3 ${Tag.color}`} />
            ))}
          </div>
        </div>

       
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="flex flex-col flex-grow p-2 sm:p-3 justify-between">
        <div>
          {/* Title - Clamped for uniformity */}
          <h3 className="font-bold text-[12px] md:text-sm sm:text-base text-gray-900  leading-tight mb-1 group-hover:text-emerald-700 transition-colors" title={product.name}>
            {product.name}
            <span className="ml-1 text-xs md:font-normal text-gray-500 ">
              ({sizeToAbbreviation(product?.size)})
            </span>
             <span
              className="inline-block w-3.5 h-3.5 ml-1 align-middle rounded-full border-2 border-gray-400  shadow-md transition-transform hover:scale-110"
              style={{ backgroundColor: product.color.hexCode }}
              title={`Color: ${product.color.name}`}
            />
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-[10px] text-gray-400 font-medium pt-0.5">
              ({product.totalRatings || 0})
            </span>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="flex items-end justify-between mt-1 w-full">
          <div className="flex flex-col">
            {product.mrp && product.mrp !== product.sellingPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                ₹{product.mrp}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-gray-900 leading-none">
              ₹{product.sellingPrice}
            </span>
          </div>

          <button
            onClick={handleViewClick}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm active:scale-95 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm font-semibold">View</span>
          </button>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
});

ProductCardTwo.displayName = 'ProductCardTwo';

export default ProductCardTwo;
>>>>>>> 048fdb4 (Initial commit from dev-akash)
