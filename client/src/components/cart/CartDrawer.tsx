import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
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
        className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeDrawer}
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-supporting bg-white">
          <h2 className="text-xl font-serif text-primary flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            Shopping Bag
          </h2>
          <button 
            onClick={closeDrawer}
            className="text-secondary hover:text-primary transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted space-y-6">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-lg font-serif">Your bag is empty.</p>
              <button 
                onClick={closeDrawer}
                className="text-primary hover:text-accent uppercase tracking-widest text-xs font-bold border-b border-transparent hover:border-accent transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product} className="flex gap-4 bg-white p-4 border border-supporting shadow-sm">
                  <Link 
                    to={`/product/${item.product}`} 
                    onClick={closeDrawer}
                    className="w-20 h-28 flex-shrink-0 bg-supporting/20 overflow-hidden block"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <Link 
                        to={`/product/${item.product}`}
                        onClick={closeDrawer}
                        className="text-sm font-serif text-primary hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.product)}
                        className="text-muted hover:text-burgundy transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-secondary font-semibold text-sm mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                    
                    <div className="mt-auto flex items-center border border-supporting w-fit bg-background">
                      <button 
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="p-1.5 text-secondary hover:text-primary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm text-secondary font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="p-1.5 text-secondary hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-supporting p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between text-base font-bold text-primary uppercase tracking-widest mb-4">
              <p>Subtotal</p>
              <p>₹{subtotal.toLocaleString('en-IN')}</p>
            </div>
            <p className="text-xs text-muted mb-6 tracking-wide">Shipping and taxes calculated at checkout.</p>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center px-6 py-4 text-xs font-bold uppercase tracking-widest text-white bg-primary hover:bg-primary/90 shadow-md transition-all gap-2"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="w-full flex items-center justify-center px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary bg-transparent border border-supporting hover:border-primary transition-colors"
              >
                View Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
