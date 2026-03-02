import { useCallback } from 'react';
import { updateConsent } from '@/lib/analytics';

export const useConsent = () => {
  const grantAnalytics = useCallback(() => {
    updateConsent('analytics', true);
    sessionStorage.setItem('analytics_consent', 'true');
  }, []);

  const revokeAnalytics = useCallback(() => {
    updateConsent('analytics', false);
    sessionStorage.setItem('analytics_consent', 'false');
  }, []);

  const grantAll = useCallback(() => {
    updateConsent('all', true);
    sessionStorage.setItem('all_consent', 'true');
  }, []);

  const revokeAll = useCallback(() => {
    updateConsent('all', false);
    sessionStorage.setItem('all_consent', 'false');
  }, []);

  const isAnalyticsGranted = () => {
    const stored = sessionStorage.getItem('analytics_consent');
    return stored === 'true';
  };

  return {
    grantAnalytics,
    revokeAnalytics,
    grantAll,
    revokeAll,
    isAnalyticsGranted,
  };
};
