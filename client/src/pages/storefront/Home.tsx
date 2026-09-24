import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export const Home = () => {
  const [heroBanner, setHeroBanner] = useState<any>(null);
  const [fabricBanners, setFabricBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [demandingProducts, setDemandingProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [
          bannersRes,
          categoriesRes,
          collectionsRes,
          newArrivalsRes,
          demandingRes,
          fallbackRes
        ] = await Promise.all([
          api.get('/banners').catch(() => ({ data: { data: [] } })),
          api.get('/categories').catch(() => ({ data: { data: [] } })),
          api.get('/collections').catch(() => ({ data: { data: [] } })),
          api.get('/products?tags=new&limit=4').catch(() => ({ data: { data: [] } })),
          api.get('/products?tags=trending&limit=4').catch(() => ({ data: { data: [] } })),
          api.get('/products?limit=8&sort=-createdAt').catch(() => ({ data: { data: [] } })), // Fallback if tags are empty
        ]);

        const banners = bannersRes.data?.data || [];
        if (banners.length > 0) {
          setHeroBanner(banners.find((b: any) => b.position === 'HOME_HERO') || banners[0]);
          setFabricBanners(banners.filter((b: any) => b.position === 'HOME_FABRIC').sort((a: any, b: any) => a.sortOrder - b.sortOrder));
        }

        setCategories(categoriesRes.data?.data || []);
        setCollections(collectionsRes.data?.data || []);
        
        let newArr = newArrivalsRes.data?.data || [];
        let trendArr = demandingRes.data?.data || [];
        const fallbacks = fallbackRes.data?.data || [];
        
        // Fallback logic if products aren't manually tagged yet
        if (newArr.length === 0 && fallbacks.length > 0) {
          newArr = fallbacks.slice(0, 4);
        }
        if (trendArr.length === 0 && fallbacks.length > 4) {
          trendArr = fallbacks.slice(4, 8);
        }

        setNewArrivals(newArr);
        setDemandingProducts(trendArr);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background animate-fade-in-up">
      {/* ─── HERO ─── */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-start overflow-hidden bg-primary/90">
        {heroBanner && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={heroBanner.image}
              alt={heroBanner.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-left px-8 md:px-16 max-w-7xl mx-auto w-full"
        >
          {heroBanner ? (
            <>
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 drop-shadow-md leading-tight max-w-2xl">
                {heroBanner.title}
              </h1>
              <Link
                to={heroBanner.link || '/shop'}
                className="inline-block bg-accent/80 backdrop-blur-sm border border-accent/50 text-white px-8 py-4 text-xs font-semibold tracking-[0.2em] hover:bg-accent transition-colors duration-300"
              >
                EXPLORE COLLECTION
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-6xl md:text-8xl font-serif text-accent mb-2 drop-shadow-md leading-none">
                Timeless
              </h1>
              <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 drop-shadow-md leading-none italic">
                Silks
              </h1>
              <Link
                to="/shop"
                className="inline-block bg-accent/20 backdrop-blur-sm border border-accent/50 text-white px-8 py-4 text-xs font-semibold tracking-[0.2em] hover:bg-accent/40 transition-colors duration-300"
              >
                EXPLORE THE HANDLOOM HERITAGE
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* ─── SHOP BY FABRIC ─── */}
      {fabricBanners.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-primary">Shop by Fabric</h2>
            <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fabricBanners.slice(0, 2).map((banner, i) => (
              <Link key={banner._id || i} to={banner.link} className="group relative h-64 md:h-80 overflow-hidden bg-supporting/10">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="text-accent text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-2 py-1 mb-2 inline-block border border-white/20">Featured</span>
                  <h3 className="text-white text-3xl font-serif mt-2 drop-shadow-md">{banner.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── CIRCULAR CATEGORIES ─── */}
      {categories.length > 0 && (
        <section className="py-10 bg-white border-y border-supporting/30">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex justify-start md:justify-center gap-8 min-w-max">
              {categories.map((cat, i) => (
                <Link key={cat._id || i} to={`/shop?category=${cat.slug}`} className="flex flex-col items-center gap-3 group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent transition-all p-1 bg-supporting/10">
                    {cat.image ? (
                       <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-supporting flex items-center justify-center text-xs text-primary text-center p-2 font-serif leading-tight">
                        {cat.name}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-secondary font-medium tracking-wide group-hover:text-primary transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── TRUST BAR ─── */}
      <div className="bg-background py-12 border-y border-supporting/30">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-10 md:gap-20">
          {[
            { icon: Shield, label: '100% Pure Silk' },
            { icon: RotateCcw, label: 'Handloom' },
            { icon: Truck, label: 'Free Shipping' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full border border-accent flex items-center justify-center bg-white shadow-sm">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── NEW ARRIVALS ─── */}
      {newArrivals.length > 0 && (
        <section className="py-16 px-4 bg-supporting/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-primary">New Arrivals</h2>
              <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <Link key={product._id} to={`/product/${product.slug}`} className="group bg-white p-2 pb-4 border border-supporting/50 shadow-sm hover:shadow-md transition-shadow block">
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-supporting/20">
                    {product.images && product.images[0] && (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-2 left-2 bg-accent text-white text-[10px] px-2 py-0.5 uppercase tracking-wide">New</div>
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-sm font-medium text-primary mb-1 truncate">{product.name}</h3>
                    <p className="text-secondary text-sm">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/shop" className="inline-block bg-primary text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors">
                View All
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── SHOP BY COLLECTION ─── */}
      {collections.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-primary">Shop By Collection</h2>
            <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {collections.slice(0, 4).map((col, i) => (
              <Link key={col._id || i} to={`/shop?collection=${col.slug}`} className="group relative aspect-square overflow-hidden border border-supporting/50 bg-supporting/10">
                {(col.bannerImage || col.image) && (
                  <img src={col.bannerImage || col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-xl md:text-2xl font-serif text-center uppercase tracking-widest border border-white/50 px-4 py-2 backdrop-blur-sm">{col.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}      {/* ─── DEMANDING PRODUCTS ─── */}
      {demandingProducts.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-primary">Trending Now</h2>
              <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {demandingProducts.map((product) => (
                <Link key={product._id} to={`/product/${product.slug}`} className="group bg-background p-2 pb-4 border border-supporting/50 shadow-sm hover:shadow-md transition-shadow block">
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-supporting/20">
                    {product.images && product.images[0] && (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] px-2 py-0.5 uppercase tracking-wide">Trending</div>
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-sm font-medium text-primary mb-1 truncate">{product.name}</h3>
                    <p className="text-secondary text-sm">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
             <div className="text-center mt-10">
              <Link to="/shop" className="inline-block bg-transparent border border-primary text-primary px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                View All
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── OUR HAPPY CUSTOMERS ─── */}
      <section className="py-16 px-4 bg-supporting/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-primary">Our Happy Customers</h2>
            <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            {[
              'https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1583391733958-6c5188f54124?q=80&w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1617261971759-40899ab4c759?q=80&w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=400&auto=format&fit=crop',
            ].map((img, i) => (
              <div key={i} className="aspect-square relative group overflow-hidden border border-supporting/50 rounded-sm">
                <img src={img} alt="Happy Customer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent fill-accent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
