import { FiSearch } from "react-icons/fi";
import { useState, useEffect, useCallback, useRef } from "react"; // 1. Imported useRef
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchPlants } from "@/api/customer/plant";
import { Loader2, Star } from 'lucide-react';
import { nameToSlug } from "@/utils/utils";

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const abbreviateSize = (size) => {
  if (!size) return '';
  switch (size.toUpperCase()) {
    case 'EXTRA SMALL': return 'XS';
    case 'SMALL': return 'S';
    case 'MEDIUM': return 'M';
    case 'LARGE': return 'L';
    case 'EXTRA LARGE': return 'XL';
    default: return size[0] ? size[0].toUpperCase() : '';
  }
};

const isLightColor = (hex) => {
  if (!hex) return false;
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 200;
};

function ProductCard({ product }) {
  const name = product.name ?? "Unknown Plant";
  const price = product.sellingPrice ?? 0;
  const mrp = product.mrp ?? 0;
  const discount = product.discountPercent ?? 0;
  const linkId = product.variantId;
  const size = product.size ?? 'N/A';
  const colorHex = product.color?.hexCode ?? '#ffffff';

  const primaryImage = product.images?.find(img => img.isPrimary);
  const image = primaryImage?.mediaUrl || product.images?.[0]?.mediaUrl;

  return (
    <Link
      to={`/product/${nameToSlug(product.name)}/${linkId}`}
      className="group flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden "
    >
      <div className="relative w-full overflow-hidden ">
        <img
          src={image}
          alt={name}
          className="w-full aspect-square group-hover:scale-105 transition-transform duration-300 ease-in-out max-h-52 object-fill"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate" title={name}>
          {name}
          <span className="ml-1.5 text-[12px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
            {abbreviateSize(size)}
          </span>
        </h3>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-block w-4 h-4 rounded-full ${isLightColor(colorHex) ? 'border border-gray-300' : ''}`}
              style={{ backgroundColor: colorHex }}
            ></span>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-md font-bold text-emerald-600">
              {formatCurrency(price)}
            </p>
            {discount > 0 && (
              <p className="text-xs text-gray-400 line-through -mt-1">
                {formatCurrency(mrp)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SearchMegamenu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const paginationAndFilters = {
    page: 1,
    limit: 10
  };

  const handleSearchNavigation = () => {
    if (searchTerm.trim().length < 2) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchNavigation();
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['plantsSearch', { search: debouncedSearchTerm, options: paginationAndFilters }],
    queryFn: () => searchPlants({
      search: debouncedSearchTerm,
      options: paginationAndFilters
    }),
    enabled: searchTerm.length >= 2 && !!debouncedSearchTerm,
    staleTime: 1000 * 60 * 5,
  });

  const plants = data?.data || data || [];
  const errorMessage = error?.message || null;
  const hasProducts = plants.length > 0;

  return (
    <div className="relative flex-1 w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div className="relative ">
        <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl text-gray-400 hover:cursor-pointer" onClick={handleSearchNavigation} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for plants and flowers…"
          className=" w-full rounded-full border bg-white border-gray-200 py-2 pl-10 sm:pl-12 pr-4 text-base font-medium text-gray-700 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 300)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isFocused && searchTerm.length >= 2 && (
        <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden w-full vw-full mx-0">
          <div className="flex flex-row h-94 max-w-full mx-auto px-2">
            <div className="w-full p-4">
              {searchTerm && (
                <>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Results for "{searchTerm}"
                  </h4>

                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                    </div>
                  ) : errorMessage ? (
                    <p className="text-xs sm:text-sm text-gray-400">{errorMessage}</p>
                  ) : hasProducts ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 max-h-80 overflow-y-auto no-scrollbar">
                      {plants.slice(0, 8).map((product) => (
                        <ProductCard key={product.variantId} product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400">No products found for "{searchTerm}"</p>
                  )}
                </>
              )}
            </div>
          </div>

          {searchTerm && hasProducts && (
            <div className="px-4 py-2 border-t border-gray-100 ">
              <Link
                to={`/search?q=${searchTerm}`}
                className="text-emerald-600 hover:text-emerald-800 text-xs sm:text-sm font-medium transition-colors"
              >
                Show all results for "{searchTerm}"
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchMegamenu;