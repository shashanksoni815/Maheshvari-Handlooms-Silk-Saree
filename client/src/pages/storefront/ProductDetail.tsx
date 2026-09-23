import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, Heart, Truck, ShieldCheck, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
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
    <div className="border-b border-supporting">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
      >
        <span className="font-serif text-lg text-primary tracking-wide">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-secondary" /> : <ChevronDown className="w-5 h-5 text-secondary" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-secondary text-sm leading-relaxed">
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
  
  const { addItem, toggleDrawer } = useCartStore();
  const { addItem: addWishlist, removeItem: removeWishlist, items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

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
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl font-serif text-primary mb-4">Product not found.</p>
        <button onClick={() => navigate('/shop')} className="text-sm uppercase tracking-widest text-accent hover:underline">
          Return to Shop
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Image Gallery (Takes up 7 columns on LG) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          {/* Main Image */}
          <div className="flex-1 aspect-[3/4] bg-supporting/20 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={product.images[activeImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
            </AnimatePresence>
            {outOfStock && (
              <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 shadow-sm">
                Sold Out
              </div>
            )}
          </div>
          
          {/* Thumbnails (Vertical on MD+, Horizontal on Mobile) */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide md:w-24 shrink-0">
            {product.images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 md:w-full aspect-[3/4] flex-shrink-0 border transition-all duration-300 ${
                  activeImage === idx ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info (Takes up 5 columns on LG) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-8">
            {product.category?.name && (
              <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold mb-3">
                {product.category.name}
              </p>
            )}
            <h1 className="text-3xl lg:text-4xl font-serif text-primary mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-muted tracking-wider">SKU: {product.sku}</p>
              <div className="flex items-center gap-2 text-xs text-secondary">
                <span className="flex text-accent">
                  {'★'.repeat(Math.round(product.rating?.average || 5))}
                  {'☆'.repeat(5 - Math.round(product.rating?.average || 5))}
                </span>
                <span>({product.rating?.count || 0} Reviews)</span>
              </div>
            </div>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-2xl font-serif text-primary">₹{product.price.toLocaleString('en-IN')}</span>
              {discountAmount > 0 && (
                <>
                  <span className="text-lg text-muted line-through mb-0.5">₹{product.mrp.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-bold text-burgundy uppercase tracking-widest bg-burgundy/10 px-2 py-1 mb-1">
                    Save ₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="py-8 border-y border-supporting mb-8 space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-secondary w-20">Quantity</span>
              <div className="flex items-center border border-supporting w-32 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-secondary hover:text-primary transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                  className="w-full text-center focus:outline-none text-secondary font-medium bg-transparent" 
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-secondary hover:text-primary transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`flex-1 py-4 uppercase tracking-widest text-xs font-bold transition-colors ${
                    outOfStock 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border border-primary text-primary hover:bg-supporting/20'
                  }`}
                >
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleWishlist}
                  className={`px-5 border transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'border-burgundy bg-burgundy/5 text-burgundy'
                      : 'border-supporting text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-burgundy text-burgundy' : ''}`} />
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                disabled={outOfStock}
                className={`w-full py-4 uppercase tracking-widest text-xs font-bold transition-all shadow-md ${
                  outOfStock 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
                }`}
              >
                Buy It Now
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-medium text-secondary">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-medium text-secondary">
              <Truck className="w-5 h-5 text-accent" />
              <span>Free Shipping</span>
            </div>
          </div>

          {/* Elegant Accordions */}
          <div className="border-t border-supporting">
            <Accordion title="Description" defaultOpen={true}>
              <p>{product.description}</p>
            </Accordion>
            
            {(product.attributes?.fabric || product.attributes?.weave || product.attributes?.zariType) && (
              <Accordion title="Fabric & Weave">
                <ul className="space-y-2">
                  {product.attributes.fabric && <li><span className="font-medium text-primary">Fabric:</span> {product.attributes.fabric}</li>}
                  {product.attributes.silkType && <li><span className="font-medium text-primary">Silk Type:</span> {product.attributes.silkType}</li>}
                  {product.attributes.weave && <li><span className="font-medium text-primary">Weave:</span> {product.attributes.weave}</li>}
                  {product.attributes.zariType && <li><span className="font-medium text-primary">Zari:</span> {product.attributes.zariType}</li>}
                  {product.attributes.pattern && <li><span className="font-medium text-primary">Pattern:</span> {product.attributes.pattern}</li>}
                </ul>
              </Accordion>
            )}

            {(product.attributes?.sareeLength || product.attributes?.blousePiece) && (
              <Accordion title="Dimensions & Blouse">
                <ul className="space-y-2">
                  {product.attributes.sareeLength && <li><span className="font-medium text-primary">Saree Length:</span> {product.attributes.sareeLength}</li>}
                  {product.attributes.sareeWidth && <li><span className="font-medium text-primary">Saree Width:</span> {product.attributes.sareeWidth}</li>}
                  {product.attributes.weight && <li><span className="font-medium text-primary">Weight:</span> {product.attributes.weight}</li>}
                  <li><span className="font-medium text-primary">Blouse Piece:</span> {product.attributes.blousePiece ? 'Included (Unstitched)' : 'Not Included'}</li>
                  {product.attributes.blouseLength && <li><span className="font-medium text-primary">Blouse Length:</span> {product.attributes.blouseLength}</li>}
                </ul>
              </Accordion>
            )}

            <Accordion title="Care & Origin">
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-primary block mb-1">Origin:</span>
                  {product.attributes?.origin || 'Handwoven in India'}
                </li>
                <li>
                  <span className="font-medium text-primary block mb-1">Care Instructions:</span>
                  {product.attributes?.careInstructions || 'Dry clean only. Keep folded in a muslin cloth. Avoid hanging on metal hangers.'}
                </li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 pt-12 border-t border-supporting">
        <h2 className="text-3xl font-serif text-primary text-center mb-12">Customer Reviews</h2>
        <ReviewSection
          productId={product._id}
          reviews={[]} // Will be fetched within ReviewSection ideally or passed down
          onReviewAdded={() => console.log('Review added')}
        />
      </div>
      
      {/* Related Products */}
      {product.category?._id && (
        <RelatedProducts categoryId={product.category._id} currentProductId={product._id} />
      )}
    </div>
  );
};
