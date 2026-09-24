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

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const addWishlist = useWishlistStore((state) => state.addItem);
  const removeWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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
      className="group relative flex flex-col bg-transparent overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-supporting/10">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
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
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 lg:top-3 lg:left-3 flex flex-col gap-1.5 lg:gap-2 pointer-events-none">
          {outOfStock ? (
            <span className="bg-white/90 text-primary text-[8px] lg:text-[9px] font-bold tracking-widest uppercase px-1.5 py-1 lg:px-3 lg:py-1.5 shadow-sm backdrop-blur-sm">
              Sold Out
            </span>
          ) : (
            <>
              {product.isBestseller && (
                <span className="bg-white/90 text-primary text-[8px] lg:text-[9px] font-bold tracking-widest uppercase px-1.5 py-1 lg:px-3 lg:py-1.5 shadow-sm backdrop-blur-sm">
                  Bestseller
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-primary/90 text-white text-[8px] lg:text-[9px] font-bold tracking-widest uppercase px-1.5 py-1 lg:px-3 lg:py-1.5 shadow-sm backdrop-blur-sm">
                  New
                </span>
              )}
              {discount > 0 && (
                <span className="bg-burgundy/90 text-white text-[8px] lg:text-[9px] font-bold tracking-widest uppercase px-1.5 py-1 lg:px-3 lg:py-1.5 shadow-sm backdrop-blur-sm">
                  {discount}% Off
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors z-10"
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'fill-burgundy text-burgundy' : 'text-primary hover:text-burgundy'}`} />
        </button>

        {/* Quick Add overlay on hover */}
        <div className={`absolute inset-x-4 bottom-4 transition-all duration-300 transform hidden lg:flex gap-2 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button 
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`flex-1 bg-white/95 backdrop-blur-md text-primary font-bold text-[10px] tracking-widest uppercase py-3 shadow-md transition-colors flex items-center justify-center gap-2 ${
              outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
            }`}
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow mt-3 lg:mt-4">
        <Link to={`/product/${product._id}`} className="block flex-grow">
          <p className="text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-muted font-bold mb-1.5 lg:mb-2">
            {product.category?.name || 'MAHESHWARI SILK'}
          </p>
          <h3 className="font-serif text-primary text-sm lg:text-base mb-1.5 lg:mb-2 line-clamp-2 leading-relaxed group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-secondary text-xs lg:text-sm">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <span className="text-[10px] lg:text-xs text-muted line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

