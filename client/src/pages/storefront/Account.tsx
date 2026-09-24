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
      <div className="min-h-[60vh] flex flex-col justify-center items-center bg-background">
        <p className="text-secondary mb-6 text-lg tracking-wide font-serif">Please login to access your account.</p>
        <button onClick={() => navigate('/login')} className="border border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 uppercase tracking-widest text-xs font-bold transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
          Login Securely
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24">
      {/* Luxury Header Banner */}
      <div className="relative bg-primary text-white pt-24 pb-20 px-4 text-center overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-90"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl">
            <span className="text-3xl font-serif text-accent">{user.firstName.charAt(0)}{user.lastName?.charAt(0)}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Welcome, {user.firstName}</h1>
          <p className="text-white/70 font-medium tracking-widest uppercase text-sm">Maheshwari Silk Member</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-supporting/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24 overflow-hidden">
              <nav className="flex flex-col py-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => 
                      `group flex items-center px-8 py-5 transition-all duration-300 text-sm font-medium tracking-wider relative overflow-hidden ${
                        isActive 
                          ? 'text-primary bg-primary/5' 
                          : 'text-secondary hover:bg-supporting/10 hover:text-primary'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isActive ? 'bg-accent' : 'bg-transparent group-hover:bg-accent/50'}`}></div>
                        <item.icon className={`w-5 h-5 mr-4 transition-transform duration-300 ${isActive ? 'scale-110 text-accent' : 'text-muted group-hover:text-primary group-hover:scale-110'}`} />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                ))}
                <div className="mx-8 my-4 h-px bg-supporting/30"></div>
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-8 py-5 text-sm font-medium tracking-wider text-burgundy hover:bg-burgundy/5 transition-all duration-300 text-left w-full relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-burgundy/50 transition-all duration-300"></div>
                  <LogOut className="w-5 h-5 mr-4 text-burgundy/70 group-hover:text-burgundy group-hover:scale-110 transition-transform duration-300" />
                  Logout securely
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-h-[50vh]">
            <div className="bg-white rounded-xl border border-supporting/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
