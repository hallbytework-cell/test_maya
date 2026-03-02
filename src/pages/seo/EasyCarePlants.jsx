import { Link } from 'react-router-dom';
import { ShieldCheck, Droplet, SunMedium, ThumbsUp } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const EasyCarePlants = () => {
    // Features relevant to easy maintenance plants
    const features = [
        { icon: Droplet, label: 'Low Watering Needs' },
        { icon: SunMedium, label: 'Adaptable to Low Light' },
        { icon: ThumbsUp, label: 'Highly Forgiving' },
    ];

    // Data for Middle Section "Shop by Plant Type" (Slot 2)
    const plantTypes = [
        { name: 'Snake Plants', emoji: '🐍' },
        { name: 'ZZ Plants', emoji: '🌿' },
        { name: 'Succulents', emoji: '🌵' },
        { name: 'Low Light', emoji: '☁️' },
        { name: 'Air Purifying', emoji: '💨' },
        { name: 'Office Plants', emoji: '💻' },
    ];

    return (
        <GenericCategoryPage
            // --- Logic & SEO ---
            categoryTag="EASY_CARE"
            faqCategoryKey="easy-care-plants"
            pageUrl="/easy-care-plants"
            breadcrumbName="Easy Care Plants"

            // --- Text Content ---
            title="Easy Maintenance & Beginner Friendly Plants"
            description="Start your plant parenthood journey with our resilient heroes! These low-maintenance plants are highly forgiving, require minimal watering, and thrive even when you forget about them."
            subHeading="Tough, Beautiful, and Hard to Kill"
            subHeadingDesc="The perfect green companions for busy schedules, frequent travelers, and first-time plant parents."

            // --- Styling ---
            icon={ShieldCheck}
            heroGradient="from-emerald-500 to-teal-600"

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

            // --- Slot 2: Middle Section (Shop by Plant Type Chips) ---
            middleSection={
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Shop by Plant Type
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {plantTypes.map((type, index) => (
                            <Link
                                key={index}
                                to={`/search?q=${type.name.toLowerCase().replace(' ', '-')}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all"
                            >
                                <span>{type.emoji}</span>
                                <span className="font-medium text-gray-700">{type.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default EasyCarePlants;