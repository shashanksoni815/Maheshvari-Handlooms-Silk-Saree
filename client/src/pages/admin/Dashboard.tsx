import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Package, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const COLORS = ['#063F32', '#C6A15B', '#3B2418', '#6B1824'];

const revenueData = [
  { name: 'Jan', current: 4000, previous: 2400 },
  { name: 'Feb', current: 3000, previous: 1398 },
  { name: 'Mar', current: 2000, previous: 9800 },
  { name: 'Apr', current: 2780, previous: 3908 },
  { name: 'May', current: 1890, previous: 4800 },
  { name: 'Jun', current: 2390, previous: 3800 },
  { name: 'Jul', current: 3490, previous: 4300 },
];

const categoryData = [
  { name: 'Silk Sarees', value: 400 },
  { name: 'Cotton Sarees', value: 300 },
  { name: 'Banarasi', value: 300 },
  { name: 'Kanjivaram', value: 200 },
];

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // In a real scenario we would fetch this from /api/v1/analytics or similar.
    // We'll mock the fetch for now to demonstrate UI since the backend for analytics isn't fully built yet.
    setTimeout(() => {
      setStats({
        totalRevenue: 1245000,
        totalOrders: 256,
        totalProducts: 142,
        totalUsers: 890
      });
      
      setRecentOrders([
        { _id: 'ORD-89237', user: { firstName: 'Anjali', lastName: 'Sharma' }, total: 4500, createdAt: new Date().toISOString(), isDelivered: false },
        { _id: 'ORD-89236', user: { firstName: 'Vikram', lastName: 'Rathore' }, total: 12500, createdAt: new Date(Date.now() - 86400000).toISOString(), isDelivered: true },
        { _id: 'ORD-89235', user: { firstName: 'Priya', lastName: 'Desai' }, total: 3200, createdAt: new Date(Date.now() - 172800000).toISOString(), isDelivered: true },
      ]);
    }, 500);
  }, []);

  const statCards = [
    { name: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, change: '+12.5%', icon: DollarSign, trend: 'up' },
    { name: 'Total Orders', value: stats.totalOrders.toString(), change: '+8.2%', icon: ShoppingBag, trend: 'up' },
    { name: 'Total Customers', value: stats.totalUsers.toString(), change: '+14.1%', icon: Users, trend: 'up' },
    { name: 'Low Stock Items', value: '12', change: '-2.4%', icon: AlertCircle, trend: 'down' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white p-6 border border-supporting shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-supporting/30 text-primary rounded-full">
                <item.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-xs font-bold ${item.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {item.change}
                <TrendingUp className={`w-3 h-3 ml-1 ${item.trend === 'down' && 'rotate-180'}`} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-serif text-primary mb-1">{item.value}</p>
              <p className="text-xs uppercase tracking-widest text-muted font-bold">{item.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white border border-supporting shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-serif text-primary mb-6">Revenue Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#063F32" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#063F32" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A15B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C6A15B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#063F32' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="current" name="This Year" stroke="#063F32" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" />
                <Area type="monotone" dataKey="previous" name="Last Year" stroke="#C6A15B" strokeWidth={2} fillOpacity={1} fill="url(#colorPrevious)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Pie Chart */}
        <div className="bg-white border border-supporting shadow-sm p-6">
          <h3 className="text-lg font-serif text-primary mb-6">Sales by Category</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-serif text-primary">1,200</span>
              <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Total Sales</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-secondary">{category.name}</span>
                </div>
                <span className="font-bold text-primary">{category.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-supporting shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-supporting flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-serif text-primary">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs uppercase tracking-widest font-bold text-accent hover:text-primary transition-colors">
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-supporting text-xs uppercase tracking-widest text-muted bg-white">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-supporting bg-white">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {order.user.firstName} {order.user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-[10px] leading-4 font-bold uppercase tracking-widest border ${
                      order.isDelivered 
                        ? 'bg-primary/5 text-primary border-primary' 
                        : 'bg-accent/10 text-brown border-accent'
                    }`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
             <div className="p-8 text-center text-muted text-sm uppercase tracking-widest font-bold">
               No recent orders found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
