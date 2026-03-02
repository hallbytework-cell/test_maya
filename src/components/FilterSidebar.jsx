import { useEffect, useRef, useState } from "react";
import { Filter, X, Leaf, Ruler, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Only import specific MUI components needed
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import colorList from "@/constants/size";
import { sizeToAbbreviation } from "@/utils/utils";
import { sortOptions } from "@/constants/plants.constants";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

// --- Custom CSS for the Scrollbar ---
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #d1d5db;
  }
`;

const inputStyles = {
  backgroundColor: '#f9fafb',
  borderRadius: '0.5rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e5e7eb',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#10b981',
    borderWidth: '2px',
  },
  '& .MuiInputBase-input': {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '8px 0px 8px 0',
    color: '#1f2937',
  }
};

const CurrencyInput = ({ value, onChange, min, max, ...props }) => (
  <FormControl fullWidth variant="outlined" size="small">
    <OutlinedInput
      value={value}
      onChange={onChange}
      startAdornment={
        <InputAdornment position="start">
          <span className="text-gray-400 font-medium text-xs">₹</span>
        </InputAdornment>
      }
      inputProps={{ type: 'number', min, max }}
      sx={inputStyles}
      {...props}
    />
  </FormControl>
);


function SortByFilter({ value, onChange, defaultOpen, isOpen = false, toggleAccordion }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Accordion type="single" collapsible defaultValue={defaultOpen ? "sort" : undefined} value={isOpen ? "sort" : "close"} onValueChange={() => toggleAccordion("sort")}>
        <AccordionItem value="sort" className="border-b-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline group">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-100">
                <ArrowUpDown size={16} />
              </div>
              <span className="font-semibold text-gray-800">Sort By</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <Select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Sort by' }}
              sx={{
                width: '100%',
                height: 45,
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: '#f9fafb', // gray-50
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e5e7eb', // gray-200
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981', // emerald-500
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#059669', // emerald-600
                  borderWidth: '1px',
                },
              }}
            >
              {/* Dynamic Mapping from your constant */}
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

// ... (Existing CheckboxFilterSection, ColorSwatchFilter, PlantSizeFilter, PriceRangeFilter components remain exactly the same as your code) ...

// function CheckboxFilterSection({ title, id = "", options = [], selectedValues = [], onChange, defaultOpen, isOpen = false, toggleAccordion }) {
//   const toggleOption = (value) => {
//     if (selectedValues.includes(value)) {
//       onChange(selectedValues.filter((v) => v !== value));
//     } else {
//       onChange([...selectedValues, value]);
//     }
//   };

//   return (
//     <div className="group rounded-2xl bg-white transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-100">
//       <Accordion collapsible defaultValue={defaultOpen ? "item-1" : undefined} value={isOpen ? id : "close"} onValueChange={() => toggleAccordion(id)} className="w-full">
//         <AccordionItem value={id} className="border-b-0">
//           <AccordionTrigger className="px-4 py-4 hover:no-underline text-gray-700 hover:text-emerald-700 transition-colors">
//             <div className="flex items-center gap-3">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                 <Filter size={16} />
//               </div>
//               <span className="font-bold text-sm tracking-wide">{title}</span>
//             </div>
//           </AccordionTrigger>
//           <AccordionContent className="px-4 pb-4 pt-0">
//             <div className="flex flex-col gap-2 pt-2">
//               {options.map((option) => (
//                 <div
//                   key={option.value}
//                   onClick={() => toggleOption(option.value)}
//                   className={`group/item flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${selectedValues.includes(option.value)
//                     ? 'bg-emerald-50 border-emerald-100'
//                     : 'bg-transparent border-transparent hover:bg-gray-50'
//                     }`}
//                 >
//                   <Checkbox
//                     id={option.value}
//                     checked={selectedValues.includes(option.value)}
//                     onCheckedChange={() => toggleOption(option.value)}
//                     className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 border-gray-300 h-5 w-5 rounded-md transition-all"
//                   />
//                   <label htmlFor={option.value} className="flex-1 text-sm font-medium text-gray-600 group-hover/item:text-gray-900 cursor-pointer select-none">
//                     {option.label}
//                   </label>
//                   {option.count && (
//                     <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-100 py-0.5 px-2 rounded-md shadow-sm">
//                       {option.count}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   );
// }

// function ColorSwatchFilter({ colors = [], selectedColors, onChange, defaultOpen = false, isOpen = false, toggleAccordion }) {
//   const toggleColor = (colorId) => {
//     if (selectedColors.includes(colorId)) {
//       onChange(selectedColors.filter((cId) => cId !== colorId));
//     } else {
//       onChange([...selectedColors, colorId]);
//     }
//   };

//   return (
//     <div className="group rounded-2xl bg-white transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-100">
//       <Accordion type="single" collapsible defaultValue={defaultOpen ? "item-1" : undefined} value={isOpen ? "color" : "close"} onValueChange={() => toggleAccordion("color")}>
//         <AccordionItem value="color" className="border-b-0">
//           <AccordionTrigger className="px-4 py-4 hover:no-underline text-gray-700 hover:text-emerald-700 transition-colors">
//             <div className="flex items-center gap-3">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                 <Sparkles size={16} />
//               </div>
//               <span className="font-bold text-sm tracking-wide">Colors</span>
//             </div>
//           </AccordionTrigger>
//           <AccordionContent className="px-4 pb-4">
//             <div className="flex flex-wrap gap-3 justify-start pt-2">
//               {colors.map((color) => {
//                 const isSelected = selectedColors.includes(color.value);
//                 return (
//                   <div key={color.id} className="relative group/color">
//                     <button
//                       onClick={() => toggleColor(color.value)}
//                       className={`h-10 w-10 rounded-full shadow-sm transition-transform duration-200 hover:scale-110 flex items-center justify-center border-2 ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-100'}`}
//                       style={{ backgroundColor: color.hexCode }}
//                     >
//                       {isSelected && <Check className="text-white drop-shadow-md" size={16} />}
//                     </button>
//                     {!isSelected && (
//                       <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[9px] font-bold text-gray-500 opacity-0 group-hover/color:opacity-100 transition-opacity">
//                         {color.count}
//                       </span>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   );
// }

function PlantSizeFilter({ sizes = [], selectedSizes = [], onChange, defaultOpen, isOpen = false, toggleAccordion }) {
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter((s) => s !== size));
    } else {
      onChange([...selectedSizes, size]);
    }
  };

  return (
    <div className="group rounded-2xl bg-white transition-all duration-300 hover:shadow-lg shadow-sm border border-gray-100/50">
      <Accordion type="single" collapsible defaultValue={defaultOpen ? "size" : undefined} value={isOpen ? "size" : "close"} onValueChange={() => toggleAccordion("size")}>
        <AccordionItem value="size" className="border-b-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline text-gray-800 hover:text-emerald-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600">
                <Leaf size={16} />
              </div>
              <span className="font-bold text-sm tracking-wide">Plant Size</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="grid grid-cols-3 gap-3 pt-2">
              {sizes.map((size) => {
                const isSelected = selectedSizes.includes(size.value);
                return (
                  <button
                    key={size.value}
                    onClick={() => toggleSize(size.value)}
                    className={`
                      relative py-2.5 px-2 rounded-xl text-sm font-semibold transition-all duration-300 ease-out
                      flex items-center justify-center
                      ${isSelected
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                        : 'bg-gray-50 text-gray-600 hover:bg-white hover:shadow-md hover:scale-105 border border-transparent hover:border-gray-100'
                      }
                    `}
                  >
                    {sizeToAbbreviation(size.label)}
                    {isSelected && <span className="absolute h-2 w-2 bg-white rounded-full top-1.5 right-1.5 opacity-50 animate-pulse"></span>}
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

function PriceRangeFilter({ min = 0, max = 5000, value, onChange, defaultOpen, isOpen = false, toggleAccordion }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e, newValue) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMinInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '') return;
    const newMin = Math.max(min, Math.min(Number(inputValue), localValue[1] - 50));
    const newRange = [newMin, localValue[1]];
    setLocalValue(newRange);
    onChange(newRange);
  };

  const handleMaxInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '') return;
    const newMax = Math.min(max, Math.max(Number(inputValue), localValue[0] + 50));
    const newRange = [localValue[0], newMax];
    setLocalValue(newRange);
    onChange(newRange);
  };

  return (
    <div className="group rounded-2xl bg-white transition-all duration-300 hover:shadow-lg shadow-sm border border-gray-100/50">
      <Accordion type="single" collapsible defaultValue={defaultOpen ? "price" : undefined} value={isOpen ? "price" : "close"} onValueChange={() => toggleAccordion("price")}>
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline text-gray-800 hover:text-emerald-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600">
                <Ruler size={16} />
              </div>
              <span className="font-bold text-sm tracking-wide">Price Range</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6">
            <div className="pt-2 px-2">
              <div className="relative pt-6 pb-2">
                <Slider
                  getAriaLabel={() => 'Price range'}
                  value={localValue}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  min={min}
                  max={max}
                  sx={{
                    color: '#10b981', // Emerald 500
                    height: 6,
                    '& .MuiSlider-track': {
                      border: 'none',
                    },
                    '& .MuiSlider-thumb': {
                      height: 20,
                      width: 20,
                      backgroundColor: '#fff',
                      border: '2px solid currentColor',
                      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: 'inherit',
                      },
                      '&:before': {
                        display: 'none',
                      },
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.3,
                      backgroundColor: '#d1d5db',
                    },
                  }}
                />
              </div>

              {/* Input Fields */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                  <CurrencyInput
                    value={localValue[0]}
                    onChange={handleMinInputChange}
                    max={max}
                  />
                </div>
                <div className="text-gray-300 font-medium">-</div>
                <div className="flex-1">
                  <CurrencyInput
                    value={localValue[1]}
                    onChange={handleMaxInputChange}
                    min={min}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default function FilterSidebar({ onClose, isMobile = false, appliedFilter, onApplyFilters, setCurrentSort, currentSort, accordion = [], setAccordion, isLoading = false }) {
  // 2. Add State for sorting
  const [sortBy, setSortBy] = useState("relevance");

  const [priceRange, setPriceRange] = useState([1, 5000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTagTypes, setSelectedTagTypes] = useState([]);

  useEffect(() => {
    setPriceRange(appliedFilter.priceRange || [0, 5000]);
    setSelectedSizes(appliedFilter.selectedSizes || []);
    setSelectedColors(appliedFilter.selectedColors || [])
    setSelectedTagTypes(appliedFilter.selectedTagTypes || [])
  }, [appliedFilter])

  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      applyFilters()
    }, 500)
  }, [priceRange, selectedSizes, selectedColors, selectedTagTypes, sortBy])

  const toggleAccordion = (title) => {
    setAccordion(prev => {
      return { ...prev, [title]: !prev[title] }
    })
  }

  const hasActiveFilters = () => {
    return (
      (priceRange[0] !== 0 || priceRange[1] !== 5000) ||
      selectedSizes.length > 0 ||
      selectedColors.length > 0 ||
      sortBy !== "relevance" // Consider sort as active if not default
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy("relevance");
  };

  const applyFilters = () => {
    const filters = {
      priceRange,
      selectedSizes,
      selectedColors,
      selectedTagTypes,
      sortBy // Include sortBy in the filter object
    };
    if (onApplyFilters) onApplyFilters(filters);
  };

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div className="flex flex-col h-full bg-[#f8fafc] border-r border-gray-100/50">

        {/* Header - Sticky with glassmorphism */}
        <div className="shrink-0 z-10 sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 blur opacity-20 rounded-full"></div>
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                  <Filter className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-none" data-testid="text-filters-title">Filters</h2>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">Refine Selection</p>
              </div>
            </div>
            <button
              onClick={onClose}
<<<<<<< HEAD
              className="group relative p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 lg:hidden"
=======
              className="group relative p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
>>>>>>> 048fdb4 (Initial commit from dev-akash)
              aria-label="Close filters"
            >
              <div className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200 relative z-10" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">

          <div className="hidden md:block">
            <SortByFilter
              value={currentSort}
              onChange={setCurrentSort}
              isOpen={accordion.sort}
              toggleAccordion={toggleAccordion}
            />

          </div>
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

          {/* Uncomment when ready - styles are updated */}
          {/* {availableFilters.colors && availableFilters.colors.length > 0 && <ColorSwatchFilter
            colors={availableFilters.colors}
            selectedColors={selectedColors}
            onChange={setSelectedColors}
            isOpen={accordion.color}
            toggleAccordion={toggleAccordion}
          />}

          {availableFilters.tags && availableFilters.tags.length > 0 && <CheckboxFilterSection
            title="Tags"
            id="tag"
            options={availableFilters.tags}
            selectedValues={selectedTagTypes}
            onChange={setSelectedTagTypes}
            isOpen={accordion.tag ?? false}
            toggleAccordion={toggleAccordion}
          />} 
          */}

        </div>

        {/* Footer - Fixed at bottom */}
        {hasActiveFilters() && (
          <div className="shrink-0 p-5 bg-white border-t border-gray-100 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.03)] z-10">
            <Button
              onClick={clearAllFilters}
              data-testid="button-clear-all"
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/20 rounded-xl h-11 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
}