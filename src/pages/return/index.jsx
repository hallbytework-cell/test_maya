import React, { useState } from 'react';
import { 
    RefreshCw, 
    Camera, 
    Mail, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Sprout, 
    Package 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
    // State to toggle between policy types (Plants vs Non-Plants)
    const [activeTab, setActiveTab] = useState('plants');

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* --- Hero Section --- */}
            <div className="bg-emerald-900 text-white relative overflow-hidden pb-12">
                <div className="absolute top-0 left-0 opacity-10 transform -translate-x-1/4 -translate-y-1/4">
                    <svg width="400" height="400" viewBox="0 0 200 200">
                        <path fill="#FFFFFF" d="M45.7,-70.5C58.9,-62.5,69.3,-50.3,77.3,-36.8C85.3,-23.3,90.9,-8.5,88.6,5.3C86.3,19.1,76.1,31.9,64.8,42.4C53.5,52.9,41.1,61.1,28.3,66.4C15.5,71.7,2.3,74.1,-10.1,72.3C-22.5,70.5,-34.1,64.5,-45.3,56.8C-56.5,49.1,-67.3,39.7,-74.6,27.8C-81.9,15.9,-85.7,1.5,-82.7,-11.2C-79.7,-23.9,-69.9,-34.9,-58.5,-43.6C-47.1,-52.3,-34.1,-58.7,-21.3,-62.4C-8.5,-66.1,4.1,-67.1,17.4,-70.5" transform="translate(100 100)" />
                    </svg>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 pt-16 md:pt-24 text-center relative z-10">
                    <div className="inline-block bg-emerald-800 rounded-full px-4 py-1.5 mb-6 border border-emerald-700">
                        <span className="text-emerald-200 text-sm font-semibold tracking-wide uppercase">
                            The Green Guarantee
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6">
                        Returns & Replacements
                    </h1>
                    <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
                        We want you to love your plants. If something isn't right, we're here to fix it.
                        Simple, fair, and transparent.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
                
                {/* --- Policy Type Toggles --- */}
                <div className="bg-white rounded-2xl shadow-lg p-2 max-w-lg mx-auto flex mb-12 border border-gray-100">
                    <button 
                        onClick={() => setActiveTab('plants')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
                            activeTab === 'plants' 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <Sprout className="w-5 h-5" />
                        Live Plants
                    </button>
                    <button 
                        onClick={() => setActiveTab('accessories')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
                            activeTab === 'accessories' 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <Package className="w-5 h-5" />
                        Pots & Gear
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    
                    {/* --- Left Column: Main Policy Content (8 cols) --- */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Dynamic Content based on Tab */}
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="bg-emerald-50/50 p-6 border-b border-emerald-100">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    {activeTab === 'plants' ? (
                                        <>
                                            <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700"><Sprout className="w-6 h-6"/></span>
                                            Policy for Live Plants
                                        </>
                                    ) : (
                                        <>
                                            <span className="bg-orange-100 p-2 rounded-lg text-orange-700"><Package className="w-6 h-6"/></span>
                                            Policy for Non-Living Items
                                        </>
                                    )}
                                </h2>
                            </div>
                            
                            <div className="p-8">
                                {activeTab === 'plants' ? (
                                    <div className="space-y-6">
                                        <p className="text-gray-600 leading-relaxed">
                                            Plants are perishable living beings. Because of this, <strong>we do not accept returns for "change of mind"</strong> once the plant has been delivered. However, we offer free replacements under specific conditions.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                                <h4 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                                                    <CheckCircle2 className="w-5 h-5" /> Covered
                                                </h4>
                                                <ul className="text-sm text-green-700 space-y-2 list-disc list-inside">
                                                    <li>Plant arrived dead or damaged.</li>
                                                    <li>Pot is broken upon arrival.</li>
                                                    <li>Wrong plant delivered.</li>
                                                </ul>
                                            </div>
                                            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                                <h4 className="font-bold text-red-800 flex items-center gap-2 mb-2">
                                                    <XCircle className="w-5 h-5" /> Not Covered
                                                </h4>
                                                <ul className="text-sm text-red-700 space-y-2 list-disc list-inside">
                                                    <li>Minor leaf loss (transit shock).</li>
                                                    <li>Repotted plants.</li>
                                                    <li>Reporting after 24 hours.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className="text-gray-600 leading-relaxed">
                                            For pots, tools, and non-living accessories, we offer a standard <strong>7-day return window</strong>. If you don't like the product, you can return it for a full refund.
                                        </p>
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                            <h4 className="font-bold text-gray-900 mb-2">Conditions for Return:</h4>
                                            <ul className="space-y-2 text-gray-600">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                                                    Item must be unused and in original packaging.
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                                                    Return shipping fee of ₹79 will be deducted from refund (unless item was defective).
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                                                    Sale items are final sale.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- The Process Section --- */}
                        <section>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Request a Replacement</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Snap Photos</h4>
                                    <p className="text-sm text-gray-600">Take clear photos/videos of the damaged plant/product and the box it came in.</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Contact Us</h4>
                                    <p className="text-sm text-gray-600">Email photos & Order ID to <strong>care.mayavriksh@gmail.com</strong> within 24 hours.</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                                        <RefreshCw className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Solution</h4>
                                    <p className="text-sm text-gray-600">We will review and dispatch a free replacement within 48 hours.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* --- Right Column: Sidebar (4 cols) --- */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Refund Summary Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-emerald-600" />
                                Refund FAQs
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h5 className="text-sm font-bold text-gray-800">When do I get my money?</h5>
                                    <p className="text-xs text-gray-500 mt-1">Refunds are processed to original source within 5-7 business days after approval.</p>
                                </div>
                                <div className="border-t border-gray-100 pt-3">
                                    <h5 className="text-sm font-bold text-gray-800">What about shipping fees?</h5>
                                    <p className="text-xs text-gray-500 mt-1">Original shipping charges are non-refundable unless the error was ours.</p>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                            <h3 className="font-bold text-orange-900 mb-2">Cancelling an Order</h3>
                            <p className="text-sm text-orange-800 mb-4 leading-relaxed">
                                Changed your mind? You can cancel your order within <strong>4 hours</strong> of placing it before we start the packaging process.
                            </p>
                            <Link to="/contact" className="text-sm font-bold text-orange-700 hover:text-orange-800 underline">
                                Request Cancellation &rarr;
                            </Link>
                        </div>

                        {/* Help Box (UPDATED) */}
                        <div className="bg-emerald-800 text-white p-8 rounded-2xl text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-xl mb-2">Have a specific case?</h3>
                                <p className="text-emerald-100 text-sm mb-6">Our team of plant experts is here to assess your plant's health.</p>
                                
                                <a 
                                    href="mailto:care.mayavriksh@gmail.com"
                                    className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors w-full inline-flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    Mail Us
                                </a>

                            </div>
                            {/* Decorative circle */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-700 rounded-full opacity-50"></div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;