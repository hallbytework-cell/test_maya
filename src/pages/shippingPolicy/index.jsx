import React from 'react';
import { 
    Truck, 
    Clock, 
    MapPin, 
    Package, 
    ShieldCheck, 
    AlertTriangle, 
    Calendar,
    RefreshCw // Added icon for Returns
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* --- Hero Section --- */}
            <div className="bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFFFFF" d="M41.8,-73.3C54.6,-64.8,65.8,-54.6,73.8,-42.6C81.8,-30.6,86.6,-16.8,84.6,-3.6C82.7,9.7,73.9,22.3,64.2,33.1C54.5,43.9,43.8,52.9,32.3,60.1C20.8,67.3,8.5,72.7,-2.8,77.5C-14.1,82.4,-24.4,86.6,-35.3,80.7C-46.2,74.7,-57.8,58.6,-66.2,42.5C-74.6,26.4,-79.9,10.3,-78.4,-5.1C-76.9,-20.5,-68.7,-35.2,-57.4,-45.6C-46.1,-56,-31.7,-62.1,-17.8,-65.4C-3.9,-68.6,9.5,-69.1,23.1,-69.3" transform="translate(100 100)" />
                    </svg>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Shipping & Returns
                    </h1>
                    <p className="text-emerald-100 text-lg max-w-2xl leading-relaxed">
                        We partner with top-tier courier partners to ensure your green friends arrive 
                        safe, hydrated, and ready to thrive in their new home.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                
                {/* --- Quick Highlights Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-start gap-4">
                        <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Free Shipping</h3>
                            <p className="text-sm text-gray-600">On all orders above ₹999 across India.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Fast Dispatch</h3>
                            <p className="text-sm text-gray-600">We pack & ship within 2-3 working days.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-full text-orange-700">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Safe Transit</h3>
                            <p className="text-sm text-gray-600">Ventilated packaging for zero transit stress.</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 mb-20">
                    {/* --- Left Column: Policy Text (8 cols) --- */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* Section 1: Shipping Costs */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-1 bg-emerald-500 rounded-full inline-block"></span>
                                Shipping Charges
                            </h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <ul className="space-y-4 text-gray-700">
                                    <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                                        <span>Orders <strong>above ₹999</strong></span>
                                        <span className="font-bold text-emerald-600">FREE</span>
                                    </li>
                                    <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                                        <span>Standard Shipping (Below ₹999)</span>
                                        <span className="font-bold text-gray-900">Depends on location of your order</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Heavy Items (Large Pots/Trees)</span>
                                        <span className="font-bold text-gray-900">Calculated at Checkout</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    *We use premium courier partners to ensure minimal transit time for live plants.
                                </p>
                            </div>
                        </section>

                        {/* Section 2: Delivery Timeline */}
                        <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-emerald-600" />
                                When will my order arrive?
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                Once you place an order, we dispatch it within <strong>2 working days</strong> from our nursery.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-900">Metro Cities</h4>
                                    <p className="text-gray-600 text-sm">4 - 5 Working Days</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-900">Rest of India</h4>
                                    <p className="text-gray-600 text-sm">6 - 7 Working Days</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-start gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <p>Plants may look a little dull upon arrival due to "travel fatigue." This is normal! Exposure to sunlight and water will revive them quickly.</p>
                            </div>
                        </section>

                        {/* Section 3: Return Policy (New Content based on Ugaoo) */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-emerald-500 rounded-full inline-block"></span>
                                Returns & Replacements
                            </h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
                                
                                {/* Live Plants Policy */}
                                <div className="flex gap-4">
                                    <div className="bg-emerald-100 p-2 h-fit rounded-lg text-emerald-700">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Live Plants</h4>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            Because plants are perishable living things, <strong>we cannot accept returns on them</strong>. A two-way journey is often too stressful for the plant to survive. However, we guarantee they arrive safe! And we guide you on how to care for them post-delivery.
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100"></div>

                                {/* Non-Plant Policy */}
                                <div className="flex gap-4">
                                    <div className="bg-blue-100 p-2 h-fit rounded-lg text-blue-700">
                                        <RefreshCw className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Pots & Accessories</h4>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            <strong>Changed your mind?</strong> You can self-return unused/unopened non-plant items within 7 days (shipping borne by you).<br/>
                                            <strong>Defective item?</strong> We offer returns/exchanges within 30 days for damaged goods.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* --- Right Column: Sticky Support & Tracking (4 cols) --- */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Track Order Widget */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                Track Your Order
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter your Order ID to track your package's journey.
                            </p>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Order ID (e.g., MV-1023)"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                                    Track Now
                                </button>
                            </div>
                        </div>

                        {/* Damaged Policy */}
                        <div className="bg-rose-50 rounded-2xl border border-rose-100 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-6 h-6 text-rose-600" />
                                <h3 className="font-bold text-rose-900">Arrived Damaged?</h3>
                            </div>
                            <p className="text-sm text-rose-800 leading-relaxed mb-4">
                                If your plant or pot arrives in poor condition, please snap a photo and email us within <strong>24 hours</strong> of delivery. We've got your back!
                            </p>
                            <Link to="/contact" className="text-sm font-semibold text-rose-700 hover:underline">
                                Contact Support &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShippingPolicy;