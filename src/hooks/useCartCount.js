// src/hooks/useCartCount.js
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";

export const useCartCount = () => {
  const { user, isAuthenticated } = useAuth();
  
  const guestCartItems = useSelector((state) => state.persisted?.cart?.guestCartItems) || [];
  const userCartItems = useSelector((state) => state.persisted?.cart?.userCartItems) || [];

  const cartItemCount = useMemo(() => {
    const items = isAuthenticated ? userCartItems : guestCartItems;
    
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [isAuthenticated, guestCartItems, userCartItems]);

  return cartItemCount;
};