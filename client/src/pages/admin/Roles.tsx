import React, { useState, useEffect } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const Roles = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  
  const { confirm } = useConfirmation();

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/roles');
      setRoles(response.data.data);
    } catch (error) {
      console.error('Failed to fetch roles', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openModal = (role: any = null) => {
    setCurrentRole(role);
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentRole) {
        await api.put(`/admin/roles/${currentRole._id}`, formData);
      } else {
        await api.post('/admin/roles', formData);
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (role: any) => {
    confirm({
      title: 'Delete Role',
      message: `Are you sure you want to delete the role "${role.name}"? Users with this role may lose access.`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/roles/${role._id}`);
          fetchRoles();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete role');
        }
      }
    });
  };

  const AVAILABLE_PERMISSIONS = [
    'dashboard.read',
    'products.read', 'products.create', 'products.update', 'products.delete',
    'categories.read', 'categories.create', 'categories.update', 'categories.delete',
    'collections.read', 'collections.create', 'collections.update', 'collections.delete',
    'inventory.read', 'inventory.update',
    'orders.read', 'orders.update', 'orders.refund',
    'customers.read', 'customers.update',
    'reviews.read', 'reviews.update', 'reviews.delete',
    'coupons.read', 'coupons.create', 'coupons.update', 'coupons.delete',
    'blog.read', 'blog.create', 'blog.update', 'blog.delete',
    'banners.read', 'banners.update',
    'cms.read', 'cms.update',
    'reports.read'
  ];

  const handlePermissionToggle = (perm: string) => {
    setFormData(prev => {
      if (prev.permissions.includes(perm)) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== perm) };
      } else {
        return { ...prev, permissions: [...prev.permissions, perm] };
      }
    });
  };

  const columns = [
    {
      header: 'Role Name',
      accessor: (row: any) => <span className="font-bold text-primary">{row.name}</span>
    },
    {
      header: 'Description',
      accessor: (row: any) => <span className="text-sm text-muted">{row.description}</span>
    },
    {
      header: 'Permissions',
      accessor: (row: any) => (
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
          {row.permissions?.length || 0} permissions
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Custom Roles</h2>
          <p className="text-sm text-muted mt-1">Manage RBAC roles and permissions</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Role
        </button>
      </div>

      <AdminDataTable
        data={roles}
        columns={columns}
        totalCount={roles.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={() => {}}
        onEdit={openModal}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-primary">{currentRole ? 'Edit Role' : 'New Role'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" placeholder="e.g. Inventory Manager" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-3">Permissions</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {AVAILABLE_PERMISSIONS.map(perm => (
                    <div key={perm} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`perm-${perm}`}
                        checked={formData.permissions.includes(perm)}
                        onChange={() => handlePermissionToggle(perm)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor={`perm-${perm}`} className="ml-2 text-sm text-gray-700 font-mono select-none">
                        {perm}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-supporting rounded-sm text-sm font-semibold">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-sm text-sm font-semibold uppercase tracking-widest flex items-center disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
