import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Minus, Plus, X, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getSubtotal,
    getDiscountTotal,
    getTaxTotal,
    getShippingTotal,
    getGrandTotal,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon
  } = useCartStore();
  
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountTotal();
  const tax = getTaxTotal();
  const shipping = getShippingTotal();
  const total = getGrandTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    // Mock Coupon Logic
    if (couponInput.toUpperCase() === 'WELCOME10') {
      applyCoupon('WELCOME10', 10); // 10% off
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center bg-background min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Your Cart is Empty</h1>
        <p className="text-secondary mb-10 tracking-wide text-lg">Discover our exquisite collection of handwoven silk sarees.</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center justify-center bg-primary text-white px-10 py-4 uppercase tracking-widest text-sm font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 bg-background min-h-screen">
      <h1 className="text-3xl md:text-4xl font-serif text-primary mb-12">Shopping Bag</h1>
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-supporting pb-4 mb-8 text-xs font-bold text-secondary uppercase tracking-widest">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
          
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.product} className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center py-4 border-b border-supporting/50">
                <div className="col-span-6 w-full flex items-center gap-6">
                  <Link to={`/product/${item.product}`} className="w-24 h-32 flex-shrink-0 bg-supporting/20 overflow-hidden block">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top hover:scale-105 transition-transform" />
                  </Link>
                  <div className="flex flex-col flex-1">
                    <Link to={`/product/${item.product}`}>
                      <h3 className="text-base font-serif text-primary hover:text-accent transition-colors mb-2 line-clamp-2">{item.name}</h3>
                    </Link>
                    <p className="text-sm font-medium text-secondary mb-3">₹{item.price.toLocaleString('en-IN')}</p>
                    <button 
                      onClick={() => removeItem(item.product)}
                      className="text-xs uppercase tracking-widest text-muted hover:text-burgundy text-left w-fit transition-colors flex items-center gap-1 font-semibold"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="col-span-3 w-full md:w-auto flex justify-start md:justify-center">
                  <div className="flex items-center border border-supporting bg-white">
                    <button 
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="px-3 py-2 text-secondary hover:text-primary transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-secondary">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="px-3 py-2 text-secondary hover:text-primary transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="col-span-3 w-full md:w-auto flex justify-between md:justify-end items-center">
                  <span className="md:hidden text-xs uppercase tracking-widest font-bold text-secondary">Total:</span>
                  <span className="font-serif text-lg text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white p-6 md:p-8 border border-supporting shadow-sm">
            <h2 className="text-xl font-serif text-primary mb-6 border-b border-supporting pb-4">Order Summary</h2>
            
            {/* Coupon Section */}
            <div className="mb-8">
              {!couponCode ? (
                <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2">
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 border border-supporting bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary uppercase placeholder-normal"
                    />
                    <button 
                      type="submit"
                      className="bg-secondary text-white px-4 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <span className="text-xs text-burgundy">{couponError}</span>}
                </form>
              ) : (
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary tracking-widest uppercase">
                    <Tag className="w-4 h-4" /> {couponCode}
                  </div>
                  <button onClick={removeCoupon} className="text-muted hover:text-burgundy">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 text-sm text-secondary mb-6 border-b border-supporting pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-burgundy font-medium">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Tax (GST)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-base font-bold uppercase tracking-widest text-primary">Grand Total</span>
              <span className="text-3xl font-serif text-primary">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center bg-primary text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 shadow-md hover:shadow-lg transition-all mb-4"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="w-full flex items-center justify-center bg-transparent border border-supporting text-secondary py-4 uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors"
            >
              Continue Shopping
            </button>

            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted mt-6 font-medium">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

