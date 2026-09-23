import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import api from '../../services/api';

export const Reports = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd fetch this from a specific reports aggregation endpoint
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/admin/customers'),
        api.get('/admin/products')
      ]);

      const orders = ordersRes.data.data;
      const totalRevenue = orders.filter((o: any) => o.isPaid || o.paymentInfo?.status === 'COMPLETED')
                                 .reduce((sum: number, o: any) => sum + (o.pricing?.total || 0), 0);
      
      setStats({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalCustomers: usersRes.data.data.length,
        totalProducts: productsRes.data.data.length,
        recentOrders: orders.slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center animate-pulse">Loading reports...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">System Reports & Analytics</h2>
          <p className="text-sm text-muted mt-1">Overview of store performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mr-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-widest font-bold">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-4">
            <ShoppingCart className="w-6 h-6" />
          </div>
        <div>
            <p className="text-xs text-muted uppercase tracking-widest font-bold">Total Orders</p>
            <p className="text-2xl font-bold text-primary">{stats?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-widest font-bold">Customers</p>
            <p className="text-2xl font-bold text-primary">{stats?.totalCustomers || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 flex items-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-widest font-bold">Products</p>
            <p className="text-2xl font-bold text-primary">{stats?.totalProducts || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border border-supporting p-6 mt-6">
        <h3 className="text-lg font-serif font-bold text-primary mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondary">
            <thead className="bg-gray-50 border-b border-supporting text-xs uppercase tracking-widest text-primary">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentOrders?.map((order: any) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 font-mono font-bold text-primary">{order.orderNumber || order._id.substring(order._id.length-6).toUpperCase()}</td>
                  <td className="px-6 py-4">{order.user?.firstName} {order.user?.lastName}</td>
                  <td className="px-6 py-4 text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">₹{(order.pricing?.total || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100">
                      {order.status || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
