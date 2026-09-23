
import { Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <div className="bg-background">
      {/* ─── HERO ─── */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=2000&auto=format&fit=crop"
            alt="Timeless Silks"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-left px-8 md:px-16 max-w-7xl mx-auto w-full"
        >
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
            EXPLORE THE HANDLOOM HERITAGE WITH MAHESHWARI SILK
          </Link>
        </motion.div>
      </section>

      {/* ─── SHOP BY FABRIC ─── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-primary">Shop by Fabric</h2>
          <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/shop?category=banarasi" className="relative h-64 md:h-80 group overflow-hidden border border-supporting/50">
            <img src="https://images.unsplash.com/photo-1583391733958-6c5188f54124?q=80&w=800&auto=format&fit=crop" alt="Banarasi" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <span className="bg-accent/90 text-white text-[10px] uppercase tracking-widest px-2 py-1 mb-2 inline-block">Pure</span>
              <h3 className="text-white text-2xl font-serif">Banarasi</h3>
              <p className="text-white/80 text-xs tracking-widest mt-1">Starting from ₹5,999</p>
            </div>
          </Link>
          <Link to="/shop?category=kanjivaram" className="relative h-64 md:h-80 group overflow-hidden border border-supporting/50">
            <img src="https://images.unsplash.com/photo-1617261971759-40899ab4c759?q=80&w=800&auto=format&fit=crop" alt="Kanjivaram" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <span className="bg-accent/90 text-white text-[10px] uppercase tracking-widest px-2 py-1 mb-2 inline-block">Authentic</span>
              <h3 className="text-white text-2xl font-serif">Kanjivaram</h3>
              <p className="text-white/80 text-xs tracking-widest mt-1">Starting from ₹8,999</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── SILK SAREES (CIRCULAR CATEGORIES) ─── */}
      <section className="py-10 bg-white border-y border-supporting/30">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex justify-start md:justify-center gap-8 min-w-max">
            {[
              { name: 'Pure Silk', img: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=200&auto=format&fit=crop' },
              { name: 'Soft Silk', img: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?q=80&w=200&auto=format&fit=crop' },
              { name: 'Cotton', img: 'https://images.unsplash.com/photo-1617261971759-40899ab4c759?q=80&w=200&auto=format&fit=crop' },
              { name: 'Chanderi', img: 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=200&auto=format&fit=crop' },
              { name: 'Kanjivaram', img: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=200&auto=format&fit=crop' },
              { name: 'Banarasi', img: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?q=80&w=200&auto=format&fit=crop' },
              { name: 'Linen', img: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=200&auto=format&fit=crop' },
            ].map((cat, i) => (
              <Link key={i} to={`/shop?category=${cat.name.toLowerCase()}`} className="flex flex-col items-center gap-3 group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent transition-all p-1">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-xs text-secondary font-medium tracking-wide group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <div className="bg-background py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-10 md:gap-20">
          {[
            { icon: Shield, label: '100% Pure Silk' },
            { icon: RotateCcw, label: 'Handloom' },
            { icon: Truck, label: 'Free Shipping' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full border border-accent flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-16 px-4 bg-supporting/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-primary">New Arrivals</h2>
            <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group bg-white p-2 pb-4 border border-supporting/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=600&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-accent text-white text-[10px] px-2 py-0.5 uppercase tracking-wide">New</div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-primary mb-1">Emerald Green Silk Saree</h3>
                  <p className="text-secondary text-sm">₹12,499</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop?collection=new" className="inline-block bg-primary text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors">
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SHOP BY COLLECTION ─── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-primary">Shop By Collection</h2>
          <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Wedding Collection', img: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=600&auto=format&fit=crop' },
            { title: 'Tissue', img: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop' },
            { title: 'Jamdani', img: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?q=80&w=600&auto=format&fit=crop' },
            { title: 'Silk Cotton', img: 'https://images.unsplash.com/photo-1617261971759-40899ab4c759?q=80&w=600&auto=format&fit=crop' },
          ].map((col, i) => (
            <Link key={i} to={`/shop?collection=${col.title.toLowerCase()}`} className="group relative aspect-square overflow-hidden border border-supporting/50">
              <img src={col.img} alt={col.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl md:text-2xl font-serif text-center uppercase tracking-widest border border-white/50 px-4 py-2 backdrop-blur-sm">{col.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── DEMANDING PRODUCTS ─── */}
      <section className="py-16 px-4 bg-white border-t border-supporting/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-primary">Demanding Products</h2>
            <div className="w-12 h-px bg-accent mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
               <div key={item} className="group bg-background p-2 pb-4 border border-supporting/50 shadow-sm hover:shadow-md transition-shadow">
               <div className="relative aspect-[3/4] overflow-hidden mb-4">
                 <img src="https://images.unsplash.com/photo-1617261971759-40899ab4c759?q=80&w=600&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] px-2 py-0.5 uppercase tracking-wide">Trending</div>
               </div>
               <div className="text-center">
                 <h3 className="text-sm font-medium text-primary mb-1">Magenta Kanjivaram Silk</h3>
                 <p className="text-secondary text-sm">₹15,999</p>
               </div>
             </div>
            ))}
          </div>
           <div className="text-center mt-10">
            <Link to="/shop?collection=trending" className="inline-block bg-transparent border border-primary text-primary px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
              View All
            </Link>
          </div>
        </div>
      </section>

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
