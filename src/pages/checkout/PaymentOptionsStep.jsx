import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Banknote, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { createCustomerOrder, verifyOrderPayment, calculateShippingPreview } from "@/api/customer/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clearDirectCheckoutItem, clearGuestCart } from "@/redux/slices/cartSlice";
import { OrderProcessingAnimation } from "@/components/OrderProcessingAnimation";
import { useAuth } from "@/context/AuthContext";
import { useCartSync } from "@/hooks/useCartSync";
import PriceSummary from "./PriceSummary";
import { useNavigate } from "react-router-dom";
import { useLoyaltySync } from "@/hooks/useLoyaltySync";

export default function PaymentOptionsStep({
  total = 0, // This is the Item Subtotal passed from parent
  onComplete,
  cartItemIds,
  userData,
  checkoutMode = "cart",
  directItem = null,
<<<<<<< HEAD
=======
  promoCodeId,
>>>>>>> 048fdb4 (Initial commit from dev-akash)
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
<<<<<<< HEAD
  selectedMethod,
  setSelectedMethod
}) {
  // const [selectedMethod, setSelectedMethod] = useState("COD");
=======
}) {
  const [selectedMethod, setSelectedMethod] = useState("COD");
>>>>>>> 048fdb4 (Initial commit from dev-akash)
  const [isVerifying, setIsVerifying] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const user = useAuth();
  const { syncCart } = useCartSync();
  const { syncLoyalty } = useLoyaltySync();

  useEffect(() => {
    if (shippingData && shippingData?.shippingCharge) {
      setDeliveryFee(shippingData?.shippingCharge);
    } else {
      setDeliveryFee(0);
    }
  }, [shippingData.shippingCharge])

  useEffect(() => {
    const fetchShippingPreview = async () => {
      const payloadIds = checkoutMode === "direct" && directItem
        ? [directItem.productVariantId]
        : Array.isArray(cartItemIds) ? cartItemIds : [cartItemIds];

      if (!userData?.addressId || !payloadIds || payloadIds.length === 0) return;

      setShippingLoading(true);
      try {
        const response = await calculateShippingPreview({
          cartItemIds: payloadIds,
          addressId: userData.addressId,
          isCod: selectedMethod === "COD"
        });

        if (response?.success && response?.data?.pricing) {
          setShippingData({
            shippingCharge: Number(response.data.pricing.shippingCharge) || 0,
            autoDiscount: Number(response.data.pricing.discountAmount) || 0,
            autoCoupons: response.data.autoCoupons || [],
            messages: response.data.messages || []
          });
        }
      } catch (error) {
        console.error("Shipping calc failed", error);
      } finally {
        setShippingLoading(false);
        setIsDeliveryFeeCalculated(true);
      }
    };

    fetchShippingPreview();
  }, [selectedMethod, userData?.addressId, cartItemIds, directItem, checkoutMode]);

  const syncStateAfterOrder = useCallback(async () => {
    sessionStorage.removeItem("guestCartIds");
    await queryClient.invalidateQueries({ queryKey: ["cart-data", user.id] });
    await queryClient.invalidateQueries({ queryKey: ["cart-data"] });

    dispatch(clearGuestCart());
    dispatch(clearDirectCheckoutItem());
  }, [queryClient, dispatch, user.id]);

  const handleOrderSuccess = async (order) => {
    toast.success("Order placed successfully!");
    await syncStateAfterOrder();
    await syncCart();
    await syncLoyalty();
    onComplete(order);
  };

  const openRazorpayWindow = (payment, order) => {
    if (!window.Razorpay) {
      toast.error("Payment system not loaded. Please refresh.");
      return;
    }

    const options = {
      key: payment.key,
      amount: payment.amount,
      currency: payment.currency,
      order_id: payment.razorpayOrderId,
      name: "MayaVriksh",
      description: "Buy live plants & garden essentials",
      image: "https://res.cloudinary.com/dwdu18hzs/image/upload/v1756148350/751fd396-66c6-481f-8016-e9003210be97-photoaidcom-cropped_1_zksjmb.png",
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phoneNumber,
      },
      notes: {
        company: "MayaVriksh",
        internal_order_id: order.id,
        checkout_type: "GUEST",
        platform: "WEB",
      },
      callback_url: "http://mayavriksh.in/api/payments/razorpay/callback",
      retry: { enabled: true, max_count: 2 },
      timeout: 300,
      handler: async function (response) {
        setIsVerifying(true);
        try {
          await verifyOrderPayment(order.id, {
            paymentMethod: "RAZORPAY",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
          await handleOrderSuccess(order);
        } catch (err) {
          toast.error("Payment verification failed. Please contact support.");
        } finally {
          setIsVerifying(false);
        }
      },
      modal: {
        ondismiss: async () => {
          toast.error("Payment cancelled");
          await syncStateAfterOrder();
          await syncCart();
          await syncLoyalty();
          navigate("/", { replace: true });
        },
      },
      theme: { color: "#9D41FE" },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function () {
      toast.error("Payment failed. Please try again.");
    });
    rzp.open();
  };

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => createCustomerOrder(orderData),
    onSuccess: async (response) => {
      const orderData = response?.data || response;
      const { order, payment } = orderData;
      if (!payment) {
        await handleOrderSuccess(order);
        return;
      }
      openRazorpayWindow(payment, order);
    },
    onError: (error) => {
      toast.error(error?.message || "Issue placing order.");
    },
  });

  const handlePlaceOrder = () => {
    if (!userData?.addressId) {
      toast.error("Delivery address is missing.");
      return;
    }
    const promoCodeIds = []
<<<<<<< HEAD
    const couponId = appliedCoupon?.couponId
    if (couponId) {
      promoCodeIds.push(couponId);
=======
    if (promoCodeId) {
      promoCodeIds.push(promoCodeId);
>>>>>>> 048fdb4 (Initial commit from dev-akash)
    }
    if (manualPromoId) {
      promoCodeIds.push(manualPromoId)
    }

    const orderPayload = {
      billingAddressId: userData.addressId,
      shippingAddressId: userData.addressId,
      isShippingEqualsBilling: true,
      paymentMethod: selectedMethod,
      giftMessage: "Going to Mars.. Thank u ISRO.",
      promoCodeIds: promoCodeIds,
      useLoyaltyPoints: loyaltyPoint
    };

    if (checkoutMode === "direct" && directItem) {
      orderPayload.items = [
        {
          plantVariantId: directItem.productVariantId,
          potVariantId: directItem.potVariantId,
          quantity: directItem.quantity,
        },
      ];
    } else {
      const idsArray = Array.isArray(cartItemIds) ? cartItemIds : [cartItemIds];
      orderPayload.cartItemIds = idsArray;
    }

    // Safety check
    if (!orderPayload.cartItemIds && !orderPayload.items) {
      toast.error("No items to checkout!");
      return;
    }

    createOrderMutation.mutate(orderPayload);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="block lg:hidden">
        <PriceSummary
          subtotal={total}
          finalAmount={finalAmount}
          setPromoCodeId={setPromoCodeId}
          setLoyaltyPoint={setLoyaltyPoint}
          isDeliveryFeeCalculated={isDeliveryFeeCalculated}
          setCouponAmount={setCouponAmount}
          loyaltyPointUsed={loyaltyPointUsed}
          setLoyaltyPointUsed={setLoyaltyPointUsed}
          shippingLoading={shippingLoading}

          deliveryFee={shippingData.shippingCharge}
          autoDiscount={shippingData.autoDiscount}
          autoCoupons={shippingData.autoCoupons}

          manualCode={manualCode}
          setManualCode={setManualCode}
          setManualPromoId={setManualPromoId}
          setManualCouponAmount={setManualCouponAmount}
          manualCouponAmount={manualCouponAmount}
          appliedCoupon={appliedCoupon}
          setAppliedCoupon={setAppliedCoupon}
          appliedManualCodeName={appliedManualCodeName}
          setAppliedManualCodeName={setAppliedManualCodeName}
<<<<<<< HEAD

          selectedMethod={selectedMethod}
=======
>>>>>>> 048fdb4 (Initial commit from dev-akash)
        />
      </div>

      <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
        <Card
          className={`cursor-pointer transition-all ${selectedMethod === "COD"
            ? "border-emerald-600 bg-emerald-50/30 border-2"
            : "border-gray-200"
            }`}
          onClick={() => setSelectedMethod("COD")}
        >
<<<<<<< HEAD
          <CardContent className="pt-2 md:p-6">
=======
          <CardContent className=" pt-2 md:p-6 ">
>>>>>>> 048fdb4 (Initial commit from dev-akash)
            <div className="flex items-center gap-3 sm:gap-4">
              <RadioGroupItem
                value="COD"
                id="COD"
                data-testid="radio-COD"
                className="flex-shrink-0 text-emerald-600 border-emerald-600"
              />
              <Label
                htmlFor="COD"
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <Banknote className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
<<<<<<< HEAD
                  <p
                    className="font-semibold text-sm sm:text-base text-gray-900"
                    data-testid="text-COD-title"
                  >
=======
                  <p className="font-semibold text-sm sm:text-base text-gray-900" data-testid="text-COD-title">
>>>>>>> 048fdb4 (Initial commit from dev-akash)
                    Cash On Delivery
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground text-gray-500">
                    Pay when you receive
                  </p>
<<<<<<< HEAD
                  {selectedMethod === "COD" && (
                    <p className="text-xs sm:text-sm text-amber-600 font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                      * ₹40 extra fee applied for COD
                    </p>
                  )}
=======
>>>>>>> 048fdb4 (Initial commit from dev-akash)
                </div>
                {selectedMethod === "COD" && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedMethod === "RAZORPAY" ? "border-emerald-600 bg-emerald-50/30 border-2" : "border-gray-200"}`}
          onClick={() => setSelectedMethod("RAZORPAY")}
        >
          <CardContent className="md:p-6 pt-2">
            <div className="flex items-center gap-3  justify-center ">
              <RadioGroupItem
                value="RAZORPAY"
                id="RAZORPAY"
                data-testid="radio-RAZORPAY"
                className="flex-shrink-0 text-emerald-600 border-emerald-600"
              />
              <Label
                htmlFor="RAZORPAY"
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <CreditCard className="w-5 h-5  text-emerald-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-gray-900" data-testid="text-RAZORPAY-title">
                    Razorpay
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground text-gray-500">
                    Card, UPI, Netbanking
                  </p>
                </div>
                {selectedMethod === "RAZORPAY" && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
              </Label>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      {shippingData.messages.length > 0 && (
        <div className="bg-emerald-50 text-emerald-700 text-xs sm:text-sm p-3 rounded-md border border-emerald-100 animate-in fade-in slide-in-from-top-2">
          {shippingData.messages.map((msg, i) => <p key={i}>• {msg}</p>)}
        </div>
      )}

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-base sm:text-lg font-semibold text-gray-700">
              Total Payable
            </span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-700" data-testid="text-payment-total">
              {shippingLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                `₹${Number(finalAmount)}`
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button
        className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-semibold shadow-lg shadow-emerald-100`}
        size="lg"
        onClick={handlePlaceOrder}
        disabled={createOrderMutation.isPending || isVerifying || shippingLoading}
        data-testid="button-place-order"
      >
        {createOrderMutation.isPending || shippingLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {isVerifying ? "Verifying Payment..." : shippingLoading ? "Calculating..." : "Processing..."}
          </>
        ) : (
          "PLACE ORDER"
        )}
      </Button>

      {(createOrderMutation.isPending || isVerifying) && (
        <OrderProcessingAnimation isProcessing={true} />
      )}
    </div>
  );
}