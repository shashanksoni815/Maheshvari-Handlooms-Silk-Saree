import React, { useState, useEffect, useRef } from 'react';
import { X, Search as SearchIcon, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['search-products', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm.trim()) return null;
      const res = await api.get(`/products?search=${debouncedTerm}`);
      return res.data?.data?.slice(0, 3); // Limit to 3 for suggestions
    },
    enabled: !!debouncedTerm.trim(),
  });

  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ['search-blogs', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm.trim()) return null;
      const res = await api.get(`/blogs?search=${debouncedTerm}`);
      return res.data?.data?.slice(0, 2); // Limit to 2 for suggestions
    },
    enabled: !!debouncedTerm.trim(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const hasResults = productsData?.length > 0 || blogsData?.length > 0;
  const isSearching = productsLoading || blogsLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col"
        >
          <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-24">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 md:top-12 md:right-12 p-2 text-secondary hover:text-accent transition-colors"
              aria-label="Close search"
            >
              <X className="w-8 h-8" strokeWidth={1.5} />
            </button>

            <form onSubmit={handleSubmit} className="relative group max-w-3xl mx-auto">
              <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-secondary/50 group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search sarees, collections, fabrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-b-2 border-secondary/20 py-4 pl-12 pr-4 text-2xl md:text-4xl font-serif text-primary placeholder:text-secondary/30 focus:border-primary focus:outline-none transition-colors"
              />
            </form>

            <div className="mt-12 max-w-3xl mx-auto">
              {!debouncedTerm.trim() && (
                <div className="animate-in fade-in duration-500">
                  <h3 className="text-sm font-medium tracking-widest uppercase text-secondary/60 mb-6">Popular Searches</h3>
                  <div className="flex flex-wrap gap-4">
                    {['Banarasi Silk', 'Kanjivaram', 'Wedding Sarees', 'Handloom Sarees', 'Green Silk Sarees'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchTerm(term)}
                        className="px-4 py-2 border border-secondary/20 rounded-full text-sm font-serif text-secondary hover:border-accent hover:text-accent transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isSearching && (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
              )}

              {!isSearching && debouncedTerm.trim() && !hasResults && (
                <div className="text-center py-12 text-secondary font-serif text-lg">
                  No results found for "{debouncedTerm}"
                </div>
              )}

              {!isSearching && hasResults && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {productsData && productsData.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium tracking-widest uppercase text-secondary/60 mb-6 flex justify-between items-center">
                        Products
                        <Link to={`/shop?search=${debouncedTerm}`} onClick={onClose} className="text-primary hover:text-accent flex items-center text-xs">
                          View All <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {productsData.map((product: any) => (
                          <Link 
                            key={product._id} 
                            to={`/product/${product._id}`}
                            onClick={onClose}
                            className="group flex flex-col gap-3"
                          >
                            <div className="aspect-[3/4] bg-supporting/20 overflow-hidden">
                              <img 
                                src={product.images?.[0] || "https://images.unsplash.com/photo-1610189013994-46323c91db10?auto=format&fit=crop&w=400&q=80"} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div>
                              <h4 className="font-serif text-primary group-hover:text-accent transition-colors line-clamp-1">{product.name}</h4>
                              <p className="text-secondary font-medium mt-1">₹{product.price?.toLocaleString('en-IN')}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {blogsData && blogsData.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium tracking-widest uppercase text-secondary/60 mb-6">Journal</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogsData.map((blog: any) => (
                          <Link 
                            key={blog._id} 
                            to={`/journal/${blog.slug}`}
                            onClick={onClose}
                            className="group flex items-start gap-4 p-4 border border-supporting/50 hover:border-accent transition-colors"
                          >
                            <div className="w-20 h-20 shrink-0 bg-supporting/20 overflow-hidden">
                              <img 
                                src={blog.image || "https://images.unsplash.com/photo-1583391733958-d259779e55e5?auto=format&fit=crop&w=200&q=80"} 
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col justify-between h-full">
                              <h4 className="font-serif text-primary group-hover:text-accent transition-colors line-clamp-2 text-sm">{blog.title}</h4>
                              <span className="text-xs tracking-widest uppercase text-primary/60 mt-2 flex items-center group-hover:text-accent transition-colors">
                                Read Article <ArrowRight className="w-3 h-3 ml-1" />
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-supporting/50 text-center">
                    <button 
                      onClick={handleSubmit}
                      className="inline-flex items-center text-sm font-medium tracking-widest uppercase text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors"
                    >
                      View All Results <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
