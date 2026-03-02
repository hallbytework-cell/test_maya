import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutStepper from "./CheckoutStepper";
import PriceSummary from "./PriceSummary";
import CheckoutLayout from "./CheckoutLayout";
import ScrollToTop from "@/components/ScrollToTop";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [orderComplete, setOrderComplete] = useState(false);
  const [finalOrderData, setFinalOrderData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalItemPrice, setTotalItemPrice] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponAmount, setCouponAmount] = useState(0);
  const [promoCodeId, setPromoCodeId] = useState(null);
  const [loyaltyPoint, setLoyaltyPoint] = useState(0);
  const [loyaltyPointUsed, setLoyaltyPointUsed] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isDeliveryFeeCalculated, setIsDeliveryFeeCalculated] = useState(false);
  const [shouldRecalculate, setShouldRecalculate] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [manualCouponAmount, setManualCouponAmount] = useState(0);
  const [manualPromoId, setManualPromoId] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [appliedManualCodeName, setAppliedManualCodeName] = useState("");

  const [shippingData, setShippingData] = useState({
    shippingCharge: null,
    autoDiscount: null,
    autoCoupons: [],
    messages: []
  });

  const handleOrderCompletion = (orderResponse) => {
    setFinalOrderData(orderResponse);
    setOrderComplete(true);
  }

  useEffect(() => {
    if (orderComplete && finalOrderData) {
      navigate("../order-confirm", { state: finalOrderData, replace: true });
    }
  }, [orderComplete, finalOrderData, navigate]);

  useEffect(() => {
    setFinalAmount(
      totalItemPrice +
      deliveryFee -
      ((appliedCoupon?.discountValue || 0) + manualCouponAmount +  Number((loyaltyPoint * 0.1).toFixed(2)) + (shippingData?.autoDiscount ?? 0))
    );

  }, [totalItemPrice, couponAmount, manualCouponAmount,  deliveryFee, loyaltyPoint, shippingData, appliedCoupon]);

  useEffect(() => {
    if (shouldRecalculate) {
      setCouponAmount(0);
      setPromoCodeId(null);
      // setLoyaltyPoint(0);
      // setLoyaltyPointUsed(false);
      setManualCode(null);
      setManualPromoId(null);
      setManualCouponAmount(0);
      setDeliveryFee(0);
      setIsDeliveryFeeCalculated(false);
      setShouldRecalculate(false);
      setShippingData({
        shippingCharge: null,
        autoDiscount: null,
        autoCoupons: [],
        messages: []
      })
      setShippingLoading(false)
    }
  }, [shouldRecalculate])

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <ScrollToTop />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <CheckoutLayout currentStep={currentStep - 1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-8">
              <CheckoutStepper
                onOrderComplete={handleOrderCompletion}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                setTotalItemPrice={setTotalItemPrice}
                subTotal={totalItemPrice}
                finalAmount={finalAmount}
                setPromoCodeId={setPromoCodeId}
                promoCodeId={promoCodeId}
                setLoyaltyPoint={setLoyaltyPoint}
                loyaltyPoint={loyaltyPoint}
                isDeliveryFeeCalculated={isDeliveryFeeCalculated}
                setIsDeliveryFeeCalculated={setIsDeliveryFeeCalculated}
                setCouponAmount={setCouponAmount}
                setDeliveryFee={setDeliveryFee}
                loyaltyPointUsed={loyaltyPointUsed}
                setLoyaltyPointUsed={setLoyaltyPointUsed}
                setShouldRecalculate={setShouldRecalculate}
                shippingLoading={shippingLoading}
                setShippingLoading={setShippingLoading}
                shippingData={shippingData}
                setShippingData={setShippingData}

                manualCode={manualCode}
                setManualCode={setManualCode}
                setManualPromoId={setManualPromoId}
                setManualCouponAmount={setManualCouponAmount}
                manualCouponAmount={manualCouponAmount}
                manualPromoId={manualPromoId}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
                appliedManualCodeName={appliedManualCodeName}
                setAppliedManualCodeName={setAppliedManualCodeName}
              />
            </div>

            {currentStep > 2 && totalItemPrice > 0 && (
              <div className="lg:col-span-4 hidden lg:block">
                <PriceSummary
                  subtotal={totalItemPrice}
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
                />
              </div>
            )}
          </div>
        </CheckoutLayout>
      </div>
    </div>
  );
}