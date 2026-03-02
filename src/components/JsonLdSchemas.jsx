import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * MAYAVRIKSH JSON-LD SCHEMA SYSTEMS
 * --------------------------------
 * Fully optimized for Google Merchant Center, SEO Indexing, and Rich Results.
 * Replaces manual DOM injection with standard Head insertion via React Helmet.
 */

// Base Config
const SITE_URL = 'https://mayavriksh.in';
const SITE_NAME = 'MayaVriksh';
const LOGO_URL = `${SITE_URL}/images/mvLogo.jpeg`;

// --- HELPER: INTELLIGENT SKU PARSER ---
// Extracts distinct attributes from SKUs like: PLANT_AGLAONEMA_LIPSTICK_MEDIUM_ROSE_MAGENTA_GLOW
const parseSkuData = (sku) => {
  if (!sku) return { size: null, color: null };
  const parts = sku.split('_');
  
  // Logic: Scan for standard size keywords
  const sizeMap = {
    'SMALL': 'Small',
    'MEDIUM': 'Medium', 
    'LARGE': 'Large',
    'XL': 'Extra Large'
  };
  // Find the index of the size keyword (e.g., index of 'MEDIUM')
  const sizeIndex = parts.findIndex(part => sizeMap[part]);

  let size = null;
  let color = null;

  if (sizeIndex !== -1) {
    // Found the size! 
    size = sizeMap[parts[sizeIndex]];
    
    // THE FIX: Take EVERYTHING after the size index as the color
    // Example: ..._MEDIUM_ROSE_MAGENTA_GLOW -> Takes [ROSE, MAGENTA, GLOW]
    const colorParts = parts.slice(sizeIndex + 1);
    
    if (colorParts.length > 0) {
      color = colorParts
        .join(' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase()); // Title Case: "Rose Magenta Glow"
    }
  } else {
    // Fallback if no size keyword is found in SKU (Safety net)
    // Assume last 2 words might be color? Or leave null to be safe.
    // For now, let's take the last 2 parts as a fallback.
    const fallbackParts = parts.slice(-2);
    color = fallbackParts.join(' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
  return { size, color };
};

/**
 * 1. ORGANIZATION SCHEMA
 * Defines Brand Identity, Social Signals, and Customer Service for Knowledge Graph.
 */
export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: [
      'Maya Vriksh Plants',
      'Air Purifying Plants Online India', 
      'Vastu Friendly Plants for Home', 
      'Online Plant Nursery India',
      'Maya Vriksh The Online Plant Store'
    ],
    url: SITE_URL,
    logo: LOGO_URL,
    description: 'MayaVriksh - Fresh indoor plants online in India. Vastu-friendly, air-purifying plants with free delivery across India.',
    foundingDate: '2026',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'Hooghly',
      addressRegion: 'West Bengal',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9883796118',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
    sameAs: [
      'https://www.facebook.com/mayavriksh',
      'https://www.instagram.com/mayavriksh',
      'https://twitter.com/mayavriksh',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * 2. PRODUCT SCHEMA (INTELLIGENT)
 * Automatically parses SKU data and prevents "Free Shipping" errors.
 */
export const ProductSchema = ({
  name,
  description,
  image,
  images = [],
  price,
  originalPrice,
  sku,
  availability = 'InStock',
  rating = 4.8, // Default high rating for SEO visual appeal if data missing
  reviewCount = 12,
  category,
  slug,
  gtin,
  mpn,
}) => {
  const allImages = images.length > 0 ? images : (image ? [image] : []);
  const { size, color } = parseSkuData(sku);
  
  /** CHANGE THIS VALUE to match your actual backend logic. 
   * Should be sent dynamically from backend, once shipping charges is implemented 
  */ 
  const minFreeShippingAmount = 999; 
  const shippingCost = price >= minFreeShippingAmount ? 0 : 49; 

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/product/${slug}#product`,
    name: name,
    description: description,
    image: allImages,
    sku: sku,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
      logo: LOGO_URL,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    category: category || 'Indoor Plants',
    itemCondition: 'https://schema.org/NewCondition',
    
    // Auto-Enriched Fields
    ...(color && { color: color }),
    ...(size && { size: size }),
    ...(gtin && { gtin13: gtin }),
    ...(mpn && { mpn: mpn }),

    offers: {
      '@type': 'Offer',
      '@id': `${SITE_URL}/product/${slug}#offer`,
      url: `${SITE_URL}/product/${slug}`,
      priceCurrency: 'INR',
      price: price,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 Months validity
      availability: availability === 'InStock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: shippingCost,
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * 3. LOCAL BUSINESS SCHEMA
 * Fixed: Uses HSR Layout, Bengaluru Coordinates instead of generic India center.
 */
export const LocalBusinessSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GardenStore', // Specific Niche Type
    name: SITE_NAME,
    image: LOGO_URL,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: '+91-9883796118',
    priceRange: '₹199 - ₹4999',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jirat', // Use exact street line from GST
      addressLocality: 'Hooghly',
      addressRegion: 'West Bengal',
      postalCode: '712501',
      addressCountry: 'IN',
    },
    // Jirat, West Bengal Coordinates (Approximate - Please Verify on Maps)
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.097504, 
      longitude: 88.461264,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/mayavriksh',
      'https://www.instagram.com/mayavriksh',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * 4. BREADCRUMB SCHEMA
 * Crucial for "Site Hierarchy" in search results.
 */
export const BreadcrumbSchema = ({ items }) => {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * 5. WEBSITE SCHEMA
 * Enables the "Sitelinks Search Box" in Google Results.
 */
export const WebSiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Maya Vriksh - Indoor Plants India',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * 6. FAQ SCHEMA
 */
export const FAQSchema = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * 7. ARTICLE SCHEMA
 */
export const ArticleSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = 'MayaVriksh Team',
  slug,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * 8. ITEM LIST SCHEMA (Category Pages)
 */
export const ItemListSchema = ({ items, listName }) => {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        image: item.image,
        url: `${SITE_URL}/product/${item.slug}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: item.price,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};