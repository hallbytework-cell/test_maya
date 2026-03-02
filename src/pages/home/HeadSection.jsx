import React, { useState, useEffect, useTransition, } from "react";
import {
    ArrowRight,
    Leaf,
    ShieldCheck,
    Truck,
    Headphones,
    Zap,
    Timer,
} from "lucide-react";
import { getPlantsByTag } from "@/api/customer/plant";
import ProductCard from "@/components/ui/cards/ProductCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useNavigate } from "react-router-dom";


const HOME_PAGE_DATA = {
    hero: {
        badge: "The Spring Collection",
        title: "Bring the outdoors in.",
        subtitle: "Create your personal sanctuary with our hand-picked, nursery-fresh plants delivered directly to your door.",
        image: "https://res.cloudinary.com/dwdu18hzs/image/upload/v1771754430/universal_uploads/univ_1771754420094_0_1771754420095.avif"
    },
    trustBadges: [
        { id: 1, icon: "Truck", title: "Free Shipping", desc: "On orders over ₹999" },
        { id: 2, icon: "ShieldCheck", title: "Transit Guarantee", desc: "Safe arrival promised" },
        { id: 3, icon: "Leaf", title: "Nursery Fresh", desc: "Straight from the farm" },
        { id: 4, icon: "Headphones", title: "Expert Care", desc: "Lifetime plant support" }
    ],

};

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 45, seconds: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const format = (num) => num.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-1.5 md:gap-2">
            <Timer className="w-4 h-4 md:w-5 md:h-5 text-orange-500 animate-pulse" />
            <div className="flex gap-1 text-sm md:text-base font-black text-orange-600 font-mono bg-orange-100 px-3 py-1 rounded-lg">
                <span>{format(timeLeft.hours)}h</span>
                <span className="animate-[pulse_1s_ease-in-out_infinite]">:</span>
                <span>{format(timeLeft.minutes)}m</span>
                <span className="animate-[pulse_1s_ease-in-out_infinite]">:</span>
                <span>{format(timeLeft.seconds)}s</span>
            </div>
        </div>
    );
};

export const HeroSection = ({ data }) => {
    const navigate = useNavigate();
    return (
        <section className="relative h-[60vh] md:h-[70vh] min-h-[500px] lg:min-h-[600px] w-full bg-[#1A3626] overflow-hidden">
            {/* Background Image with Ken Burns Zoom Effect */}
            <div className="absolute inset-0">
                <img
                    src={data.image}
                    alt="Lush green plants"
                    className="w-full h-full object-cover opacity-60 animate-[kenburns_20s_ease-out_infinite_alternate]"
                    style={{ transformOrigin: 'center center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3626] via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A3626]/90 via-[#1A3626]/40 to-transparent" />
            </div>

            {/* Hero Content */}
            <div className="relative h-full w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center items-start">
                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs md:text-sm font-bold tracking-widest uppercase mb-6 border border-white/20 shadow-xl">
                        {data.badge}
                    </span>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-6">
                        Bring the <span className="italic text-[#E8F3E8] block md:inline">outdoors</span> in.
                    </h1>

                    <p className="text-base md:text-xl text-[#E8F3E8]/80 mb-10 max-w-lg font-light leading-relaxed">
                        {data.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button onClick={() => navigate("/category/plants")} className="w-full sm:w-auto px-8 py-4 bg-white text-[#1A3626] rounded-full font-bold text-base md:text-lg hover:bg-[#E8F3E8] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                            Shop All Plants
                        </button>
                        <button className="w-full opacity-0 sm:w-auto px-8 py-4 bg-transparent text-white border border-white/40 rounded-full font-bold text-base md:text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                            Take the Plant Quiz
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Tailwind animation injected for Ken Burns effect */}
            <style>{`
      @keyframes kenburns {
        0% { transform: scale(1); }
        100% { transform: scale(1.1); }
      }
    `}</style>
        </section>
    )
};

export const TrustBar = ({ badges }) => {
    const iconMap = { Truck, ShieldCheck, Leaf, Headphones };

    return (
        <div className="relative z-20 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 -mt-10 md:-mt-16">
            <ScrollReveal>
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-[#1A3626]/5 border border-[#F9F6F0] p-6 md:p-8 lg:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x-0 md:divide-x divide-slate-100">
                        {badges.map((item, i) => {
                            const Icon = iconMap[item.icon];
                            return (
                                <div key={item.id} className={`flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4 ${i !== 0 ? 'md:pl-8' : ''}`}>
                                    <div className="w-12 h-12 rounded-full bg-[#F2F7F4] flex items-center justify-center text-[#2E5C41] shrink-0 transition-transform hover:scale-110 duration-300">
                                        {Icon && <Icon className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm md:text-base font-bold text-[#1A3626] leading-tight">{item.title}</h4>
                                        <p className="text-[11px] md:text-xs text-slate-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
};

const CategoryCarousel = ({ categories }) => (
    <section className="py-12 md:py-20 w-full max-w-[1800px] mx-auto overflow-hidden">
        <ScrollReveal className="px-4 md:px-8 lg:px-12 xl:px-16 flex justify-between items-end mb-8 md:mb-12">
            <div>
                <h2 className="text-3xl md:text-4xl font-serif text-[#1A3626]">Shop by Category</h2>
                <p className="text-slate-500 mt-2 text-sm md:text-base">Find the perfect green companion for your space</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[#2E5C41] font-bold hover:gap-3 transition-all">
                View All <ArrowRight className="w-5 h-5" />
            </button>
        </ScrollReveal>

        <ScrollReveal delay={100}>
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-4 md:px-8 lg:px-12 xl:px-16 gap-4 md:gap-8">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex flex-col items-center gap-3 md:gap-4 shrink-0 snap-start group cursor-pointer w-[100px] md:w-[140px] xl:w-[160px]">
                        <div className="w-24 h-24 md:w-36 md:h-36 xl:w-40 xl:h-40 rounded-full overflow-hidden border-[3px] md:border-4 border-white shadow-lg group-hover:border-[#2E5C41] group-hover:shadow-xl transition-all duration-500">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <span className="font-bold text-[#1A3626] text-xs md:text-sm xl:text-base text-center group-hover:text-[#2E5C41] transition-colors">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </ScrollReveal>

        <style>{`
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
    </section>
);

export const LimitedDropSection = () => {
    const [products, setProducts] = useState([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const products = await getPlantsByTag('Trending', 4)
            setProducts(products)
        })
    }, [])



    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-[#FFF8F0] to-[#FDFBF7] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-400/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[1800px] mx-auto">
                <ScrollReveal className="px-4 md:px-8 lg:px-12 xl:px-16 flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-14 gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 text-orange-600 mb-2 md:mb-3">
                            <Zap className="w-6 h-6 md:w-8 md:h-8 fill-orange-500 animate-pulse" />
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 uppercase italic">
                                Flash Drop
                            </h2>
                        </div>
                        <p className="text-slate-600 text-sm md:text-base font-medium">Massive discounts on premium plants. Once they're gone, they're gone.</p>
                    </div>

                    <CountdownTimer />
                </ScrollReveal>

                {/* Reduced mobile card size: width set to w-[220px] and snap-start so next card peeks in */}
                <ScrollReveal delay={100} className="relative z-10">
                    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-4 md:px-8 lg:px-12 xl:px-16 gap-3 sm:gap-4 md:gap-6 xl:gap-8 items-stretch">
                        {products.map((product) => (
                            <div key={product.id} className="shrink-0 snap-start w-[220px] sm:w-[280px] md:w-auto h-full">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
};

export function HeadSection() {
    return (
        <main className=" bg-[#FDFBF7] font-sans selection:bg-[#2E5C41] selection:text-white pb-10 overflow-x-hidden">
            <HeroSection data={HOME_PAGE_DATA.hero} />
            <TrustBar badges={HOME_PAGE_DATA.trustBadges} />
        </main>
    );
}



export function BlogPreview() {
    return (
        <section className="bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">Plant Care 101</h2>
                        <p className="text-slate-500 mt-1">Become the ultimate plant parent</p>
                    </div>
                    <button className="hidden md:block px-6 py-2 border-2 border-emerald-600 text-emerald-600 font-bold rounded-full hover:bg-emerald-600 hover:text-white transition-all">
                        Read Our Blog
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((post) => (
                        <div key={post} className="bg-white rounded-3xl overflow-hidden group shadow-sm">
                            <div className="h-48 bg-slate-200 overflow-hidden">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1512428813833-41492049e63e')] bg-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Care Tips</span>
                                <h4 className="text-xl font-bold text-slate-900 mt-2 line-clamp-2">How to keep your Fiddle Leaf Fig alive during winter</h4>
                                <p className="text-slate-500 text-sm mt-3 line-clamp-3">Watering schedules and sunlight requirements are critical for this species during cold months...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
