import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent } from '@/lib/analytics';

/**
 * PageViewTracker - Automatically tracks page views in Google Analytics
 * Attaches to the router location and sends pageview events when the path changes
 */
export function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view whenever location changes
    if (typeof window !== 'undefined' && window.gtag) {
      // Send pageview event
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
      });

      console.log('📊 GA4 Pageview tracked:', location.pathname);
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
}
