import { Link } from 'react-router-dom';
import { Gift, Heart, PartyPopper, Calendar } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const GiftPlants = () => {
    const features = [
        { icon: Heart, label: 'Gift Wrapped' },
        { icon: PartyPopper, label: 'All Occasions' },
        { icon: Calendar, label: 'Delivery within 5 Days' },
    ];

    // Data for Middle Section "Shop by Occasion" (Slot 2)
    const occasions = [
        { name: 'Birthday', emoji: '🎂' },
        { name: 'Anniversary', emoji: '💕' },
        { name: 'Housewarming', emoji: '🏠' },
        { name: 'Diwali', emoji: '🪔' },
        { name: 'Raksha Bandhan', emoji: '🎀' },
        { name: 'Corporate', emoji: '💼' },
    ];

    return (
        <GenericCategoryPage
            // --- Logic & SEO ---
            categoryTag="VALENTINE_GIFT"
            faqCategoryKey="gift-plants"
            pageUrl="/gift-plants"
            breadcrumbName="Gift Plants"

            // --- Text Content ---
            title="Gift Plants Online India"
            description="Give the gift of greenery! Our beautiful gift plants come in elegant pots, ready to brighten someone's day. Perfect for all occasions with pan-India delivery."
            subHeading="Perfect Gift Plants"
            subHeadingDesc="Handpicked plants that make thoughtful and lasting gifts"

            // --- Styling ---
            icon={Gift}
            heroGradient="from-pink-500 to-rose-600"

            // --- Slot 1: Hero Features (Icons below description) ---
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

            // --- Slot 2: Middle Section (Shop by Occasion Chips) ---
            middleSection={
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Shop by Occasion
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {occasions.map((occasion, index) => (
                            <Link
                                key={index}
                                to={`/search?q=${occasion.name.toLowerCase()}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-pink-300 hover:shadow-md transition-all"
                            >
                                <span>{occasion.emoji}</span>
                                <span className="font-medium text-gray-700">{occasion.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default GiftPlants;