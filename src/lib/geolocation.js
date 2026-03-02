import { trackEvent } from './analytics';

// Request browser geolocation permission and send to GA4
export const requestBrowserLocation = () => {
  if (!navigator.geolocation) {
    console.warn('Geolocation API not supported by this browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      // Send precise location to GA4
      trackEvent('browser_location_granted', 'geolocation', 'location_permission', null, {
        latitude,
        longitude,
        accuracy
      });

      console.log('Browser location captured:', {
        latitude,
        longitude,
        accuracy: `${accuracy}m`
      });

      return { latitude, longitude, accuracy };
    },
    (error) => {
      // User denied permission or other error
      const errorMessages = {
        1: 'Location permission denied',
        2: 'Location information unavailable',
        3: 'Geolocation request timed out'
      };

      trackEvent('browser_location_denied', 'geolocation', errorMessages[error.code] || 'Unknown error');
      console.warn('Geolocation error:', errorMessages[error.code]);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

// Get location without firing GA4 event (internal use)
export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};
