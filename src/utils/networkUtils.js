export function getNetworkSpeed() {
  if (typeof navigator === 'undefined' || !navigator?.connection) {
    return 'unknown';
  }
  
  const connection = navigator.connection;
  const effectiveType = connection.effectiveType;
  
  return effectiveType || 'unknown';
}

export function isSlow3GOrSlower() {
  const speed = getNetworkSpeed();
  if (speed === 'unknown') {
    return false;
  }
  return speed === 'slow-2g' || speed === '2g' || speed === '3g';
}

export function shouldLoadHeavyFeatures() {
  if (typeof navigator === 'undefined' || !navigator?.connection) {
    return true;
  }
  
  const connection = navigator.connection;
  const saveData = connection.saveData;
  
  if (saveData) {
    return false;
  }
  
  return !isSlow3GOrSlower();
}

export function getOptimalImageQuality() {
  if (isSlow3GOrSlower()) {
    return 'low';
  }
  
  const speed = getNetworkSpeed();
  if (speed === '4g') {
    return 'high';
  }
  
  return 'medium';
}

export function getOptimalProductLimit() {
  if (isSlow3GOrSlower()) {
    return 6;
  }
  
  return 12;
}

export function getCacheTime(endpoint) {
  const cacheConfig = {
    categories: {
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    },
    products: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
    },
    cart: {
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    },
    user: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 15,
    },
    default: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }
  };
  
  return cacheConfig[endpoint] || cacheConfig.default;
}
