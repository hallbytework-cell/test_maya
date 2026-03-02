import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Eye } from "lucide-react"; // Added Eye icon for animated variant
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { nameToSlug } from "@/utils/utils";

export default function ProductCard({
  title,
  price = { selling: 0, original: null, discount: null },
  images = [],
  id,
  rating,
  reviews,
  tags = [],
  colors = [],
  hexColors = [],
  onAddToCart,
  isAnimated = false, // New Prop: Default is off
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const navigate = useNavigate();

  const prevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
  };
  const nextImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((i) => (i + 1) % images.length);
  };

  const handleTouchStart = (e) => setTouchStartX(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEndX(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    const delta = touchStartX - touchEndX;
    if (delta > 50) nextImage();
    if (delta < -50) prevImage();
  };

  const handleCardClick = () => {
    navigate(`/product/${nameToSlug(title)}/${id}`);
  };

  const hasHexColors = Array.isArray(hexColors) && hexColors.length > 0;
  const hasColorNames = Array.isArray(colors) && colors.length > 0;
  let colorData = [];
  if (hasHexColors) {
    colorData = hexColors.map((hex, idx) => ({
      key: `${id}-hex-${idx}`,
      style: { backgroundColor: hex },
      title: colors[idx] || hex,
    }));
  } else if (hasColorNames) {
    colorData = colors.map((colorName, idx) => ({
      key: `${id}-name-${idx}`,
      style: {
        backgroundColor:
          colorName.toLowerCase() === "white"
            ? "#f9fafb"
            : colorName.toLowerCase() === "green"
              ? "#22c55e"
              : colorName.toLowerCase() === "black"
                ? "#1f2937"
                : colorName.toLowerCase(),
      },
      title: colorName,
    }));
  }

  // Animation Classes
  const cardAnimationClasses = isAnimated 
    ? "hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1.5" 
    : "hover:shadow-xl hover:-translate-y-1";
    
  const imageAnimationClasses = isAnimated 
    ? "group-hover:scale-110 duration-700" 
    : "duration-500";

  const buttonStyles = isAnimated
    ? "bg-emerald-50/80 border border-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white"
    : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800";

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg w-full overflow-hidden flex flex-col border border-gray-100 transition-all ease-in-out relative group cursor-pointer ${cardAnimationClasses}`}
      onClick={handleCardClick}
    >
      {price.discount && (
        <span className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-tl-2xl rounded-br-3xl z-20 shadow-md">
          {price.discount}
        </span>
      )}

      {/* Image Slider */}
      <div
        className="w-full aspect-[3/4] h-40 lg:h-50 relative overflow-hidden bg-gray-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 && (
          <img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`${title} ${currentImageIndex + 1}`}
            width={400}
            height={600}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all ease-in-out transform ${imageAnimationClasses}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x600/eeeeee/999999?text=Image+Not+Found";
            }}
          />
        )}
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 bg-white/75 hover:bg-white p-1.5 sm:p-2 rounded-full shadow transition z-10 active:scale-95 sm:opacity-0 group-hover:sm:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-white/75 hover:bg-white p-1.5 sm:p-2 rounded-full shadow transition z-10 active:scale-95 sm:opacity-0 group-hover:sm:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 w-full flex justify-center gap-1">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full transition ${index === currentImageIndex ? "bg-emerald-600" : "bg-white/70"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-3 py-2.5 sm:p-4 flex flex-col gap-1.5 flex-1 justify-between">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
          {title}
        </h3>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 line-clamp-1">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-base sm:text-lg font-bold text-emerald-700">
            ₹{price.selling}
          </span>
          {price.original && (
            <span className="text-[10px] sm:text-xs text-gray-500 line-through">
              ₹{price.original}
            </span>
          )}
          {price.discount && (
            <span className="text-[10px] sm:text-xs font-bold text-red-600 uppercase whitespace-nowrap">
              {price.discount}
            </span>
          )}
        </div>

        {colorData.length > 0 && (
          <div className="flex gap-1.5">
            {colorData.map((color) => (
              <div
                key={color.key}
                className="w-5 h-5 rounded-full border-2 border-gray-200 hover:border-gray-400 transition cursor-pointer flex-shrink-0"
                style={color.style}
                title={color.title}
              />
            ))}
          </div>
        )}

        {rating !== undefined && (
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <div className="flex items-center gap-0.5 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(rating) ? "fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-gray-700 text-xs font-semibold">
              {rating.toFixed(1)}
            </span>
            {reviews && (
              <span className="text-gray-500 text-xs whitespace-nowrap">
                ({reviews}<span className="hidden lg:inline"> reviews</span>)
              </span>
            )}
          </div>
        )}
      </div>

      <Link
        to={`/product/${nameToSlug(title)}/${id}`}
        onClick={(e) => e.stopPropagation()}
        className={`mx-3 mb-3 sm:mx-4 sm:mb-4 text-center text-sm font-bold py-2.5 px-4 rounded-xl transition-all duration-300 active:scale-95 z-10 flex items-center justify-center gap-2 ${buttonStyles}`}
      >
        {isAnimated && <Eye className="w-4 h-4" />} View
      </Link>
    </div>
  );
}

ProductCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.shape({
    selling: PropTypes.number,
    original: PropTypes.number,
    discount: PropTypes.string,
  }),
  images: PropTypes.array,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rating: PropTypes.number,
  reviews: PropTypes.number,
  tags: PropTypes.array,
  colors: PropTypes.array,
  hexColors: PropTypes.array,
  onAddToCart: PropTypes.func,
  isAnimated: PropTypes.bool,
};