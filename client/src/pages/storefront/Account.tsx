import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, Star, CreditCard } from 'lucide-react';
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
    { name: 'Bank Details', path: '/account/bank-details', icon: CreditCard },
    { name: 'Wishlist', path: '/account/wishlist', icon: Heart },
    { name: 'Reviews', path: '/account/reviews', icon: Star },
  ];

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center bg-background">
        <p className="text-secondary mb-6 text-lg">Please login to view your account.</p>
        <button onClick={() => navigate('/login')} className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 uppercase tracking-widest text-xs font-bold transition-colors">
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-supporting/10 pt-16 pb-12 px-4 text-center border-b border-supporting/30 mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">My Account</h1>
        <p className="text-secondary font-medium tracking-wide">Welcome back, {user.firstName}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-supporting shadow-sm sticky top-24">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-6 py-4 border-b border-supporting transition-colors text-sm font-medium tracking-wide ${
                        isActive 
                          ? 'bg-primary/5 text-primary border-l-2 border-l-primary' 
                          : 'text-secondary hover:bg-supporting/10 hover:text-primary border-l-2 border-l-transparent'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-6 py-4 text-sm font-medium tracking-wide text-burgundy hover:bg-burgundy/5 transition-colors border-l-2 border-l-transparent text-left w-full"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-h-[50vh]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
