/**
 * Enhanced GA4 Event Tracking for Ecommerce SEO
 * Tracks user behavior for better search rankings
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Check if GA is available
 */
const isGAAvailable = () => {
  return typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID;
};

/**
 * Track page view with enhanced data
 */
export const trackPageView = (pagePath, pageTitle, additionalParams = {}) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
    ...additionalParams,
  });
};

/**
 * Track product view
 */
export const trackProductView = (product) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'view_item', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: product.id || product.sku,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
};

/**
 * Track product list view (category page)
 */
export const trackProductListView = (products, listName = 'Category') => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'view_item_list', {
    item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
    item_list_name: listName,
    items: products.slice(0, 10).map((product, index) => ({
      item_id: product.id || product.sku,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      index: index,
      quantity: 1,
    })),
  });
};

/**
 * Track add to cart
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id || product.sku,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: quantity,
      },
    ],
  });
};

/**
 * Track remove from cart
 */
export const trackRemoveFromCart = (product, quantity = 1) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'remove_from_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id || product.sku,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: quantity,
      },
    ],
  });
};

/**
 * Track begin checkout
 */
export const trackBeginCheckout = (cartItems, totalValue) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: totalValue,
    items: cartItems.map((item, index) => ({
      item_id: item.id || item.sku,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
      index: index,
    })),
  });
};

/**
 * Track purchase complete
 */
export const trackPurchase = (transactionId, cartItems, totalValue, shipping = 0, tax = 0) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'INR',
    value: totalValue,
    shipping: shipping,
    tax: tax,
    items: cartItems.map((item, index) => ({
      item_id: item.id || item.sku,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
      index: index,
    })),
  });
};

/**
 * Track search query
 */
export const trackSearch = (searchTerm, resultsCount = 0) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Track share event
 */
export const trackShare = (method, contentType, itemId) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'share', {
    method: method,
    content_type: contentType,
    item_id: itemId,
  });
};

/**
 * Track sign up
 */
export const trackSignUp = (method = 'email') => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'sign_up', {
    method: method,
  });
};

/**
 * Track login
 */
export const trackLogin = (method = 'email') => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'login', {
    method: method,
  });
};

/**
 * Track custom events
 */
export const trackCustomEvent = (eventName, eventParams = {}) => {
  if (!isGAAvailable()) return;

  window.gtag('event', eventName, eventParams);
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percentage) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'scroll', {
    percent_scrolled: percentage,
  });
};

/**
 * Track outbound link clicks
 */
export const trackOutboundLink = (url) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'click', {
    event_category: 'outbound',
    event_label: url,
    transport_type: 'beacon',
  });
};

/**
 * Track file downloads
 */
export const trackDownload = (fileName, fileType) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'file_download', {
    file_name: fileName,
    file_extension: fileType,
  });
};

/**
 * Track video engagement
 */
export const trackVideoEvent = (action, videoTitle, videoUrl) => {
  if (!isGAAvailable()) return;

  window.gtag('event', `video_${action}`, {
    video_title: videoTitle,
    video_url: videoUrl,
  });
};

/**
 * Track timing for performance
 */
export const trackTiming = (name, value, category = 'Performance') => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'timing_complete', {
    name: name,
    value: value,
    event_category: category,
  });
};

/**
 * Track exceptions/errors
 */
export const trackException = (description, fatal = false) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'exception', {
    description: description,
    fatal: fatal,
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (properties) => {
  if (!isGAAvailable()) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Track form submission
 */
export const trackFormSubmit = (formName, formId) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'form_submit', {
    form_name: formName,
    form_id: formId,
  });
};

/**
 * Track wishlist actions
 */
export const trackWishlistAdd = (product) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'add_to_wishlist', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: product.id || product.sku,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      },
    ],
  });
};

/**
 * Track promotion views
 */
export const trackPromotionView = (promotionName, promotionId) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'view_promotion', {
    creative_name: promotionName,
    promotion_id: promotionId,
    promotion_name: promotionName,
  });
};

/**
 * Track promotion clicks
 */
export const trackPromotionClick = (promotionName, promotionId) => {
  if (!isGAAvailable()) return;

  window.gtag('event', 'select_promotion', {
    creative_name: promotionName,
    promotion_id: promotionId,
    promotion_name: promotionName,
  });
};
