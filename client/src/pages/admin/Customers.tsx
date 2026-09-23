import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { confirm } = useConfirmation();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/customers');
      setCustomers(res.data.data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (customer: any) => {
    const newStatus = !customer.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    
    confirm({
      title: `${newStatus ? 'Activate' : 'Deactivate'} Customer`,
      message: `Are you sure you want to ${action} ${customer.firstName} ${customer.lastName}? ${!newStatus ? 'They will not be able to log in.' : ''}`,
      isDestructive: !newStatus,
      onConfirm: async () => {
        try {
          await api.put(`/admin/customers/${customer._id}/status`, { isActive: newStatus });
          fetchCustomers();
        } catch (error) {
          console.error(`Failed to ${action} customer`, error);
        }
      }
    });
  };

  const filteredCustomers = customers.filter(c => 
    (c.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Customer',
      accessor: (row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-accent font-serif font-bold text-lg">
            {row.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-semibold text-primary">{row.firstName} {row.lastName}</div>
            <div className="text-xs text-muted">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Phone',
      accessor: (row: any) => row.phone || 'N/A'
    },
    {
      header: 'Joined',
      accessor: (row: any) => new Date(row.createdAt).toLocaleDateString('en-IN')
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleToggleStatus(row); }}
          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            row.isActive !== false ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
          title="Click to toggle status"
        >
          {row.isActive !== false ? 'Active' : 'Inactive'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Customers</h2>
          <p className="text-sm text-muted mt-1">Manage your customer base</p>
        </div>
      </div>

      <AdminDataTable
        data={filteredCustomers}
        columns={columns}
        totalCount={filteredCustomers.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        onView={(row) => navigate(`/admin/customers/${row._id}`)}
        isLoading={isLoading}
        searchPlaceholder="Search by name or email..."
      />
    </div>
  );
};
