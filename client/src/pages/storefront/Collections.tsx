import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || collections.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-background">
        <h1 className="text-3xl font-serif text-primary mb-4">No Collections Found</h1>
        <Link to="/shop" className="text-xs uppercase tracking-widest text-accent hover:underline underline-offset-4">
          Explore All Sarees
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="bg-supporting/10 pt-20 pb-16 px-4 text-center border-b border-supporting/30 mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6 tracking-wide">Curated Collections</h1>
        <p className="max-w-2xl mx-auto text-secondary font-serif italic text-lg leading-relaxed">
          "Each collection is a tribute to the artisans who weave magic into six yards of silk. Discover stories crafted in pure handloom."
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-24">
        {collections.map((collection: any, index: number) => {
          const isEven = index % 2 === 0;
          
          return (
            <div key={collection._id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <Link to={`/collections/${collection.slug}`} className="block relative aspect-[4/5] overflow-hidden group">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 duration-700" />
                  <img 
                    src={collection.image || `https://images.unsplash.com/photo-1583391733959-b52d9a334ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                    alt={collection.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 flex flex-col justify-center items-start">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-4 block">
                  {collection.isFeatured ? 'Featured Collection' : 'Curated'}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6 leading-tight">
                  {collection.name}
                </h2>
                <p className="text-secondary leading-relaxed mb-10 max-w-lg">
                  {collection.description}
                </p>
                <Link 
                  to={`/collections/${collection.slug}`}
                  className="group flex items-center text-xs font-bold uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors"
                >
                  Explore Collection 
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
