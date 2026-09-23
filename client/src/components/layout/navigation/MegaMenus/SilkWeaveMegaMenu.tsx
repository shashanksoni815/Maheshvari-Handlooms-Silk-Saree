import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const SilkWeaveMegaMenu = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-12">
      <div className="flex-1 grid grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Silk Types</h3>
          <ul className="space-y-4">
            {['Pure Silk', 'Banarasi', 'Kanjivaram', 'Tussar', 'Chanderi', 'Mysore Silk'].map((item) => (
              <li key={item}>
                <Link to={`/shop?category=${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-secondary hover:text-accent transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Weaves</h3>
          <ul className="space-y-4">
            {['Handloom', 'Handwoven', 'Zari', 'Jamdani', 'Traditional Weaves'].map((item) => (
              <li key={item}>
                <Link to={`/shop?weave=${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-secondary hover:text-accent transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Explore</h3>
          <ul className="space-y-4">
            {['Silk Guide', 'Weave Guide', 'Craftsmanship'].map((item) => (
              <li key={item}>
                <Link to="/journal" className="text-sm text-secondary hover:text-accent transition-colors">
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
          src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop" 
          alt="Silk Craftsmanship" 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6">
          <h4 className="text-white font-serif text-xl mb-2">The Art of Weaving</h4>
          <p className="text-white/80 text-xs mb-4">Discover the centuries-old tradition behind our handloom silks.</p>
          <Link to="/journal" className="text-accent text-sm tracking-widest uppercase font-medium flex items-center hover:text-white transition-colors">
            Read Story <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
