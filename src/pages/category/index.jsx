import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPlantVariants } from "@/api/customer/plant";
import SubcategoryGrid from "@/components/SubcategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import ShimmerProductCard from "@/components/ShimmerProductCard";
import PropTypes from "prop-types";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbSchema, ItemListSchema } from "@/components/JsonLdSchemas";
import { trackProductListView } from "@/lib/seoAnalytics";
import {
  generateCategoryMetaDescription,
  generateMetaTitle,
  getCanonicalUrl,
} from "@/utils/seoUtils";
import {
  getCurrentFestival,
  INDIA_META_KEYWORDS,
} from "@/constants/festivals.constants";
import logger from "@/lib/logger";
import {
  getSortParams,
  mapCategoryDBToUI,
  mapCategoryUIToDB,
} from "@/utils/utils";
import { useCategories } from "@/hooks/useOptimizedQueries";

const DEFAULT_FILTERS = {
  priceRange: [0, 5000],
  selectedSizes: [],
  selectedColors: [],
  selectedTagTypes: [],
};

const LIMIT = 20;

const TAG_URL_MAPPING = {
  BEST_SELLER: "Best Seller",
  TRENDING: "Trending",
  NEW_LAUNCH: "New Launch",
};

const getCategoryFromSlug = (slug) => {
  if (!slug || slug === "plants") return "";
  return slug.toUpperCase().replace(/-/g, "_");
};

const getSlugFromCategory = (catId) => {
  return catId.toLowerCase().replace(/_/g, "-");
};

export default function CategoryPage() {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    setNavbarStatus,
    currentSort,
    setCurrentSort,
  } = useOutletContext();

  const loadMoreRef = useRef(null);

  const [availableFilters, setAvailableFilters] = useState(DEFAULT_FILTERS);
  const [accordion, setAccordion] = useState({
    price: true,
    size: false,
    color: false,
    tag: false,
  });
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const selectedSubcategoryId = getCategoryFromSlug(category);
  const sortParams = getSortParams(currentSort);

  useEffect(() => {
    logger.info("Category page viewed", { category });
    logger.track("page_view", { page: "category", category });
  }, [category]);

  const {
    data: subcategories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories();

  const handleApplyFilters = useCallback(
    (filters) => {
      logger.track("filter_applied", { category, filters });
      setAppliedFilters(filters);
    },
    [category]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentTagSlug = params.get("tag");

    if (currentTagSlug && TAG_URL_MAPPING[currentTagSlug]) {
      setAppliedFilters((prev) => ({
        ...prev,
        selectedTagTypes: [TAG_URL_MAPPING[currentTagSlug]],
      }));
      setAccordion((prev) => ({ ...prev, tag: true }));
    }
  }, [location.search]);

  const handleSubcategorySelect = useCallback(
    (subId) => {
      if (!subId) {
        navigate("/category/plants");
        return;
      }
      const categoryDetails = subcategories.find(
        (c) => c.categoryId === subId
      );
      navigate(`/category/${getSlugFromCategory(categoryDetails.value)}`);
      setAppliedFilters(DEFAULT_FILTERS);
    },
    [navigate, subcategories]
  );

  const baseQueryArgs = useMemo(
    () => ({
      plantCategory: mapCategoryUIToDB(selectedSubcategoryId || undefined),
      limit: LIMIT,
      minPrice: appliedFilters.priceRange[0],
      maxPrice: appliedFilters.priceRange[1],
      size: appliedFilters.selectedSizes,
      color: appliedFilters.selectedColors,
      tagNames: appliedFilters.selectedTagTypes,
      ...sortParams,
    }),
    [selectedSubcategoryId, appliedFilters, sortParams]
  );

  const {
    data: plantDataPages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["plants", baseQueryArgs],
    queryFn: ({ pageParam = 1 }) =>
      getAllPlantVariants({ ...baseQueryArgs, page: pageParam }),
    getNextPageParam: (lastPage, pages) =>
      pages.length * LIMIT < lastPage.data.total
        ? pages.length + 1
        : undefined,
  });

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && fetchNextPage(),
      { rootMargin: "300px" }
    );
    loadMoreRef.current && observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClearFilter = useCallback(() => {
    setAppliedFilters(DEFAULT_FILTERS);
    navigate({ search: "" }, { replace: true });
  }, [navigate]);

  const allPlantVariants = useMemo(
    () =>
      plantDataPages?.pages?.flatMap(
        (page) => page.data.plantVariants
      ) || [],
    [plantDataPages]
  );

  if (categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading categories
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOHead
        title={generateMetaTitle(category)}
        description={generateCategoryMetaDescription(category)}
        canonicalUrl={getCanonicalUrl(`/category/${category}`)}
      />

      {allPlantVariants.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <p>No products found.</p>
          <span
            className="underline cursor-pointer text-blue-600"
            onClick={handleClearFilter}
          >
            Clear Filters
          </span>
        </div>
      ) : (
        <>
          <ProductGrid products={allPlantVariants} />
          {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
          {isFetchingNextPage && <ShimmerProductCard />}
        </>
      )}
    </div>
  );
}

CategoryPage.propTypes = {
  category: PropTypes.string,
};
