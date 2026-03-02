import { Link } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle, Mail } from 'lucide-react';

const ServerError = () => {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                <div className="relative mb-8">
                    <div className="text-[120px] md:text-[150px] font-bold text-red-100 leading-none select-none">
                        500
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Server Error
                </h1>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Our garden is experiencing some technical difficulties. Our team has been notified and is working to fix this. Please try again in a few moments.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-lg shadow-amber-600/25"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                    
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors border border-gray-200"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Need help?</p>
                    <a
                        href="mailto:care.mayavriksh@gmail.com"
                        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ServerError;