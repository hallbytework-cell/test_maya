import React, {
  useCallback,
  useMemo,
  useState,
  Suspense,
  lazy,
} from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNavbar from "./BottomNavBar2";
import CartSidebar from "./CartSidebar";
import { PageViewTracker } from "./PageViewTracker";
import { useAuth } from "@/context/AuthContext";
import ScrollToTop from "./ScrollToTop";
import HomeSkeleton from "./shimmer/HomeSkeleton";

// Lazy-loaded modals (not needed on every page view)
const AuthPopup = lazy(() => import("./AuthModal"));
const SortBottomSheet = lazy(() => import("./SortBottomSheet"));

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!user?.userId;

  const [isAuthPopupVisible, setIsAuthPopupVisible] = useState(false);
  const [modalLocked, setModalLocked] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [navbarStatus, setNavbarStatus] = useState({
    isLoading: false,
    hasItems: true,
  });

  const handleNavbarStatus = useCallback((isLoading, hasItems) => {
    setNavbarStatus((prev) => {
      if (prev.isLoading === isLoading && prev.hasItems === hasItems) {
        return prev;
      }
      return { isLoading, hasItems };
    });
  }, []);

  const handleSortApply = useCallback((value) => {
    setCurrentSort(value);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthPopupVisible(false);
    setModalLocked(false);
    alert("Login Successful!");
  }, []);

  const handleLogout = useCallback(() => {
    if (logout) logout();
    sessionStorage.removeItem("mv_access_token");
    sessionStorage.removeItem("authToken");
    navigate("/");
    alert("Logged out successfully!");
  }, [logout, navigate]);

  const handleProfileClick = useCallback(() => {
    if (user?.userId) {
      navigate("/account/profile");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFilterClick = useCallback(
    () => setIsFilterSidebarOpen((p) => !p),
    []
  );
  const handleCartToggle = useCallback(
    () => setIsCartOpen((p) => !p),
    []
  );
  const handleSortToggle = useCallback(() => setIsSortOpen(true), []);
  const handleSearchToggle = useCallback(
    () => setIsMobileSearchOpen(true),
    []
  );

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      handleLogout,
      isFilterSidebarOpen,
      setIsFilterSidebarOpen,
      setIsAuthPopupVisible,
      setModalLocked,
      setNavbarStatus: handleNavbarStatus,
      currentSort,
      setCurrentSort,
    }),
    [
      isLoggedIn,
      handleLogout,
      isFilterSidebarOpen,
      handleNavbarStatus,
      currentSort,
    ]
  );

  return (
    <div className="flex flex-col w-full min-h-screen">
      <PageViewTracker />
      <ScrollToTop />

      <Navbar
        onCartClick={handleCartToggle}
        onSigninClick={handleProfileClick}
        isMobileSearchOpen={isMobileSearchOpen}
        setIsMobileSearchOpen={setIsMobileSearchOpen}
      />

      <Suspense fallback={<HomeSkeleton />}>
        <main
          key={location.pathname}
          className="flex-grow overflow-y-auto pb-16 md:pb-0"
        >
          <Outlet context={contextValue} />
        </main>
      </Suspense>

      <Footer />

      <BottomNavbar
        onProfileClick={handleProfileClick}
        isLoggedIn={isLoggedIn}
        onFilterClick={handleFilterClick}
        onCartClick={handleCartToggle}
        onSortClick={handleSortToggle}
        isLoading={navbarStatus.isLoading}
        hasItems={navbarStatus.hasItems}
        onSearchClick={handleSearchToggle}
        isMobileSearchOpen={isMobileSearchOpen}
      />

      {/* Lazy-loaded modals */}
      <Suspense fallback={null}>
        {isSortOpen && (
          <SortBottomSheet
            isOpen={isSortOpen}
            onClose={() => setIsSortOpen(false)}
            onApply={handleSortApply}
            currentSort={currentSort}
          />
        )}

        {isAuthPopupVisible && (
          <AuthPopup
            show={isAuthPopupVisible}
            onClose={() => {
              if (!modalLocked) setIsAuthPopupVisible(false);
            }}
            onLoginSuccess={handleLoginSuccess}
            disableClose={modalLocked}
          />
        )}
      </Suspense>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
