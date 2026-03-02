import { useEffect, useRef } from 'react';
import logger from '@/lib/logger';

export default function usePerformanceMonitor(componentName) {
  const renderStartRef = useRef(null);

  useEffect(() => {
    if (renderStartRef.current && typeof performance !== 'undefined' && performance.mark) {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStartRef.current;
      
      if (renderTime > 16) {
        logger.warn(
          `Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`,
          { component: componentName, renderTime: parseFloat(renderTime.toFixed(2)) }
        );
      }
    }
  });

  if (typeof performance !== 'undefined' && performance.now) {
    renderStartRef.current = performance.now();
  }
}
