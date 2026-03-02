import PropTypes from "prop-types";
import { memo } from "react";
import ProductCardTwo from "@/components/ui//cards/ProductCardTwo";

// Memoized ProductGrid to prevent unnecessary re-renders when parent updates
const ProductGrid = memo(function ProductGrid({ products = [] }) {
  if (!products.length) {
    return <p className="text-gray-600 py-8">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5">
      {products.map((product) => (
        <ProductCardTwo key={product.id} product={product} />
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductGrid;
