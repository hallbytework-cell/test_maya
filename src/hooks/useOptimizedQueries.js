import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, getCacheConfig, invalidationPatterns } from "@/utils/queryKeys";
import {
  getPlantCategories,
  getAllPlantVariants,
  getPlantByVariantId,
  getPlantsByTag,
  searchPlants,
  getActivePlantReels,
  getPlantCareBySize,
} from "@/api/customer/plant";
import { getCartItems, addCartItems, updateCartItem, deleteCartItem } from "@/api/customer/cart";
import { getCustomerAddresses, addCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from "@/api/customer/address";
import { getCustomerOrders, createCustomerOrder, getCustomerOrderById } from "@/api/customer/orders";


/**
 * ✅ Categories - Cached for 30 mins (rarely changes)
 * Automatically deduplicates multiple calls
 */
export const useCategories = (options = {}) => {
  const cacheConfig = getCacheConfig("categories");
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: getPlantCategories,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Plant Variants with Filters - Cached per filter combo
 * Prevents re-fetching when switching between filter combinations
 */
export const usePlantVariants = (queryString, options = {}) => {
  const cacheConfig = getCacheConfig("plants");
  return useQuery({
    queryKey: queryKeys.plantVariants(queryString),
    queryFn: () => getAllPlantVariants(queryString),
    enabled: !!queryString,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Plant by Variant ID - Smart caching per product
 * Once loaded, stays in cache for quick navigation
 */
export const usePlantByVariantId = (id, options = {}) => {
  const cacheConfig = getCacheConfig("plants");
  return useQuery({
    queryKey: queryKeys.plantByVariantId(id),
    queryFn: () => getPlantByVariantId(id),
    enabled: !!id,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Plants by Tag - Cached per tag combination
 * Automatically deduplicates "BEST_SELLER", "NEW_LAUNCH", "FEATURED" calls
 * Key optimization: Multiple components requesting same tag get cached result
 */
export const usePlantsByTag = (tag, limit = 8, options = {}) => {
  const cacheConfig = getCacheConfig("plants");
  return useQuery({
    queryKey: queryKeys.plantsByTag(tag, limit),
    queryFn: () => getPlantsByTag(tag, limit),
    enabled: !!tag,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Search Plants - Cached per search term
 * Debounced search prevents multiple API calls for the same query
 */
export const useSearchPlants = (searchTerm, options = {}, searchOptions = {}) => {
  const cacheConfig = getCacheConfig("search");
  return useQuery({
    queryKey: queryKeys.searchPlants(searchTerm, searchOptions),
    queryFn: () => searchPlants({ search: searchTerm, options: searchOptions }),
    enabled: !!searchTerm && searchTerm.length >= 2,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Plant Reels - Cached for video content (rarely changes)
 */
export const usePlantReels = (options = {}) => {
  const cacheConfig = getCacheConfig("plants");
  return useQuery({
    queryKey: queryKeys.plantReels(),
    queryFn: getActivePlantReels,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Plant Care Guide - Cached per plant + size
 * Reduces calls when users switch between sizes
 */
export const usePlantCareGuide = (plantId, size, options = {}) => {
  const cacheConfig = getCacheConfig("plants");
  return useQuery({
    queryKey: queryKeys.plantCareGuide(plantId, size),
    queryFn: () => getPlantCareBySize(plantId, size),
    enabled: !!plantId && !!size,
    ...cacheConfig,
    ...options,
  });
};

// ============================================
// CART QUERIES
// ============================================

/**
 * ✅ Cart Items - Highly optimized
 * Only fetches when needed, invalidates on changes
 * Stale time 30s to ensure fresh cart state without constant polling
 */
export const useCartItems = (enabled = true, options = {}) => {
  const cacheConfig = getCacheConfig("cart");
  return useQuery({
    queryKey: queryKeys.cartItems(),
    queryFn: getCartItems,
    enabled,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Add to Cart Mutation - Smart cache invalidation
 */
export const useAddToCart = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCartItems,
    onSuccess: (data, variables, context) => {
      // Only invalidate cart, don't touch products
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems() });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

/**
 * ✅ Update Cart Item - Efficient single-item update
 */
export const useUpdateCartItem = (itemId, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateCartItem(itemId, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems() });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

/**
 * ✅ Delete Cart Item
 */
export const useDeleteCartItem = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems() });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

// ============================================
// ADDRESS QUERIES
// ============================================

/**
 * ✅ Customer Addresses - Cached for 10 mins
 */
export const useCustomerAddresses = (enabled = true, options = {}) => {
  const cacheConfig = getCacheConfig("addresses");
  return useQuery({
    queryKey: queryKeys.addressesList(),
    queryFn: getCustomerAddresses,
    enabled,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Add Address Mutation
 */
export const useAddAddress = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCustomerAddress,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses() });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

/**
 * ✅ Update Address Mutation
 */
export const useUpdateAddress = (addressId, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateCustomerAddress(addressId, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses() });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

/**
 * ✅ Delete Address Mutation
 */
export const useDeleteAddress = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomerAddress,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses() });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};

// ============================================
// ORDERS QUERIES
// ============================================

/**
 * ✅ Customer Orders - Cached per page
 */
export const useCustomerOrders = (page = 1, limit = 10, enabled = true, options = {}) => {
  const cacheConfig = getCacheConfig("orders");
  return useQuery({
    queryKey: queryKeys.ordersList(page, limit),
    queryFn: () => getCustomerOrders(page, limit),
    enabled,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Order by ID - Cached per order
 */
export const useOrderById = (orderId, enabled = true, options = {}) => {
  const cacheConfig = getCacheConfig("orders");
  return useQuery({
    queryKey: queryKeys.orderById(orderId),
    queryFn: () => getCustomerOrderById(orderId),
    enabled: !!orderId && enabled,
    ...cacheConfig,
    ...options,
  });
};

/**
 * ✅ Create Order Mutation - Comprehensive cache invalidation
 */
export const useCreateOrder = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomerOrder,
    onSuccess: (data, variables, context) => {
      // Invalidate orders, cart, and addresses after purchase
      invalidationPatterns.invalidateAfterPurchase(queryClient);
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
  });
};
