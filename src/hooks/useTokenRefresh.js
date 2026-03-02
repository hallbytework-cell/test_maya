import { useEffect, useRef, useState } from "react";
import api from "@/config/axiosConfig";
import { jwtDecode } from "jwt-decode";
import logger from "@/lib/logger";

export const isTokenValid = () => {
  try {
    const token = sessionStorage.getItem("mv_access_token");
    
    if (!token) {
      return false;
    }

    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const BUFFER_TIME = 5 * 60;
    const isValid = expiryTime > (currentTime + BUFFER_TIME);
    
    return isValid;
  } catch (error) {
    logger.error("Error validating token", error);
    return false;
  }
};

export const getTokenExpiryIn = () => {
  try {
    const token = sessionStorage.getItem("mv_access_token");
    if (!token) return 0;

    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    
    return Math.max(0, expiryTime - currentTime);
  } catch {
    return 0;
  }
};

let refreshPromise = null;
let isRefreshingToken = false;

const queuedRefreshToken = async () => {
  if (isRefreshingToken && refreshPromise) {
    logger.debug("Refresh already in progress, waiting for existing call...");
    return refreshPromise;
  }

  isRefreshingToken = true;
  
  refreshPromise = api
    .post("/auth/refresh-token")
    .then((res) => {
      logger.debug("Token refreshed successfully");
      sessionStorage.setItem("mv_access_token",res.data.data.accessToken);
      return res.data.data.accessToken;
    })
    .catch((error) => {
      logger.error("Token refresh failed", error);
      throw error;
    })
    .finally(() => {
      isRefreshingToken = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

export const useTokenRefresh = (onTokenRefreshed = null, onRefreshFailed = null) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasRunRef = useRef(false);

  const refreshTokenIfNeeded = async () => {
    try {
      if (isTokenValid()) {
        const expiryIn = getTokenExpiryIn();
        logger.debug(`Token still valid for ${expiryIn} more seconds, skipping refresh`);
        return;
      }

      logger.debug("Token invalid, refreshing...");
      setIsRefreshing(true);

      const newToken = await queuedRefreshToken();
      
      logger.debug("User silently re-authenticated");
      onTokenRefreshed?.(newToken);
      
    } catch (error) {
      logger.error("Failed to refresh token", error);
      onRefreshFailed?.(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    refreshTokenIfNeeded,
    isRefreshing,
    isTokenValid: isTokenValid(),
    expiryIn: getTokenExpiryIn(),
  };
};

export const initiateSilentLogin = async (onSuccess, onFailure) => {
  try {
    if (isTokenValid()) {
      logger.debug("Valid token found, user is already authenticated");
      onSuccess?.();
      return true;
    }

    logger.debug("No valid token found, attempting silent refresh...");
    const newToken = await queuedRefreshToken();
    logger.debug("Silent login successful");
    onSuccess?.(newToken);
    return true;
    
  } catch (error) {
    logger.debug("Silent login failed (expected for new users)");
    onFailure?.(error);
    return false;
  }
};