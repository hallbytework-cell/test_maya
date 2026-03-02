import { useEffect, useState } from 'react';
import { requestBrowserLocation, getBrowserLocation } from '@/lib/geolocation';

export const useGeolocation = (autoRequest = false) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const coords = await getBrowserLocation();
      setLocation(coords);
      // Track this in GA4
      requestBrowserLocation();
      return coords;
    } catch (err) {
      setError(err.message);
      console.error('Failed to get location:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRequest && navigator.geolocation) {
      requestLocation();
    }
  }, [autoRequest]);

  return {
    location,
    loading,
    error,
    requestLocation
  };
};
