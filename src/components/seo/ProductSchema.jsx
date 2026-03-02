import { useMemo } from 'react';

const ProductSchema = ({ product, reviews = [], aggregateRating = null }) => {
    const schema = useMemo(() => {
        if (!product) return null;

        const baseSchema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description || `Buy ${product.name} online at MayaVriksh`,
            "image": product.images?.[0] || product.image,
            "brand": {
                "@type": "Brand",
                "name": "MayaVriksh"
            },
            "sku": product.sku || product.id,
            "offers": {
                "@type": "Offer",
                "url": `https://mayavriksh.in/product/${product.id}`,
                "priceCurrency": "INR",
                "price": product.price || product.variants?.[0]?.plant_price,
                "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": "MayaVriksh"
                }
            }
        };

        if (aggregateRating || (reviews && reviews.length > 0)) {
            const avgRating = aggregateRating?.ratingValue || 
                (reviews.length > 0 
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
                    : 4.5);
            
            baseSchema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": avgRating.toFixed(1),
                "reviewCount": aggregateRating?.reviewCount || reviews.length || 10,
                "bestRating": "5",
                "worstRating": "1"
            };
        }

        if (reviews && reviews.length > 0) {
            baseSchema.review = reviews.slice(0, 5).map(review => ({
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": review.rating,
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": review.author || "Customer"
                },
                "reviewBody": review.text || review.comment,
                "datePublished": review.date || new Date().toISOString()
            }));
        }

        return baseSchema;
    }, [product, reviews, aggregateRating]);

    if (!schema) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default ProductSchema;