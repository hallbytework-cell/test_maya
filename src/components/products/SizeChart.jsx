import React, { useEffect, useState } from "react";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- CUSTOM ANIMATED ICONS ---

// 1. Animated Female Character (Vector Style)
const AnimatedGirlIcon = ({ height, className }) => {
  // Simple blink animation state
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      viewBox="0 0 80 200"
      className={className}
      style={{ height: height }}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* CSS for Breathing Animation */}
      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.02); }
          }
          .breathing {
            animation: breathe 3s ease-in-out infinite;
            transform-origin: bottom center;
          }
        `}
      </style>

      <g className="breathing">
        {/* Legs */}
        <path d="M30 140 L30 200" stroke="#fcd34d" strokeWidth="12" strokeLinecap="round" />
        <path d="M50 140 L50 200" stroke="#fcd34d" strokeWidth="12" strokeLinecap="round" />
        
        {/* Shoes */}
        <path d="M22 190 H38 V200 H22 Z" fill="#ef4444" />
        <path d="M42 190 H58 V200 H42 Z" fill="#ef4444" />

        {/* Dress */}
        <path d="M20 60 L60 60 L70 150 L10 150 Z" fill="#f43f5e" />
        
        {/* Arms */}
        <path d="M20 65 L10 110" stroke="#fcd34d" strokeWidth="8" strokeLinecap="round" />
        <path d="M60 65 L70 110" stroke="#fcd34d" strokeWidth="8" strokeLinecap="round" />

        {/* Head */}
        <circle cx="40" cy="35" r="22" fill="#fcd34d" />
        
        {/* Hair */}
        <path d="M15 35 C 15 10, 65 10, 65 35 L 65 70 L 15 70 Z" fill="#3f2c22" />
        
        {/* Eyes (Blinking Logic) */}
        {isBlinking ? (
          <g>
            <line x1="32" y1="35" x2="38" y2="35" stroke="#3f2c22" strokeWidth="2" />
            <line x1="44" y1="35" x2="50" y2="35" stroke="#3f2c22" strokeWidth="2" />
          </g>
        ) : (
          <g>
            <circle cx="35" cy="35" r="2" fill="#3f2c22" />
            <circle cx="47" cy="35" r="2" fill="#3f2c22" />
          </g>
        )}
        
        {/* Smile */}
        <path d="M36 42 Q 40 46, 44 42" stroke="#3f2c22" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
};

// 2. Dynamic Plant Icon (Same as before)
const PlantIcon = ({ height, color, className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 150"
    className={className}
    style={{ ...style, height: height }}
    preserveAspectRatio="none"
  >
    {/* Pot Shadow */}
    <ellipse cx="50" cy="145" rx="30" ry="4" fill="black" opacity="0.1" />
    
    {/* Pot */}
    <path d="M25 125 L30 145 L70 145 L75 125 Z" fill="#a8a29e" />
    <path d="M20 120 L80 120 L75 130 L25 130 Z" fill="#d6d3d1" />

    {/* Organic Stem & Leaves */}
    <g transform="translate(50, 120)">
      <path d="M0 0 Q 5 -30, 0 -120" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M0 -20 Q 25 -30, 35 -50 Q 10 -40, 0 -30" fill={color} opacity="0.9" />
      <path d="M0 -25 Q -25 -35, -35 -55 Q -10 -45, 0 -35" fill={color} opacity="0.9" />
      <path d="M0 -50 Q 20 -60, 28 -80 Q 10 -70, 0 -60" fill={color} transform="scale(0.9)" />
      <path d="M0 -55 Q -20 -65, -28 -85 Q -10 -75, 0 -65" fill={color} transform="scale(0.9)" />
      <path d="M0 -80 Q 15 -90, 20 -110 Q 5 -100, 0 -90" fill={color} transform="scale(0.8)" />
      <path d="M0 -85 Q -15 -95, -20 -115 Q -5 -105, 0 -95" fill={color} transform="scale(0.8)" />
    </g>
  </svg>
);

const SizeChart = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeCategories = [
    { name: "Small", range: "25-30", rangeIn: "10-12", maxH: 30, color: "#4ade80" },
    { name: "Medium", range: "35-45", rangeIn: "14-18", maxH: 45, color: "#22c55e" },
    { name: "Large", range: "50-65", rangeIn: "20-26", maxH: 65, color: "#16a34a" },
    { name: "XL", range: "60-90", rangeIn: "24-36", maxH: 90, color: "#15803d" },
  ];

  // --- SCALING CONSTANTS ---
  const MAX_SCALE_HEIGHT_CM = 190;
  const CHART_AREA_HEIGHT_PX = 320; // Increased slightly
  const PERSON_HEIGHT_CM = 168;

  const getPixelHeight = (cm) => (cm / MAX_SCALE_HEIGHT_CM) * CHART_AREA_HEIGHT_PX;
  const cmToInches = (cm) => Math.round(cm * 0.3937); // Helper conversion

  const heightMarkers = [50, 100, 150];

  return (
    <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 animate-in fade-in"
        onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-300"
      >
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-full">
                <Info className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Plant Size Guide</h2>
                <p className="text-xs text-slate-500 font-medium">Visual comparison with an average person (~168cm / 5'6")</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* --- SCROLLABLE BODY --- */}
        <div className="overflow-y-auto p-6 md:p-8">
          
          {/* CHART AREA */}
          <div className="relative bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-2xl p-6 mb-8 shadow-inner mt-4">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 z-0 pointer-events-none px-6 pb-6 flex flex-col justify-end" style={{ height: CHART_AREA_HEIGHT_PX + 48 }}>
                {heightMarkers.map((cm) => (
                    <div 
                        key={cm} 
                        className="absolute w-full border-t border-dashed border-slate-200 left-0 flex items-center group"
                        style={{ bottom: getPixelHeight(cm) + 24 }}
                    >
                        <span className="bg-white/80 px-2 text-[10px] font-bold text-slate-400 ml-2">
                            {cm} cm / {cmToInches(cm)}"
                        </span>
                    </div>
                ))}
            </div>

            {/* Visual Row */}
            <div className="flex items-end justify-around relative z-10 h-[320px] pt-8 pb-2">
                
                {/* 1. HUMAN REFERENCE (Animated) */}
                <div className="flex flex-col items-center justify-end relative z-20">
                    <div className="relative flex flex-col items-center">
                         {/* Static Label Above Head */}
                         <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded mb-2 shadow-sm whitespace-nowrap">
                            You <span className="text-slate-300">|</span> ~5'6"
                        </div>
                        
                        <AnimatedGirlIcon 
                            height={getPixelHeight(PERSON_HEIGHT_CM)} 
                            className="drop-shadow-md" 
                        />
                    </div>
                </div>

                {/* 2. PLANT CATEGORIES */}
                {sizeCategories.map((cat, idx) => (
                    <div key={cat.name} className="flex flex-col items-center justify-end relative group cursor-default">
                        <div className="relative flex flex-col items-center transition-transform duration-300">
                             
                            {/* PERMANENT VISIBLE LABEL (Metric + Imperial) */}
                            <div className="bg-white border border-emerald-100 text-emerald-800 text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-sm mb-2 text-center min-w-[80px]">
                                <div className="leading-none mb-0.5">{cat.range} cm</div>
                                <div className="text-emerald-600/70 font-medium leading-none">{cat.rangeIn}"</div>
                                {/* Little arrow pointing down */}
                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-white border-b border-r border-emerald-100"></div>
                            </div>
                            
                            <PlantIcon
                                height={getPixelHeight(cat.maxH)}
                                color={cat.color}
                                className="drop-shadow-sm"
                            />
                        </div>
                        
                        {/* Label */}
                        <div className="text-center mt-3 pt-2 border-t-2 border-transparent group-hover:border-emerald-100 transition-colors w-full">
                            <p className={`text-xs font-bold transition-colors ${idx > 1 ? 'text-emerald-700' : 'text-slate-700'}`}>
                                {cat.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ground Line */}
            <div className="absolute bottom-6 left-6 right-6 h-1 bg-slate-200 rounded-full"></div>
          </div>

          {/* INFO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800">Placement Tip</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        <span className="font-semibold text-emerald-700">Small & Medium</span> fit on desks. <span className="font-semibold text-emerald-700">Large+</span> are for floors.
                    </p>
                </div>
            </div>

             {/* Card 2 */}
             <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-amber-500 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800">Nature Varies</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Heights include the pot. Plants are living things and may vary slightly!
                    </p>
                </div>
            </div>

             {/* Card 3 */}
             <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-blue-500 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800">Growth</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        A "Medium" plant can grow into a "Large" one in 12-18 months with love.
                    </p>
                </div>
            </div>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <Button 
            onClick={onClose}
            className="px-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Close Guide
          </Button>
        </div>

      </div>
    </div>
  );
};

export default SizeChart;