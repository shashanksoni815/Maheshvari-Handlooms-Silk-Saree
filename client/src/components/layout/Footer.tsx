import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ShieldCheck, Award, Heart, CheckCircle2 } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-primary text-cream pt-20 pb-10 border-t border-amber-300/20 relative overflow-hidden">
      {/* Background Decorative Radial Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(181,138,58,0.1),_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-300/10 border border-amber-300/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-white">Silk Mark Certified</h5>
              <p className="text-xs text-secondary-light mt-0.5">100% Guaranteed pure silk weaves</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-300/10 border border-amber-300/30 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-white">Heirloom Quality</h5>
              <p className="text-xs text-secondary-light mt-0.5">Handcrafted by master artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-300/10 border border-amber-300/30 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-white">Pan India Shipping</h5>
              <p className="text-xs text-secondary-light mt-0.5">Complimentary insured delivery</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pt-16">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img src="/footer-logo.jpg" alt="Maheshwari Silk" className="h-20 w-auto object-contain rounded-xl border border-white/20 shadow-md" />
            </Link>
            <p className="text-sm text-secondary-light leading-relaxed mb-6">
              Curators of authentic Indian handloom silk heritage. Every thread weaves centuries of royal craftsmanship, rich zari motifs, and timeless elegance for generations to come.
            </p>

            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-amber-300 hover:text-primary transition-all duration-300">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-amber-300 hover:text-primary transition-all duration-300">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-amber-300 hover:text-primary transition-all duration-300">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-6 text-amber-300">Shop Collections</h4>
            <ul className="space-y-3.5 text-xs text-cream/90 font-medium">
              <li><Link to="/shop?category=banarasi-silk" className="hover:text-amber-300 transition-colors">Banarasi Silk</Link></li>
              <li><Link to="/shop?category=kanjivaram-silk" className="hover:text-amber-300 transition-colors">Kanjivaram Silk</Link></li>
              <li><Link to="/shop?category=chanderi-silk" className="hover:text-amber-300 transition-colors">Chanderi Weaves</Link></li>
              <li><Link to="/shop?collection=bridal" className="hover:text-amber-300 transition-colors">Bridal Heritage</Link></li>
              <li><Link to="/shop?collection=new-arrivals" className="hover:text-amber-300 transition-colors">New Arrivals</Link></li>
              <li><Link to="/stores" className="hover:text-amber-300 transition-colors">Our Boutiques</Link></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-6 text-amber-300">Client Care</h4>
            <ul className="space-y-3.5 text-xs text-cream/90 font-medium">
              <li><Link to="/about-us" className="hover:text-amber-300 transition-colors">Our Legacy & Artisans</Link></li>
              <li><Link to="/journal" className="hover:text-amber-300 transition-colors">The Maheshwari Journal</Link></li>
              <li><Link to="/contact" className="hover:text-amber-300 transition-colors">Contact Concierge</Link></li>
              <li><Link to="/faq" className="hover:text-amber-300 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-amber-300 transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/refund-policy" className="hover:text-amber-300 transition-colors">Returns & Exchanges</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-6 text-amber-300">The VIP Circle</h4>
            <p className="text-xs text-secondary-light leading-relaxed mb-4">
              Subscribe to receive private invitations to new weaver edits, rare saree drops, and silk care masterclasses.
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-amber-300/10 border border-amber-300/30 text-amber-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Thank you for joining the Maheshwari VIP Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3 text-xs text-white placeholder-cream/50 focus:outline-none focus:border-amber-300 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-300 text-primary text-xs font-bold py-3 px-6 rounded-full uppercase tracking-widest hover:bg-white hover:text-primary transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Legal Links Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-cream/70 font-medium">
            &copy; {new Date().getFullYear()} Maheshwari Silk Handlooms. All rights reserved. Crafting timeless sarees since 1984.
          </p>
          <div className="flex flex-wrap gap-6 text-[11px] text-cream/70 font-medium">
            <Link to="/privacy-policy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-amber-300 transition-colors">Terms of Service</Link>
            <Link to="/cancellation-policy" className="hover:text-amber-300 transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
