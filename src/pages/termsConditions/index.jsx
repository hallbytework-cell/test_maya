import React, { useState } from 'react';
import { 
    Scale, 
    Truck, 
    Leaf, 
    AlertCircle, 
    FileText, 
    ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ShieldCheck = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);


const TermsConditions = () => {
    const [activeSection, setActiveSection] = useState('general');

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    const sections = [
        { id: 'general', label: 'General Terms' },
        { id: 'products', label: 'Plants & Products' },
        { id: 'shipping', label: 'Shipping & Delivery' },
        { id: 'returns', label: 'Returns & Refunds' },
        { id: 'liability', label: 'Liability & Warranty' },
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
                
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
                    <p className="text-emerald-100 text-lg">Please read these terms carefully before using our services.</p>
                    <p className="text-xs text-emerald-300 mt-4 uppercase tracking-widest">Effective Date: January 1, 2026</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    
                    {/* --- Sidebar Navigation (Sticky) --- */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-emerald-600" />
                                Contents
                            </h3>
                            <div className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                                            activeSection === section.id 
                                            ? 'bg-emerald-50 text-emerald-700' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {section.label}
                                        {activeSection === section.id && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Main Content --- */}
                    <div className="lg:col-span-3 space-y-12">
                        
                        {/* Section 1: General */}
                        <div id="general" className="scroll-mt-28">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Scale className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">1. General Terms</h2>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed space-y-4">
                                <p>
                                    Welcome to <strong>Maya Vriksh</strong>. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Maya Vriksh if you do not agree to take all of the terms and conditions stated on this page.
                                </p>
                                <p>
                                    These terms apply to all visitors, users, and others who access or use the Service. We reserve the right to change these terms at any time without notice.
                                </p>
                            </div>
                        </div>

                        {/* Section 2: Products */}
                        <div id="products" className="scroll-mt-28">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">2. Plants & Living Products</h2>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed space-y-4">
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <h4 className="font-bold text-yellow-800 mb-1">Nature's Disclaimer</h4>
                                    <p className="text-sm text-yellow-700">
                                        Plants are living things! The plant you receive may differ slightly in color, shape, or size from the image shown on the website.
                                    </p>
                                </div>
                                <p>
                                    <strong>2.1 Accuracy:</strong> We make every effort to display as accurately as possible the colors and images of our products. However, as plants are natural products, some variation is expected.
                                </p>
                                <p>
                                    <strong>2.2 Availability:</strong> All product orders are subject to availability. If a plant is out of stock after you place an order (e.g., due to quality checks failing), we will refund you immediately.
                                </p>
                            </div>
                        </div>

                        {/* Section 3: Shipping */}
                        <div id="shipping" className="scroll-mt-28">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">3. Shipping Policy</h2>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed space-y-4">
                                <p>
                                    <strong>3.1 Timeline:</strong> We aim to dispatch all orders within 48 hours. Delivery typically takes 4-7 business days depending on your location in India.
                                </p>
                                <p>
                                    <strong>3.2 Live Plants:</strong> To ensure plant health, we may hold shipments over the weekend to prevent plants from sitting in a warehouse on Sundays.
                                </p>
                                <p>
                                    <strong>3.3 Damage:</strong> If your package arrives visibly damaged, please take photos before opening and contact us immediately.
                                </p>
                            </div>
                        </div>

                        <div id="returns" className="scroll-mt-28">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">4. Returns & Refunds</h2>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed space-y-4">
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Live Plants:</strong> Due to the perishable nature of live plants, we do not accept returns for "change of mind."</li>
                                    <li><strong>Dead on Arrival:</strong> If your plant arrives dead or severely damaged, send us a photo within 24 hours to <a href="mailto:care.mayavriksh@gmail.com" className="text-emerald-600 hover:underline">care.mayavriksh@gmail.com</a> for a free replacement or refund.</li>
                                    <li><strong>Non-Plant Items:</strong> Pots, tools, and accessories can be returned within 7 days if unused and in original packaging.</li>
                                </ul>
                            </div>
                        </div>

                        <div id="liability" className="scroll-mt-28">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <ShieldCheck className="w-6 h-6" /> {/* Note: Ensure ShieldCheck is imported if used here, or use Scale/AlertCircle */}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">5. Limitation of Liability</h2>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed space-y-4">
                                <p>
                                    Maya Vriksh shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if Maya Vriksh has been advised of the possibility of such damages.
                                </p>
                                <p className="text-sm border-t pt-4 mt-4">
                                    For any further legal queries, please contact us at <strong>care.mayavriksh@gmail.com</strong>.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};


export default TermsConditions;