import { Link } from 'react-router-dom';
import { Sun, Thermometer, Sprout, Flower } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const SunLovingPlants = () => {
    // Features relevant to sun-loving plants
    const features = [
        { icon: Sun, label: 'Thrives in Direct Sunlight' },
        { icon: Thermometer, label: 'High Heat Tolerance' },
        { icon: Sprout, label: 'Perfect for Balconies & Patios' },
    ];

    // Data for Middle Section "Shop by Plant Type" (Slot 2)
    const plantTypes = [
        { name: 'Flowering', emoji: '🌻' },
        { name: 'Cactus & Succulents', emoji: '🌵' },
        { name: 'Fruit Plants', emoji: '🍋' },
        { name: 'Outdoor Foliage', emoji: '🌿' },
        { name: 'Summer Specials', emoji: '🌞' },
        { name: 'Bougainvillea', emoji: '🌸' },
    ];

    return (
        <GenericCategoryPage
            // --- Logic & SEO ---
            categoryTag="SUN_LOVING_HEROES"
            faqCategoryKey="sun-loving-plants"
            pageUrl="/sun-loving-plants"
            breadcrumbName="Sun Loving"

            // --- Text Content ---
            title="Sun Loving Plants Online"
            description="Got a sunny balcony, terrace, or a bright window? These sun-loving plants crave direct sunlight and will reward you with vibrant foliage and beautiful blooms when soaking up the rays."
            subHeading="Bask in the Sun"
            subHeadingDesc="Hardy, heat-tolerant plants that thrive in bright, direct outdoor light."

            // --- Styling ---
            icon={Sun}
            heroGradient="from-amber-400 to-orange-500"

            // --- Slot 1: Hero Features (Icons below description) ---
            heroExtraContent={
                <div className="flex flex-wrap gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-white/90">
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
                        Shop for Sunny Spots
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {plantTypes.map((type, index) => (
                            <Link
                                key={index}
                                to={`/search?q=${type.name.toLowerCase().replace(/ & | /g, '-')}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all"
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

export default SunLovingPlants;