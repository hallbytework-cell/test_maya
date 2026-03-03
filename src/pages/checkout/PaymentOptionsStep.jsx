import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Banknote, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  createCustomerOrder,
  verifyOrderPayment,
  calculateShippingPreview,
} from "@/api/customer/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  clearDirectCheckoutItem,
  clearGuestCart,
} from "@/redux/slices/cartSlice";
import { OrderProcessingAnimation } from "@/components/OrderProcessingAnimation";
import { useAuth } from "@/context/AuthContext";
import { useCartSync } from "@/hooks/useCartSync";
import PriceSummary from "./PriceSummary";
import { useNavigate } from "react-router-dom";
import { useLoyaltySync } from "@/hooks/useLoyaltySync";

export default function PaymentOptionsStep({
  total = 0,
  onComplete,
  cartItemIds,
  userData,
  checkoutMode = "cart",
  directItem = null,
  loyaltyPoint = 0,
  setPromoCodeId,
  setLoyaltyPoint,
  isDeliveryFeeCalculated,
  setIsDeliveryFeeCalculated,
  setCouponAmount,
  setDeliveryFee,
  finalAmount,
  loyaltyPointUsed,
  setLoyaltyPointUsed,
  shippingLoading,
  setShippingLoading,
  shippingData,
  setShippingData,
  manualCode,
  setManualCode,
  setManualPromoId,
  setManualCouponAmount,
  manualCouponAmount,
  manualPromoId,
  appliedCoupon,
  setAppliedCoupon,
  appliedManualCodeName,
  setAppliedManualCodeName,
}) {
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [isVerifying, setIsVerifying] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuth();
  const { syncCart } = useCartSync();
  const { syncLoyalty } = useLoyaltySync();

  /* ---------------- Shipping Fee Sync ---------------- */
  useEffect(() => {
    setDeliveryFee(shippingData?.shippingCharge || 0);
  }, [shippingData, setDeliveryFee]);

  /* ---------------- Shipping Preview ---------------- */
  useEffect(() => {
    const fetchShippingPreview = async () => {
      const payloadIds =
        checkoutMode === "direct" && directItem
          ? [directItem.productVariantId]
          : Array.isArray(cartItemIds)
          ? cartItemIds
          : [cartItemIds];

      if (!userData?.addressId || payloadIds.length === 0) return;

      setShippingLoading(true);
      try {
        const response = await calculateShippingPreview({
          cartItemIds: payloadIds,
          addressId: userData.addressId,
          isCod: selectedMethod === "COD",
        });

        if (response?.success && response?.data?.pricing) {
          setShippingData({
            shippingCharge: Number(response.data.pricing.shippingCharge) || 0,
            autoDiscount: Number(response.data.pricing.discountAmount) || 0,
            autoCoupons: response.data.autoCoupons || [],
            messages: response.data.messages || [],
          });
        }
      } catch (err) {
        console.error("Shipping calc failed", err);
      } finally {
        setShippingLoading(false);
        setIsDeliveryFeeCalculated(true);
      }
    };

    fetchShippingPreview();
  }, [
    selectedMethod,
    userData?.addressId,
    cartItemIds,
    directItem,
    checkoutMode,
  ]);

  /* ---------------- Helpers ---------------- */
  const syncStateAfterOrder = useCallback(async () => {
    sessionStorage.removeItem("guestCartIds");
    await queryClient.invalidateQueries({ queryKey: ["cart-data", user.id] });
    await queryClient.invalidateQueries({ queryKey: ["cart-data"] });
    dispatch(clearGuestCart());
    dispatch(clearDirectCheckoutItem());
  }, [dispatch, queryClient, user.id]);

  const handleOrderSuccess = async (order) => {
    toast.success("Order placed successfully!");
    await syncStateAfterOrder();
    await syncCart();
    await syncLoyalty();
    onComplete(order);
  };

  /* ---------------- Razorpay ---------------- */
  const openRazorpayWindow = (payment, order) => {
    if (!window.Razorpay) {
      toast.error("Payment system not loaded");
      return;
    }

    const rzp = new window.Razorpay({
      key: payment.key,
      amount: payment.amount,
      currency: payment.currency,
      order_id: payment.razorpayOrderId,
      name: "MayaVriksh",
      description: "Buy live plants & garden essentials",
      handler: async (response) => {
        setIsVerifying(true);
        try {
          await verifyOrderPayment(order.id, {
            paymentMethod: "RAZORPAY",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
          await handleOrderSuccess(order);
        } catch {
          toast.error("Payment verification failed");
        } finally {
          setIsVerifying(false);
        }
      },
      modal: {
        ondismiss: async () => {
          toast.error("Payment cancelled");
          await syncStateAfterOrder();
          navigate("/", { replace: true });
        },
      },
      theme: { color: "#9D41FE" },
    });

    rzp.open();
  };

  /* ---------------- Create Order ---------------- */
  const createOrderMutation = useMutation({
    mutationFn: createCustomerOrder,
    onSuccess: async ({ data }) => {
      const { order, payment } = data;
      if (!payment) return handleOrderSuccess(order);
      openRazorpayWindow(payment, order);
    },
    onError: (err) => {
      toast.error(err?.message || "Order failed");
    },
  });

  const handlePlaceOrder = () => {
    if (!userData?.addressId) {
      toast.error("Delivery address missing");
      return;
    }

    const promoCodeIds = [];
    if (appliedCoupon?.couponId) promoCodeIds.push(appliedCoupon.couponId);
    if (manualPromoId) promoCodeIds.push(manualPromoId);

    const payload = {
      billingAddressId: userData.addressId,
      shippingAddressId: userData.addressId,
      isShippingEqualsBilling: true,
      paymentMethod: selectedMethod,
      promoCodeIds,
      useLoyaltyPoints: loyaltyPoint,
    };

    if (checkoutMode === "direct" && directItem) {
      payload.items = [
        {
          plantVariantId: directItem.productVariantId,
          potVariantId: directItem.potVariantId,
          quantity: directItem.quantity,
        },
      ];
    } else {
      payload.cartItemIds = Array.isArray(cartItemIds)
        ? cartItemIds
        : [cartItemIds];
    }

    createOrderMutation.mutate(payload);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
        {/* COD */}
        <Card
          className={selectedMethod === "COD" ? "border-emerald-600 border-2" : ""}
          onClick={() => setSelectedMethod("COD")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <RadioGroupItem value="COD" />
            <Banknote className="text-emerald-600" />
            <span className="font-semibold">Cash on Delivery</span>
            {selectedMethod === "COD" && (
              <CheckCircle className="ml-auto text-emerald-600" />
            )}
          </CardContent>
        </Card>

        {/* Razorpay */}
        <Card
          className={
            selectedMethod === "RAZORPAY"
              ? "border-emerald-600 border-2"
              : ""
          }
          onClick={() => setSelectedMethod("RAZORPAY")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <RadioGroupItem value="RAZORPAY" />
            <CreditCard className="text-emerald-600" />
            <span className="font-semibold">Razorpay</span>
            {selectedMethod === "RAZORPAY" && (
              <CheckCircle className="ml-auto text-emerald-600" />
            )}
          </CardContent>
        </Card>
      </RadioGroup>

      <Button
        onClick={handlePlaceOrder}
        disabled={createOrderMutation.isPending || shippingLoading}
        className="w-full h-12 text-lg"
      >
        {createOrderMutation.isPending ? (
          <>
            <Loader2 className="mr-2 animate-spin" /> Processing
          </>
        ) : (
          "PLACE ORDER"
        )}
      </Button>

      {(createOrderMutation.isPending || isVerifying) && (
        <OrderProcessingAnimation isProcessing />
      )}
    </div>
  );
}
