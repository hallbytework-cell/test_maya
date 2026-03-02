import {
  getPlantByVariantId,
  getPlantsByTag,
  getPlantCategories,
  getAllPlantVariants,
  getActivePlantReels,
} from "@/api/customer/plant";
import { queryClient } from "@/lib/queryClient";

// ============================================================================
// HOME PAGE LOADER
// ============================================================================
// React Router v7: Return promises directly (no defer wrapper needed)
export async function homeLoader() {
  try {
    const categories = await getPlantCategories().catch((error) => {
      console.error("Failed to load categories:", error);
      return [];
    });

    // ✅ PHASE 2: Use queryClient.prefetchQuery to populate cache instead of direct API calls
    // This prevents duplicate calls when components useQuery with same queryKey
    const prefetchPromises = [
      queryClient.prefetchQuery({
        queryKey: ["plants", "byTag", "BEST_SELLER", 4],
        queryFn: () => getPlantsByTag("BEST_SELLER", 4),
        staleTime: 1000 * 60 * 30,
      }),
      queryClient.prefetchQuery({
        queryKey: ["plants", "byTag", "NEW_LAUNCH", 4],
        queryFn: () => getPlantsByTag("NEW_LAUNCH", 4),
        staleTime: 1000 * 60 * 30,
      }),
      queryClient.prefetchQuery({
        queryKey: ["plants", "byTag", "FEATURED", 4],
        queryFn: () => getPlantsByTag("FEATURED", 4),
        staleTime: 1000 * 60 * 30,
      }),
    ];

    await Promise.allSettled(prefetchPromises);

    return {
      // Categories loaded immediately (awaited) - no duplicate fetching
      categories,
      // Data is now in React Query cache, components will use it instantly
    };
  } catch (error) {
    console.error("Home loader error:", error);
    throw new Response("Failed to load home page data", { status: 500 });
  }
}

// ============================================================================
// CATEGORY PAGE LOADER
// ============================================================================
export function categoryLoader({ params }) {
  const { categoryId } = params;

  if (!categoryId) {
    throw new Response("Category ID is required", { status: 400 });
  }

  // Component handles all data fetching with React Query caching
  // No need to fetch here as it duplicates component requests
  return {};
}

// ============================================================================
// SEARCH PAGE LOADER
// ============================================================================
export function searchLoader() {
  try {
    // ✅ PHASE 2: Prefetch trending products to cache
    queryClient.prefetchQuery({
      queryKey: ["plants", "byTag", "BEST_SELLER", 8],
      queryFn: () => getPlantsByTag("BEST_SELLER", 8),
      staleTime: 1000 * 60 * 30,
    }).catch(() => null);

    return {};
  } catch (error) {
    console.error("Search loader error:", error);
    throw new Response("Failed to load search page", { status: 500 });
  }
}

// ============================================================================
// PRODUCT DETAILS LOADER
// ============================================================================
export function productLoader({ params }) {
  const { productId } = params;

  if (!productId) {
    throw new Response("Product ID is required", { status: 400 });
  }

  try {
    // ✅ PHASE 1 & 2: Prefetch product details and similar products
    const prefetchPromises = [
      queryClient.prefetchQuery({
        queryKey: ["plant", "details", productId],
        queryFn: () => getPlantByVariantId(productId),
        staleTime: 1000 * 60 * 30,
      }),
      queryClient.prefetchQuery({
        queryKey: ["plants", "byTag", "BEST_SELLER", 4],
        queryFn: () => getPlantsByTag("BEST_SELLER", 4),
        staleTime: 1000 * 60 * 30,
      }),
    ];

    Promise.allSettled(prefetchPromises).catch(() => null);

    return {};
  } catch (error) {
    console.error("Product loader error:", error);
    throw new Response("Failed to load product", { status: 500 });
  }
}
