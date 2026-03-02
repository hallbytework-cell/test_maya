const LocalBusinessSchema = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://mayavriksh.in/#organization",
        "name": "MayaVriksh - Indoor Plants India",
        "alternateName": "Maya Vriksh Plants",
        "description": "Buy fresh indoor plants online in India. Vastu-friendly, air-purifying plants with free delivery across India. Perfect plants for homes, offices & gifting.",
        "url": "https://mayavriksh.in",
        "logo": "https://mayavriksh.in/images/mvLogo.jpeg",
        "image": "https://mayavriksh.in/images/mvLogo.jpeg",
        "telephone": "+91-XXXXXXXXXX",
        "email": "care.mayavriksh@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kolkata",
            "addressLocality": "Kolkata",
            "addressRegion": "West Bengal",
            "postalCode": "700001",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "22.5726",
            "longitude": "88.3639"
        },
        "areaServed": [
            {
                "@type": "Country",
                "name": "India"
            },
            {
                "@type": "State",
                "name": "West Bengal"
            },
            {
                "@type": "City",
                "name": "Kolkata"
            }
        ],
        "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "22.5726",
                "longitude": "88.3639"
            },
            "geoRadius": "5000000"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "21:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Sunday",
                "opens": "10:00",
                "closes": "18:00"
            }
        ],
        "priceRange": "₹₹",
        "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"],
        "currenciesAccepted": "INR",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Plant Collection",
            "itemListElement": [
                {
                    "@type": "OfferCatalog",
                    "name": "Indoor Plants",
                    "description": "Air-purifying indoor plants for homes and offices"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Vastu Plants",
                    "description": "Auspicious plants as per Vastu Shastra"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Gift Plants",
                    "description": "Perfect plants for gifting on all occasions"
                }
            ]
        },
        "sameAs": [
            "https://www.facebook.com/mayavriksh",
            "https://www.instagram.com/mayavriksh",
            "https://twitter.com/mayavriksh"
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "500",
            "bestRating": "5",
            "worstRating": "1"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default LocalBusinessSchema;