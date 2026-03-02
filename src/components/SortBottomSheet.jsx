import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { sortOptions } from "@/constants/plants.constants";

// --- CONFIG ---
const BRAND_COLOR = "#ff3f6c"; // Match your navbar brand color

export default function SortBottomSheet({
  isOpen,
  onClose,
  onApply,
  currentSort = ""
}) {
  const [selected, setSelected] = useState(currentSort);
  const [isClosing, setIsClosing] = useState(false);

  // Sync internal state if prop changes
  useEffect(() => {
    setSelected(currentSort);
  }, [currentSort]);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  // Handle selection
  const handleSelect = (id) => {
    setSelected(id);
    // Optional: Add small delay before closing to show selection feedback
    setTimeout(() => {
      onApply(id); // Send selected value back to parent
      handleClose();
    }, 200);
  };

  if (!isOpen && !isClosing) return null;


  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center">

      {/* 1. Backdrop (Dark Overlay) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100 animate-fade-in"
          }`}
        onClick={handleClose}
      />

      {/* 2. Bottom Sheet Container */}
      <div
        className={`
          relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden
          transition-transform duration-300 ease-out transform
          ${isClosing ? "translate-y-full" : "translate-y-0 animate-slide-up"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">
            Sort By
          </h3>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Options List */}
        <div className="px-4 py-2 pb-8">
          {sortOptions.map((option) => {
            const isSelected = selected === option.value;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full flex items-center justify-between px-4 py-4 mb-1 rounded-xl transition-all duration-200
                  ${isSelected ? 'bg-pink-50/50' : 'hover:bg-gray-50'}
                `}
              >
                {/* Label */}
                <span
                  className={`text-sm font-medium ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-600'
                    }`}
                  style={{ color: isSelected ? BRAND_COLOR : undefined }}
                >
                  {option.label}
                </span>

                {/* Radio Circle / Checkmark */}
                <div
                  className={`
                    flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-200
                    ${isSelected ? 'border-transparent' : 'border-gray-300'}
                  `}
                  style={{ backgroundColor: isSelected ? BRAND_COLOR : 'transparent' }}
                >
                  {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}