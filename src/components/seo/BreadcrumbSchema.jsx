import { useMemo } from 'react';

const BreadcrumbSchema = ({ items }) => {
    const schema = useMemo(() => {
        if (!items || items.length === 0) return null;

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url ? `https://mayavriksh.in${item.url}` : undefined,
            })),
        };
    }, [items]);

    if (!schema) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default BreadcrumbSchema;