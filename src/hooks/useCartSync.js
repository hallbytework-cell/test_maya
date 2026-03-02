// src/hooks/useCartSync.js
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { getCartItems } from "@/api/customer/cart";
import { 
  setUserCartItems, 
  clearGuestCart, 
  clearDirectCheckoutItem 
} from "@/redux/slices/cartSlice";
import { transformCartData } from "@/utils/cartHelper";
import { useAuth } from "@/context/AuthContext";

export const useCartSync = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const syncCart = useCallback(async () => {
    try {
 
      const response = await getCartItems();
      const rawData = response?.data || [];
      
      const formattedItems = transformCartData(rawData);
      
      dispatch(setUserCartItems(formattedItems));
      dispatch(clearGuestCart());
      dispatch(clearDirectCheckoutItem());

      queryClient.setQueryData(["cart-data", user?.id], rawData);
      queryClient.invalidateQueries({ queryKey: ["cart-data"] });
      
      return { success: true, data: formattedItems };
    } catch (error) {
      console.error("Cart Sync Error:", error);
      return { success: false, error };
    }
  }, [dispatch, queryClient, user?.id]);

  return { syncCart };
};