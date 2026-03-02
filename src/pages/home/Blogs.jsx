import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { arpanImage, blogImage1, blogImage2, blogImage3, blogImage4 } from "@/constants/bannerImageUrl";

const BLOG_DATA = [
    {
        id: 1,
        category: "GROW",
        title: "13 Ways to Save Your Drying or Dead Plant",
        excerpt: "Don't throw it out just yet! Learn the exact steps to revive your wilting green friends back to their former glory.",
        image: blogImage1,
        date: "Feb 15, 2026",
        readTime: "5 min read",
        author: {
            name: "Mr. Arpan Halder",
            role: "PhD Botanist",
            avatar: arpanImage
        },
        tags: ["Plant Care", "Troubleshooting", "Indoor Plants"],
        content: [
            { type: 'p', text: "We've all been there. You bring home a beautiful, vibrant plant, only to watch it slowly lose its luster over the following weeks. The leaves crisp up, the stems droop, and panic sets in. But before you relegate your green friend to the compost bin, take a deep breath. Many 'dead' plants are just dormant or severely stressed, waiting for the right care to bounce back." },
            { type: 'h2', text: "1. Assess the Soil Moisture" },
            { type: 'p', text: "The most common culprit of plant demise is improper watering—either too much or too little. Stick your index finger about an inch or two into the soil. If it's bone dry all the way through, your plant is severely dehydrated. If it's soggy, mushy, or smells a bit like a swamp, you're likely dealing with overwatering and potential root rot." },
            { type: 'h2', text: "2. The 'Bottom Watering' Rescue" },
            { type: 'p', text: "If the soil is completely desiccated, water will often just run down the sides of the pot and out the drainage holes without actually saturating the root ball. To fix this, fill a bowl or sink with room-temperature water and place the pot inside. Let it sit for 30-45 minutes to soak up moisture from the bottom up." },
            { type: 'quote', text: "Patience is key. A plant didn't start dying overnight, and it won't recover overnight either. Give it time to respond to your changes." },
            { type: 'h2', text: "3. Prune the Dead Weight" },
            { type: 'p', text: "Using a pair of sterilized pruning shears, carefully snip away any leaves that are completely brown, crispy, or mushy. The plant is wasting valuable energy trying to keep these dying parts alive. By removing them, you redirect that energy to the healthy stems and new growth." },
            { type: 'h2', text: "4. Check for Uninvited Guests" },
            { type: 'p', text: "Inspect the undersides of the leaves and the joints where leaves meet the stem. Look for tiny webs (spider mites), sticky residue (aphids), or little cotton-like bumps (mealybugs). If you spot pests, isolate the plant immediately and treat it with neem oil or a gentle insecticidal soap." }
        ]
    },
    {
        id: 2,
        category: "NURTURE",
        title: "10 Types of Fertilizers That Help To Grow",
        excerpt: "Plants prepare their food via photosynthesis, but the right soil nutrients are the secret to massive, lush leaves.",
        image: blogImage2,
        date: "Feb 10, 2026",
        readTime: "8 min read",
        author: {
            name: "David Chen",
            role: "Soil Scientist",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
        },
        tags: ["Fertilizer", "Soil Health", "Nutrients"],
        content: [
            { type: 'p', text: "While sunlight and water are the primary drivers of plant growth, think of fertilizer as the daily multivitamin your plants need to truly thrive. Potted plants, in particular, quickly deplete the nutrients in their confined soil, making regular feeding essential for vibrant foliage and robust blooms." },
            { type: 'h2', text: "Understanding N-P-K" },
            { type: 'p', text: "Before choosing a fertilizer, you need to decode the three numbers on the label (e.g., 10-10-10). These stand for Nitrogen (N), Phosphorus (P), and Potassium (K)." },
            { type: 'p', text: "• Nitrogen: Promotes lush, green leafy growth.\n• Phosphorus: Essential for root development and flowering.\n• Potassium: Helps with overall plant health and disease resistance." },
            { type: 'h2', text: "Liquid vs. Slow-Release" },
            { type: 'p', text: "Liquid fertilizers offer a quick, easily absorbed nutrient boost, making them perfect for addressing immediate deficiencies. However, they need to be applied frequently (usually every 2-4 weeks). Slow-release granular fertilizers, on the other hand, provide a steady stream of nutrients over several months, requiring much less maintenance." },
            { type: 'quote', text: "Always err on the side of under-fertilizing. Too much fertilizer can burn plant roots and cause more harm than good. When in doubt, dilute!" },
            { type: 'h2', text: "Organic Options" },
            { type: 'p', text: "If you prefer natural methods, worm castings, fish emulsion, and kelp meal are excellent choices. They not only provide nutrients but also improve the overall microbiome of your soil, leading to healthier roots." }
        ]
    },
    {
        id: 3,
        category: "DECOR",
        title: "15 Winter Flowers for Indian Gardens",
        excerpt: "Flowers are colorful, fragrant, and exude the joy of life. Discover the most popular blooming plants for your home.",
        image: blogImage3,
        date: "Jan 28, 2026",
        readTime: "6 min read",
        author: {
            name: "Priya Sharma",
            role: "Landscape Designer",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        tags: ["Winter", "Gardening", "Floral", "India"],
        content: [
            { type: 'p', text: "Winter in India brings a welcome respite from the scorching summer heat. It also brings the perfect climate for a spectacular array of vibrant blooms. Whether you have a sprawling lawn or a modest balcony, adding winter flowering plants can instantly elevate your space." },
            { type: 'h2', text: "The Classics: Petunias and Marigolds" },
            { type: 'p', text: "No Indian winter garden is complete without Petunias. Available in almost every color imaginable—from deep purples to striped pinks—they cascade beautifully from hanging baskets. Marigolds (Genda), deeply rooted in Indian culture, offer brilliant pops of yellow and orange and serve as excellent companion plants that deter pests." },
            { type: 'h2', text: "Pansies: The Smiling Faces" },
            { type: 'p', text: "With their unique, face-like patterns, pansies are a favorite among gardeners. They thrive in cooler temperatures and do exceptionally well in shallow pots and window boxes. Be sure to deadhead (remove spent flowers) regularly to encourage continuous blooming throughout the season." },
            { type: 'quote', text: "Preparation is everything. Start sowing your winter seeds by late September or early October to ensure your garden is in full bloom by December." },
            { type: 'h2', text: "Dahlias for Drama" },
            { type: 'p', text: "If you want statement pieces, look no further than Dahlias. These tuberous plants produce massive, intricate blooms that command attention. They require rich, well-draining soil and plenty of sunlight, but the breathtaking results are well worth the effort." }
        ]
    },
    {
        id: 4,
        category: "GUIDE",
        title: "Ultimate Guide to Indoor Plant Lighting",
        excerpt: "Not all light is created equal. Learn how to identify bright indirect light vs low light in your home.",
        image: blogImage4,
        date: "Jan 15, 2026",
        readTime: "4 min read",
        author: {
            name: "Alex Rivera",
            role: "Indoor Plant Specialist",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150"
        },
        tags: ["Lighting", "Indoor Plants", "Basics"],
        content: [
            { type: 'p', text: "Lighting is arguably the most confusing aspect of indoor plant care. Plant tags often use vague terms like 'bright indirect light' or 'low light,' leaving plant parents guessing where to place their new leafy friends. Let's demystify these terms once and for all." },
            { type: 'h2', text: "Decoding 'Bright Indirect Light'" },
            { type: 'p', text: "This is the holy grail of plant lighting, preferred by about 80% of common houseplants (like Monsteras, Pothos, and Philodendrons). Bright indirect light means the plant is in a very bright room, but the sun's rays are not directly hitting the leaves. Think of a spot a few feet away from a sunny south or west-facing window, or directly in front of an east-facing window." },
            { type: 'quote', text: "The Shadow Test: Hold your hand a few inches above the plant during the brightest part of the day. A sharp, distinct shadow means direct light. A soft, fuzzy shadow means bright indirect light." },
            { type: 'h2', text: "The Myth of 'Low Light'" },
            { type: 'p', text: "It's crucial to understand that 'low light' does not mean 'no light.' Plants like Snake Plants and ZZ Plants tolerate low light, but they don't thrive in it; they merely survive. If you have to turn on a lamp to read a book in that corner during the day, it's too dark for a plant." },
            { type: 'h2', text: "Direct Sunlight" },
            { type: 'p', text: "Direct sunlight occurs when the sun's rays hit the plant unfiltered. South and west-facing windows provide this. Succulents, cacti, and some tropicals like Birds of Paradise love this intense light, but it will quickly scorch the delicate leaves of a Calathea or Fern." }
        ]
    }
];

export const BlogSection = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const cardWidth = container.firstChild.offsetWidth + 24; // card width + gap
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(index);
    };

    const scrollToIndex = (index) => {
        const container = scrollRef.current;
        if (!container) return;

        const cardWidth = container.firstChild.offsetWidth + 24;
        container.scrollTo({
            left: index * cardWidth,
            behavior: "smooth",
        });
    };

    return (
        <section className="py-4 md:py-12 w-full max-w-[1800px] mx-auto overflow-hidden px-6 lg:px-10">

            {/* Header */}
            <div className="px-4 md:px-8 lg:px-12 xl:px-16 flex justify-between items-end mb-8 md:mb-12">
                <div>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#1A3626]">
                        The Green Room
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm md:text-base max-w-xl">
                        Expert tips, care guides, and botanical inspiration to help your urban jungle thrive.
                    </p>
                </div>
            </div>

            {/* Scrollable Cards */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-4 md:px-8 lg:px-12 xl:px-16 gap-6 md:gap-8"
            >
                {BLOG_DATA.map((blog) => (
                    <article
                        key={blog.id}
                        onClick={() => navigate("/blog", { state: { blog } })}
                        className="group shrink-0 snap-start w-[85vw] sm:w-[340px] md:w-[400px] xl:w-[450px] flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    >
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-serif text-[#1A3626] mb-3 line-clamp-2">
                                {blog.title}
                            </h3>

                            <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1">
                                {blog.excerpt}
                            </p>

                            <div className="flex justify-between pt-5 border-t">
                                <span className="text-xs font-bold text-slate-400 uppercase">
                                    {blog.date}
                                </span>
                                <span className="text-sm font-bold text-[#1A3626]">
                                    Read Article
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Carousel Dots - Mobile Only */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
                {BLOG_DATA.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            activeIndex === index
                                ? "w-6 bg-[#2E5C41]"
                                : "w-2 bg-slate-300"
                        }`}
                    />
                ))}
            </div>

        </section>
    );
};

export const BlogPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const blog = location.state?.blog || null;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (!blog) {
        navigate("../");
        return;
    }


    return (
        <div className="min-h-screen bg-white pb-20 animate-in fade-in duration-500">
            {/* Navigation Bar for Blog Page */}


            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
                {/* Header Section */}
                <header className="mb-10 text-center">
                    {/* <div className="flex items-center justify-center gap-2 mb-6 text-sm font-semibold tracking-wider uppercase text-green-600">
                        <span>{blog.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500 flex items-center gap-1">
                            <Clock size={14} /> {blog.readTime}
                        </span>
                    </div> */}

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-8">
                        {blog?.title}
                    </h1>

                    <div className="flex items-center justify-center gap-4 sm:gap-6 text-left border-y border-gray-100 py-6 max-w-2xl mx-auto">
                        <img
                            src={blog?.author?.avatar}
                            alt={blog?.author?.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-green-100"
                        />
                        <div>
                            <p className="font-bold text-gray-900 text-lg">{blog?.author.name}</p>
                            <p className="text-gray-500 text-sm">{blog?.author.role}</p>
                        </div>
                        <div className="h-10 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                        <div className="hidden sm:block">
                            <p className="font-medium text-gray-900">Published</p>
                            <p className="text-gray-500 text-sm">{blog?.date}</p>
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                <div className="w-full aspect-[21/9] sm:aspect-[21/10] rounded-3xl overflow-hidden mb-12 shadow-2xl relative">
                    <img
                        src={blog?.image}
                        alt={blog?.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-lg sm:prose-xl prose-green">
                        {blog?.content.map((block, index) => {
                            switch (block.type) {
                                case 'h2':
                                    return (
                                        <h2 key={index} className="text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-6">
                                            {block.text}
                                        </h2>
                                    );
                                case 'p':
                                    return (
                                        <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg sm:text-xl">
                                            {block.text}
                                        </p>
                                    );
                                case 'quote':
                                    return (
                                        <blockquote key={index} className="border-l-4 border-green-500 pl-6 py-2 my-8 italic text-xl sm:text-2xl text-gray-800 bg-green-50/50 rounded-r-xl">
                                            "{block.text}"
                                        </blockquote>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </div>

                    {/* Tags */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                        <span className="font-bold text-gray-900 mr-2 flex items-center">Tags:</span>
                        {blog?.tags.map(tag => (
                            <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-green-100 hover:text-green-800 transition-colors cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPage;