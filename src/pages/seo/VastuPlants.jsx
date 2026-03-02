import { Sparkles, Home, Sun, Wind } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const VastuPlants = () => {
    
    // Data for the Placement Guide (Middle Section)
    const vastuTips = [
        { direction: 'North', plant: 'Money Plant', benefit: 'Financial prosperity' },
        { direction: 'East', plant: 'Bamboo', benefit: 'Health & family harmony' },
        { direction: 'South-East', plant: 'Tulsi', benefit: 'Spiritual protection' },
        { direction: 'North-East', plant: 'Jade Plant', benefit: 'Good luck & wealth' },
    ];

    // Data for the Hero Tags (Hero Section)
    const heroTags = [
        { icon: Home, label: 'Home Harmony' },
        { icon: Sun, label: 'Positive Energy' },
        { icon: Wind, label: 'Prosperity' },
    ];

    return (
        <GenericCategoryPage
            // --- Logic & SEO ---
            categoryTag="Vastu Friendly"
            faqCategoryKey="vastu-plants"
            pageUrl="/vastu-plants"
            breadcrumbName="Vastu Plants"
            
            // --- Text Content ---
            title="Vastu Plants for Home & Office"
            description="Bring positive energy and prosperity to your space with our Vastu-approved plant collection. Each plant is selected according to ancient Vastu Shastra principles for maximum benefits."
            subHeading="Auspicious Vastu Plants"
            subHeadingDesc="Carefully selected plants to bring prosperity and positive vibes to your home"
            
            // --- Styling ---
            icon={Sparkles}
            heroGradient="from-purple-600 to-indigo-700"
            
            // --- Slot 1: Hero Tags (The icons below the description) ---
            heroExtraContent={
                <div className="flex flex-wrap gap-6">
                    {heroTags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <tag.icon className="w-5 h-5" />
                            <span>{tag.label}</span>
                        </div>
                    ))}
                </div>
            }

            // --- Slot 2: Middle Section (The Placement Guide Card) ---
            middleSection={
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Vastu Plant Placement Guide
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {vastuTips.map((tip, index) => (
                            <div key={index} className="text-center p-4 bg-purple-50 rounded-xl">
                                <div className="text-purple-600 font-semibold mb-1">{tip.direction}</div>
                                <div className="font-medium text-gray-900">{tip.plant}</div>
                                <div className="text-sm text-gray-600">{tip.benefit}</div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default VastuPlants;