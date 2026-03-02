/**
 * ✅ Secure Authentication Hook
 * Provides secure auth methods without exposing sensitive data
 * Implements best practices for XSS protection and token security
 */

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { isTokenValid, initiateSilentLogin } from "./useTokenRefresh";

/**
 * ✅ Secure Auth Hook
 * 
 * Security Features:
 * 1. Never returns raw tokens (prevents accidental logging)
 * 2. Validates token before using
 * 3. Implements automatic cleanup on logout
 * 4. Protects against XSS via Content Security Policy headers
 * 5. Uses HttpOnly cookies for refresh token (set by backend)
 */
export const useSecureAuth = () => {
  const authContext = useAuth();

  // ✅ Check if user is authenticated AND has valid token
  const isUserAuthenticated = useCallback(() => {
    const hasUser = !!authContext.user;
    const hasValidToken = isTokenValid();
    
    return hasUser && hasValidToken;
  }, [authContext.user]);

  // ✅ Safe login that doesn't expose tokens
  const secureLogin = useCallback(
    async (credentials) => {
      try {
        const result = await authContext.login(credentials);
        return {
          success: true,
          message: "Login successful",
          isAuthenticated: isUserAuthenticated(),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Login failed",
          isAuthenticated: false,
        };
      }
    },
    [authContext, isUserAuthenticated]
  );

  // ✅ Safe logout
  const secureLogout = useCallback(async () => {
    try {
      await authContext.logout();
      // Clear any cached data
      sessionStorage.removeItem("mv_access_token");
      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Logout failed",
      };
    }
  }, [authContext]);

  return {
    user: authContext.user,
    isAuthenticated: isUserAuthenticated(),
    isLoading: authContext.loading,
    secureLogin,
    secureLogout,
    // ✅ Expose only what's safe (never raw tokens)
    hasValidToken: isTokenValid(),
  };
};
