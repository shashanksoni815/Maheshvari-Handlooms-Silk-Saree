import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1 } }),
};

const contactDetails = [
  {
    icon: Mail, title: 'Email Us', sub: 'For general inquiries & support',
    value: 'care@maheshwarisilk.com', href: 'mailto:care@maheshwarisilk.com',
  },
  {
    icon: Phone, title: 'Call Us', sub: 'Mon – Fri, 10am – 6pm IST',
    value: '+91 91793 38474', href: 'tel:+919179338474',
  },
  {
    icon: MapPin, title: 'Flagship Store & HQ', sub: 'Visit us in person',
    value: '264 SHUBHAM DIAMOND CITY, SHOP NO.1, SONWAY, INDORE, MP 453331', href: '#',
  },
  {
    icon: Clock, title: 'Working Hours', sub: 'Our team is available',
    value: 'Mon – Fri: 10am – 7pm IST', href: '#',
  },
];

export const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-background min-h-screen">

      {/* ── Hero ── */}
      <div className="relative bg-primary pt-16 pb-24 md:pt-20 md:pb-32 text-center overflow-hidden">
        {/* Watermark text */}
        <span className="absolute inset-0 flex items-center justify-center text-[18vw] font-serif font-black tracking-tighter text-white/[0.04] uppercase leading-none select-none pointer-events-none">
          Contact
        </span>
        <motion.div className="relative z-10 max-w-3xl mx-auto px-4" initial="hidden" animate="visible" variants={fadeUp}>
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] font-bold text-amber-300 mb-4 border border-amber-300/40 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xs">
            We're Here to Help
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-4">Get in Touch</h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Whether you have a question about our heritage silks, need styling advice, or require order assistance — we are here.
          </p>
        </motion.div>
      </div>

      {/* ── Info Cards (Floating smoothly over Hero) ── */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-12 sm:-mt-16 md:-mt-20 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {contactDetails.map((c, i) => (
            <motion.a
              key={i} 
              href={c.href} 
              custom={i}
              initial="hidden" 
              whileInView="visible" 
              variants={fadeUp} 
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border border-supporting/80 shadow-lg hover:shadow-2xl transition-all duration-300 group block hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <c.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">{c.sub}</p>
              <h3 className="text-lg font-serif text-primary mb-1">{c.title}</h3>
              <p className="text-secondary text-xs sm:text-sm leading-relaxed font-medium break-words">{c.value}</p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* ── Form & Sidebar ── */}
      <div className="max-w-6xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">

        {/* Form */}
        <motion.div
          className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-supporting/60 shadow-sm"
          initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-serif text-primary mb-3">Message Sent!</h2>
              <p className="text-secondary text-sm max-w-xs">We'll get back to you within 24 hours. Thank you for reaching out.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-xs uppercase tracking-widest text-accent font-bold border-b border-accent pb-0.5 hover:text-primary hover:border-primary transition-colors">
                Send Another
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-accent font-bold mb-2">Drop us a line</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-primary mb-8">Send us a Message</h2>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">First Name</label>
                    <input type="text" required className="w-full px-4 py-3 border border-supporting rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-background text-secondary text-sm transition-all" placeholder="Priya" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Last Name</label>
                    <input type="text" required className="w-full px-4 py-3 border border-supporting rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-background text-secondary text-sm transition-all" placeholder="Sharma" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 border border-supporting rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-background text-secondary text-sm transition-all" placeholder="priya@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Order Number <span className="normal-case font-normal text-muted">(Optional)</span></label>
                  <input type="text" className="w-full px-4 py-3 border border-supporting rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-background text-secondary text-sm transition-all" placeholder="#MHLS-001" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Your Message</label>
                  <textarea rows={5} required className="w-full px-4 py-3 border border-supporting rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-background text-secondary text-sm resize-none transition-all" placeholder="Tell us how we can help…"></textarea>
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg active:scale-95">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="lg:col-span-2 flex flex-col gap-6"
          initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} custom={1}
        >
          {/* Map image card */}
          <div className="rounded-3xl overflow-hidden border border-supporting/60 shadow-sm flex-1 min-h-[260px] relative">
            <img
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"
              alt="Indore, MP"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent flex items-end p-6">
              <div className="text-white">
                <p className="text-xs uppercase tracking-widest text-amber-300 mb-1 font-bold">Store & HQ Location</p>
                <p className="font-serif text-xl">Indore, MP, India</p>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-primary rounded-3xl p-6 sm:p-8 text-white">
            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-bold mb-1">Proprietor: SHUBHAM BICHHWE</p>
            <h3 className="font-serif text-xl mb-3">Direct Concierge</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">
              Our dedicated support team under Mr. Shubham Bichhwe responds to all inquiries within 24 business hours. For urgent order concerns, call us directly.
            </p>
            <a
              href="tel:+919179338474"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/20"
            >
              <Phone className="w-4 h-4" /> Call +91 91793 38474
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
