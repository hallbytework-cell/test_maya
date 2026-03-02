import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addCartItems } from "@/api/customer/cart";
import { useAuth } from "@/context/AuthContext";
import { useDispatch } from "react-redux";

export const usePostLoginFlow = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const dispatch = useDispatch();

    const mergeCartMutation = useMutation({
        mutationFn: async (guestItemsToMerge) => {
            const items = guestItemsToMerge.map((item) => ({
                plantVariantId: item.id || item.plantVariantId,
                potVariantId: item.potVariantId,
                quantity: item.quantity,
            }));

            const payload = { items: [...items] };
            return await addCartItems(payload);
        },
        onError: (error) => {
            toast.error("Logged in, but failed to merge previous cart items.");
        },
    });

    const handleLoginSuccess = async (user, guestCartItems = []) => {
        try {
            const loginRes = await login(user?.accessToken);

            if (guestCartItems && guestCartItems.length > 0) {
                await mergeCartMutation.mutateAsync(guestCartItems);

                await queryClient.invalidateQueries({
                    queryKey: ["cart-data", user.id],
                });
                toast.success("Cart items merged successfully!");
            } else {
                await queryClient.invalidateQueries({
                    queryKey: ["cart-data", user.id],
                });
            }

            navigate("/");
            toast.success(loginRes?.message ?? "Welcome back!");

        } catch (error) {
            console.error("Post-login flow error", error);
            navigate("/");
        }
    };

    return {
        handleLoginSuccess,
        isProcessing: mergeCartMutation.isPending,
    };
};