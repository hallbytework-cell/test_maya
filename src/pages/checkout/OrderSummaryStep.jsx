import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCartItem,
} from "@/api/customer/cart";
import toast from "react-hot-toast";
import PriceSummary from "./PriceSummary";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { formatLabel } from "@/utils/utils";

const usePendingUpdates = () => {
  const [pendingIds, setPendingIds] = useState(new Set());
  const addPending = (id) => setPendingIds((prev) => new Set(prev).add(id));
  const removePending = (id) =>
    setPendingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  return { pendingIds, addPending, removePending };
};

const LoadingIndicator = () => (
  <div className="flex justify-center items-center py-8 text-lg text-gray-500">
    Loading cart...
  </div>
);

const ErrorIndicator = () => (
  <div className="flex justify-center items-center py-8 text-lg text-red-500">
    Error fetching cart items. Please try again.
  </div>
);

export default function OrderSummaryStep({
  onComplete,
  checkoutMode,
  selectedCartItemIds = [],
  setSelectedCartItemIds,
  allCartItems,
  isLoading,
  isError,
  setTotalItemPrice,
  setShouldRecalculate,
}) {
  const [useRewards, setUseRewards] = useState(false);
  const { pendingIds, addPending, removePending } = usePendingUpdates();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [showCheckBox, setShowCheckbox] = useState(false)
  const [visibleCartItems, setVisibleCartItems] = useState([])
  const [disableDelete, setDisableDelete] = useState(true);

  useEffect(() => {
    if (visibleCartItems.length === 0 && allCartItems.length !== 0) {
      let filteredVisibleItemIds = [], filteredVisibleItems = [];
      if (checkoutMode === "direct") {
        filteredVisibleItems = allCartItems.filter(items => items.id === selectedCartItemIds[0])
        filteredVisibleItemIds = filteredVisibleItems.map(items => items.id);

      } else if (checkoutMode === "cart") {
        filteredVisibleItems = allCartItems.filter(items => selectedCartItemIds.includes(items.id))
        filteredVisibleItemIds = filteredVisibleItems.map(items => items.id);
      } else if (checkoutMode === "guest-cart") {
        filteredVisibleItems = allCartItems;
        filteredVisibleItemIds = allCartItems.filter(items => selectedCartItemIds.includes(items.id)).map(items => items.id);
        setShowCheckbox(true)
      }
      setSelectedCartItemIds(filteredVisibleItemIds)
      setVisibleCartItems(filteredVisibleItems)
    }
  }, [allCartItems, checkoutMode]);

  useEffect(() => {
    setDisableDelete(selectedCartItemIds.length == 1);
  }, [selectedCartItemIds])


  // 2. MUTATION FOR UPDATING QUANTITY
  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => {
      const payload = { quantity };
      return updateCartItem(id, payload);
    },
    onMutate: async ({ id, quantity }) => {
      addPending(id);
      await queryClient.cancelQueries({ queryKey: ["cart-data"] });
      const previousCart = queryClient.getQueryData(["cart-data"]);
      queryClient.setQueryData(["cart-data", user?.id], (old) =>
        old?.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
      return { previousCart, id, quantity };
    },
    onSuccess: (data, variables, context) => {
      toast.success("Cart updated successfully. ✅");
      setVisibleCartItems(prevItems => {
        return prevItems.map(item => {
          if (item.id === variables.id) {
            return { ...item, quantity: variables.quantity }
          }
          return item
        })
      })
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart-data"], context.previousCart);
      }
      toast.error("Failed to update cart. Please try again. ⚠️");
    },
    onSettled: (data, error, variables, context) => {
      removePending(variables.id);
      queryClient.invalidateQueries({ queryKey: ["cart-data"] });
    },
  });

  // Action handlers
  const updateQuantity = (item, delta) => {
    if (item.isDirect) {
      toast.error("Cannot change quantity for Buy Now items.");
      return;
    }
    setShouldRecalculate(true);
    const newQuantity = Math.max(1, item.quantity + delta);
    if (newQuantity !== item.quantity) {
      updateMutation.mutate({ id: item.id, quantity: newQuantity });
    }
  };

  const removeItem = (item) => {
    if (item.isDirect) {
      toast.error("Cannot remove Buy Now item here.");
      return;
    }
    setShouldRecalculate(true);
    setVisibleCartItems(prevItems => prevItems.filter(i => i.id !== item.id))
    setSelectedCartItemIds(prevState =>
      prevState.filter(id => id !== item.id)
    );
  };

  const handleToggleSelection = (itemId) => {
    setSelectedCartItemIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId);
      } else {
        newSelection.add(itemId);
      }
      return [...newSelection];
    });
  };

  const handleContinue = () => {
    onComplete();
  };

  const selectedItems = allCartItems.filter((item) =>
    selectedCartItemIds.includes(item.id),
  );

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 500 ? 0 : 0;
  const discount = useRewards ? 50 : 0;
  const total = subtotal > 0 ? subtotal + deliveryFee - discount : 0;

  useEffect(() => {
    const visibleItemsOnly = allCartItems.filter(item =>
      selectedCartItemIds.includes(item.id) &&
      visibleCartItems.some(v => v.id === item.id)
    );

    const subtotal = visibleItemsOnly.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTotalItemPrice(subtotal);
  }, [selectedCartItemIds, allCartItems, visibleCartItems]);

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorIndicator />;
  if (allCartItems.length === 0)
    return (
      <div className="p-8 text-center text-gray-500">
        No items selected for checkout.
      </div>
    );

  return (
    <div className="space-y-4 sm:space-y-6 rounded-lg border-gray-200 shadow-sm  overflow-hidden">
      <div className="space-y-4">
        {visibleCartItems.map((item) => {
          const isPending = pendingIds.has(item.id);
          const isSelected = selectedCartItemIds.includes(item.id);

          return (
            <Card
              key={item.id}
              className={`pt-6 md:pt-0 ${isPending ? "opacity-70 transition-opacity" : ""} ${!isSelected ? "bg-gray-50 opacity-70" : "bg-white"}`}
            >
              <CardContent className="p-0 md:p-3 flex flex-col ">
                <div className="flex gap-3 sm:gap-2 flex-1 ">
                  {/* CHECKBOX */}
                  {showCheckBox && <div className="flex-shrink-0 flex items-center justify-center pl-4 pr-1 md:pl-2">
                    <Checkbox
                      id={`select-${item.id}`}
                      checked={isSelected}
                      onCheckedChange={() => handleToggleSelection(item.id)}
                      className="w-5 h-5 data-[state=checked]:bg-orange-200 data-[state=checked]:border-pink-600"
                    />
                  </div>}

                  {/* IMAGE */}
                  <div className="flex-shrink-0 w-28 h-36 md:h-28 bg-gray-100 rounded-md overflow-hidden border-2 border-gray-400  ">
                    <img
                      src={item.plantImage}
                      alt={item.name}
                      className="w-full h-full object-cover "
                      data-testid={`img-product-${item.id}`}
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[1fr_1fr] md:gap-4 ">
                    <div className="flex flex-col justify-start ">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <h3
                            className="text-sm font-bold md:text-base line-clamp-2"
                            style={{ color: "#333333" }}
                            data-testid={`text-product-name-${item.id}`}
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            Plant:{" "}
                            <span className="font-medium">
                              <strong>{formatLabel(item.plantSize)}</strong> -
                            </span>
                            <span
                              className="inline-block w-3 h-3 ml-1 align-middle rounded-full border-2 border-gray-400  shadow-md transition-transform hover:scale-110"
                              style={{ backgroundColor: item.plantColorHex }}
                              title={`Color: ${item.plantColor}`}
                            />
                          </p>
                          <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                            <span className="font-medium">
                              Pot: <strong>{formatLabel(item.potInfo.potType)}</strong> -
                            </span>
                            <span
                              className="inline-block w-3 h-3 ml-1 align-middle rounded-full border-2 border-gray-400  shadow-md transition-transform hover:scale-110"
                              style={{ backgroundColor: item.potInfo.potColorHex }}
                              title={`Color: ${item.potInfo.potColor}`}
                            />
                          </p>
                        </div>

                        <p
                          className="hidden md:block text-lg font-bold text-gray-900 md:hidden"
                          data-testid={`text-product-price-mobile-top-${item.id}`}
                        >
                          ₹{item.price}
                        </p>
                      </div>

                      <div className="flex items-center mt-1 md:mt-3 gap-2 md:gap-4">
                        <div className="flex items-center border border-gray-300 rounded-md h-9 sm:h-10">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-full w-9 sm:w-10 rounded-r-none hover:bg-gray-50"
                            onClick={() => updateQuantity(item, -1)}
                            disabled={item.quantity <= 1 || isPending}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span
                            className="px-3 sm:px-4 font-bold text-sm sm:text-base text-gray-800"
                            data-testid={`text-quantity-${item.id}`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-full w-9 sm:w-10 rounded-l-none hover:bg-gray-50"
                            onClick={() => updateQuantity(item, 1)}
                            disabled={isPending}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item)}
                          className={`h-9 w-9 text-red-500 hover:bg-red-50 ${disableDelete ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          data-testid={`button-remove-${item.id}`}
                          disabled={disableDelete}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                        {isPending && (
                          <span className="text-xs text-blue-500">
                            Updating...
                          </span>
                        )}
                      </div>

                      <p
                        className="text-lg font-bold text-gray-900 mt-0 md:mt-2 md:hidden"
                        data-testid={`text-product-price-mobile-bottom-${item.id}`}
                      >
                        ₹{item.price}
                      </p>
                    </div>

                    <div className="hidden md:flex flex-col items-end justify-start pt-1 ">
                      <p
                        className="text-lg font-bold text-gray-900 mb-6"
                        data-testid={`text-product-price-desktop-right-${item.id}`}
                      >
                        ₹{item.price}
                      </p>

                      <div className="space-y-2 text-gray-600  ">
                        <p className="flex items-center gap-2 text-xs md:text-base">
                          <Truck className="w-4 h-4 text-gray-500" />
                          Delivery by{" "}
                          <span
                            className="md:font-semibold"
                            style={{ color: "#00A859" }}
                          >
                            {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

               
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* === PRICE DETAILS === */}

      {/* <div className="block lg:hidden">
        <PriceSummary subtotal={total} setFinalAmount={setFinalAmount} setPromoCodeId={setPromoCodeId} />
      </div> */}

      <Button
        className={`w-full bg-[#00a83e] text-white hover:bg-[#008f33]`}
        size="lg"
        onClick={handleContinue}
        data-testid="button-continue-payment"
        disabled={isLoading || isError || selectedCartItemIds.size === 0}
      >
        CONTINUE
      </Button>
    </div>
  );
}
