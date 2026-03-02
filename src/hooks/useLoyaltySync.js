// src/hooks/useLoyaltySync.js
import { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export const useLoyaltySync = () => {
  const { fetchAndUpdateProfile, user } = useAuth();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);

  const syncLoyalty = useCallback(async () => {
    setIsSyncing(true);
    try {
      await fetchAndUpdateProfile();

      if (user?.userId) {
        queryClient.invalidateQueries({ queryKey: ["customer-profile", user.userId] });
      }

      return { success: true };
    } catch (error) {
      console.error("Loyalty Sync Error:", error);
      return { success: false, error };
    } finally {
      setIsSyncing(false);
    }
  }, [fetchAndUpdateProfile, queryClient, user?.userId]);

  return { syncLoyalty, isSyncing };
};