import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

const STORES = [
  {
    city: 'Indore',
    name: 'Maheshwari Flagship (SHUBHAM BICHHWE)',
    address: '264 SHUBHAM DIAMOND CITY, SHOP NO.1, SONWAY, INDORE, MP 453331',
    phone: '+91 91793 38474',
    email: 'care@maheshwarisilk.com',
    hours: 'Mon – Sun: 10:00 AM – 8:00 PM',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Flagship Store & HQ',
  },
  {
    city: 'Mumbai',
    name: 'Maheshwari Silk Studio',
    address: '123 Heritage Row, Colaba, Mumbai 400005',
    phone: '+91 22 2345 6789',
    email: 'mumbai@maheshwarisilk.com',
    hours: 'Mon – Sun: 11:00 AM – 8:00 PM',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Studio',
  },
  {
    city: 'Delhi',
    name: 'Maheshwari Boutique',
    address: '45 Artisan Market, Hauz Khas, New Delhi 110016',
    phone: '+91 11 9876 5432',
    email: 'delhi@maheshwarisilk.com',
    hours: 'Mon – Sun: 10:30 AM – 7:30 PM',
    image: 'https://images.unsplash.com/photo-1582046105437-dbd7f9dc6859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Boutique',
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15 } }),
};

export const Stores = () => {
  return (
    <div className="bg-background min-h-screen">

      {/* ── Hero ── */}
      <div className="relative bg-primary py-28 overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center text-[14vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none select-none pointer-events-none">
          Boutiques
        </span>
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-amber-300 mb-5 border border-amber-300/30 px-4 py-1.5 rounded-full">
            3 Exclusive Locations
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Our Boutiques</h1>
          <p className="text-white/60 max-w-lg mx-auto text-sm leading-relaxed">
            Experience the touch of pure silk and the beauty of intricate handloom in person at one of our curated boutiques.
          </p>
        </motion.div>
      </div>

      {/* ── Store Cards ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-14">
        {STORES.map((store, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden border border-supporting/60 shadow-sm hover:shadow-2xl transition-shadow duration-500"
            >
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch`}>

                {/* Image */}
                <div className="w-full lg:w-1/2 relative aspect-[4/3] lg:aspect-auto group overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-5 left-5 bg-accent text-white text-[10px] uppercase tracking-widest font-bold px-3.5 py-1.5 rounded-full">
                    {store.tag}
                  </span>
                  <div className="absolute bottom-5 left-5 text-white">
                    <p className="text-xs uppercase tracking-widest text-amber-300 mb-1 font-semibold">{store.city}</p>
                    <p className="font-serif text-xl">{store.name}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-2">{store.city}</p>
                  <h2 className="text-3xl font-serif text-primary mb-8">{store.name}</h2>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-0.5">Address</p>
                        <p className="text-secondary text-sm leading-relaxed">{store.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-0.5">Phone</p>
                        <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-secondary text-sm hover:text-accent transition-colors">{store.phone}</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-0.5">Email</p>
                        <a href={`mailto:${store.email}`} className="text-secondary text-sm hover:text-accent transition-colors">{store.email}</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-0.5">Hours</p>
                        <p className="text-secondary text-sm">{store.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary-dark transition-all shadow-md hover:shadow-lg active:scale-95">
                      <Navigation className="w-4 h-4" /> Get Directions
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Book Appointment CTA ── */}
      <div className="bg-cream py-20 px-4 text-center">
        <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-bold mb-3">Personalized Experience</p>
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Book a Private Appointment</h2>
          <p className="text-secondary text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Enjoy an exclusive one-on-one session with our silk curators at any of our boutiques.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-full text-xs uppercase font-bold tracking-widest hover:bg-primary-dark transition-all shadow-lg"
          >
            Request Appointment
          </a>
        </motion.div>
      </div>
    </div>
  );
};


