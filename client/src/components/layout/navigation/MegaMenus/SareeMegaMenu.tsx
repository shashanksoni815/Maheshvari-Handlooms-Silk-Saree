import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../../../../services/api';

export const SareeMegaMenu = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [navBanner, setNavBanner] = useState<any>(null);

  useEffect(() => {
    // Fetch categories for "Shop by Type"
    api.get('/categories').then(res => {
      setCategories(res.data.data.slice(0, 8));
    }).catch(console.error);

    // Fetch collections for "Other Sarees"
    api.get('/collections').then(res => {
      setCollections(res.data.data.slice(0, 5));
    }).catch(console.error);

    // Fetch NAV_MENU banner
    api.get('/banners?position=NAV_MENU').then(res => {
      if (res.data.data && res.data.data.length > 0) {
        setNavBanner(res.data.data[0]);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-12">
      <div className="flex-1 grid grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Shop by Type</h3>
          <ul className="space-y-4">
            {categories.length > 0 ? categories.map((cat) => (
              <li key={cat._id}>
                <Link to={`/shop?category=${cat.slug}`} className="text-sm text-secondary hover:text-accent transition-colors">
                  {cat.name}
                </Link>
              </li>
            )) : (
              // Fallback
              ['Silk Sarees', 'Banarasi Silk', 'Kanjivaram Silk', 'Tussar Silk'].map((item) => (
                <li key={item}>
                  <Link to={`/shop?category=${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-secondary hover:text-accent transition-colors">
                    {item}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Other Sarees</h3>
          <ul className="space-y-4">
            {collections.length > 0 ? collections.map((col) => (
              <li key={col._id}>
                <Link to={`/shop?collection=${col.slug}`} className="text-sm text-secondary hover:text-accent transition-colors">
                  {col.name}
                </Link>
              </li>
            )) : (
              // Fallback
              ['Cotton', 'Linen', 'Organza', 'Georgette'].map((item) => (
                <li key={item}>
                  <Link to={`/shop?collection=${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-secondary hover:text-accent transition-colors">
                    {item}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Shop By</h3>
          <ul className="space-y-4">
            {['Fabric', 'Color', 'Weave', 'Occasion', 'Price'].map((item) => (
              <li key={item}>
                <Link to={`/shop?filter=${item.toLowerCase()}`} className="text-sm text-secondary hover:text-accent transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="w-80 flex flex-col group relative overflow-hidden bg-supporting/20">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors duration-500 z-10" />
        <img 
          src={navBanner?.image || "https://images.unsplash.com/photo-1610189013994-46323c91db10?q=80&w=600&auto=format&fit=crop"} 
          alt={navBanner?.title || "Editorial Saree"} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-0 inset-x-0 p-6 z-20 bg-gradient-to-t from-black/60 to-transparent">
          <Link to={navBanner?.link || "/shop"} className="text-white text-sm tracking-widest uppercase font-medium flex items-center hover:text-accent transition-colors">
            {navBanner?.title || "Explore All Sarees"} <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
