/**
 * SEO Hreflang Configuration
 * Manages alternate language and regional versions of pages
 * Helps Google understand page relationships and avoid duplicate content issues
 */

export const HREFLANG_CONFIG = {
  // Primary region and language
  primary: {
    lang: 'en-IN',
    region: 'IN',
    url: 'https://mayavriksh.in',
  },
  
  // Alternate regions (for future expansion)
  alternates: [
    {
      lang: 'en',
      region: 'GLOBAL',
      url: 'https://mayavriksh.in',
    },
  ],
  
  // Default fallback for undefined regions
  xDefault: {
    lang: 'en',
    region: 'GLOBAL',
    url: 'https://mayavriksh.in',
  },
};

/**
 * Generate hreflang link tags for a given path
 * @param {string} path - The page path (e.g., '/product/peace-lily')
 * @returns {Array} Array of hreflang objects
 */
export const getHreflangLinks = (path = '/') => {
  const links = [];
  
  // Add primary language link
  links.push({
    rel: 'alternate',
    hreflang: HREFLANG_CONFIG.primary.lang,
    href: `${HREFLANG_CONFIG.primary.url}${path}`,
  });
  
  // Add additional language variants
  HREFLANG_CONFIG.alternates.forEach(alt => {
    links.push({
      rel: 'alternate',
      hreflang: alt.lang,
      href: `${alt.url}${path}`,
    });
  });
  
  // Add x-default for international audiences
  links.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${HREFLANG_CONFIG.xDefault.url}${path}`,
  });
  
  // Add self-referential canonical
  links.push({
    rel: 'canonical',
    hreflang: HREFLANG_CONFIG.primary.lang,
    href: `${HREFLANG_CONFIG.primary.url}${path}`,
  });
  
  return links;
};

/**
 * Get hreflang meta tags as HTML strings
 */
export const getHreflangMetaTags = (path = '/') => {
  const links = getHreflangLinks(path);
  return links.map(link => {
    let tag = `<link rel="${link.rel}"`;
    if (link.hreflang) tag += ` hreflang="${link.hreflang}"`;
    tag += ` href="${link.href}" />`;
    return tag;
  });
};

/**
 * Inject hreflang tags into document head
 */
export const injectHreflangTags = (path = '/') => {
  if (typeof document === 'undefined') return;
  
  const links = getHreflangLinks(path);
  
  // Remove old hreflang tags
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  document.querySelectorAll('link[rel="canonical"]').forEach(el => el.remove());
  
  // Inject new tags
  links.forEach(link => {
    const linkEl = document.createElement('link');
    linkEl.rel = link.rel;
    if (link.hreflang) linkEl.hreflang = link.hreflang;
    linkEl.href = link.href;
    document.head.appendChild(linkEl);
  });
};

/**
 * Get hreflang JSON-LD schema for international SEO
 */
export const getHreflangJsonLd = (path = '/') => {
  const links = getHreflangLinks(path);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': `${HREFLANG_CONFIG.primary.url}${path}`,
    'inLanguage': HREFLANG_CONFIG.primary.lang,
    'potentialAction': {
      '@type': 'ViewAction',
      'target': links.map(link => ({
        '@type': 'EntryPoint',
        'urlTemplate': link.href,
        'actionPlatform': link.hreflang,
      })),
    },
  };
};

/**
 * Validate and fix hreflang implementation across page
 */
export const validateHreflang = (path = '/') => {
  if (typeof document === 'undefined') return { valid: true, issues: [] };
  
  const issues = [];
  
  // Check if hreflang tags exist
  const hreflangTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
  if (hreflangTags.length === 0) {
    issues.push('No hreflang tags found');
  }
  
  // Check if canonical exists
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push('No canonical tag found');
  }
  
  // Check for duplicate hreflang values
  const hreflangs = Array.from(hreflangTags).map(tag => tag.hreflang);
  const duplicates = hreflangs.filter((item, index) => hreflangs.indexOf(item) !== index);
  if (duplicates.length > 0) {
    issues.push(`Duplicate hreflang values: ${duplicates.join(', ')}`);
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
};
