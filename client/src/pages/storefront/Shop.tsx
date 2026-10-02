import { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Loader2, Search, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import api from '../../services/api';
import { ProductCard } from '../../components/product/ProductCard';
import { FilterSidebar } from '../../components/product/FilterSidebar';
import type { FilterState } from '../../components/product/FilterSidebar';
import { ProductSkeletonGrid } from '../../components/common/ProductSkeletonGrid';

export const Shop = () => {
  const location = useLocation();
  const { category: categorySlug } = useParams();
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  const updateFilters: typeof setFilters = (nextFilters) => {
    setCurrentPage(1);
    setFilters(nextFilters);
  };

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
    setCurrentPage(1);
    if (categorySlug && categories.length > 0) {
      const matchedCat = categories.find((c: any) => c.slug === categorySlug);
      if (matchedCat) {
        setFilters(prev => ({ ...prev, category: [matchedCat.name] }));
      }
    }
  }, [categorySlug, categories, location.search]);

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
    params.set('page', String(currentPage));
    params.set('limit', '12');
    
    const activeSearch = searchQuery || searchParams.get('search') || searchParams.get('q');
    if (activeSearch) params.append('search', activeSearch);

    return params.toString();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters, sortOption, searchQuery, currentPage, location.search, categoryData?.data, collectionData?.data],
    queryFn: async () => {
      const qs = getQueryString();
      const response = await api.get(`/products?${qs}`);
      return response.data;
    },
  });

  const products = data?.data?.products || [];
  const total = data?.data?.pagination?.total ?? products.length;
  const totalPages = data?.data?.pagination?.pages ?? Math.ceil(total / 12);

  const changePage = (page: number) => {
    setCurrentPage(page);
    document.getElementById('product-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-neutral-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative bg-neutral-900 text-white overflow-hidden py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        {/* Background Architectural Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay filter blur-[1px]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600')` }}
        />

        {/* Watermark Typography "Shop" */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[14vw] sm:text-[18vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none font-serif">
            Shop
          </span>
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border border-white/20 mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Handloom Luxury Saree Collection
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-3 sm:mb-4 drop-shadow-md">
            {categorySlug ? categorySlug.replace(/-/g, ' ').toUpperCase() : 'Give All You Need'}
          </h1>
          <p className="text-neutral-300 max-w-2xl mx-auto text-xs sm:text-sm md:text-base font-medium leading-relaxed px-2">
            Explore authentic Maheshwari, Chanderi, and Pure Silk sarees woven by traditional master artisans.
          </p>
        </div>
      </div>

      {/* Floating Hero Search Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 sm:p-4 shadow-xl border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="pl-2 hidden md:block">
            <h3 className="font-bold text-neutral-900 text-sm">Give All You Need</h3>
            <p className="text-neutral-500 text-xs">Search pure silk, tissue & zari sarees</p>
          </div>

          <div className="w-full md:w-auto grow max-w-md">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5 bg-[#F6F6F8] rounded-full p-1 pl-3.5 border border-neutral-200/80 w-full">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search on Silk Store..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent border-none py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-neutral-900 hover:bg-black text-white px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pt-8 pb-24">
        
        {/* Controls Bar (Product Count + Sorting Dropdown + Filter Trigger) */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 sm:py-4 border-b border-neutral-200/80 mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <span className="text-neutral-900 font-bold text-xs sm:text-base">
              {isLoading ? 'Loading...' : `${total} Products`}
            </span>
            <span className="text-neutral-400 text-xs hidden sm:inline">• Handloom Certified</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              className="lg:hidden flex items-center gap-1.5 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 rounded-full px-3.5 py-1.5 shadow-sm hover:bg-neutral-50 transition-colors"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white text-xs font-semibold text-neutral-900 border border-neutral-200/80 rounded-full px-3.5 py-1.5 pr-8 shadow-sm hover:bg-neutral-50 focus:outline-none cursor-pointer transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sidebar + Product Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Left Category & Filter Sidebar */}
          <FilterSidebar 
            filters={filters} 
            setFilters={updateFilters}
            isMobileOpen={isMobileFilterOpen} 
            setIsMobileOpen={setIsMobileFilterOpen} 
            categories={categories} 
            dynamicOptions={dynamicFilters}
          />

          {/* Product Grid */}
          <div id="product-results" className="flex-1 min-w-0 scroll-mt-24">
            {isLoading ? (
              <ProductSkeletonGrid count={6} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {!isLoading && !error && totalPages > 1 && (
              <nav aria-label="Product pages" className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="inline-flex min-h-11 items-center gap-2 border border-neutral-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-neutral-900 transition-colors hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span aria-live="polite" className="text-xs font-semibold text-neutral-600">Page {currentPage} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="inline-flex min-h-11 items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next page <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
