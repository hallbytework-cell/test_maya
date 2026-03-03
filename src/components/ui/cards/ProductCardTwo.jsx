"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Eye,
  StarHalf,
  Droplets,
  Leaf,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { nameToSlug } from "@/utils/utils";

/* ---------------- Constants ---------------- */
const PLANT_TAGS = {
  CAMPAIGN_TAGS: "campaign_tags",
};

const sizeToAbbreviation = (size) => {
  if (!size) return "";
  const map = { Small: "S", Medium: "M", Large: "L", "Extra Large": "XL" };
  return map[size] || size.charAt(0).toUpperCase();
};

/* ---------------- Component ---------------- */
const ProductCardTwo = memo(function ProductCardTwo({ product }) {
  const navigate = useNavigate();

  const [isMounted, setIsMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Drag / Swipe state
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const minSwipeDistance = 50;

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

  /* ---------------- Image Navigation ---------------- */
  const nextImage = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    },
    [images.length]
  );

  const prevImage = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    },
    [images.length]
  );

  /* ---------------- Swipe Logic ---------------- */
  const onInputStart = (clientX) => {
    setDragStart(clientX);
    setDragEnd(null);
    setIsDragging(false);
  };

  const onInputMove = (clientX) => {
    if (dragStart !== null) {
      setDragEnd(clientX);
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
    if (distance > minSwipeDistance) nextImage();
    if (distance < -minSwipeDistance) prevImage();

    setDragStart(null);
    setDragEnd(null);
    setTimeout(() => setIsDragging(false), 100);
  };

  /* ---------------- Helpers ---------------- */
  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const idx = i + 1;
      if (idx <= rating)
        return (
          <Star
            key={idx}
            className="w-3 h-3 fill-yellow-400 text-yellow-400"
          />
        );
      if (idx - 1 < rating && rating < idx)
        return (
          <StarHalf
            key={idx}
            className="w-3 h-3 fill-yellow-400 text-yellow-400"
          />
        );
      return <Star key={idx} className="w-3 h-3 text-gray-300" />;
    });
  };

  const getDiscount = (mrp, sp) => {
    if (!mrp || sp >= mrp) return 0;
    return Math.floor(((mrp - sp) / mrp) * 100);
  };

  const discount = getDiscount(product.mrp, product.sellingPrice);

  /* ---------------- Navigation ---------------- */
  const handleNavigate = () => {
    if (isDragging) return;
    navigate(`/product/${nameToSlug(product.name)}/${product.variantId}`);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    handleNavigate();
  };

  /* ---------------- UI ---------------- */
  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 transition-all cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {discount > 0 && (
        <div className="absolute top-0 left-0 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">
          {discount}% OFF
        </div>
      )}

      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
        {campaignTag?.name || "BESTSELLER"}
      </div>

      {/* Image */}
      <div
        className="relative aspect-[4/5] bg-gray-50"
        onTouchStart={(e) => onInputStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => onInputMove(e.targetTouches[0].clientX)}
        onTouchEnd={onInputEnd}
        onMouseDown={(e) => onInputStart(e.clientX)}
        onMouseMove={(e) => onInputMove(e.clientX)}
        onMouseUp={onInputEnd}
        onMouseLeave={onInputEnd}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {images.map((img, index) => (
          <img
            key={index}
            src={img.mediaUrl}
            alt={product.name}
            loading="lazy"
            draggable="false"
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {isMounted && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-bold text-sm leading-tight">
            {product.name} ({sizeToAbbreviation(product.size)})
          </h3>

          <div className="flex items-center gap-1 mt-1">
            {renderStars(product.rating)}
            <span className="text-[10px] text-gray-400">
              ({product.totalRatings || 0})
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div>
            {product.mrp && product.mrp !== product.sellingPrice && (
              <span className="text-xs line-through text-gray-400">
                ₹{product.mrp}
              </span>
            )}
            <div className="text-lg font-bold">₹{product.sellingPrice}</div>
          </div>

          <button
            onClick={handleViewClick}
            className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            <Eye size={14} /> View
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCardTwo.displayName = "ProductCardTwo";
export default ProductCardTwo;
