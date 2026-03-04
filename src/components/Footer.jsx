import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // 1. Import useQuery
import { Facebook, Youtube, Instagram, Leaf, MapPin, Mail, ShieldCheck } from "lucide-react";
import { nameToSlug } from '@/utils/utils';

import { getPopularSearches } from '../api/customer/plant';

export default function Footer({ companyName = "Mayavriksh" }) {
  const currentYear = new Date().getFullYear();
  const { data: popularPlants = [], isLoading, isError } = useQuery({
    queryKey: ['popularSearches'],
    queryFn: getPopularSearches,
    retry: 2,
  });

  // ROUTER MAPPING
  const categories = [
    { name: "Indoor Plants", path: "/category/indoor-plants" },
    { name: "Outdoor Plants", path: "/category/outdoor-plants" },
    { name: "Aquatic Plants", path: "/category/aquatic-plants" },
    { name: "Air Purifying", path: "/plants/air-purifying" },
    { name: "Succulents & Cacti", path: "/category/succulents-cacti" },
    { name: "Flowering Plants", path: "/category/flowering-plants" },
    { name: "Vastu & Lucky", path: "/plants/vastu-plants" },
  ];

  const trustSignals = [
    "100% Healthy Plants",
    "Secure Shipping",
    "Expert Support",
    "7-Day Returns"
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 text-sm border-t border-gray-800 font-sans">
      
      {/* SECTION 1: SEO TEXT WALL */}
      <div className="bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white font-bold text-lg mb-3">
            Mayavriksh: India's Best Online Nursery for Indoor & Air Purifying Plants
          </h2>
          <article className="prose prose-invert max-w-none text-xs text-gray-400 space-y-2">
            <p>category/indoor-plants
              <strong>Bring Nature Home:</strong> Experience the joy of gardening with Mayavriksh. 
              We are the ultimate destination for <em><Link to="category/indoor-plants"><strong>indoor plants</strong></Link> online in India</em>, offering a curated selection 
              of greenery that blends aesthetics with health benefits. From <strong><Link to="plants/air-purifying">air-purifying</Link></strong> plants like <strong><Link to="/plants/snake-plant">Snake Plant</Link></strong> and 
              <strong><Link to="/plants/spider-plants">Spider Plants</Link></strong> to rare collectors' items like the <strong><Link to="/plants/philodendron-ring-of-fire">Philodendron Ring of Fire</Link></strong> and <strong><Link to="/plants/monstera-half-moon-variegated">Monstera Half Moon</Link></strong>, 
              we ensure every plant delivered to your doorstep is healthy and potting-ready.
            </p>
            <p>
              <strong>Vastu & Good Luck Plants:</strong> Enhance the positive energy in your home with our 
              exclusive collection of Vastu-compliant plants. Buy <strong><Link to="/plants/lucky-bamboo">Lucky Bamboo</Link></strong>, <strong><Link to="/plants/money-plant-golden-pothos">Money Plants Golden Pothos</Link></strong>, 
              and <strong>Tulsi (Holy Basil)</strong> to invite prosperity. Our collection also features exotic <em> </em> 
               <strong>Aglaonema varieties</strong> like <em><Link to="/plants/aglaonema-red-valentine"><strong>Aglaonema Red Valentine</strong></Link>,<Link to="/plants/aglaonema-lipstick"><strong>Aglaonema Lipstick</strong></Link>, <Link to="/plants/aglaonema-kenedes-royalpink"><strong>Aglaonema Kenedes RoyalPink</strong></Link>, and <Link to="/plants/aglaonema-thai-pink"><strong>Aglaonema Thai Pink</strong></Link> </em>
               perfect for modern home decor.
            </p>
            <p>
              <strong>Gifting Green:</strong> Redefine gifting with living plants. Whether it's the heart-shaped <strong><Link to="/plants/hoya-kerrii-sweetheart">Hoya Kerrii Sweetheart</Link></strong> 
               <em> </em>for a loved one or a resilient <strong><Link to="/plants/jade-plant">Jade Plant</Link></strong> for a colleague, Mayavriksh offers eco-friendly gift solutions 
              packaged with care.
            </p>
          </article>
        </div>
      </div>

      {/* SECTION 2: NAVIGATION & POPULAR LINKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/images/mvLogo.jpeg" alt="MayaVriksh" className="h-12 w-auto object-contain" />
              <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">{companyName}</span>
            </Link>
            <p className="text-xs text-gray-400">
              Transforming concrete spaces into green sanctuaries. 
              Grown with love, delivered with care.
            </p>
            
            <address className="not-italic text-xs space-y-2 mt-4 text-gray-400">
             <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
              <span>
                <strong>Registered Nursery:</strong><br/>
                Jirat, Hooghly,<br/>
                West Bengal - 712501<br/>
                <span className="text-[10px] text-gray-500">(Delivering Pan-India)</span>
              </span>
            </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500 shrink-0" />
                <a href="mailto:care.mayavriksh@gmail.com" className="hover:text-white">care.mayavriksh@gmail.com</a>
              </div>
            </address>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Shop By Category</h3>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link to={cat.path} className="hover:text-green-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/plants/featured" className="text-green-400 font-medium hover:text-green-300">
                    Featured Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Policies & Help</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/track-order" className="hover:text-white">Track Order</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-white">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/cookies-policy" className="hover:text-white">Cookies Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white">Terms & Conditions </Link></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Stay Connected</h3>
            <div className="flex gap-3 mb-6">
              <a href="https://instagram.com/mayavriksh" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/mayavriksh" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@mayavriksh" target="_blank" rel="noopener noreferrer" aria-label="Youtube" className="bg-gray-800 p-2 rounded-full hover:bg-sky-500 hover:text-white transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            
            <h3 className="text-white font-semibold mb-2 uppercase text-xs tracking-wider">The Mayavriksh Promise</h3>
            <div className="grid grid-cols-2 gap-2">
               {trustSignals.map(signal => (
                 <div key={signal} className="flex items-center gap-1.5 text-[10px] bg-gray-800 px-2 py-1 rounded border border-gray-700">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    {signal}
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: POPULAR SEARCHES (DYNAMIC) */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Popular Searches</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {isLoading && <span className="text-gray-600 text-[10px]">Loading...</span>}

            {/* Handle Error State */}
            {isError && <span className="text-red-900 text-[10px]">Failed to load topics.</span>}

            {/* Render Data */}
            {!isLoading && popularPlants.length > 0 && popularPlants.map((item, index) => (
              <React.Fragment key={item.plantId || index}>
                <Link
                  to={`/plant/${nameToSlug(item.plantName)}`}
                  className="text-[11px] text-gray-500 hover:text-green-400 hover:underline transition-colors"
                >
                  {item.plantName}
                </Link>
                {index !== popularPlants.length - 1 && (
                  <span className="text-gray-700 text-[10px]">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* SECTION 4: OUR GARDEN (Using same dynamic data or remove if duplicate) */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Our Garden</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {isLoading && <span className="text-gray-600 text-[10px]">Loading...</span>}

            {/* Handle Error State */}
            {isError && <span className="text-red-900 text-[10px]">Failed to load topics.</span>}

            {/* Render Data */}
            {!isLoading && popularPlants.length > 0 && popularPlants.map((item, index) => (
              <React.Fragment key={item.plantId || index}>
                <Link
                  to={`/product/${nameToSlug(item.plantName)}/${item.variantId}`}
                  className="text-[11px] text-gray-500 hover:text-green-400 hover:underline transition-colors"
                >
                  {item.plantName}
                </Link>
                {index !== popularPlants.length - 1 && (
                  <span className="text-gray-700 text-[10px]">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* SECTION 5: COPYRIGHT */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} Mayavriksh. All rights reserved. | A Made in India Brand 🇮🇳</p>
          <p className="mt-2 md:mt-0">Growing Green Since {currentYear - 5}</p>
        </div>
      </div>
    </footer>
  );
}