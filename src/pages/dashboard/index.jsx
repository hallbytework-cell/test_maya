import React, { useState, useEffect, useRef } from "react";
import { User, Package as Box, HomeIcon } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { OrderDetailsModal } from "./OrderDetailsModal";

const tabs = [
  { name: "Profile", path: "profile", icon: <User />, end: true },
  { name: "Orders", path: "orders", icon: <Box /> },
  { name: "Address", path: "address", icon: <HomeIcon /> },
];

export default function Dashboard() {
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const { user } = useAuth();
  const location = useLocation();
  const tabsRef = useRef(null);

  useEffect(() => {
    const activeTab = tabsRef.current?.querySelector(".active-tab");
    
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center", 
      });
    }
  }, [location.pathname]);

  return (
    <div className="leaf-pattern">
      <div className="min-h-screen max-w-6xl mx-auto p-6">
        {/* User Profile Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-green-500 text-white text-2xl rounded-full">
            <User />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.fullName || "Maya Vriksh"}</h2>
            <p className="text-gray-500">{user?.email || "abc@mayavroiksh.com"}</p>
            <p className="text-green-600 text-sm">Member since 2022</p>
          </div>
        </div>

        <div 
          ref={tabsRef} 
          className="flex items-center gap-4 mb-6 overflow-x-auto no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? "bg-green-gradient text-white shadow-md bg-green-500 active-tab" // Added 'active-tab' class here
                    : "text-gray-600 hover:text-green-500"
                }`
              }
            >
              {tab.icon} {tab.name}
            </NavLink>
          ))}
        </div>

        <Outlet context={{ setSelectedOrderForDetails }} />
      </div>

      {selectedOrderForDetails && (
        <OrderDetailsModal
          order={selectedOrderForDetails}
          onClose={() => setSelectedOrderForDetails(null)}
        />
      )}
    </div>
  );
}