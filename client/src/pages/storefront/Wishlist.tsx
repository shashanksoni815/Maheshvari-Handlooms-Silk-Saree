
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { Heart, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Wishlist = () => {
  const items = useWishlistStore(state => state.items);
  const removeItem = useWishlistStore(state => state.removeItem);
  const addItem = useCartStore(state => state.addItem);

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      product: item.product,
      name: item.name,
      price: item.price,
      mrp: item.price,
      image: item.image,
      quantity: 1,
      stock: 10,
    });
    removeItem(item.product);
  };

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-[80vh] flex flex-col justify-center items-center px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center mb-6 mx-auto border border-supporting/60">
            <Heart className="w-10 h-10 text-accent/40" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary mb-3">Your Wishlist is Empty</h1>
          <p className="text-secondary mb-8 max-w-sm text-sm leading-relaxed">Save the pieces that speak to you and revisit them anytime. Your personal curation awaits.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-xs uppercase font-bold tracking-widest hover:bg-primary-dark transition-all shadow-lg"
          >
            Explore Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">

      {/* ── Header ── */}
      <div className="relative bg-primary py-16 overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center text-[14vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none select-none pointer-events-none">
          Wishlist
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-bold mb-2">Your Curated Picks</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white">My Wishlist</h1>
          </div>
          <span className="text-white/50 text-sm font-medium">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div
                key={item.product}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ delay: idx * 0.06, duration: 0.4 }}
                className="group relative"
              >
                {/* Image */}
                <div className="relative w-full aspect-[2/3] overflow-hidden bg-cream rounded-2xl mb-4 border border-supporting/40">
                  <Link to={`/product/${item.product}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.product)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {/* Move to Cart overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-dark transition-colors shadow-lg"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div>
                  <p className="text-[10px] text-accent uppercase tracking-widest mb-1 font-bold">{item.category}</p>
                  <Link to={`/product/${item.product}`}>
                    <h3 className="text-sm font-serif text-primary hover:text-accent transition-colors line-clamp-2 mb-2 leading-snug">{item.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-secondary">₹{item.price.toLocaleString('en-IN')}</p>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="text-[10px] text-primary font-bold uppercase tracking-wider border-b border-primary/40 hover:text-accent hover:border-accent transition-colors"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Continue Shopping */}
        <div className="mt-16 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-full text-xs uppercase font-bold tracking-widest hover:bg-primary hover:text-white transition-all"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};


