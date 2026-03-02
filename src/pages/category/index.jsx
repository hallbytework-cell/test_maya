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
import { generateCategoryMetaDescription, generateMetaTitle, getCanonicalUrl } from "@/utils/seoUtils";
import { getCurrentFestival, INDIA_META_KEYWORDS } from "@/constants/festivals.constants";
import logger from "@/lib/logger";
import { getSortParams, mapCategoryDBToUI, mapCategoryUIToDB } from "@/utils/utils";
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
  if (!slug || slug === 'plants') return "";
  return slug.toUpperCase().replace(/-/g, '_');
};

const getSlugFromCategory = (catId) => {
  return catId.toLowerCase().replace(/_/g, '-');
};

const selectCategories = (data) => {
  return data.map((cat) => ({
    id: mapCategoryDBToUI(cat.value),
    label: cat.label,
    img: cat.mediaUrl,
  }));
};

export default function CategoryPage() {
  const { category } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setNavbarStatus, currentSort, setCurrentSort } = useOutletContext();
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
    logger.info('Category page viewed', { category });
    logger.track('page_view', { page: 'category', category });
  }, [category]);

  const {
    data: subcategories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories()

  const handleApplyFilters = useCallback((filters) => {
    logger.debug('Filters applied', {
      priceRange: filters.priceRange,
      sizes: filters.selectedSizes?.length,
      colors: filters.selectedColors?.length
    });
    logger.track('filter_applied', { category, filters });
    setAppliedFilters(filters);
  }, [category]);

  useEffect(() => {
    return () => {
      if (category) {
        setAppliedFilters(DEFAULT_FILTERS);
      }
    };
  }, [category]);

  // --- URL PARSING LOGIC ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentTagSlug = params.get("tag");

    if (currentTagSlug && TAG_URL_MAPPING[currentTagSlug]) {
      const mappedTagValue = TAG_URL_MAPPING[currentTagSlug];
      setAppliedFilters((prev) => ({
        ...prev,
        selectedTagTypes: [mappedTagValue],
      }));
      setAccordion((prev) => ({ ...prev, tag: true }));
    }
  }, [location.search, subcategories]);

  const handleSubcategorySelect = useCallback((subId) => {
    if (!subId) {
      navigate("/category/plants")
      return;
    }
    const categoryDetails = subcategories.filter((category) => category.categoryId == subId)[0];
    const nextSlug = getSlugFromCategory(categoryDetails.value);
    setAppliedFilters(DEFAULT_FILTERS);
    navigate(`/category/${nextSlug}`);
  }, [navigate]);

  const getQuery = (queryArgs) => {
    return Object.entries(queryArgs)
      .flatMap(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return value.map(
            (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`,
          );
        } else if (
          !Array.isArray(value) &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        return [];
      })
      .join("&");
  };

  const baseQueryArgs = useMemo(() => {
    return {
      plantCategory: mapCategoryUIToDB(selectedSubcategoryId || undefined),
      limit: LIMIT,
      minPrice: appliedFilters?.priceRange[0],
      maxPrice: appliedFilters?.priceRange[1],
      size: appliedFilters?.selectedSizes,
      color: appliedFilters?.selectedColors,
      tagNames: appliedFilters?.selectedTagTypes,
      ...sortParams,
    };
  }, [category, selectedSubcategoryId, appliedFilters, sortParams]);

  const {
    data: plantDataPages,
    isLoading: isPlantLoading,
    isFetching: isFiltering,
    isFetchingNextPage,
    error: plantError,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["plants", baseQueryArgs],
    queryFn: ({ pageParam = 1 }) => {
      const query = getQuery({
        ...baseQueryArgs,
        page: pageParam,
      });
      return getAllPlantVariants(query);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const total = lastPage?.data?.total || 0;
      const totalPages = Math.ceil(total / LIMIT);

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    gcTime: 0
  });

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const extractCampaignTags = (data = []) => {
    const allTags = [];
    if (Array.isArray(data) && data.length > 0) {
      for (const group of data) {
        if (group.tags && Array.isArray(group.tags)) {
          if (group?.groupLabel === "Campaign Tags") {
            allTags.push(...group.tags);
          }
        }
      }
    }
    return allTags;
  };

  const formatTags = (data = []) => {
    return data.map((item) => ({
      ...item,
      value: item.value,
    }));
  };

  function formatAvailableFilters(data) {
    data["tags"] = formatTags(extractCampaignTags(data.tags));
    return data;
  }

  useEffect(() => {
    const firstPage = plantDataPages?.pages?.[0];
    if (firstPage?.data?.availableFilters) {
      const formattedAvailableFilters = formatAvailableFilters(
        firstPage.data.availableFilters,
      );
      setAvailableFilters(formattedAvailableFilters);
    }
  }, [plantDataPages, isPlantLoading, isFiltering]);

<<<<<<< HEAD
  const handleClearFilter = () => {
    setAppliedFilters(DEFAULT_FILTERS);
    navigate({ search: "" }, { replace: true });
  };
=======
  // Memoized handleClearFilter with useCallback
  const handleClearFilter = useCallback(() => {
    setAppliedFilters(DEFAULT_FILTERS);
    navigate({ search: "" }, { replace: true });
  }, [navigate]);
>>>>>>> 048fdb4 (Initial commit from dev-akash)

  const allPlantVariants = useMemo(() => {
    return plantDataPages?.pages
      ? plantDataPages.pages.flatMap((page) => page.data.plantVariants)
      : [];
  }, [plantDataPages]);

  const totalProducts = plantDataPages?.pages?.[0]?.data?.total || 0;

  const shouldShowInitialLoading = isPlantLoading || (isFiltering && !isFetchingNextPage);
  const shouldShowNextPageLoading = isFetchingNextPage;

  useEffect(() => {
    if (setNavbarStatus) {
      const hasProducts = allPlantVariants.length > 0;
      setNavbarStatus(shouldShowInitialLoading, hasProducts);
    }

    return () => {
      if (setNavbarStatus) {
        setNavbarStatus(false, true);
      }
    };
  }, [shouldShowInitialLoading, allPlantVariants.length, setNavbarStatus]);

  const pageTitle = category.charAt(0).toUpperCase() + category.slice(1);
  const currentFestival = getCurrentFestival();
  const seoTitle = currentFestival
    ? `${currentFestival.name} ${pageTitle} Plants - Buy Online India | MayaVriksh`
    : generateMetaTitle(pageTitle + ' Plants', 'Buy Online India', 'MayaVriksh');
  const seoDescription = currentFestival
    ? `${currentFestival.description} Browse ${pageTitle.toLowerCase()} plants at MayaVriksh.`
    : generateCategoryMetaDescription(pageTitle, totalProducts);
  const seoKeywords = `${pageTitle.toLowerCase()} plants India, buy ${pageTitle.toLowerCase()} plants online, ${INDIA_META_KEYWORDS.GENERAL}`;

  const breadcrumbItems = [
    { name: 'Plants', url: '/plants' },
    { name: pageTitle, url: `/category/${category}` },
  ];

  useEffect(() => {
    if (allPlantVariants.length > 0) {
      trackProductListView(allPlantVariants.slice(0, 10), pageTitle);
    }
  }, [allPlantVariants, pageTitle]);

  if (categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 p-4">
        Error loading categories: {categoriesError.message}
      </div>
    );
  }

  const ShimmerProductGrid = ({ count = 8 }) => {
    const cardPlaceholders = Array.from({ length: count }, (_, index) => (
      <ShimmerProductCard key={index} />
    ));
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center md:pt-14">
        {cardPlaceholders}
      </div>
    );
  };

  return (
    <div className="md:h-[85vh] bg-gray-50 md:overflow-hidden flex flex-col">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={getCanonicalUrl(`/category/${category}`)}
        ogUrl={`https://mayavriksh.in/category/${category}`}
        type="website"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      {allPlantVariants.length > 0 && (
        <ItemListSchema
          items={allPlantVariants.slice(0, 10).map(p => ({
            name: p.plantName || p.name,
            image: p.primaryImage || p.image,
            slug: p.slug || p.id,
            price: p.sellingPrice || p.price,
          }))}
          listName={`${pageTitle} Plants`}
        />
      )}

      <div className="px-4 sm:px-6 lg:px-2 py-2 flex-1 flex flex-col overflow-hidden">
        <div
          className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden ${isFilterSidebarOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setIsFilterSidebarOpen(false)}
          aria-hidden="true"
        />
        <div className="flex flex-col md:flex-row gap-6 relative flex-1 md:overflow-hidden">
          <aside
            className={`fixed md:sticky top-0 left-0 h-full lg:w-1/5 bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out md:w-1/4 md:translate-x-0 flex-shrink-0 ${isFilterSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            role="dialog"
            aria-modal="true"
          >
            <div className="h-full max-w-[90vw] w-[90vw] md:w-full overflow-y-scroll ">
              <FilterSidebar
                onClose={() => setIsFilterSidebarOpen(false)}
                availableFilters={availableFilters}
                appliedFilter={appliedFilters}
                onApplyFilters={handleApplyFilters}
                initialFilters={appliedFilters}
                accordion={accordion}
                setAccordion={setAccordion}
                isLoading={shouldShowInitialLoading}
                currentSort={currentSort}
                setCurrentSort={setCurrentSort}
              />
            </div>
          </aside>

          <main className="flex-1 lg:w-3/4 overflow-y-auto ">
            {isCategoriesLoading ? (
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                Loading categories...
              </div>
            ) : (
              <SubcategoryGrid
                list={subcategories}
                selectedId={selectedSubcategoryId}
                onSelect={handleSubcategorySelect}
                allLabel={`All Plants`}
              />
            )}

            <div className="mt-2">
              {plantError && !shouldShowInitialLoading ? (
                <div className="text-red-600 text-center py-4">
                  Failed to load plants:{" "}
                  {plantError?.message || "An unknown error occurred."}
                  <button
                    onClick={() => refetch()}
                    className="ml-2 text-blue-600 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : shouldShowInitialLoading ? (
                <ShimmerProductGrid count={LIMIT} />
              ) : allPlantVariants.length > 0 ? (
                <>
                  <ProductGrid products={allPlantVariants} />

                  {!shouldShowNextPageLoading && hasNextPage && (
                    <div ref={loadMoreRef} className="h-10 w-full" />
                  )}

                  {shouldShowNextPageLoading && (
                    <div className="mt-6">
                      <ShimmerProductGrid count={4} />
                    </div>
                  )}

                  {!hasNextPage &&
                    allPlantVariants.length === totalProducts &&
                    totalProducts > 0 && (
                      <div className="text-center py-4 text-gray-500 font-medium">
                        You've reached the end of the product list.
                      </div>
                    )}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters to find what you're looking for.{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={handleClearFilter}
                    >
                      Clear Filters
                    </span>
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

CategoryPage.propTypes = {
  category: PropTypes.string,
};