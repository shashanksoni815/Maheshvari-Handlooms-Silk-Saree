import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Shield, Truck, RotateCcw, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../services/api';
import { ProductCard } from '../../components/product/ProductCard';

const EMPTY_BANNERS: any[] = [];

export const Home = () => {
  const { data: homeData, isLoading } = useQuery({
    queryKey: ['home-page'],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const [bannersRes, categoriesRes, collectionsRes, newArrivalsRes, trendingRes] = await Promise.all([
        api.get('/banners'),
        api.get('/categories'),
        api.get('/collections'),
        api.get('/products?tags=new&limit=4'),
        api.get('/products?tags=trending&limit=4'),
      ]);

      const banners = bannersRes.data?.data || [];
      const getProducts = (response: any) => response.data?.data?.products || response.data?.data || [];
      let newArrivals = getProducts(newArrivalsRes);
      let trendingProducts = getProducts(trendingRes);

      // Avoid the fallback request unless at least one tagged section is empty.
      if (newArrivals.length === 0 || trendingProducts.length === 0) {
        const fallbackResponse = await api.get('/products?limit=8&sort=-createdAt');
        const fallbacks = getProducts(fallbackResponse);
        if (newArrivals.length === 0) newArrivals = fallbacks.slice(0, 4);
        if (trendingProducts.length === 0) trendingProducts = fallbacks.slice(4, 8);
      }

      return {
        heroBanners: banners.filter((banner: any) => banner.position === 'HOME_HERO'),
        fabricBanners: banners.filter((banner: any) => banner.position === 'HOME_FABRIC').sort((a: any, b: any) => a.sortOrder - b.sortOrder),
        categories: categoriesRes.data?.data || [],
        collections: collectionsRes.data?.data || [],
        newArrivals,
        demandingProducts: trendingProducts,
      };
    },
  });

  const heroBanners: any[] = homeData?.heroBanners ?? EMPTY_BANNERS;
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const heroBanner = heroBanners[activeHeroIndex] || null;

  useEffect(() => {
    if (heroBanners.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveHeroIndex(index => (index + 1) % heroBanners.length);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [heroBanners.length]);

  useEffect(() => {
    if (heroBanners.length < 2) return;
    const nextBanner = heroBanners[(activeHeroIndex + 1) % heroBanners.length];
    if (nextBanner?.image) {
      const image = new Image();
      image.src = nextBanner.image;
    }
  }, [activeHeroIndex, heroBanners]);
  const fabricBanners: any[] = homeData?.fabricBanners || [];
  const categories: any[] = homeData?.categories || [];
  const collections: any[] = homeData?.collections || [];
  const newArrivals: any[] = homeData?.newArrivals || [];
  const demandingProducts: any[] = homeData?.demandingProducts || [];

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
      <section className="relative h-[80vh] min-h-[420px] overflow-hidden bg-[#063F35]">
        <AnimatePresence mode="wait">
          {heroBanner ? (
            <motion.div
              key={heroBanner._id || activeHeroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 h-full w-full"
            >
              <picture>
                {heroBanner.mobileImage && <source media="(max-width: 767px)" srcSet={heroBanner.mobileImage} />}
                <img
                  src={heroBanner.image}
                  alt={heroBanner.title}
                  loading={activeHeroIndex === 0 ? 'eager' : 'lazy'}
                  fetchPriority={activeHeroIndex === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-r from-[#081f1b]/90 via-[#081f1b]/55 to-[#081f1b]/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(181,138,58,0.28),_transparent_35%)]" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-[#063F35]" />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={heroBanner?._id || 'default-hero-copy'}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-10 lg:px-16"
          >
            {heroBanner ? (
              <div className="max-w-xl text-left text-white">
                <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/5 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#D5B66A] backdrop-blur-sm">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D5B66A]" />
                  HANDWOVEN HERITAGE
                </div>
                <h1 className="mb-4 text-5xl leading-[0.9] text-white md:text-7xl lg:text-[6rem]">
                  {heroBanner.title}
                </h1>
                <p className="mb-8 max-w-md text-sm leading-7 text-[#efe4d2] md:text-base">
                  Crafted in the looms of India with heirloom artistry, rich zari work, and a legacy of refined elegance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to={heroBanner.link || '/shop'} className="inline-flex items-center justify-center border border-[#D5B66A] bg-[#B58A3A] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFFDF8] transition hover:bg-[#d1b468] hover:text-[#063F35]">
                    Explore Collection
                  </Link>
                  <Link to="/shop" className="inline-flex items-center justify-center border border-white/35 bg-white/5 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm transition hover:bg-white/10">
                    Shop Now
                  </Link>
                </div>
              </div>
            ) : (
              <div className="max-w-xl text-left text-white">
                <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/5 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#D5B66A] backdrop-blur-sm">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D5B66A]" />
                  Handwoven Heritage
                </div>
                <h1 className="mb-4 text-5xl leading-none text-white md:text-7xl lg:text-[6rem]">
                  Maheshwari
                </h1>
                <h2 className="mb-6 text-4xl font-medium italic tracking-[0.06em] text-[#D5B66A] md:text-6xl lg:text-[5rem]">
                  Silk Sarees
                </h2>
                <p className="mb-8 max-w-md text-sm leading-7 text-[#efe4d2] md:text-base">
                  Timeless silhouettes, luminous textures, and heirloom craftsmanship reimagined for the modern bride and collector.
                </p>
                <Link to="/shop" className="inline-flex items-center justify-center border border-[#D5B66A] bg-[#B58A3A] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFFDF8] transition hover:bg-[#d1b468] hover:text-[#063F35]">
                  Explore Handloom Heritage
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 left-6 z-20 flex gap-3 md:left-10">
          {[
            'Pure Silk',
            'Handloom',
            'Free Shipping'
          ].map((label) => (
            <div key={label} className="border border-white/20 bg-[#ffffff12] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              {label}
            </div>
          ))}
        </div>

        {heroBanners.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 md:bottom-10 md:right-12">
            <button type="button" aria-label="Previous hero banner" onClick={() => setActiveHeroIndex(index => (index - 1 + heroBanners.length) % heroBanners.length)} className="rounded-full border border-white/50 bg-[#091f1d]/30 p-2 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#063F35]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero banners">
              {heroBanners.map((banner, index) => (
                <button key={banner._id || index} type="button" role="tab" aria-label={`Show banner ${index + 1}`} aria-selected={index === activeHeroIndex} onClick={() => setActiveHeroIndex(index)} className={`h-2 rounded-full transition-all ${index === activeHeroIndex ? 'w-6 bg-[#D5B66A]' : 'w-2 bg-white/70 hover:bg-white'}`} />
              ))}
            </div>
            <button type="button" aria-label="Next hero banner" onClick={() => setActiveHeroIndex(index => (index + 1) % heroBanners.length)} className="rounded-full border border-white/50 bg-[#091f1d]/30 p-2 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#063F35]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
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
                <img src={banner.image} alt={banner.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
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
                       <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full" />
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50/50">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60 inline-block mb-2">Fresh In Store</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">New Arrivals</h2>
              <div className="w-16 h-0.5 bg-neutral-900 mx-auto mt-3 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-md">
                View All New Arrivals
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── SHOP BY COLLECTION ─── */}
      {collections.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Curated Themes</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">Shop By Collection</h2>
            <div className="w-16 h-0.5 bg-neutral-900 mx-auto mt-3 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.slice(0, 4).map((col, i) => (
              <Link key={col._id || i} to={`/shop?collection=${col.slug}`} className="group relative aspect-square rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md">
                {(col.bannerImage || col.image) && (
                  <img src={col.bannerImage || col.image} alt={col.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute inset-x-6 bottom-8 text-center">
                  <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight drop-shadow-md">{col.name}</h3>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-white/90 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 group-hover:bg-white group-hover:text-neutral-900 transition-all">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── DEMANDING PRODUCTS ─── */}
      {demandingProducts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-neutral-200/80">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200/60 inline-block mb-2">Most Loved</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">Trending Now</h2>
              <div className="w-16 h-0.5 bg-neutral-900 mx-auto mt-3 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {demandingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/shop" className="inline-flex items-center gap-2 border border-neutral-300 text-neutral-900 bg-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider hover:bg-neutral-900 hover:text-white transition-all shadow-sm">
                Explore All Trending Sarees
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
                <img src={img} alt="Happy Customer" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
