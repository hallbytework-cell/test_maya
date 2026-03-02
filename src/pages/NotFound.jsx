import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Leaf } from 'lucide-react';

const NotFound = () => {
    const popularCategories = [
        { name: 'Indoor Plants', slug: 'indoor-plants' },
        { name: 'Air Purifying', slug: 'air-purifying' },
        { name: 'Vastu Plants', slug: 'vastu-plants' },
        { name: 'Gift Plants', slug: 'gift-plants' },
        { name: 'Low Maintenance', slug: 'low-maintenance' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                <div className="relative mb-8">
                    <div className="text-[120px] md:text-[150px] font-bold text-green-100 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <Leaf className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h1>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Looks like this plant has wilted! The page you're looking for doesn't exist or has been moved to a sunnier spot.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-lg shadow-green-600/25"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    
                    <Link
                        to="/search"
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors border border-gray-200"
                    >
                        <Search className="w-5 h-5" />
                        Search Plants
                    </Link>
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="mt-6 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go back to previous page
                </button>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Popular categories:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {popularCategories.map((category) => (
                            <Link
                                key={category.slug}
                                to={`/category/${category.slug}`}
                                className="px-4 py-2 bg-white hover:bg-green-50 text-gray-600 hover:text-green-700 text-sm rounded-full border border-gray-200 hover:border-green-300 transition-colors"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;