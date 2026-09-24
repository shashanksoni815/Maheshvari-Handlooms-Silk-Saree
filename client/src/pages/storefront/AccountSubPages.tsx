import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Package, ExternalLink, Trash2, MapPin, Heart, Star } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const AccountProfile = () => {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-supporting/30">
        <div>
          <h2 className="text-3xl font-serif text-primary">Personal Information</h2>
          <p className="text-secondary mt-2">Manage your personal details and preferences.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <div className="bg-background/50 p-6 rounded-lg border border-supporting/20 hover:border-accent/30 transition-colors">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-2">First Name</p>
          <p className="text-xl font-serif text-primary">{user.firstName}</p>
        </div>
        <div className="bg-background/50 p-6 rounded-lg border border-supporting/20 hover:border-accent/30 transition-colors">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-2">Last Name</p>
          <p className="text-xl font-serif text-primary">{user.lastName}</p>
        </div>
        <div className="bg-background/50 p-6 rounded-lg border border-supporting/20 hover:border-accent/30 transition-colors">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-2">Email Address</p>
          <p className="text-xl font-serif text-primary">{user.email}</p>
        </div>
        <div className="bg-background/50 p-6 rounded-lg border border-supporting/20 hover:border-accent/30 transition-colors">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-2">Account Role</p>
          <p className="text-xl font-serif text-primary capitalize">{user.role.toLowerCase()}</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-supporting/30 flex justify-end">
        <button className="bg-primary text-white hover:bg-primary/90 px-10 py-4 text-xs uppercase font-bold tracking-widest transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] rounded-sm">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export const AccountOrders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/myorders');
      return res.data;
    }
  });

  const orders = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-secondary font-medium tracking-widest uppercase text-xs">Loading Orders</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[400px] text-center">
        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-supporting/50">
          <Package className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-3xl font-serif text-primary mb-4">No Orders Yet</h2>
        <p className="text-secondary mb-10 max-w-md">You haven't placed any orders with us. Explore our collection of premium silk sarees.</p>
        <Link to="/shop" className="bg-primary text-white hover:bg-primary/90 px-10 py-4 text-xs uppercase font-bold tracking-widest transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] rounded-sm">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-supporting/30">
        <div>
          <h2 className="text-3xl font-serif text-primary">Order History</h2>
          <p className="text-secondary mt-2">View and track your recent purchases.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-supporting/50 text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
              <th className="py-4 pr-4">Order Details</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-right">Total Amount</th>
              <th className="py-4 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order._id} className="border-b border-supporting/20 hover:bg-background/50 transition-colors group">
                <td className="py-6 pr-4">
                  <div className="font-serif text-primary text-lg">{order.orderNumber}</div>
                  {order.trackingInfo?.courier && (
                    <div className="text-[10px] text-accent mt-1 uppercase tracking-widest font-bold">
                      {order.trackingInfo.courier} - {order.trackingInfo.trackingId}
                    </div>
                  )}
                </td>
                <td className="py-6 px-4 text-secondary font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td className="py-6 px-4">
                  <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border border-green-200' : 
                    order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-6 px-4 text-right text-primary font-medium text-lg">₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                <td className="py-6 pl-4 text-right">
                  <Link to={`/account/orders/${order._id}`} className="inline-flex items-center justify-center border border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm">
                    View Details
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
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await api.get(`/orders/${orderId}`);
      return res.data;
    },
    enabled: !!orderId
  });

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      try {
        await api.put(`/orders/${orderId}/cancel`);
        alert("Order cancelled successfully.");
        queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to cancel order.");
      }
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-secondary font-medium tracking-widest uppercase text-xs">Loading Order Details</p>
    </div>
  );
  
  if (!data?.data) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[400px] text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <Package className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-2xl font-serif text-primary mb-2">Order Not Found</h3>
      <p className="text-secondary mb-8 max-w-sm">We couldn't locate the order you're looking for. It may have been removed or the ID is incorrect.</p>
      <button onClick={() => navigate('/account/orders')} className="bg-primary text-white hover:bg-primary/90 px-8 py-3 text-xs uppercase font-bold tracking-widest transition-colors shadow-md hover:shadow-lg">
        Back to My Orders
      </button>
    </div>
  );

  const order = data.data;

  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-supporting/30">
        <div>
          <button onClick={() => navigate('/account/orders')} className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4 hover:text-accent transition-colors flex items-center group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Orders
          </button>
          <h2 className="text-3xl font-serif text-primary mb-2">Order {order.orderNumber}</h2>
          <p className="text-secondary font-medium">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
            order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border border-green-200' : 
            order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
          }`}>
            {order.status}
          </span>
          {['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status) && (
            <button 
              onClick={handleCancelOrder}
              className="text-[10px] uppercase tracking-widest text-burgundy font-bold hover:text-red-700 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {order.status === 'CANCELLED' && order.isRefunded && (
        <div className="bg-red-50 border border-red-100 p-5 rounded-lg text-sm text-red-800 mb-8 flex items-start gap-4">
          <div className="p-2 bg-white rounded-full shrink-0">
            <Package className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <strong className="block mb-1 font-serif text-lg">Refund Initiated</strong>
            A refund of ₹{order.refundDetails?.amount?.toLocaleString('en-IN')} was initiated on {new Date(order.refundDetails?.refundedAt).toLocaleDateString()}. It may take 5-7 business days to reflect in your original payment method.
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4 border-b border-supporting/30 pb-10 mb-10">
        <h3 className="text-sm uppercase tracking-widest text-muted font-bold mb-6">Items in this order</h3>
        <div className="grid grid-cols-1 gap-6">
          {order.items.map((item: any) => (
            <div key={item._id} className="flex gap-6 items-center bg-background/50 p-4 border border-supporting/20 rounded-lg">
              <div className="w-20 h-28 bg-supporting/10 shrink-0 border border-supporting/30 rounded-md overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-1">
                <p className="font-serif text-primary text-xl mb-1">{item.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Qty: {item.quantity}</p>
              </div>
              <div className="text-right px-4">
                <p className="font-serif text-primary text-xl">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-sm uppercase tracking-widest text-muted font-bold mb-6">Delivery Details</h3>
          <div className="bg-background/50 p-6 border border-supporting/20 rounded-lg h-[calc(100%-2rem)]">
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Shipping Address</p>
            <p className="text-secondary leading-relaxed mb-6 font-medium">
              <span className="text-primary block font-bold mb-1">{order.shippingAddress.fullName}</span>
              {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}<br/>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br/>
              Ph: {order.shippingAddress.phone}
            </p>

            {order.trackingInfo?.courier && (
              <div className="pt-6 border-t border-supporting/30">
                <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Tracking Information</p>
                <p className="text-secondary mb-1"><span className="font-bold text-primary">Courier:</span> {order.trackingInfo.courier}</p>
                <p className="text-secondary mb-4"><span className="font-bold text-primary">Tracking ID:</span> {order.trackingInfo.trackingId}</p>
                {order.trackingInfo.trackingUrl && (
                  <a href={order.trackingInfo.trackingUrl} target="_blank" rel="noreferrer" className="inline-block border border-primary text-primary px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors rounded-sm">
                    Track Package
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-muted font-bold mb-6">Order Summary</h3>
          <div className="bg-background/50 p-6 border border-supporting/20 rounded-lg h-[calc(100%-2rem)] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span className="font-medium">₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-burgundy">
                  <span>Discount</span>
                  <span className="font-medium">- ₹{order.pricing.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-secondary">
                <span>Tax (GST)</span>
                <span className="font-medium">₹{order.pricing?.tax?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Shipping</span>
                <span className="font-medium">{order.pricing?.shipping === 0 ? 'Free' : `₹${order.pricing?.shipping?.toLocaleString('en-IN')}`}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-supporting/30">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Total Amount</span>
                <span className="font-serif text-3xl text-primary">₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm items-center bg-white p-3 rounded border border-supporting/20">
                <span className="text-muted font-medium">Paid via {order.paymentInfo?.method}</span>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${order.paymentInfo?.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.paymentInfo?.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountAddresses = () => {
  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-supporting/30">
        <div>
          <h2 className="text-3xl font-serif text-primary">Saved Addresses</h2>
          <p className="text-secondary mt-2">Manage your delivery locations for faster checkout.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border-2 border-dashed border-supporting/60 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-supporting/5 hover:border-primary/40 transition-colors h-full min-h-[250px] group">
          <div className="w-12 h-12 rounded-full bg-supporting/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">+ Add New Address</p>
        </div>
      </div>
    </div>
  );
};

export const AccountWishlist = () => {
  const { items, removeItem } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[400px] text-center">
        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-supporting/50">
          <Heart className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-3xl font-serif text-primary mb-4">Your Wishlist is Empty</h2>
        <p className="text-secondary mb-10 max-w-md">Save your favorite silk sarees here to easily find and purchase them later.</p>
        <Link to="/shop" className="bg-primary text-white hover:bg-primary/90 px-10 py-4 text-xs uppercase font-bold tracking-widest transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] rounded-sm">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-supporting/30">
        <div>
          <h2 className="text-3xl font-serif text-primary">My Wishlist</h2>
          <p className="text-secondary mt-2">Your curated collection of favorites.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.product} className="group flex flex-col relative border border-transparent hover:border-supporting/40 bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-lg overflow-hidden">
            <button 
              onClick={() => removeItem(item.product)}
              className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-secondary hover:text-burgundy hover:bg-red-50 z-10 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <Link to={`/product/${item.product}`} className="flex-1 flex flex-col">
              <div className="aspect-[3/4] overflow-hidden bg-background mb-4">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-4 pt-0 text-center flex-1 flex flex-col">
                <h3 className="font-serif text-primary text-lg mb-2 line-clamp-1">{item.name}</h3>
                <p className="text-secondary font-medium mt-auto">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AccountReviews = () => {
  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-supporting/30">
        <div>
          <h2 className="text-3xl font-serif text-primary">My Reviews</h2>
          <p className="text-secondary mt-2">Your feedback helps us improve our collection.</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center p-20 min-h-[400px] text-center">
        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-supporting/50">
          <Star className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-2xl font-serif text-primary mb-4">No Reviews Yet</h3>
        <p className="text-secondary mb-10 max-w-md">You haven't submitted any reviews. Share your thoughts on purchased items to help others.</p>
        <Link to="/account/orders" className="bg-primary text-white hover:bg-primary/90 px-10 py-4 text-xs uppercase font-bold tracking-widest transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] rounded-sm">
          Review Past Orders
        </Link>
      </div>
    </div>
  );
};
