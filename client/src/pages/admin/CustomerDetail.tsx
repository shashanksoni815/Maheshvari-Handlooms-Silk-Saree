import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, User, ShoppingBag, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../services/api';

export const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/admin/customers/${id}`);
      setData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch customer', error);
      navigate('/admin/customers');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!data) return null;

  const { customer, orders, stats } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/customers')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div>
          <h2 className="text-2xl font-serif text-primary">Customer Profile</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Profile & Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 text-center">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-accent font-serif font-bold text-4xl mx-auto mb-4">
              {customer.firstName?.charAt(0) || 'U'}
            </div>
            <h3 className="text-xl font-serif font-bold text-primary">{customer.firstName} {customer.lastName}</h3>
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${customer.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {customer.isActive !== false ? 'Active' : 'Inactive'}
            </span>
            
            <div className="mt-6 text-left space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4 text-muted" />
                <a href={`mailto:${customer.email}`} className="hover:text-primary">{customer.email}</a>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4 text-muted" />
                <span>{customer.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-muted" />
                <span>Joined {new Date(customer.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50">
            <h4 className="font-serif font-bold text-primary mb-4">Lifetime Value</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-sm">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Orders</p>
                <p className="text-2xl font-bold text-primary">{stats?.orderCount || 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-sm">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Spent</p>
                <p className="text-2xl font-bold text-primary">₹{(stats?.totalSpent || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md shadow-sm border border-supporting/50 overflow-hidden">
            <div className="p-4 border-b border-supporting/50 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-serif font-bold text-primary flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-muted" /> Recent Orders
              </h3>
            </div>
            
            {orders && orders.length > 0 ? (
              <div className="divide-y divide-supporting/50">
                {orders.map((order: any) => (
                  <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <Link to={`/admin/orders/${order._id}`} className="font-semibold text-primary hover:underline">
                        #{order.orderNumber || order._id.substring(order._id.length - 6).toUpperCase()}
                      </Link>
                      <p className="text-xs text-muted mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-sm">₹{(order.pricing?.total || order.total || 0).toLocaleString('en-IN')}</p>
                      <p className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block ${order.status === 'DELIVERED' || order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {order.status || (order.isDelivered ? 'DELIVERED' : 'PENDING')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted">
                No orders found for this customer.
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};
