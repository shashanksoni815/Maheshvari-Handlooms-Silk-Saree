import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Account = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Profile', path: '/account/profile', icon: User },
    { name: 'Orders', path: '/account/orders', icon: Package },
    { name: 'Addresses', path: '/account/addresses', icon: MapPin },
    { name: 'Wishlist', path: '/account/wishlist', icon: Heart },
    { name: 'Reviews', path: '/account/reviews', icon: Star },
  ];

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-background px-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">Client Portal</span>
        <p className="text-secondary mb-6 text-base tracking-wide font-serif">Please sign in to access your personal boutique account.</p>
        <button onClick={() => navigate('/login')} className="bg-primary text-white hover:bg-accent hover:text-primary px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold transition-all shadow-md">
          Sign In Securely
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-24 text-primary">
      {/* Luxury Header Banner */}
      <div className="relative bg-primary text-white pt-24 pb-24 px-4 text-center overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[16vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none font-serif">
            MEMBER
          </span>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-300/30 shadow-xl">
            <span className="text-3xl font-serif text-amber-300 font-bold">{user.firstName.charAt(0)}{user.lastName?.charAt(0)}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif mb-2 tracking-wide font-bold">Welcome, {user.firstName}</h1>
          <span className="inline-block bg-amber-300/10 text-amber-300 border border-amber-300/30 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.25em]">
            Maheshwari Privilege Member
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl border border-supporting/60 shadow-lg sticky top-28 overflow-hidden p-3">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => 
                      `group flex items-center px-6 py-4 rounded-2xl transition-all duration-300 text-xs font-bold uppercase tracking-wider relative ${
                        isActive 
                          ? 'text-primary bg-primary/10 border border-primary/20' 
                          : 'text-secondary hover:bg-background hover:text-primary'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-4 h-4 mr-3 transition-transform duration-300 ${isActive ? 'text-accent scale-110' : 'text-secondary/60 group-hover:text-primary'}`} />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                ))}
                <div className="mx-4 my-2 h-px bg-supporting/40" />
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-all duration-300 text-left w-full"
                >
                  <LogOut className="w-4 h-4 mr-3 text-rose-500 group-hover:scale-110 transition-transform" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-h-[50vh]">
            <div className="bg-white rounded-3xl border border-supporting/60 shadow-lg overflow-hidden p-6 sm:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
