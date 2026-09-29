import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X, Sparkles, TrendingUp, Tag, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  category: string[];
  fabric: string[];
  silkType: string[];
  weave: string[];
  color: string[];
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  preset?: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  categories: { _id?: string; name: string; slug: string; count?: number }[];
  dynamicOptions?: {
    fabric: string[];
    silkType: string[];
    weave: string[];
    color: string[];
  };
}

const FilterSection = ({ title, options, selected, onChange }: { title: string, options: string[], selected: string[], onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="border-b border-neutral-200/80 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-1.5 text-neutral-900 text-xs font-bold tracking-wider uppercase focus:outline-none group"
      >
        <span className="group-hover:text-primary transition-colors">{title}</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-2 space-y-2.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-300">
              {options.map((opt) => {
                const isSelected = selected.includes(opt);
                return (
                  <label key={opt} className="flex items-center justify-between cursor-pointer group py-1 px-1.5 rounded-lg hover:bg-neutral-100/70 transition-colors">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onChange(opt)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-md border transition-all flex items-center justify-center ${
                        isSelected 
                          ? 'bg-neutral-900 border-neutral-900 text-white' 
                          : 'border-neutral-300 group-hover:border-neutral-500 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-xs transition-colors ${isSelected ? 'text-neutral-900 font-semibold' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                        {opt}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, isMobileOpen, setIsMobileOpen, categories, dynamicOptions }) => {
  
  const handleArrayFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      fabric: [],
      silkType: [],
      weave: [],
      color: [],
      minPrice: '',
      maxPrice: '',
      inStock: false,
      preset: undefined
    });
  };

  const handlePresetSelect = (presetName: string) => {
    setFilters(prev => ({
      ...prev,
      preset: prev.preset === presetName ? undefined : presetName
    }));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white lg:bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 mb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-900" />
          <h2 className="text-sm uppercase tracking-wider font-bold text-neutral-900">Category & Filters</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearFilters} className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 underline-offset-4 hover:underline">
            Reset
          </button>
          <button className="lg:hidden p-1 text-neutral-600" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 pb-16 lg:pb-6">
        
        {/* Category List Pills (Exact Screenshot Style) */}
        <div className="border-b border-neutral-200/80 py-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Categories</h3>
          <div className="space-y-1.5">
            <button
              onClick={() => setFilters(prev => ({ ...prev, category: [] }))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filters.category.length === 0 
                  ? 'bg-neutral-900 text-white font-semibold shadow-sm' 
                  : 'bg-neutral-100/80 text-neutral-700 hover:bg-neutral-200/70'
              }`}
            >
              <span>All Products</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                filters.category.length === 0 ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
              }`}>
                32
              </span>
            </button>

            {categories.map(cat => {
              const isSelected = filters.category.includes(cat.name);
              return (
                <button
                  key={cat.slug || cat.name}
                  onClick={() => handleArrayFilter('category', cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected 
                      ? 'bg-neutral-900 text-white font-semibold shadow-sm' 
                      : 'bg-neutral-100/60 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Presets / Accordion Quick Filters (Matches SS: New Arrival, Best Seller, On Discount) */}
        <div className="border-b border-neutral-200/80 py-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Quick Collections</h3>
          
          <button
            onClick={() => handlePresetSelect('new_arrival')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              filters.preset === 'new_arrival'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'bg-[#F6F6F8] text-neutral-700 hover:bg-neutral-200/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>New Arrivals</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => handlePresetSelect('bestseller')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              filters.preset === 'bestseller'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'bg-[#F6F6F8] text-neutral-700 hover:bg-neutral-200/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Best Sellers</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => handlePresetSelect('discount')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              filters.preset === 'discount'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'bg-[#F6F6F8] text-neutral-700 hover:bg-neutral-200/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              <span>On Discount</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Availability Switch */}
        <div className="border-b border-neutral-200/80 py-4">
          <label className="flex items-center justify-between cursor-pointer group py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">In Stock Only</span>
            <div className="relative inline-block w-9 h-5 align-middle select-none">
              <input 
                type="checkbox" 
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 border-neutral-300 appearance-none cursor-pointer transition-transform checked:right-0.5 checked:translate-x-4 checked:border-neutral-900 checked:bg-neutral-900 left-0.5 top-0.5"
              />
              <span className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${
                filters.inStock ? 'bg-neutral-900' : 'bg-neutral-200'
              }`} />
            </div>
          </label>
        </div>

        {/* Price Range */}
        <div className="border-b border-neutral-200/80 py-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Price Range (₹)</h3>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              className="w-full bg-[#F6F6F8] border border-neutral-200/80 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
            />
            <span className="text-neutral-400 font-bold">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="w-full bg-[#F6F6F8] border border-neutral-200/80 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Dynamic Filters */}
        {dynamicOptions?.fabric && dynamicOptions.fabric.length > 0 && (
          <FilterSection title="Fabric" options={dynamicOptions.fabric} selected={filters.fabric} onChange={(val) => handleArrayFilter('fabric', val)} />
        )}
        {dynamicOptions?.weave && dynamicOptions.weave.length > 0 && (
          <FilterSection title="Weave Type" options={dynamicOptions.weave} selected={filters.weave} onChange={(val) => handleArrayFilter('weave', val)} />
        )}
        {dynamicOptions?.color && dynamicOptions.color.length > 0 && (
          <FilterSection title="Color" options={dynamicOptions.color} selected={filters.color} onChange={(val) => handleArrayFilter('color', val)} />
        )}
      </div>

      <div className="lg:hidden border-t border-neutral-200 p-4 bg-white sticky bottom-0 z-10">
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 pr-4">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 h-[88vh] bg-white z-50 rounded-t-3xl p-6 lg:hidden overflow-hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

