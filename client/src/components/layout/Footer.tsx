import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-background pt-16 pb-8 border-t border-supporting">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-serif tracking-widest mb-6">MAHESHWARI</h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Curators of authentic Indian silk heritage. Handwoven masterpieces crafted by master artisans for the modern connoisseur.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6 text-accent">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/shop?category=banarasi-silk" className="hover:text-white transition">Banarasi Silk</Link></li>
              <li><Link to="/shop?category=kanjivaram-silk" className="hover:text-white transition">Kanjivaram</Link></li>
              <li><Link to="/shop?category=chanderi-silk" className="hover:text-white transition">Chanderi</Link></li>
              <li><Link to="/shop?collection=bridal" className="hover:text-white transition">Bridal Edit</Link></li>
              <li><Link to="/shop?collection=new-arrivals" className="hover:text-white transition">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6 text-accent">Support</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-white transition">Returns & Exchanges</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
              <li><Link to="/care-guide" className="hover:text-white transition">Silk Care Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6 text-accent">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent border-b border-gray-500 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-accent text-secondary text-sm font-medium py-3 uppercase tracking-widest hover:bg-white transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Maheshwari Silk. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
