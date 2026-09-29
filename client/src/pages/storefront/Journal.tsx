import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';

interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  author: string;
  createdAt: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export const Journal = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['published-blogs'],
    queryFn: async () => (await api.get('/blogs')).data,
  });
  const articles: JournalPost[] = data?.data || [];
  const [featured, ...rest] = articles;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isLoading || isError || !featured) {
    return (
      <main className="min-h-[60vh] bg-background flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-3">The Maheshwari Journal</h1>
          <p className="text-secondary" role={isError ? 'alert' : undefined}>
            {isLoading ? 'Loading published stories...' : isError ? 'Journal entries are temporarily unavailable.' : 'New journal entries are coming soon.'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 text-white">
        {/* Background Decorative Pattern */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&q=80&w=1600')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        {/* Watermark Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[18vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none font-serif">
            JOURNAL
          </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300 backdrop-blur-md mb-6">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              The Maheshwari Journal
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight"
          >
            Stories of Silk & Heritage
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary-light text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Explore the rich tapestry of Indian handloom — from ancient weaving techniques and silk authentication guides to contemporary styling for the modern connoisseur.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Featured Article Card */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-20">
          <Link 
            to={`/journal/${featured.slug}`} 
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 md:p-8 border border-supporting/60 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-2xl bg-primary/5">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute top-4 left-4 bg-primary/95 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-amber-300/30 backdrop-blur-md">
                {featured.category}
              </span>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-secondary/70 mb-4">
                <span>{formatDate(featured.createdAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent" /> {featured.readTime}</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-serif text-primary mb-4 leading-snug group-hover:text-accent transition-colors duration-300">
                {featured.title}
              </h2>

              <p className="text-secondary text-sm md:text-base leading-relaxed mb-8">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <span className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest group-hover:bg-accent group-hover:text-primary transition-colors">
                  Read Full Story <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-xs text-secondary font-medium">By {featured.author}</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Section Divider */}
        <div className="flex items-center gap-6 mb-16">
          <div className="flex-1 h-px bg-supporting/80" />
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
            <Sparkles className="w-3.5 h-3.5" /> Recent Journal Entries
          </span>
          <div className="flex-1 h-px bg-supporting/80" />
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {rest.map((article, index) => (
            <motion.div
              key={article.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index + 1}
              variants={fadeUp}
            >
              <Link to={`/journal/${article.slug}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-supporting/60 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-supporting/50 backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-secondary/70 mb-3">
                    <span>{formatDate(article.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-accent" /> {article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-serif text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-supporting/40 mt-auto">
                    <span className="text-xs text-primary font-bold group-hover:text-accent transition-colors flex items-center gap-1">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] text-secondary/60 font-medium">{article.author}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
