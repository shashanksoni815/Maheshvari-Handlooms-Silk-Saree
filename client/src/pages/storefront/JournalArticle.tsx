import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

export const JournalArticle = () => {
  const { slug } = useParams();

  // In a real app, you would fetch the article by slug. Using a mock for now.
  const article = {
    title: 'How to Identify Pure Silk: The Connoisseur\'s Guide',
    content: `
      <p class="mb-6">For centuries, pure silk has been a symbol of luxury, royalty, and unparalleled craftsmanship. But as the market floods with synthetic alternatives and blended fabrics, identifying an authentic handwoven silk saree has become an essential skill for any connoisseur.</p>
      
      <h3 class="text-2xl font-serif text-primary mt-10 mb-4">1. The Touch Test</h3>
      <p class="mb-6">The most immediate indicator of pure silk is its touch. Real silk possesses a unique warmth and a subtle, uneven texture (often referred to as 'slubs') due to its natural origin. When you rub pure silk between your fingers, you might feel a slight, satisfying resistance—a phenomenon weavers call the "crunch." Synthetics, on the other hand, often feel artificially smooth, cool, and overly slippery.</p>
      
      <h3 class="text-2xl font-serif text-primary mt-10 mb-4">2. The Burn Test</h3>
      <p class="mb-6">While we don't recommend setting your beautiful sarees on fire, the burn test is the most definitive way to test silk. If you extract a single thread and burn it:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Pure Silk:</strong> Burns slowly, smells like burning hair, and leaves a crisp, black ash that crumbles easily into powder. It stops burning once the flame is removed.</li>
        <li><strong>Synthetic/Art Silk:</strong> Melts rapidly, smells like burning plastic, and leaves a hard, plastic-like bead.</li>
      </ul>

      <h3 class="text-2xl font-serif text-primary mt-10 mb-4">3. The Lustre and Play of Light</h3>
      <p class="mb-6">Pure silk has a natural, iridescent lustre that shifts beautifully in the light. Because of the triangular prism-like structure of the silk fibre, it refracts light at different angles, producing varying hues. Artificial silk simply shines with a flat, uniform, and often overly bright gloss.</p>
      
      <blockquote class="border-l-4 border-accent pl-6 my-10 italic text-xl text-primary font-serif">
        "A true silk saree does not just drape over the body; it flows with it, possessing a life and a light of its own."
      </blockquote>

      <h3 class="text-2xl font-serif text-primary mt-10 mb-4">4. The Price and Weight</h3>
      <p class="mb-6">Authenticity has its price. Pure silk is a labor-intensive natural fibre. If a heavy bridal Kanjivaram or Banarasi is priced surprisingly low, it is highly likely a synthetic mix. Furthermore, pure silk has a distinct weight and drape that art-silk cannot replicate.</p>
      
      <p class="mb-6">At Maheshwari Silk, every saree is accompanied by a Silk Mark Certification, ensuring you are investing in an heirloom piece woven from 100% pure silk.</p>
    `,
    image: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1200&auto=format&fit=crop',
    category: 'Silk Education',
    readTime: '5 min read',
    date: 'September 18, 2026',
    author: 'Aarti Desai',
  };

  return (
    <div className="bg-background">
      {/* Hero Image */}
      <div className="w-full h-[50vh] min-h-[400px] relative">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-8 left-8">
          <Link to="/journal" className="inline-flex items-center text-white hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="bg-white p-8 md:p-12 shadow-xl border border-supporting text-center">
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-4">{article.category}</p>
          <h1 className="text-3xl md:text-5xl font-serif text-primary mb-6 leading-tight">{article.title}</h1>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 uppercase tracking-wide">
            <span>By {article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div 
          className="text-lg text-secondary leading-relaxed prose prose-headings:font-serif prose-headings:text-primary prose-a:text-accent max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        <div className="mt-16 pt-8 border-t border-supporting text-center">
          <h3 className="font-serif text-2xl text-primary mb-4">Share this story</h3>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 border border-supporting text-secondary hover:border-primary hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium">Twitter</button>
            <button className="px-6 py-2 border border-supporting text-secondary hover:border-primary hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium">Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
};
