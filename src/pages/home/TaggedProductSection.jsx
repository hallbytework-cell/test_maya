import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { getPlantsByTag } from "../../api/customer/plant";
import ProductSection from '../../components/ui/sections/ProductSection';

export default function TaggedProductSection({ title, tag, allCampaignTags, initialData, viewAllHref }) {
    const {
        data: apiPlants = initialData || [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["plants", "byTag", tag, 4], 
        queryFn: () => getPlantsByTag(tag, 4),
        staleTime: 1000 * 60 * 30,  
        gcTime: 1000 * 60 * 60,   
        initialData: initialData || undefined,
    });

    const products = useMemo(() => {
        if (!apiPlants) return [];

        return apiPlants.map(plant => {
            
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
    }, [apiPlants]);
    
    const linkState = { 
      preSelectedTags: allCampaignTags 
    };

    if (isLoading) {
        return (
            <ProductSection
                title={title}
                products={Array(4).fill({})} 
                isLoading={true}
                viewAllHref={viewAllHref}
                linkState={linkState}
            />
        );
    }

    if (isError) {
        return null;
    }

    if (!products.length) {
        return null;
    }

    return (
        <ProductSection
            products={products}
            title={title}
            viewAllHref={viewAllHref}
            linkState={linkState}
        />
    );
}

TaggedProductSection.propTypes = {
    title: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
};