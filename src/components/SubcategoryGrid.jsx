import { memo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

function SubcategoryGrid({ list = [], selectedId, onSelect, allLabel = "All" }) {
  const scrollRef = useRef(null);
  
  const items = [{ id: "", label: allLabel, value: '' }, ...list];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const activeElement = container.querySelector('[data-active="true"]');

    if (activeElement) {
      const scrollLeft =
        activeElement.offsetLeft -
        container.offsetWidth / 2 +
        activeElement.offsetWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectedId]);

  return (
    <section 
      ref={scrollRef} 
      className="overflow-x-scroll justify-center py-3 bg-white sticky top-0 border-b border-gray-200 z-30 no-scrollbar"
    >
      <div className="px-4 flex gap-4 md:gap-6 w-max min-w-full justify-center md:justify-center"> 
        
        {items.map((sub) => {
          const isActive = selectedId === sub.value; 

          return (
            <button
              key={sub.id || "all"}
              onClick={() => onSelect(sub.categoryId || sub.value)} 
              data-active={isActive}
              className={clsx(
                "flex flex-col items-center text-center space-y-2 focus:outline-none transition-all flex-shrink-0", 
                isActive && "text-emerald-600"
              )}
            >
              <div
                className={clsx(
                  "relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28",
                  "rounded-full overflow-hidden border-3 transition-all shadow-lg",
                  isActive
                    ? "border-emerald-600 ring-4 ring-emerald-300 scale-105"
                    : "border-gray-300 hover:border-emerald-400 hover:scale-105"
                )}
              >
                <img
                  src={
                    sub.mediaUrl ||
                    "https://nurserylive.com/cdn/shop/files/ChatGPTImageJul19_2025_05_09_54PM_700x700.jpg?v=1753045482"
                  }
                  alt={sub.label}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>

              <p
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="text-xs md:text-sm font-semibold truncate w-full max-w-[7rem]"
              >
                {sub.label}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

SubcategoryGrid.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.string,
      categoryId: PropTypes.string,
      mediaUrl: PropTypes.string,
    })
  ),
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  allLabel: PropTypes.string,
};

export default memo(SubcategoryGrid);