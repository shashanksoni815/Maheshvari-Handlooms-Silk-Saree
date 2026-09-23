import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../services/api';

export const JournalMegaMenu = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-blog'],
    queryFn: async () => {
      // Fetching the most recent blog as a featured article fallback
      const res = await api.get('/blog');
      return res.data?.data?.[0]; 
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-12">
      <div className="flex-1 max-w-md">
        <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Featured Story</h3>
        {isLoading ? (
          <div className="h-48 flex items-center justify-center bg-supporting/10">
            <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
          </div>
        ) : data ? (
          <Link to={`/journal/${data.slug}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden bg-supporting/20 mb-6">
              <img 
                src={data.image || "https://images.unsplash.com/photo-1583391733958-d259779e55e5?q=80&w=600&auto=format&fit=crop"} 
                alt={data.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h4 className="font-serif text-xl text-primary mb-3 group-hover:text-accent transition-colors">{data.title}</h4>
            <p className="text-secondary/70 text-sm line-clamp-2 mb-4">
              {data.excerpt || data.content?.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'}
            </p>
            <span className="text-sm font-medium tracking-widest uppercase text-primary flex items-center group-hover:text-accent transition-colors">
              Read Story <ArrowRight className="w-4 h-4 ml-2" />
            </span>
          </Link>
        ) : (
          <div className="text-sm text-secondary">No featured stories available.</div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between ml-8 border-l border-supporting/30 pl-12">
        <div>
          <h3 className="font-serif text-sm text-primary tracking-widest uppercase mb-6">Explore Journal</h3>
          <ul className="space-y-5">
            {[
              'Style & Inspiration',
              'Silk Guide',
              'Wedding Stories',
              'Craft & Heritage',
              'Saree Care',
              'Fashion Stories',
              'Behind the Weave'
            ].map((category) => (
              <li key={category}>
                <Link to={`/journal?category=${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-base font-serif text-secondary hover:text-accent transition-colors">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8">
          <Link to="/journal" className="inline-flex text-sm font-medium tracking-widest uppercase text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors">
            View All Journal <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
