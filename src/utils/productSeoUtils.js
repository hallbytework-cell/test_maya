/**
 * Product SEO Utilities
 * Generates breadcrumb hierarchy and product-specific FAQs for SEO
 */

const SITE_URL = 'https://mayavriksh.in';

const CATEGORY_LABELS = {
  "indoor-plants": 'Indoor Plants',
  "outdoor-plants": 'Outdoor Plants',
  "succulents-cacti": 'Succulents & Cacti',
  "flowering-plants": 'Flowering Plants',
  "ferns-mosses": 'Ferns & Mosses',
  "herbs-edibles": 'Herbs & Edibles',
  "trees-shrubs": 'Trees & Shrubs',
  "aquatic-plants": 'Aquatic Plants',
  "air-plants": 'Air Plants',
  "ornamental-grasses": 'Ornamental Grasses',
};

// const CATEGORY_URLS = {
//   "indoor-plants": '/sub=indoor-plants',
//   "outdoor-plants": '/sub=outdoor-plants',
//   "succulents-cacti": '/sub=succulents-cacti',
//   "flowering-plants": '/sub=flowering-plants',
//   "ferns-mosses": '/sub=ferns-mosses',
//   "herbs-edibles": '/sub=herbs-edibles',
//   "trees-shrubs": '/sub=trees-shrubs',
//   "aquatic-plants": '/sub=aquatic-plants',
//   "air-plants": '/sub=air-plants',
//   "ornamental-grasses": '/sub=ornamental-grasses',
// };

const CATEGORY_URLS = {
  "indoor-plants": '/category/plants?sub=indoor-plants',
  "outdoor-plants": '/category/plants?sub=outdoor-plants',
  "succulents-cacti": '/category/plants?sub=succulents-cacti',
  "flowering-plants": '/category/plants?sub=flowering-plants',
  "ferns-mosses": '/category/plants?sub=ferns-mosses',
  "herbs-edibles": '/category/plants?sub=herbs-edibles',
  "trees-shrubs": '/category/plants?sub=trees-shrubs',
  "aquatic-plants": '/category/plants?sub=aquatic-plants',
  "air-plants": '/category/plants?sub=air-plants',
  "ornamental-grasses": '/category/plants?sub=ornamental-grasses',
};

export const generateProductBreadcrumbs = (product, variantId, category) => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Plants', url: '/category/plants' },
  ];

  if (category && CATEGORY_LABELS[category]) {
    breadcrumbs.push({
      name: CATEGORY_LABELS[category],
      url: CATEGORY_URLS[category],
    });
  }

  if (product?.plantName) {
    breadcrumbs.push({
      name: product.plantName,
      url: `/product/${variantId}`,
    });
  }

  return breadcrumbs;
};

export const generateProductFAQs = (product, category) => {
  if (!product?.plantName) return [];

  const plantName = product.plantName;
  const scientificName = product.scientificName || '';
  const maintenance = product.miscDetails?.maintenance || 'low';
  const benefits = product.benefits || [];

  const faqs = [];

  faqs.push({
    question: `How to care for ${plantName} plant in India?`,
    answer: `${plantName}${scientificName ? ` (${scientificName})` : ''} is a ${maintenance} maintenance plant. Water when the top inch of soil is dry. Place in bright indirect light and maintain room temperature between 18-30°C. During monsoon, reduce watering. Feed with liquid fertilizer monthly during growing season (March-October).`,
  });

  faqs.push({
    question: `Is ${plantName} good for indoor use in Indian homes?`,
    answer: `Yes, ${plantName} is excellent for Indian homes. It adapts well to Indian climate conditions and can thrive in typical indoor environments. It's perfect for living rooms, bedrooms, and offices with moderate natural light.`,
  });

  faqs.push({
    question: `What is the price of ${plantName} plant online in India?`,
    answer: `${plantName} plant price at MayaVriksh starts from affordable ranges with multiple size options. We offer free delivery across India. Prices vary based on plant size and pot selection. Check the product page for current pricing and available sizes.`,
  });

  if (benefits.length > 0) {
    faqs.push({
      question: `What are the benefits of ${plantName} plant?`,
      answer: `${plantName} offers several benefits: ${benefits.slice(0, 4).join(', ')}. It's a great addition to any home or office space for both aesthetic and health benefits.`,
    });
  }

  if (category === 'INDOOR_PLANTS' || !category) {
    faqs.push({
      question: `Does ${plantName} purify air?`,
      answer: `Yes, ${plantName} is known for its air-purifying properties. Like many indoor plants, it helps filter common household toxins and improves indoor air quality. NASA studies have shown that indoor plants can remove up to 87% of air toxins in 24 hours.`,
    });
  }

  if (maintenance === 'low' || maintenance === 'easy') {
    faqs.push({
      question: `Is ${plantName} suitable for beginners?`,
      answer: `Absolutely! ${plantName} is perfect for beginners due to its ${maintenance} maintenance requirements. It's forgiving of occasional missed watering and doesn't require constant attention. Just provide adequate light and water when soil feels dry.`,
    });
  }

  faqs.push({
    question: `Can I keep ${plantName} in bedroom according to Vastu?`,
    answer: `${plantName} is generally considered auspicious for bedrooms according to Vastu Shastra. Place it in the east or north direction for best results. Indoor plants bring positive energy (Chi) and are believed to promote health and prosperity in Indian homes.`,
  });

  faqs.push({
    question: `How fast does ${plantName} grow?`,
    answer: `${plantName} has a moderate growth rate under proper care. In Indian conditions, expect visible growth during the monsoon and spring seasons (July-October, March-May). Ensure adequate light, proper watering, and monthly fertilization for optimal growth.`,
  });

  return faqs;
};

export const getProductCategory = (productData) => {
  if (!productData) return null;
  
  const tags = productData.tags || {};
  const allTags = [
    ...(tags.bestForEmotion || []),
    ...(tags.bestGiftFor || []),
    ...(tags.plantType || []),
  ];

  for (const tag of allTags) {
    const upperTag = tag?.toUpperCase?.();
    if (CATEGORY_LABELS[upperTag]) {
      return upperTag;
    }
  }

  if (productData.plantCategory) {
    return productData.plantCategory;
  }

  return 'INDOOR_PLANTS';
};

export const generateProductKeywords = (product, category) => {
  if (!product?.plantName) return '';

  const plantName = product.plantName;
  const scientificName = product.scientificName || '';
  const categoryLabel = category ? CATEGORY_LABELS[category] : 'indoor plants';

  const keywords = [
    plantName,
    `buy ${plantName} online`,
    `${plantName} plant India`,
    `${plantName} price`,
    scientificName,
    `${plantName} plant care`,
    `${plantName} for home`,
    categoryLabel,
    'buy plants online India',
    'indoor plants delivery',
    'MayaVriksh plants',
    'plant nursery India',
  ];

  return keywords.filter(Boolean).join(', ');
};