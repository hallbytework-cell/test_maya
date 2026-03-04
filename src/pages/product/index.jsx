import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { toast } from "react-hot-toast";
import {
    Star,
    ShoppingCart,
    ChevronLeft,
    ChevronDown,
    Wallet,
    Minus,
    Leaf,
    ShieldCheck,
    Truck,
    Plus,
    ShoppingBag,
    Zap,
    Sparkles,
    CheckCircle2,
    Gift,
    Loader2,
    Droplets,
    Sun,
    AlertTriangle,
    Sprout,
    Package,
    Check,
    Share2,
    Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { getPlantByVariantId } from "@/api/customer/plant";
import ProductPageShimmer from "@/components/shimmer/ProductPageShimmer";
import { addCartItems } from "@/api/customer/cart";
import { addToGuestCart } from "@/redux/slices/cartSlice";
import { useAuth } from "@/context/AuthContext";
import CartSidebar from "@/components/CartSidebar";
import Navbar from "@/components/Navbar";
import PlantTabs from "../../components/products/PlantTabs";
import OptimizedImageResponsive from "@/components/OptimizedImageResponsive";
import ReviewsSection from "@/components/products/ReviewsSection";
import DeliveryPinCheck from "@/components/products/DeliveryPinCheck";
import { PLANT_SIZES } from "@/constants/plants.constants";
import SizeChart from "@/components/products/SizeChart";
import { SEOHead } from "@/components/SEOHead";
import { ProductSchema, BreadcrumbSchema, FAQSchema } from "@/components/JsonLdSchemas";
import { generateProductMetaDescription, generateMetaTitle, getCanonicalUrl } from "@/utils/seoUtils";
import { generateProductBreadcrumbs, generateProductFAQs, getProductCategory, generateProductKeywords } from "@/utils/productSeoUtils";
import logger from "@/lib/logger";
import { nameToSlug } from "@/utils/utils";
import { useCartSync } from "@/hooks/useCartSync";
import { useCartCount } from "@/hooks/useCartCount";
import { Helmet } from "react-helmet";
import PlantFAQSection from "@/components/products/PlantFAQSection";


const SIZE_UI_CONFIG = {
    [PLANT_SIZES.EXTRA_SMALL]: { abbr: "XS", label: "Extra Small" },
    [PLANT_SIZES.SMALL]: { abbr: "S", label: "Small" },
    [PLANT_SIZES.MEDIUM]: { abbr: "M", label: "Medium" },
    [PLANT_SIZES.LARGE]: { abbr: "L", label: "Large" },
    [PLANT_SIZES.EXTRA_LARGE]: { abbr: "XL", label: "Extra Large" }
};

const getSizeDisplay = (sizeString) => {
    const normalizedSize = sizeString?.toUpperCase();
    const config = SIZE_UI_CONFIG[normalizedSize];
    if (config) return config;
    return { abbr: normalizedSize.substring(0, 2), label: sizeString };
};

// --- Helper Functions ---
const getVariantImages = (data, sizeKey, selectedColorVariant) => {
    if (!data || !sizeKey || !selectedColorVariant) return [];
    const sizeProfile = data.sizeDetails[sizeKey];
    if (!sizeProfile) return [];
    const rawVariantData = sizeProfile.rawVariants?.find(
        (rv) => rv.variantId === selectedColorVariant.variantId,
    );
    if (rawVariantData?.images) {
        const primary = rawVariantData.images.find((img) => img.isPrimary)?.url;
        const others = rawVariantData.images.filter((img) => !img.isPrimary).map((img) => img.url);
        return primary ? [primary, ...others] : rawVariantData.images.map((img) => img.url);
    }
    return data.defaultImages || [];
};

const structurePlantDataForUI = (apiData) => {
    console.log("apidata= ", apiData)
    if (!apiData) return { plantName: "", scientificName: "", initialPrice: 0, allSizes: [], sizeDetails: {}, defaultImages: [], miscDetails: {} };

    const sizeDetails = {};
    const allSizes = [];
    let initialPlantPrice = 0;
    let initialImages = [];
    let defaultSizeName = "";
    let initialPlantColorVariant = null;

    (apiData.sizeProfiles || [])
        .filter((sizeProfile) => sizeProfile.variants && sizeProfile.variants.length > 0)
        .forEach((sizeProfile) => {
            const sizeKey = sizeProfile.size;
            allSizes.push(sizeKey);

            const colors = (sizeProfile.variants || []).map((variant) => {
                const primaryImage = variant.images.find((img) => img.isPrimary) || variant.images[0];
                return {
                    variantId: variant.variantId,
                    colorName: variant.color?.name,
                    hexCode: variant.color?.hexCode,
                    mrp: parseFloat(variant.mrp),
                    sellingPrice: parseFloat(variant.sellingPrice),
                    discountPercent: Math.round(((variant.mrp - variant.sellingPrice) / variant.mrp) * 100),
                    isAvailable: variant.isActive,
                    primaryImageUrl: primaryImage ? primaryImage.url : null,
                    rawVariantData: variant,
                };
            });

            const potTypes = {};
            (sizeProfile.compatiblePots?.potTypes || []).forEach((potType) => {
                const availableVariants = potType.variants.filter((v) => v.isAvailable);

                if (availableVariants.length > 0) {
                    const potColors = availableVariants.map((variant) => ({
                        potId: variant.id,
                        colorName: variant.color.name,
                        hexCode: variant.color.hexCode,
                        additionalPrice: parseFloat(variant.price),
                        sku: variant.sku,
                        imageUrl: variant.images?.[0]?.mediaUrl || null,
                    }));
                    potTypes[potType.potTypeName] = {
                        potTypeName: potType.potTypeName.replace(/_/g, " "),
                        colors: potColors,
                        basePrice: 0,
                    };
                }
            });

            sizeDetails[sizeKey] = {
                sizeId: sizeProfile.plantSizeId,
                height: sizeProfile.height,
                weight: sizeProfile.weight,
                colors,
                potTypes,
                rawVariants: sizeProfile.variants,
                careGuidelines: sizeProfile.careGuidelines || [],
                fertilizerSchedule: sizeProfile.fertilizerSchedule || [],
            };
        });

    if (allSizes.length > 0) {
        defaultSizeName = allSizes[0];
        const defaultSize = sizeDetails[defaultSizeName];
        if (defaultSize.colors.length > 0) {
            initialPlantColorVariant = defaultSize.colors[0];
            initialPlantPrice = initialPlantColorVariant.sellingPrice; // Use sellingPrice for initial display
        }
        if (defaultSize.colors[0]?.rawVariantData?.images) {
            initialImages = defaultSize.colors[0].rawVariantData.images.map((img) => img.url);
        }
    }

    return {
        plantName: apiData.name,
        scientificName: apiData.scientificName,
        description: apiData.description,
        isFeatured: apiData.isFeatured,
        initialPrice: initialPlantPrice,
        allSizes,
        defaultSize: defaultSizeName,
        defaultColor: initialPlantColorVariant,
        sizeDetails,
        defaultImages: initialImages,
        whatIsInTheBox: apiData.insideBox,
        benefits: apiData.benefits,
        images: initialImages,
        rating: apiData.rating,
        reviews: 46,
        tags: [...(apiData.tags?.bestForEmotion || []), ...(apiData.tags?.bestGiftFor || [])],
        tag: { label: apiData.isFeatured ? "Featured" : null, color: "bg-emerald-500" },
        miscDetails: {
            maintenance: apiData.maintenance,
            placeOfOrigin: apiData.placeOfOrigin,
            minimumTemperature: apiData.temperatureRange?.min,
            maximumTemperature: apiData.temperatureRange?.max,
            soil: apiData.soil,
            repotting: apiData.repotting,
        },
    };
};



const useProductSelections = (apiResponseData, urlVariantId = "", navigate, urlPotId = "") => {
    const structuredData = useMemo(() => structurePlantDataForUI(apiResponseData), [apiResponseData]);
    const { defaultSize, defaultColor, initialPrice, defaultImages } = structuredData;
    const defaultPotType = structuredData.sizeDetails[defaultSize]?.potTypes ? Object.keys(structuredData.sizeDetails[defaultSize].potTypes)[0] : null;
    const defaultPotTypeName = structuredData.sizeDetails[defaultSize]?.potTypes[defaultPotType]?.potTypeName;
    const defaultPotColor = structuredData.sizeDetails[defaultSize]?.potTypes?.[defaultPotType]?.colors?.[0]?.colorName || null;
    const initialActiveTab = "care"

    const productSlug = useMemo(() => {
        return nameToSlug(apiResponseData?.name || apiResponseData?.productName);
    }, [apiResponseData]);

    const [selections, setSelections] = useState({
        plantSize: defaultSize || null,
        plantColor: defaultColor || null,
        potType: defaultPotType,
        potColor: defaultPotColor,
        potTypeName: defaultPotTypeName,
        variantId: defaultColor?.variantId || null,
        price: defaultColor?.sellingPrice || initialPrice || 0,
        mrp: defaultColor?.mrp || initialPrice || 0,
        discountPercent: defaultColor?.discountPercent || 0,
        potPrice: 0,
        selectedImage: defaultColor?.primaryImageUrl || defaultImages[0] || "/images/placeholder.jpg",
        quantity: 1,
        activeTab: initialActiveTab,
    });

    // Inside useProductSelections hook

    const calculateTotalPrice = useCallback((sizeKey, colorVariant, potTypeKey, potColorName) => {
        let finalPrice = colorVariant?.sellingPrice || 0;

        let finalPotPrice = 0;
        if (sizeKey && potTypeKey && potColorName) {
            const sizeDetails = structuredData.sizeDetails[sizeKey];
            const potType = sizeDetails?.potTypes?.[potTypeKey];
            if (potType) {
                const potVariant = potType.colors.find((p) => p.colorName.toLowerCase() === potColorName.toLowerCase());
                if (potVariant) finalPotPrice = potVariant.additionalPrice;
            }
        }
        finalPrice += finalPotPrice;
        return { price: finalPrice, potPrice: finalPotPrice };
    }, [structuredData]);

    const updateUrl = useCallback((currentSelections) => {
        if (navigate && currentSelections.variantId) {
            let url = `/product/${productSlug}/${currentSelections.variantId}`;

            let potId = null;
            if (currentSelections.potType && currentSelections.potColor && currentSelections.plantSize) {
                const potTypeData = structuredData.sizeDetails[currentSelections.plantSize]?.potTypes?.[currentSelections.potType];
                const potVariant = potTypeData?.colors.find(c => c.colorName === currentSelections.potColor);
                potId = potVariant?.potId;
            }
            if (potId) url += `?potId=${potId}`;

            navigate(url, { replace: true });
        }
    }, [navigate, structuredData, productSlug]);

    useEffect(() => {
        if (!structuredData.allSizes.length || !urlVariantId) return;
        let foundPlantSelection = null;
        let foundSizeKey = null;
        for (const sizeKey of structuredData.allSizes) {
            const sizeDetails = structuredData.sizeDetails[sizeKey];
            // const variant = sizeDetails.colors.find((v) => v.variantId === urlVariantId);
            const variant = sizeDetails.colors.find((v) => v.variantId === Number(urlVariantId));
            if (variant) {
                foundPlantSelection = variant;
                foundSizeKey = sizeKey;
                break;
            }
        }
        if (foundPlantSelection) {
            let initialPotType = null;
            let initialPotColor = null;
            let initialPotTypeName = null;
            const sizeDetails = structuredData.sizeDetails[foundSizeKey];
            if (urlPotId) {
                for (const potTypeKey in sizeDetails.potTypes) {
                    const potTypeData = sizeDetails.potTypes[potTypeKey];
                    const potVariant = potTypeData.colors.find(p => p.potId === Number(urlPotId));
                    if (potVariant) {
                        initialPotType = potTypeKey;
                        initialPotTypeName = potTypeData?.potTypeName;
                        initialPotColor = potVariant.colorName;
                        break;
                    }
                }
            }
            if (!initialPotType) {
                initialPotType = Object.keys(sizeDetails.potTypes)[0] || null;
                initialPotTypeName = sizeDetails.potTypes[initialPotType].potTypeName;
                initialPotColor = sizeDetails.potTypes[initialPotType]?.colors?.[0]?.colorName || null;
            }
            const { price, potPrice } = calculateTotalPrice(foundSizeKey, foundPlantSelection, initialPotType, initialPotColor);
            setSelections((prev) => ({
                ...prev,
                plantSize: foundSizeKey,
                plantColor: foundPlantSelection,
                variantId: urlVariantId,
                potType: initialPotType,
                potColor: initialPotColor,
                potTypeName: initialPotTypeName,
                price: price,
                potPrice: potPrice,
                selectedImage: foundPlantSelection.primaryImageUrl || structuredData.defaultImages[0],
                mrp: foundPlantSelection.mrp,
                sellingPrice: foundPlantSelection.sellingPrice,
                discountPercent: foundPlantSelection.discountPercent
            }));
        }
    }, [structuredData, urlVariantId, urlPotId, calculateTotalPrice]);

    useEffect(() => {
        const { plantSize, plantColor, potType, potColor } = selections;
        if (plantSize && plantColor) {
            const { price, potPrice } = calculateTotalPrice(plantSize, plantColor, potType, potColor);
            setSelections((prev) => {
                if (prev.price === price && prev.potPrice === potPrice) return prev;
                return { ...prev, price: price, potPrice: potPrice };
            });
        }
    }, [selections.plantSize, selections.plantColor, selections.potType, selections.potColor, calculateTotalPrice]);

    const updateSelection = (key, value) => {
        setSelections((prev) => {
            let newSelections = { ...prev, [key]: value };
            let shouldUpdateUrl = false;
            if (key === "plantSize") {
                const newSizeKey = value;
                const newSizeDetails = structuredData.sizeDetails[newSizeKey];
                const newDefaultColor = newSizeDetails?.colors[0] || null;
                if (newDefaultColor) {
                    newSelections.plantColor = newDefaultColor;
                    newSelections.variantId = newDefaultColor.variantId;
                    newSelections.mrp = newDefaultColor.mrp;
                    newSelections.sellingPrice = newDefaultColor.sellingPrice;
                    newSelections.discountPercent = newDefaultColor.discountPercent;
                    newSelections.price = newDefaultColor.sellingPrice;
                    const defaultPotTypeKey = Object.keys(newSizeDetails.potTypes)[0] || null;
                    const defaultPotTypeName = newSizeDetails?.potTypes[defaultPotTypeKey]?.potTypeName || null;
                    const defaultPotColorName = newSizeDetails.potTypes[defaultPotTypeKey]?.colors[0]?.colorName || null;
                    newSelections.potType = defaultPotTypeKey;
                    newSelections.potColor = defaultPotColorName;
                    newSelections.potTypeName = defaultPotTypeName;
                    const newImages = getVariantImages(structuredData, newSizeKey, newDefaultColor);
                    newSelections.selectedImage = newImages[0];

                    shouldUpdateUrl = true;
                } else {
                    newSelections.plantColor = null;
                    newSelections.variantId = null;
                    newSelections.price = 0;
                    newSelections.mrp = 0;
                    newSelections.discountPercent = 0;
                    newSelections.potType = null;
                    newSelections.potColor = null;
                    newSelections.selectedImage = structuredData.defaultImages[0];
                }
            } else if (key === "plantColor") {
                const newColor = value;
                newSelections.plantColor = newColor;
                newSelections.variantId = newColor.variantId;
                newSelections.mrp = newColor.mrp;
                newSelections.sellingPrice = newColor.sellingPrice;
                newSelections.discountPercent = newColor.discountPercent;
                const sizeDetails = structuredData.sizeDetails[prev.plantSize];
                const defaultPotTypeKey = Object.keys(sizeDetails.potTypes)[0] || null;
                const defaultPotTypeName = sizeDetails?.potTypes[defaultPotTypeKey]?.potTypeName || null;
                const defaultPotColorName = sizeDetails.potTypes[defaultPotTypeKey]?.colors[0]?.colorName || null;
                newSelections.potType = defaultPotTypeKey;
                newSelections.potColor = defaultPotColorName;
                newSelections.potTypeName = defaultPotTypeName;
                const newImages = getVariantImages(structuredData, prev.plantSize, newColor);
                newSelections.selectedImage = newImages[0];
                shouldUpdateUrl = true;
            } else if (key === "potType") {
                const newPotTypeKey = value;
                const potColorsForType = structuredData.sizeDetails[prev.plantSize]?.potTypes[newPotTypeKey]?.colors;
                const defaultPotTypeName = structuredData.sizeDetails[prev.plantSize]?.potTypes[newPotTypeKey]?.potTypeName || null;
                newSelections.potTypeName = defaultPotTypeName;
                newSelections.potColor = potColorsForType?.[0]?.colorName || null;
                shouldUpdateUrl = true;
            } else if (key === "potColor") {
                shouldUpdateUrl = true;
            }
            if (shouldUpdateUrl && newSelections.variantId) updateUrl(newSelections);
            return newSelections;
        });
    };
    return { selections, updateSelection, product: structuredData };
};

// --- Main Component ---
function ProductPage() {
    const params = useParams();
    // const variantId = params.productId;
    const variantId = Number(params.productId);
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { syncCart } = useCartSync();
    const queryParams = new URLSearchParams(location.search);
    // const urlPotId = queryParams.get("potId");
    const urlPotId = Number(queryParams.get("potId"));

    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { user } = useAuth();
    const cartItemCount = useCartCount();

    // Pincode State
    const [pincode, setPincode] = useState("");
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [isCheckingPincode, setIsCheckingPincode] = useState(false);
    const [pincodeError, setPincodeError] = useState("");
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
    const [showStickyFooter, setShowStickyFooter] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);
    const [addToCartFLag, setAddToCartFlag] = useState(false)
    const observerRef = useRef(null);

    useEffect(() => {
        setIsAuthenticated(!!user);
    }, [user]);

    useEffect(() => {
        if (variantId) {
            logger.info('Product page viewed', { variantId });
            logger.track('page_view', { page: 'product', variantId });
        }
    }, [variantId]);



    const { data: data, isLoading, isFetching, isError } = useQuery({
        queryKey: ["plant", "details", variantId],
        queryFn: () => getPlantByVariantId(variantId),
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60,
        enabled: !!variantId,
        placeholderData: keepPreviousData,
    });

    const productData = data?.data;
    const { selections, updateSelection, product } = useProductSelections(productData, variantId, navigate, urlPotId);

    const plantSizes = product.allSizes;
    const currentSizeDetails = product.sizeDetails[selections.plantSize];
    const [quantity, setQuantity] = useState(1)
    const availableColors = currentSizeDetails ? currentSizeDetails.colors : [];
    const potTypes = currentSizeDetails?.potTypes ? Object.keys(currentSizeDetails.potTypes) : [];
    const potColors = selections.potType && currentSizeDetails?.potTypes[selections.potType]
        ? currentSizeDetails.potTypes[selections.potType].colors.map((c) => c) : [];
    const currentVariant = selections.plantColor;
    const currentPotDetails = currentSizeDetails?.potTypes?.[selections.potType];

    const plantId = productData?.id;

    useEffect(() => {
        setAddToCartFlag(false)
        setQuantity(1);
    }, [selections])

    // Memoized ValueItem component to prevent unnecessary re-renders
    const ValueItem = memo(({ icon: Icon, label, sub }) => (
        <div className="flex items-start gap-2.5">
            <div className="mt-0.5 p-1 bg-white rounded-md shadow-sm border border-stone-100 text-stone-600">
                <Icon className="w-3 h-3" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 leading-tight">{label}</span>
                <span className="text-[10px] text-stone-500 leading-tight">{sub}</span>
            </div>
        </div>
    ));

    ValueItem.displayName = 'ValueItem';

    // Memoized handleShare with useCallback for consistency
    const handleShare = useCallback(async () => {
        const imageUrl = selections.selectedImage;
        const fileName = 'product-image.jpg';
        const shareUrl = window.location.href;
        const shareTitle = product.plantName;
        const shareText = `Check out this beautiful ${product.plantName} from Maya Vriksh! \n\nGet it here: ${shareUrl}`;

        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: shareTitle,
                    text: shareText, // iOS WhatsApp needs the URL inside the text string to show both
                });
            } else {
                // Fallback for browsers that don't support file sharing
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                });
            }
            logger.track('product_shared', { method: 'native', variantId });
        } catch (err) {
            if (err.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(`${shareText}`);
                    toast.success("Link copied to clipboard!");
                } catch (clipErr) {
                    console.error('Clipboard failed', clipErr);
                }
            }
        }
    }, [selections.selectedImage, product.plantName, variantId]);

    // Memoized handleAdd with useCallback to prevent recreation on every render
    const handleAdd = useCallback(async (buyFlag = false) => {
        if (!currentVariant || !selections.potType || !selections.potColor) {
            toast.error("Please select all options before adding to cart.");
            return false;
        }
        const potVariant = currentPotDetails?.colors.find((c) => c.colorName === selections.potColor);
        if (!potVariant) {
            toast.error("Pot variant not found.");
            return false;
        }
        setLoadingAction(buyFlag ? 'buy_now' : 'add_to_cart');
        const item = { plantVariantId: currentVariant.variantId, potVariantId: potVariant.potId, quantity: quantity };
        try {
            if (!isAuthenticated) {
                const data = {
                    id: currentVariant.variantId,
                    plantVariantId: currentVariant.variantId,
                    potVariantId: potVariant.potId,
                    colorName: currentVariant.colorName,
                    potColorHex: potVariant.hexCode,
                    mrp: currentVariant.mrp + potVariant.additionalPrice,
                    sellingPrice: currentVariant.rawVariantData.sellingPrice + potVariant.additionalPrice,
                    plantSize: selections.plantSize,
                    name: product.plantName,
                    image: currentVariant.primaryImageUrl,
                    quantity: quantity,
                    potType: currentPotDetails.potTypeName,
                    isSelected: true,
                }
                dispatch(addToGuestCart(data));
                if (!buyFlag) {
                    toast.success(`${product.plantName} added to cart!`);
                    setAddToCartFlag(true);
                    setLoadingAction(null);
                }
                return data;
            }
            setIsAdding(true)
            const response = await addCartItems({ items: [item] });
            !buyFlag && setAddToCartFlag(true)
            setIsAdding(false)
            if (response?.success) {
                await syncCart();
                if (!buyFlag) {
                    toast.success(`${product.plantName} added to cart!`);
                    setAddToCartFlag(true);
                    setLoadingAction(null);
                }
                setIsAdding(false);
                handleCartOpen()
                return response;
            } else {
                if (!buyFlag) {
                    toast.error(response?.message || "Failed to add item.");
                } else {
                    toast.error("Please try after some time")
                }
            }
        } catch (error) {
            setIsAdding(false)
            setLoadingAction(null)
            if (!buyFlag) {
                toast.error("Failed to add item.");
            } else {
                toast.error("Please try after some time")
            }
        }
    }, [currentVariant, selections.potType, selections.potColor, quantity, isAuthenticated, currentPotDetails, product.plantName, dispatch, syncCart]);

    const mainActionsRef = useCallback((node) => {
        if (observerRef.current) observerRef.current.disconnect();
        if (node) {
            observerRef.current = new IntersectionObserver(
                ([entry]) => {
                    setShowStickyFooter(!entry.isIntersecting);
                },
                {
                    root: null,
                    threshold: 0,
                    rootMargin: "0px"
                }
            );
            observerRef.current.observe(node);
        }
    }, []);

    // Memoized handleBuy with useCallback
    const handleBuy = useCallback(async () => {
        const addToCartResp = await handleAdd(true);

        if (isAuthenticated) {
            navigate("/checkout", { state: { selectedCartItemIds: [addToCartResp.data[0].cartItemId], checkoutMode: "direct" } });
        } else {
            navigate("/checkout", { state: { selectedGuestItems: [addToCartResp], checkoutMode: "direct" } });
        }
    }, [handleAdd, isAuthenticated, navigate]);

    // Memoized handleCartOpen to prevent unnecessary re-renders
    const handleCartOpen = useCallback(() => {
        setIsCartOpen(true);
        setAddToCartFlag(false);
    }, []);

    // Memoized handleCheckPincode with useCallback
    const handleCheckPincode = useCallback(() => {
        if (!pincode.trim()) {
            setPincodeError("Please enter a PIN code");
            return;
        }
        if (pincode.length !== 6 || isNaN(pincode)) {
            setPincodeError("PIN code must be 6 digits");
            return;
        }
        setPincodeError("");
        setIsCheckingPincode(true);
        setTimeout(() => {
            setIsCheckingPincode(false);
            const date = new Date();
            date.setDate(date.getDate() + 4);
            setDeliveryInfo({
                pincode: pincode,
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            });
        }, 1000);
    }, [pincode]);

    // SOFT 404 DETECTION (Feb 26, 2026)
    // Check if URL has invalid category/product mismatch pattern
    const hasInvalidCategoryParam = location.pathname.includes('/category/') && 
                                    location.pathname.includes('plants');
    
    const isDataForCurrentProduct = productData && product.allSizes.length > 0;
    const showFullPageShimmer = (isLoading || isFetching) && !isDataForCurrentProduct;;
    if (showFullPageShimmer) return <ProductPageShimmer />;
    
    // Return empty page for soft 404 detection
    if (isError || !productData || (productData && product.allSizes.length === 0) || hasInvalidCategoryParam) {
        return (
            <div className="p-6 text-center min-h-[60vh] flex flex-col justify-center items-center">
                {/* SEO: noindex to prevent soft 404 indexing */}
                <SEOHead
                    title="Plant Not Found - MayaVriksh | Buy Plants Online India"
                    description="This plant is currently unavailable. Browse our collection of 90+ indoor plants, air-purifying plants, and Vastu-friendly plants at MayaVriksh."
                    keywords="buy plants online, indoor plants India, MayaVriksh plants"
                    canonicalUrl={getCanonicalUrl('/product')}
                    type="website"
                />
                <Helmet>
                    <meta name="robots" content="noindex, follow" />
                    <meta name="googlebot" content="noindex, follow" />
                </Helmet>
                <p className="text-lg font-semibold text-slate-900 mb-2">Product Not Found</p>
                <p className="text-sm text-slate-600 mb-4">
                    {hasInvalidCategoryParam 
                        ? "This product doesn't belong to the selected category." 
                        : "The product you're looking for doesn't exist or is unavailable."}
                </p>
                <Button onClick={() => navigate('/')} variant="default">
                    Back to Home
                </Button>
            </div>
        );
    }

    if (!currentVariant) {
        return <ProductPageShimmer />;
    }

    // Generate dynamic meta tags for SEO
    const metaTitle = generateMetaTitle(`${product.plantName} (${product.scientificName || 'Plant'}) - Buy Online India`, 'Plants');
    const metaDescription = generateProductMetaDescription({
        name: product.plantName,
        price: selections.price,
        description: product.benefits ? product.benefits.join(', ') : 'Buy online with free delivery across India.'
    });
    const canonicalUrl = getCanonicalUrl(`/product/${productSlug}/${variantId}`, ['potId']);
    const ogImage = selections.selectedImage || product.defaultImages?.[0] || 'https://mayavriksh.in/images/mvLogo.jpeg';

    // Generate SEO breadcrumbs and FAQs
    const productCategory = getProductCategory(productData);
    const seoBreadcrumbs = generateProductBreadcrumbs(product, variantId, productCategory);
    const productFAQs = generateProductFAQs(product, productCategory);
    const productKeywords = generateProductKeywords(product, productCategory);

    return (
        <div className="bg-stone-50 min-h-screen relative">
            <Helmet>
                <title>{product.plantName} | Maya Vriksh</title>
                <meta property="og:title" content={product.plantName} />
                <meta property="og:description" content={`Check out this ${product.plantName} from Maya Vriksh!`} />
                <meta property="og:image" content={selections.selectedImage} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="product" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            {/* Dynamic SEO Meta Tags */}
            <SEOHead
                title={metaTitle}
                description={metaDescription}
                keywords={productKeywords}
                canonicalUrl={canonicalUrl}
                ogUrl={canonicalUrl}
                ogImage={ogImage}
                type="product"
                price={selections.price}
                availability={currentVariant?.isAvailable !== false ? 'instock' : 'out of stock'}
                currency="INR"
            />

            {/* JSON-LD Schema Markup for SEO Rich Results */}
            <BreadcrumbSchema items={seoBreadcrumbs} />
            <FAQSchema faqs={productFAQs} />
            <ProductSchema
                name={product.plantName}
                description={product.description || metaDescription}
                image={ogImage}
                images={product.defaultImages || []}
                price={selections.price}
                originalPrice={selections.mrp}
                sku={String(variantId)}
                // Generate consistent GTIN-13 from variant ID (13 digits)
                gtin={`8901234${String(variantId).padStart(6, '0')}`.slice(-13)}
                mpn={`MV-${variantId}`}
                availability={currentVariant?.isAvailable !== false ? 'InStock' : 'OutOfStock'}
                rating={product.rating || 4.6}
                reviewCount={product.reviews || 46}
                category={productCategory ? productCategory.replace(/_/g, ' ') : 'Indoor Plants'}
                slug={String(variantId)}
                size={selections.plantSize || 'Medium'}
            />
            {/* Subtle loading indicator during variant changes */}
            {isFetching && (
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-pulse" />
            )}
            <div className="hidden lg:block">
                <Navbar onCartClick={() => setIsCartOpen(true)} onSigninClick={() => navigate("/account/profile")} />
            </div>

            {/* FULL WIDTH CONTAINER with minimal padding for "Extended" feel */}
            <div className="mx-auto pb-8 lg:pb-16 w-full max-w-[1920px] px-0 md:px-2 lg:px-4">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="text-slate-700 hover:text-slate-900">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <Link to="/" className="flex-shrink-0">
                            <OptimizedImageResponsive 
                                src="/images/rounded_mv_logo.jpg" 
                                alt="MayaVriksh" 
                                width={32}
                                height={32}
                                loading="eager"
                                fetchpriority="high"
                                className="h-8 w-auto object-contain cursor-pointer" 
                            />
                        </Link>
                        <h2 className="text-sm font-bold text-slate-900 truncate max-w-[200px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {product.plantName}
                        </h2>
                    </div>
                    <button onClick={() => setIsCartOpen(true)} className="text-slate-700 hover:text-emerald-600 relative">
                        <ShoppingCart className="w-6 h-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 lg:pt-4">

                    {/* LEFT COLUMN: Image Gallery (Sticky) */}
                    <div className="lg:col-span-7 lg:sticky lg:top-24 lg:h-[calc(100vh-4rem)] transition-opacity duration-300" style={{ opacity: isFetching ? 0.6 : 1 }}>
                        {/* Image Card - Full width on mobile */}
                        <div className="relative w-full h-[50vh] lg:h-[80vh] lg:rounded-3xl overflow-hidden shadow-lg shadow-stone-200/30 bg-white border-b lg:border border-stone-100">
                            {/* Subtle loading indicator in top-right corner */}
                            {(isFetching || isAdding) && (
                                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-sm">
                                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                                </div>
                            )}
                            <OptimizedImageResponsive
                                src={selections.selectedImage}
                                alt={product.plantName}
                                width={800}
                                height={800}
                                loading="eager"
                                fetchpriority="high"
                                className={`w-full h-full object-cover object-center transition-all duration-500 hover:scale-105 ${isFetching ? "opacity-80" : "opacity-100"}`}
                            />
                            <div className="absolute bottom-4 left-4 z-0">
                                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm ring-1 ring-stone-200/50">
                                    <div className="flex items-center gap-1 text-xs font-extrabold text-slate-900">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{" "}
                                        {product.rating || "4.8"}
                                    </div>
                                    <span className="text-stone-300 text-xs">
                                        |
                                    </span>
                                    <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wide">
                                        {product.reviews || 46} Reviews
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 px-6 lg:px-0 overflow-x-auto pb-2 scrollbar-hide ">
                            {getVariantImages(product, selections.plantSize, currentVariant).map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => updateSelection("selectedImage", url)}
                                    className={`
                                               w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 mt-2 
                                                ${selections.selectedImage === url ? "border-emerald-600 ring-2 ring-emerald-100 shadow-md scale-105" : "border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100"}
                                        `}
                                >
                                    <OptimizedImageResponsive 
                                        src={url} 
                                        alt={`thumb-${i}`} 
                                        width={64}
                                        height={64}
                                        loading="lazy"
                                        className="w-full h-full object-cover" 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Details */}
                    <div className="lg:col-span-5 bg-white lg:rounded-3xl lg:shadow-xl lg:shadow-stone-200/40 lg:border lg:border-stone-100 px-3 py-6 lg:p-8 flex flex-col gap-2 lg:gap-6 h-fit">

                        <div className={`py-2 order-0 lg:order-1 transition-opacity duration-300 ${isFetching ? "opacity-80" : "opacity-100"}`}>
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Select Size</h3>
                                    <button
                                        onClick={() => setIsSizeChartOpen(true)}
                                        className="text-[10px] text-emerald-600 font-bold underline decoration-emerald-300 hover:text-emerald-800 transition-colors"
                                    >
                                        Size Chart
                                    </button>
                                    <SizeChart isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} productData={productData} />
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {plantSizes.map((size) => {
                                        const isActive = selections.plantSize === size;
                                        const { abbr, label } = getSizeDisplay(size);
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => updateSelection("plantSize", size)}
                                                className={`
                                relative flex flex-col items-center justify-center p-1 lg:py-3 lg:px-1 rounded-xl border transition-all duration-200 group lg:min-h-[70px] cursor-pointer
                                ${isActive
                                                        ? "bg-slate-900 border-slate-900 shadow-lg shadow-slate-900/20 transform scale-[1.02]"
                                                        : "bg-stone-50/50 border-stone-200 hover:border-stone-300 hover:bg-white hover:shadow-md"
                                                    }
                                `}
                                            >
                                                <span className={`text-xl font-black leading-none mb-1 ${isActive ? "text-white" : "text-slate-800"}`}>
                                                    {abbr}
                                                </span>
                                                <span className={`text-[8px] font-bold uppercase tracking-widest ${isActive ? "text-stone-400" : "text-stone-500"}`}>
                                                    {label}
                                                </span>
                                                {isActive && (
                                                    <div className="absolute top-1.5 right-1.5 bg-white/10 rounded-full p-0.5">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400 fill-emerald-950/30" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 mt-6 border-t border-stone-100">
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Plant Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color.variantId}
                                                onClick={() => updateSelection("plantColor", color)}
                                                className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer
                                ${selections.plantColor?.variantId === color.variantId
                                                        ? "ring-[3px] ring-offset-[3px] ring-slate-900 scale-110 shadow-md"
                                                        : "ring-1 ring-stone-200 hover:ring-stone-300 hover:scale-105"}
                                `}
                                                style={{ backgroundColor: color.hexCode }}
                                                title={color.colorName}
                                            >
                                                {selections.plantColor?.variantId === color.variantId && <Check className="w-5 h-5 text-white drop-shadow-sm" />}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-stone-500 mt-2 font-medium">
                                        Selected:{" "} <span className="font-bold text-slate-900">{selections.plantColor?.colorName}</span>
                                    </p>
                                </div>
                            </div>


                            {potTypes.length > 1 && (
                                <div className="pt-4 mt-4 border-t border-stone-100">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Pot Type</h3>
                                    <div className="flex gap-3 overflow-x-auto scrollbar-hide p-1 pb-2 snap-x snap-mandatory touch-pan-x">
                                        {potTypes.map((typeKey) => {
                                            const potPrice = currentSizeDetails.potTypes[typeKey]?.colors?.[0]?.additionalPrice || 0;
                                            const isActive = typeKey === selections.potType;
                                            return (
                                                <button
                                                    key={typeKey}
                                                    onClick={() => updateSelection("potType", typeKey)}
                                                    className={`
                            flex-shrink-0 snap-center min-w-[120px] lg:min-w-[140px] p-3 lg:p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer
                            ${isActive
                                                            ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500 shadow-md shadow-emerald-100"
                                                            : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 hover:shadow-md"}
                        `}
                                                >
                                                    <div className="flex justify-between items-start mb-1 lg:mb-2">
                                                        <span className={`text-[11px] lg:text-sm font-bold uppercase tracking-tight ${isActive ? "text-emerald-900" : "text-slate-700"}`}>
                                                            {typeKey.replace('_', ' ')}
                                                        </span>
                                                        {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />}
                                                    </div>
                                                    <p className={`text-xs font-bold ${isActive ? "text-emerald-700" : "text-stone-500"}`}>
                                                        {potPrice > 0 ? `+₹${potPrice}` : "Free"}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}


                            <div className="mt-4">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Pot Color</h3>
                                <div className="flex flex-wrap gap-3">
                                    {potColors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => updateSelection("potColor", color.colorName)}
                                            disabled={!selections.potType}
                                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer
                                ${color.colorName === selections.potColor
                                                    ? "ring-[3px] ring-offset-[3px] ring-slate-900 scale-110 shadow-md"
                                                    : "ring-1 ring-stone-200 hover:ring-stone-300 hover:scale-105"}
                                `}
                                            style={{ backgroundColor: color.hexCode }}
                                            title={color.colorName}
                                        >
                                            {color.colorName === selections.potColor && <Check className="w-5 h-5 text-white drop-shadow-sm" />}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-stone-500 mt-2 font-medium">
                                    <span className="font-bold text-slate-900">{selections.potColor}</span>
                                </p>
                            </div>
                        </div>

                        <div className="relative order-1 lg:order-0 overflow-hidden rounded-3xl border border-stone-300 bg-white p-6 lg:p-10 shadow-2xl shadow-stone-200/50 group">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            {product.plantName}
                                        </h1>
                                        <button
                                            onClick={handleShare}
                                            className="p-2 rounded-full cursor-pointer hover:bg-emerald-200  transition-all duration-300"
                                        >
                                            <Share2 className="w-5 h-5 text-violet-700" />
                                        </button>
                                    </div>
                                    {product.scientificName && (
                                        <p className="text-sm italic text-stone-400 font-medium">{product.scientificName}</p>
                                    )}
                                </div>

                                <div className="flex flex-col items-start lg:items-end">
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
                                        <Wallet className="w-5 h-5 fill-amber-500 text-amber-600" />
                                        <span className="text-sm font-bold tracking-wide">Earn {Math.ceil(selections.price * 0.1)} Coins</span>
                                    </div>
                                    {/* <span className="text-[11px] text-stone-400 font-medium mt-1">Save ₹{Math.floor(selections.price * 0.10)} on your next order</span> */}
                                </div>
                            </div>

                            <div className="flex items-end gap-4 mb-8">
                                <span className="text-4xl lg:text-5xl font-medium text-slate-900 leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    <sup className="text-2xl text-stone-400 font-sans pr-1">₹</sup>
                                    {(selections.price * selections.quantity).toFixed(0)}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xl text-stone-400 line-through">₹{(selections.mrp * selections.quantity).toFixed(0)}</span>
                                    <span className="text-xs font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-md mt-1">
                                        Save {selections.discountPercent}% OFF
                                    </span>
                                </div>
                            </div>

                            <div className="bg-stone-100 rounded-3xl p-6 lg:p-8 border border-stone-200 mb-8">
                                <p className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6">Premium Kit Includes</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-6 gap-x-8">
                                    <ValueItem icon={Leaf} label="A+ Grade Plant" sub="Healthy & Sanitized" />
                                    <ValueItem icon={Gift} label={selections.potTypeName || "Premium Pot"} sub="Durable Finish" />
                                    <ValueItem icon={Sparkles} label="Nutrient Mix" sub="Slow Release Fertilizer" />
                                    <ValueItem icon={ShieldCheck} label="Safe Delivery" sub="Damage Protection" />
                                </div>
                            </div>

                            {/* Shipping Bar */}
                            <div className="flex items-center justify-between border-t border-stone-100 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100/50 rounded-xl">
                                        <Truck className="w-5 h-5 text-emerald-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Free Shipping over ₹999</p>
                                        <p className="text-xs text-stone-500">With a belief that you are the best parent</p>
                                    </div>
                                </div>
                                <div className="text-2xl">😊</div>
                            </div>
                        </div>
                        <div className="order-2">
                            <DeliveryPinCheck />
                        </div>
                        <div className="border order-2 border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full flex justify-between items-center px-5 py-4 bg-white hover:bg-stone-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 text-emerald-600 group-hover:border-emerald-200 group-hover:text-emerald-700 transition-all">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-sm font-bold text-slate-800">What's Inside the Box?</h3>
                                        <p className="text-xs font-medium text-stone-500 mt-0.5">
                                            {isOpen ? "Hide items" : `Unbox ${(product.whatIsInTheBox || []).length} premium items`}
                                        </p>
                                    </div>
                                </div>
                                <div className={`p-1.5 rounded-full text-stone-400 bg-stone-50 transition-all duration-300 cursor-pointer ${isOpen ? 'rotate-180 text-slate-600' : ''}`}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </button>

                            {isOpen && (
                                <div className="p-5 bg-stone-100 border-t border-stone-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(product.whatIsInTheBox || []).map((item, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-white shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-300 group/item">
                                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover/item:bg-emerald-50 group-hover/item:text-emerald-600 transition-colors">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-slate-800">{item || "Mystery Item"}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Actions Ref */}
                        <div ref={mainActionsRef} className="mt-2 lg:mt-6 order-2 pt-2 border-t border-stone-200/80  ">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between p-2 lg:p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                    <label className="text-xs font-black text-slate-700 tracking-widest uppercase">
                                        Quantity
                                    </label>

                                    <div className="flex items-center bg-white rounded-full p-1 border border-stone-200 shadow-sm">
                                        <button
                                            onClick={() => setQuantity(quantity - 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-stone-50 rounded-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-stone-50 disabled:hover:text-slate-600"
                                            disabled={quantity === 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>

                                        <input
                                            type="number"
                                            value={quantity}
                                            readOnly
                                            className="w-12 text-center bg-transparent font-black text-slate-900 text-lg focus:outline-none"
                                            min="1"
                                        />

                                        <button
                                            disabled={quantity >= 5}
                                            onClick={() => {
                                                setQuantity(quantity + 1)
                                            }}
                                            className="w-10 h-10 flex items-center justify-center bg-stone-50 rounded-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full">
                                    <Button
                                        onClick={() => {
                                            handleAdd(false)
                                        }}
                                        // Disable if ANY action is loading
                                        disabled={!currentVariant || !selections.potType || !selections.potColor || !!loadingAction}
                                        className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black tracking-widest uppercase shadow-xl shadow-slate-900/20 transition-all hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <span className="flex items-center gap-2 cursor-pointer">
                                            {loadingAction === 'add_to_cart' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Add to Bag
                                                </>
                                            )}
                                        </span>
                                    </Button>

                                    <Button
                                        onClick={handleBuy}
                                        // Disable if ANY action is loading
                                        disabled={!currentVariant || !selections.potType || !selections.potColor || !!loadingAction}
                                        className="flex-1 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-black tracking-widest uppercase shadow-xl shadow-emerald-600/20 transition-all hover:shadow-2xl border-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <span className="flex items-center gap-2">
                                            {loadingAction === 'buy_now' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4 fill-current" />
                                                    Buy Now
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 order-2 gap-3 py-3">
                            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-stone-100 shadow-sm text-center gap-2 transition-transform hover:scale-105">
                                <div className="p-1.5 bg-blue-50 rounded-xl text-blue-500"><Droplets className="w-4 h-4" /></div>
                                <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-widest">Water 2x/Wk</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-stone-100 shadow-sm text-center gap-2 transition-transform hover:scale-105">
                                <div className="p-1.5 bg-amber-50 rounded-xl text-amber-500"><Sun className="w-4 h-4" /></div>
                                <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-widest">Bright Light</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-stone-100 shadow-sm text-center gap-2 transition-transform hover:scale-105">
                                <div className="p-1.5 bg-orange-50 rounded-xl text-orange-500"><AlertTriangle className="w-4 h-4" /></div>
                                <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-widest">Pet Caution</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-stone-100 shadow-sm text-center gap-2 transition-transform hover:scale-105">
                                <div className="p-1.5 bg-emerald-50 rounded-xl text-emerald-500"><Sprout className="w-4 h-4" /></div>
                                <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-widest">Easy Care</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-8 lg:mt-12 px-2 lg:px-8 space-y-8 lg:space-y-12">
                    <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden">
                        <PlantTabs productData={productData} activeTab={selections.activeTab} setActiveTab={(tab) => updateSelection("activeTab", tab)} plantSize={selections.plantSize} plantSizes={plantSizes} />
                    </div>
                    <PlantFAQSection plantId={productData.id} />
                    {product && (
                        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden p-4 lg:p-8">
                            <ReviewsSection variantId={currentVariant?.variantId} productName={product.plantName} plantId={plantId} />
                        </div>
                    )}
                </div>

                <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>

            {/* Sticky Bottom Action Bar */}
            {showStickyFooter && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.1)] p-4 z-50 lg:hidden animate-in slide-in-from-bottom-full duration-300 pb-safe">
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <OptimizedImageResponsive 
                                src={selections.selectedImage} 
                                alt="mini" 
                                width={48}
                                height={48}
                                loading="lazy"
                                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm" 
                            />
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black text-slate-900 truncate max-w-[120px]">{product.plantName}</span>
                                <span className="text-sm font-bold text-emerald-700">₹{(selections.price * selections.quantity).toFixed(0)}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-shrink-0">
                            <Button
                                onClick={() => handleAdd(false)}
                                disabled={!currentVariant || !selections.potType || !selections.potColor || !!loadingAction}
                                className="h-12 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase shadow-md tracking-wider disabled:opacity-70"
                            >
                                {loadingAction === 'add_to_cart' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Add"
                                )}
                            </Button>
                            <Button
                                onClick={handleBuy}
                                disabled={!currentVariant || !selections.potType || !selections.potColor || !!loadingAction}
                                className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase shadow-md shadow-emerald-200 tracking-wider disabled:opacity-70"
                            >
                                {loadingAction === 'buy_now' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Buy"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(ProductPage);
