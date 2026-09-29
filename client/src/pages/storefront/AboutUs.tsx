import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Award, Leaf, Heart, Users } from 'lucide-react';

const stats = [
  { value: '45+', label: 'Days per Masterpiece' },
  { value: '1200+', label: 'Master Weavers' },
  { value: '500+', label: 'Unique Weave Patterns' },
  { value: '3', label: 'Generations of Legacy' },
];

const values = [
  { icon: Award, title: 'Authenticity', description: 'Every saree comes with a certificate of authenticity, sourced directly from generational weavers.' },
  { icon: Leaf, title: 'Sustainability', description: 'We champion eco-conscious practices, supporting weaving communities and ethical raw material sourcing.' },
  { icon: Heart, title: 'Craftsmanship', description: "Each piece is a result of up to 45 days of painstaking handloom work by India's finest artisans." },
  { icon: Users, title: 'Community', description: "We are not just a brand — we are a movement to preserve India's intangible cultural weaving heritage." },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12 } }),
};

export const AboutUs = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 text-white">
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[18vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none font-serif">
            LEGACY
          </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300 backdrop-blur-md mb-6">
            ✦ Heritage Since 1984
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
            Weaving Stories of Royal Elegance
          </h1>
          <p className="text-cream/90 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            For four decades, Maheshwari Silk has preserved the sacred handloom traditions of central India — bridging royal heritage with contemporary luxury.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-primary/95 text-white border-y border-amber-300/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
              <span className="block font-serif text-3xl md:text-5xl font-bold text-amber-300 mb-1">{stat.value}</span>
              <span className="text-[11px] uppercase tracking-widest text-cream/80 font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Craftsmanship Story Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-2">Our Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-serif text-primary font-bold">The Art of Handloom</h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-supporting aspect-[4/3] bg-primary/10">
            <img 
              src="https://images.unsplash.com/photo-1583391733958-6c5188f54124?q=80&w=1000&auto=format&fit=crop" 
              alt="Artisan Weaving" 
              className="w-full h-full object-cover"
            />
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

      {/* Brand Values Grid */}
      <section className="py-20 bg-white border-t border-supporting/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-2">Pillars of Integrity</span>
            <h2 className="text-3xl md:text-5xl font-serif text-primary font-bold">Why Maheshwari Silk?</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => {
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
