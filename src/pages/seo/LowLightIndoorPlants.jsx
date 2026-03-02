import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Home, Droplets, Leaf, Eye, Sun } from 'lucide-react';
import { usePlantsByTag } from '@/hooks/useOptimizedQueries';
import ProductGrid from '@/components/ProductGrid';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { SEOHead } from '@/components/SEOHead';
import { LANDING_PAGE_SEO } from '@/data/seoMetaTags';
import logger from '@/lib/logger';

const seoData = LANDING_PAGE_SEO.LOW_LIGHT_INDOOR;

const LowLightIndoorPlants = () => {
    const { data: products, isLoading } = usePlantsByTag('LOW_LIGHT', 20);

    useEffect(() => {
        logger.info('Low Light Indoor Plants page viewed');
        logger.track('page_view', { page: 'low-light-indoor-plants' });
    }, []);

    const breadcrumbs = useMemo(() => [
        { name: 'Home', url: 'https://mayavriksh.in/' },
        { name: 'Plants', url: 'https://mayavriksh.in/category/plants' },
        { name: 'Low Light Indoor Plants', url: 'https://mayavriksh.in/plants/low-light-indoor' },
    ], []);

    const faqs = [
        {
            question: "Which plants grow in low light in Indian homes?",
            answer: "The best low light plants for Indian homes include Snake Plant (Sansevieria), ZZ Plant (Zamioculcas), Pothos/Money Plant, Peace Lily (Spathiphyllum), Aglaonema (Chinese Evergreen), Dracaena, and Cast Iron Plant. These shade-tolerant plants thrive in north-facing rooms and dark corners common in Indian flats."
        },
        {
            question: "Can plants survive without direct sunlight in India?",
            answer: "Yes! Many tropical plants evolved under forest canopies with filtered light. In Indian homes, plants like ZZ Plant, Snake Plant, and Pothos thrive in north-facing rooms, hallways, and bathrooms with just ambient artificial light. They're perfect for apartments with limited natural light."
        },
        {
            question: "What are the best plants for north-facing room in India?",
            answer: "North-facing rooms in India receive the least direct sunlight. Best plants include ZZ Plant (nearly indestructible), Snake Plant (tolerates darkness), Pothos (trails beautifully), Peace Lily (flowers in low light), and Philodendron. These thrive with just 2-4 hours of indirect light."
        },
        {
            question: "Which plants are good for dark bathroom in India?",
            answer: "Indian bathrooms often lack windows but have high humidity. Best plants for dark bathrooms are Pothos (grows in water), Snake Plant (tolerates humidity variations), Peace Lily (loves humidity), Spider Plant, and Philodendron. They thrive in indirect bathroom light and humid conditions."
        },
        {
            question: "Do low light plants need artificial light?",
            answer: "Low light plants don't require grow lights but benefit from normal room lighting. In very dark spaces, 8-12 hours of artificial light from regular LEDs or CFLs helps. Plants like ZZ Plant and Snake Plant can survive on minimal artificial light from office or home lighting."
        },
        {
            question: "How often to water low light plants?",
            answer: "Low light plants need less water since they grow slowly. Water Snake Plant every 2-3 weeks, ZZ Plant monthly, and Pothos when topsoil dries (every 1-2 weeks). Overwatering is the #1 killer of low light plants. Always check soil moisture before watering."
        }
    ];

    const benefits = [
        { title: 'Shade Tolerant', desc: 'Thrive in dark corners', icon: Moon },
        { title: 'Apartment Friendly', desc: 'Perfect for Indian flats', icon: Home },
        { title: 'Low Maintenance', desc: 'Less water needed', icon: Droplets },
        { title: 'Air Purifying', desc: 'Clean air naturally', icon: Leaf },
    ];

    const topLowLightPlants = [
        {
            name: 'ZZ Plant',
            scientific: 'Zamioculcas zamiifolia',
            lightNeeds: 'Thrives in very low light, even offices',
            bestFor: 'Hallways, dark corners, offices',
            careLevel: 'Nearly impossible to kill',
        },
        {
            name: 'Snake Plant',
            scientific: 'Sansevieria trifasciata',
            lightNeeds: 'Low to bright indirect (very versatile)',
            bestFor: 'Bedrooms, bathrooms, any room',
            careLevel: 'Extremely low maintenance',
        },
        {
            name: 'Pothos / Money Plant',
            scientific: 'Epipremnum aureum',
            lightNeeds: 'Low to medium indirect light',
            bestFor: 'Shelves, hanging, north-facing rooms',
            careLevel: 'Very easy, grows in water too',
        },
        {
            name: 'Peace Lily',
            scientific: 'Spathiphyllum',
            lightNeeds: 'Low to medium indirect (flowers in low light)',
            bestFor: 'Living rooms, offices, bathrooms',
            careLevel: 'Easy, tells you when thirsty',
        },
        {
            name: 'Aglaonema',
            scientific: 'Chinese Evergreen',
            lightNeeds: 'Low to medium indirect light',
            bestFor: 'Living rooms, offices, bedrooms',
            careLevel: 'Very low maintenance, colorful',
        },
        {
            name: 'Dracaena',
            scientific: 'Dracaena marginata',
            lightNeeds: 'Low to bright indirect',
            bestFor: 'Corners, entryways, offices',
            careLevel: 'Easy, tolerates neglect',
        },
    ];

    const roomSuggestions = [
        {
            room: 'North-Facing Room',
            plants: 'ZZ Plant, Snake Plant, Pothos, Cast Iron Plant',
            tips: 'These rooms get the least light in India. Choose the most shade-tolerant varieties.',
        },
        {
            room: 'Dark Bathroom',
            plants: 'Pothos (in water), Peace Lily, Spider Plant, Philodendron',
            tips: 'High humidity helps. Rotate plants to brighter spot monthly if no window.',
        },
        {
            room: 'Office/Cubicle',
            plants: 'ZZ Plant, Snake Plant, Aglaonema, Lucky Bamboo',
            tips: 'Artificial office lighting is enough. Water less frequently indoors.',
        },
        {
            room: 'Hallway/Corridor',
            plants: 'Dracaena, Snake Plant, ZZ Plant, Cast Iron Plant',
            tips: 'Choose tall plants for narrow spaces. These handle minimal light well.',
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
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="text-sm mb-4">
                            <ol className="flex items-center gap-2">
                                <li><Link to="/" className="hover:underline opacity-80">Home</Link></li>
                                <li>/</li>
                                <li><Link to="/category/plants" className="hover:underline opacity-80">Plants</Link></li>
                                <li>/</li>
                                <li className="font-medium">Low Light Indoor Plants</li>
                            </ol>
                        </nav>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <Moon className="w-10 h-10" />
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Low Light Indoor Plants for Indian Homes
                            </h1>
                        </div>
                        
                        <p className="text-lg opacity-90 max-w-3xl">
                            Perfect plants for dark corners, north-facing rooms, and Indian apartments with limited sunlight. 
                            These shade-loving plants thrive where others fail. Ideal for bathrooms, hallways, and offices.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                                <benefit.icon className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                                <p className="text-sm text-gray-600">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Best Low Light Plants for Indian Apartments
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topLowLightPlants.map((plant, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-slate-100 rounded-full p-3">
                                            <Leaf className="w-6 h-6 text-slate-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{plant.name}</h3>
                                            <p className="text-sm text-slate-600 italic">{plant.scientific}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm">
                                        <p className="text-gray-700"><strong>Light:</strong> {plant.lightNeeds}</p>
                                        <p className="text-gray-600"><strong>Best For:</strong> {plant.bestFor}</p>
                                        <p className="text-green-700"><strong>Care:</strong> {plant.careLevel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Room-by-Room Plant Guide for Indian Homes
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {roomSuggestions.map((room, index) => (
                                <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Home className="w-6 h-6 text-slate-700" />
                                        <h3 className="font-semibold text-gray-900 text-lg">{room.room}</h3>
                                    </div>
                                    <p className="text-gray-700 mb-2"><strong>Best Plants:</strong> {room.plants}</p>
                                    <p className="text-gray-600 text-sm">{room.tips}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-12 bg-slate-100 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Understanding Low Light for Indian Homes
                        </h2>
                        <div className="prose prose-lg text-gray-700 max-w-none">
                            <p>
                                <strong>Low light doesn't mean no light.</strong> In Indian apartments, many rooms receive 
                                indirect light from windows, artificial lighting, or reflected light from walls. Most 
                                "low light" plants need at least some ambient light to survive.
                            </p>
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                    <h4 className="font-semibold">Bright Indirect</h4>
                                    <p className="text-sm text-gray-600">Near window, no direct sun. Most houseplants love this.</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <Eye className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                                    <h4 className="font-semibold">Medium Light</h4>
                                    <p className="text-sm text-gray-600">Few feet from window. Good for Peace Lily, Pothos.</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <Moon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                    <h4 className="font-semibold">Low Light</h4>
                                    <p className="text-sm text-gray-600">North rooms, hallways. ZZ Plant, Snake Plant thrive here.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Shop Low Light Indoor Plants
                        </h2>
                        <p className="text-gray-600">
                            Perfect shade-loving plants for Indian homes with free delivery
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
                            Frequently Asked Questions - Low Light Plants India
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

export default LowLightIndoorPlants;
