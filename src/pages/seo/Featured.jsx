import { Link } from 'react-router-dom';
import { Star, Crown, ShieldCheck, ThumbsUp } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const Featured = () => {

    // Slot 1: Hero Features (Icons below description)
    const features = [
        { icon: Crown, label: 'Premium Selection' },
        { icon: ShieldCheck, label: 'Quality Checked' },
        { icon: ThumbsUp, label: 'Highly Recommended' }
    ];

    // Slot 2: Middle Section (Curated Categories)
    const curatedCollections = [
        { name: 'Low Maintenance', emoji: '🌱' },
        { name: 'Pet Friendly', emoji: '🐾' },
        { name: 'Large Plants', emoji: '🌳' },
        { name: 'Flowering', emoji: '🌺' }
    ];

    return (
        <GenericCategoryPage
            // --- Logic & SEO ---
            categoryTag="FEATURED" 
            faqCategoryKey="featured" // Ensure this key exists in your FAQSchema
            pageUrl="/featured"
            breadcrumbName="Featured Plants"
            
            // --- Text Content ---
            title="Featured Plants Collection"
            description="Hand-picked favorites by our plant experts. These featured plants are selected for their unique beauty, resilience, and ability to transform any space."
            subHeading="Editor's Top Picks"
            subHeadingDesc="Our most recommended plants for this season"
            
            // --- Styling ---
            icon={Star}
            heroGradient="from-blue-600 to-indigo-700"
            
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

            // --- Slot 2: Middle Section (Curated Chips) ---
            middleSection={
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Curated Collections
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {curatedCollections.map((collection, index) => (
                            <Link
                                key={index}
                                to={`/search?q=${collection.name.toLowerCase()}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all"
                            >
                                <span>{collection.emoji}</span>
                                <span className="font-medium text-gray-700">{collection.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default Featured;