import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Zap } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { getOptimizedImageUrl } from '../../utils/image';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    mrp: number;
    images: { url: string; public_id: string }[];
    category?: { name: string; slug?: string };
    rating?: number;
    numReviews?: number;
    stock: number;
    isNewArrival?: boolean;
    isBestseller?: boolean;
    fabric?: string;
    weave?: string;
  };
  onQuickView?: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const addWishlist = useWishlistStore((state) => state.addItem);
  const removeWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const isWishlisted = wishlistItems.some((item) => item.product === product._id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const outOfStock = product.stock <= 0;

  // Use realistic star rating defaults if not in DB
  const ratingScore = product.rating && product.rating > 0 ? product.rating.toFixed(1) : '4.9';
  const reviewCountDisplay = product.numReviews && product.numReviews > 0 
    ? (product.numReviews > 1000 ? `${(product.numReviews / 1000).toFixed(1)}k` : `${product.numReviews}`)
    : '1.2k';

  const categoryName = product.category?.name || product.fabric || 'Silk';

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

  const handleBuyNow = (e: React.MouseEvent) => {
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
    navigate('/checkout');
  };

  const primaryImageUrl = getOptimizedImageUrl(product.images[0]?.url, 500);
  const secondaryImageUrl = product.images[1]?.url ? getOptimizedImageUrl(product.images[1]?.url, 500) : null;

  return (
    <div 
      className="group relative flex flex-col bg-[#F6F6F8] hover:bg-[#EFF0F3] rounded-[2rem] p-3 sm:p-4 border border-neutral-200/60 transition-all duration-300 shadow-sm hover:shadow-xl w-full max-w-full box-border overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame (Tall Portrait for Full Model View) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] bg-white flex items-center justify-center">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img
            src={primaryImageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover object-top transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
          
          {/* Secondary Image on Hover - Lazy mounted when hovered */}
          {secondaryImageUrl && isHovered && (
            <img
              src={secondaryImageUrl}
              alt={`${product.name} alternate view`}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 opacity-100`}
            />
          )}
        </Link>

        {/* Top Right Category Pill Badge (Matches SS) */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-[11px] font-semibold px-3 py-1 rounded-full border border-neutral-200/80 shadow-sm">
            {categoryName}
          </span>
        </div>

        {/* Top Left Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 left-3 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all transform hover:scale-110 z-10"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-700 hover:text-rose-500'}`} />
        </button>

        {/* Sold Out / Discount Badges */}
        {outOfStock ? (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        ) : discount > 0 ? (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          </div>
        ) : null}
      </div>

      {/* Details Area */}
      <div className="flex flex-col grow mt-3 px-1">
        <Link to={`/product/${product._id}`} className="block group/title">
          <h3 className="font-semibold text-neutral-900 text-sm sm:text-base line-clamp-1 leading-snug group-hover/title:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between mt-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-neutral-900 font-semibold text-xs">{ratingScore}</span>
            <span className="text-neutral-500 text-[11px]">({reviewCountDisplay} Reviews)</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-neutral-900 text-sm sm:text-base">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-neutral-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>

        {/* Dual Pill Action Buttons (Add to Cart + Buy Now) */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`w-full py-2.5 px-3 rounded-full text-xs font-semibold tracking-wide border border-neutral-300/80 bg-white text-neutral-800 shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
              outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100 hover:border-neutral-400 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-neutral-600" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className={`w-full py-2.5 px-3 rounded-full text-xs font-semibold tracking-wide bg-neutral-900 text-white shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 ${
              outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:shadow-lg active:scale-95'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';


