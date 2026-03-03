import { ScrollReveal } from "@/components/ScrollReveal";
import { easyCareImage, giftImage, sunLovingCard } from "@/constants/bannerImageUrl";
import { ArrowRight, Droplets, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OptimizedImageResponsive from "@/components/OptimizedImageResponsive";

export const EditorialBentoGrid = () => {
    const navigate = useNavigate();
    return (
        <section className="py-16 md:py-24 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
            <ScrollReveal className="text-center mb-10 md:mb-16">
                <h2 className="text-3xl md:text-5xl font-serif text-[#1A3626] mb-4">Plants for every purpose.</h2>
                <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">Whether you're decorating a sunny windowsill or a dark corner, we have a green friend for you.</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 xl:gap-8 auto-rows-[250px] md:auto-rows-[300px] xl:auto-rows-[400px]">

                <ScrollReveal delay={0} className="md:col-span-2 md:row-span-2 relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                    <div onClick={() => navigate("/plants/gift-plants")}>
                        <OptimizedImageResponsive src={giftImage} width={600} height={500} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gifting" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3626]/90 via-[#1A3626]/20 to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 xl:bottom-12 xl:left-12">
                            <span className="inline-block px-3 py-1 bg-[#F9F6F0] text-[#1A3626] text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full mb-3">Curated Sets</span>
                            <h3 className="text-3xl md:text-4xl xl:text-5xl font-serif text-white mb-2">The Art of Gifting</h3>
                            <p className="text-white/80 mb-4 max-w-sm xl:max-w-md text-sm md:text-base xl:text-lg">Meaningful, growing gifts for birthdays, anniversaries, and housewarmings.</p>
                            <button className="text-white font-bold flex items-center gap-2 group-hover:gap-4 transition-all border-b border-white pb-1 text-sm md:text-base xl:text-lg">
                                Shop Gifts <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5" />
                            </button>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={100} className="relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer bg-[#F2F7F4] p-6 md:p-8 xl:p-10 flex flex-col  shadow-md">
                    <div onClick={() => navigate("/plants/sun-loving-plants")}>
                        <div className="relative text-center z-10 text-white">
                            <h3 className="text-2xl xl:text-3xl font-serif  mb-1">Sun Loving</h3>
                            <p className="] font-medium text-xs md:text-sm xl:text-base">For bright, sunny spots.</p>
                        </div>
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 xl:top-8 xl:right-8 w-10 h-10 md:w-12 md:h-12 xl:w-16 xl:h-16 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm z-10 group-hover:scale-110 transition-transform">
                            <Sun className="w-5 h-5 md:w-6 md:h-6 xl:w-8 xl:h-8" />
                        </div>
                        <OptimizedImageResponsive src={sunLovingCard} width={400} height={400} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply scale-120 group-hover:scale-130 transition-transform duration-700" alt="Sun Loving" />
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={200} className="relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer bg-[#F9F6F0] p-6 md:p-8 xl:p-10 flex flex-col  shadow-md" >
                    <div onClick={() => navigate("/plants/easy-care-plants")}>
                        <div className="relative text-center z-10">
                            <h3 className="text-2xl xl:text-3xl font-serif  mb-1">Easy Care</h3>
                            <p className="text-[#2E5C41] font-medium text-xs md:text-sm xl:text-base">Perfect for beginners.</p>
                        </div>
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 xl:top-8 xl:right-8 w-10 h-10 md:w-12 md:h-12 xl:w-16 xl:h-16 bg-white rounded-full flex items-center justify-center text-blue-400 shadow-sm z-10 group-hover:scale-110 transition-transform">
                            <Droplets className="w-5 h-5 md:w-6 md:h-6 xl:w-8 xl:h-8" />
                        </div>
                        <OptimizedImageResponsive src={easyCareImage} width={400} height={400} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply scale-120 group-hover:scale-130 transition-transform duration-700" alt="Low Maintenance" />
                    </div>
                </ScrollReveal>

            </div>
        </section>
    )
};