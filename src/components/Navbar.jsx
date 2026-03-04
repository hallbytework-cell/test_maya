import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { clsx } from "clsx";

import {
        User,
        Package,
        ShoppingCart,
        X,
        Menu,
        ChevronDown,
        LogOut,
        Truck,
        UserCircle,
} from "lucide-react";

import { categories, campaignItems } from "@/data/categories";
import PincodePopup from "./PincodePopup";
import SearchMegamenu from "./SearchMegamenu";
import { useCartCount } from "@/hooks/useCartCount";

function useClickOutside(ref, handler, active = true) {
        useEffect(() => {
                if (!active) return;
                const listener = (event) => {
                        if (!ref.current || ref.current.contains(event.target)) return;
                        handler(event);
                };
                document.addEventListener("mousedown", listener);
                document.addEventListener("touchstart", listener);
                return () => {
                        document.removeEventListener("mousedown", listener);
                        document.removeEventListener("touchstart", listener);
                };
        }, [ref, handler, active]);
}


const PromoBar = () => (
        <div className="w-full overflow-hidden bg-emerald-50 text-emerald-800 py-2">
                <div className="animate-scroll-left flex whitespace-nowrap">
                        <div className="flex whitespace-nowrap">
                                <PromoItems />
                        </div>
                        <div className="flex whitespace-nowrap">
                                <PromoItems />
                        </div>
                </div>
        </div>
);

const PromoItems = () => (
        <>
                <span className="mx-6">🎉 Get a <strong>special discount</strong> on checkout!</span>
                <span className="mx-6">🚚 Delivery Only in West Bengal</span>
                <span className="mx-6">🌿 Premium Quality Plants</span>
                <span className="mx-6">🪴 Free Potting Mix on <strong>all orders</strong></span>
                <span className="mx-6">💳 COD Available · Secure Payments</span>
        </>
);

const UserMenuOptions = ({ closeMenu, handleLogout }) => (
        <ul className="mt-4 space-y-2 text-sm">
                <li>
                        <Link
                                to="/account/profile"
                                state={{ tab: "Profile" }}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                                onClick={closeMenu}
                        >
                                <User className="text-sm" />
                                My Profile
                        </Link>
                </li>
                <li>
                        <Link
                                to="/account/orders"
                                state={{ tab: "Orders" }}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                                onClick={closeMenu}
                        >
                                <Package className="text-sm" />
                                My Orders
                        </Link>
                </li>
                <li
                        onClick={() => {
                                handleLogout();
                                closeMenu?.();
                        }}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-red-50 text-red-600 cursor-pointer"
                >
                        <LogOut className="text-sm" />
                        Logout
                </li>
        </ul>
);

const Dropdown = ({ label, items = [], renderItem, isMobile = false, closeMenu }) => {
        const [open, setOpen] = useState(false);
        const ref = useRef(null);

        useClickOutside(ref, () => setOpen(false), open);

        const handleClose = () => {
                setOpen(false);
                closeMenu?.();
        };

        return (
                <div className={clsx("relative", isMobile && "w-full")} ref={ref}>
                        <button
                                onClick={() => setOpen((p) => !p)}
                                className={clsx(
                                        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                                        "text-gray-700 hover:bg-gray-100",
                                        open && "bg-gray-100"
                                )}
                        >
                                {label}
                                <ChevronDown className={clsx("text-sm transition-transform duration-200", open && "rotate-180")} />
                        </button>

                        <div
                                className={clsx(
                                        "transition-all ease-out duration-200 z-50",
                                        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
                                        isMobile ? "w-full" : "absolute left-0 top-full mt-2"
                                )}
                        >

                                <div className="w-56 overflow-hidden rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                                        <ul className="flex flex-col gap-1">
                                                {items.map((item, index) => (
                                                        <li key={item.id || index}>
                                                                {renderItem ? (
                                                                        renderItem({ item, close: handleClose })
                                                                ) : (
                                                                        <button
                                                                                onClick={() => {
                                                                                        item.onClick?.();
                                                                                        handleClose();
                                                                                }}
                                                                                className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-gray-50 hover:text-emerald-700"
                                                                        >
                                                                                {item.label}
                                                                        </button>
                                                                )}
                                                        </li>
                                                ))}
                                        </ul>
                                </div>
                        </div>
                </div>
        );
};

const MegaMenu = ({ cat, isMobile = false, closeMenu }) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef(null);

        const isDisabled = cat.label.toLowerCase() === "flowers";

        useClickOutside(containerRef, () => setIsOpen(false), isOpen);

        return (
                <div className={clsx("relative", isMobile && "w-full")} ref={containerRef}>
                        <button
                                onClick={() => !isDisabled && setIsOpen((prev) => !prev)}
                                disabled={isDisabled}
                                className={clsx(
                                        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-emerald-50 transition-colors",
                                        isDisabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700",
                                        isOpen && !isDisabled && "text-emerald-700"
                                )}
                        >
                                <span>{cat.label}</span>
                                <ChevronDown className={clsx("text-sm", isOpen && "rotate-180")} />
                        </button>

                        <div
                                className={clsx(
                                        "transition-all ease-out duration-200",
                                        isOpen && !isDisabled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
                                        isMobile ? "w-full" : "absolute left-0 top-full z-50 mt-3"
                                )}
                        >
                                {!isMobile ? (
                                        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 w-80">
                                                <h3 className="text-sm font-semibold text-emerald-800 mb-2">{cat.label}</h3>
                                                {cat.description && <p className="text-xs text-gray-600 mb-3">{cat.description}</p>}

                                                <ul className="space-y-2 text-sm">
                                                        {cat.subcategories?.map((sub) => (
                                                                <li key={sub.id}>
                                                                        <Link to={`/category/${sub.id}`} onClick={() => setIsOpen(false)} className="block hover:text-emerald-700">
                                                                                {sub.label}
                                                                        </Link>
                                                                </li>
                                                        ))}
                                                </ul>
                                                <div className="mt-3">
                                                        <Link to={`/category/${cat.id}`} onClick={() => setIsOpen(false)} className="inline-block text-sm font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded">
                                                                View All {cat.label}
                                                        </Link>
                                                </div>
                                        </div>
                                ) : (
                                        <div className={clsx("rounded-2xl bg-white overflow-hidden transition-[max-height,padding] duration-300 ease-in-out", isOpen ? "max-h-80 mt-2 p-2 space-y-2" : "max-h-0 p-0")}>
                                                <Link to={`/category/${cat.id}`} onClick={() => { setIsOpen(false); closeMenu?.(); }} className="block rounded-md px-4 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700">
                                                        View All {cat.label}
                                                </Link>
                                                {cat.subcategories?.map((sub) => (
                                                        <Link key={sub.id} to={`/${sub.id}`} onClick={() => { setIsOpen(false); closeMenu?.(); }} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50">
                                                                {sub.label}
                                                        </Link>
                                                ))}
                                        </div>
                                )}
                        </div>
                </div>
        );
};

const NavItem = ({ to, label, onClick, exact }) => {
        const isDisabled = label.toLowerCase() === "flowers";
        return (
                <NavLink
                        to={to}
                        end={exact}
                        onClick={isDisabled ? (e) => e.preventDefault() : onClick}
                        className={({ isActive }) =>
                                clsx(
                                        "px-3 py-2 text-sm font-medium rounded",
                                        isDisabled ? "text-gray-400 cursor-not-allowed" : isActive ? "text-emerald-700" : "text-gray-700 hover:text-emerald-700"
                                )
                        }
                >
                        {label}
                </NavLink>
        );
};

/* ========================================================================
   MAIN NAVBAR
   ======================================================================== */
export default function Navbar({ onCartClick, onSigninClick, isMobileSearchOpen, setIsMobileSearchOpen }) {
        const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
        const [showMobileDropdown, setShowMobileDropdown] = useState(false);
        const [showDesktopProfile, setShowDesktopProfile] = useState(false);

        // Refs for click outside
        const mobileMenuContainerRef = useRef(null);
        const mobileDropdownRef = useRef(null);
        const desktopProfileRef = useRef(null);

        const { user, logout, isAuthenticated, loading } = useAuth();
        const navigate = useNavigate();
        const cartItemCount = useCartCount();
        const handleLogout = () => {
                sessionStorage.removeItem("authToken");
                setShowMobileDropdown(false);
                setShowDesktopProfile(false);
                logout();
                navigate('/');
        };

        useClickOutside(mobileMenuContainerRef, () => setIsMobileMenuOpen(false), isMobileMenuOpen);
        useClickOutside(mobileDropdownRef, () => setShowMobileDropdown(false), showMobileDropdown);
        useClickOutside(desktopProfileRef, () => setShowDesktopProfile(false), showDesktopProfile);

        // Scroll Detection To Close search
        useEffect(() => {
                if (!isMobileSearchOpen) return;

                let scrollListener = null;

                const timer = setTimeout(() => {
                        const startScrollY = window.scrollY;

                        scrollListener = () => {
                                if (document.activeElement.tagName === "INPUT") {
                                        return;
                                }

                                if (Math.abs(window.scrollY - startScrollY) > 40) {
                                        setIsMobileSearchOpen(false);
                                }
                        };

                        window.addEventListener("scroll", scrollListener, { passive: true });
                }, 500);

                return () => {
                        clearTimeout(timer);
                        if (scrollListener) {
                                window.removeEventListener("scroll", scrollListener);
                        }
                };
        }, [isMobileSearchOpen, setIsMobileSearchOpen]);


        return (
                <header className="sticky top-0 z-50 bg-white w-full" ref={mobileMenuContainerRef}>
                        <PromoBar />

                        <div className="shadow-sm">
                                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="flex items-center justify-between h-14 lg:h-20 lg:grid lg:grid-cols-3 gap-3 px-2">

                                                {/* --- LEFT SECTION --- */}
                                                {isMobileSearchOpen && (
                                                        <div className="flex w-full items-center gap-3 lg:hidden">
                                                                <div className="flex-1">
                                                                        <SearchMegamenu />
                                                                </div>
                                                                <button onClick={() => setIsMobileSearchOpen(false)} className="text-gray-500 p-2 hover:bg-gray-100 rounded-full">
                                                                        <X size={20} />
                                                                </button>
                                                        </div>
                                                )}

                                                <div className={clsx("flex justify-between items-center gap-3 min-w-0 ", isMobileSearchOpen ? "hidden lg:flex" : "flex")}>
                                                        {/* Mobile menu toggle */}
                                                        <button
                                                                onClick={() => setIsMobileMenuOpen((p) => !p)}
                                                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                                                                className="lg:hidden text-gray-700 hover:text-emerald-600 text-2xl"
                                                        >
                                                                {isMobileMenuOpen ? <X /> : <Menu />}
                                                        </button>

                                                        {/* Logo */}
                                                        <Link to="/" className="flex items-center min-w-0 shrink-0">
                                                                <img src="/images/mvLogo.jpeg" alt="MayaVriksh" className="h-12 min-h-12 w-auto object-contain" />
                                                        </Link>

                                                        {/* Desktop Categories */}
                                                        <nav className="hidden lg:flex items-center gap-3 ml-4">
                                                                {categories.map((cat) =>
                                                                        cat.subcategories?.length ? (
                                                                                <MegaMenu
                                                                                        key={cat.id}
                                                                                        cat={{ ...cat, label: cat.label === "Plants" ? "Plant Categories" : cat.label }}
                                                                                />
                                                                        ) : (
                                                                                <NavItem key={cat.id} to={`/category/${cat.id}`} label={cat.label} />
                                                                        )
                                                                )}

                                                                {/* Desktop Campaigns */}
                                                                <Dropdown
                                                                        label="Campaigns"
                                                                        items={campaignItems}
                                                                        renderItem={({ item, close }) => (
                                                                                <Link
                                                                                        to={`/plants/${item.id}`}
                                                                                        onClick={close}
                                                                                        className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                                                >
                                                                                        {item.label}
                                                                                </Link>
                                                                        )}
                                                                />
                                                        </nav>
                                                </div>

                                                {/* --- CENTER SECTION (Search) --- */}
                                                <div className="hidden lg:flex justify-center w-full">
                                                        <div className="w-full max-w-xl">
                                                                <SearchMegamenu />
                                                        </div>
                                                </div>

                                                {/* --- RIGHT SECTION (Cart, Profile) --- */}
                                                <div className={clsx("flex justify-end items-center gap-4 min-w-0", isMobileSearchOpen ? "hidden lg:flex" : "flex")}>
                                                        <Link to="/track-order" className="hidden lg:flex items-center gap-2 hover:text-emerald-700 cursor-pointer">
                                                                <Truck className="text-lg" />
                                                                <span className="text-sm">Track My Plant</span>
                                                        </Link>

                                                        <button onClick={onCartClick} className="hidden lg:flex items-center gap-2 hover:text-emerald-700 cursor-pointer" aria-label="Open cart">
                                                                <div className="relative">
                                                                        <ShoppingCart className="text-lg" />
                                                                        {cartItemCount > 0 && (
                                                                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                                                                        {cartItemCount}
                                                                                </span>
                                                                        )}
                                                                </div>
                                                                <span className="text-sm">Cart</span>
                                                        </button>

                                                        {/* Desktop Profile */}
                                                        <div className={`hidden lg:block relative mt-1  ${loading && "hidden"}`} ref={desktopProfileRef}>
                                                                {!isAuthenticated ? (
                                                                        <button onClick={onSigninClick} className="inline-flex items-center gap-2 hover:text-emerald-700">
                                                                                <UserCircle className="text-lg" />
                                                                                <span className="text-sm">Sign In</span>
                                                                        </button>
                                                                ) : (
                                                                        <>
                                                                                <button
                                                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-200 ring-1 ring-emerald-300 shadow-sm hover:bg-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                                                                                        onClick={() => setShowDesktopProfile((p) => !p)}
                                                                                >
                                                                                        <User size={18} className="text-emerald-800" />
                                                                                        <span className="text-sm font-semibold text-emerald-800">Hi, {user?.firstName || "User"}</span>
                                                                                        <ChevronDown size={16} className={clsx("text-emerald-800 transition-transform duration-200", showDesktopProfile && "rotate-180")} />
                                                                                </button>

                                                                                {showDesktopProfile && (
                                                                                        <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-emerald-100/30 z-50 p-4 backdrop-blur-sm">
                                                                                                <div className="pb-3 border-b border-gray-200">
                                                                                                        <p className="text-sm font-semibold text-gray-900">{user?.fullName?.firstName} {user?.fullName?.lastName}</p>
                                                                                                        <p className="text-xs text-emerald-600 font-medium mt-1">🌿 Loyalty Points: {user?.loyaltyPoints || 0}</p>
                                                                                                </div>
                                                                                                <UserMenuOptions closeMenu={() => setShowDesktopProfile(false)} handleLogout={handleLogout} />
                                                                                        </div>
                                                                                )}
                                                                        </>
                                                                )}
                                                        </div>

                                                        {/* Mobile Right Icons */}
                                                        <div className={`flex items-center gap-3 lg:hidden ${loading && "hidden"}`}>
                                                                {isAuthenticated ? (
                                                                        <div className="relative" ref={mobileDropdownRef}>
                                                                                <button
                                                                                        data-mobile-profile-button
                                                                                        onClick={() => setShowMobileDropdown((p) => !p)}
                                                                                        className="inline-flex items-center p-1 pr-2 rounded-full hover:bg-emerald-50"
                                                                                >
                                                                                        <div className="h-7 px-2 rounded-full bg-emerald-200 flex items-center justify-center ring-1 ring-emerald-300 max-w-[72px] overflow-hidden min-w-0">
                                                                                                <span className="text-[10px] font-semibold text-emerald-800 truncate">Hi, {user?.firstName || "User"}</span>
                                                                                        </div>
                                                                                </button>

                                                                                {showMobileDropdown && (
                                                                                        <div className="absolute right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg shadow-emerald-100/40 z-50 w-56 p-4">
                                                                                                <div className="p-2 text-emerald-700 font-medium border-b border-gray-100 mb-2">
                                                                                                        <span className="text-sm">🌿 Points: {user?.loyaltyPoints || 0}</span>
                                                                                                </div>
                                                                                                <UserMenuOptions closeMenu={() => setShowMobileDropdown(false)} handleLogout={handleLogout} />
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                ) : (
                                                                        <button onClick={onSigninClick} className="inline-flex items-center gap-2 hover:text-emerald-700">
                                                                                <User className="text-2xl" />
                                                                        </button>
                                                                )}

                                                                <button onClick={onCartClick} className="flex items-center justify-center hover:text-emerald-700" aria-label="Open cart">
                                                                        <div className="relative">
                                                                                <ShoppingCart className="text-xl" />
                                                                                {cartItemCount > 0 && (
                                                                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                                                                                {cartItemCount}
                                                                                        </span>
                                                                                )}
                                                                        </div>
                                                                </button>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* MOBILE DRAWER */}
                                        <div className={clsx(
                                                "lg:hidden bg-white border-t border-gray-100 shadow-2xl transition-all duration-300 ease-out absolute left-0 right-0 z-[60]",
                                                isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"
                                        )}>
                                                <div className="space-y-4 px-4 py-6 sm:px-6">
                                                        <Dropdown
                                                                label="Plant Categories"
                                                                items={categories[0]?.subcategories || []}
                                                                renderItem={({ item, close }) => (
                                                                        <Link
                                                                                to={`category/${item.id}`}
                                                                                onClick={() => { setIsMobileMenuOpen(false); close(); }}
                                                                                className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                                        >
                                                                                {item.label}
                                                                        </Link>
                                                                )}
                                                        />

                                                        <div className="pt-3 border-t border-gray-100">
                                                                <Dropdown
                                                                        label="Campaigns"
                                                                        items={campaignItems}
                                                                        renderItem={({ item, close }) => (
                                                                                <Link
                                                                                        to={`/plants/${item.id}`}
                                                                                        onClick={() => { setIsMobileMenuOpen(false); close(); }}
                                                                                        className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                                                >
                                                                                        {item.label}
                                                                                </Link>
                                                                        )}
                                                                />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                        <PincodePopup />
                </header>
        );
}