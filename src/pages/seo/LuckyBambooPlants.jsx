import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Home, Gift, Star, Leaf } from 'lucide-react';
import { usePlantsByTag } from '@/hooks/useOptimizedQueries';
import ProductGrid from '@/components/ProductGrid';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { SEOHead } from '@/components/SEOHead';
import { LANDING_PAGE_SEO } from '@/data/seoMetaTags';
import logger from '@/lib/logger';

const seoData = LANDING_PAGE_SEO.LUCKY_BAMBOO;

const LuckyBambooPlants = () => {
    const { data: products, isLoading } = usePlantsByTag('LUCKY_BAMBOO', 20);

    useEffect(() => {
        logger.info('Lucky Bamboo Plants page viewed');
        logger.track('page_view', { page: 'lucky-bamboo-plants' });
    }, []);

    const breadcrumbs = useMemo(() => [
        { name: 'Home', url: 'https://mayavriksh.in/' },
        { name: 'Plants', url: 'https://mayavriksh.in/category/plants' },
        { name: 'Lucky Bamboo', url: 'https://mayavriksh.in/plants/lucky-bamboo' },
    ], []);

    const faqs = [
        {
            question: "Is lucky bamboo really bamboo?",
            answer: "No, lucky bamboo (Dracaena sanderiana) is not true bamboo. It belongs to the Dracaena family, native to Central Africa. It's called 'bamboo' because its stalks resemble bamboo. True bamboo is a grass, while lucky bamboo is a tropical water lily relative."
        },
        {
            question: "How many lucky bamboo stalks are lucky according to Feng Shui?",
            answer: "In Feng Shui, different stalk numbers have different meanings: 2 stalks = Love & Marriage, 3 stalks = Happiness, Wealth & Long Life (most popular), 5 stalks = Health, 6 stalks = Luck & Prosperity, 7 stalks = Good Health, 8 stalks = Growth & Wealth, 9 stalks = Great Luck, 21 stalks = Powerful Blessing. Avoid 4 stalks as it represents death in Chinese culture."
        },
        {
            question: "Where should I place lucky bamboo in my home according to Vastu?",
            answer: "According to Vastu Shastra, place lucky bamboo in the East (health & family), Southeast (wealth & prosperity), or North (career & business) direction. Avoid South (fire element clashes with water) and bedroom (too much active energy). Living room and office are ideal locations."
        },
        {
            question: "Can lucky bamboo grow in water only?",
            answer: "Yes! Lucky bamboo thrives in water alone. Use filtered or distilled water (no chlorine). Change water weekly. Keep water level at 1-2 inches above roots. You can add a few pebbles for stability. It can also grow in soil with good drainage, but water is more popular."
        },
        {
            question: "How to care for lucky bamboo in India?",
            answer: "Lucky bamboo care in India: 1) Use filtered water, change weekly, 2) Place in indirect light (no direct sun), 3) Keep away from AC vents, 4) Avoid chlorinated tap water, 5) Room temperature water works best, 6) Yellow leaves mean too much light or fertilizer. It's one of the easiest plants to grow."
        },
        {
            question: "Can I give lucky bamboo as a gift?",
            answer: "Yes! Lucky bamboo is one of the most popular gift plants in India. It symbolizes good luck, prosperity, and positive energy. Perfect for housewarmings, Diwali, New Year, office openings, birthdays, and weddings. The number of stalks carries specific meanings, so choose thoughtfully."
        },
        {
            question: "Why is my lucky bamboo turning yellow?",
            answer: "Yellow lucky bamboo can be caused by: 1) Too much direct sunlight (move to shade), 2) Chlorinated tap water (use filtered water), 3) Too much fertilizer (dilute or stop fertilizing), 4) Temperature stress (avoid AC/heater), 5) Natural aging (remove yellow leaves). Trim yellow parts and improve care."
        }
    ];

    const benefits = [
        { title: 'Good Luck', desc: 'Feng Shui prosperity symbol', icon: Sparkles },
        { title: 'Love & Harmony', desc: '2 stalks for relationships', icon: Heart },
        { title: 'Positive Energy', desc: 'Purifies home vibes', icon: Home },
        { title: 'Perfect Gift', desc: 'Auspicious for all occasions', icon: Gift },
    ];

    const stalkMeanings = [
        { stalks: '2 Stalks', meaning: 'Love & Marriage', icon: '💕', best: 'Couples, Weddings' },
        { stalks: '3 Stalks', meaning: 'Happiness, Wealth & Long Life', icon: '🌟', best: 'Most Popular Gift' },
        { stalks: '5 Stalks', meaning: 'Health & Wellness', icon: '💚', best: 'Health Wishes' },
        { stalks: '6 Stalks', meaning: 'Luck & Prosperity', icon: '🍀', best: 'Business, Career' },
        { stalks: '7 Stalks', meaning: 'Good Health', icon: '🌱', best: 'Wellness Wishes' },
        { stalks: '8 Stalks', meaning: 'Growth & Wealth', icon: '💰', best: 'Business Success' },
    ];

    const careGuide = [
        {
            title: 'Water',
            icon: '💧',
            tips: 'Use filtered or RO water. Change weekly. Keep 1-2 inches above roots.',
        },
        {
            title: 'Light',
            icon: '☀️',
            tips: 'Bright indirect light. No direct sunlight. Can tolerate low light.',
        },
        {
            title: 'Location',
            icon: '🏠',
            tips: 'East or Southeast corner. Away from AC. Room temperature area.',
        },
        {
            title: 'Feeding',
            icon: '🌿',
            tips: 'Add liquid fertilizer once a month. Very diluted. Less is more.',
        },
    ];

    return (
        <>
            <SEOHead
                title={seoData.title}
                description={seoData.description}
                keywords={seoData.keywords}
                canonicalUrl={seoData.canonicalUrl}
                ogUrl={seoData.canonicalUrl}
            />
            <BreadcrumbSchema items={breadcrumbs} />
            <FAQSchema faqs={faqs} />
            <LocalBusinessSchema />

            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="text-sm mb-4">
                            <ol className="flex items-center gap-2">
                                <li><Link to="/" className="hover:underline opacity-80">Home</Link></li>
                                <li>/</li>
                                <li><Link to="/category/plants" className="hover:underline opacity-80">Plants</Link></li>
                                <li>/</li>
                                <li className="font-medium">Lucky Bamboo</li>
                            </ol>
                        </nav>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-10 h-10" />
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Lucky Bamboo Plants Online India
                            </h1>
                        </div>
                        
                        <p className="text-lg opacity-90 max-w-3xl">
                            Bring prosperity, good luck, and positive energy to your home with Feng Shui lucky bamboo. 
                            Perfect for gifting, home decor, and office spaces. Available in 2, 3, 5, 7, and 8 layer arrangements.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                                <benefit.icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                                <p className="text-sm text-gray-600">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Lucky Bamboo Stalk Meanings - Feng Shui Guide
                        </h2>
                        <p className="text-gray-600 mb-8">
                            In Feng Shui and Chinese tradition, the number of lucky bamboo stalks carries specific meanings. 
                            Choose the right number for your intention or gift.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {stalkMeanings.map((item, index) => (
                                <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 text-center hover:border-emerald-300 transition-colors">
                                    <div className="text-3xl mb-2">{item.icon}</div>
                                    <h3 className="font-bold text-emerald-700 mb-1">{item.stalks}</h3>
                                    <p className="text-sm text-gray-700 font-medium">{item.meaning}</p>
                                    <p className="text-xs text-gray-500 mt-2">{item.best}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Note: Avoid 4 stalks as it represents death in Chinese culture. Never gift 4 stalks.
                        </p>
                    </section>

                    <section className="mb-16 bg-emerald-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Leaf className="w-6 h-6 text-emerald-600" />
                            Lucky Bamboo Care Guide for Indian Climate
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {careGuide.map((care, index) => (
                                <div key={index} className="bg-white rounded-xl p-5">
                                    <div className="text-2xl mb-3">{care.icon}</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{care.title}</h3>
                                    <p className="text-sm text-gray-600">{care.tips}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-6 h-6 text-amber-500" />
                            Vastu Placement Guide for Lucky Bamboo
                        </h2>
                        <div className="prose prose-lg text-gray-700 max-w-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-green-700 mb-3">Best Directions:</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li><strong>East:</strong> Health, family harmony, new beginnings</li>
                                        <li><strong>Southeast:</strong> Wealth, prosperity, abundance</li>
                                        <li><strong>North:</strong> Career growth, business success</li>
                                        <li><strong>Living Room:</strong> Central location for positive energy</li>
                                        <li><strong>Office Desk:</strong> Career advancement and focus</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-red-700 mb-3">Avoid These Placements:</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li><strong>South:</strong> Fire element clashes with water</li>
                                        <li><strong>Bedroom:</strong> Too much active Yang energy</li>
                                        <li><strong>Direct Sunlight:</strong> Burns leaves, negative energy</li>
                                        <li><strong>Bathroom:</strong> Drains positive energy</li>
                                        <li><strong>Near AC:</strong> Temperature stress affects chi</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Shop Lucky Bamboo Plants
                        </h2>
                        <p className="text-gray-600">
                            Buy auspicious lucky bamboo online with free delivery across India
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-72"></div>
                            ))}
                        </div>
                    ) : (
                        <ProductGrid products={products || []} />
                    )}

                    <section className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Why Lucky Bamboo is Perfect for Indian Homes
                        </h2>
                        <div className="prose prose-lg text-gray-700 max-w-none">
                            <p>
                                <strong>Lucky bamboo (Dracaena sanderiana)</strong> has been a symbol of good fortune for over 
                                4,000 years in Asian cultures. In India, it perfectly aligns with both Feng Shui and Vastu Shastra 
                                principles, making it an ideal plant for homes and offices.
                            </p>
                            <p className="mt-4">
                                Unlike real bamboo which needs outdoor conditions, lucky bamboo thrives indoors in Indian apartments. 
                                It grows beautifully in just water, requires minimal care, and brings a touch of zen to any space. 
                                The plant is believed to <strong>attract positive chi (energy)</strong> and deflect negative forces.
                            </p>
                            <p className="mt-4">
                                As a gift, lucky bamboo is considered highly auspicious for <strong>Diwali, New Year, housewarmings, 
                                weddings, and business inaugurations</strong>. The number of stalks you choose carries specific blessings, 
                                making it a thoughtful and meaningful present.
                            </p>
                        </div>
                    </section>

                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Frequently Asked Questions - Lucky Bamboo India
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <details
                                    key={index}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 group"
                                >
                                    <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                                        {faq.question}
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">
                                            ▼
                                        </span>
                                    </summary>
                                    <p className="mt-4 text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default LuckyBambooPlants;