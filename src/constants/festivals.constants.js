export const INDIAN_FESTIVALS = {
  DIWALI: {
    name: 'Diwali',
    months: [10, 11], // October - November
    title: 'Buy Diwali Gifting Plants Online in India - Fresh & Vastu-Friendly',
    description: 'Diwali gifting plants online in India. Air-purifying, Vastu-friendly, lucky plants. Free delivery across India. Perfect Diwali gifts.',
    keywords: 'Diwali plants, Diwali gifting plants, lucky plants India, Vastu plants Diwali, air purifying plants Diwali gift',
  },
  RAKHI: {
    name: 'Rakhi',
    months: [7, 8], // July - August
    title: 'Rakhi Gift Ideas - Green Plants for Brother & Sister Online',
    description: 'Unique Rakhi gifting plants for brother and sister. Fresh indoor plants with free delivery. Express your love with green gifts.',
    keywords: 'Rakhi gifts plants, plants for brother, Rakhi gifting ideas India, green Rakhi gifts',
  },
  HOLI: {
    name: 'Holi',
    months: [2, 3], // February - March
    title: 'Holi Gifting Plants - Colorful Indoor Plants Online India',
    description: 'Celebrate Holi with colorful gifting plants. Fresh air-purifying plants for home. Free delivery across India.',
    keywords: 'Holi plants, Holi gifting ideas, colorful indoor plants, Holi gift plants India',
  },
  VALENTINES: {
    name: 'Valentine\'s Day',
    months: [1, 2], // January - February
    title: 'Valentine\'s Day Gifting Plants - Express Love with Green Gifts',
    description: 'Romantic Valentine\'s Day plants online. Fresh indoor plants delivered across India. Perfect love gift for your special one.',
    keywords: 'Valentine\'s Day plants, romantic plants gift, Valentine plants India, love plants',
  },
  GANESH_CHATURTHI: {
    name: 'Ganesh Chaturthi',
    months: [8, 9], // August - September
    title: 'Ganesh Chaturthi Plants - Vastu-Friendly & Lucky Plants Online',
    description: 'Ganesh Chaturthi special plants. Vastu-friendly lucky plants for prosperity. Fresh indoor plants delivery India.',
    keywords: 'Ganesh Chaturthi plants, lucky plants, Vastu plants, Ganesh plants India',
  },
  NEW_YEAR: {
    name: 'New Year',
    months: [12, 1], // December - January
    title: 'New Year Plants - Fresh Indoor Plants for 2025 India',
    description: 'Start 2025 with fresh indoor plants. Air-purifying, low-maintenance plants. Free delivery across India.',
    keywords: 'New Year plants, 2025 plants, indoor plants India, air purifying plants',
  },
  HOUSEWARMING: {
    name: 'Housewarming',
    months: [3, 4, 5, 6, 7, 8, 9, 10], // Peak season
    title: 'Housewarming Gifting Plants - Fresh Indoor Plants Online India',
    description: 'Perfect housewarming gifts. Fresh plants for new homes. Vastu-friendly, air-purifying plants. Delivery across India.',
    keywords: 'housewarming plants, plants for new home, housewarming gifts India',
  },
  WEDDINGS: {
    name: 'Weddings / Shaadi',
    months: [10, 11, 12, 1, 2, 3], // Wedding season
    title: 'Wedding & Shaadi Gifting Plants - Fresh Plants Online India',
    description: 'Unique wedding and Shaadi gifting plants. Fresh indoor plants for couples. Express blessings with green gifts.',
    keywords: 'wedding plants, Shaadi gifts plants, wedding gifting ideas, plants for couple',
  },
};

/**
 * Get current festival based on current date
 * Returns festival object or null
 */
export const getCurrentFestival = () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-11

  for (const [key, festival] of Object.entries(INDIAN_FESTIVALS)) {
    if (festival.months.includes(currentMonth)) {
      return festival;
    }
  }

  return null;
};

/**
 * Get all active festivals (multiple festivals might be active in a month)
 */
export const getActiveFestivals = () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  return Object.entries(INDIAN_FESTIVALS)
    .filter(([, festival]) => festival.months.includes(currentMonth))
    .map(([key, festival]) => festival);
};

/**
 * Get festival by specific month (1-12)
 */
export const getFestivalByMonth = (month) => {
  for (const [key, festival] of Object.entries(INDIAN_FESTIVALS)) {
    if (festival.months.includes(month)) {
      return festival;
    }
  }
  return null;
};

/**
 * India-specific meta keywords that work across all pages
 */
export const INDIA_META_KEYWORDS = {
  GENERAL: 'indoor plants India, buy plants online, plants delivery India, air purifying plants, low maintenance plants',
  GIFTING: 'plants gift India, gifting plants online, unique gifts, plant gifts for occasions',
  VASTU: 'Vastu plants, lucky plants, prosperity plants, Vastu for home',
  ECO_FRIENDLY: 'eco-friendly plants, organic plants, sustainable gifting, green living India',
  DELIVERY: 'free plant delivery India, plants delivery across India, express plant delivery',
  HEALTH: 'air purifying plants India, oxygen plants, health benefits plants',
};

/**
 * India-specific descriptions for common pages
 */
export const INDIA_META_DESCRIPTIONS = {
  HOME: 'Buy fresh indoor plants online in India. Vastu-friendly, air-purifying plants with free delivery. Perfect plants for homes, offices & gifting.',
  PLANTS: 'Explore our collection of indoor plants in India. Low-maintenance, air-purifying, Vastu-friendly plants. Shop now with free delivery.',
  GIFTING: 'Unique plant gifting ideas for Indian occasions. Diwali, Rakhi, Holi, weddings & more. Fresh plants delivered across India.',
  BLOG: 'Plant care guides and tips for Indian homes. Learn about Vastu plants, air-purifying plants, and plant care in India.',
};

/**
 * Currency & Date formatting for India
 */
export const INDIA_FORMATS = {
  currency: (price) => `₹${price.toLocaleString('en-IN')}`,
  phone: (num) => `+91-${num}`,
  date: (date) => new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
  dateShort: (date) => new Date(date).toLocaleDateString('en-IN'),
};
