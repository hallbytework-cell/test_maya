import { Suspense, useEffect } from "react";
import { Await, useNavigate } from "react-router-dom";
import PlantCategories from "./PlantCategories";
import Reels from "./Reels";
import TestimonialSection from "./TestimonialSection";
import { SEOHead } from "@/components/SEOHead";
import { OrganizationSchema, WebSiteSchema, FAQSchema, LocalBusinessSchema } from "@/components/JsonLdSchemas";
import { DEFAULT_PLANT_FAQS } from "@/data/defaultFaqs";
import { getCurrentFestival } from "@/constants/festivals.constants";
import { useCoreWebVitals } from "@/hooks/useCoreWebVitals";
import SentryTestButton from "@/components/SentryTestButton";
import logger from "@/lib/logger";
import { useQuery } from "@tanstack/react-query";
import { getPlantCategories } from "@/api/customer/plant";

import { BlogSection } from "./Blogs";
import { ProductCategories } from "./ProductCategory2";
import { AboutSection } from "./AboutSection";
import { EditorialBentoGrid } from "./EditorialBentoGrid";
import { OccasionGrid } from "./OccasionGrid";
import { WhyChooseUsSection } from "./WhyChooseUsSection";
import { HeadSection } from "./HeadSection";

const HOME_PAGE_DATA = {
  hero: {
    badge: "The Spring Collection",
    title: "Bring the outdoors in.",
    subtitle: "Create your personal sanctuary with our hand-picked, nursery-fresh plants delivered directly to your door.",
    image: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=2071"
  },
  trustBadges: [
    { id: 1, icon: "Truck", title: "Free Shipping", desc: "On orders over ₹499" },
    { id: 2, icon: "ShieldCheck", title: "Transit Guarantee", desc: "Safe arrival promised" },
    { id: 3, icon: "Leaf", title: "Nursery Fresh", desc: "Straight from the farm" },
    { id: 4, icon: "Headphones", title: "Expert Care", desc: "Lifetime plant support" }
  ],
  whyUs: [
    { id: 1, icon: "Sprout", title: "Unbeatable Quality", desc: "Every plant is handpicked and nurtured by expert botanists before it reaches you." },
    { id: 2, icon: "Package", title: "Secure Packaging", desc: "Our innovative, ventilated boxes ensure your green friends arrive safe and upright." },
    { id: 3, icon: "HeartHandshake", title: "10M+ Plant Parents", desc: "Join India's largest community of plant lovers who trust us with their urban jungles." },
    { id: 4, icon: "ShieldCheck", title: "14-Day Guarantee", desc: "Not happy? We offer hassle-free replacements if your plant arrives damaged." }
  ],
  about: {
    title: "About Maya Vriksh",
    description: "Maya Vriksh is India's premium online plant nursery and gardening destination, trusted by millions of plant lovers. Shop a wide range of [indoor plants], [flowering plants], [succulents], and [air-purifying greens] delivered right to your doorstep. We also offer a complete range of gardening products, including premium [seeds], organic [fertilizers], stylish [planters], and essential [gardening tools] to help your garden thrive. Whether you're a beginner or a seasoned gardener, Maya Vriksh has everything you need to grow. Start your plant journey with us – where every leaf begins a new story."
  },
  categories: [
    { id: 1, name: "Indoor Plants", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Air Purifying", image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Pet Friendly", image: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Ceramic Pots", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400" },
    { id: 5, name: "Plant Care", image: "https://images.unsplash.com/photo-1416879598555-39ac1219b169?auto=format&fit=crop&q=80&w=400" },
    { id: 6, name: "Seeds", image: "https://images.unsplash.com/photo-1596199050105-6d5d32222916?auto=format&fit=crop&q=80&w=400" }
  ],
  limitedDrops: [
    { id: 101, name: "Aglaonema Red Lipstick", price: 349, originalPrice: 799, rating: 4.8, reviews: 215, tag: "Air Purifying", discount: "56%", image: "https://images.unsplash.com/photo-1598880940080-c9fa8fae1ee5?auto=format&fit=crop&q=80&w=600" },
    { id: 102, name: "Ficus Bonsai Plant", price: 637, originalPrice: 1199, rating: 4.6, reviews: 105, tag: "Vastu Friendly", discount: "47%", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600" },
    { id: 103, name: "Set of 4 Office Desk Plants", price: 850, originalPrice: 1499, rating: 4.9, reviews: 342, tag: "Low Maintenance", discount: "43%", image: "https://images.unsplash.com/photo-1593691509543-c20fb51b4b09?auto=format&fit=crop&q=80&w=600" },
    { id: 104, name: "Monstera Deliciosa Large", price: 1071, originalPrice: 1849, rating: 4.7, reviews: 201, tag: "Modern Decor", discount: "42%", image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&q=80&w=600" }
  ],
  trendingProducts: [
    { id: 1, name: "Monstera Deliciosa", price: 499, originalPrice: 699, rating: 4.8, reviews: 124, tag: "Best Seller", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600" },
    { id: 2, name: "Snake Plant Zeylanica", price: 299, originalPrice: 399, rating: 4.9, reviews: 89, tag: "Low Light", image: "https://images.unsplash.com/photo-1598880940080-c9fa8fae1ee5?auto=format&fit=crop&q=80&w=600" },
    { id: 3, name: "Peace Lily", price: 349, originalPrice: 450, rating: 4.7, reviews: 210, tag: "Air Purifier", image: "https://images.unsplash.com/photo-1593691509543-c20fb51b4b09?auto=format&fit=crop&q=80&w=600" },
    { id: 4, name: "Fiddle Leaf Fig", price: 899, originalPrice: 1299, rating: 4.6, reviews: 56, tag: "New Arrival", image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&q=80&w=600" }
  ]
};


const productSections = [
  {
    title: "Trending Now",
    subtitle: "Our most loved plants right now.",
    viewAllText: "Shop Trending",
    mobileViewAllText: "View All Trending Plants",
    tag: "TRENDING",
    href: "/plants/trending",
  },
  {
    title: "Easy Care Plants",
    subtitle: "Resilient, low-maintenance plants perfect for beginners.",
    viewAllText: "Shop Easy Care Plants",
    mobileViewAllText: "View All Easy Care",
    tag: "EASY_CARE",
    href: "/plants/easy-care-plants",
  },
  {
    title: "Air Purifying",
    subtitle: "Plants that naturally cleanse your indoor air.",
    viewAllText: "Shop Air Purifying",
    mobileViewAllText: "View All Air Purifying Plants",
    tag: "AIR_PURIFYING",
    href: "/plants/air-purifying",
  },
];

export default function Home() {

  const currentFestival = getCurrentFestival();
  const navigate = useNavigate();

  // Core Web Vitals monitoring
  useCoreWebVitals({ debug: false, sendToAnalytics: true });

  useEffect(() => {
    logger.info('Home page viewed', { festival: currentFestival?.name || 'none' });
    logger.track('page_view', { page: 'home', festival: currentFestival?.name });
  }, [currentFestival]);

  // Dynamic SEO based on current festival
  const seoTitle = currentFestival
    ? `${currentFestival.name} Plants - MayaVriksh | Maya Vriksh - The Tree of Magic`
    : 'MayaVriksh - Best Online Plant Nursery India | Maya Vriksh | Buy Indoor Plants';

  const seoDescription = currentFestival
    ? `${currentFestival.description} Shop ${currentFestival.name} plants at MayaVriksh (Maya Vriksh) - The Tree of Magic. Free delivery across India.`
    : 'MayaVriksh (Maya Vriksh) - India\'s #1 online plant nursery. Maya means magic, Vriksh means tree. The Tree of Magic. Buy 90+ indoor plants, air-purifying, Vastu plants with free delivery.';

  const seoKeywords = currentFestival
    ? `${currentFestival.keywords}, MayaVriksh, Maya Vriksh, mayavriksh, maya plants, indoor plants India, Vastu plants, air purifying plants`
    : 'MayaVriksh, Maya Vriksh, mayavriksh, maya vriksha, maya plants, magic tree, vriksh, indoor plants India, buy plants online, Vastu plants, air purifying plants, lucky plants, best plant nursery India';

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getPlantCategories,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#2E5C41] selection:text-white pb-10 overflow-x-hidden">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl="https://mayavriksh.in/"
        ogUrl="https://mayavriksh.in/"
        type="website"
      />

      {/* JSON-LD Schemas for Rich Results */}
      <OrganizationSchema />
      <WebSiteSchema />
      <LocalBusinessSchema />
      <FAQSchema faqs={DEFAULT_PLANT_FAQS} />

      {/* Dev-only Sentry Test Button */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50">
          <SentryTestButton />
        </div>
      )}

      <HeadSection />
      <PlantCategories categories={categories} />
      <OccasionGrid />

      {productSections.map((section) => (
        <ProductCategories
          key={section.tag}
          title={section.title}
          subtitle={section.subtitle}
          viewAllText={section.viewAllText}
          mobileViewAllText={section.mobileViewAllText}
          tag={section.tag}
          onViewAll={() => navigate(section.href)}
        />
      ))}
      <EditorialBentoGrid />
      <Reels />
      <WhyChooseUsSection data={HOME_PAGE_DATA.whyUs} />
      <BlogSection />
      <AboutSection data={HOME_PAGE_DATA.about} />
      <TestimonialSection />
    </main>
  );
}
