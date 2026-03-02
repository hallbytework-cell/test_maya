import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Ticket, Wallet, Shield, CreditCard, Loader2, Tag, Info, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPriceSpecificCoupons, validatePromoCode } from "@/api/customer/promoCodes";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function PriceSummary({
  subtotal = 0,
  deliveryFee = 0,
  autoDiscount = 0,
  setPromoCodeId,
  setLoyaltyPoint,
  isDeliveryFeeCalculated = false,
  loyaltyPointUsed,
  setLoyaltyPointUsed,
  finalAmount = 0,
  shippingLoading = false,
  autoCoupons = [],
  manualCode,
  setManualCode,
  setManualPromoId,
  setManualCouponAmount,
  manualCouponAmount = 0,
  appliedCoupon,
  setAppliedCoupon,
  appliedManualCodeName,
  setAppliedManualCodeName,
}) {

  const [isCheckingCode, setIsCheckingCode] = useState(false);

  const { user } = useAuth();

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  const walletBalance = user?.loyaltyPoints || 0;
  const walletDeduction = loyaltyPointUsed ? Math.min(walletBalance, subtotal) : 0;

  const checkCompatibility = async (codeToValidate, existingTicketId) => {
    const payload = {
      code: codeToValidate,
      orderAmount: subtotal,
      appliedPromoCodes: [
        ...autoCoupons.map(c => c.promoCodeId),
        existingTicketId
      ].filter(Boolean)
    };

    if (payload.appliedPromoCodes.length == 0) {
      delete payload.appliedPromoCodes;
    }
    return await validatePromoCode(payload);
  };

  useEffect(() => {
    setLoyaltyPoint(loyaltyPointUsed ? walletDeduction : 0);
  }, [loyaltyPointUsed, walletDeduction, setLoyaltyPoint]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getPriceSpecificCoupons(subtotal);
        if (response && response.success && Array.isArray(response.data.promoCodes)) {
          const formattedCoupons = response.data.promoCodes.map(coupon => ({
            id: coupon.promoCodeId,
            code: coupon.code,
            discount: coupon.discountType === 'PERCENTAGE'
              ? `${coupon.discountValue}% OFF`
              : `₹${coupon.discountValue} OFF`,
            min: coupon.minOrderAmount ? parseInt(coupon.minOrderAmount) : 0,
            desc: coupon.code.includes('WELCOME') ? 'NEW USER' :
              coupon.code.includes('FESTIVE') ? 'FESTIVE' :
                coupon.discountType === 'PERCENTAGE' ? 'DEAL' : 'SAVER',
            fullDescription: coupon.description,
            discountValue: parseInt(coupon?.discountValue || 0),
            promoCodeId: coupon.promoCodeId
          }));
          setAvailableCoupons(formattedCoupons);
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      } finally {
        setLoadingCoupons(false);
      }
    };

    fetchCoupons();
  }, [subtotal]);

  useEffect(() => {
    if (appliedCoupon && !loadingCoupons && availableCoupons.length > 0) {
      const currentCoupon = availableCoupons.find(c => c.code === appliedCoupon?.code);
      if (currentCoupon && Number(subtotal) < currentCoupon.min) {
        setAppliedCoupon(null);
        setPromoCodeId(null);
      }
    }
  }, [subtotal, availableCoupons, appliedCoupon, setPromoCodeId, loadingCoupons]);


  const handleApplyCoupon = async (coupon) => {
    if (appliedCoupon?.code === coupon?.code) {
      setAppliedCoupon(null);
      setPromoCodeId(null);
      toast.success("Coupon removed");
      return;
    }

    if (appliedManualCodeName) {
      setIsCheckingCode(true);
      try {
        const response = await checkCompatibility(appliedManualCodeName, coupon.code);
        if (response && response.success) {
          setAppliedCoupon(coupon);
          setPromoCodeId(coupon?.promoCodeId);
          toast.success(`${coupon.code} applied with special code!`);
        } else {
          toast.error(response?.message || "Incompatible with special code.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.errorDetails?.message ||
          err.message ||
          "Please try again.";

        toast.error(errorMessage);
      } finally {
        setIsCheckingCode(false);
      }
    } else {
      setAppliedCoupon(coupon);
      setPromoCodeId(coupon?.promoCodeId);
      toast.success(`${coupon.code} applied!`);
    }
  };

  const handleManualApply = async () => {

    if (appliedManualCodeName) {
      setManualPromoId(null);
      setManualCouponAmount(0);
      setAppliedManualCodeName("");
      setManualCode("");
      toast.success("Promo code removed");
      return;
    }

    if (!manualCode || !manualCode.trim()) return;
    setIsCheckingCode(true);

    try {
      const currentTicketId = appliedCoupon?.code
        ? availableCoupons.find(c => c.code === appliedCoupon?.code)?.code
        : null;

      const response = await checkCompatibility(manualCode, currentTicketId);

      if (response && response.success) {
        const couponData = response.data;
        setManualPromoId(couponData.id || couponData.promoCodeId);
        setManualCouponAmount(Number(couponData.discountValue));
        setAppliedManualCodeName(couponData.code);
        setManualCode("");
        toast.success("Special code applied!");
      } else {
        toast.error(response?.message || "Invalid or incompatible code.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errorDetails?.message ||
        err.message ||
        "Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsCheckingCode(false);
    }
  };

  const sortedCoupons = useMemo(() => {
    return [...availableCoupons].sort((a, b) => {
      const isAEligible = Number(subtotal) >= a.min;
      const isBEligible = Number(subtotal) >= b.min;
      if (isAEligible && !isBEligible) return -1;
      if (!isAEligible && isBEligible) return 1;
      return b.discountValue - a.discountValue;
    });
  }, [availableCoupons, subtotal]);

  const TicketCoupon2 = ({ offer, isSelected, isDisabled, onClick, isChecking }) => {
    const remaining = offer.min - Number(subtotal);
    return (
      <div
        onClick={() => !isDisabled && !isChecking && onClick(offer)}
        className={`relative w-64 h-24 flex-shrink-0 py-1 transition-all duration-500 snap-center ${isDisabled || isChecking ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer group'
          }`}
      >
        <div className={`w-full h-full flex items-stretch rounded-xl overflow-hidden border transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-500' :
          isDisabled ? 'bg-gray-50 border-gray-100 grayscale-[0.2]' : 'bg-white border-gray-200 shadow-sm hover:border-emerald-400'
          }`}>
          <div className="w-[65%] p-3 pl-4 flex flex-col justify-center">
            <span className={`text-[9px] font-bold w-fit px-2 py-0.5 rounded mb-1 uppercase tracking-tighter ${isDisabled ? 'bg-gray-200 text-gray-500' : 'bg-amber-100 text-amber-700'}`}>
              {offer.desc}
            </span>
            <span className={`text-xl font-black leading-none ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {offer.discount}
            </span>
            <p className="text-[10px] mt-1 font-bold">
              {isDisabled ? (
                <span className="text-rose-500 tracking-tight">Add ₹{remaining} more</span>
              ) : (
                <span className="text-emerald-600">Eligible! Orders &gt; ₹{offer.min}</span>
              )}
            </p>
          </div>

          <div className="relative w-[1px] border-l border-dashed border-gray-300 my-2" />

          <div className="w-[35%] flex flex-col items-center justify-center bg-gray-50/30 p-2">
            <span className={`text-xs font-mono font-bold ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
              {offer.code}
            </span>

            {/* LOADER LOGIC HERE */}
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mt-2" />
            ) : isSelected ? (
              <div className="mt-2 text-[10px] font-black text-emerald-700">APPLIED</div>
            ) : !isDisabled && (
              <button className="mt-2 text-[10px] font-bold text-emerald-600 underline">
                APPLY
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleUseWallet = () => {
    if (walletBalance === 0) return;
    setLoyaltyPointUsed(!loyaltyPointUsed);
  };

  return (
    <Card className="bg-white border-0 shadow-xl md:shadow-none md:border md:border-gray-200 overflow-hidden rounded-xl">
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-800">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3 className="font-bold text-sm uppercase tracking-wide">Payment Summary</h3>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="p-5 bg-gray-50 border-b border-gray-100 ">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-600" /> Coupons & Offers
            </span>
          </div>

          <div className="flex gap-2 mb-5">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Enter Promo Code"
                value={appliedManualCodeName || manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleManualApply()}
                disabled={!!appliedManualCodeName} // Disable input if code is applied
                className={`w-full pl-3 pr-10 py-2.5 text-xs font-bold border rounded-lg outline-none uppercase shadow-sm transition-all ${appliedManualCodeName
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                  }`}
              />
              {appliedManualCodeName ? (
                <CheckCircle2 className="absolute right-3 top-3 w-3.5 h-3.5 text-purple-600" />
              ) : (
                <Tag className="absolute right-3 top-3 w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
            <button
              onClick={handleManualApply}
              disabled={isCheckingCode || (!appliedManualCodeName && (!manualCode || manualCode.length < 3))}
              className={`px-5 py-2.5 text-[10px] font-black rounded-lg shadow-sm active:scale-95 transition-colors ${appliedManualCodeName
                  ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' // Red style for Remove
                  : 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-200'
                }`}
            >
              {isCheckingCode ? <Loader2 className="w-3 h-3 animate-spin" /> : (appliedManualCodeName ? "REMOVE" : "APPLY")}
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-4 pt-1 -mx-5 px-5 scrollbar-hide snap-x">
            {loadingCoupons ? (
              [1, 2].map(i => <div key={i} className="w-64 h-24 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />)
            ) : sortedCoupons.map((offer) => {
              const isDisabled = Number(subtotal) < offer.min;
              return (
                <TicketCoupon2
                  key={offer.id}
                  offer={offer}
                  isDisabled={isDisabled}
                  isSelected={appliedCoupon?.code === offer.code}
                  isChecking={isCheckingCode} // Pass the API loading state
                  onClick={() => handleApplyCoupon(offer)}
                />
              );
            })}
          </div>
        </div>

        {autoCoupons.length > 0 && (
          <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 animate-in slide-in-from-top-2">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-2 mb-3">
              <Tag className="w-3.5 h-3.5 fill-emerald-600" /> OFFERS APPLIED AUTOMATICALLY
            </span>
            {autoCoupons.map((coupon, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                <div className="flex flex-col">
                  {/* Changed "Special Offer" to "Checkout Exclusive Reward" */}
                  <span className="text-xs font-bold text-gray-800 tracking-tight">Checkout Exclusive Reward</span>
                  <span className="text-[10px] text-gray-500 font-medium">Applied at checkout</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  -₹{coupon?.discountAmount}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between select-none group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${loyaltyPointUsed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}><Wallet className="w-4 h-4" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-700">MV Wallet</p>
                {loyaltyPointUsed ?
                  <p className="text-xs text-gray-500">Remaining Balance: <span className="font-bold text-gray-800">₹{walletBalance - walletDeduction}</span></p> :
                  <p className="text-xs text-gray-500">Balance: <span className="font-bold text-gray-800">₹{walletBalance}</span></p>
                }
              </div>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${loyaltyPointUsed ? 'bg-emerald-500' : 'bg-gray-200'} ${walletBalance !== 0 ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={handleUseWallet}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${loyaltyPointUsed ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3 bg-white">
          <div className="flex justify-between text-sm text-gray-600"><span>Item Total:</span><span className="font-medium text-gray-900">₹{Number(subtotal).toFixed(2)}</span></div>
          {autoDiscount > 0 && <div className="flex justify-between text-sm text-emerald-600 font-bold"><span>Checkout Reward: </span><span>-₹{autoDiscount}</span></div>}
          {loyaltyPointUsed && <div className="flex justify-between text-sm text-emerald-600 font-bold"><span>Wallet Used:</span><span>-₹{(walletDeduction * 0.1).toFixed(2)}</span></div>}

          <div className="flex justify-between text-sm text-gray-600 items-center">
            <span>Delivery Fee:</span>
            {isDeliveryFeeCalculated ? (
              shippingLoading ? <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" /> : <span className="font-medium text-emerald-600">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            ) : <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">CALCULATED AT PAYMENT</span>}
          </div>

          {appliedCoupon?.discountValue && (
            <div className="flex justify-between text-sm text-emerald-600 font-bold animate-in slide-in-from-top-1">
              <span className="flex items-center gap-1.5 italic"><CheckCircle2 className="w-3 h-3" /> Coupon ({appliedCoupon?.code})</span>
              <span>-₹{appliedCoupon.discountValue}</span>
            </div>
          )}

          {manualCouponAmount > 0 && (
            <div className="flex justify-between text-sm text-purple-600 font-bold animate-in slide-in-from-top-1">
              <span className="flex items-center gap-1.5 italic"><Sparkles className="w-3 h-3 text-purple-500" /> Promo Code ({appliedManualCodeName})</span>
              <span>-₹{manualCouponAmount}</span>
            </div>
          )}

          <div className="border-t border-gray-100 my-2 pt-3 flex items-center justify-between">
            <div>
              {shippingLoading ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" /> : <p className="text-xl font-bold text-gray-900">₹{finalAmount.toFixed(2)}</p>}
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">To Pay</p>
            </div>
            {(autoDiscount + (walletDeduction * 0.1) + (appliedCoupon?.discountAmount || 0) + manualCouponAmount > 0) && (
              <div className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                SAVED ₹{(autoDiscount + (walletDeduction * 0.1) + (appliedCoupon?.discountAmount || 0) + manualCouponAmount).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-between items-center text-gray-400 opacity-70 grayscale">
          <CreditCard className="w-5 h-5" />
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide ml-auto"><Shield className="w-3 h-3" /> Secure Transaction</div>
        </div>
      </CardContent>
    </Card>
  );
}