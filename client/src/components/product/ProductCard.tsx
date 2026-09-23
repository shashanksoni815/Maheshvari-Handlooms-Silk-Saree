import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    mrp: number;
    images: { url: string; public_id: string }[];
    category?: { name: string };
    rating?: number;
    numReviews?: number;
    stock: number;
    isNewArrival?: boolean;
    isBestseller?: boolean;
  };
  onQuickView?: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, toggleDrawer } = useCartStore();
  const { addItem: addWishlist, removeItem: removeWishlist, items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const isWishlisted = wishlistItems.some((item) => item.product === product._id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const outOfStock = product.stock <= 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isWishlisted) {
      removeWishlist(product._id);
    } else {
      addWishlist({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price: product.price,
        stock: product.stock
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      quantity: 1,
      stock: product.stock
    });
    toggleDrawer();
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-supporting/30 border border-supporting/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Section */}
      <Link to={`/product/${product._id}`} className="relative aspect-[3/4] overflow-hidden bg-supporting/20">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className={`w-full h-full object-cover object-top transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {/* Secondary Image on Hover (if available) */}
        {product.images[1] && (
          <img
            src={product.images[1]?.url}
            alt={`${product.name} detail`}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {outOfStock ? (
            <span className="bg-gray-800 text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 shadow-sm">
              Sold Out
            </span>
          ) : (
            <>
              {product.isBestseller && (
                <span className="bg-accent text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 shadow-sm">
                  Bestseller
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 shadow-sm">
                  New
                </span>
              )}
              {discount > 0 && (
                <span className="bg-burgundy text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 shadow-sm">
                  {discount}% Off
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-burgundy text-burgundy' : 'text-secondary hover:text-burgundy'}`} />
        </button>

        {/* Quick View Button (Desktop only on hover) */}
        <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 transform hidden lg:block ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button 
            onClick={handleQuickView}
            className="w-full bg-white/90 backdrop-blur-md text-primary font-medium text-xs tracking-widest uppercase py-3 shadow-md hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`} className="block flex-grow">
          {product.category?.name && (
            <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1.5">{product.category.name}</p>
          )}
          <h3 className="font-serif text-primary text-lg md:text-xl mb-2 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3.5 h-3.5 ${star <= (product.rating || 0) ? 'fill-accent text-accent' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-xs text-muted ml-1">({product.numReviews || 0})</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="font-medium text-primary text-lg">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <span className="text-sm text-muted line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
          </div>
        </Link>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`w-full py-3 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
            outOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-primary text-white hover:bg-primary/90 hover:shadow-md'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
