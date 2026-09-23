import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Contact Us</h1>
        <p className="text-secondary max-w-2xl mx-auto">
          Whether you have a question about our heritage silks, need styling advice, or require assistance with your order, we are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div className="bg-white p-8 border border-supporting rounded-sm shadow-sm">
          <h2 className="text-2xl font-serif text-primary mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">First Name</label>
                <input type="text" className="w-full px-4 py-3 border border-supporting rounded focus:outline-none focus:border-accent bg-gray-50/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Last Name</label>
                <input type="text" className="w-full px-4 py-3 border border-supporting rounded focus:outline-none focus:border-accent bg-gray-50/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Email Address</label>
              <input type="email" className="w-full px-4 py-3 border border-supporting rounded focus:outline-none focus:border-accent bg-gray-50/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Order Number (Optional)</label>
              <input type="text" className="w-full px-4 py-3 border border-supporting rounded focus:outline-none focus:border-accent bg-gray-50/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Message</label>
              <textarea rows={5} className="w-full px-4 py-3 border border-supporting rounded focus:outline-none focus:border-accent bg-gray-50/50 resize-none"></textarea>
            </div>
            <button type="button" className="w-full bg-primary text-white py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-supporting/30 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-primary mb-2">Email Us</h3>
              <p className="text-secondary text-sm mb-1">For general inquiries & support:</p>
              <a href="mailto:care@maheshwarisilk.com" className="text-accent hover:underline font-medium">care@maheshwarisilk.com</a>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-supporting/30 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-primary mb-2">Call Us</h3>
              <p className="text-secondary text-sm mb-1">Mon - Fri, 10am - 6pm IST</p>
              <a href="tel:+919876543210" className="text-accent hover:underline font-medium">+91 98765 43210</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-supporting/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-primary mb-2">Flagship Boutique</h3>
              <p className="text-secondary text-sm leading-relaxed">
                12 Heritage Silk Avenue<br />
                Varanasi, UP 221001<br />
                India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
