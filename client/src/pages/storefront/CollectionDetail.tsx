import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { ProductCard } from '../../components/product/ProductCard';

export const CollectionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: collectionData, isLoading: isCollectionLoading, error: collectionError } = useQuery({
    queryKey: ['collection', slug],
    queryFn: async () => {
      const response = await api.get(`/collections/slug/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  const collection = collectionData?.data;

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products-by-collection', collection?._id],
    queryFn: async () => {
      const response = await api.get(`/products?collection=${collection._id}&limit=24`);
      return response.data;
    },
    enabled: !!collection?._id,
  });

  const products = productsData?.data?.products || [];

  if (isCollectionLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (collectionError || !collection) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-background text-center px-4">
        <h1 className="text-3xl font-serif text-primary mb-4 font-bold">Collection Not Found</h1>
        <button 
          onClick={() => navigate('/collections')} 
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Campaign Hero */}
      <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent z-10" />
        <img 
          src={collection.bannerImage || `https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80`} 
          alt={collection.name} 
          className="w-full h-full object-cover object-center"
        />
        
        {/* Watermark */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[16vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none font-serif">
            EDIT
          </span>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white px-4 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300 backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              The Campaign Edit
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif mb-6 drop-shadow-lg leading-tight font-bold"
          >
            {collection.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/collections" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> All Collections
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
        <div className="p-8 rounded-3xl bg-white border border-supporting/60 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-3">Collection Curator Note</span>
          <p className="text-base md:text-lg text-secondary font-serif leading-relaxed italic">
            "{collection.description}"
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between border-b border-supporting pb-4 mb-12">
          <h2 className="text-2xl font-serif font-bold text-primary">Explore The Pieces</h2>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
            {products.length} Designs
          </span>
        </div>

        {isProductsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-supporting/60">
            <p className="text-base text-secondary font-serif">No products currently available in this collection edit.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
