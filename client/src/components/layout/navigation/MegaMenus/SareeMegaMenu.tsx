import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const SareeMegaMenu = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-12">
      <div className="flex-1 grid grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Shop by Type</h3>
          <ul className="space-y-4">
            {['Silk Sarees', 'Banarasi Silk', 'Kanjivaram Silk', 'Tussar Silk', 'Chanderi Silk', 'Mysore Silk', 'Paithani', 'Bhagalpur Silk'].map((item) => (
              <li key={item}>
                <Link to={`/shop?category=${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-secondary hover:text-accent transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Other Sarees</h3>
          <ul className="space-y-4">
            {['Cotton', 'Linen', 'Organza', 'Georgette', 'Designer Sarees'].map((item) => (
              <li key={item}>
                <Link to={`/shop?category=${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-secondary hover:text-accent transition-colors">
                  {item}
                </Link>
              </li>
            ))}
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
          src="https://images.unsplash.com/photo-1610189013994-46323c91db10?q=80&w=600&auto=format&fit=crop" 
          alt="Editorial Saree" 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-0 inset-x-0 p-6 z-20 bg-gradient-to-t from-black/60 to-transparent">
          <Link to="/shop" className="text-white text-sm tracking-widest uppercase font-medium flex items-center hover:text-accent transition-colors">
            Explore All Sarees <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
