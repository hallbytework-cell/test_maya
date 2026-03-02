
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearDirectCheckoutItem, } from "@/redux/slices/cartSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import LoginStep from "./LoginStep";
import DeliveryAddressStep from "./DeliveryAddressStep";
import OrderSummaryStep from "./OrderSummaryStep";
import PaymentOptionsStep from "./PaymentOptionsStep";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { getCartItems } from "@/api/customer/cart";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const getStepSummary = (stepId, userData) => {
  switch (stepId) {
    case 1:
      return {
        label: "",
        line1: userData?.name || 'User',
        line2: userData?.mobile || '',
      };
    case 2:
      return {
        label: "Delivering to",
        line1: userData?.addressName || 'User',
        line2: userData?.addressLine || '',
      };
    default:
      return null;
  }
};

const getButton = (step, setCurrentStep, logout) => {
  if (step.id === 1) {
    return <></>
    // return <Button onClick={() => logout()} className="text-red-500 cursor-pointer">Logout</Button>
  }
  return <Button
    variant="ghost"
    size="sm"
    onClick={(e) => {
      e.stopPropagation();
      setCurrentStep(step.id);
    }}
    className="text-[#00a83e] hover:text-[#008f35] hover:bg-[#00a83e]/10 h-8 px-3 font-medium text-xs uppercase tracking-wider"
  >
    Change
  </Button>
}

export default function CheckoutStepper({
  onOrderComplete,
  currentStep = 1,
  setCurrentStep,
  setTotalItemPrice,
  subTotal,
  setPromoCodeId,
  promoCodeId,
  setLoyaltyPoint,
  loyaltyPoint,
  isDeliveryFeeCalculated,
  setIsDeliveryFeeCalculated,
  setCouponAmount,
  setDeliveryFee,
  finalAmount,
  loyaltyPointUsed,
  setLoyaltyPointUsed,
  setShouldRecalculate,
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
  const [steps, setSteps] = useState([
    { id: 1, title: "Login or Signup", completed: false },
    { id: 2, title: "Delivery Address", completed: false },
    { id: 3, title: "Order Summary", completed: false },
    { id: 4, title: "Payment Options", completed: false },
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout, isAuthenticated } = useAuth();

  const directItem = useSelector((state) => state.persisted?.cart?.directCheckoutItem);
  const guestCartItems = useSelector((state) => state.persisted?.cart?.guestCartItems) || [];
  const selectedGuestItems = location.state?.selectedGuestItems || [];
  const [selectedCartItemIds, setSelectedCartItemIds] = useState(location?.state?.selectedCartItemIds ? location?.state?.selectedCartItemIds : [])
  const [isCartSynced, setIsCartSynced] = useState(() => {
    if (selectedGuestItems.length > 0) {
      return false;
    }
    return true;
  });
  const checkoutMode = location.state?.checkoutMode;

  useEffect(() => {
    if (!user) {
      setCurrentStep(1);
    }
  }, [user])

  useEffect(() => {
    if (selectedGuestItems.length > 0 && guestCartItems.length == 0) {
      const addedToCartIds = JSON.parse(sessionStorage.getItem("guestCartIds"));
      if (addedToCartIds && addedToCartIds.length > 0) {
        setSelectedCartItemIds(addedToCartIds)
        setIsCartSynced(true)
      }
    }
  }, [])

  useEffect(() => {
    if (directItem && checkoutMode !== 'direct') {
      dispatch(clearDirectCheckoutItem());
    }
  }, [checkoutMode, directItem, dispatch]);

  const initUserData = {
    name: user?.fullName || "Tree Lover",
    mobile: user?.phoneNumber || "",
    addressName: "",
    addressLine: "",
    addressId: "",
    userId: user?.userId || null
  }

  const [userData, setUserData] = useState(initUserData);
  const completeStep = (stepId, data = null) => {

    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, completed: true } : step
    ));

    if (stepId < 4) {
      setCurrentStep(stepId + 1);
    } else {
      onOrderComplete?.(data);
    }
  };

  useEffect(() => {
    setUserData(prev => ({
      ...prev,
      name: user?.fullName || "Tree Lover",
      mobile: user?.phoneNumber || "",
      userId: user?.userId || null
    }));
  }, [user]);


  const toggleStep = (stepId) => {
    if (steps[stepId - 1].completed || stepId === currentStep) {
      setCurrentStep(stepId);
    }
  };

  const {
    data: allCartItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart-data", user?.id],
    queryFn: async () => {
      const resp = await getCartItems();
      return resp.data || [];
    },
    enabled: isAuthenticated && isCartSynced,
    select: (data) => {
      return data.map((item) => {
        const plantVariant = item.plantVariant || {};
        const potVariant = item.potVariant || {};

        return {
          id: item.id,
          plantVariantId: plantVariant.plantVariantId,
          potVariantId: potVariant.potVariantId,
          name: plantVariant?.plantName || "Plant N/A",
          plantColor: plantVariant?.colorName || "N/A",
          potInfo: {
            potType: potVariant?.potTypeName || "Pot N/A",
            potColor: potVariant?.colorName || "N/A",
            potColorHex: potVariant?.colorHex || "#008000"
          },
          plantImage: plantVariant?.imageUrl || "/placeholder.jpg",
          plantSize: plantVariant?.plantSize || "N/A",
          plantColorHex: plantVariant?.colorHex || "#008000",
          price:
            (plantVariant.sellingPrice || 0) + (potVariant.sellingPrice || 0),
          quantity: item?.quantity,
          deliveryDate: item?.deliveryDate,
        };
      });
    },
    staleTime: 0,
    gcTime: 0
  });

  // console.log("allCartItems= ", allCartItems);
  // console.log("guestCartItems= ", guestCartItems);
  // console.log("checkoutMode= ", checkoutMode);
  // console.log("selectedCartItemIds= ", selectedCartItemIds)
  // console.log("isLoading= ", isLoading)
  // console.log("selectedGuestItems ==> ", selectedGuestItems);


  const isReady = isCartSynced && selectedCartItemIds.length > 0 && allCartItems.length > 0 && !isLoading;

  useEffect(() => {
    const isGuestEmpty = checkoutMode === "guest-cart" && guestCartItems.length === 0;
    const isUserEmpty = checkoutMode === "cart" && !isLoading && allCartItems.length === 0;
    const isDirectInvalid = checkoutMode === "direct" && !location.state?.selectedCartItemIds;

    if (isGuestEmpty || isUserEmpty || isDirectInvalid) {
      // toast.error("Please add items to your cart to proceed.");
      // navigate("/"); 
    }
  }, [allCartItems, guestCartItems, checkoutMode, isLoading, navigate, location.state]);

  useEffect(() => {
    const isManualEntry = !location.state || !location.state.checkoutMode;
    const hasGuestItems = guestCartItems && guestCartItems.length > 0;
    const hasUserItems = allCartItems && allCartItems.length > 0;

    if (isManualEntry) {
      if (hasUserItems || hasGuestItems) {
        console.warn("Manual entry detected. Defaulting to Cart mode.");
      } else {
        // toast.error("Your cart is empty. Please add items before checking out.");
        navigate("/");
      }
    }
  }, [location.state, allCartItems, guestCartItems, navigate]);


  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {steps.map((step) => {
        const isActive = currentStep === step.id;
        const isCompleted = step.completed;
        const summaryData = getStepSummary(step.id, userData);
        const title = (step.id === 1 && isAuthenticated) ? "Logged in as" : step.title;

        return (
          <Card
            key={step.id}
            className={`border transition-all duration-300 overflow-hidden ${isActive
              ? "border-[#00a83e] shadow-md ring-1 ring-[#00a83e]/10 bg-white"
              : "border-gray-200 bg-white shadow-sm opacity-95"
              }`}
          >
            <CardHeader
              className={`cursor-pointer px-6 py-4 transition-colors duration-200 ${isActive ? "bg-[#00a83e]/5" : "hover:bg-gray-50"
                }`}
              onClick={() => toggleStep(step.id)}
              data-testid={`step-header-${step.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Step Number / Check Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex flex-shrink-0 items-center justify-center font-bold text-sm transition-colors duration-300 ${isCompleted || isActive
                      ? "bg-[#00a83e] text-white shadow-sm"
                      : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step?.id}
                  </div>

                  {/* Title and Summary */}
                  <div className="flex flex-col pt-1">
                    <CardTitle
                      className={`text-sm md:text-base font-bold uppercase tracking-wide ${isActive || isCompleted ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {title}
                    </CardTitle>

                    {/* Summary Preview for Completed Steps */}
                    {isCompleted && !isActive && summaryData && (
                      <div className="mt-2 text-sm animate-in fade-in slide-in-from-top-1 duration-300">
                        <p className="text-xs text-gray-400 mb-0.5 font-medium uppercase">{summaryData.label}</p>
                        <div className="text-gray-700">
                          <span className="font-semibold mr-2">{summaryData.line1}</span>
                          <span className="text-gray-500 truncate hidden sm:inline-block max-w-[250px] align-bottom">
                            {summaryData.line2}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button / Chevron */}
                <div className="flex items-center pt-1">
                  {isCompleted && !isActive ? (
                    getButton(step, setCurrentStep, logout)
                  ) : (
                    isActive ? (
                      <ChevronUp className="w-5 h-5 text-[#00a83e]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )
                  )}
                </div>
              </div>
            </CardHeader>

            {/* Step Content */}
            {isActive && (
              <CardContent className="p-0">
                <div className="md:px-6 pb-6 pt-2 border-t border-dashed border-gray-100">
                  {step.id === 1 && (
                    <LoginStep
                      onComplete={(data) => completeStep(1, data)}
                      selectedGuestItems={selectedGuestItems}
                      setSelectedCartItemIds={setSelectedCartItemIds}
                      setIsCartSynced={setIsCartSynced}
                    />
                  )}
                  {step.id === 2 && (
                    <DeliveryAddressStep
                      onComplete={() => completeStep(2)}
                      setUserData={setUserData}
                      isCartSynced={!(isLoading && !isReady)}
                      setShouldRecalculate={setShouldRecalculate}
                    />
                  )}
                  {step.id === 3 && (
                    <OrderSummaryStep
                      onComplete={() => completeStep(3)}
                      checkoutMode={checkoutMode}
                      selectedCartItemIds={selectedCartItemIds}
                      setSelectedCartItemIds={setSelectedCartItemIds}
                      allCartItems={allCartItems}
                      isLoading={!isReady}
                      isError={isError}
                      setTotalItemPrice={setTotalItemPrice}
                      setShouldRecalculate={setShouldRecalculate}
                    />
                  )}
                  {step.id === 4 && (
                    <PaymentOptionsStep
                      total={subTotal}
                      onComplete={(data) => completeStep(4, data)}
                      checkoutMode={checkoutMode}
                      cartItemIds={selectedCartItemIds}
                      directItem={directItem}
                      userData={userData}
                      promoCodeId={promoCodeId}
                      loyaltyPoint={loyaltyPoint}
                      setPromoCodeId={setPromoCodeId}
                      setLoyaltyPoint={setLoyaltyPoint}
                      isDeliveryFeeCalculated={isDeliveryFeeCalculated}
                      setIsDeliveryFeeCalculated={setIsDeliveryFeeCalculated}
                      setCouponAmount={setCouponAmount}
                      setDeliveryFee={setDeliveryFee}
                      finalAmount={finalAmount}
                      loyaltyPointUsed={loyaltyPointUsed}
                      setLoyaltyPointUsed={setLoyaltyPointUsed}
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
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}