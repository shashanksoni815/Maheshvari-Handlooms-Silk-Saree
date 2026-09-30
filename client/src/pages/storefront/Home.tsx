import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Shield, Truck, Star, Loader2, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Award, Quote, Leaf, Heart, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../services/api';
import { ProductCard } from '../../components/product/ProductCard';

const EMPTY_BANNERS: any[] = [];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

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
    }, 6000);
    return () => window.clearInterval(timer);
  }, [heroBanners.length]);

  const fabricBanners: any[] = homeData?.fabricBanners || [];
  const categories: any[] = homeData?.categories || [];
  const collections: any[] = homeData?.collections || [];
  const newArrivals: any[] = homeData?.newArrivals || [];
  const demandingProducts: any[] = homeData?.demandingProducts || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.25em] text-accent font-bold">Loading Royal Collections...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* ─── 1. HERO CAROUSEL ─── */}
      <section className="relative w-full h-[45vh] sm:h-[60vh] md:h-[75vh] lg:h-[85vh] min-h-[320px] max-h-[850px] overflow-hidden bg-primary">
        <AnimatePresence mode="wait">
          {heroBanner ? (
            <motion.div
              key={heroBanner._id || activeHeroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 h-full w-full"
            >
              {heroBanner.link ? (
                <Link to={heroBanner.link} className="block h-full w-full cursor-pointer">
                  <picture className="block h-full w-full">
                    {heroBanner.mobileImage && <source media="(max-width: 767px)" srcSet={heroBanner.mobileImage} />}
                    <img
                      src={heroBanner.image}
                      alt={heroBanner.title || 'Maheshwari Silk Banner'}
                      className="h-full w-full object-cover object-top"
                    />
                  </picture>
                </Link>
              ) : (
                <picture className="block h-full w-full">
                  {heroBanner.mobileImage && <source media="(max-width: 767px)" srcSet={heroBanner.mobileImage} />}
                  <img
                    src={heroBanner.image}
                    alt={heroBanner.title || 'Maheshwari Silk Banner'}
                    className="h-full w-full object-cover object-top"
                  />
                </picture>
              )}
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-primary flex items-center justify-center text-center p-6">
              <div className="max-w-2xl text-white">
                <span className="inline-flex items-center gap-2 border border-amber-300/40 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300 backdrop-blur-md mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Handwoven Heritage • Since 1984
                </span>
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight font-bold">
                  Royal Maheshwari Silk Sarees
                </h1>
                <p className="text-sm md:text-base text-cream/90 leading-relaxed mb-8 max-w-lg mx-auto">
                  Crafted on traditional handlooms with pure silk threads, zari borders, and timeless Indian art heritage.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-amber-300 text-primary px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
                >
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Carousel Controls */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex items-center gap-3">
            <button
              onClick={() => setActiveHeroIndex((activeHeroIndex - 1 + heroBanners.length) % heroBanners.length)}
              className="w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-amber-300 hover:text-primary transition-colors shadow-lg"
              title="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === activeHeroIndex ? 'w-8 bg-amber-300' : 'w-2 bg-white/50'}`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveHeroIndex((activeHeroIndex + 1) % heroBanners.length)}
              className="w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-amber-300 hover:text-primary transition-colors shadow-lg"
              title="Next Banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>

      {/* ─── 2. TRUST HIGHLIGHTS BAR ─── */}
      <section className="py-12 bg-white border-b border-supporting/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: Shield,
              title: '100% Pure Silk Guarantee',
              desc: 'Silk Mark Certified handloom sarees sourced directly from master weavers.'
            },
            {
              icon: Award,
              title: 'Handloom Artistry',
              desc: 'Woven with real gold zari and centuries-old imperial Maheshwari techniques.'
            },
            {
              icon: Truck,
              title: 'Insured Pan-India Express',
              desc: 'Complimentary shipping across India with secure signature delivery.'
            },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={idx}
              variants={fadeUp}
              className="flex flex-col items-center p-8 rounded-3xl bg-primary/5 border border-primary/10 shadow-xs hover:border-amber-300/40 hover:bg-primary/10 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-primary text-amber-300 flex items-center justify-center mb-5 shadow-md">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-xl text-primary mb-2 tracking-wide">{title}</h4>
              <p className="text-xs text-secondary leading-relaxed max-w-xs font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 3. CIRCULAR CATEGORIES ─── */}
      {categories.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-2">Explore By Craft</span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary font-bold">Categories of Silk</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto mt-3 rounded-full" />
          </div>

          <div className="flex justify-start md:justify-center items-center gap-8 overflow-x-auto pb-4 custom-scrollbar">
            {categories.map((cat, i) => (
              <Link key={cat._id || i} to={`/shop?category=${cat.slug}`} className="group flex flex-col items-center gap-3 shrink-0">
                <div className="w-28 h-28 rounded-full p-1 border-2 border-transparent group-hover:border-accent transition-all duration-300 shadow-sm group-hover:shadow-lg bg-white">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-serif font-bold text-center p-2">
                      {cat.name}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary group-hover:text-accent transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── 4. SHOP BY FABRIC / FEATURED WEAVES ─── */}
      {fabricBanners.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-2">Master Weavers Choice</span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary font-bold">Shop By Weave & Fabric</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fabricBanners.slice(0, 2).map((banner, i) => (
              <motion.div key={banner._id || i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Link to={banner.link || '/shop'} className="group relative h-80 md:h-96 rounded-3xl overflow-hidden block shadow-lg border border-supporting">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-amber-300 text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-amber-300/30 mb-3 inline-block">
                      Signature Fabric
                    </span>
                    <h3 className="text-white text-3xl font-serif font-bold drop-shadow-md mb-2">{banner.title}</h3>
                    <p className="text-xs text-cream/90 font-medium group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      Discover Collection <ArrowRight className="w-3.5 h-3.5" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 5. NEW ARRIVALS ─── */}
      {newArrivals.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-supporting/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent bg-amber-300/10 px-4 py-1.5 rounded-full border border-amber-300/30 inline-block mb-3">
                Fresh Off The Looms
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-primary font-bold">New Arrivals</h2>
              <div className="w-12 h-0.5 bg-accent mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors shadow-md">
                Explore All New Arrivals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── 6. SHOP BY COLLECTION ─── */}
      {collections.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-2">Curated Themes</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-primary font-bold">Featured Collections</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.slice(0, 4).map((col, i) => (
              <motion.div key={col._id || i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Link to={`/shop?collection=${col.slug}`} className="group relative aspect-[3/4] rounded-3xl overflow-hidden block shadow-md border border-supporting">
                  {(col.bannerImage || col.image) && (
                    <img src={col.bannerImage || col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6 text-center">
                    <h3 className="text-white text-xl font-serif font-bold drop-shadow-md mb-2">{col.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 group-hover:bg-amber-300 group-hover:text-primary transition-colors">
                      View Collection →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 7. DEMANDING PRODUCTS / TRENDING NOW ─── */}
      {demandingProducts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-supporting/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 inline-block mb-3">
                Most Coveted Pieces
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-primary font-bold">Trending Sarees</h2>
              <div className="w-12 h-0.5 bg-accent mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {demandingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/shop" className="inline-flex items-center gap-2 border-2 border-primary text-primary bg-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors shadow-sm">
                View Entire Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── 8. CLIENT TESTIMONIALS & REVIEWS ─── */}
      <section className="py-20 px-4 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(181,138,58,0.15),_transparent_60%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300 block mb-2">Patron Stories</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-bold">Loved By Connoisseurs</h2>
            <div className="w-12 h-0.5 bg-amber-300 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Radhika Sharma',
                city: 'Mumbai',
                review: 'The drape and sheen of the Maheshwari silk saree I ordered for my daughter’s wedding was nothing short of divine. True heirloom quality!',
                saree: 'Royal Zari Silk Saree',
                stars: 5,
              },
              {
                name: 'Ananya Roy',
                city: 'Kolkata',
                review: 'As someone who has collected sarees for 20 years, the weave density and pure silk authenticity here is unmatched. Flawless delivery.',
                saree: 'Banarasi Brocade Saree',
                stars: 5,
              },
              {
                name: 'Priya Sundaram',
                city: 'Bengaluru',
                review: 'The Silk Mark certification tag gave me complete peace of mind. Beautiful craftsmanship and elegant packaging!',
                saree: 'Chanderi Gold Motif Saree',
                stars: 5,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                variants={fadeUp}
                className="bg-white/10 border border-white/20 p-8 rounded-3xl backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-300 mb-4">
                    {[...Array(item.stars)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-300" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-amber-300/40 mb-2" />
                  <p className="text-sm text-cream/90 leading-relaxed italic mb-6">
                    "{item.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">{item.name}</h4>
                    <span className="text-[11px] text-amber-300 font-medium">{item.city}</span>
                  </div>
                  <span className="text-[10px] text-cream/60 uppercase tracking-widest">{item.saree}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. THE ART OF HANDLOOM (HERITAGE PHILOSOPHY) ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-2">Our Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-serif text-primary font-bold">The Art of Handloom</h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-supporting aspect-[4/3] bg-primary/10 relative group">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
              alt="Artisan Handloom Weaving"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="space-y-6 lg:pl-6">
            <span className="text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">
              Centuries of Tradition
            </span>
            <h3 className="text-3xl font-serif text-primary font-bold leading-snug">
              Every Warp & Weft Tells a Story of Royalty
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              Originating in the 18th century under the royal patronage of Queen Ahilyabai Holkar, Maheshwari sarees are renowned for their reversible borders, light weight, and lustrous silk texture.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              Our master artisans dedicate up to 45 days to complete a single heirloom piece, manually inserting gold zari threads into intricate traditional motifs like Narmada Leher and Chandrakala.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors shadow-md"
            >
              Explore Artisan Creations →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 10. PILLARS OF INTEGRITY (BRAND VALUES) ─── */}
      <section className="py-20 bg-white border-t border-supporting/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-2">Pillars of Integrity</span>
            <h2 className="text-3xl md:text-5xl font-serif text-primary font-bold">Why Maheshwari Silk?</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Authenticity', description: 'Every saree comes with a certificate of authenticity, sourced directly from generational weavers.' },
              { icon: Leaf, title: 'Sustainability', description: 'We champion eco-conscious practices, supporting weaving communities and ethical raw material sourcing.' },
              { icon: Heart, title: 'Craftsmanship', description: "Each piece is a result of up to 45 days of painstaking handloom work by India's finest artisans." },
              { icon: Users, title: 'Community', description: "We are not just a brand — we are a movement to preserve India's intangible cultural weaving heritage." },
            ].map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div key={val.title} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="p-8 rounded-3xl bg-background border border-supporting/60 hover:border-accent hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-amber-300 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-primary mb-2">{val.title}</h4>
                  <p className="text-xs text-secondary leading-relaxed">{val.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
