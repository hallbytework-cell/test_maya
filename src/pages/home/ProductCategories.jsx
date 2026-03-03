import React from "react";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";
import { categories } from "@/data/categories";
import OptimizedImageResponsive from "@/components/OptimizedImageResponsive";

/* ------------- Category Cards ------------- */
const CategoryCard = ({ cat }) => {
  const itemCount = cat.subcategories?.length ?? 0;

  return (
    <Link
      to={`/category/${cat.id}`}
      className="group flex flex-col items-center snap-start flex-shrink-0"
    >
      {/* Circular thumbnail with gradient ring */}
      <div className="bg-gradient-to-tr from-emerald-300 to-emerald-500 p-[2px] rounded-full">
        <OptimizedImageResponsive
          src={cat.img}
          alt={cat.label}
          width={112}
          height={112}
          loading="lazy"
          className="
            w-20 h-20               /* phones */
            sm:w-24 sm:h-24         /* tablets */
            md:w-28 md:h-28         /* laptops & up */
            object-cover rounded-full
          "
        />
      </div>

      {/* Label */}
      <span className="mt-2 sm:mt-3 font-semibold text-emerald-800 group-hover:text-emerald-600 text-sm sm:text-base">
        {cat.label}
      </span>

      {/* Item count – hidden on <sm */}
      <span className="hidden sm:block text-xs text-gray-500">
        {itemCount} item{itemCount !== 1 && "s"}
      </span>
    </Link>
  );
};

/* ------------- Main Section -------------- */
export default function ProductCategories() {
  return (
    <section className="mx-auto  my-2 px-4 py-4 sm:py-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-1">
        <h2 className="w-full sm:w-auto text-xl sm:text-2xl font-semibold text-emerald-700 flex items-center gap-2 justify-center">
          <Gift className="text-[1.3em]" />
          PRODUCT&nbsp;CATEGORIES
        </h2>

        <Link
          to="/categories"
          className="text-emerald-600 hover:underline font-medium mx-auto sm:mx-0"
        >
          View all
        </Link>
      </div>

      {/* Subtitle */}
      <p className="text-center text-gray-600 mt-3 mb-4 sm:mb-10 px-2 sm:px-0">
        Discover the perfect gift for every special moment and celebration
      </p>

      {/* Responsive list: scroll-snap row on mobile, grid on ≥ md */}
      <div
        className="
          flex lg:justify-center overflow-x-auto gap-2 lg:gap-14 
          scroll-smooth snap-x snap-mandatory
           md:overflow-visible md:mx-0
        "
      >
        {categories.map((cat) => (
          <CategoryCard cat={cat} key={cat.id} />
        ))}
      </div>

      {/* CTA */}
      {/* <div className="flex justify-center mt-3">
        <Link
          to="/collections"
          className="bg-emerald-600 text-white px-8 py-3 rounded-full
                     hover:bg-emerald-700 transition shadow-lg"
        >
          Explore All Collections
        </Link>
      </div> */}
    </section>
  );
}
