import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Wind, Heart, Sparkles, Bed, Leaf } from 'lucide-react';
import { usePlantsByTag } from '@/hooks/useOptimizedQueries';
import ProductGrid from '@/components/ProductGrid';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { SEOHead } from '@/components/SEOHead';
import { LANDING_PAGE_SEO } from '@/data/seoMetaTags';
import logger from '@/lib/logger';

const seoData = LANDING_PAGE_SEO.AIR_PURIFYING_BEDROOM;

const AirPurifyingBedroomPlants = () => {
    const { data: products, isLoading } = usePlantsByTag('AIR_PURIFYING', 20);

    useEffect(() => {
        logger.info('Air Purifying Bedroom Plants page viewed');
        logger.track('page_view', { page: 'air-purifying-bedroom-plants' });
    }, []);

    const breadcrumbs = useMemo(() => [
        { name: 'Home', url: 'https://mayavriksh.in/' },
        { name: 'Plants', url: 'https://mayavriksh.in/category/plants' },
        { name: 'Air Purifying Bedroom Plants', url: 'https://mayavriksh.in/plants/air-purifying-bedroom' },
    ], []);

    const faqs = [
        {
            question: "Which air purifying plants are best for bedroom in India?",
            answer: "The best air purifying plants for bedroom in India are Snake Plant (releases oxygen at night), Peace Lily (removes toxins), Spider Plant (filters formaldehyde), Areca Palm (natural humidifier), and Money Plant (removes CO2). These NASA-approved plants work while you sleep to improve air quality."
        },
        {
            question: "Do bedroom plants release oxygen at night?",
            answer: "Yes! Snake Plant (Sansevieria) and Aloe Vera are special CAM plants that release oxygen at night, unlike most plants. Peace Lily and Areca Palm also improve night-time air quality by removing toxins and increasing humidity."
        },
        {
            question: "How many plants should I keep in my bedroom?",
            answer: "For optimal air purification, keep 2-4 medium-sized plants per 100 sq ft of bedroom space. For a typical 150 sq ft Indian bedroom, 3-4 plants like Snake Plant, Peace Lily, and Spider Plant provide excellent air cleaning benefits."
        },
        {
            question: "Are bedroom plants safe while sleeping?",
            answer: "Yes, bedroom plants are completely safe while sleeping. While most plants release CO2 at night, the amount is negligible (less than a sleeping pet). Plants like Snake Plant actually release oxygen at night. Avoid keeping too many plants in very small, poorly ventilated rooms."
        },
        {
            question: "Which plants help with better sleep?",
            answer: "Lavender, Jasmine, and Snake Plant are known to promote better sleep. Snake Plant releases oxygen at night and removes toxins. Peace Lily increases humidity for easier breathing. Aloe Vera improves air quality while you rest. These plants can help reduce stress and anxiety."
        },
        {
            question: "Can air purifying plants remove bedroom dust and allergens?",
            answer: "Yes, air purifying plants can trap dust particles on their leaves and remove allergens from air. Spider Plant, Areca Palm, and Peace Lily are especially effective at filtering dust, pet dander, and common bedroom allergens in Indian homes."
        }
    ];

    const benefits = [
        { title: 'Better Sleep', desc: 'Oxygen release at night', icon: Moon },
        { title: 'Cleaner Air', desc: 'Removes toxins & pollutants', icon: Wind },
        { title: 'Less Stress', desc: 'Natural calming effect', icon: Heart },
        { title: 'Fresh Morning', desc: 'Wake up refreshed', icon: Sparkles },
    ];

    const topBedroomPlants = [
        {
            name: 'Snake Plant',
            scientific: 'Sansevieria',
            benefit: 'Releases oxygen at night (CAM plant)',
            light: 'Low to bright indirect',
            placement: 'Beside bed or corner',
        },
        {
            name: 'Peace Lily',
            scientific: 'Spathiphyllum',
            benefit: 'Removes benzene, formaldehyde, trichloroethylene',
            light: 'Low to medium indirect',
            placement: 'Near window or on dresser',
        },
        {
            name: 'Spider Plant',
            scientific: 'Chlorophytum',
            benefit: 'Filters formaldehyde & carbon monoxide',
            light: 'Bright indirect',
            placement: 'Hanging basket or shelf',
        },
        {
            name: 'Areca Palm',
            scientific: 'Dypsis lutescens',
            benefit: 'Natural humidifier & air purifier',
            light: 'Bright indirect',
            placement: 'Floor corner for tropical feel',
        },
        {
            name: 'Money Plant',
            scientific: 'Epipremnum aureum',
            benefit: 'Removes CO2 & VOCs from air',
            light: 'Low to bright indirect',
            placement: 'Shelf or hanging near window',
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
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="text-sm mb-4">
                            <ol className="flex items-center gap-2">
                                <li><Link to="/" className="hover:underline opacity-80">Home</Link></li>
                                <li>/</li>
                                <li><Link to="/category/plants" className="hover:underline opacity-80">Plants</Link></li>
                                <li>/</li>
                                <li className="font-medium">Air Purifying Bedroom Plants</li>
                            </ol>
                        </nav>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <Bed className="w-10 h-10" />
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Best Air Purifying Plants for Bedroom in India
                            </h1>
                        </div>
                        
                        <p className="text-lg opacity-90 max-w-3xl">
                            Transform your bedroom into a clean air sanctuary. NASA-approved air purifying plants 
                            that release oxygen at night, remove toxins, and help you sleep better. 
                            Perfect for Indian homes and apartments.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                                <benefit.icon className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                                <p className="text-sm text-gray-600">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Top 5 Bedroom Plants According to NASA Clean Air Study
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topBedroomPlants.map((plant, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-100 rounded-full p-3">
                                            <Leaf className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{plant.name}</h3>
                                            <p className="text-sm text-indigo-600 italic">{plant.scientific}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm">
                                        <p className="text-gray-700"><strong>Benefit:</strong> {plant.benefit}</p>
                                        <p className="text-gray-600"><strong>Light:</strong> {plant.light}</p>
                                        <p className="text-gray-600"><strong>Placement:</strong> {plant.placement}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-12 bg-indigo-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Why Indian Bedrooms Need Air Purifying Plants
                        </h2>
                        <div className="prose prose-lg text-gray-700 max-w-none">
                            <p>
                                <strong>Indoor air quality in Indian homes</strong> is often 2-5 times more polluted than outdoor air due to 
                                cooking fumes, dust, furniture emissions, and limited ventilation. For bedrooms where we spend 6-8 hours daily, 
                                air purifying plants offer a natural, cost-effective solution.
                            </p>
                            <p className="mt-4">
                                Unlike air purifiers that consume electricity, <strong>bedroom plants work silently 24/7</strong> to filter 
                                toxins like formaldehyde (from furniture), benzene (from paints), and xylene (from cleaning products). 
                                Plants like Snake Plant even release oxygen at night, making them perfect bedroom companions.
                            </p>
                            <p className="mt-4">
                                According to the <strong>NASA Clean Air Study</strong>, just 2-3 plants per 100 sq ft can significantly 
                                improve indoor air quality. For a typical 150 sq ft Indian bedroom, 4-5 strategically placed plants 
                                create an optimal sleep environment.
                            </p>
                        </div>
                    </section>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Shop Air Purifying Plants for Bedroom
                        </h2>
                        <p className="text-gray-600">
                            Buy the best bedroom plants online with free delivery across India
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

                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Frequently Asked Questions - Bedroom Plants India
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

export default AirPurifyingBedroomPlants;
