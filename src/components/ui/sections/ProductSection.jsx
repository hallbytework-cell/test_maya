import PropTypes from "prop-types";
// import { useDispatch } from "react-redux";
// import { toast } from "react-hot-toast";
import ProductCard from "@/components/ui/cards/ProductCard";
// import { addItem } from "@/features/cart/cartSlice"; // ⬅️  cart action
import ProductCardSkeleton from "../cards/ProductCardSkeleton";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

export default function ProductSection({
  title = "Products",
  products = [],
  viewAllHref = "/category/plants",
  isLoading = false,
  linkState = null,
}) {
  // 2. Initialize the hook
  const navigate = useNavigate();

  // 3. Create the handler function
  const handleViewAllClick = () => {
    // Navigate to the href and pass the state
    navigate(viewAllHref, { state: linkState });
  };

  return (
    <section className="bg-[#FAFDF6] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header - Redesigned for impact and consistency */}
        <div className="md:flex md:items-center md:justify-between mb-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-3xl font-bold leading-tight text-[#1E4620]">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <div className="mt-5 flex md:mt-0 md:ml-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleViewAllClick} // Use the new handler
                className="group inline-flex items-center text-base font-semibold text-[#3A633C] hover:text-[#1E4620] transition duration-300"
              >
                View All
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {isLoading
            ? // If loading, show skeletons
            products.map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
            : // Otherwise, show real product cards
            products.map((p) => (
              <ProductCard
                key={p.id} // Use the stable ID
                id={p.id}
                title={p.name}
                price={p.price}
                tags={p.tags}
                images={p.images}
                rating={p.rating}
                reviews={p.reviews}
                colors={p.colors}
                hexColors={p.hexColors}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- prop types ---------------- */
ProductSection.propTypes = {
  products: PropTypes.array.isRequired,
  title: PropTypes.string,
  viewAllHref: PropTypes.string,
  isLoading: PropTypes.bool,
  linkState: PropTypes.object,
};