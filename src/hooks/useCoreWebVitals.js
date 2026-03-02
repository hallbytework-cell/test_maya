import { useEffect, useCallback } from 'react';
import { trackTiming, trackCustomEvent } from '../lib/seoAnalytics';
import logger from '@/lib/logger';

export const useCoreWebVitals = (options = {}) => {
  const { debug = false, sendToAnalytics = true } = options;

  const reportMetric = useCallback((metric) => {
    if (debug) {
      logger.debug(`[CWV] ${metric.name}: ${metric.value}`);
    }

    if (sendToAnalytics) {
      trackTiming(metric.name, Math.round(metric.value), 'Core Web Vitals');
      trackCustomEvent('web_vitals', {
        metric_name: metric.name,
        metric_value: Math.round(metric.value),
        metric_rating: metric.rating || 'unknown',
      });
    }
  }, [debug, sendToAnalytics]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observeLCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const lcp = lastEntry.startTime;
            reportMetric({
              name: 'LCP',
              value: lcp,
              rating: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor',
            });
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        return observer;
      } catch (e) {
        return null;
      }
    };

    const observeFID = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fid = entry.processingStart - entry.startTime;
            reportMetric({
              name: 'FID',
              value: fid,
              rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
            });
          });
        });
        observer.observe({ type: 'first-input', buffered: true });
        return observer;
      } catch (e) {
        return null;
      }
    };

    const observeCLS = () => {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          reportMetric({
            name: 'CLS',
            value: clsValue,
            rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
          });
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        return observer;
      } catch (e) {
        return null;
      }
    };

    const observeFCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            reportMetric({
              name: 'FCP',
              value: fcpEntry.startTime,
              rating: fcpEntry.startTime <= 1800 ? 'good' : fcpEntry.startTime <= 3000 ? 'needs-improvement' : 'poor',
            });
          }
        });
        observer.observe({ type: 'paint', buffered: true });
        return observer;
      } catch (e) {
        return null;
      }
    };

    const measureTTFB = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart;
          reportMetric({
            name: 'TTFB',
            value: ttfb,
            rating: ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor',
          });
        }
      } catch (e) {
      }
    };

    const lcpObserver = observeLCP();
    const fidObserver = observeFID();
    const clsObserver = observeCLS();
    const fcpObserver = observeFCP();
    measureTTFB();

    return () => {
      lcpObserver?.disconnect();
      fidObserver?.disconnect();
      clsObserver?.disconnect();
      fcpObserver?.disconnect();
    };
  }, [reportMetric]);
};

export const usePageLoadPerformance = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measurePageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (!navigation) return;

      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ssl: navigation.secureConnectionStart > 0 
          ? navigation.connectEnd - navigation.secureConnectionStart 
          : 0,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domParsing: navigation.domInteractive - navigation.responseEnd,
        domComplete: navigation.domComplete - navigation.domInteractive,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.startTime,
      };

      Object.entries(metrics).forEach(([name, value]) => {
        if (value > 0) {
          trackTiming(`page_${name}`, Math.round(value), 'Page Load');
        }
      });
    };

    if (document.readyState === 'complete') {
      setTimeout(measurePageLoad, 0);
    } else {
      window.addEventListener('load', () => {
        setTimeout(measurePageLoad, 0);
      });
    }
  }, []);
};

export const useResourcePerformance = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 500) {
          trackCustomEvent('slow_resource', {
            resource_name: entry.name,
            resource_type: entry.initiatorType,
            duration: Math.round(entry.duration),
          });
        }
      });
    });

    try {
      observer.observe({ type: 'resource', buffered: true });
    } catch (e) {
    }

    return () => observer.disconnect();
  }, []);
};

export const useLongTaskPerformance = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        trackCustomEvent('long_task', {
          duration: Math.round(entry.duration),
          start_time: Math.round(entry.startTime),
        });
      });
    });

    try {
      observer.observe({ type: 'longtask', buffered: true });
    } catch (e) {
    }

    return () => observer.disconnect();
  }, []);
};

export const usePerformanceMonitoring = (options = {}) => {
  useCoreWebVitals(options);
  usePageLoadPerformance();
  useResourcePerformance();
  useLongTaskPerformance();
};

export default useCoreWebVitals;