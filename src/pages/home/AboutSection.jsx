import { ScrollReveal } from "@/components/ScrollReveal";


export const AboutSection = ({ data }) => {
    // A helper function to parse [highlighted] text into styled spans (SEO friendly styling)
    const parseDescription = (text) => {
        const parts = text.split(/(\[.*?\])/g);
        return parts.map((part, index) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                const word = part.slice(1, -1);
                return (
                    <span
                        key={index}
                        className="text-[#1A3626] font-bold border-b-2 border-[#2E5C41]/40 cursor-pointer hover:border-[#2E5C41] hover:text-[#2E5C41] transition-all"
                    >
                        {word}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <section className="py-4 md:py-12 bg-[#FDFBF7] border-t border-[#F2F7F4]">
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12 text-center">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#1A3626] mb-8">
                        {data.title}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-loose md:leading-loose lg:leading-loose font-light">
                        {parseDescription(data.description)}
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
};
