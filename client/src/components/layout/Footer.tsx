import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ArrowUp,
  ShieldCheck,
  Award,
  Sparkles,
  User
} from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-cream pt-16 pb-10 border-t border-amber-300/20 relative overflow-hidden">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Top Trust Badges Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 mb-12 border-b border-amber-300/15">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-300/15 text-amber-300 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">100% Pure Silk</h5>
              <p className="text-[11px] text-cream/70">Certified Handloom Authenticity</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-300/15 text-amber-300 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Master Weavers</h5>
              <p className="text-[11px] text-cream/70">Direct From Artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-300/15 text-amber-300 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Secure Checkout</h5>
              <p className="text-[11px] text-cream/70">Encrypted Transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-300/15 text-amber-300 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">VIP Support</h5>
              <p className="text-[11px] text-cream/70">Direct WhatsApp Assistance</p>
            </div>
          </div>
        </div>

        {/* ── Main Footer Columns ── */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Logo & Store Details (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="p-2 bg-white rounded-2xl shadow-xl border border-amber-300/40 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/logo.png" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.jpg';
                  }}
                  alt="Maheshwari Silk" 
                  className="h-16 w-auto object-contain rounded-lg" 
                />
              </div>
              <div>
                <span className="block text-lg font-serif font-bold text-white tracking-wide">Maheshwari Silk</span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-amber-300 font-semibold">Handloom Heritage</span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-cream/80 max-w-sm font-light">
              Crafting timeless Maheshwari silk sarees with royal gold zari borders, light luster, and generational handloom artistry since 1984.
            </p>

            {/* Store & Owner Credentials Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-amber-300/20 space-y-2.5 text-xs text-cream/90">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-[11px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Proprietor: SHUBHAM BICHHWE</span>
              </div>
              <div className="flex items-start gap-2 text-cream/80 text-[11px]">
                <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>264 SHUBHAM DIAMOND CITY, SHOP NO.1, SONWAY, INDORE, MP 453331</span>
              </div>
              <div className="flex items-center gap-2 text-cream/80 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <a href="tel:+919179338474" className="hover:text-amber-300 transition-colors">+91 91793 38474</a>
              </div>
              <div className="flex items-center gap-2 text-cream/80 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <a href="mailto:care@maheshwarisilk.com" className="hover:text-amber-300 transition-colors">care@maheshwarisilk.com</a>
              </div>
            </div>
          </div>

          {/* Column 2: Collections & Sarees (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-6 text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-300 inline-block" />
              Handloom Silk
            </h4>
            <ul className="space-y-3 text-xs text-cream/85 font-medium">
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors inline-block hover:translate-x-1 duration-200">Pure Maheshwari Sarees</Link></li>
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors inline-block hover:translate-x-1 duration-200">Royal Zari Collections</Link></li>
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors inline-block hover:translate-x-1 duration-200">Silk Cotton Blend</Link></li>
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors inline-block hover:translate-x-1 duration-200">Bridal & Festive Collection</Link></li>
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors inline-block hover:translate-x-1 duration-200">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Column 3: Client Care & Policies (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-6 text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-300 inline-block" />
              Client Care
            </h4>
            <ul className="space-y-3 text-xs text-cream/85 font-medium">
              <li><Link to="/about-us" className="hover:text-amber-300 transition-colors">Our Legacy</Link></li>
              <li><Link to="/contact" className="hover:text-amber-300 transition-colors">Contact Us</Link></li>
              <li><Link to="/stores" className="hover:text-amber-300 transition-colors">Boutique Locations</Link></li>
              <li><Link to="/faq" className="hover:text-amber-300 transition-colors">FAQ & Support</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-amber-300 transition-colors">Shipping Info</Link></li>
              <li><Link to="/refund-policy" className="hover:text-amber-300 transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Media & Direct Concierge (Span 3) */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-3 text-amber-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-300 inline-block" />
                Follow Our Legacy
              </h4>
              <p className="text-xs text-cream/70 leading-relaxed mb-4">
                Connect with our artisan stories, new collection previews & weaving updates.
              </p>

              {/* Social Media Icons Grid */}
              <div className="flex flex-wrap gap-2.5">
                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-cream hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 hover:text-white hover:border-transparent hover:scale-110 transition-all shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-cream hover:bg-blue-600 hover:text-white hover:border-transparent hover:scale-110 transition-all shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me/919179338474" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="WhatsApp Concierge"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-cream hover:bg-emerald-500 hover:text-white hover:border-transparent hover:scale-110 transition-all shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="YouTube"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-cream hover:bg-rose-600 hover:text-white hover:border-transparent hover:scale-110 transition-all shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Twitter / X"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-cream hover:bg-black hover:text-white hover:border-transparent hover:scale-110 transition-all shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick WhatsApp Concierge Button */}
            <a
              href="https://wa.me/919179338474"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-900/40 active:scale-95 border border-emerald-400/30"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>

        </div>

        {/* ── Bottom Copyright & Legal Links Bar ── */}
        <div className="mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-cream/70 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} Maheshwari Silk Handlooms (Proprietor: <span className="text-amber-300 font-semibold">SHUBHAM BICHHWE</span>). All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-cream/70 font-medium">
            <Link to="/privacy-policy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-amber-300 transition-colors">Terms of Service</Link>
            <Link to="/cancellation-policy" className="hover:text-amber-300 transition-colors">Cancellation Policy</Link>
            
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-full border border-amber-300/30 transition-all text-[10px] font-bold uppercase tracking-wider hover:bg-amber-300/20"
            >
              Top <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

