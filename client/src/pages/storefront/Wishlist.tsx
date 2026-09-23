import React from 'react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
        <h1 className="text-3xl font-serif text-primary mb-4">Your Wishlist is Empty</h1>
        <p className="text-secondary mb-8">Save the pieces that speak to you and revisit them anytime.</p>
        <Link
          to="/shop"
          className="inline-block bg-primary text-white px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-10">
        <h1 className="text-3xl md:text-4xl font-serif text-primary">My Wishlist</h1>
        <p className="text-secondary text-sm">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {items.map((item) => (
          <div key={item.product} className="group relative">
            <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100 mb-4">
              <Link to={`/product/${item.product}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </Link>
              <button
                onClick={() => removeItem(item.product)}
                className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Add to Cart overlay on hover */}
              <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-center py-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex items-center justify-center w-full text-sm font-medium tracking-widest uppercase gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Move to Cart
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.category}</p>
              <Link to={`/product/${item.product}`}>
                <h3 className="text-sm font-medium text-primary hover:text-accent transition-colors line-clamp-2 mb-2">{item.name}</h3>
              </Link>
              <p className="text-sm font-semibold text-secondary">₹{item.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
