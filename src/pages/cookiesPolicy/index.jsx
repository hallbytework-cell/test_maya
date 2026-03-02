import React from 'react';
import { 
    Cookie, 
    ShieldCheck, 
    BarChart3, 
    Target, 
    Settings, 
    Info 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiesPolicy = () => {
    // Configuration for Cookie Types
    const cookieTypes = [
        {
            icon: ShieldCheck,
            title: "Essential Cookies",
            status: "Always Active",
            statusColor: "text-emerald-600 bg-emerald-100",
            description: "These are necessary for the website to function. They handle security, login sessions, and your shopping cart items."
        },
        {
            icon: BarChart3,
            title: "Analytics Cookies",
            status: "Optional",
            statusColor: "text-blue-600 bg-blue-100",
            description: "These help us understand how visitors interact with our website, helping us improve the user experience and find broken links."
        },
        {
            icon: Target,
            title: "Marketing Cookies",
            status: "Optional",
            statusColor: "text-purple-600 bg-purple-100",
            description: "These are used to show you relevant ads on other platforms (like Instagram or Facebook) based on the plants you viewed."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* --- Hero Section --- */}
            <div className="bg-emerald-900 text-white relative overflow-hidden py-16">
                <div className="absolute top-0 right-0 opacity-10">
                    <svg width="400" height="400" viewBox="0 0 200 200">
                        <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-8.1C81.5,4.2,70.2,14.5,60.7,23.8C51.2,33.1,43.5,41.4,34.7,48.6C25.9,55.8,16,61.9,4.8,63.5C-6.4,65.1,-18.9,62.2,-31.1,56.7C-43.3,51.2,-55.2,43.1,-64.8,32.3C-74.4,21.5,-81.7,8,-80.6,-5.1C-79.5,-18.2,-70,-30.9,-59.1,-40.8C-48.2,-50.7,-35.9,-57.8,-23.4,-66.1C-10.9,-74.4,1.8,-83.9,15.1,-83.6C28.4,-83.3,42.3,-73.2,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-800 rounded-full mb-6">
                        <Cookie className="w-8 h-8 text-emerald-200" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Cookies Policy</h1>
                    <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                        We use cookies to make your shopping experience sweeter (and functional).
                    </p>
                    <p className="text-sm text-emerald-300 mt-4">Last Updated: Dec 2025</p>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                
                {/* Introduction */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Info className="w-6 h-6 text-emerald-600" />
                        What is a Cookie?
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        A cookie is a small text file that is stored on your computer or mobile device when you visit a website. It allows the website to remember your actions and preferences (such as login, language, font size, and other display preferences) over a period of time.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        At <strong>Maya Vriksh</strong>, we use cookies primarily to ensure your shopping cart works correctly and to analyze how our site is performing.
                    </p>
                </div>

                {/* Cookie Types Grid */}
                <h3 className="text-xl font-bold mb-6 px-2">Types of Cookies We Use</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {cookieTypes.map((type, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${type.statusColor.replace('text-', 'bg-').replace('100', '50')}`}>
                                <type.icon className={`w-6 h-6 ${type.statusColor.split(' ')[0]}`} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">{type.title}</h4>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${type.statusColor}`}>
                                {type.status}
                            </span>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {type.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Managing Cookies */}
                <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Settings className="w-6 h-6 text-emerald-600" />
                            Managing Your Preferences
                        </h2>
                        <p className="text-gray-700 mb-4">
                            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                        </p>
                        <p className="text-sm text-gray-500">
                            Note: If you do this, you may have to manually adjust some preferences every time you visit a site and some services (like the Shopping Cart) may not work.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                            Cookie Settings
                        </button>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                    Questions about our policy? <Link to="/contact" className="text-emerald-600 hover:underline">Contact Support</Link>
                </div>

            </div>
        </div>
    );
};

export default CookiesPolicy;