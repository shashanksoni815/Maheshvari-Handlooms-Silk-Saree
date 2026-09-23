import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (collectionError || !collection) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-background">
        <h1 className="text-3xl font-serif text-primary mb-4">Collection Not Found</h1>
        <button onClick={() => navigate('/collections')} className="text-xs uppercase tracking-widest text-accent hover:underline underline-offset-4">
          Return to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Campaign Hero */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={collection.image || `https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80`} 
          alt={collection.name} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] font-bold mb-4 drop-shadow-md text-white/90">
            The Campaign
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg leading-tight">
            {collection.name}
          </h1>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        <p className="text-lg md:text-xl text-secondary font-serif leading-relaxed italic">
          "{collection.description}"
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between border-b border-supporting pb-4 mb-12">
          <h2 className="text-2xl font-serif text-primary">Explore The Collection</h2>
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">{products.length} Pieces</span>
        </div>

        {isProductsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-secondary">No products available in this collection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer CTA */}
      <div className="border-t border-supporting py-16 text-center bg-supporting/5">
        <Link 
          to="/collections" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all collections
        </Link>
      </div>
    </div>
  );
};
