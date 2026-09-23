import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, Trash2 } from 'lucide-react';

export const AccountProfile = () => {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
    <div className="bg-white p-6 md:p-10 border border-supporting shadow-sm">
      <h2 className="text-2xl font-serif text-primary mb-8 border-b border-supporting pb-4">Personal Information</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted font-bold mb-1">First Name</p>
          <p className="text-lg text-primary">{user.firstName}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted font-bold mb-1">Last Name</p>
          <p className="text-lg text-primary">{user.lastName}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted font-bold mb-1">Email Address</p>
          <p className="text-lg text-primary">{user.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted font-bold mb-1">Role</p>
          <p className="text-lg text-primary capitalize">{user.role}</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-supporting">
        <button className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-xs uppercase font-bold tracking-widest transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export const AccountOrders = () => {
  // Placeholder for Orders. In a real app, fetch from API.
  const mockOrders = [
    { _id: 'ORD-10293', date: '2023-10-15', total: 24500, status: 'Delivered', items: 2 },
    { _id: 'ORD-10294', date: '2023-11-02', total: 18000, status: 'Processing', items: 1 },
  ];

  if (mockOrders.length === 0) {
    return (
      <div className="bg-white p-12 border border-supporting shadow-sm text-center flex flex-col items-center">
        <Package className="w-12 h-12 text-secondary mb-4" />
        <h2 className="text-2xl font-serif text-primary mb-2">No Orders Yet</h2>
        <p className="text-secondary mb-8">You haven't placed any orders with us.</p>
        <Link to="/shop" className="bg-primary text-white px-8 py-3 text-xs uppercase font-bold tracking-widest hover:bg-primary/90 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 border border-supporting shadow-sm">
      <h2 className="text-2xl font-serif text-primary mb-8 border-b border-supporting pb-4">Order History</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-supporting text-xs uppercase tracking-widest text-secondary font-bold">
              <th className="py-4 pr-4">Order ID</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-right">Total</th>
              <th className="py-4 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map(order => (
              <tr key={order._id} className="border-b border-supporting/50 hover:bg-supporting/5 transition-colors">
                <td className="py-4 pr-4 font-medium text-primary">{order._id}</td>
                <td className="py-4 px-4 text-secondary">{order.date}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-primary font-medium">₹{order.total.toLocaleString('en-IN')}</td>
                <td className="py-4 pl-4 text-right">
                  <Link to={`/account/orders/${order._id}`} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors">
                    View <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AccountOrderDetails = () => {
  return (
    <div className="bg-white p-6 md:p-10 border border-supporting shadow-sm">
      <h2 className="text-2xl font-serif text-primary mb-8 border-b border-supporting pb-4">Order Details</h2>
      <p className="text-secondary">Order details will be displayed here.</p>
    </div>
  );
};

export const AccountAddresses = () => {
  return (
    <div className="bg-white p-6 md:p-10 border border-supporting shadow-sm">
      <h2 className="text-2xl font-serif text-primary mb-8 border-b border-supporting pb-4">Saved Addresses</h2>
      <div className="border border-dashed border-supporting p-8 text-center cursor-pointer hover:bg-supporting/5 transition-colors">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">+ Add New Address</p>
      </div>
    </div>
  );
};

export const AccountWishlist = () => {
  const { items, removeItem } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="bg-white p-12 border border-supporting shadow-sm text-center">
        <h2 className="text-2xl font-serif text-primary mb-4">Your Wishlist is Empty</h2>
        <p className="text-secondary mb-8">Save your favorite pieces here to view them later.</p>
        <Link to="/shop" className="border border-primary text-primary px-8 py-3 text-xs uppercase font-bold tracking-widest hover:bg-primary hover:text-white transition-colors">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 border border-supporting shadow-sm">
      <h2 className="text-2xl font-serif text-primary mb-8 border-b border-supporting pb-4">My Wishlist</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.product} className="relative group border border-supporting p-4 bg-background">
            <button 
              onClick={() => removeItem(item.product)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-muted hover:text-burgundy z-10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <Link to={`/product/${item.product}`}>
              <div className="aspect-[3/4] overflow-hidden bg-supporting/20 mb-4">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif text-primary text-lg line-clamp-1 mb-1">{item.name}</h3>
              <p className="text-secondary font-medium">₹{item.price.toLocaleString('en-IN')}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AccountReviews = () => {
  return (
    <div className="bg-white p-6 md:p-10 border border-supporting shadow-sm">
      <h2 className="text-2xl font-serif text-primary mb-8 border-b border-supporting pb-4">My Reviews</h2>
      <p className="text-secondary text-center py-12">You haven't submitted any reviews yet.</p>
    </div>
  );
};
