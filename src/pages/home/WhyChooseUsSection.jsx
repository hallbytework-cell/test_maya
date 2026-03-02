import { ScrollReveal } from "@/components/ScrollReveal";
import { HeartHandshake, Leaf, Package, ShieldCheck, Sprout } from "lucide-react";

export const WhyChooseUsSection = ({ data }) => {
    const iconMap = { Sprout, Package, HeartHandshake, ShieldCheck };

    return (
        <section className="py-4 md:py-14 bg-gradient-to-b from-white to-[#F2F7F4] relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#E8F3E8] rounded-full blur-[120px] opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#E8F3E8] rounded-full blur-[120px] opacity-60 translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="w-full max-w-[1800px] mx-auto px-4 relative z-10">
                <ScrollReveal className="text-center mb-8">
                    <span className="inline-block px-4 py-1.5 bg-[#E8F3E8] text-[#2E5C41] text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full mb-6 shadow-sm border border-[#2E5C41]/10">
                        Our Promise
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#1A3626] mb-6">
                        Why Choose Maya Vriksh?
                    </h2>
                    <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                        We don't just sell plants; we deliver living, breathing companions nurtured with expert care.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 xl:gap-10">
                    {data.map((item, idx) => {
                        const Icon = iconMap[item.icon];
                        return (
                            <ScrollReveal key={item.id} delay={idx * 150} className="h-full">
                                <div className="group relative h-full flex flex-col p-8 md:p-10 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(46,92,65,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">

                                    {/* Decorative Background Icon */}
                                    <Leaf className="absolute -bottom-6 -right-6 w-32 h-32 text-[#F2F7F4] opacity-50 group-hover:scale-125 group-hover:-rotate-12 group-hover:text-[#E8F3E8] transition-all duration-700 ease-out pointer-events-none" />

                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] bg-[#F2F7F4] group-hover:bg-[#2E5C41] text-[#2E5C41] group-hover:text-white flex items-center justify-center mb-8 relative z-10 transition-colors duration-500 shadow-sm">
                                        {Icon && <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />}
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-serif text-[#1A3626] mb-4 relative z-10 leading-snug">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-500 leading-relaxed text-sm md:text-base relative z-10 font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
