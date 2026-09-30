import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export const Collections = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const response = await api.get('/collections?isActive=true');
      return response.data;
    },
  });

  const collections = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || collections.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-background p-6 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">Heritage Collections</span>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">No Collections Found</h1>
        <p className="text-secondary text-xs sm:text-sm mb-6">Our master weavers are preparing upcoming seasonal collections.</p>
        <Link to="/shop" className="bg-primary text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:bg-accent hover:text-primary transition-all">
          Explore All Sarees
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-primary">
      
      {/* Hero Section */}
      <div className="relative bg-primary text-white overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay filter blur-[1px]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583391733959-b52d9a334ece?auto=format&fit=crop&q=80&w=1600')` }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[18vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none font-serif">
            COLLECTIONS
          </span>
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-white/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Bespoke Handloom Collections
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6"
          >
            Curated Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-cream/90 max-w-2xl mx-auto text-sm sm:text-base font-medium leading-relaxed"
          >
            Each collection is a tribute to the master weavers who craft stories into six yards of pure silk.
          </motion.p>
        </div>
      </div>

      {/* Collections List Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {collections.map((collection: any, index: number) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div 
              key={collection._id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
              variants={fadeUp}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-supporting/60 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}>
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <Link to={`/collections/${collection.slug}`} className="block relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden group border border-supporting/50">
                    <img 
                      src={collection.bannerImage || collection.image || `https://images.unsplash.com/photo-1583391733959-b52d9a334ece?auto=format&fit=crop&w=800&q=80`} 
                      alt={collection.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  </Link>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-start lg:px-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-4">
                    {collection.isFeatured ? 'Featured Heritage Collection' : 'Handloom Series'}
                  </span>
                  
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-primary mb-4">
                    {collection.name}
                  </h2>

                  <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-8 max-w-lg">
                    {collection.description}
                  </p>

                  <Link 
                    to={`/collections/${collection.slug}`}
                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-md"
                  >
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
