import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
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
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  categories: { name: string; slug: string }[];
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
    <div className="border-b border-supporting/50 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-1 text-primary text-xs uppercase tracking-widest font-bold focus:outline-none"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-3 h-3 text-secondary" /> : <ChevronDown className="w-3 h-3 text-secondary" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-supporting scrollbar-track-transparent">
              {options.map((opt) => (
                <label key={opt} className="flex items-center cursor-pointer group">
                  <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${
                    selected.includes(opt) 
                      ? 'bg-primary border-primary' 
                      : 'border-secondary/40 group-hover:border-primary'
                  }`}>
                    {selected.includes(opt) && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selected.includes(opt)}
                    onChange={() => onChange(opt)}
                  />
                  <span className={`ml-3 text-xs transition-colors ${selected.includes(opt) ? 'text-primary font-medium' : 'text-secondary group-hover:text-primary'}`}>
                    {opt}
                  </span>
                </label>
              ))}
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
      inStock: false
    });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between py-5 md:py-0 border-b md:border-none border-supporting px-5 md:px-0 mb-4">
        <h2 className="text-sm uppercase tracking-widest font-bold text-primary">Filters</h2>
        <div className="flex items-center gap-4">
          <button onClick={clearFilters} className="text-[10px] uppercase tracking-widest text-secondary hover:text-primary underline-offset-4 hover:underline">
            Clear All
          </button>
          <button className="md:hidden p-1 text-secondary" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-0 mt-2 md:mt-0 pb-20 md:pb-0">
        
        {/* Availability */}
        <div className="border-y border-supporting/50 py-5">
          <label className="flex items-center cursor-pointer group">
            <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${
              filters.inStock 
                ? 'bg-primary border-primary' 
                : 'border-secondary/40 group-hover:border-primary'
            }`}>
              {filters.inStock && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={filters.inStock}
              onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
            />
            <span className={`ml-3 text-xs uppercase tracking-widest transition-colors ${filters.inStock ? 'text-primary font-bold' : 'text-secondary font-medium group-hover:text-primary'}`}>
              In Stock Only
            </span>
          </label>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <FilterSection 
            title="Category" 
            options={categories.map(c => c.name)} 
            selected={filters.category} 
            onChange={(val) => handleArrayFilter('category', val)} 
          />
        )}

        {/* Price Range */}
        <div className="border-b border-supporting py-6">
          <h3 className="w-full text-left text-primary font-serif tracking-wide mb-4">Price Range</h3>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              placeholder="Min" 
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              className="w-full border border-supporting p-2 text-sm focus:outline-none focus:border-primary"
            />
            <span className="text-secondary">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="w-full border border-supporting p-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {dynamicOptions?.fabric && dynamicOptions.fabric.length > 0 && (
          <FilterSection title="Fabric" options={dynamicOptions.fabric} selected={filters.fabric} onChange={(val) => handleArrayFilter('fabric', val)} />
        )}
        {dynamicOptions?.silkType && dynamicOptions.silkType.length > 0 && (
          <FilterSection title="Silk Type" options={dynamicOptions.silkType} selected={filters.silkType} onChange={(val) => handleArrayFilter('silkType', val)} />
        )}
        {dynamicOptions?.weave && dynamicOptions.weave.length > 0 && (
          <FilterSection title="Weave" options={dynamicOptions.weave} selected={filters.weave} onChange={(val) => handleArrayFilter('weave', val)} />
        )}
        {dynamicOptions?.color && dynamicOptions.color.length > 0 && (
          <FilterSection title="Color" options={dynamicOptions.color} selected={filters.color} onChange={(val) => handleArrayFilter('color', val)} />
        )}
      </div>

      <div className="md:hidden border-t border-supporting p-4 bg-white sticky bottom-0 z-10">
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="w-full bg-primary text-white py-4 text-xs font-bold uppercase tracking-widest"
        >
          View Results
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] shrink-0 pr-8">
        <SidebarContent />
      </aside>

      {/* Mobile Bottom Sheet Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 h-[85vh] bg-white z-50 rounded-t-2xl lg:hidden overflow-hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
