import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePlantsByTag } from '@/hooks/useOptimizedQueries';
import ProductGrid from '@/components/ProductGrid';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema, { categoryFAQs } from '@/components/seo/FAQSchema';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';

const GenericCategoryPage = ({
    // Data Logic
    categoryTag,
    faqCategoryKey,
    fetchCount = 20,

    // Page Content
    title,
    description,
    subHeading,
    subHeadingDesc,
    
    // Breadcrumbs
    pageUrl,
    breadcrumbName,

    // Visuals & Styling
    icon: Icon,
    heroGradient, // e.g., 'from-amber-500 to-orange-600'
    
    // Slots for Custom Layouts
    heroExtraContent, // For the "Stats" row in Best Sellers
    middleSection // For the "Benefits Cards" in Air Purifying
}) => {
    
    // 1. Centralized Data Fetching
    const { data: products, isLoading } = usePlantsByTag(categoryTag, fetchCount);

    // 2. Centralized Memoized Logic
    const breadcrumbs = useMemo(() => [
        { name: 'Home', url: '/' },
        { name: breadcrumbName, url: pageUrl },
    ], [breadcrumbName, pageUrl]);

    const faqs = categoryFAQs[faqCategoryKey] || [];

    return (
        <>
            {/* SEO Schemas */}
            <BreadcrumbSchema items={breadcrumbs} />
            <FAQSchema faqs={faqs} />
            <LocalBusinessSchema />

            <div className="min-h-screen bg-gray-50">
                {/* Dynamic Hero Section */}
                <div className={`bg-gradient-to-r ${heroGradient} text-white py-16`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Breadcrumb Visual */}
                        <nav className="text-sm mb-4">
                            <ol className="flex items-center gap-2">
                                <li><Link to="/" className="hover:underline opacity-80">Home</Link></li>
                                <li>/</li>
                                <li className="font-medium">{breadcrumbName}</li>
                            </ol>
                        </nav>
                        
                        <div className="flex items-center gap-3 mb-4">
                            {/* Render the passed Icon component */}
                            <Icon className="w-10 h-10" />
                            <h1 className="text-3xl md:text-4xl font-bold">
                                {title}
                            </h1>
                        </div>
                        
                        <p className="text-lg opacity-90 max-w-3xl">
                            {description}
                        </p>

                        {/* SLOT: Extra Hero Content (e.g., Best Sellers Stats) */}
                        {heroExtraContent && (
                            <div className="mt-8">
                                {heroExtraContent}
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* SLOT: Middle Section (e.g., Air Purifying Benefits Grid) */}
                    {middleSection && (
                        <div className="mb-12">
                            {middleSection}
                        </div>
                    )}

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {subHeading}
                        </h2>
                        <p className="text-gray-600">
                            {subHeadingDesc}
                        </p>
                    </div>

                    {/* Standardized Loading & Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-72"></div>
                            ))}
                        </div>
                    ) : (
                        <ProductGrid products={products || []} />
                    )}

                    {/* Standardized FAQ Section */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            {breadcrumbName} FAQ
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

export default GenericCategoryPage;