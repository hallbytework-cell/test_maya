export function measurePerformance(componentName) {
  if (typeof performance === 'undefined' || typeof performance.mark !== 'function') {
    return {
      start: () => {},
      end: () => {},
    };
  }

  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  const measureName = `${componentName}-render`;

  return {
    start: () => {
      performance.mark(startMark);
    },
    end: () => {
      performance.mark(endMark);
      try {
        performance.measure(measureName, startMark, endMark);
        const measure = performance.getEntriesByName(measureName)[0];
        if (measure && measure.duration > 100) {
          console.warn(
            `⚠️ Slow render detected: ${componentName} took ${measure.duration.toFixed(2)}ms`
          );
        }
      } catch (error) {
        // Silently fail if marks don't exist
      }
    },
  };
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function memoizeOne(fn) {
  let lastArgs;
  let lastResult;
  
  return function(...args) {
    if (lastArgs && args.every((arg, i) => arg === lastArgs[i])) {
      return lastResult;
    }
    lastArgs = args;
    lastResult = fn(...args);
    return lastResult;
  };
}
