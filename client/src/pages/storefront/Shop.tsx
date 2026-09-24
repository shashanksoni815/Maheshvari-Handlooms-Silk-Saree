import { useState, useEffect } from 'react';
import { Filter, ChevronDown, Loader2 } from 'lucide-react';
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
    
    // Convert category names back to IDs if API expects IDs, or if API expects slug/names we pass them directly.
    // Based on productController, if it expects category Object ID, we should map name to ID here.
    if (filters.category.length > 0) {
      const catIds = filters.category
        .map(name => categories.find((c: any) => c.name === name)?._id)
        .filter(Boolean);
      if (catIds.length > 0) {
        // Since getProducts might only take one category in query, let's just use the first one, or modify API.
        // For simplicity, we just pass the first selected category ID
        params.append('category', catIds[0]);
      }
    }

    if (filters.fabric.length > 0) params.append('fabric', filters.fabric.join(','));
    if (filters.silkType.length > 0) params.append('silkType', filters.silkType.join(','));
    if (filters.weave.length > 0) params.append('weave', filters.weave.join(','));
    if (filters.color.length > 0) params.append('color', filters.color.join(','));
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.inStock) params.append('inStock', 'true');
    if (sortOption) params.append('sort', sortOption);
    
    // Grab search term from location state if user searched from header
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    if (q) params.append('search', q);

    return params.toString();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters, sortOption, location.search],
    queryFn: async () => {
      const qs = getQueryString();
      const response = await api.get(`/products?${qs}`);
      return response.data;
    },
  });

  const products = data?.data?.products || [];
  const total = data?.data?.pagination?.total || 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Editorial Header */}
      <div className="bg-supporting/10 border-b border-supporting/30 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-primary tracking-wide mb-4">
          {categorySlug ? categorySlug.replace(/-/g, ' ').toUpperCase() : 'SHOP ALL'}
        </h1>
        <p className="text-secondary/80 max-w-2xl mx-auto font-serif italic text-lg">
          "Discover timeless Indian craftsmanship woven into every thread."
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Controls Bar */}
        <div className="flex justify-between items-center py-4 border-b border-supporting mb-8 lg:mb-12">
          <p className="text-secondary text-sm font-medium tracking-wide">
            {isLoading ? 'Loading...' : `${total} Products`}
          </p>
          
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden flex items-center text-xs font-bold tracking-widest uppercase text-primary border border-supporting px-4 py-2 hover:bg-supporting/20 transition-colors"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            <div className="relative group">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-transparent text-xs font-bold tracking-widest uppercase text-primary border border-supporting px-4 py-2 pr-8 hover:bg-supporting/20 transition-colors focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-4 h-4 text-primary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-12">
          {/* Filters Sidebar */}
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
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <p className="text-xl font-serif text-primary mb-4">Something went wrong.</p>
                <button onClick={() => window.location.reload()} className="text-xs font-bold uppercase tracking-widest border border-primary px-6 py-3 hover:bg-primary hover:text-white transition-colors">
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <p className="text-2xl font-serif text-primary mb-4">No pieces found.</p>
                <p className="text-secondary mb-8">We couldn't find any sarees matching your filters.</p>
                <button 
                  onClick={() => setFilters({
                    category: [], fabric: [], silkType: [], weave: [], color: [], minPrice: '', maxPrice: '', inStock: false
                  })} 
                  className="text-xs font-bold uppercase tracking-widest border border-primary text-primary px-6 py-3 hover:bg-primary hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-10 lg:gap-x-6 lg:gap-y-12">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            
            {/* Pagination/Load More Placeholder */}
            {total > products.length && (
              <div className="mt-16 flex justify-center">
                <button className="text-xs font-bold uppercase tracking-widest border border-primary text-primary px-12 py-4 hover:bg-primary hover:text-white transition-colors">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
