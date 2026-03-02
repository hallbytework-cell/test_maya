import { getPlantsByTag } from "@/api/customer/plant";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ui/cards/ProductCard";
import { ScrollReveal } from "@/components/ScrollReveal";


const ProductSkeleton = () => (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
        <div className="aspect-[4/5] bg-slate-200"></div>
        <div className="p-4 md:p-5 flex flex-col flex-grow">
            <div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="mt-auto flex items-center justify-between">
                <div className="h-6 bg-slate-200 rounded w-16"></div>
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    </div>
);

export const ProductCategories = ({
    title,
    subtitle,
    initialProducts = [],
    viewAllText = "View All",
    mobileViewAllText,
    onViewAll,
    tag = 'Trending'
}) => {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(initialProducts.length === 0);

    const finalProducts = useMemo(() => {
        if (!products) return [];

        return products.map(plant => {

            const sellingPrice = plant.sellingPrice || plant.mrp - 10;
            const originalPrice = plant.mrp;
            let discount = null;
            let finalOriginal = null;

            if (originalPrice > sellingPrice) {
                const percent = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
                discount = `${percent}% OFF`;
                finalOriginal = originalPrice;
            }

            const rating = plant.rating;
            const reviews = plant.reviewCount || plant.totalRatings || 4;

            const imageUrls = (plant.images && plant.images.length > 0)
                ? plant.images.map(img => img.mediaUrl)
                : [];

            const systemTags = plant.systemAttributes
                ? plant.systemAttributes.map(attr => attr.name)
                : [];
            return {
                id: plant.variantId,
                name: plant.name,
                price: {
                    selling: sellingPrice,
                    original: finalOriginal,
                    discount: discount || "10% OFF",
                },
                images: imageUrls,
                rating: rating,
                reviews: reviews,
                tags: systemTags,
                colors: plant.colorName ? [plant.colorName] : [],
                hexColors: plant.colorHexCode ? [plant.colorHexCode] : [],
            };
        });
    }, [products]);

    useEffect(() => {
        // Skip fetching if we already passed initial data
        if (initialProducts.length > 0) return;

        let isMounted = true;
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const fetchedProducts = await getPlantsByTag(tag, 4);
                if (isMounted) {
                    setProducts(fetchedProducts);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchProducts();

        return () => { isMounted = false; };
    }, [tag, initialProducts.length]);

    if (!isLoading && (!products || products.length === 0)) return null;

    return (
        <section className="py-2 md:py-8 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
            <ScrollReveal className="flex justify-between items-end mb-8 md:mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-[#1A3626]">{title}</h2>
                    {subtitle && (
                        <p className="text-slate-500 mt-2 text-sm md:text-base">{subtitle}</p>
                    )}
                </div>
                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="hidden md:flex px-6 py-2.5 rounded-full border border-[#1A3626] text-[#1A3626] font-bold hover:bg-[#1A3626] hover:text-white transition-colors"
                    >
                        {viewAllText}
                    </button>
                )}
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 xl:gap-10 items-stretch">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <ScrollReveal key={`skeleton-${idx}`} delay={idx * 100} className="h-full">
                            <ProductSkeleton />
                        </ScrollReveal>
                    ))
                ) : (
                    finalProducts.map((p, idx) => (
                        <ScrollReveal key={p.id} delay={idx * 100} className="h-full">
                            <ProductCard
                                key={p.plantId}
                                id={p.id}
                                title={p.name}
                                price={p.price}
                                tags={p.tags}
                                images={p.images}
                                rating={p.rating}
                                reviews={p.reviews}
                                colors={p.colors}
                                hexColors={p.hexColors}
                                isAnimated={true}
                            />
                        </ScrollReveal>
                    ))
                )}
            </div>

            {onViewAll && (
                <ScrollReveal delay={200}>
                    <button
                        onClick={onViewAll}
                        className="w-full mt-8 md:hidden px-6 py-4 rounded-xl border-2 border-[#1A3626] text-[#1A3626] font-bold hover:bg-[#1A3626] hover:text-white active:scale-95 transition-all"
                    >
                        {mobileViewAllText || viewAllText}
                    </button>
                </ScrollReveal>
            )}
        </section>
    );
};