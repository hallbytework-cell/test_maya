import { useMemo } from 'react';

const FAQSchema = ({ faqs }) => {
    const schema = useMemo(() => {
        if (!faqs || faqs.length === 0) return null;

        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
    }, [faqs]);

    if (!schema) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export const categoryFAQs = {
    'indoor-plants': [
        { question: "Which indoor plants are best for beginners in India?", answer: "Money Plant, Snake Plant, and Pothos are excellent choices for beginners as they require minimal care and can survive in low light conditions common in Indian homes." },
        { question: "How often should I water indoor plants?", answer: "Most indoor plants need watering once a week. Check if the top inch of soil is dry before watering. Overwatering is the most common cause of plant death." },
        { question: "Do indoor plants purify air?", answer: "Yes! NASA studies show indoor plants like Snake Plant, Peace Lily, and Spider Plant can remove toxins like formaldehyde and benzene from indoor air." },
        { question: "Can indoor plants survive in AC rooms?", answer: "Yes, many plants like ZZ Plant, Rubber Plant, and Dracaena thrive in air-conditioned environments. Ensure moderate humidity and avoid placing plants directly under AC vents." },
    ],
    'vastu-plants': [
        { question: "Which plants are good for Vastu in home?", answer: "Money Plant, Bamboo, Tulsi, and Jade Plant are considered auspicious as per Vastu Shastra. They attract positive energy and prosperity." },
        { question: "Where should I place Vastu plants?", answer: "Place Money Plant in the Southeast for wealth, Bamboo in the East for health, and Tulsi in the Northeast for spiritual growth." },
        { question: "Which plants should be avoided as per Vastu?", answer: "Thorny plants like cactus, and plants with milky sap should be avoided inside the house as per Vastu principles." },
        { question: "Is Lucky Bamboo really lucky?", answer: "In both Vastu and Feng Shui, Lucky Bamboo is believed to bring good fortune, prosperity, and positive chi energy when placed correctly." },
    ],
    'gift-plants': [
        { question: "Which plants make the best gifts?", answer: "Jade Plant (for prosperity), Money Plant (for good luck), Peace Lily (for harmony), and Bonsai (for patience) are popular gift choices in India." },
        { question: "Are plants good gifts for housewarming?", answer: "Yes! Plants are excellent housewarming gifts. They purify air, bring positive energy, and are considered auspicious in Indian culture." },
        { question: "Can I send plants as gifts online in India?", answer: "Yes, MayaVriksh delivers fresh, healthy plants across India with secure packaging to ensure plants arrive in perfect condition." },
        { question: "What plant should I gift for Diwali?", answer: "Tulsi, Money Plant, and Lucky Bamboo are ideal Diwali gifts as they are considered auspicious and bring prosperity." },
    ],
    'air-purifying': [
        { question: "Which plants are best for air purification?", answer: "Snake Plant, Peace Lily, Spider Plant, Areca Palm, and Rubber Plant are NASA-approved air-purifying plants effective for Indian homes." },
        { question: "How many air-purifying plants do I need?", answer: "For optimal air purification, NASA recommends at least one plant per 100 square feet. A typical Indian room needs 2-3 medium-sized plants." },
        { question: "Do air-purifying plants work in bedrooms?", answer: "Yes! Snake Plant and Peace Lily are perfect for bedrooms as they release oxygen at night, improving sleep quality." },
        { question: "Can plants remove pollution from air?", answer: "Yes, plants absorb pollutants like formaldehyde, benzene, and trichloroethylene through their leaves and roots, naturally cleaning indoor air." },
    ],
    'best-sellers': [
        { question: "What are the most popular plants in India?", answer: "Money Plant, Snake Plant, Jade Plant, Areca Palm, and Peace Lily are consistently our best-selling plants due to their easy care and benefits." },
        { question: "Why is Money Plant so popular?", answer: "Money Plant is popular because it's easy to grow, purifies air, brings good luck as per Vastu, and can grow in water or soil." },
        { question: "Which plant is low maintenance?", answer: "Snake Plant is the most low-maintenance plant. It survives weeks without water, tolerates low light, and rarely needs fertilizing." },
        { question: "What plants are trending in 2024?", answer: "Monstera, Philodendron, and rare variegated plants are trending. Sustainable and eco-friendly plant choices are also gaining popularity." },
    ],
    'easy-care-plants': [
        { question: "Which plants require the least maintenance?", answer: "Snake Plant, ZZ Plant, Money Plant, and Aloe Vera are extremely low-maintenance and perfect for busy lifestyles." },
        { question: "How often should I water easy-care plants?", answer: "Most easy-care plants need watering once every 10–14 days. Always check soil moisture before watering." },
        { question: "Are easy-care plants suitable for offices?", answer: "Yes! Plants like ZZ Plant and Snake Plant thrive in office lighting and require minimal attention." },
        { question: "Do easy-care plants need fertilizers?", answer: "Minimal fertilizing is required. Feeding once every 2–3 months during the growing season is usually sufficient." },
    ],

    'new-launched': [
        { question: "What are the newly launched plants?", answer: "Our new arrivals include rare Monstera varieties, decorative Bonsai, exotic Philodendrons, and premium ceramic planter combos." },
        { question: "Are new-launched plants beginner-friendly?", answer: "Some new plants are beginner-friendly, while rare varieties may require special care. Check product descriptions for care details." },
        { question: "Do new plants come with care instructions?", answer: "Yes, every newly launched plant includes detailed care instructions to ensure healthy growth." },
        { question: "Are new arrivals available across India?", answer: "Yes, we deliver new plant collections across India with secure packaging to maintain freshness." },
    ],

    'trending': [
        { question: "Which plants are trending right now?", answer: "Monstera Deliciosa, Pink Syngonium, Fiddle Leaf Fig, and rare variegated plants are currently trending in India." },
        { question: "Why are variegated plants popular?", answer: "Variegated plants are popular for their unique leaf patterns and aesthetic appeal, making them perfect for modern interiors." },
        { question: "Are trending plants difficult to maintain?", answer: "Some trending plants require moderate care, but many are beginner-friendly with proper light and watering." },
        { question: "Do trending plants make good gifts?", answer: "Yes! Trendy plants are stylish and thoughtful gifts for birthdays, anniversaries, and housewarmings." },
    ],

    'featured': [
        { question: "What are featured plants?", answer: "Featured plants are specially curated selections based on popularity, seasonal relevance, and customer reviews." },
        { question: "How are featured plants selected?", answer: "Our team selects featured plants based on quality, uniqueness, customer demand, and overall plant health." },
        { question: "Are featured plants on discount?", answer: "Featured plants may include special offers or combo deals. Check the product page for current promotions." },
        { question: "Do featured plants change frequently?", answer: "Yes, featured collections are updated regularly to highlight seasonal and trending plants." },
    ],
    'sun-loving-plants': [
        { question: "Which plants grow best in direct sunlight?", answer: "Succulents, Cactus, Bougainvillea, Hibiscus, and Adenium thrive in bright direct sunlight and are perfect for balconies and terraces in India." },
        { question: "How many hours of sunlight do sun-loving plants need?", answer: "Most sun-loving plants require at least 6–8 hours of direct sunlight daily for healthy growth and flowering." },
        { question: "Can sun-loving plants survive indoors?", answer: "Sun-loving plants can survive indoors only if placed near south or west-facing windows with strong natural light. Otherwise, they may become leggy and weak." },
        { question: "How often should I water sun-loving plants?", answer: "Sun-loving plants dry out faster, so check the soil frequently. Water when the top 1–2 inches of soil are dry. Avoid overwatering, especially for succulents." },
    ],
};

export default FAQSchema;