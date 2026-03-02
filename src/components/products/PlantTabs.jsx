import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Leaf,
  Droplets,
  Beaker,
  Feather,
  Sparkles,
  Gift,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Sun,
  Wind,
  Thermometer,
  MapPin,
  Hammer,
  Sprout,
  Heart,
  Globe,
  CheckCircle2,
  ShieldAlert,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPlantCareBySize } from "@/api/customer/plant";
import { seasonTabsData } from "@/constants/plants.constants";


export default function PlantTabs({
  productData,
  activeTab,
  setActiveTab,
  plantSize,
  plantSizes,
}) {
  const [selectedSizeForCare, setSelectedSizeForCare] = useState(plantSize);
  const [selectedSeason, setSelectedSeason] = useState("Summer");

  // 1. Sync Parent Prop
  useEffect(() => {
    if (plantSize) {
      setSelectedSizeForCare(plantSize);
    }
  }, [plantSize]);

  // 2. API Value Lookup
  const apiSizeValue = useMemo(() => {
    if (!selectedSizeForCare || !productData.sizes) {
      return null;
    }
    const sizeObject = productData.sizes.find(
      (s) => s.label === selectedSizeForCare
    );
    return sizeObject ? sizeObject.value : null;
  }, [selectedSizeForCare, productData.sizes]);

  // 3. Data Query
  const careQuery = useQuery({
    queryKey: ["plantCare", productData.id, apiSizeValue],
    queryFn: () => getPlantCareBySize(productData.id, apiSizeValue),
    enabled: !!(activeTab === "care" && apiSizeValue),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const handleTabChange = (tabId) => setActiveTab(tabId);
  const handleSeasonChange = (season) => setSelectedSeason(season);

  // Tabs Config
  const tabs = [
    { id: "description", label: "Overview", icon: "📝" },
    { id: "care", label: "Care Guide", icon: "🌿" },
    { id: "features", label: "Features", icon: "✨" },
    { id: "spiritual", label: "Spiritual", icon: "🔮" },
    { id: "benefits", label: "Benefits", icon: "❤️" },
  ];

  const [seasonTabs, setSeasonTabs] = useState([]);

  useEffect(() => {
    const { careGuidelines } = careQuery.data?.data || {};
    if (careGuidelines && seasonTabs.length == 0) {
      const avaialableSeasonTabs = careGuidelines.map((seasonData) => seasonData?.season);
      const tempSeasonTabs = seasonTabsData.filter(season => avaialableSeasonTabs.includes(season.id));
      if (tempSeasonTabs.length != 0) {
        setSelectedSeason(tempSeasonTabs[0].id)
      }
      setSeasonTabs(tempSeasonTabs)
    }
  }, [careQuery])

  return (
    <Card className="rounded-2xl shadow-xl border-0 overflow-hidden bg-white ring-1 ring-slate-100 mt-8">

      {/* --- Navigation Bar --- */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="relative">
          <nav
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:justify-center"
            id="tab-navigation"
            style={{ scrollBehavior: "smooth" }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex-shrink-0 snap-start relative px-6 py-4 text-sm font-bold transition-all duration-300 outline-none flex items-center gap-2
                    ${isActive ? "text-slate-900 bg-white shadow-sm rounded-t-lg border-t-2 border-t-indigo-500" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}
                  `}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="p-6 md:p-8 min-h-[400px]">

        {/* 1. DESCRIPTION TAB */}
        {activeTab === "description" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Hero Info */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    {productData.class || "Botanical"}
                  </span>
                  {productData.isFeatured && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {productData.name}
                  </h3>
                  <p className="text-lg text-slate-500 italic font-serif mt-1">
                    {productData.scientificName}
                  </p>
                </div>

                <p className="text-slate-600 leading-relaxed text-base border-l-4 border-indigo-500 pl-4 bg-slate-50 py-2 rounded-r-lg">
                  {productData.description}
                </p>
              </div>

              {/* Series & Origin Card */}
              <div className="w-full md:w-1/3 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-lg">
                <h4 className="font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Quick Specs
                </h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Series</span>
                    <span className="font-semibold">{productData.series}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Origin</span>
                    <span className="font-semibold">{productData.placeOfOrigin}</span>
                  </li>
                  <li className="flex justify-between pt-1">
                    <span className="text-slate-400">Maintenance</span>
                    <span className="font-semibold text-emerald-400">{productData.maintenance}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Origin", value: productData.placeOfOrigin, icon: MapPin, color: "red" },
                { label: "Temp", value: `${productData.temperatureRange?.min}-${productData.temperatureRange?.max}°C`, icon: Thermometer, color: "orange" },
                { label: "Care", value: productData.maintenance, icon: Hammer, color: "blue" },
                { label: "Soil", value: productData.soil, icon: Sprout, color: "emerald" },
                { label: "Repotting", value: productData.repotting, icon: Leaf, color: "purple" },
                { label: "Growth", value: "Moderate", icon: Sparkles, color: "amber" },
              ].map((item, i) => (
                <div key={i} className={`
                  p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow duration-300
                  bg-white flex flex-col items-center text-center gap-2
                `}>
                  <div className={`p-2 rounded-full bg-${item.color}-50 text-${item.color}-500`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.value}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>

            {/* What's Included List */}
            {productData.insideBox?.length > 0 && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-indigo-500" /> What's Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productData.insideBox.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fun Facts */}
            {productData.funFacts?.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-2xl text-white shadow-lg">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-lg">
                  <span className="text-2xl">💡</span> Did You Know?
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {productData.funFacts.map((fact, index) => (
                    <div key={index} className="flex gap-3 items-start bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                      <Leaf className="w-5 h-5 flex-shrink-0 text-emerald-300 mt-0.5" />
                      <p className="text-sm font-medium leading-relaxed opacity-90">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. CARE TAB */}
        {activeTab === "care" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-slate-200 p-4 rounded-xl mb-8 shadow-sm gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Care Guide</h4>
                  <p className="text-xs text-slate-500">Select size & season for precise info</p>
                </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto items-center">
                <select
                  value={selectedSizeForCare || ""}
                  onChange={(e) => setSelectedSizeForCare(e.target.value)}
                  className="flex-1 md:w-48 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="" disabled>Select size...</option>
                  {plantSizes.map((s, i) => (
                    <option key={i} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Season Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-slate-100 p-1.5 rounded-xl">
                {seasonTabs.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSeasonChange(s.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2
                      ${selectedSeason === s.id ? s.activeClass : "text-slate-500 hover:text-slate-700"}
                    `}
                  >
                    <span>{s.icon}</span>
                    <span className="inline">{s.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {careQuery.isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                <p className="text-slate-500 font-medium">Loading care instructions...</p>
              </div>
            ) : careQuery.isError ? (
              <div className="p-6 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <span>Failed to load care data. Please try again later.</span>
              </div>
            ) : (
              <>
                {(() => {
                  const { careGuidelines, fertilizerSchedule } = careQuery.data?.data || {};
                  const careData = careGuidelines?.find(c => c.season === selectedSeason);
                  const fertData = fertilizerSchedule?.filter(f => f.applicationSeason === selectedSeason) || [];

                  if (!careData && fertData.length === 0) return (
                    <div className="text-center py-12 text-slate-400 font-medium bg-slate-50 rounded-xl border border-slate-100">
                      No specific data available for {selectedSeason}.
                    </div>
                  );

                  return (
                    <div className="space-y-8">
                      {careData && (
                        <div className="grid md:grid-cols-2 gap-5">
                          {/* Water */}
                          <div className="bg-cyan-50/50 border border-cyan-100 p-6 rounded-2xl hover:border-cyan-200 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-white text-cyan-600 rounded-lg shadow-sm"><Droplets className="w-5 h-5" /></div>
                              <h5 className="font-bold text-cyan-900">Watering</h5>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between border-b border-cyan-200/50 pb-2">
                                <span className="font-bold text-cyan-700">Frequency</span>
                                <span className="text-slate-700">{careData.wateringFrequency}</span>
                              </div>
                              <div className="flex justify-between border-b border-cyan-200/50 pb-2">
                                <span className="font-bold text-cyan-700">Amount</span>
                                <span className="text-slate-700">{careData.waterAmountMl} ml</span>
                              </div>
                              <p className="text-slate-600 pt-1 leading-relaxed">{careData.wateringMethod} during {careData.recommendedTime}</p>
                            </div>
                          </div>

                          {/* Light */}
                          <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-2xl hover:border-amber-200 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-white text-amber-600 rounded-lg shadow-sm"><Sun className="w-5 h-5" /></div>
                              <h5 className="font-bold text-amber-900">Sunlight</h5>
                            </div>
                            <div className="space-y-2">
                              <p className="font-bold text-slate-800">{careData.sunlightType?.typeName}</p>
                              <p className="text-sm text-slate-600 leading-relaxed">{careData.sunlightType?.description}</p>
                            </div>
                          </div>

                          {/* Humidity */}
                          <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm"><Wind className="w-5 h-5" /></div>
                              <h5 className="font-bold text-indigo-900">Environment</h5>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-slate-700">Humidity</span>
                              <span className="text-xs font-bold px-2 py-1 bg-white rounded border border-indigo-100 text-indigo-600 uppercase">{careData.humidityLevel?.level}</span>
                            </div>
                            <p className="text-sm text-slate-600">{careData.humidityLevel?.description}</p>
                          </div>

                          {/* Soil */}
                          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl hover:border-emerald-200 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-white text-emerald-600 rounded-lg shadow-sm"><Leaf className="w-5 h-5" /></div>
                              <h5 className="font-bold text-emerald-900">Soil & Care</h5>
                            </div>
                            <p className="text-sm font-medium text-slate-800 mb-2">{careData.soilTypes}</p>
                            <p className="text-xs text-slate-500 italic leading-relaxed">"{careData.careNotes}"</p>
                          </div>
                        </div>
                      )}

                      {/* --- FERTILIZER SECTION --- */}
                      {fertData.length > 0 && (
                        <div className="pt-10 mt-10 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                              <div className="p-2 bg-fuchsia-100 text-fuchsia-600 rounded-lg">
                                <Beaker className="w-5 h-5" />
                              </div>
                              Nutrient Schedule
                            </h4>
                            <span className="text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-full uppercase tracking-tight">
                              {selectedSeason} Feeding
                            </span>
                          </div>

                          <div className="grid gap-6">
                            {fertData.map((f) => (
                              <div key={f.fertilizerScheduleId} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-fuchsia-200 transition-all duration-300">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-500" />

                                <div className="p-5 md:p-6">
                                  <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between mb-2">
                                        <div>
                                          <h5 className="text-lg font-bold text-slate-900 group-hover:text-fuchsia-700 transition-colors">
                                            {f.fertilizer?.name}
                                          </h5>
                                          <p className="text-sm font-semibold text-fuchsia-600">{f.fertilizer?.type}</p>
                                        </div>
                                        {f.fertilizer?.isEcoFriendly && (
                                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100">
                                            <Leaf className="w-3 h-3" />
                                            <span className="text-[10px] font-bold uppercase">Eco</span>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-500 leading-relaxed mb-4">{f.fertilizer?.description}</p>
                                      {f.fertilizer?.composition && (
                                        <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-600">
                                          NPK: {f.fertilizer.composition}
                                        </div>
                                      )}
                                    </div>

                                    <div className="lg:w-80 space-y-3">
                                      <div className="grid grid-cols-1 gap-2">
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Method</p>
                                          <p className="text-sm font-bold text-indigo-600">{f.applicationMethod || "Standard Application"}</p>
                                        </div>
                                        <div className="flex gap-2">
                                          <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Frequency</p>
                                            <p className="text-sm font-bold text-slate-700">{f.applicationFrequency}</p>
                                          </div>
                                          <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dosage</p>
                                            <p className="text-sm font-bold text-slate-700">
                                              {f.dosageAmount} <span className="text-xs font-medium text-slate-500">{f.dosageUnit}</span>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start">
                                    <div className="flex flex-wrap gap-2">
                                      {f.benefits?.map((benefit, i) => (
                                        <span key={i} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                          {benefit}
                                        </span>
                                      ))}
                                    </div>
                                    {f.safetyNotes?.length > 0 && (
                                      <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 max-w-xs">
                                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                                        <div className="text-[11px] text-red-700 font-medium">
                                          {f.safetyNotes.join(" • ")}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {/* 3. FEATURES TAB */}
        {activeTab === "features" && (
          <div className="grid md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
            {[
              { title: "Air Purifying", desc: "Removes harmful toxins like formaldehyde.", icon: Wind, color: "cyan" },
              { title: "Low Maintenance", desc: "Forgiving nature makes it perfect for beginners.", icon: Feather, color: "orange" },
              { title: "Indoor Friendly", desc: "Thrives in stable indoor temperatures.", icon: MapPin, color: "indigo" },
              { title: "Fast Growing", desc: "Rewarding growth rate during spring.", icon: Sprout, color: "emerald" },
            ].map((feature, i) => (
              <div key={i} className="group flex gap-5 p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-700 transition-colors">{feature.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. SPIRITUAL TAB */}
        {activeTab === "spiritual" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* Hero Aura Card */}
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <h3 className="text-xl font-bold tracking-wide uppercase opacity-90">Cosmic Energy</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-bold text-violet-200 uppercase tracking-wider mb-1">Aura Type</p>
                    <p className="text-2xl font-bold">{productData.auraType || "Calming & Grounding"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-violet-200 uppercase tracking-wider mb-2">Spiritual Uses</p>
                    <div className="flex flex-wrap gap-2">
                      {productData.spiritualUseCase?.map((use, i) => (
                        <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/20">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Deities */}
              <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🕉️</span> Associated Deities
                </h4>
                <div className="space-y-3">
                  {productData.tags?.associatedDeity?.map((d, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                      <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-800">
                        {d.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divine Alignment */}
              <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌟</span> Divine Alignment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {productData.tags?.godAligned?.map((a, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-100">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. BENEFITS TAB */}
        {activeTab === "benefits" && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 hover:shadow-lg transition-all">
                <Globe className="w-10 h-10 text-emerald-600 mb-4" />
                <h4 className="font-bold text-emerald-900 text-lg mb-2">Biodiversity Booster</h4>
                <p className="text-emerald-700 text-sm leading-relaxed">
                  {productData.biodiversityBooster
                    ? "Creates a micro-habitat supporting local ecosystem health."
                    : "Contributes to greener urban spaces."}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-cyan-50 border border-cyan-100 hover:shadow-lg transition-all">
                <Wind className="w-10 h-10 text-cyan-600 mb-4" />
                <h4 className="font-bold text-cyan-900 text-lg mb-2">Carbon Absorber</h4>
                <p className="text-cyan-700 text-sm leading-relaxed">
                  {productData.carbonAbsorber
                    ? "Highly efficient at scrubbing CO₂ from your home."
                    : "Helps improve overall indoor air quality."}
                </p>
              </div>
            </div>

            {/* Emotion & Health */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-pink-50 p-6 rounded-2xl border border-pink-100">
                <h4 className="font-bold text-pink-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Emotional
                </h4>
                <div className="flex flex-wrap gap-2">
                  {productData.tags?.bestForEmotion?.map((e, i) => (
                    <span key={i} className="px-3 py-1 bg-white text-pink-600 rounded-full text-xs font-bold border border-pink-100 shadow-sm">{e}</span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" /> Health Benefits
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {productData.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Card>
  );
}