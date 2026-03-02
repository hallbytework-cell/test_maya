import { Link } from 'react-router-dom';
import { Rocket, Sparkles, Zap, Clock } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const NewLaunched = () => {

    // Slot 1: Hero Features (Icons below description)
    const features = [
        { icon: Zap, label: 'Just Arrived' },
        { icon: Sparkles, label: 'Trending Now' },
        { icon: Clock, label: 'Limited Stock' }
    ];

    // Slot 2: Middle Section (Optional Categories/Filters)
    const newCollections = [
        { name: 'Exotic Plants', emoji: '🌿' },
        { name: 'Designer Pots', emoji: '🏺' },
        { name: 'Rare Finds', emoji: '💎' },
        { name: 'Succulents', emoji: '🌵' }
    ];

    return (
        <GenericCategoryPage
            // --- Logic & SEO ---
            categoryTag="NEW_LAUNCH" 
            faqCategoryKey="new-launched" // Ensure this key exists in your FAQSchema
            pageUrl="/new-launched"
            breadcrumbName="New Arrivals"
            
            // --- Text Content ---
            title="New Launched Plants"
            description="Explore our latest collection of exotic plants and designer planters. Be the first to bring home the freshest trends in indoor gardening."
            subHeading="Fresh Arrivals"
            subHeadingDesc="The latest additions to our green family, waiting for a home"
            
            // --- Styling ---
            icon={Rocket}
            heroGradient="from-violet-600 to-fuchsia-600"
            
            // --- Slot 1: Hero Features ---
            heroExtraContent={
                <div className="flex flex-wrap gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <feature.icon className="w-5 h-5" />
                            <span>{feature.label}</span>
                        </div>
                    ))}
                </div>
            }

            // --- Slot 2: Middle Section (Collections) ---
            middleSection={
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Explore Collections
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {newCollections.map((cat, index) => (
                            <Link
                                key={index}
                                to={`/search?q=${cat.name.toLowerCase()}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-violet-300 hover:shadow-md transition-all"
                            >
                                <span>{cat.emoji}</span>
                                <span className="font-medium text-gray-700">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default NewLaunched;