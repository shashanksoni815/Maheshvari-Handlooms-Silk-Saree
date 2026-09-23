import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';

export const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.orderNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (o._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (o.user?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (o.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Order',
      accessor: (row: any) => (
        <div>
          <div className="font-semibold text-primary">#{row.orderNumber || (row._id ? String(row._id).substring(String(row._id).length - 6).toUpperCase() : '')}</div>
          <div className="text-xs text-muted">{row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN') : ''}</div>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: (row: any) => (
        <div>
          <div className="text-sm font-medium text-primary">{row.user?.firstName} {row.user?.lastName}</div>
          <div className="text-xs text-muted">{row.user?.email}</div>
        </div>
      )
    },
    {
      header: 'Total',
      accessor: (row: any) => (
        <span className="font-bold text-primary">₹{row.pricing?.total?.toLocaleString('en-IN') || row.total?.toLocaleString('en-IN')}</span>
      )
    },
    {
      header: 'Payment',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          row.paymentInfo?.status === 'COMPLETED' || row.isPaid ? 'bg-green-100 text-green-800' : 
          row.paymentInfo?.status === 'REFUNDED' || row.isRefunded ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.paymentInfo?.status || (row.isRefunded ? 'REFUNDED' : row.isPaid ? 'COMPLETED' : 'PENDING')}
        </span>
      )
    },
    {
      header: 'Fulfillment',
      accessor: (row: any) => {
        const status = row.status || (row.isDelivered ? 'DELIVERED' : 'PENDING');
        let colorClass = 'bg-gray-100 text-gray-800';
        if (status === 'DELIVERED') colorClass = 'bg-green-100 text-green-800';
        else if (status === 'PROCESSING') colorClass = 'bg-blue-100 text-blue-800';
        else if (status === 'SHIPPED') colorClass = 'bg-purple-100 text-purple-800';
        else if (status === 'CANCELLED') colorClass = 'bg-red-100 text-red-800';

        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>
            {status}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Orders Management</h2>
          <p className="text-sm text-muted mt-1">Process and track customer orders</p>
        </div>
      </div>

      <AdminDataTable
        data={filteredOrders}
        columns={columns}
        totalCount={filteredOrders.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        onView={(row) => navigate(`/admin/orders/${row._id}`)}
        isLoading={isLoading}
        searchPlaceholder="Search orders by ID, Name, or Email..."
      />
    </div>
  );
};
