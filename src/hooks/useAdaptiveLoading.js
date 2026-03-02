import { useState, useEffect } from 'react';
import { getOptimalProductLimit, isSlow3GOrSlower, shouldLoadHeavyFeatures } from '../utils/networkUtils';

export default function useAdaptiveLoading() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [productLimit, setProductLimit] = useState(12);
  const [shouldLoadImages, setShouldLoadImages] = useState(true);
  const [shouldLoadAnimations, setShouldLoadAnimations] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    const checkConnection = () => {
      const slow = isSlow3GOrSlower();
      const loadHeavy = shouldLoadHeavyFeatures();
      
      setIsSlowConnection(slow);
      setProductLimit(getOptimalProductLimit());
      setShouldLoadImages(loadHeavy || !slow);
      setShouldLoadAnimations(loadHeavy);
    };

    checkConnection();

    if (typeof navigator !== 'undefined' && navigator?.connection) {
      const connection = navigator.connection;
      connection.addEventListener('change', checkConnection);
      
      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }
  }, []);

  return {
    isSlowConnection,
    productLimit,
    shouldLoadImages,
    shouldLoadAnimations,
  };
}
