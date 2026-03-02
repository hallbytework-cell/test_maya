import React, { useState } from 'react';
import { 
    Search, 
    Plus, 
    Minus, 
    Truck, 
    Leaf, 
    RefreshCcw, 
    CreditCard, 
    MessageCircle,
    PackageOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState('shipping');
    const [searchQuery, setSearchQuery] = useState('');
    const [openItem, setOpenItem] = useState(null);

    const categories = [
        { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
        { id: 'care', label: 'Plant Care', icon: Leaf },
        { id: 'returns', label: 'Returns & Refunds', icon: RefreshCcw },
        { id: 'payment', label: 'Payments & Orders', icon: CreditCard },
    ];

    const faqData = {
        shipping: [
            {
                q: "How long does delivery take?",
                a: "For metro cities, delivery typically takes 2-4 business days. For the rest of India, it takes 4-7 business days. We do not ship live plants on weekends to ensure they don't get stuck in transit hubs."
            },
            {
                q: "Is shipping free?",
                a: "Yes! We offer FREE shipping on all orders above ₹999. For orders below that, a small flat fee applies."
            },
            {
                q: "How do you pack the plants?",
                a: "We use a specialized 5-layer packaging method. The pot is secured to the box base, the soil is covered to prevent spillage, and the box has ventilation holes. We also use moisture gel to keep the plant hydrated."
            }
        ],
        care: [
            {
                q: "My plant arrived looking a bit dull. Is it dead?",
                a: "Likely not! Plants can get 'transit shock' after traveling in a dark box. Water it slightly and keep it in indirect light for 2-3 days. It should perk up. If leaves are yellowing, it might just need some sun."
            },
            {
                q: "Is the pot included with the plant?",
                a: "Yes, all our plants come in the pot shown in the pot image (unless specified as 'Nursery Pot'). We ensure the pot is durable and stylish."
            },
            {
                q: "Are these plants pet-friendly?",
                a: "Some are, some aren't. Please check the 'Pet Friendly' tag on the product page. Popular safe options are Spider Plants, Ferns, and Calatheas."
            }
        ],
        returns: [
            {
                q: "What if my plant arrives damaged?",
                a: "We have a 'Green Guarantee'. If your plant arrives damaged or dead, send us a photo within 24 hours of delivery to care.mayavriksh@gmail.com, and we will send a free replacement."
            },
            {
                q: "Can I return a plant if I don't like it?",
                a: "Due to the perishable nature of plants, we do not accept returns for 'change of mind'. However, we do accept returns for non-plant items like pots and tools within 7 days."
            }
        ],
        payment: [
            {
                q: "Do you accept Cash on Delivery (COD)?",
                a: "Yes, COD is available for orders up to ₹1000. For higher value orders, we require online payment to ensure secure delivery."
            },
            {
                q: "Can I cancel my order?",
                a: "You can cancel your order within 4 hours of placing it. Once the packing process begins, we cannot cancel the order as live plants are being prepped."
            }
        ]
    };

    // --- Logic ---
    const toggleItem = (index) => {
        setOpenItem(openItem === index ? null : index);
    };

    // Flatten data for search, or select category
    const getDisplayData = () => {
        if (searchQuery.trim().length > 0) {
            // Search across all categories
            const allItems = Object.values(faqData).flat();
            return allItems.filter(item => 
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return faqData[activeCategory] || [];
    };

    const displayItems = getDisplayData();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* --- Hero Section --- */}
            <div className="bg-emerald-900 text-white relative overflow-hidden pb-12">
                <div className="absolute top-0 right-0 opacity-10">
                    <svg width="400" height="400" viewBox="0 0 200 200">
                        <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-8.1C81.5,4.2,70.2,14.5,60.7,23.8C51.2,33.1,43.5,41.4,34.7,48.6C25.9,55.8,16,61.9,4.8,63.5C-6.4,65.1,-18.9,62.2,-31.1,56.7C-43.3,51.2,-55.2,43.1,-64.8,32.3C-74.4,21.5,-81.7,8,-80.6,-5.1C-79.5,-18.2,-70,-30.9,-59.1,-40.8C-48.2,-50.7,-35.9,-57.8,-23.4,-66.1C-10.9,-74.4,1.8,-83.9,15.1,-83.6C28.4,-83.3,42.3,-73.2,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 pt-16 md:pt-24 text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6">
                        How can we help you?
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <input 
                            type="text" 
                            placeholder="Search for answers (e.g., watering, return, payment)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-lg text-lg"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    
                    {/* --- Sidebar: Categories (Hidden if searching) --- */}
                    {!searchQuery && (
                        <div className="lg:col-span-1">
                            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-4 lg:pb-0 sticky top-24 no-scrollbar">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setActiveCategory(cat.id); setOpenItem(null); }}
                                        className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all whitespace-nowrap lg:whitespace-normal text-left ${
                                            activeCategory === cat.id 
                                            ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                                            : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-100'
                                        }`}
                                    >
                                        <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-emerald-100' : 'text-emerald-600'}`} />
                                        <span className="font-semibold">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- Main Content: Questions --- */}
                    <div className={searchQuery ? 'lg:col-span-4 max-w-3xl mx-auto w-full' : 'lg:col-span-3'}>
                        {searchQuery && (
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Search Results for "{searchQuery}"
                            </h2>
                        )}

                        <div className="space-y-4">
                            {displayItems.length > 0 ? (
                                displayItems.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className={`bg-white rounded-2xl border transition-all duration-300 ${
                                            openItem === index 
                                            ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20' 
                                            : 'border-gray-100 shadow-sm hover:border-emerald-200'
                                        }`}
                                    >
                                        <button 
                                            onClick={() => toggleItem(index)}
                                            className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left"
                                        >
                                            <span className={`font-bold text-lg ${openItem === index ? 'text-emerald-800' : 'text-gray-900'}`}>
                                                {item.q}
                                            </span>
                                            <span className={`flex-shrink-0 mt-1 p-1 rounded-full ${openItem === index ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {openItem === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                            </span>
                                        </button>
                                        
                                        {/* Answer Area */}
                                        <div 
                                            className={`grid transition-all duration-300 ease-in-out ${
                                                openItem === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                    {item.a}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                                    <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900">No answers found</h3>
                                    <p className="text-gray-500">Try searching for "shipping", "water", or "return".</p>
                                </div>
                            )}
                        </div>

                        {/* --- Still Stuck Section --- */}
                        <div className="mt-12 bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center">
                            <MessageCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
                            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                Can't find the answer you're looking for? Please chat to our friendly team.
                            </p>
                            <Link 
                                to="/contact" 
                                className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FAQ;