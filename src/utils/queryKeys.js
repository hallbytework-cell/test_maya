/**
 * Centralized Query Key Factory - Ensures consistency and prevents duplicates
 * Using hierarchical structure for better cache management and invalidation
 */

export const queryKeys = {
  // Categories
  categories: () => ['categories'],
  categoriesList: () => ['categories', 'list'],

  // Plants/Products
  plants: () => ['plants'],
  plantsList: (filters) => ['plants', 'list', filters],
  plantById: (id) => ['plants', 'byId', id],
  plantByVariantId: (id) => ['plants', 'byVariantId', id],
  plantsByTag: (tag, limit = 8) => ['plants', 'byTag', tag, limit],
  plantVariants: (query) => ['plants', 'variants', query],
  searchPlants: (searchTerm, options) => ['plants', 'search', searchTerm, options],
  plantCareGuide: (plantId, size) => ['plants', 'care', plantId, size],
  plantReels: () => ['plants', 'reels'],
  bestSellerProducts: () => ['plants', 'tag', 'BEST_SELLER'],
  newLaunchProducts: () => ['plants', 'tag', 'NEW_LAUNCH'],
  featuredProducts: () => ['plants', 'tag', 'FEATURED'],

  // Cart
  cart: () => ['cart'],
  cartItems: () => ['cart', 'items'],
  cartItem: (itemId) => ['cart', 'item', itemId],

  // Addresses
  addresses: () => ['addresses'],
  addressesList: () => ['addresses', 'list'],
  addressById: (id) => ['addresses', 'byId', id],

  // Orders
  orders: () => ['orders'],
  ordersList: (page, limit) => ['orders', 'list', page, limit],
  orderById: (id) => ['orders', 'byId', id],

  // User/Auth
  user: () => ['user'],
  userProfile: () => ['user', 'profile'],
  authStatus: () => ['auth', 'status'],

  // Search
  search: (term) => ['search', term],
};

/**
 * ✅ Cache Configuration Factory - Returns optimal stale/gc times per endpoint
 */
export const getCacheConfig = (endpoint) => {
  const configs = {
    // Rarely changes - 30 mins stale, 1 hour GC
    categories: { staleTime: 1000 * 60 * 30, gcTime: 1000 * 60 * 60 },
    
    // Products - medium frequency - 2 mins stale, 10 mins GC
    plants: { staleTime: 1000 * 60 * 2, gcTime: 1000 * 60 * 10 },
    
    // Cart - high frequency - 30 secs stale, 5 mins GC
    cart: { staleTime: 1000 * 30, gcTime: 1000 * 60 * 5 },
    
    // User profile - medium frequency - 5 mins stale, 15 mins GC
    user: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 15 },
    
    // Addresses - medium frequency - 10 mins stale, 30 mins GC
    addresses: { staleTime: 1000 * 60 * 10, gcTime: 1000 * 60 * 30 },
    
    // Orders - medium frequency - 5 mins stale, 30 mins GC
    orders: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 30 },
    
    // Search - high frequency - 30 secs stale, 5 mins GC
    search: { staleTime: 1000 * 30, gcTime: 1000 * 60 * 5 },
    
    // Default
    default: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 30 },
  };

  return configs[endpoint] || configs.default;
};

/**
 * ✅ Query Key Invalidation Helpers
 */
export const invalidationPatterns = {
  // Invalidate all product-related queries when user adds to cart
  invalidateProductsOnCartChange: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['plants'], exact: false });
  },

  // Invalidate cart when product changes
  invalidateCartOnProductChange: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  },

  // Invalidate orders and cart after successful purchase
  invalidateAfterPurchase: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['addresses'] });
  },

  // Invalidate user profile after updates
  invalidateUserProfile: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  },

  // Invalidate addresses when user updates
  invalidateAddresses: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['addresses'] });
  },
};
