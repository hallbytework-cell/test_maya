import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // CHANGE: switched from wouter
import { Filter, Home, Search, ShoppingCart, Truck, User } from "lucide-react";
import { useSelector } from "react-redux";
import SearchMegamenu from "./SearchMegamenu";
import TuneIcon from '@mui/icons-material/Tune';

export default function BottomNavbar({
  onProfileClick,
  isLoggedIn,
  onCartClick,
  onFilterClick

}) {
  const location = useLocation(); // CHANGE: Returns object in RRD
  const navigate = useNavigate(); // CHANGE: Hook for navigation

  const [activeItem, setActiveItem] = useState("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);
  const [cartShake, setCartShake] = useState(false);

  // Get cart count from Redux
  const cartItems = useSelector((state) => state.persisted?.cart?.guestCartItems || []);
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Trigger cart shake animation when items are added
  useEffect(() => {
    if (totalItems > prevCartCount) {
      setCartShake(true);
      setTimeout(() => setCartShake(false), 600);
    }
    setPrevCartCount(totalItems);
  }, [totalItems, prevCartCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (isSearchOpen) {
        setIsSearchOpen(false);
        if (location.pathname === "/") {
          setActiveItem("home");
        } else if (location.pathname === "/track-order") {
          setActiveItem("track");
        }
      }
    };

    if (isSearchOpen) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSearchOpen, location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveItem("home");
    }
  }, [location]);

  const handleItemClick = (itemId, action) => {
    setActiveItem(itemId);
    if (action) {
      action();
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    handleItemClick("search");
  };

  const navActions = {
    toggleSearch,
    onFilterClick,
    onProfileClick,
    handleItemClick,
  };

  const getNavItems = ({ currentPath, cartCount, actions }) => {



    const allItems = [
      {
        id: "home",
        icon: Home,
        label: "Home",
        color: "#2BB673",
        href: "/",
      },
      {
        id: "search",
        icon: Search,
        label: "Search",
        color: "#6B21A8",
        gradientColor: "linear-gradient(135deg, #6B21A8 0%, #A78BFA 100%)",
        onClick: actions.toggleSearch,
      },
      {
        id: "track",
        icon: Truck,
        label: "Track",
        color: "#10B981",
        href: "/track-order",
        badge: cartCount,
        isVisible: (path) => !path.includes("category"),
      },
      {
        id: "filter",
        icon: Filter,
        label: "Filter",
        color: "#10B981",
        onClick: actions.onFilterClick,
        isVisible: (path) => path.includes("category"),
      }
    ];

    return allItems.filter(item =>
      item.isVisible ? item.isVisible(currentPath) : true
    );
  };

  const visibleNavItems = getNavItems({
    currentPath: location.pathname,
    cartCount: totalItems,
    actions: navActions
  });
  return (
    <>
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-lg border-b border-gray-200 animate-slide-down">
          <div className="flex items-center gap-3 p-4">
            <div className="flex-1">
              <SearchMegamenu />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-gray-600 hover:text-gray-900 p-2 hover-elevate active-elevate-2 rounded-md transition-colors"
              aria-label="Close Search"
              data-testid="button-close-search"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- UI CHANGE START (Maintained your slim UI updates) --- */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <nav
          className="mx-4 mb-2 bg-white border border-gray-200 shadow-xl rounded-2xl"
          role="navigation"
          aria-label="Mobile navigation"
          data-testid="bottom-navbar"
        >
          <div className="flex justify-around items-center px-2 py-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const showLabel = isActive;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.href) {
                      // CHANGE: Use navigate() instead of window.location.href
                      navigate(item.href);
                    } else if (item.onClick) {
                      item.onClick();
                    }
                  }}
                  className="relative flex flex-col items-center justify-center min-w-[56px] px-1 py-1 transition-all duration-300 group"
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  data-testid={`nav-${item.id}`}
                  style={{
                    "--item-color": item.color,
                    "--item-gradient": item.gradientColor,
                  }}
                >
                  {/* Icon Container */}
                  <div className={`relative ${item.id === "cart" && cartShake ? "animate-shake" : ""}`}>
                    {/* Search Gradient Background */}
                    {item.id === "search" && isActive && (
                      <div
                        className="absolute -inset-2 rounded-full animate-gradient-sweep"
                        style={{
                          background: item.gradientColor,
                          opacity: 0.15,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <Icon
                      size={24}
                      strokeWidth={2}
                      className="relative z-10 transition-all duration-[180ms] ease-out"
                      style={{
                        color: isActive ? item.color : "#000000",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                      }}
                    />

                    {/* Cart Badge */}
                    {item.id === "cart" && item.badge > 0 && (
                      <div
                        className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-md animate-badge-pop"
                        aria-label={`${item.badge} items in cart`}
                        data-testid="cart-badge"
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </div>
                    )}
                  </div>

                  {/* Label with fade/slide animation */}
                  <span
                    className="text-[10px] font-medium transition-all duration-[180ms] ease-out"
                    style={{
                      color: isActive ? item.color : "#000000",
                      opacity: showLabel ? 1 : 0,
                      transform: showLabel ? "translateY(0)" : "translateY(4px)",
                      maxHeight: showLabel ? "20px" : "0px",
                      overflow: "hidden",
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
      {/* --- UI CHANGE END --- */}


      {/* CSS Animations */}
      <style>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes badge-pop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-2px) rotate(-2deg);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(2px) rotate(2deg);
          }
        }

        @keyframes gradient-sweep {
          0% {
            transform: translateX(-100%) scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.15;
          }
          100% {
            transform: translateX(100%) scale(1.2);
            opacity: 0;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-badge-pop {
          animation: badge-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-shake {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        .animate-gradient-sweep {
          animation: gradient-sweep 0.6s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-slide-down,
          .animate-badge-pop,
          .animate-shake,
          .animate-gradient-sweep {
            animation: none !important;
          }
          
          * {
            transition-duration: 0.01ms !important;
          }
        }

        main {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}