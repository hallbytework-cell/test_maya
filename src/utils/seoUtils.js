/**
 * SEO Utilities for URL slugs, canonical URLs, and meta generation
 */

const SITE_URL = 'https://mayavriksh.in';

/**
 * Generate SEO-friendly slug from text
 * Example: "Peace Lily Medium Ceramic Pot" -> "peace-lily-medium-ceramic-pot"
 */
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate product slug with category
 * Example: "Peace Lily" in "Indoor Plants" -> "indoor-plants/peace-lily"
 */
export const generateProductSlug = (productName, category = '') => {
  const productSlug = generateSlug(productName);
  if (category) {
    const categorySlug = generateSlug(category);
    return `${categorySlug}/${productSlug}`;
  }
  return productSlug;
};

/**
 * Generate canonical URL (removes query params that cause duplicate content)
 */
export const getCanonicalUrl = (path, allowedParams = []) => {
  const url = new URL(path, SITE_URL);
  
  // Keep only allowed query params
  const searchParams = new URLSearchParams();
  allowedParams.forEach(param => {
    if (url.searchParams.has(param)) {
      searchParams.set(param, url.searchParams.get(param));
    }
  });
  
  // Rebuild URL with only allowed params
  const cleanPath = url.pathname.replace(/\/$/, ''); // Remove trailing slash
  const queryString = searchParams.toString();
  
  return `${SITE_URL}${cleanPath}${queryString ? `?${queryString}` : ''}`;
};

/**
 * Generate meta title with proper format
 * Format: "Page Title | Category | MayaVriksh"
 */
export const generateMetaTitle = (title, category = '', siteName = 'MayaVriksh') => {
  const parts = [title];
  if (category) parts.push(category);
  parts.push(siteName);
  
  // Keep title under 60 characters for SEO
  let metaTitle = parts.join(' | ');
  if (metaTitle.length > 60) {
    metaTitle = `${title} | ${siteName}`;
  }
  
  return metaTitle;
};

/**
 * Generate meta description (max 160 characters)
 */
export const generateMetaDescription = (description, maxLength = 160) => {
  if (!description) return '';
  
  if (description.length <= maxLength) {
    return description;
  }
  
  // Truncate at last complete word before maxLength
  const truncated = description.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return `${truncated.substring(0, lastSpace)}...`;
};

/**
 * Generate product meta description
 */
export const generateProductMetaDescription = (product) => {
  const price = `₹${product.price?.toLocaleString('en-IN') || ''}`;
  const description = product.shortDescription || product.description || '';
  
  return generateMetaDescription(
    `${product.name} - ${price}. ${description} Free delivery across India. Shop now at MayaVriksh.`
  );
};

/**
 * Generate category meta description
 */
export const generateCategoryMetaDescription = (category, count = 0) => {
  return generateMetaDescription(
    `Browse ${count > 0 ? count : 'our collection of'} ${category} plants online in India. Air-purifying, Vastu-friendly plants with free delivery. Shop now at MayaVriksh.`
  );
};

/**
 * India-specific keywords generator
 */
export const generateIndiaKeywords = (baseKeywords = [], productName = '', category = '') => {
  const indiaKeywords = [
    'India',
    'buy online India',
    'delivery India',
    'Indian homes',
  ];
  
  const vastuKeywords = [
    'Vastu plants',
    'lucky plants',
    'prosperity plants',
  ];
  
  const giftingKeywords = [
    'gifting plants',
    'plant gifts',
    'gift plants online',
  ];
  
  const allKeywords = [
    ...baseKeywords,
    productName,
    category,
    ...indiaKeywords,
    ...vastuKeywords,
    ...giftingKeywords,
  ].filter(Boolean);
  
  // Remove duplicates and join
  return [...new Set(allKeywords)].join(', ');
};

/**
 * Generate breadcrumb items for a page
 */
export const generateBreadcrumbs = (items) => {
  return [
    { name: 'Home', url: '/' },
    ...items,
  ];
};

/**
 * Generate OpenGraph image URL
 */
export const getOGImageUrl = (imagePath) => {
  if (!imagePath) return `${SITE_URL}/images/mvLogo.jpeg`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${SITE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

/**
 * Generate structured URL for products
 */
export const generateProductUrl = (productId, productName, potId = null) => {
  const slug = generateSlug(productName);
  let url = `/product/${slug}-${productId}`;
  if (potId) {
    url += `?potId=${potId}`;
  }
  return url;
};

/**
 * Generate structured URL for categories
 */
export const generateCategoryUrl = (categoryName, subcategory = '') => {
  const categorySlug = generateSlug(categoryName);
  if (subcategory) {
    const subcategorySlug = generateSlug(subcategory);
    return `/plants/${categorySlug}/${subcategorySlug}`;
  }
  return `/plants/${categorySlug}`;
};

/**
 * Extract product ID from slug URL
 * Example: "peace-lily-123" -> "123"
 */
export const extractProductIdFromSlug = (slug) => {
  if (!slug) return null;
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  return !isNaN(lastPart) ? lastPart : null;
};

/**
 * Format price for India
 */
export const formatIndianPrice = (price) => {
  if (!price && price !== 0) return '';
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

/**
 * Format date for India
 */
export const formatIndianDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generate hreflang tags for international SEO
 */
export const getHreflangTags = (currentPath) => {
  return [
    { lang: 'en-IN', url: `${SITE_URL}${currentPath}` },
    { lang: 'x-default', url: `${SITE_URL}${currentPath}` },
  ];
};

/**
 * Check if URL needs noindex
 */
export const shouldNoIndex = (path) => {
  const noIndexPaths = [
    '/checkout',
    '/cart',
    '/login',
    '/signup',
    '/dashboard',
    '/account/profile',
    '/account/order',
    '/order',
  ];
  
  return noIndexPaths.some(noIndexPath => path.startsWith(noIndexPath));
};

/**
 * Generate robots meta content
 */
export const getRobotsContent = (path) => {
  if (shouldNoIndex(path)) {
    return 'noindex, nofollow';
  }
  return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
};
/**
 * CRITICAL: Prevent accidental noindex directives
 * Removes any noindex tags that might interfere with Google indexing
 * This fixes "Crawled - Currently not indexed" issues
 */
export const ensureIndexable = () => {
  if (typeof document === 'undefined') return;
  
  // Remove any meta tags with noindex
  document.querySelectorAll('meta[name="robots"], meta[name="googlebot"], meta[name="bingbot"]').forEach(meta => {
    const content = meta.getAttribute('content');
    if (content && content.includes('noindex')) {
      // Replace with proper indexing directive
      const cleanContent = content
        .replace(/,?\s*noindex\s*/gi, '')
        .replace(/,?\s*nofollow\s*/gi, '')
        .trim()
        .replace(/^,\s*/, '');
      
      // Set to default indexing for crawlable pages
      if (!cleanContent.includes('index')) {
        meta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      } else {
        meta.setAttribute('content', cleanContent);
      }
    }
  });
};

/**
 * Verify page is properly configured for indexing
 * Returns object with indexing status and potential issues
 */
export const verifyIndexingStatus = () => {
  const status = {
    isIndexable: true,
    issues: [],
    warnings: [],
  };

  if (typeof document === 'undefined') return status;

  // Check for noindex directive
  const robotsMeta = document.querySelector('meta[name="robots"]');
  if (robotsMeta && robotsMeta.getAttribute('content').includes('noindex')) {
    status.isIndexable = false;
    status.issues.push('Page has noindex directive');
  }

  // Check for canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    status.warnings.push('No canonical URL found');
  }

  // Check for og:url (important for social indexing)
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    status.warnings.push('No og:url meta tag found');
  }

  // Check for proper description
  const description = document.querySelector('meta[name="description"]');
  if (!description) {
    status.warnings.push('No meta description found');
  }

  // Check for mobile viewport
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    status.warnings.push('No viewport meta tag found - affects mobile indexing');
  }

  return status;
};

/**
 * Generate complete indexing headers for server responses
 */
export const getIndexingHeaders = (path = '/') => {
  const headers = {
    'X-Robots-Tag': getRobotsContent(path),
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    'X-Content-Type-Options': 'nosniff',
  };

  // For critical indexable pages
  if (!shouldNoIndex(path)) {
    headers['Cache-Control'] = 'public, max-age=3600, stale-while-revalidate=86400';
  }

  return headers;
};

/**
 * Get mobile-first indexing meta tags
 */
export const getMobileIndexingTags = () => {
  return {
    viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
    mobileWebAppCapable: 'yes',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
  };
};

/**
 * Sanitize URL to prevent indexing issues
 * Removes tracking parameters and duplicates
 */
export const sanitizeUrlForIndexing = (url) => {
  try {
    const urlObj = new URL(url);
    
    // List of parameters that create duplicate content
    const duplicateParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'fbclid', 'gclid', 'msclkid', 'ref', 'source', 'potId',
    ];

    // Remove duplicate-creating parameters
    duplicateParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });

    return urlObj.toString();
  } catch (e) {
    return url;
  }
};
