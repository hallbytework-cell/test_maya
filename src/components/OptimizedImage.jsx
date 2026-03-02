import { WorkOutlined } from '@mui/icons-material';
import React, { useState } from 'react';

/**
 * Optimized image component with:
 * - Lazy loading (lazy attribute)
 * - Responsive image sizes (srcSet support)
 * - Multiple format support (WebP → JPEG/PNG → fallback)
 * - Loading placeholder with fade-in animation
 * - Async decoding for performance
 * 
 * Usage:
 * <OptimizedImage 
 *   src="/images/products/peace-lily.jpg"
 *   alt="Peace Lily Plant"
 *   className="w-full h-auto"
 *   priority={true}  // Use for above-the-fold images
 * />
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  width,
  height,
  priority = false,
  srcSet = null,
  onLoad = null,
  onError = null,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate WebP version if jpg/png/jpeg provided
  const webpSrc = src?.replace(/\.(jpg|jpeg|png)$/i, '.webp') || src;
  
  // Generate AVIF version (next-gen format, better than WebP for modern browsers)
  // AVIF support is ~90% in modern browsers
  const avifSrc = src?.replace(/\.(jpg|jpeg|png)$/i, '.avif') || src;

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  return (
    <picture className={error ? 'bg-gray-200' : ''}>
      {/* AVIF: Ultra-modern format (~60% smaller than JPEG) - for newer browsers */}
      <source 
        srcSet={srcSet?.avif || avifSrc}
        type="image/avif"
      />
      
      {/* WebP: Modern format (~30% smaller than JPEG) - for Chrome, Edge, Firefox */}
      <source 
        srcSet={srcSet?.webp || webpSrc}
        type="image/webp"
      />
      
      {/* Fallback to original format - for older browsers */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
      />
    </picture>
  );
}
