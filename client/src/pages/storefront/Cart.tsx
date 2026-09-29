import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Minus, Plus, X, ShieldCheck, Tag, ArrowRight, ShoppingBag, Truck, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Cart = () => {
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const couponCode = useCartStore(state => state.couponCode);
  const couponDiscount = useCartStore(state => state.couponDiscount);
  const removeCoupon = useCartStore(state => state.removeCoupon);
  
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = (subtotal * couponDiscount) / 100;
  const tax = (subtotal - discount) * 0.05;
  const shipping = (subtotal - discount) > 10000 || (subtotal - discount) === 0 ? 0 : 250;
  const total = subtotal - discount + tax + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('Coupons are temporarily unavailable. No discount has been applied.');
  };

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-[75vh] flex flex-col justify-center items-center px-4 py-24 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">Empty Selection</span>
        <h1 className="text-3xl md:text-4xl font-serif text-primary mb-3 font-bold">Your Shopping Bag is Empty</h1>
        <p className="text-secondary mb-8 max-w-md text-sm leading-relaxed">
          Discover our handwoven Maheshwari and Pure Silk saree collections crafted by master artisans.
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors shadow-lg"
        >
          Explore Silk Sarees <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12 lg:py-16 text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-left border-b border-supporting/60 pb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-1">Cart Summary</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">Shopping Bag ({items.length})</h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">Review your handwoven silk selections and proceed to secure checkout</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4 w-full">
            {items.map((item) => (
              <motion.div 
                key={item.product}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white p-5 sm:p-6 rounded-3xl border border-supporting/60 shadow-sm hover:shadow-md transition-all"
              >
                
                {/* Product Image & Info */}
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <Link to={`/product/${item.product}`} className="w-20 sm:w-24 aspect-[3/4] rounded-2xl overflow-hidden bg-primary/5 shrink-0 block border border-supporting/50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top hover:scale-105 transition-transform" />
                  </Link>
                  <div>
                    <Link to={`/product/${item.product}`}>
                      <h3 className="text-base font-serif font-bold text-primary hover:text-accent transition-colors line-clamp-2 leading-snug">{item.name}</h3>
                    </Link>
                    <p className="text-xs text-secondary mt-1">Unit Price: <strong className="text-primary font-bold">₹{item.price.toLocaleString('en-IN')}</strong></p>
                    <button 
                      onClick={() => removeItem(item.product)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 mt-3"
                    >
                      <X className="w-3.5 h-3.5" /> Remove Item
                    </button>
                  </div>
                </div>

                {/* Quantity Controls & Item Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-supporting/40">
                  <div className="flex items-center bg-background rounded-full border border-supporting px-1 py-0.5">
                    <button 
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="p-2 text-primary hover:text-accent transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-primary">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="p-2 text-primary hover:text-accent transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">Total</span>
                    <span className="text-base font-serif font-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link to="/shop" className="text-xs font-bold uppercase tracking-wider text-primary hover:text-accent transition-colors flex items-center gap-1">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-supporting/60 shadow-lg sticky top-28 space-y-6">
              <h2 className="text-xl font-serif font-bold text-primary border-b border-supporting/50 pb-4">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs font-medium text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-serif font-bold text-primary text-sm">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({couponDiscount}%)</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (5% GST)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-700 font-bold uppercase">FREE</strong> : `₹${shipping}`}</span>
                </div>

                <div className="pt-4 border-t border-supporting/50 flex justify-between items-center text-primary font-bold">
                  <span className="text-sm">Total Payable</span>
                  <span className="text-2xl font-serif text-primary">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block">Have a Coupon Code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="ENTER CODE"
                    className="flex-1 bg-background border border-supporting rounded-full px-4 py-2.5 text-xs text-primary uppercase font-bold focus:outline-none focus:border-accent"
                  />
                  <button type="submit" className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wider hover:bg-accent hover:text-primary transition-colors">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </form>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Lock className="w-4 h-4" /> Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-secondary font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-bit Encrypted SSL Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
