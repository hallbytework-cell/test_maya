import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import api from "../config/axiosConfig"; // Ensure this points to your new Axios Config
import logger from "@/lib/logger";
import { clearGuestCart, clearUserCart, setUserCartItems } from "@/redux/slices/cartSlice";
import { transformCartData } from "@/utils/cartHelper";
import { addCartItems } from "@/api/customer/cart";
import { getCustomerProfile } from "@/api/auth/auth";

const AuthContext = createContext({});

// Allows Axios interceptors to update React state without circular dependencies
let externalSetUser = null;

const registerExternalSetUser = (setUserFunc) => {
        externalSetUser = setUserFunc;
        logger.debug("externalSetUser registered");
};

export const setUserProfileInformations = () => {
        if (!externalSetUser) return;

        const accessToken = sessionStorage.getItem("mv_access_token");

        if (!accessToken) {
                externalSetUser(null);
                return;
        }

        try {
                const profile = jwtDecode(accessToken);
                const userInitial = profile.fullName?.FIRST_NAME
                        ? profile.fullName.FIRST_NAME[0]
                        : "Guest";

                externalSetUser((prev) => ({
                        ...prev,
                        userId: profile.userId,
                        username: profile.fullName?.FIRST_NAME || profile.username,
                        role: profile.role,
                        isVerified: profile.isVerified || false,
                        fullName: profile?.fullName?.firstName ? (profile.fullName.firstName + " " + profile.fullName.lastName) : prev?.fullName,
                        firstName: profile?.fullName?.firstName || prev?.firstName,
                        profileImageUrl:
                                profile.profileImageUrl ||
                                prev?.profileImageUrl ||
                                `https://ui-avatars.com/api/?name=${userInitial}&background=random`,
                }));
                logger.debug("User state updated from access token");
        } catch (error) {
                logger.error("Failed to decode token during profile update", error);
                externalSetUser(null);
        }
};

export const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);
        const dispatch = useDispatch();
        const guestCartItems = useSelector((state) => state.persisted?.cart?.guestCartItems) || [];

        const syncUserCart = useCallback(async () => {
                try {
                        logger.debug("Syncing user cart with server...");
                        const res = await api.get("/cart-items");

                        const rawData = res.data?.data || res.data;

                        if (rawData) {
                                const formattedCartItems = transformCartData(rawData);
                                dispatch(setUserCartItems(formattedCartItems));
                                logger.debug("Cart synchronized successfully");
                        }
                } catch (error) {
                        logger.error("Failed to sync cart items:", error);
                        if (error.response?.status === 401) {
                                dispatch(clearUserCart());
                        }
                }
        }, [dispatch]);

        const fetchAndUpdateProfile = useCallback(async () => {
                try {
                        logger.debug("Fetching latest user profile from server...");
                        const response = await getCustomerProfile(); //
                        const profile = response.data;

                        if (profile) {
                                setUser(prev => ({
                                        ...prev,
                                        firstName: profile?.fullName?.firstName,
                                        lastName: profile?.fullName?.lastName,
                                        fullName: `${profile.fullName?.firstName} ${profile.fullName?.lastName}`,
                                        email: profile?.email,
                                        phoneNumber: profile?.phoneNumber,
                                        profileImageUrl: profile?.profileImageUrl || prev?.profileImageUrl,
                                        loyaltyPoints: profile?.loyaltyPoints,
                                        loyaltyTier: profile?.loyaltyTier,
                                        userId: prev?.userId,
                                        role: prev?.role
                                }));
                                logger.debug("User profile hydrated with server data");
                        }
                } catch (error) {
                        logger.error("Failed to fetch server profile:", error);
                }
        }, []);

        // 1. Register the external setter on mount
        useEffect(() => {
                registerExternalSetUser(setUser);
        }, []);

        // 2. HELPER: Logout Logic
        const logout = useCallback(async () => {
                try {
                        await api.post("/auth/logout");
                } catch (e) {
                        logger.warn("Server logout failed (likely already invalid)", e);
                }

                // Clear client state
                sessionStorage.removeItem("mv_access_token");
                dispatch(clearGuestCart());
                dispatch(clearUserCart());
                setUser(null);
                logger.debug("User logged out and session cleared");

                // window.location.href = "/login"; 
        }, [dispatch]);

        // 3. HELPER: Verify Session Integrity (The Fix for "Blind Trust")
        // This calls a protected endpoint to ensure the token signature and 
        // refresh token (cookie) are actually valid on the server. 
        const verifySessionIntegrity = async () => {
                try {
                        const res = await api.post("auth/refresh-token");
                        sessionStorage.setItem("mv_access_token", res.data.data.accessToken);
                        await fetchAndUpdateProfile();
                        await syncUserCart();
                } catch (error) {
                        logger.warn("Server handshake failed: Session invalid");

                }
        };

        // 4. EFFECT: Initialize Auth (Run once on mount)
        useEffect(() => {
                const initAuth = async () => {
                        const token = sessionStorage.getItem("mv_access_token");
                        let isLocallyValid = false;

                        // Check if token exists and isn't expired (Time check only)
                        if (token) {
                                try {
                                        const decoded = jwtDecode(token);
                                        const currentTime = Math.floor(Date.now() / 1000);
                                        // Add a small buffer (e.g., 60 seconds)
                                        if (decoded.exp > currentTime) {
                                                isLocallyValid = true;
                                        }
                                } catch (e) {
                                        isLocallyValid = false;
                                }
                        }

                        if (isLocallyValid) {
                                // A. Optimistic Update: Make UI ready immediately
                                logger.debug("Token valid locally, initializing UI...");
                                setUserProfileInformations();
                                await fetchAndUpdateProfile();
                                await syncUserCart();
                        } else {
                                // C. Token missing or expired: Try to get a new one via cookies
                                logger.debug("Token missing or expired, attempting silent refresh...");
                                await refreshUser();
                        }

                        setLoading(false);
                };

                initAuth();
        }, []);

        useEffect(() => {
                const handleForceLogout = () => {
                        logger.debug("Received 'auth:logout' event from Axios Interceptor");
                        logout();
                };

                window.addEventListener("auth:logout", handleForceLogout);
                return () => window.removeEventListener("auth:logout", handleForceLogout);
        }, [logout]);


        const login = async (res) => {
                try {
                        sessionStorage.setItem("mv_access_token", res?.data?.accessToken);
                        setUserProfileInformations();


                        let mergedIds = [];

                        if (guestCartItems.length > 0) {
                                const itemsToMerge = guestCartItems.map(item => ({
                                        plantVariantId: item.plantVariantId || item.id,
                                        potVariantId: item.potVariantId,
                                        quantity: item.quantity,
                                }));
                                const mergeResponse = await addCartItems({ items: itemsToMerge });
                                if (mergeResponse?.data) {
                                        mergedIds = mergeResponse.data.map(item => item.cartItemId);
                                }
                                dispatch(clearGuestCart());
                        }

                        await verifySessionIntegrity(); // Just to verify token - may remove this call in future

                        return {
                                ...res,
                                mergedCartItemIds: mergedIds,
                        }
                } catch (e) {
                        logger.error("Login context error", e);
                        throw e;
                }
        };

        const refreshUser = async () => {
                try {
                        const res = await api.post("auth/refresh-token");
                        sessionStorage.setItem("mv_access_token", res.data.data.accessToken);
                        await fetchAndUpdateProfile();
                        await syncUserCart();
                        setUserProfileInformations();
                        logger.debug("Silent login successful");
                        return true;
                } catch (error) {
                        logger.error("Failed to refresh user state", error);
                        sessionStorage.removeItem("mv_access_token");
                        setUser(null);
                        logout();
                        return false;
                }
        };

        const value = {
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshUser,
                setUserProfileInformations,
                fetchAndUpdateProfile
        };

        return (
                <AuthContext.Provider value={value}>
                        {children}
                </AuthContext.Provider>
        );
};

export const useAuth = () => {
        return useContext(AuthContext);
};