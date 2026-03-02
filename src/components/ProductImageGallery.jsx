import { motion, AnimatePresence } from "framer-motion";

export default function ProductImageGallery({ product, variant, selectedImage, handleImageSelect }) {
  return (
    <div className="space-y-4">
      <motion.div className="relative w-full overflow-hidden rounded-2xl shadow-lg border border-gray-100">
        <AnimatePresence initial={false}>
          <motion.img
            key={variant?.image || selectedImage}
            src={variant?.image || selectedImage}
            alt={product.name}
            className="w-full h-80 aspect-square object-cover"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </AnimatePresence>
      </motion.div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(product.images || []).map((img, i) => (
          <motion.img
            key={img}
            src={img}
            alt={`${product.name} thumbnail`}
            className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer border-2 shrink-0 ${
              selectedImage === img
                ? "border-emerald-500"
                : "border-gray-200 hover:border-emerald-300"
            }`}
            onClick={() => handleImageSelect(img)}
            whileHover={{ scale: 1.05 }}
            sizes="80px"
          />
        ))}
      </div>
    </div>
  );
}