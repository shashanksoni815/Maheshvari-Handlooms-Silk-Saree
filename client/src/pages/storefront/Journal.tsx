import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const articles = [
  {
    slug: 'how-to-identify-pure-silk',
    title: 'How to Identify Pure Silk: The Connoisseur\'s Guide',
    excerpt: 'Real silk has a subtle warmth and lustre that synthetics cannot replicate. We share the burn test, feel test, and visual cues every silk lover should know.',
    image: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800&auto=format&fit=crop',
    category: 'Silk Education',
    readTime: '5 min read',
    date: 'September 18, 2026',
  },
  {
    slug: 'the-story-of-banarasi-weaving',
    title: 'The Story of Banarasi Weaving: 500 Years of Heritage',
    excerpt: 'From the Mughal courts of Varanasi to the wardrobes of modern brides, we trace the extraordinary journey of India\'s most celebrated silk weave.',
    image: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?q=80&w=800&auto=format&fit=crop',
    category: 'Heritage',
    readTime: '8 min read',
    date: 'September 10, 2026',
  },
  {
    slug: 'styling-a-silk-saree-for-modern-occasions',
    title: 'Styling a Silk Saree for Modern Occasions',
    excerpt: 'A silk saree is never just for weddings. From boardrooms to date nights, our style guide shows you how to carry this timeless garment into every moment of your life.',
    image: 'https://images.unsplash.com/photo-1617261971759-40899ab4c759?q=80&w=800&auto=format&fit=crop',
    category: 'Style Guide',
    readTime: '6 min read',
    date: 'September 4, 2026',
  },
  {
    slug: 'caring-for-your-silk-saree',
    title: 'The Complete Guide to Caring for Your Silk Saree',
    excerpt: 'A precious silk saree, with proper care, will outlast you. Learn the do\'s and don\'ts of storage, cleaning, and maintenance from our master weavers.',
    image: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=800&auto=format&fit=crop',
    category: 'Care Guide',
    readTime: '7 min read',
    date: 'August 28, 2026',
  },
];

export const Journal = () => {
  const [featured, ...rest] = articles;

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-16 text-center bg-supporting/20 border-b border-supporting">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-4">The Maheshwari Journal</p>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Stories of Silk & Heritage</h1>
          <p className="text-secondary leading-relaxed">
            Explore the world of Indian handloom — from weaving traditions and silk education to styling inspiration for the modern connoisseur.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Article */}
        <Link to={`/journal/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-4 left-4 bg-primary text-white text-xs uppercase tracking-widest px-3 py-1.5">
              {featured.category}
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span>{featured.date}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.readTime}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4 group-hover:text-accent transition-colors">
              {featured.title}
            </h2>
            <p className="text-secondary leading-relaxed mb-6">{featured.excerpt}</p>
            <span className="inline-flex items-center text-primary font-medium text-sm tracking-wide border-b border-primary pb-0.5 w-fit group-hover:text-accent group-hover:border-accent transition-colors">
              Read Article <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-16">
          <div className="flex-1 h-px bg-supporting"></div>
          <span className="text-xs uppercase tracking-widest text-gray-500">More Stories</span>
          <div className="flex-1 h-px bg-supporting"></div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {rest.map((article) => (
            <Link key={article.slug} to={`/journal/${article.slug}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-5">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-white text-primary text-[10px] uppercase tracking-widest px-2 py-1 font-medium">
                  {article.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>{article.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
              </div>
              <h3 className="text-lg font-serif text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-secondary text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
