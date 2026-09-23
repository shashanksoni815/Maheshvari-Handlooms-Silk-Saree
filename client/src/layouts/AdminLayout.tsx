
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Users, 
  ShoppingCart, 
  LogOut,
  Tag,
  PenTool,
  Settings,
  Shield,
  FileText,
  BarChart,
  Package,
  Archive,
  Star,
  Image as ImageIcon,
  Key
} from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';

export const AdminLayout = () => {
  const { logout, user } = useAuthStore();
  const location = useLocation();
  const { hasPermission, isSuperAdmin } = usePermissions();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, permission: 'dashboard.read' },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag, permission: 'products.read' },
    { name: 'Categories', href: '/admin/categories', icon: Layers, permission: 'categories.read' },
    { name: 'Collections', href: '/admin/collections', icon: Package, permission: 'collections.read' },
    { name: 'Inventory', href: '/admin/inventory', icon: Archive, permission: 'inventory.read' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, permission: 'orders.read' },
    { name: 'Customers', href: '/admin/customers', icon: Users, permission: 'customers.read' },
    { name: 'Reviews', href: '/admin/reviews', icon: Star, permission: 'reviews.read' },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag, permission: 'coupons.read' },
    { name: 'Blog/Journal', href: '/admin/blog', icon: PenTool, permission: 'blog.read' },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon, permission: 'banners.read' },
    { name: 'CMS & Settings', href: '/admin/cms', icon: Settings, permission: 'cms.read' },
    { name: 'Reports', href: '/admin/reports', icon: BarChart, permission: 'reports.read' },
    // Super Admin Only
    { name: 'Custom Roles', href: '/admin/roles', icon: Key, superAdminOnly: true },
    { name: 'Admin Users', href: '/admin/admin-users', icon: Shield, superAdminOnly: true },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText, superAdminOnly: true },
    { name: 'Settings', href: '/admin/settings', icon: Settings, superAdminOnly: true },
  ];

  return (
    <div className="flex h-screen bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary flex flex-col shadow-xl z-10 text-white">
        <div className="h-20 flex items-center px-6 border-b border-primary-light/20">
          <span className="text-xl font-serif text-accent font-semibold tracking-widest uppercase">
            Admin Portal
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            // Check visibility
            if (item.superAdminOnly && !isSuperAdmin) return null;
            if (!item.superAdminOnly && !hasPermission(item.permission as string) && !isSuperAdmin && item.href !== '/admin') return null; // Always show dashboard if they can access admin

            const isActive = location.pathname === item.href || (location.pathname.startsWith(`${item.href}/`) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-xs uppercase tracking-widest font-bold rounded-sm transition-all ${
                  isActive 
                    ? 'bg-accent text-primary shadow-md' 
                    : 'text-white/70 hover:bg-white/5 hover:text-accent'
                }`}
              >
                <item.icon className={`mr-4 h-4 w-4 ${isActive ? 'text-primary' : 'text-white/50'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-light/20">
          <button
            onClick={logout}
            className="flex w-full items-center px-4 py-3 text-xs uppercase tracking-widest font-bold text-white/70 rounded-sm hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut className="mr-4 h-4 w-4 text-white/50" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#F9F9F9]">
        <div className="h-20 bg-white border-b border-supporting flex items-center justify-between px-10 sticky top-0 z-10">
          <h1 className="text-2xl font-serif text-primary capitalize tracking-wide">
            {location.pathname === '/admin' ? 'Dashboard Overview' : location.pathname.split('/').pop()}
          </h1>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs uppercase tracking-widest font-bold text-muted hover:text-accent transition-colors">
              View Storefront
            </Link>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-accent font-serif text-lg shadow-inner uppercase">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
