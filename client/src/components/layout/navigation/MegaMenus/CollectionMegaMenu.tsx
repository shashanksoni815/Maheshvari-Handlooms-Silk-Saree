import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../../../../services/api';

const fallbackCollections = [
  { name: 'Wedding Collection', slug: 'wedding', image: 'https://images.unsplash.com/photo-1583391733958-d259779e55e5?q=80&w=400&auto=format&fit=crop' },
  { name: 'Bridal Collection', slug: 'bridal', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop' },
  { name: 'Festive Collection', slug: 'festive', image: 'https://images.unsplash.com/photo-1610189013994-46323c91db10?q=80&w=400&auto=format&fit=crop' },
  { name: 'New Arrivals', slug: 'new-arrivals', image: 'https://images.unsplash.com/photo-1585468274952-66591eb14165?q=80&w=400&auto=format&fit=crop' }
];

const fallbackStandardLinks = [
  { name: 'Best Sellers', slug: 'best-sellers' },
  { name: 'Luxury Collection', slug: 'luxury' },
  { name: 'Handloom Collection', slug: 'handloom' },
  { name: 'Limited Edition', slug: 'limited-edition' },
];

export const CollectionMegaMenu = () => {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    api.get('/collections').then(res => {
      setCollections(res.data.data);
    }).catch(console.error);
  }, []);

  const topCollections = collections.length > 0 ? collections.slice(0, 4) : fallbackCollections;
  const bottomCollections = collections.length > 4 ? collections.slice(4, 8) : fallbackStandardLinks;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-4 gap-8 mb-10">
        {topCollections.map((col) => (
          <Link to={`/shop?collection=${col.slug}`} key={col.slug} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-supporting/20 mb-4">
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 z-10" />
              <img 
                src={col.bannerImage || col.image || "https://images.unsplash.com/photo-1585468274952-66591eb14165?q=80&w=400&auto=format&fit=crop"} 
                alt={col.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="flex items-center justify-between text-secondary group-hover:text-primary transition-colors">
              <span className="font-serif tracking-wide">{col.name}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </Link>
        ))}
      </div>
      
      <div className="border-t border-supporting/50 pt-6 flex justify-between items-center">
        <ul className="flex space-x-8">
          {bottomCollections.map((link) => (
            <li key={link.slug}>
              <Link to={`/shop?collection=${link.slug}`} className="text-sm font-medium tracking-widest uppercase text-secondary hover:text-accent transition-colors">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/shop" className="text-sm font-medium tracking-widest uppercase text-primary flex items-center hover:text-accent transition-colors">
          View All Collections <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};
