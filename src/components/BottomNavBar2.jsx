import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Search, 
  Truck, 
  User, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X 
} from "lucide-react";
import SearchMegamenu from "./SearchMegamenu"; 

const BRAND_COLOR = "#ff3f6c";
const INACTIVE_COLOR = "#6b7280"; 
const ACTIVE_SCALE = "scale-110"; 

export default function BottomNavbar({
  onProfileClick,
  isLoggedIn,
  onFilterClick,
  onSortClick,
  onSearchClick,
  isMobileSearchOpen,
  isLoading = false, 
  hasItems = true
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // --- CONFIG: ROUTES ---
  const SHOW_FILTERS_ON = [
    "/category", 
    "/all-products", 
    "/plants", 
    "/pots",
    "/search-results"
  ];

  const getActiveTabFromRoute = (path) => {
    if (path === "/") return "home";
    if (path.startsWith("/track-order")) return "track";
    if (path.startsWith("/account/profile") || path.startsWith("/account") || path.startsWith("/login")) return "profile";
    return "home";
  };

  const [activeItem, setActiveItem] = useState("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(true);

  const shouldShowFilters = SHOW_FILTERS_ON.some(route => currentPath.startsWith(route)) && hasItems;

  useEffect(() => {
    if (isSearchOpen) {
      setActiveItem("search");
    } else {
      setActiveItem(getActiveTabFromRoute(currentPath));
    }
  }, [currentPath, isSearchOpen]);

  useEffect(()=>{
    if(isMobileSearchOpen)return;
    setIsSearchOpen(isMobileSearchOpen);
  },[isMobileSearchOpen])

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowFloatingBar(false);
      } else {
        setShowFloatingBar(true);
      }
      lastScrollY = currentScrollY;
    };
    if (shouldShowFilters) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      setShowFloatingBar(false);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldShowFilters]);

  const navItems = [
    { 
      id: "home", 
      icon: Home, 
      label: "Home", 
      action: () => { setIsSearchOpen(false); navigate("/"); }
    },
    { 
      id: "search", 
      icon: Search, 
      label: "Search", 
      action: () => {
        onSearchClick();
        setIsSearchOpen(true);
      }
    },
    { 
      id: "track", 
      icon: Truck, 
      label: "Track", 
      action: () => { setIsSearchOpen(false); navigate("/track-order"); }
    },
    { 
      id: "profile", 
      icon: User, 
      label: isLoggedIn ? "Profile" : "Login", 
      action: () => { 
        setIsSearchOpen(false); 
        navigate(isLoggedIn ? "/account" : "/login");
        if (onProfileClick) onProfileClick(); 
      }
    }
  ];

  return (
    <>
      <div 
        className={`md:hidden fixed z-40 left-1/2 transform -translate-x-1/2 transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          shouldShowFilters && showFloatingBar && !isSearchOpen
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-12 opacity-0 pointer-events-none scale-90"
        }`}
        style={{ bottom: 'calc(4.2rem + env(safe-area-inset-bottom))' }} 
      >
        <div className="flex items-center p-1 bg-[#1e293b]/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] rounded-full border border-white/10 ring-1 ring-white/5">
          
          <button 
            onClick={onSortClick}
            className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-full active:bg-white/10 transition-all active:scale-95"
          >
            <ArrowUpDown size={13} className="text-gray-300" />
            <span className="text-[12px] font-semibold text-white tracking-wide uppercase">Sort</span>
          </button>

          <div className="w-[1px] h-3 bg-white/15 mx-0.5"></div>

          <button 
            onClick={onFilterClick}
            className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full active:bg-white/10 transition-all active:scale-95"
          >
            <SlidersHorizontal size={13} className="text-gray-300" />
            <span className="text-[12px] font-semibold text-white tracking-wide uppercase">Filter</span>
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <nav 
          className="bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex justify-around items-center h-[60px] px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex flex-1 flex-col items-center justify-center h-full gap-1 active:scale-95 transition-transform duration-200"
                >
                  <div className="relative">
                    <Icon
                      size={24}
                      strokeWidth={isActive ? 2.5 : 2} 
                      color={isActive ? BRAND_COLOR : INACTIVE_COLOR}
                      className={`
                        transition-all duration-300 ease-out
                        ${isActive ? `${ACTIVE_SCALE} drop-shadow-sm` : 'scale-100'}
                      `}
                    />
                  </div>
                  
                  <span
                    className={`
                      text-[10px] font-medium tracking-wide transition-colors duration-300
                    `}
                    style={{ 
                      color: isActive ? BRAND_COLOR : INACTIVE_COLOR,
                      fontWeight: isActive ? 600 : 500
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </>
  );
}