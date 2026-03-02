import { anniversaryGiftCard, birthDayGiftCard, festivalGiftCard, officeGiftCard } from "@/constants/bannerImageUrl";
import { useNavigate } from "react-router-dom";

export function OccasionGrid() {
    const navigate = useNavigate();
    const occasions = [
        {
            title: "Birthday Gifts",
            img: birthDayGiftCard,
            color: "bg-pink-100",
            href: "/plants/gift-plants",
        },
        {
            title: "Anniversary",
            img: anniversaryGiftCard,
            color: "bg-purple-100",
            href: "/plants/gift-plants",
        },
        {
            title: "Festive Gifts",
            img: festivalGiftCard,
            color: "bg-orange-100",
            href: "/plants/gift-plants",
        },
        {
            title: "Office Desk",
            img: officeGiftCard,
            color: "bg-blue-100",
            href: "/plants/gift-plants",
        },
    ];

    return (
        <section className="mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shop by Occasion</h2>
                <p className="text-slate-500 mt-2">Perfect green gifts for every celebration</p>
            </div>
            <div className="flex justify-center items-center">
                <div className="w-[100%] md:w-[90%] grid grid-cols-2 md:grid-cols-4 gap-4 ">

                    {occasions.map((occ, i) => (
                        <div key={i}

                            onClick={() => navigate(occ.href)}
                            className="group relative min-h-64 lg:max-w-95 lg:h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                            <img
                                src={occ.img}
                                className="absolute inset-0 w-[100%] h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt={occ.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6">
                                <h3 className="text-white font-black text-xl">{occ.title}</h3>
                                <span className="text-white/80 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    Explore <span className="text-lg">→</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}