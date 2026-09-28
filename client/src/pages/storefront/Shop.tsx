import { useState, useEffect, useRef } from 'react';
import { Filter, ChevronDown, Loader2, Search, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import api from '../../services/api';
import { ProductCard } from '../../components/product/ProductCard';
import { FilterSidebar } from '../../components/product/FilterSidebar';
import type { FilterState } from '../../components/product/FilterSidebar';

export const Shop = () => {
  const location = useLocation();
  const { category: categorySlug } = useParams();
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const recommendationsRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: [],
    fabric: [],
    silkType: [],
    weave: [],
    color: [],
    minPrice: '',
    maxPrice: '',
    inStock: false
  });

  // Fetch Categories for sidebar
  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });
  
  const categories = categoryData?.data || [];

  const { data: collectionData } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => (await api.get('/collections')).data,
  });
  const collections = collectionData?.data || [];

  // Fetch dynamic filters
  const { data: filterData } = useQuery({
    queryKey: ['product_filters'],
    queryFn: async () => {
      const response = await api.get('/products/config/filters');
      return response.data;
    },
  });

  const dynamicFilters = filterData?.data || {
    fabric: [],
    silkType: [],
    weave: [],
    color: []
  };

  // Parse URL to set initial filters
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const matchedCat = categories.find((c: any) => c.slug === categorySlug);
      if (matchedCat) {
        setFilters(prev => ({ ...prev, category: [matchedCat.name] }));
      }
    }
  }, [categorySlug, categories]);

  // Construct Query String
  const getQueryString = () => {
    const params = new URLSearchParams();
    
    const searchParams = new URLSearchParams(location.search);
    const requestedCategory = searchParams.get('category') || categorySlug;
    const selectedCategory = filters.category.length > 0
      ? categories.find((category: any) => category.name === filters.category[0])
      : categories.find((category: any) => category.slug === requestedCategory || category._id === requestedCategory);
    
    if (selectedCategory?._id) {
      params.set('category', selectedCategory._id);
    } else if (requestedCategory && /^[a-f\d]{24}$/i.test(requestedCategory)) {
      params.set('category', requestedCategory);
    }

    const requestedCollection = searchParams.get('collection');
    const selectedCollection = collections.find((collection: any) => collection.slug === requestedCollection || collection._id === requestedCollection);
    if (selectedCollection?._id) params.set('collection', selectedCollection._id);
    else if (requestedCollection && /^[a-f\d]{24}$/i.test(requestedCollection)) params.set('collection', requestedCollection);

    if (filters.fabric.length > 0) params.append('fabric', filters.fabric.join(','));
    if (filters.weave.length > 0) params.append('weave', filters.weave.join(','));
    if (filters.color.length > 0) params.append('color', filters.color.join(','));
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.inStock) params.append('inStock', 'true');
    if (sortOption) params.append('sort', sortOption);
    
    const activeSearch = searchQuery || searchParams.get('search') || searchParams.get('q');
    if (activeSearch) params.append('search', activeSearch);

    return params.toString();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters, sortOption, searchQuery, location.search, categoryData?.data, collectionData?.data],
    queryFn: async () => {
      const qs = getQueryString();
      const response = await api.get(`/products?${qs}`);
      return response.data;
    },
  });

  const products = data?.data?.products || [];
  const total = data?.data?.pagination?.total || products.length || 0;

  // Horizontal recommendation scroll handlers
  const scrollRecommendations = (direction: 'left' | 'right') => {
    if (recommendationsRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      recommendationsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-neutral-900">
      
      {/* Dynamic Hero Section (Matches Screenshot Header with giant watermark typography + search pill) */}
      <div className="relative bg-neutral-900 text-white overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        {/* Background Architectural Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay filter blur-[1px]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600')` }}
        />

        {/* Giant Watermark Typography "Shop" */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[18vw] font-extrabold tracking-tighter text-white/10 uppercase leading-none">
            Shop
          </span>
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Handloom Luxury Saree Collection
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
            {categorySlug ? categorySlug.replace(/-/g, ' ').toUpperCase() : 'Give All You Need'}
          </h1>
          <p className="text-neutral-300 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Explore authentic Maheshwari, Chanderi, and Pure Silk sarees woven by traditional master artisans.
          </p>
        </div>
      </div>

      {/* Floating Hero Search Pill Bar (Exact Screenshot Style) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-xl border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="pl-3 hidden sm:block">
            <h3 className="font-bold text-neutral-900 text-sm">Give All You Need</h3>
            <p className="text-neutral-500 text-xs">Search pure silk, tissue & zari sarees</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto grow max-w-md">
            <div className="relative grow">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search on Silk Store..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F6F8] rounded-full pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              />
            </div>
            <button 
              onClick={() => {}}
              className="bg-neutral-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        
        {/* Controls Bar (Product Count + Sorting Dropdown) */}
        <div className="flex justify-between items-center py-4 border-b border-neutral-200/80 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-neutral-900 font-bold text-sm sm:text-base">
              {isLoading ? 'Loading...' : `${total} Products`}
            </span>
            <span className="text-neutral-400 text-xs hidden sm:inline">• Handloom Certified</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden flex items-center gap-2 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded-full px-4 py-2 shadow-sm hover:bg-neutral-50 transition-colors"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
            
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white text-xs font-semibold text-neutral-900 border border-neutral-200/80 rounded-full px-4 py-2 pr-8 shadow-sm hover:bg-neutral-50 focus:outline-none cursor-pointer transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sidebar + Product Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Category & Filter Sidebar */}
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            isMobileOpen={isMobileFilterOpen} 
            setIsMobileOpen={setIsMobileFilterOpen} 
            categories={categories} 
            dynamicOptions={dynamicFilters}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-neutral-900" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-[40vh] text-center bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm">
                <p className="text-lg font-bold text-neutral-900 mb-2">Something went wrong fetching products.</p>
                <button onClick={() => window.location.reload()} className="text-xs font-semibold bg-neutral-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-colors">
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[45vh] text-center bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm">
                <p className="text-xl font-bold text-neutral-900 mb-2">No sarees found.</p>
                <p className="text-neutral-500 text-xs sm:text-sm mb-6 max-w-md">We couldn't find any items matching your selected categories or price filters.</p>
                <button 
                  onClick={() => setFilters({
                    category: [], fabric: [], silkType: [], weave: [], color: [], minPrice: '', maxPrice: '', inStock: false
                  })} 
                  className="text-xs font-semibold bg-neutral-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-colors shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Screenshot Exact Style Pagination Bar */}
                <div className="mt-14 flex items-center justify-between border-t border-neutral-200/80 pt-6">
                  <button className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs font-medium">
                    <button className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      1
                    </button>
                    <button className="w-8 h-8 rounded-full text-neutral-600 hover:bg-neutral-100 font-semibold text-xs flex items-center justify-center transition-colors">
                      2
                    </button>
                    <button className="w-8 h-8 rounded-full text-neutral-600 hover:bg-neutral-100 font-semibold text-xs flex items-center justify-center transition-colors">
                      3
                    </button>
                    <span className="text-neutral-400 px-1">...</span>
                    <button className="w-8 h-8 rounded-full text-neutral-600 hover:bg-neutral-100 font-semibold text-xs flex items-center justify-center transition-colors">
                      8
                    </button>
                    <button className="w-8 h-8 rounded-full text-neutral-600 hover:bg-neutral-100 font-semibold text-xs flex items-center justify-center transition-colors">
                      9
                    </button>
                    <button className="w-8 h-8 rounded-full text-neutral-600 hover:bg-neutral-100 font-semibold text-xs flex items-center justify-center transition-colors">
                      10
                    </button>
                  </div>

                  <button className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section: "Explore our recommendations" (Matches Screenshot Carousel Header & Layout) */}
        {products.length > 0 && (
          <div className="mt-24 pt-10 border-t border-neutral-200/80">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                  Explore our recommendations
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">Handpicked Maheshwari & Pure Silk favorites tailored for you</p>
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => scrollRecommendations('left')}
                  className="w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
                  aria-label="Previous recommendations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollRecommendations('right')}
                  className="w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
                  aria-label="Next recommendations"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recommendation Cards Carousel */}
            <div 
              ref={recommendationsRef}
              className="flex gap-6 overflow-x-auto scrollbar-none pb-4 scroll-smooth"
            >
              {products.slice(0, 6).map((product: any) => (
                <div key={`rec-${product._id}`} className="w-[280px] sm:w-[320px] shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Dark Newsletter Banner (Matches Screenshot Bottom Dark Card) */}
        <div className="mt-20 bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Decorative ambient background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl z-10">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Ready to Get Our New Stuff?
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Stuffus for Heritage & Pure Silk Needs. We listen to your desires, select the finest handloom weaves, and craft bespoke sarees right for you.
            </p>
          </div>

          <div className="w-full md:w-auto z-10">
            {subscribed ? (
              <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full px-6 py-3 text-xs font-semibold text-center">
                ✓ Thank you for subscribing! Check your email for exclusive saree drops.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="bg-white rounded-full p-1.5 flex items-center shadow-xl max-w-md w-full">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="bg-transparent text-neutral-900 text-xs px-4 py-2.5 grow focus:outline-none placeholder:text-neutral-400 font-medium"
                />
                <button 
                  type="submit"
                  className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-md shrink-0"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

