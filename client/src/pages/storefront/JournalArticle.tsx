import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, BookOpen, User, Calendar, Tag, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const JournalArticle = () => {
  const { slug } = useParams();

  // Mock article data
  const article = {
    title: 'How to Identify Pure Silk: The Connoisseur\'s Guide',
    excerpt: 'Real silk has a subtle warmth and lustre that synthetics cannot replicate. We share the burn test, feel test, and visual cues every silk lover should know.',
    content: `
      <p class="mb-6 text-lg leading-relaxed text-secondary font-medium">For centuries, pure silk has been a symbol of luxury, royalty, and unparalleled craftsmanship. But as the market floods with synthetic alternatives and blended fabrics, identifying an authentic handwoven silk saree has become an essential skill for any connoisseur.</p>
      
      <h3 class="text-2xl md:text-3xl font-serif text-primary mt-12 mb-4 font-bold flex items-center gap-2">
        <span class="text-accent text-xl font-sans">01.</span> The Touch & Crunch Test
      </h3>
      <p class="mb-6 leading-relaxed text-secondary">The most immediate indicator of pure silk is its touch. Real silk possesses a unique warmth and a subtle, uneven texture (often referred to as 'slubs') due to its natural organic origin. When you rub pure silk between your fingers, you might feel a slight, satisfying resistance—a phenomenon master weavers call the "crunch." Synthetics, on the other hand, often feel artificially slick, cool, and overly slippery.</p>
      
      <h3 class="text-2xl md:text-3xl font-serif text-primary mt-12 mb-4 font-bold flex items-center gap-2">
        <span class="text-accent text-xl font-sans">02.</span> The Definitive Burn Test
      </h3>
      <p class="mb-6 leading-relaxed text-secondary">While we don't recommend setting your heirloom sarees on fire, the burn test is the single most definitive scientific test for silk. If you extract a tiny single thread from the inner hem:</p>
      <div class="bg-primary/5 border-l-4 border-accent p-6 rounded-r-2xl my-6 space-y-3">
        <p class="flex items-start gap-2 text-primary font-medium">
          <strong class="text-primary font-bold min-w-28">Pure Silk:</strong> Burns slowly with a faint smell of burning hair, leaving a crisp black ash that crumbles immediately into powder upon touching. It stops burning once the flame source is removed.
        </p>
        <p class="flex items-start gap-2 text-primary font-medium">
          <strong class="text-primary font-bold min-w-28">Art Silk / Polyester:</strong> Melts rapidly, smells like burning plastic, and leaves behind a hard, plastic-like melted bead that cannot be crushed.
        </p>
      </div>

      <h3 class="text-2xl md:text-3xl font-serif text-primary mt-12 mb-4 font-bold flex items-center gap-2">
        <span class="text-accent text-xl font-sans">03.</span> Lustre & Prism Refraction
      </h3>
      <p class="mb-6 leading-relaxed text-secondary">Pure silk has a natural, iridescent lustre that shifts dynamically depending on the angle of light. Because of the triangular prism-like structure of natural silk fibers, it refracts light in multiple directions, producing subtle, multi-toned hues. Artificial silk simply reflects light uniformly with a flat, glossy sheen.</p>
      
      <blockquote class="my-10 p-8 rounded-3xl bg-primary text-white text-xl md:text-2xl font-serif italic text-center relative overflow-hidden border border-amber-300/30 shadow-xl">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(181,138,58,0.2),_transparent_40%)]" />
        <p class="relative z-10 text-cream">
          "A true handloom silk saree does not merely drape over the body; it flows with it, carrying centuries of human artistry within every thread."
        </p>
        <span class="block mt-4 text-xs font-sans not-italic uppercase tracking-widest text-amber-300 font-bold">— Weaver Master Guild</span>
      </blockquote>

      <h3 class="text-2xl md:text-3xl font-serif text-primary mt-12 mb-4 font-bold flex items-center gap-2">
        <span class="text-accent text-xl font-sans">04.</span> Silk Mark Certification
      </h3>
      <p class="mb-6 leading-relaxed text-secondary">At Maheshwari Silk, every single saree is authenticated with the Silk Mark Organisation of India (SMOI) tag. This government-recognized certification guarantees 100% natural silk quality in both warp and weft.</p>
    `,
    image: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1400&auto=format&fit=crop',
    category: 'Silk Education',
    readTime: '5 min read',
    date: 'September 18, 2026',
    author: 'Aarti Desai',
    authorRole: 'Master Textile Historian',
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Top Banner Navigation */}
      <div className="bg-primary border-b border-white/10 text-white py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/journal" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Articles
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-white/60 hidden sm:inline-block">The Maheshwari Journal</span>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative bg-primary text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[20vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none font-serif">
            ARTICLE
          </span>
        </div>

        <div className="relative max-w-3xl mx-auto text-center z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300 backdrop-blur-md mb-6">
              <Tag className="w-3.5 h-3.5 text-amber-300" />
              {article.category}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight"
          >
            {article.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-cream/80 uppercase tracking-wider"
          >
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-amber-300" /> By {article.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-300" /> {article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-300" /> {article.readTime}</span>
          </motion.div>
        </div>
      </div>

      {/* Featured Cover Image Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[16/9] bg-primary/10"
        >
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Article Content Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div 
          className="text-base sm:text-lg text-secondary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Author Bio Box */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-supporting/60 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-primary text-amber-300 flex items-center justify-center font-serif text-2xl font-bold shrink-0 shadow-md">
            AD
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">{article.authorRole}</span>
            <h4 className="text-xl font-serif font-bold text-primary mb-2">{article.author}</h4>
            <p className="text-xs text-secondary leading-relaxed">
              Curator and textile historian specializing in central and southern Indian handloom traditions. Dedicated to preserving authentic silk weaving heritage.
            </p>
          </div>
        </div>

        {/* Share & Footer Section */}
        <div className="mt-12 pt-8 border-t border-supporting flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/journal" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Journal
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-accent" /> Share Article:
            </span>
            <button className="px-4 py-2 rounded-full border border-supporting text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors">
              Twitter
            </button>
            <button className="px-4 py-2 rounded-full border border-supporting text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors">
              Facebook
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};
