import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, Heart, Truck, ShieldCheck, ChevronDown, ChevronUp, Loader2, Zap, ShoppingBag, Star, Share2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { ReviewSection } from '../../components/product/ReviewSection';
import { RelatedProducts } from '../../components/product/RelatedProducts';
import { motion, AnimatePresence } from 'framer-motion';

const Accordion = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200/80 rounded-2xl bg-white mb-3 overflow-hidden shadow-xs transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex justify-between items-center text-left focus:outline-none hover:bg-neutral-50/80 transition-colors"
      >
        <span className="font-bold text-sm text-neutral-900 tracking-wide">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-neutral-600 text-xs sm:text-sm leading-relaxed border-t border-neutral-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const addItem = useCartStore(state => state.addItem);
  const toggleDrawer = useCartStore(state => state.toggleDrawer);
  const addWishlist = useWishlistStore(state => state.addItem);
  const removeWishlist = useWishlistStore(state => state.removeItem);
  const wishlistItems = useWishlistStore(state => state.items);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#FAFBFD]">
        <Loader2 className="w-10 h-10 animate-spin text-neutral-900" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#FAFBFD] p-6 text-center">
        <p className="text-2xl font-bold text-neutral-900 mb-2">Product Not Found</p>
        <p className="text-neutral-500 text-xs sm:text-sm mb-6">The saree piece you are looking for is unavailable or moved.</p>
        <button onClick={() => navigate('/shop')} className="text-xs font-semibold bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-black transition-colors shadow-md">
          Back to Shop
        </button>
      </div>
    );
  }

  const product = data.data;
  const isWishlisted = wishlistItems.some((item) => item.product === product._id);
  const outOfStock = product.stock <= 0;
  const discountAmount = product.mrp - product.price;

  const handleWishlist = () => {
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

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      quantity,
      stock: product.stock
    });
    toggleDrawer();
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      quantity,
      stock: product.stock
    });
    navigate('/checkout');
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10 lg:py-16 text-neutral-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Gallery Left, Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580px] scrollbar-thin scrollbar-thumb-neutral-300 md:w-24 shrink-0 pb-2 md:pb-0">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 md:w-full aspect-square md:aspect-3/4 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === idx ? 'border-neutral-900 shadow-md scale-102' : 'border-transparent opacity-60 hover:opacity-100 bg-white'
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Main Stage Image Frame */}
            <div className="flex-1 aspect-square md:aspect-3/4 bg-[#F6F6F8] rounded-[2rem] border border-neutral-200/80 relative overflow-hidden shadow-sm flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[activeImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.category?.name && (
                  <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-xs font-semibold px-3.5 py-1 rounded-full border border-neutral-200 shadow-sm">
                    {product.category.name}
                  </span>
                )}
                {discountAmount > 0 && (
                  <span className="bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    SAVE ₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Wishlist Floating Pill */}
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-all transform hover:scale-110 z-10"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-700 hover:text-rose-500'}`} />
              </button>

              {outOfStock && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full shadow-xl">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Product Details Box (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 border border-neutral-200/80 shadow-sm">
            
            {/* Header / Title */}
            <div className="border-b border-neutral-100 pb-6 mb-6">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200/60">
                  Pure Handloom Silk
                </span>
                <span className="text-xs text-neutral-400 font-mono">SKU: {product.sku || 'MS-HANDLOOM'}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">{product.name}</h1>
              
              {/* Rating + Price Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-neutral-900 font-bold text-sm">{product.rating?.average ? product.rating.average.toFixed(1) : '4.9'}</span>
                  <span className="text-neutral-400">({product.rating?.count || 128} Reviews)</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-neutral-900">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-neutral-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Pill Buttons */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between bg-[#F6F6F8] rounded-2xl p-3 border border-neutral-200/60">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 pl-2">Select Quantity</span>
                <div className="flex items-center bg-white rounded-xl border border-neutral-300 shadow-xs">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-neutral-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="p-2.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dual Action Pill Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold tracking-wide border border-neutral-300 bg-white text-neutral-900 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100 active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-neutral-700" />
                  <span>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>

                <button 
                  onClick={handleBuyNow}
                  disabled={outOfStock}
                  className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold tracking-wide bg-neutral-900 text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                    outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:shadow-lg active:scale-95'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAFBFD] rounded-2xl border border-neutral-200/60 mb-6">
              <div className="flex items-center gap-2.5 text-xs font-medium text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Silk Mark Certified</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-neutral-700">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Free Express Shipping</span>
              </div>
            </div>

            {/* Accordion Specs */}
            <div className="space-y-1">
              <Accordion title="Description & Craftsmanship" defaultOpen={true}>
                <p className="leading-relaxed">{product.description}</p>
              </Accordion>

              {(product.attributes?.fabric || product.attributes?.weave) && (
                <Accordion title="Fabric & Weave Details">
                  <div className="space-y-1.5">
                    {product.attributes?.fabric && <p><strong className="text-neutral-900">Fabric:</strong> {product.attributes.fabric}</p>}
                    {product.attributes?.weave && <p><strong className="text-neutral-900">Weave:</strong> {product.attributes.weave}</p>}
                    {product.attributes?.zariType && <p><strong className="text-neutral-900">Zari:</strong> {product.attributes.zariType}</p>}
                  </div>
                </Accordion>
              )}

              <Accordion title="Care & Maintenance">
                <p className="leading-relaxed">
                  {product.attributes?.careInstructions || 'Dry clean only. Store wrapped in cotton/muslin fabric to preserve rich zari lustre.'}
                </p>
              </Accordion>
            </div>

          </div>

        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-10 border-t border-neutral-200/80">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 text-center mb-10">Customer Reviews & Ratings</h2>
          <ReviewSection productId={product._id} reviews={[]} onReviewAdded={() => {}} />
        </div>

        {/* Related Products */}
        {product.category?._id && (
          <div className="mt-16">
            <RelatedProducts categoryId={product.category._id} currentProductId={product._id} />
          </div>
        )}

      </div>
    </div>
  );
};

