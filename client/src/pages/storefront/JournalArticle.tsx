import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, User, Calendar, Tag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';

export const JournalArticle = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['published-blog', slug],
    queryFn: async () => (await api.get(`/blogs/${slug}`)).data,
    enabled: Boolean(slug),
  });
  const article = data?.data;

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (isError || !article) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="text-3xl font-serif text-primary mb-3">Story not found</h1>
        <p className="text-secondary mb-6">This article may be unpublished or no longer available.</p>
        <Link to="/journal" className="inline-flex items-center gap-2 text-primary font-bold">
          <ArrowLeft className="w-4 h-4" /> Return to Journal
        </Link>
      </main>
    );
  }

  const publishedDate = new Date(article.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-300" /> {publishedDate}</span>
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
        <div className="text-base sm:text-lg text-secondary leading-relaxed space-y-5 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-primary [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-primary [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Author Bio Box */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-supporting/60 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-primary text-amber-300 flex items-center justify-center font-serif text-2xl font-bold shrink-0 shadow-md">
            {article.author?.slice(0, 2).toUpperCase() || 'MH'}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">Journal Contributor</span>
            <h4 className="text-xl font-serif font-bold text-primary mb-2">{article.author}</h4>
            <p className="text-xs text-secondary leading-relaxed">{article.excerpt}</p>
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
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full border border-supporting text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors">Twitter</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full border border-supporting text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
      </article>
    </div>
  );
};
