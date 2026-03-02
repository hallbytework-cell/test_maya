// ProductTabsUI.jsx
import React, { useState } from "react";
// --- ICONS --- (lucide-react)
import {
  Sun,
  Droplet,
  Leaf,
  Star,
  Gift,
  Info,
  Trees,
  Sprout,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Flower2,
  Droplets,
  Check,
  ChevronDown,
  Package,
} from "lucide-react";
import DeliveryPinCheck from "./DeliveryPinCheck";

/**
 * Product Tabs UI
 * - All icons use lucide-react (no react-icons)
 * - Components are defensive (default props / safe access)
 * - Small accessibility improvements (aria attributes, keys)
 */

// --- TAB CONTENT COMPONENTS ---
export const DescriptionTab = ({ product = {} }) => {
  const [expandedBox, setExpandedBox] = useState(null);

  return (
    <div className="space-y-6">
      <InfoCard title="Description" icon={Info} color="green">
        <p className="text-sm text-green-800">
          {product.description || "No description available."}
        </p>
      </InfoCard>

      <InfoCard title="Scientific Classification" icon={Sprout} color="green">
        <div className="grid sm:grid-cols-2 gap-4">
          <DetailItem icon={Leaf} color="green">
            <strong>Scientific Name:</strong>{" "}
            {product.details?.scientific_name || "N/A"}
          </DetailItem>

          <DetailItem icon={Leaf} color="green">
            <strong>Biological Name:</strong>{" "}
            {product.details?.biological_name || "N/A"}
          </DetailItem>

          <DetailItem icon={Trees} color="green">
            <strong>Class:</strong> {product.class || "N/A"}
          </DetailItem>

          <DetailItem icon={Sprout} color="green">
            <strong>Origin:</strong> {product.origin || "N/A"}
          </DetailItem>
        </div>
      </InfoCard>

      {/* Delivery PIN Check */}
      <DeliveryPinCheck />

      {/* What's Inside - Expandable Design */}
      <div className="bg-green-50 border border-green-100 rounded-xl overflow-hidden">
        <div className="p-4">
          <h3 className="text-green-700 font-semibold text-lg flex items-center gap-2 mb-4">
            <Package className="text-green-600 w-5 h-5" />
            What's in the Box
          </h3>

          {(product.insideBox || []).length === 0 ? (
            <p className="text-sm text-green-800">No items listed.</p>
          ) : (
            <div className="space-y-2">
              {(product.insideBox || []).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setExpandedBox(expandedBox === idx ? null : idx)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-green-100 rounded-lg hover:border-green-300 hover:shadow-sm transition text-left"
                >
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 flex-1">
                    {item || "Item"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 flex-shrink-0 transition ${
                      expandedBox === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <InfoCard title="Fun Facts" icon={Info} color="green">
        <div className="bg-white p-3 rounded-lg shadow-inner text-sm text-green-900 italic">
          {product.details?.fun_facts || "No fun facts available."}
        </div>
      </InfoCard>
    </div>
  );
};

export const CareTab = ({ product = {} }) => (
  <div className="space-y-6">
    {product.care && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Light" icon={Sun} color="yellow">
          <p className="text-sm text-yellow-800">
            {product.sunlight?.description || product.care?.light || "N/A"}
          </p>
        </InfoCard>

        <InfoCard title="Humidity" icon={Droplet} color="cyan">
          <p className="text-sm text-cyan-800">
            {product.humidity?.description || "N/A"}
            {product.humidity?.suitable_zones &&
              ` (${product.humidity.suitable_zones})`}
          </p>
        </InfoCard>
      </div>
    )}

    {product.watering_schedule && (
      <InfoCard title="Watering Schedule" icon={Droplets} color="green">
        <ul className="space-y-2">
          {Object.entries(product.watering_schedule).map(([season, info]) => (
            <li key={season} className="text-sm text-blue-900 capitalize">
              <strong>{season}:</strong> {info.frequency} ({info.amount_ml}ml)
            </li>
          ))}
        </ul>
      </InfoCard>
    )}

    {product.fertilizer && (
      <InfoCard title="Fertilizer" icon={Flower2} color="green">
        <div className="text-sm text-green-900 space-y-2">
          <p>
            <strong>Type:</strong> {product.fertilizer?.name || "N/A"}{" "}
            {product.fertilizer?.composition &&
              `(${product.fertilizer.composition})`}
          </p>
          <p>
            <strong>Schedule:</strong>{" "}
            {product.fertilizer?.schedule?.frequency || "N/A"}
          </p>

          {product.fertilizer?.caution && (
            <div className="mt-3 pt-3 border-t border-red-200 flex items-start gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Caution:</strong> {product.fertilizer.caution}
              </p>
            </div>
          )}
        </div>
      </InfoCard>
    )}
  </div>
);

export const FeaturesTab = ({ product = {} }) => (
  <div className="space-y-6">
    <InfoCard title="Key Features" icon={Leaf} color="green">
      <ul className="space-y-3">
        {product.features?.carbon_absorber && (
          <DetailItem icon={CheckCircle} color="green">
            Carbon Absorber
          </DetailItem>
        )}

        {product.features?.biodiversity_booster && (
          <DetailItem icon={CheckCircle} color="green">
            Biodiversity Booster
          </DetailItem>
        )}

        <DetailItem icon={Leaf} color="green">
          Feature Tag: {product.features?.feature_tag || "N/A"}
        </DetailItem>

        <DetailItem icon={Calendar} color="green">
          Added on:{" "}
          {product.features?.date_added
            ? new Date(product.features.date_added).toLocaleDateString()
            : "N/A"}
        </DetailItem>
      </ul>
    </InfoCard>
  </div>
);

export const SpiritualityTab = ({ product = {} }) => (
  <div className="space-y-6">
    <InfoCard title="Spiritual Significance" icon={Flower2} color="green">
      <div className="grid sm:grid-cols-2 gap-4">
        <DetailItem icon={Star} color="green">
          <strong>Associated Deity:</strong> {product.associatedDeity || "N/A"}
        </DetailItem>

        <DetailItem icon={Leaf} color="cyan">
          <strong>Spiritual Use:</strong> {product.spiritualUseCase || "N/A"}
        </DetailItem>

        <DetailItem icon={Star} color="rose">
          <strong>Best For:</strong> {product.bestForEmotion || "N/A"}
        </DetailItem>

        <DetailItem icon={Leaf} color="blue">
          <strong>Aura Type:</strong> {product.auraType || "N/A"}
        </DetailItem>
      </div>
    </InfoCard>

    <InfoCard title="Perfect Gift For" icon={Gift} color="rose">
      <p className="text-sm text-rose-900 font-medium">
        {product.bestGiftFor || "N/A"}
      </p>
    </InfoCard>
  </div>
);

export const BenefitsTab = ({ product = {} }) => (
  <div>
    <InfoCard title="Health & Environmental Benefits" icon={Leaf} color="green">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {(product.benefits || []).map((benefit, idx) => (
          <DetailItem key={idx} icon={Star} color="green">
            {benefit}
          </DetailItem>
        ))}
      </ul>
    </InfoCard>
  </div>
);

// --- REUSABLE UI COMPONENTS ---
export const Chip = ({ active, children, onClick, disabled, type, price }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative gap-1 flex flex-col w-full px-3 py-4 lg:py-2.5 rounded-lg text-sm font-semibold border-2 transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95
      ${
        active
          ? "border-emerald-600 bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-800 shadow-md"
          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-200"
      }
      disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1`}
    aria-pressed={active}
    data-testid={`chip-${children}`.toLowerCase().replace(/\s+/g, '-')}
  >
    <span className="font-semibold text-xs sm:text-sm">{children}</span>
    {price && <p className="text-xs font-bold text-emerald-700">{price}</p>}

    {active && (
      <span
        className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-[3px] text-[8px] flex items-center justify-center shadow-lg border-2 border-white"
        aria-hidden="true"
      >
        <Check className="w-2.5 h-2.5" />
      </span>
    )}
  </button>
);

export const ColorSwatch = ({ name, color, active, onClick, disabled }) => {
  const hex = color || "#ffffff";

  return (
    <div>
      <div className="relative inline-block">
        <button
          onClick={onClick}
          disabled={disabled}
          title={color}
          aria-label={`Select ${color} color`}
          className={`w-10 h-10 rounded-full border-2 shadow-md transition-all duration-200 cursor-pointer ${
            active
              ? "ring-2 ring-emerald-500 border-emerald-500"
              : "border-gray-200 hover:border-gray-400"
          } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          style={{ backgroundColor: hex }}
        />
        {active && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-emerald-500 rounded-full shadow-md">
            <Check className="w-3 h-3" />
          </span>
        )}
      </div>

      {name && (
        <div className="mt-1 text-center text-xs uppercase text-green-600">{name}</div>
      )}
    </div>
  );
};

export const TabButton = ({ active, label, icon: Icon, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-t-lg transition-colors duration-200 ${
      active
        ? "bg-green-500 text-black"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    aria-selected={active}
    role="tab"
  >
    {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
    {label || children}
  </button>
);

// --- REUSABLE TAB CONTENT COMPONENTS ---
export const InfoCard = ({ title, icon: Icon, children, color = "gray" }) => {
  const colorMap = {
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-100",
      text: "text-gray-700",
      icon: "text-gray-500",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      icon: "text-green-500",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      text: "text-yellow-700",
      icon: "text-yellow-500",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      text: "text-cyan-700",
      icon: "text-cyan-500",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      icon: "text-blue-500",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-100",
      text: "text-rose-700",
      icon: "text-rose-500",
    },
  };
  const C = colorMap[color] || colorMap.gray;

  return (
    <div className={`${C.bg} ${C.border} p-4 rounded-xl shadow-sm`}>
      <h3 className={`${C.text} font-semibold text-lg mb-3 flex items-center gap-2`}>
        {Icon && <Icon className={`${C.icon} w-5 h-5`} aria-hidden="true" />}
        {title}
      </h3>
      {children}
    </div>
  );
};

export const DetailItem = ({ icon: Icon, color = "gray", children }) => {
  const colorMap = {
    gray: "text-gray-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    rose: "text-rose-500",
    blue: "text-blue-500",
  };
  const iconColor = colorMap[color] || colorMap.gray;
  return (
    <div className="flex items-center gap-2 text-sm text-gray-800">
      {Icon && <Icon className={`${iconColor} w-4 h-4 flex-shrink-0`} aria-hidden="true" />}
      <span>{children}</span>
    </div>
  );
};
