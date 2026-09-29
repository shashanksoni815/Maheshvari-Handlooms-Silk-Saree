import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-primary text-cream pt-20 pb-10 border-t border-amber-300/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          
          {/* Brand & Mission Column */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <img src="/footer-logo.jpg" alt="Maheshwari Silk" className="h-20 w-auto object-contain rounded-xl border border-white/20 shadow-md" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-secondary-light">
              Handwoven Maheshwari silk sarees, crafted with care by generations of artisans.
            </p>
          </div>

          {/* Shop Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-6 text-amber-300">Handloom Silk</h4>
            <ul className="space-y-3.5 text-xs text-cream/90 font-medium">
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors">Shop Maheshwari Sarees</Link></li>
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors">Collections</Link></li>
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors">Royal Sarees</Link></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-4">
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
