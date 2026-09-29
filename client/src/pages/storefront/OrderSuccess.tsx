import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Sparkles, Truck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { icon: Package, title: 'Quality Check', desc: 'Your order is being inspected by our artisan team.' },
  { icon: Sparkles, title: 'Signature Packaging', desc: 'Carefully packed in our premium gift box within 1-2 days.' },
  { icon: Truck, title: 'Swift Delivery', desc: 'Shipped with tracking details sent to your email.' },
  { icon: Star, title: 'Delivered with Love', desc: 'Expected within 4-7 business days.' },
];

export const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="bg-background min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-bold mb-3">Payment Successful</p>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Order Confirmed!</h1>
          <p className="text-secondary leading-relaxed mb-3 max-w-md mx-auto text-sm">
            Thank you for your purchase. Your order has been successfully placed and is being prepared with care by our artisans.
          </p>
          {id && (
            <div className="inline-flex items-center gap-2 bg-cream border border-supporting rounded-full px-5 py-2 mb-8">
              <span className="text-xs text-muted">Order Reference:</span>
              <span className="text-xs font-bold text-primary">#{id.substring(id.length - 8).toUpperCase()}</span>
            </div>
          )}
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-supporting/60 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-bold text-primary mb-1">{step.title}</p>
              <p className="text-[10px] text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/account"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-primary-dark transition-all shadow-lg"
          >
            Track My Order <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 border border-supporting text-secondary px-8 py-4 rounded-full uppercase tracking-widest text-xs font-semibold hover:border-primary hover:text-primary transition-all"
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Brand note */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 text-xs text-muted max-w-xs mx-auto leading-relaxed"
        >
          A confirmation email with your order details and tracking information has been sent to your registered email address.
        </motion.p>
      </div>
    </div>
  );
};


