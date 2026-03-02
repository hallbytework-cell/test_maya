import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { filterOutById, filterByIds } from "@/utils/algorithmOptimizations";
import { useCartSync } from "@/hooks/useCartSync";

import {
  X, Minus, Plus, Trash2, Heart, ShoppingCart, Gift,
  Sparkles, Check, Lock, ShoppingBag, Loader2, Info, TicketPercent
} from "lucide-react";

import { products } from "../data/products";
import {
  deleteCartItem,
  getCartItems,
  moveCartItemToCheckoutLater,
  updateCartItem,
} from "@/api/customer/cart";
import { deleteCheckoutLaterItem, getCheckoutLaterItems, moveCheckoutLaterItemToCart } from "@/api/customer/checkoutLater";
import { nameToSlug, potToAbbreviation, sizeToAbbreviation } from "@/utils/utils";
import Box from "@mui/material/Box";
import { useAuth } from "@/context/AuthContext";
import { removeFromGuestCart, setUserCartItems, toggleItemSelection, updateGuestCartItemQuantity } from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";
import { useCartCount } from "@/hooks/useCartCount";
import { getPriceSpecificCoupons } from "@/api/customer/promoCodes";
import { transformCartData } from "@/utils/cartHelper";

const OFFER_MILESTONES = [
  { amount: 699, label: "₹699", gifts: 0, code: null },
  { amount: 999, label: "₹999", gifts: 1, code: "SAVE10" },
  { amount: 1295, label: "₹1295", gifts: 2, code: "SAVE20" },
];

const MYSTERY_THRESHOLD = 1295;
const TAX_RATE = 0.18;
// const OfferProgressSection = ({ subtotal }) => {
//   const [showCelebration, setShowCelebration] = useState(false);
//   const [lastAchieved, setLastAchieved] = useState(-1);

//   const achievedIndex = OFFER_MILESTONES.findIndex(
//     (m, i) =>
//       subtotal >= m.amount &&
//       (i === OFFER_MILESTONES.length - 1 || subtotal < OFFER_MILESTONES[i + 1]?.amount)
//   );

//   useEffect(() => {
//     if (achievedIndex > lastAchieved && achievedIndex >= 0) {
//       setShowCelebration(true);
//       setLastAchieved(achievedIndex);
//       const t = setTimeout(() => setShowCelebration(false), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [achievedIndex, lastAchieved]);

//   useEffect(() => {
//     if (subtotal > 0) {
//       const priceSpecificCoupons = getPriceSpecificCoupons(subtotal);
//     }
//   }, []);

//   const nextMilestone = OFFER_MILESTONES.find((m) => subtotal < m.amount);
//   const allUnlocked = !nextMilestone;
//   const progressPercentage = nextMilestone ? Math.min((subtotal / nextMilestone.amount) * 100, 100) : 100;

//   const getHeaderMessage = () => {
//     if (allUnlocked || (achievedIndex >= 0 && OFFER_MILESTONES[achievedIndex].gifts > 0)) {
//       return {
//         title: "🎉 Offer Unlocked!",
//         subtitle: `You've unlocked ${achievedIndex >= 0 ? OFFER_MILESTONES[achievedIndex].gifts : 0} free gift${achievedIndex >= 0 && OFFER_MILESTONES[achievedIndex].gifts > 1 ? "s" : ""
//           }!`,
//         highlight: true,
//       };
//     }
//     return {
//       title: "Unlock Exclusive Offers",
//       subtitle: "Add more items to unlock amazing deals and free gifts!",
//       highlight: false,
//     };
//   };

//   const header = getHeaderMessage();

//   return (
//     <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 border border-emerald-100 overflow-hidden">
//       {showCelebration && (
//         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 animate-pulse z-10 pointer-events-none">
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Sparkles className="w-12 h-12 text-emerald-500 animate-bounce" />
//           </div>
//         </div>
//       )}

//       <div className="relative z-0">
//         <div className="text-center mb-4">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <Gift className={`w-5 h-5 ${header.highlight ? "text-emerald-600" : "text-blue-600"}`} />
//             <h3 className={`font-bold text-base ${header.highlight ? "text-gray-800" : "text-gray-800"}`}>
//               {header.title}
//             </h3>
//           </div>
//           <p className="text-sm text-gray-600 leading-snug">{header.subtitle}</p>
//         </div>

//         {!allUnlocked && nextMilestone && (
//           <p className="text-xs text-center mb-4 font-medium text-gray-700">
//             Add ₹{(nextMilestone.amount - subtotal).toFixed(0)} more to unlock {nextMilestone.gifts} free gift
//             {nextMilestone.gifts > 1 ? "s" : ""}
//           </p>
//         )}

//         <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-6">
//           <div
//             className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
//             style={{ width: `${progressPercentage}%` }}
//           >
//             <div className="absolute inset-0 bg-white/20 animate-pulse" />
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-3 mb-4">
//           {OFFER_MILESTONES.map((milestone, index) => {
//             const isUnlocked = subtotal >= milestone.amount;
//             const isNext = !isUnlocked && (!nextMilestone || milestone.amount === nextMilestone.amount);

//             return (
//               <div
//                 key={milestone.amount}
//                 className={clsx(
//                   "relative p-3 rounded-xl border-2 transition-all duration-300",
//                   isUnlocked ? "bg-emerald-100 border-emerald-400" : isNext ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200" : "bg-white border-gray-200"
//                 )}
//               >
//                 <div className="flex justify-center mb-2">
//                   {isUnlocked ? <Check className="w-6 h-6 text-emerald-600" /> : isNext ? <Gift className="w-6 h-6 text-blue-600 animate-bounce" /> : <Lock className="w-6 h-6 text-gray-400" />}
//                 </div>

//                 <div className="text-center space-y-1">
//                   <p className="text-sm font-bold text-gray-900">{milestone.label}</p>
//                   {index > 0 && (
//                     <p
//                       className={clsx(
//                         "text-[11px] font-medium leading-tight",
//                         isUnlocked ? "text-emerald-700" : isNext ? "text-blue-700" : "text-gray-500"
//                       )}
//                     >
//                       {milestone.gifts} Free Gift{milestone.gifts > 1 ? "s" : ""}
//                     </p>
//                   )}
//                   {milestone.code && isUnlocked && (
//                     <div className="mt-1 px-2 py-0.5 bg-emerald-200 rounded text-[10px] font-bold text-emerald-900">{milestone.code}</div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {allUnlocked && (
//           <div className="text-center">
//             <p className="text-xs font-semibold text-blue-700 bg-blue-100 py-2.5 px-4 rounded-lg inline-flex items-center gap-2">
//               <Sparkles className="w-3.5 h-3.5" />
//               Sign in at checkout to claim your exclusive offers!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const OfferProgressSection = ({ subtotal, isOpen }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastAchievedCount, setLastAchievedCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await getPriceSpecificCoupons(subtotal);
        if (isMounted && response?.success && response?.data?.promoCodes) {
          const validCoupons = response.data.promoCodes
            .filter(c => c.minOrderAmount !== null)
            .sort((a, b) => Number(a.minOrderAmount) - Number(b.minOrderAmount));
          setMilestones(validCoupons);
        }
      } catch (error) {
        // console.error("Failed to fetch offers:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    let timeoutId = null;
    if (isOpen && subtotal > 0) {
      timeoutId = setTimeout(fetchOffers, 500);
    }
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [subtotal, isOpen]);

  // 2. Calculate Achieved Status
  const achievedCoupons = useMemo(() => {
    return milestones.filter(m => subtotal >= Number(m.minOrderAmount));
  }, [milestones, subtotal]);

  const currentAchievedCount = achievedCoupons.length;

  useEffect(() => {
    if (currentAchievedCount > lastAchievedCount && currentAchievedCount > 0) {
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(t);
    }
    setLastAchievedCount(currentAchievedCount);
  }, [currentAchievedCount, lastAchievedCount]);

  const nextMilestone = milestones.find((m) => subtotal < Number(m.minOrderAmount));
  const allUnlocked = milestones.length > 0 && !nextMilestone;

  let progressPercentage = 0;
  if (allUnlocked) {
    progressPercentage = 100;
  } else if (nextMilestone) {
    const target = Number(nextMilestone.minOrderAmount);
    if (target > 0) {
      progressPercentage = Math.min((subtotal / target) * 100, 100);
    }
  }

  const getDiscountLabel = (coupon) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${Math.round(coupon.discountValue)}% OFF`;
    }
    return `₹${Math.round(coupon.discountValue)} OFF`;
  };

  const getHeaderMessage = () => {
    if (loading && milestones.length === 0) {
        return { 
            title: "Curating Best Offers...", 
            subtitle: "Hold tight! We're unlocking rewards for you.", 
            highlight: false 
        };
    }
    
    if (allUnlocked) {
      return {
        title: "🎉 All Offers Unlocked!",
        subtitle: "You've qualified for maximum savings!",
        highlight: true,
      };
    }
    
    if (currentAchievedCount > 0) {
       const latest = achievedCoupons[achievedCoupons.length - 1];
       return {
        title: "🎉 Offer Unlocked!",
        subtitle: `Use code ${latest.code} for ${getDiscountLabel(latest)}`,
        highlight: true,
       };
    }

    return {
      title: "Unlock Exclusive Offers",
      subtitle: "Add more items to unlock amazing coupons!",
      highlight: false,
    };
  };

  if (!loading && milestones.length === 0) return null;

  const header = getHeaderMessage();

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 border border-emerald-100 overflow-hidden shadow-sm mt-4">
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 animate-pulse z-20 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-emerald-600 animate-bounce drop-shadow-md" />
          </div>
        </div>
      )}

      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-50/90 to-transparent z-10 pointer-events-none rounded-r-2xl" />

      <div className="relative z-0">
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            {loading && milestones.length === 0 ? (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
            ) : header.highlight ? (
                <Gift className="w-5 h-5 text-emerald-600 animate-bounce" />
            ) : (
                <TicketPercent className="w-5 h-5 text-blue-600" />
            )}
            
            <h3 className={clsx("font-bold text-base transition-all", header.highlight ? "text-emerald-900" : "text-gray-800")}>
              {header.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 leading-snug font-medium transition-all">{header.subtitle}</p>
        </div>

        {!loading && !allUnlocked && nextMilestone && (
          <div className="flex justify-center mb-5">
            <div className="bg-white border border-blue-100 shadow-sm rounded-full py-1.5 px-4 flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">Add items worth</span>
                <span className="text-xs font-bold text-emerald-600">₹{(Number(nextMilestone.minOrderAmount) - subtotal).toFixed(0)}</span>
                <span className="text-xs text-gray-500 font-medium">to unlock</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {getDiscountLabel(nextMilestone)}
                </span>
            </div>
          </div>
        )}

        <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-6 mx-1">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
          </div>
        </div>

        <div className="flex overflow-x-auto gap-3 pb-4 pt-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-1">
          {loading ? (
             [1, 2, 3].map(i => (
                <div 
                    key={i} 
                    className="min-w-[35%] shrink-0 snap-center relative p-3 rounded-xl border border-emerald-50 bg-white flex flex-col items-center justify-between min-h-[110px]"
                >
                    <div className="mb-2 bg-emerald-50 p-2 rounded-full h-8 w-8 animate-pulse" />
                    <div className="h-3 w-12 bg-gray-100 rounded-full animate-pulse mb-1" />
                    <div className="w-full h-6 bg-gray-50 rounded-md animate-pulse mt-1 border border-gray-100/50" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-pulse rounded-xl pointer-events-none" />
                </div>
             ))
          ) : (
            milestones.map((milestone) => {
                const minAmount = Number(milestone.minOrderAmount);
                const isUnlocked = subtotal >= minAmount;
                const isNext = !isUnlocked && (!nextMilestone || minAmount === Number(nextMilestone.minOrderAmount));

                return (
                <div
                    key={milestone.promoCodeId}
                    className={clsx(
                    "min-w-[35%] shrink-0 snap-center", 
                    "relative p-3 rounded-xl border flex flex-col items-center justify-between min-h-[110px] transition-all duration-300",
                    isUnlocked 
                        ? "bg-white border-emerald-400 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.2)]" 
                        : isNext 
                            ? "bg-gradient-to-b from-white to-blue-50 border-blue-300 shadow-md transform scale-[1.03] z-10" 
                            : "bg-gray-50 border-gray-200 opacity-60 grayscale"
                    )}
                >
                    <div className="mb-2">
                        {isUnlocked ? (
                            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full ring-2 ring-emerald-50">
                                <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                        ) : isNext ? (
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full ring-2 ring-blue-50 animate-pulse">
                                <Lock className="w-4 h-4" />
                            </div>
                        ) : (
                            <div className="bg-gray-200 text-gray-400 p-2 rounded-full">
                                <Lock className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <p className={clsx("text-xs font-bold mb-1", isUnlocked ? "text-gray-900" : "text-gray-500")}>
                        ₹{minAmount}
                    </p>

                    <div className={clsx(
                        "text-[10px] font-extrabold px-2 py-1 rounded-md w-full text-center truncate tracking-wide uppercase",
                        isUnlocked ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-200 text-gray-500"
                    )}>
                        {getDiscountLabel(milestone)}
                    </div>
                    
                    {isUnlocked && (
                        <div className="absolute -top-2.5 -right-2 bg-gradient-to-r from-amber-300 to-amber-400 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm border border-white rotate-6 hover:rotate-0 transition-transform cursor-default z-20">
                            {milestone.code}
                        </div>
                    )}
                </div>
                );
            })
          )}
          
          <div className="min-w-[10px] shrink-0" />
        </div>

        {allUnlocked && (
          <div className="text-center mt-2">
            <p className="text-[10px] font-medium text-emerald-600 bg-emerald-50 py-2 px-3 rounded-lg inline-flex items-center gap-1.5 border border-emerald-100">
              <Sparkles className="w-3 h-3" />
              Apply codes at checkout for instant savings!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const MysteryBox = () => {
  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl p-6 relative overflow-hidden border border-purple-200">
      <div className="absolute top-3 right-3 text-2xl animate-pulse">⭐</div>
      <div className="absolute bottom-3 left-3 text-2xl animate-bounce">✨</div>
      <div className="absolute top-3 left-3 text-xl animate-pulse">🌟</div>
      <div className="absolute bottom-3 right-3 text-xl animate-bounce">💫</div>

      <div className="flex justify-center mb-4">
        <div className="relative">
          <Gift className="w-16 h-16 text-purple-600 animate-pulse" style={{ animationDuration: "2s" }} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3">🎊 Mystery Surprise Unlocked! 🎊</h3>

      <p className="text-sm text-gray-700 text-center mb-3 font-medium">You've unlocked our EXCLUSIVE mystery gift!</p>

      <p className="text-xs text-gray-600 text-center mb-4">Complete your checkout to discover what amazing surprise awaits you.</p>

      <div className="flex justify-center">
        <div className="bg-white rounded-full px-4 py-2 border-2 border-purple-400 shadow-md">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Surprise Revealed at Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendedProducts = ({ currentCartItems }) => {
  const dispatch = useDispatch();
  // ✅ O(n²) → O(n) Optimization: Use Set-based filterOutById instead of .includes()
  const currentIds = useMemo(() => new Set(currentCartItems.map((item) => item.productId)), [currentCartItems]);
  const recommended = useMemo(() => filterOutById(products, currentIds).slice(0, 4), [currentIds]);

  if (recommended.length === 0) return null;

  return (
    <div className="pt-4 border-t border-gray-200">
      <h3 className="text-sm font-bold mb-4 text-gray-800 uppercase tracking-wide">You Might Also Like</h3>
      <div className="grid grid-cols-2 gap-3">
        {recommended.map((product) => {
          const variant = product.variants?.[0];
          if (!variant) return null;

          const price = variant.price || product.price?.selling || 0;
          const originalPrice = product.price?.original;
          const hasDiscount = originalPrice && originalPrice > price;

          return (
            <div key={product.id} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="relative mb-2">
                <img src={variant.image || product.images?.[0]} alt={product.name} className="w-full h-28 object-cover rounded-lg" />
                {hasDiscount && <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">SAVE</div>}
              </div>

              <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</p>

              <div className="flex items-center gap-1 mb-2">
                <span className="text-sm font-bold text-gray-900">₹{price}</span>
                {hasDiscount && <span className="text-[10px] text-gray-500 line-through">₹{originalPrice}</span>}
              </div>

              <button
                // onClick={() => dispatch(addItem(product, variant, 1))}
                className="w-full bg-emerald-600 text-white text-xs font-semibold rounded-lg py-2 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const optimisticUpdateCache = (queryClient, queryKey, cartItemId, updateFn) => {
  queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData(queryKey);
  if (previousData?.data) {
    const updatedData = previousData.data.map(item =>
      item.id === cartItemId ? updateFn(item) : item
    ).filter(Boolean);

    queryClient.setQueryData(queryKey, old => ({
      ...old,
      data: updatedData
    }));
  }
  return { previousData };
};


export default function CartSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { syncCart } = useCartSync();

  // --- LOCAL STATE for Authenticated cart selection ---
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [isNavigatingToCheckout, setIsNavigatingToCheckout] = useState(false);
  const [itemLoadingId, setItemLoadingId] = useState(null);
  const [savedItemLoadingId, setSavedItemLoadingId] = useState(null);

  // --- REDUX STATE for Guest cart ---
  const guestCartData = useSelector((state) => state.persisted?.cart?.guestCartItems) || [];

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const onContinueShopping = () => {
    navigate("/category/plants");
    onClose();
  };

  // --- Fetch Authenticated Cart Items ---
  const {
    data: authenticatedCartItems = [],
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useQuery({
    queryKey: ["cart", user?.userId],
    queryFn: async () => {
      const resp = await getCartItems();
      if (resp?.data) {
        const formattedForRedux = transformCartData(resp.data);
        dispatch(setUserCartItems(formattedForRedux));
      }

      return resp;
    },
    enabled: isOpen && isAuthenticated,
    select: (resp) => {
      return resp.data.map((item) => ({
        id: item?.id,
        sellingPrice: (item?.plantVariant?.sellingPrice || 0) + (item?.potVariant?.sellingPrice || 0) || 0,
        mrp: (item?.plantVariant?.mrp || 0) + (item?.potVariant?.sellingPrice || 0) || 0,
        prevPrice: item?.priceAtAdd,
        quantity: item?.quantity,
        name: item?.plantVariant?.plantName || "Arpan's Fav Plant - Must Buy",
        image: item?.plantVariant?.imageUrl,
        plantVariantId: item?.plantVariant?.plantVariantId,
        plantSize: item?.plantVariant?.plantSize,
        potType: item?.potVariant?.potTypeName,
        plantColorHex: item?.plantVariant?.colorHex,
        potColorHex: item?.potVariant?.colorHex,
        potVariantId: item?.potVariant?.potVariantId,
      }));
    },
    staleTime: 0,
    gcTime: 0,
  });

  // ✨ UNIFIED items list for rendering
  const items = isAuthenticated ? authenticatedCartItems : guestCartData;

  useEffect(() => {
    if (isAuthenticated && authenticatedCartItems.length > 0 && selectedItemIds.length !== authenticatedCartItems.length) {
      setSelectedItemIds(authenticatedCartItems.map((item) => item.id));
    }
  }, [isAuthenticated, authenticatedCartItems]);


  // --- Fetch Saved Items ---
  const {
    data: savedItems = [],
    isLoading: isSavedLoading,
    isError: isSavedError,
    error: savedItemsError,
  } = useQuery({
    queryKey: ["savedItems"],
    queryFn: getCheckoutLaterItems,
    enabled: isOpen && isAuthenticated,
    select: (resp) => {
      return resp.data.map((item) => ({
        id: item?.id,
        sellingPrice: (item?.plantVariant?.sellingPrice || 0) + (item?.potVariant?.sellingPrice || 0) || 0,
        mrp: (item?.plantVariant?.mrp || 0) + (item?.potVariant?.mrp || 0) || 0,
        prevPrice: item?.priceAtAdd || 120,
        quantity: item?.quantity,
        name: item?.plantVariant?.plantName || "Arpan's Fav Plant - Must Buy",
        image: item?.plantVariant?.imageUrl,
      }));
    },
    staleTime: 0
  });

  const selectedItemIdsSet = useMemo(() => new Set(selectedItemIds), [selectedItemIds]);
  const selectedItems = useMemo(
    () => isAuthenticated
      ? filterByIds(items, selectedItemIdsSet)
      : items.filter((item) => item.isSelected),
    [isAuthenticated, items, selectedItemIdsSet]
  );
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const itemCount = useCartCount();

  const subtotal = totalAmount;
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal;
  const showMystery = subtotal >= MYSTERY_THRESHOLD;

  // --- useMutation Hooks for Cart Actions ---
  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }) => {
      const payload = { quantity };
      return updateCartItem(id, payload);
    },
    onMutate: async ({ id, quantity }) => {
      setItemLoadingId(id);
      const updateFn = (item) => ({ ...item, quantity, sellingPrice: item.sellingPrice });
      return optimisticUpdateCache(queryClient, ["cart"], id, updateFn);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      await syncCart();
      toast.success("Quantity updated successfully!");
    },
    onError: (error, { id, quantity }, context) => {
      toast.error(error.message || `Failed to update quantity for item ${id}. Rolling back.`);
      if (context?.previousData) {
        queryClient.setQueryData(["cart"], context.previousData);
      }
    },
    onSettled: () => {
      setItemLoadingId(null);
    }
  });

  const removeCartItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onMutate: async ({ cartItemIds }) => {
      const id = cartItemIds[0];
      setItemLoadingId(id);

      const updateFn = (item) => (item.id === id ? null : item);
      return optimisticUpdateCache(queryClient, ["cart"], id, updateFn);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      await syncCart();
      toast.success("Item removed successfully!");
    },
    onError: (error, variables, context) => {
      toast.error(error.message || `Failed to remove item. Rolling back.`);
      if (context?.previousData) {
        queryClient.setQueryData(["cart"], context.previousData);
      }
    },
    onSettled: () => {
      setItemLoadingId(null);
    }
  });

  const moveToSavedMutation = useMutation({
    mutationFn: moveCartItemToCheckoutLater,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["savedItems"] });
      toast.success("Item moved to Saved for Later.");
    },
    onError: () => {
      toast.error("Failed to move item.");
    },
    onSettled: () => {
      setItemLoadingId(null);
    }
  });

  // --- useMutation Hooks for Saved Items Actions ---
  const moveSavedToCartMutation = useMutation({
    mutationFn: moveCheckoutLaterItemToCart,
    onMutate: async (id) => {
      setSavedItemLoadingId(id);
      const updateFn = (item) => (item.id === id ? null : item);
      return optimisticUpdateCache(queryClient, ["savedItems"], id, updateFn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["savedItems"] });
      toast.success("Item moved to cart.");
    },
    onError: (error, variables, context) => {
      toast.error(error.message || `Failed to move item to cart. Rolling back.`);
      if (context?.previousData) {
        queryClient.setQueryData(["savedItems"], context.previousData);
      }
    },
    onSettled: () => {
      setSavedItemLoadingId(null);
    }
  });

  const removeSavedItemMutation = useMutation({
    mutationFn: deleteCheckoutLaterItem,
    onMutate: async (id) => {
      setSavedItemLoadingId(id);
      const updateFn = (item) => (item.id === id ? null : item);
      return optimisticUpdateCache(queryClient, ["savedItems"], id, updateFn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedItems"] });
      toast.success("Saved item removed successfully!");
    },
    onError: (error, variables, context) => {
      toast.error(error.message || `Failed to delete saved item. Rolling back.`);
      if (context?.previousData) {
        queryClient.setQueryData(["savedItems"], context.previousData);
      }
    },
    onSettled: () => {
      setSavedItemLoadingId(null);
    }
  });


  const isAnyCartActionPending = useMemo(() => {
    return (
      isCartLoading ||
      isSavedLoading ||
      !!itemLoadingId ||
      !!savedItemLoadingId ||
      updateQuantityMutation.isPending ||
      removeCartItemMutation.isPending ||
      moveToSavedMutation.isPending ||
      moveSavedToCartMutation.isPending ||
      removeSavedItemMutation.isPending
    );
  }, [
    isCartLoading, isSavedLoading, itemLoadingId, savedItemLoadingId,
    updateQuantityMutation.isPending, removeCartItemMutation.isPending,
    moveToSavedMutation.isPending, moveSavedToCartMutation.isPending,
    removeSavedItemMutation.isPending,
  ]);

  // --- ✨ UNIFIED Event Handlers ---
  const handleUpdateQuantity = (e, id, newQuantity, isGuestItem = false, plantVariantId, potVariantId) => {
    e.stopPropagation();

    if (newQuantity < 1) return;
    if (newQuantity > 99) return;

    if (isAuthenticated) {
      updateQuantityMutation.mutate({ id, quantity: newQuantity });
    } else {
      dispatch(updateGuestCartItemQuantity({
        plantVariantId: plantVariantId,
        potVariantId: potVariantId,
        quantity: newQuantity
      }));
    }
  };

  const handleRemoveItem = (e, item) => {
    e.stopPropagation();

    if (isAuthenticated) {
      const payLoad = {
        cartItemIds: [item.id],
      };
      removeCartItemMutation.mutate(payLoad);
      setSelectedItemIds((prevIds) => prevIds.filter((id) => id !== item.id));
    } else {
      dispatch(removeFromGuestCart(item));
    }
  };

  const handleNavigateToProduct = (product) => {
    navigate(`/product/${nameToSlug(product.name)}/${product.plantVariantId}?potId=${product.potVariantId}`);
    onClose();
  };

  const handleMoveToSaved = (e, id) => {
    e.stopPropagation();
    setItemLoadingId(id);
    moveToSavedMutation.mutate(id);
    setSelectedItemIds((prevIds) => prevIds.filter((itemId) => itemId !== id));
  };

  const handleMoveSavedToCart = (e, id) => {
    e.stopPropagation();
    moveSavedToCartMutation.mutate(id);
  };

  const handleRemoveSavedItem = (e, id) => {
    e.stopPropagation();
    removeSavedItemMutation.mutate(id);
  };

  // ✨ UNIFIED Toggle Selection
  const handleToggleSelection = (e, item) => {
    e.stopPropagation();
    if (isAuthenticated) {
      const itemId = item.id;
      setSelectedItemIds((prevIds) => {
        if (prevIds.includes(itemId)) {
          return prevIds.filter((id) => id !== itemId);
        } else {
          return [...prevIds, itemId];
        }
      });
    } else {
      dispatch(toggleItemSelection({ plantVariantId: item.plantVariantId, potVariantId: item.potVariantId }));
    }
  };

  // ✨ UNIFIED Proceed to Checkout
  const handleProceedToCheckout = () => {
    if (isAnyCartActionPending) {
      toast.error("Please wait for the cart actions to complete.");
      return;
    }

    if (isAuthenticated) {
      if (selectedItemIds.length === 0) {
        return;
      }
    } else {
      const selectedGuestItems = guestCartData.filter((item) => item.isSelected);
      if (selectedGuestItems.length === 0) {
        return;
      }
    }

    setIsNavigatingToCheckout(false);

    try {
      if (isAuthenticated) {
        navigate("/checkout", { state: { selectedCartItemIds: selectedItemIds, checkoutMode: "cart" } });
      } else {
        const selectedGuestItems = guestCartData.filter((item) => item.isSelected);
        navigate("/checkout", { state: { selectedGuestItems, checkoutMode: "guest-cart" } });
      }
      onClose()
    } catch (error) {
      setIsNavigatingToCheckout(true);
    }
  };

  // --- useEffect for Body Overflow and Loading State Reset ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsNavigatingToCheckout(false);
      setItemLoadingId(null);
      setSavedItemLoadingId(null);
    }
    return () => {
      document.body.style.overflow = "unset";
      setIsNavigatingToCheckout(false);
      setItemLoadingId(null);
      setSavedItemLoadingId(null);
    };
  }, [isOpen]);

  const showLoading = isCartLoading || isSavedLoading;
  const showError = isCartError || isSavedError;

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx("fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300", {
          "opacity-100 visible": isOpen,
          "opacity-0 invisible": !isOpen,
        })}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 right-0 z-[999] w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Cart sidebar"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart ({itemCount})</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="text-2xl text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {/* Loading State */}
          {isOpen && showLoading && (
            <div className="flex items-center justify-center h-full text-lg text-gray-600">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading cart...
            </div>
          )}

          {/* Error State */}
          {showError && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center text-red-600">
              <p className="mb-2 font-semibold">Error loading cart items.</p>
              <p className="text-sm">Please try again.</p>
            </div>
          )}

          {/* Empty Cart State */}
          {!showLoading && !showError && !items.length && !savedItems.length && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-xs">Start adding items to your cart to see them here</p>
              <button onClick={onContinueShopping} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                Continue Shopping
              </button>
            </div>
          )}

          {/* Offer Progress Section */}
          {!showLoading && items.length > 0 && (
            <div className="p-5">
              <OfferProgressSection subtotal={subtotal} isOpen={isOpen} />
            </div>
          )}

          {/* Cart Items */}
          {!showLoading && items.length > 0 && (
            <div className="px-5 pb-4 space-y-3">
              {items.map((item) => {
                const isSelected = isAuthenticated ? selectedItemIdsSet.has(item.id) : item.isSelected;
                const isItemUpdating = isAuthenticated && itemLoadingId === item.id;

                return (
                  <div
                    key={isAuthenticated ? item.id : `${item.plantVariantId}-${item.potVariantId}`}
                    // Add 'relative' class to the parent div for the absolute loader overlay
                    className="bg-white rounded-xl p-4 flex gap-1 items-start border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    {isItemUpdating && (
                      <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center z-20 transition-opacity duration-200">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                      </div>
                    )}

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleToggleSelection(e, item)}
                      className="mt-2 w-5 h-5 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                    />

                    <div className="flex gap-2 cursor-pointer w-full" onClick={() => handleNavigateToProduct(item)}>
                      <img src={item.image} alt={item.name} className="h-28 w-20 rounded-lg object-cover shrink-0" />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 md line-clamp-2">
                          {item.name} ({sizeToAbbreviation(item.plantSize)})
                        </h3>

                        <div className="flex items-center gap-2 mt-1 mb-2">
                          <Box component="span" sx={{ bgcolor: item.potColorHex, width: 15, height: 15, borderRadius: "50%", border: '1px solid gray' }} />
                          <span className="text-xs text-gray-600">{potToAbbreviation(item.potType)} Pot</span>
                        </div>

                        <p className="font-bold text-base text-gray-900 mb-3">₹{item.sellingPrice}</p>

                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-0 bg-gray-50 rounded-lg border border-gray-200">

                            <button
                              onClick={(e) =>
                                handleUpdateQuantity(
                                  e,
                                  item.id,
                                  item.quantity - 1,
                                  !isAuthenticated,
                                  item.plantVariantId,
                                  item.potVariantId
                                )
                              }
                              disabled={item.quantity === 1 || isItemUpdating}
                              className="p-2.5 rounded-l-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>

                            <span className="text-sm w-10 text-center font-bold text-gray-900">{item.quantity}</span>

                            <button
                              onClick={(e) =>
                                handleUpdateQuantity(
                                  e,
                                  item.id,
                                  item.quantity + 1,
                                  !isAuthenticated,
                                  item.plantVariantId,
                                  item.potVariantId
                                )
                              }
                              disabled={item.quantity > 4 || isItemUpdating}
                              className="p-2.5 rounded-r-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Save for later only shown if authenticated */}
                            {isAuthenticated && (
                              <button
                                onClick={(e) => handleMoveToSaved(e, item.id)}
                                disabled={isItemUpdating}
                                className="p-2 rounded-full hover:bg-pink-50 transition-colors"
                                title="Save for Later"
                              >
                                <Heart className="text-lg text-pink-600 cursor-pointer" />
                              </button>
                            )}

                            <button
                              onClick={(e) => handleRemoveItem(e, item)}
                              disabled={isItemUpdating}
                              className="p-2 rounded-full hover:bg-red-50 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="text-lg text-red-600 cursor-pointer" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* {!showLoading && items.length > 0 && (
            <div className="px-5 pb-4">
              <RecommendedProducts currentCartItems={items} />
            </div>
          )} */}

          {/* Saved for Later (Only shows if authenticated and has saved items) */}
          {!showLoading && isAuthenticated && savedItems.length > 0 && (
            <div className="px-5 pb-4 pt-4">
              <h3 className="text-sm font-bold mb-4 text-gray-800 uppercase tracking-wide">Saved For Later ({savedItems.length})</h3>

              <div className="space-y-3">
                {savedItems.map((item) => {
                  const isSavedItemUpdating = savedItemLoadingId === item.id;

                  return (
                    <div key={item.id}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                      {isSavedItemUpdating && (
                        <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center z-20 transition-opacity duration-200">
                          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        </div>
                      )}

                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">{item.name}</p>
                        <p className="text-sm text-gray-900 font-bold">₹{item.sellingPrice}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => handleMoveSavedToCart(e, item.id)}
                          disabled={isSavedItemUpdating}
                          className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          title="Move to Cart"
                        >
                          <ShoppingCart className="text-sm" />
                        </button>

                        <button
                          onClick={(e) => handleRemoveSavedItem(e, item.id)}
                          disabled={isSavedItemUpdating}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="text-sm" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Cart Summary */}
        {!showLoading && items.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-200 space-y-4 sticky bottom-0 shadow-lg">
            <div className="hidden lg:block space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-700">
                {/* Note: changed label from Tax to Delivery/Shipping based on context */}
                <span>Tax (18%)</span>

                <div className="flex items-center gap-2">
                  {/* The "Value" anchor - Muted and crossed out */}
                  <span className="text-xs text-gray-400 line-through decoration-gray-400">
                    ₹{tax.toFixed(2)}
                  </span>

                  {/* The Premium "FREE" Badge */}
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                    Free
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-700">
                <span>Shipping</span>

                {shipping !== 0 ? (
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">
                    <Info className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      Calculated at Checkout
                    </span>
                  </div>
                ) : (
                  <span className="font-semibold text-gray-900">
                    ₹{shipping.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-200 pt-2.5" />

              <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total?.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={selectedItems.length === 0 || isNavigatingToCheckout || isAnyCartActionPending}
              className={clsx(
                "block w-full text-center rounded-xl py-3.5 font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2",
                (selectedItems.length > 0 && !isNavigatingToCheckout && !isAnyCartActionPending) ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700" : "bg-gray-400 cursor-not-allowed"
              )}
              data-testid="button-proceed-to-checkout"
            >
              {isNavigatingToCheckout ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : isAnyCartActionPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating Cart...</span>
                </>
              ) : (
                <>Proceed to Checkout ({selectedItems.length} {selectedItems.length === 1 ? "Item" : "Items"})</>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}