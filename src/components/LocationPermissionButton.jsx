import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';

/**
 * LocationPermissionButton - Requests browser geolocation permission
 * 
 * When user clicks "Allow Location":
 * 1. Browser shows permission prompt
 * 2. If allowed → Captures precise lat/long
 * 3. Automatically sends to GA4 as browser_location_granted event
 * 
 * Usage:
 * <LocationPermissionButton />
 */
export function LocationPermissionButton() {
  const { location, loading, error, requestLocation } = useGeolocation();
  const [granted, setGranted] = useState(false);

  const handleClick = async () => {
    await requestLocation();
    setGranted(true);
  };

  // If location already granted and captured
  if (granted && location) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">
          Location shared ({location.latitude.toFixed(2)}, {location.longitude.toFixed(2)})
        </span>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">Location access denied</span>
      </div>
    );
  }

  // Button to request location
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      data-testid="button-request-location"
    >
      <MapPin className="w-4 h-4" />
      <span className="text-sm">
        {loading ? 'Requesting location...' : 'Share My Location'}
      </span>
    </button>
  );
}
