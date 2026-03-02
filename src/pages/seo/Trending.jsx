import { Link } from 'react-router-dom';
import { Flame, Zap, ArrowUpRight, BarChart3 } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const Trending = () => {

    // Slot 1: Hero Features (Icons below description)
    const features = [
        { icon: Zap, label: 'Selling Fast' },
        { icon: BarChart3, label: 'High Demand' },
        { icon: ArrowUpRight, label: 'Rising Popularity' }
    ];

    // Slot 2: Middle Section (Current Trend Categories)
    const trendCategories = [
        { name: 'Instagram Favorites', emoji: '📸' },
        { name: 'Minimalist Decor', emoji: '✨' },
        { name: 'WFH Desk Plants', emoji: '💻' },
        { name: 'Statement Pieces', emoji: '🎨' }
    ];

    return (
        <GenericCategoryPage
            // --- Logic & SEO ---
            categoryTag="TRENDING"
            faqCategoryKey="trending" // Ensure this key exists in your FAQSchema
            pageUrl="/trending"
            breadcrumbName="Trending"
            
            // --- Text Content ---
            title="Trending Plants India"
            description="See what everyone is talking about! These are the hottest plants of the season, dominating social media feeds and Indian homes right now."
            subHeading="What Everyone's Buying"
            subHeadingDesc="The most sought-after plants of the moment, moving fast!"
            
            // --- Styling ---
            icon={Flame}
            heroGradient="from-red-500 to-pink-600"
            
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

            // --- Slot 2: Middle Section (Trend Categories) ---
            middleSection={
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Current Trends
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {trendCategories.map((cat, index) => (
                            <Link
                                key={index}
                                to={`/search?q=${cat.name.toLowerCase()}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-red-300 hover:shadow-md transition-all"
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

export default Trending;