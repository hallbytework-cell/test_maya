import { Award, TrendingUp, Truck, ShieldCheck } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const BestSellers = () => {
    
    const stats = [
        { icon: TrendingUp, label: 'Top Rated' },
        { icon: Truck, label: 'Free Delivery' },
        { icon: ShieldCheck, label: 'Quality Guaranteed' },
    ];

    return (
        <GenericCategoryPage
            // Logic
            categoryTag="BEST_SELLER"
            faqCategoryKey="best-sellers"
            pageUrl="/best-sellers"
            
            // Content
            title="Best Selling Plants in India"
            description="Discover India's most loved plants! Our best sellers are chosen by thousands of happy customers. Fresh, healthy plants with guaranteed delivery across India."
            breadcrumbName="Best Sellers"
            subHeading="Most Popular Plants"
            subHeadingDesc="These plants have earned their spot as customer favorites"
            
            // Styling
            icon={Award}
            heroGradient="from-amber-500 to-orange-600"
            
            // Layout Specifics (Passing JSX as a prop)
            heroExtraContent={
                <div className="flex flex-wrap gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <stat.icon className="w-5 h-5" />
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>
            }
        />
    );
};

export default BestSellers;