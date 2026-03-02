import { useEffect } from 'react';
import { getCurrentFestival, INDIA_FORMATS } from '../constants/festivals.constants';

const BRAND_KEYWORDS = 'MayaVriksh, Maya Vriksh, mayavriksh, maya vriksha, maya plants, magic tree, vriksh';
const BRAND_NAME = 'MayaVriksh';
const BRAND_TAGLINE = 'The Tree of Magic';

/**
 * SEOHead Component - Dynamically manages meta tags for all pages
 * Supports festival-based meta tags, JSON-LD schemas, OpenGraph, Twitter Cards
 * Injects brand keywords for consistent brand recognition across all pages
 */
export const SEOHead = ({
  title = 'MayaVriksh - Fresh Indoor Plants Online India | Maya Vriksh',
  description = 'MayaVriksh (Maya Vriksh) - India\'s best online plant nursery. Maya means magic, Vriksh means tree. Buy air-purifying, Vastu plants with free delivery.',
  keywords = 'indoor plants India, buy plants online, Vastu plants, air purifying plants',
  canonicalUrl,
  ogImage = 'https://mayavriksh.in/images/mvLogo.jpeg',
  ogUrl,
  twitterHandle = '@mayavriksh',
  type = 'website',
  jsonLd = null,
  productData = null,
  price = null,
  availability = 'instock',
  currency = 'INR',
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Function to set or update meta tag
    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Get current festival for dynamic keywords
    const festival = getCurrentFestival();
    let enhancedDescription = description;
    let enhancedKeywords = keywords;

    // Always inject brand keywords for every page
    enhancedKeywords = `${BRAND_KEYWORDS}, ${keywords}`;

    // Enhance with festival context if applicable
    if (festival) {
      enhancedDescription = `${festival.name} Special - ${description}`;
      enhancedKeywords = `${enhancedKeywords}, ${festival.keywords}`;
    }

    // Basic SEO Meta Tags
    setMeta('description', enhancedDescription);
    setMeta('keywords', enhancedKeywords);
    
    // CRITICAL: Force indexing for all pages to fix "Crawled - Currently not indexed" issue
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('bingbot', 'index, follow, max-image-preview:large, max-snippet:-1');
    
    // Remove any noindex directives that might have been set elsewhere
    const removeNoindex = () => {
      const robotsMeta = document.querySelector('meta[name="robots"], meta[name="googlebot"], meta[name="bingbot"]');
      if (robotsMeta) {
        const content = robotsMeta.getAttribute('content');
        if (content && content.includes('noindex')) {
          robotsMeta.setAttribute('content', content.replace(/,?\s*noindex\s*/gi, '').replace(/,?\s*nofollow\s*/gi, ''));
        }
      }
    };
    removeNoindex();
    
    setMeta('language', 'English');
    setMeta('revisit-after', '7 days');
    setMeta('author', 'MayaVriksh');

    // India-specific meta tags
    setMeta('geo.placename', 'India');
    setMeta('geo.region', 'IN');
    setMeta('ICBM', '20.5937,78.9629');
    
    // Mobile-specific optimization (critical for Google's mobile-first indexing)
    setMeta('mobile-web-app-capable', 'yes');
    setMeta('apple-mobile-web-app-capable', 'yes');
    setMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    
    // Content type meta tag to ensure proper rendering
    setMeta('content-type', 'text/html; charset=utf-8');

    // OpenGraph Tags (Social Media Sharing)
    setMeta('og:type', type);
    setMeta('og:title', title);
    setMeta('og:description', enhancedDescription);
    setMeta('og:image', ogImage);
    setMeta('og:image:alt', 'MayaVriksh - Fresh Indoor Plants');
    setMeta('og:site_name', 'MayaVriksh');
    setMeta('og:locale', 'en_IN');
    if (ogUrl) setMeta('og:url', ogUrl);

    // Twitter Card Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', twitterHandle);
    setMeta('twitter:creator', twitterHandle);
    setMeta('twitter:title', title);
    setMeta('twitter:description', enhancedDescription);
    setMeta('twitter:image', ogImage);

    // Product-specific meta tags (for Facebook Shops & Google Merchant)
    if (type === 'product' && price) {
      setMeta('product:price:amount', String(price));
      setMeta('product:price:currency', currency);
      setMeta('product:availability', availability);
      setMeta('product:condition', 'new');
      setMeta('product:retailer_item_id', canonicalUrl?.split('/').pop() || '');
      setMeta('og:price:amount', String(price));
      setMeta('og:price:currency', currency);
    }

    // Canonical URL (for duplicate content prevention)
    if (canonicalUrl) {
      let canonicalElement = document.querySelector('link[rel="canonical"]');
      if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.rel = 'canonical';
        document.head.appendChild(canonicalElement);
      }
      canonicalElement.href = canonicalUrl;
    }

    // JSON-LD Schema for Rich Results
    if (jsonLd) {
      let jsonLdElement = document.querySelector('script[type="application/ld+json"]');
      if (!jsonLdElement) {
        jsonLdElement = document.createElement('script');
        jsonLdElement.type = 'application/ld+json';
        document.head.appendChild(jsonLdElement);
      }
      jsonLdElement.textContent = JSON.stringify(jsonLd);
    }

    // Track page view in GA4
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }

    return () => {
      // Cleanup is handled by React's effect cleanup
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogUrl, twitterHandle, type, jsonLd, price, availability, currency]);

  return null;
};

/**
 * Hook to easily generate SEO props for pages
 */
export const useSEOHead = (options = {}) => {
  const {
    title,
    description,
    keywords,
    productData,
    category,
  } = options;

  const festival = getCurrentFestival();
  
  let finalTitle = title;
  let finalDescription = description;
  let finalKeywords = keywords;

  // Enhance with festival context if available
  if (festival) {
    if (!title?.includes(festival.name)) {
      finalTitle = title || festival.title;
      finalDescription = description || festival.description;
      finalKeywords = keywords || festival.keywords;
    }
  }

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
  };
};
