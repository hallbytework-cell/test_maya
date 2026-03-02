import logger from './logger';

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    logger.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  logger.info('Initializing Google Analytics');

  window.dataLayer = window.dataLayer || [];
  
  function gtag() {
    window.dataLayer.push(arguments);
  }
  
  window.gtag = gtag;
  
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', measurementId, {
    'anonymize_ip': true,
    'allow_google_signals': false,
    'allow_ad_personalization_signals': false
  });
  
  gtag('consent', 'default', {
    'analytics_storage': 'granted',
    'ad_storage': 'denied'
  });
  
  logger.debug('Google Analytics v4 initialized');
};

export const updateConsent = (consentType, granted) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const consentUpdate = {};
  
  if (consentType === 'all' || consentType === 'analytics') {
    consentUpdate['analytics_storage'] = granted ? 'granted' : 'denied';
  }
  if (consentType === 'all' || consentType === 'ads') {
    consentUpdate['ad_storage'] = granted ? 'granted' : 'denied';
  }
  
  window.gtag('consent', 'update', consentUpdate);
};

export const trackPageView = (url) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

export const trackEvent = (
  action, 
  category,
  label,
  value,
  customParams
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  logger.debug('GA4 Event tracked', { action, category, label });
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...customParams
  });
};

export const trackUserEngagement = (engagementType, metadata) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'user_engagement', {
    engagement_type: engagementType,
    ...metadata
  });
};

export const trackConversion = (conversionType, conversionValue) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'conversion', {
    conversion_type: conversionType,
    conversion_value: conversionValue
  });
};

export const trackProductView = (productId, productName, price, category) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'view_item', {
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
      item_category: category
    }]
  });
};

export const trackAddToCart = (productId, productName, price, quantity) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'add_to_cart', {
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
      quantity: quantity
    }]
  });
};

export const trackSearch = (searchQuery, results_count) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'search', {
    search_term: searchQuery,
    results_count: results_count
  });
};

export const trackBeginCheckout = (cartValue, itemCount) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'begin_checkout', {
    value: cartValue,
    currency: 'INR',
    items_count: itemCount
  });
};

export const trackPurchase = (orderId, orderValue, itemCount, paymentMethod) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'purchase', {
    transaction_id: orderId,
    value: orderValue,
    currency: 'INR',
    items_count: itemCount,
    payment_method: paymentMethod
  });
};

export const trackLogin = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'login');
};

export const trackSignup = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'sign_up');
};