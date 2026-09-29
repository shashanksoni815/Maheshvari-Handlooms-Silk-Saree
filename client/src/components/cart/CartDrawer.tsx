import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Zap } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const isDrawerOpen = useCartStore(state => state.isDrawerOpen);
  const closeDrawer = useCartStore(state => state.closeDrawer);
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const subtotal = useCartStore(state => state.items.reduce((total, item) => total + item.price * item.quantity, 0));
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] transition-opacity duration-300"
        onClick={closeDrawer}
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FAFBFD] shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 ease-out rounded-l-3xl overflow-hidden border-l border-neutral-200/80">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-200/80 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 leading-none">Your Bag</h2>
              <span className="text-xs text-neutral-500">{items.reduce((total, i) => total + i.quantity, 0)} Items Selected</span>
            </div>
          </div>

          <button 
            onClick={closeDrawer}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-neutral-300">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-neutral-300" />
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-900 mb-1">Your bag is empty</p>
                <p className="text-xs text-neutral-500 max-w-xs">Explore our handloom silk saree collection to find your perfect drape.</p>
              </div>
              <button 
                onClick={closeDrawer}
                className="bg-neutral-900 text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-black transition-all shadow-md mt-2"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product} className="flex gap-4 bg-white p-3.5 rounded-2xl border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all">
                <Link 
                  to={`/product/${item.product}`} 
                  onClick={closeDrawer}
                  className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 block border border-neutral-100"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link 
                        to={`/product/${item.product}`}
                        onClick={closeDrawer}
                        className="text-xs font-bold text-neutral-900 hover:text-amber-600 transition-colors line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.product)}
                        className="text-neutral-400 hover:text-rose-500 transition-colors shrink-0 p-0.5"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-neutral-900 font-bold text-sm mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-[#F6F6F8] rounded-xl border border-neutral-200/80">
                      <button 
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-neutral-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-neutral-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Bar */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200/80 p-5 sm:p-6 bg-white shadow-lg space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Subtotal Amount</span>
              <span className="text-2xl font-bold text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <p className="text-[11px] text-emerald-700 font-medium text-center">Complimentary shipping & zero tax on all orders</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="w-full py-3 rounded-full text-xs font-semibold text-center border border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-100 transition-colors"
              >
                View Full Bag
              </Link>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-full text-xs font-semibold text-white bg-neutral-900 hover:bg-black shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

