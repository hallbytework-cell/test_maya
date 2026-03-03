/**
 * OptimizedImageResponsive - Image component with:
 * - Explicit width/height to prevent layout shift (CLS)
 * - Lazy loading on intersection observer
 * - Responsive srcset for different screen sizes
 * - WebP format support with PNG fallback
 * - Proper aspect ratio to prevent reflow
 */

import { useState, useEffect, useRef } from 'react';

export default function OptimizedImageResponsive({
  src,
  alt,
  width,
  height,
  srcset,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px',
  className = '',
  loading = 'lazy',
  fetchpriority = 'low',
  webpSrc,
  onLoad,
  style = {},
}) {
  const [isLoaded, setIsLoaded] = useState(loading === 'eager');
  const [imageSrc, setImageSrc] = useState(loading === 'eager' ? src : null);
  const imgRef = useRef(null);

  // Calculate aspect ratio to prevent CLS
  const aspectRatio = height && width ? (height / width) * 100 : 'auto';
  const paddingBottom = typeof aspectRatio === 'number' ? `${aspectRatio}%` : 'auto';

  useEffect(() => {
    if (loading === 'eager') {
      setImageSrc(src);
      setIsLoaded(true);
      return;
    }

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, loading]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        paddingBottom: paddingBottom !== 'auto' ? paddingBottom : undefined,
        ...style,
      }}
    >
      {/* Wrapper for aspect ratio maintenance */}
      <div
        style={{
          position: paddingBottom !== 'auto' ? 'absolute' : 'static',
          top: 0,
          left: 0,
          width: paddingBottom !== 'auto' ? '100%' : 'auto',
          height: paddingBottom !== 'auto' ? '100%' : 'auto',
        }}
      >
        {/* WebP format with PNG fallback and responsive srcset */}
        {webpSrc && imageSrc && (
          <picture>
            <source
              srcSet={srcset || webpSrc}
              sizes={sizes}
              type="image/webp"
            />
            <img
              ref={imgRef}
              src={imageSrc}
              srcSet={srcset}
              sizes={sizes}
              alt={alt}
              width={width}
              height={height}
              loading={loading}
              fetchPriority={fetchpriority}
              onLoad={() => {
                setIsLoaded(true);
                onLoad?.();
              }}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                objectFit: 'cover',
              }}
            />
          </picture>
        )}

        {/* Standard img tag if no WebP */}
        {!webpSrc && imageSrc && (
          <img
            ref={imgRef}
            src={imageSrc}
            srcSet={srcset}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            fetchPriority={fetchpriority}
            onLoad={() => {
              setIsLoaded(true);
              onLoad?.();
            }}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Loading placeholder */}
        {!isLoaded && imageSrc && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
              zIndex: 1,
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
