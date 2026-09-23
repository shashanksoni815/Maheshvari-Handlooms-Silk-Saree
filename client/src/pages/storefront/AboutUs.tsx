import { Link } from 'react-router-dom';

export const AboutUs = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1605902302302-3c8da83bfb0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Weaver at loom" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif mb-4 drop-shadow-lg leading-tight">
            Our Heritage
          </h1>
          <p className="text-sm md:text-base tracking-[0.2em] uppercase font-bold text-white/90">
            A Legacy of Pure Silk
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <div className="max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
        <h2 className="text-3xl font-serif text-primary mb-8">The Maheshwari Philosophy</h2>
        <div className="w-12 h-0.5 bg-accent mx-auto mb-8" />
        <p className="text-lg text-secondary leading-relaxed md:leading-loose">
          Rooted in the ancient weaving traditions of India, Maheshwari Handloom Silk Sarees represents 
          the pinnacle of artisanal craftsmanship. We don't just sell garments; we curate heirlooms. 
          Every thread is a testament to the dedication of master weavers who have passed down their 
          skills through generations. Our sarees are an homage to the timeless elegance of the Indian woman.
        </p>
      </div>

      {/* Craftsmanship Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-[1440px] mx-auto">
        <div className="aspect-square relative group overflow-hidden">
          <img src="https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Silk Threads" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center">
            <h3 className="text-2xl font-serif text-white">Purest Silks</h3>
          </div>
        </div>
        <div className="aspect-square bg-supporting/10 flex flex-col justify-center items-center p-12 text-center">
          <h3 className="text-3xl font-serif text-primary mb-6">Master Artisans</h3>
          <p className="text-secondary leading-relaxed max-w-sm">
            It takes up to 45 days to weave a single masterpiece. Our artisans pour their soul into the intricate zari work and complex motifs that define our collection.
          </p>
        </div>
        <div className="aspect-square bg-primary flex flex-col justify-center items-center p-12 text-center">
          <h3 className="text-3xl font-serif text-white mb-6">Sustainable Heritage</h3>
          <p className="text-white/80 leading-relaxed max-w-sm">
            We are committed to ethical sourcing and supporting the weaving communities, ensuring that this magnificent art form thrives for generations to come.
          </p>
        </div>
        <div className="aspect-square relative group overflow-hidden">
          <img src="https://images.unsplash.com/photo-1583391733959-b52d9a334ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Weaving Loom" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center">
            <h3 className="text-2xl font-serif text-white">Handwoven Precision</h3>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 text-center px-4">
        <h2 className="text-3xl font-serif text-primary mb-8">Experience the Magic</h2>
        <Link 
          to="/shop" 
          className="inline-block border border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 text-xs uppercase font-bold tracking-widest transition-colors"
        >
          Explore the Collection
        </Link>
      </div>
    </div>
  );
};
