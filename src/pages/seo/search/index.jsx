import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

import {
	Filter,
	ChevronDown,
	SlidersHorizontal,
	Loader2,
	SearchX,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "@mui/material";

// --- IMPORTS ---
import { searchPlants } from "@/api/customer/plant";
import ProductCard from "@/components/ui/cards/ProductCard";

const CATEGORIES = [
	"Indoor",
	"Outdoor",
	"Succulents",
	"Flowering",
	"Low Maintenance",
];
const TRENDING_KEYWORDS = [
	"Areca Palm",
	"Snake Plant",
	"Peace Lily",
	"Office",
	"Gift",
];

function SearchPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// --- 1. GET PARAMS DIRECTLY FROM URL ---
	// const searchTerm = searchParams.get("q") || "";

	const { slug } = useParams();

	const searchTerm = slug ? decodeURIComponent(slug).replace(/-/g, " ") : "";

	const initialCategory = searchParams.get("category") || "All";
	const initialSort = searchParams.get("sortBy") || "relevance";
	const initialMinPrice = Number(searchParams.get("minPrice")) || 0;
	const initialMaxPrice = Number(searchParams.get("maxPrice")) || 5000;
	const initialPage = Number(searchParams.get("page")) || 1;

	// Local state for sidebar filters only
	const [selectedCategory, setSelectedCategory] = useState(initialCategory);
	const [priceRange, setPriceRange] = useState([
		initialMinPrice,
		initialMaxPrice,
	]);
	const [sortBy, setSortBy] = useState(initialSort);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [showFilters, setShowFilters] = useState(false);

	// UPDATED: 20 is divisible by 2, 4, and 5 so rows always look full
	const productsPerPage = 20;

	// --- 2. URL UPDATER HELPER ---
	const updateUrlParams = (newParams) => {
		setSearchParams((prev) => {
			const params = new URLSearchParams(prev);
			Object.entries(newParams).forEach(([key, value]) => {
				if (
					value === undefined ||
					value === null ||
					value === "" ||
					value === "All"
				) {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			});
			return params;
		});
	};

	// --- 3. FILTER HANDLERS ---
	const handleCategoryChange = (val) => {
		setSelectedCategory(val);
		setCurrentPage(1);
		updateUrlParams({ category: val, page: 1 });
	};

	const handleSortChange = (val) => {
		setSortBy(val);
		setCurrentPage(1);
		updateUrlParams({ sortBy: val, page: 1 });
	};

	const handlePriceChange = (event, newValue) => {
		setPriceRange(newValue);
	};

	const handlePriceCommit = () => {
		setCurrentPage(1);
		updateUrlParams({
			minPrice: priceRange[0],
			maxPrice: priceRange[1],
			page: 1,
		});
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
		updateUrlParams({ page: newPage });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// const handleKeywordClick = (keyword) => {
	// 	updateUrlParams({ q: keyword, page: 1 });
	// };

	const handleKeywordClick = (keyword) => {
		navigate(`/plants/${encodeURIComponent(keyword)}?page=1`);
	};

	// const resetFilters = () => {
	// 	setSelectedCategory("All");
	// 	setPriceRange([0, 5000]);
	// 	setSortBy("relevance");
	// 	setCurrentPage(1);
	// 	setSearchParams({});
	// };

	const resetFilters = () => {
		setSelectedCategory("All");
		setPriceRange([0, 5000]);
		setSortBy("relevance");
		setCurrentPage(1);
		navigate("/search");
	};

	// --- 4. API QUERY ---
	const apiOptions = {
		page: currentPage,
		limit: productsPerPage,
		category: selectedCategory !== "All" ? selectedCategory : undefined,
		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		sortBy: sortBy,
	};

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["searchPlants", { search: searchTerm, options: apiOptions }],
		queryFn: () =>
			searchPlants({ search: searchTerm, options: apiOptions }),
		keepPreviousData: true,
		staleTime: 1000 * 60 * 5,
		retry: 1,
	});

	const productsData = Array.isArray(data) ? data : data?.data || [];
	const totalItems = data?.total || productsData.length;
	const totalPages = Math.ceil(totalItems / productsPerPage);

	useEffect(() => {
		setSelectedCategory(initialCategory);
		setPriceRange([initialMinPrice, initialMaxPrice]);
		setSortBy(initialSort);
		setCurrentPage(initialPage);
	}, [
		initialCategory,
		initialSort,
		initialMinPrice,
		initialMaxPrice,
		initialPage,
	]);

	// Card Props Helpers
	const getImagesForCard = (images = []) => {
		if (!images || images.length === 0)
			return ["https://placehold.co/400x600?text=No+Image"];
		return images
			.sort((a, b) => (b.isPrimary ? 1 : -1))
			.map((img) => img.mediaUrl);
	};

	const getProductTags = (attributes = []) => {
		if (!attributes) return [];
		return attributes
			.filter((attr) => attr.type === "feature" || attr.type === "care")
			.slice(0, 2)
			.map((attr) => attr.name.replace("Maintenance: ", ""));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
			<main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{" "}
				{/* Increased max-width for 5 columns */}
				{/* Breadcrumbs */}
				<nav className="mb-6 text-sm text-gray-500 hidden sm:block">
					<span
						onClick={() => navigate("/")}
						className="hover:underline hover:cursor-pointer"
					>
						Home
					</span>{" "}
					&gt;
					<span className="text-gray-900 ml-1">Search Results</span>
				</nav>
				{!searchTerm && (
					<motion.section
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-8"
					>
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Trending Searches
						</h2>
						<div className="flex flex-wrap gap-2">
							{TRENDING_KEYWORDS.map((keyword) => (
								<button
									key={keyword}
									onClick={() => handleKeywordClick(keyword)}
									className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
								>
									{keyword}
								</button>
							))}
						</div>
					</motion.section>
				)}
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Filters Sidebar 
          <div className={`lg:w-64 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-md p-6 border border-green-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="text-green-500" /> Filters
                </h3>
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden text-green-600">
                  <ChevronDown className={showFilters ? 'rotate-180' : ''} />
                </button>
              </div>


              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

          
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2 px-1">
                  <Slider
                    value={priceRange} onChange={handlePriceChange} onChangeCommitted={handlePriceCommit}
                    valueLabelDisplay="auto" min={0} max={5000}
                    sx={{ color: '#22c55e', '& .MuiSlider-thumb': { backgroundColor: '#ffffff', border: '2px solid #22c55e' } }}
                  />
                  <div className="flex justify-between text-xs text-gray-500"><span>₹{priceRange[0]}</span><span>₹{priceRange[1]}</span></div>
                </div>
              </div>

     
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <button onClick={resetFilters} className="w-full py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Clear Filters</button>
            </motion.div>
          </div>
*/}
					{/* Main Content */}
					<div className="flex-1">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
							<div>
								<h2 className="text-2xl font-bold text-gray-900">
									{searchTerm
										? `Results for "${searchTerm}"`
										: "All Plants"}
								</h2>
								<p className="text-gray-600 text-sm">
									{!isLoading &&
										!isError &&
										`${totalItems} plant${
											totalItems !== 1 ? "s" : ""
										} found`}
								</p>
							</div>
							{/* <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Filter /> Filters</button> */}
						</div>

						{isLoading ? (
							<div className="flex flex-col items-center justify-center h-64">
								<Loader2 className="h-10 w-10 text-green-500 animate-spin mb-2" />
								<p className="text-gray-500">Searching...</p>
							</div>
						) : isError ? (
							<div className="text-center py-16 text-red-500 bg-red-50 rounded-xl border border-red-100">
								<p className="font-semibold">
									Oops! Something went wrong.
								</p>
								<p className="text-sm mt-1">
									{error?.message ||
										"Please try refreshing the page."}
								</p>
							</div>
						) : productsData.length === 0 ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 text-center px-4"
							>
								<div className="bg-gray-100 p-4 rounded-full mb-4">
									<SearchX className="h-8 w-8 text-gray-400" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									No plants found for "{searchTerm}"
								</h3>
								<button
									onClick={resetFilters}
									className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
								>
									View All Plants
								</button>
							</motion.div>
						) : (
							// --- UPDATED GRID LAYOUT ---
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 mb-8"
							>
								{productsData.map((product) => (
									<ProductCard
										key={product.variantId}
										id={product.variantId}
										title={product.name}
										price={{
											selling: product.sellingPrice,
											original: product.mrp,
											discount:
												product.discountPercent > 0
													? `${Math.round(
															product.discountPercent,
													  )}% OFF`
													: null,
										}}
										images={getImagesForCard(
											product.images,
										)}
										tags={getProductTags(
											product.systemAttributes,
										)}
										colors={
											product.color
												? [product.color.name]
												: []
										}
										hexColors={
											product.color
												? [product.color.hexCode]
												: []
										}
										rating={product.rating}
										reviews={product.totalRatings}
										onAddToCart={() =>
											console.log(
												"Add to cart",
												product.variantId,
											)
										}
									/>
								))}
							</motion.div>
						)}

						{/* Pagination */}
						{totalPages > 1 &&
							!isLoading &&
							!isError &&
							productsData.length > 0 && (
								<div className="flex flex-wrap justify-center gap-2 mt-8">
									<button
										onClick={() =>
											handlePageChange(
												Math.max(currentPage - 1, 1),
											)
										}
										disabled={currentPage === 1}
										className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-green-200 rounded-md hover:bg-green-50 disabled:opacity-50"
									>
										Previous
									</button>
									<span className="flex items-center px-4 text-sm font-medium text-gray-700">
										Page {currentPage} of {totalPages}
									</span>
									<button
										onClick={() =>
											handlePageChange(
												Math.min(
													currentPage + 1,
													totalPages,
												),
											)
										}
										disabled={currentPage === totalPages}
										className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-green-200 rounded-md hover:bg-green-50 disabled:opacity-50"
									>
										Next
									</button>
								</div>
							)}
					</div>
				</div>
			</main>
		</div>
	);
}

export default SearchPage;
