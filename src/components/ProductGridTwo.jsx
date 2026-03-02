import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProductCardTwo from "@/components/ui/cards/ProductCardTwo";

export default function ProductGridTwo({ products = [] }) {
  if (!products.length) {
    return <p className="text-gray-600 py-8">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCardTwo key={product.id} product={product} />
      ))}
    </div>
  );
}

ProductGridTwo.propTypes = {
  products: PropTypes.array.isRequired,
};
