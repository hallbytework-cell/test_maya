import { Wind, Leaf, Heart, Shield } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';

const AirPurifyingPlants = () => {
    
    const benefits = [
        { title: 'Removes Toxins', desc: 'Filters formaldehyde, benzene & more', icon: Shield },
        { title: 'Fresh Oxygen', desc: 'Produces oxygen 24/7', icon: Wind },
        { title: 'Better Sleep', desc: 'Improves air quality for restful sleep', icon: Heart },
        { title: 'NASA Approved', desc: 'Based on NASA Clean Air Study', icon: Leaf },
    ];

    return (
        <GenericCategoryPage
            // Logic
            categoryTag="AIR_PURIFYING"
            faqCategoryKey="air-purifying"
            pageUrl="/air-purifying-plants"
            
            // Content
            title="Air Purifying Plants India"
            description="Breathe cleaner, healthier air with our NASA-approved air-purifying plants. Perfect for Indian homes and offices to combat indoor pollution naturally."
            breadcrumbName="Air Purifying Plants"
            subHeading="Top Air Purifying Plants"
            subHeadingDesc="Natural air filters for a healthier living environment"
            
            // Styling
            icon={Wind}
            heroGradient="from-teal-500 to-cyan-600"
            
            // Layout Specifics
            middleSection={
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                            <benefit.icon className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                            <p className="text-sm text-gray-600">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            }
        />
    );
};

export default AirPurifyingPlants;