import { useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { useNavigate } from 'react-router-dom';
import { Leaf, Sprout, Globe, Heart, ChevronRight } from 'lucide-react';
import logger from '@/lib/logger';

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    logger.info('About page viewed');
    logger.track('page_view', { page: 'about' });
  }, []);

  return (
    <section className="overflow-x-hidden bg-stone-50">
      {/* SEO Meta Tags */}
      <SEOHead
        title="About Mayavriksh - The Magic of Nature & Plants | Maya"
        description="Discover Mayavriksh - India's leading online plant nursery. Learn the story behind 'Maya,' our mission to bring nature's magic to Indian homes, and our commitment to air-purifying, Vastu-friendly plants."
        keywords="Maya plants, Mayavriksh story, online plant nursery India, sustainable plants, Vastu plants, air purifying plants, plant experts India"
        canonicalUrl="https://mayavriksh.in/about"
        ogUrl="https://mayavriksh.in/about"
        type="website"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4">About Mayavriksh</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The Magic of Nature, Delivered to Your Home
          </p>
        </div>

        {/* The Maya Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why "Maya"?</h2>
            <p className="text-lg text-slate-700 mb-4">
              "Maya" in Sanskrit represents the magic and illusion of nature—the incredible power of creation and transformation. At Mayavriksh, we believe every plant carries this magic. When you bring a plant into your home, you are not just adding greenery; you are inviting the mystical energy of nature.
            </p>
            <p className="text-lg text-slate-700 mb-4">
              The name "Mayavriksh" literally translates to "The Tree of Magic" in Hindi. We are dedicated to connecting Indian homes, offices, and hearts with this transformative power of plants.
            </p>
            <p className="text-lg text-slate-700">
              Whether it is a Vastu-friendly plant for prosperity, an air-purifying plant for healthier living, or a gift to express your love—we believe every plant tells a story of magic and renewal.
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-12 text-white shadow-2xl">
            <Leaf className="w-20 h-20 mb-6 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg leading-relaxed">
              To bring the transformative magic of nature to every Indian home, office, and heart through carefully curated, sustainable plants that purify, inspire, and connect us to the earth.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: 'Sustainability',
                description: 'We grow and source plants responsibly, ensuring minimal environmental impact.'
              },
              {
                icon: Heart,
                title: 'Quality',
                description: 'Every plant is hand-selected and cared for to ensure it reaches you in perfect condition.'
              },
              {
                icon: Sprout,
                title: 'Expertise',
                description: 'Our plant experts guide you in choosing and caring for plants suited to your space.'
              },
              {
                icon: Globe,
                title: 'Community',
                description: 'We are building a community of plant lovers across India united by nature magic.'
              },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-stone-100 hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Choose Mayavriksh?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              '90+ hand-picked plant varieties for every space and need',
              'Free delivery across India with care guidelines',
              'Vastu-friendly and air-purifying plant selections',
              'Expert guidance on plant care and placement',
              'Secure online payment with multiple options',
              'Customer-first approach with 100% satisfaction guarantee',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <ChevronRight className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <span className="text-lg text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Start Your Plant Journey with Maya Today</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of plant parents who have experienced the magic of nature through Mayavriksh
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Explore Our Plants
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Connect With Us */}
      <div className="bg-slate-900 text-white py-12 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-6">Connect with Mayavriksh</h3>
          <p className="text-lg text-stone-300 mb-8">Follow our social profiles for plant care tips, stories, and special offers</p>
          <div className="flex justify-center gap-6">
            {[
              { name: 'Instagram', url: 'https://instagram.com/mayavriksh' },
              { name: 'Facebook', url: 'https://facebook.com/mayavriksh' },
              { name: 'Twitter', url: 'https://twitter.com/mayavriksh' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white hover:underline text-lg font-semibold transition-colors"
              >
                Follow us
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}