import { useEffect, useRef, useState } from "react";
import { Filter, X, Leaf, Ruler, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

import colorList from "@/constants/size";
import { sizeToAbbreviation } from "@/utils/utils";
import { sortOptions } from "@/constants/plants.constants";

/* -------------------- Custom Scrollbar -------------------- */
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #d1d5db;
  }
`;

/* -------------------- Currency Input -------------------- */
const inputStyles = {
  backgroundColor: "#f9fafb",
  borderRadius: "0.5rem",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e5e7eb",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d1d5db",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#10b981",
    borderWidth: "2px",
  },
  "& .MuiInputBase-input": {
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "8px 0",
    color: "#1f2937",
  },
};

const CurrencyInput = ({ value, onChange, min, max }) => (
  <FormControl fullWidth variant="outlined" size="small">
    <OutlinedInput
      value={value}
      onChange={onChange}
      startAdornment={
        <InputAdornment position="start">
          <span className="text-gray-400 font-medium text-xs">₹</span>
        </InputAdornment>
      }
      inputProps={{ type: "number", min, max }}
      sx={inputStyles}
    />
  </FormControl>
);

/* -------------------- Sort Filter -------------------- */
function SortByFilter({ value, onChange, isOpen, toggleAccordion }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden">
      <Accordion
        type="single"
        collapsible
        value={isOpen ? "sort" : "close"}
        onValueChange={() => toggleAccordion("sort")}
      >
        <AccordionItem value="sort" className="border-b-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpDown size={16} />
              </div>
              <span className="font-semibold text-gray-800">Sort By</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <Select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              fullWidth
              sx={{
                height: 45,
                borderRadius: "12px",
                backgroundColor: "#f9fafb",
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/* -------------------- Size Filter -------------------- */
function PlantSizeFilter({ sizes, selectedSizes, onChange, isOpen, toggleAccordion }) {
  const toggleSize = (size) => {
    onChange(
      selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size]
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100/50 shadow-sm">
      <Accordion
        type="single"
        collapsible
        value={isOpen ? "size" : "close"}
        onValueChange={() => toggleAccordion("size")}
      >
        <AccordionItem value="size" className="border-b-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Leaf size={16} className="text-emerald-600" />
              <span className="font-bold text-sm">Plant Size</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => {
                const selected = selectedSizes.includes(size.value);
                return (
                  <button
                    key={size.value}
                    onClick={() => toggleSize(size.value)}
                    className={`py-2 rounded-xl text-sm font-semibold transition ${
                      selected
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-white"
                    }`}
                  >
                    {sizeToAbbreviation(size.label)}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/* -------------------- Price Filter -------------------- */
function PriceRangeFilter({ value, onChange, min, max, isOpen, toggleAccordion }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => setLocalValue(value), [value]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100/50 shadow-sm">
      <Accordion
        type="single"
        collapsible
        value={isOpen ? "price" : "close"}
        onValueChange={() => toggleAccordion("price")}
      >
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Ruler size={16} className="text-emerald-600" />
              <span className="font-bold text-sm">Price Range</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6">
            <Slider
              value={localValue}
              onChange={(_, v) => {
                setLocalValue(v);
                onChange(v);
              }}
              min={min}
              max={max}
            />
            <div className="flex gap-3 mt-4">
              <CurrencyInput value={localValue[0]} />
              <CurrencyInput value={localValue[1]} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/* ==================== MAIN SIDEBAR ==================== */
export default function FilterSidebar({
  onClose,
  appliedFilter,
  onApplyFilters,
  currentSort,
  setCurrentSort,
  accordion,
  setAccordion,
}) {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    setPriceRange(appliedFilter.priceRange || [0, 5000]);
    setSelectedSizes(appliedFilter.selectedSizes || []);
  }, [appliedFilter]);

  const toggleAccordion = (key) =>
    setAccordion((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    onApplyFilters({
      priceRange,
      selectedSizes,
    });
  }, [priceRange, selectedSizes]);

  return (
    <>
      <style>{customScrollbarStyles}</style>

      <div className="flex flex-col h-full bg-[#f8fafc] border-r">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-emerald-600" />
              <h2 className="font-bold">Filters</h2>
            </div>

            {/* ✅ FIXED: keep lg:hidden */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
          <SortByFilter
            value={currentSort}
            onChange={setCurrentSort}
            isOpen={accordion.sort}
            toggleAccordion={toggleAccordion}
          />

          <PriceRangeFilter
            value={priceRange}
            onChange={setPriceRange}
            min={0}
            max={5000}
            isOpen={accordion.price}
            toggleAccordion={toggleAccordion}
          />

          <PlantSizeFilter
            sizes={colorList}
            selectedSizes={selectedSizes}
            onChange={setSelectedSizes}
            isOpen={accordion.size}
            toggleAccordion={toggleAccordion}
          />
        </div>
      </div>
    </>
  );
}
