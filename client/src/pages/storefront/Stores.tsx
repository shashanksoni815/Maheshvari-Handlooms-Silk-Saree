import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const STORES = [
  {
    city: 'Mumbai',
    name: 'Maheshwari Flagship',
    address: '123 Heritage Row, Colaba, Mumbai 400005',
    phone: '+91 22 2345 6789',
    email: 'mumbai@maheshwarisilk.com',
    hours: 'Mon - Sun: 11:00 AM - 8:00 PM',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Delhi',
    name: 'Maheshwari Boutique',
    address: '45 Artisan Market, Hauz Khas, New Delhi 110016',
    phone: '+91 11 9876 5432',
    email: 'delhi@maheshwarisilk.com',
    hours: 'Mon - Sun: 10:30 AM - 7:30 PM',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Bengaluru',
    name: 'Maheshwari Atelier',
    address: '78 Silk Street, Indiranagar, Bengaluru 560038',
    phone: '+91 80 1234 5678',
    email: 'blr@maheshwarisilk.com',
    hours: 'Tue - Sun: 11:00 AM - 8:00 PM (Monday Closed)',
    image: 'https://images.unsplash.com/photo-1582046105437-dbd7f9dc6859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export const Stores = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-supporting/10 pt-20 pb-16 px-4 text-center border-b border-supporting/30 mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4 tracking-wide">Our Boutiques</h1>
        <p className="max-w-xl mx-auto text-secondary text-sm md:text-base tracking-wide leading-relaxed">
          Experience the touch of pure silk and the beauty of intricate handloom in person.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-16">
          {STORES.map((store, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-stretch border border-supporting/50 bg-white shadow-sm overflow-hidden`}>
              
              <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto relative">
                <img src={store.image} alt={store.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>

              <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-2">{store.city}</h2>
                <h3 className="text-3xl font-serif text-primary mb-8">{store.name}</h3>

                <div className="space-y-6 text-secondary text-sm md:text-base">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <p>{store.phone}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <p>{store.email}</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p>{store.hours}</p>
                  </div>
                </div>

                <div className="mt-10">
                  <button className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-xs uppercase font-bold tracking-widest transition-colors w-full sm:w-auto">
                    Get Directions
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
