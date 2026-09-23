import { useState, useEffect } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';
import { useAuthStore } from '../../store/authStore';

export const AdminUsers = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ADMIN',
    customRole: '',
    isActive: true
  });
  
  const { confirm } = useConfirmation();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [adminRes, roleRes] = await Promise.all([
        api.get('/admin/admin-users'),
        api.get('/admin/roles')
      ]);
      setAdmins(adminRes.data.data);
      setRoles(roleRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (admin: any = null) => {
    setCurrentAdmin(admin);
    if (admin) {
      setFormData({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: '',
        role: admin.role,
        customRole: admin.customRole?._id || '',
        isActive: admin.isActive
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'ADMIN',
        customRole: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit: any = { ...formData };
      if (currentAdmin) {
        delete dataToSubmit.password; // password change handled elsewhere
        delete dataToSubmit.email; // email change not allowed via this form
        await api.put(`/admin/admin-users/${currentAdmin._id}`, dataToSubmit);
      } else {
        await api.post('/admin/admin-users', dataToSubmit);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save admin user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (admin: any) => {
    if (admin._id === user?._id) {
      alert('You cannot delete yourself.');
      return;
    }
    
    confirm({
      title: 'Delete Admin',
      message: `Are you sure you want to delete ${admin.firstName} ${admin.lastName}? This action is irreversible.`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/admin-users/${admin._id}`);
          fetchData();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete admin');
        }
      }
    });
  };

  const filteredAdmins = admins.filter(a => 
    (a.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (a.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (a.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Admin',
      accessor: (row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-accent font-serif font-bold text-lg">
            {row.firstName?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="font-semibold text-primary">{row.firstName} {row.lastName} {row._id === user?._id && '(You)'}</div>
            <div className="text-xs text-muted">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'System Role',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          row.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {row.role.replace('_', ' ')}
        </span>
      )
    },
    {
      header: 'Custom Permissions',
      accessor: (row: any) => (
        row.role === 'SUPER_ADMIN' ? <span className="text-xs text-muted">All Access</span> :
        row.customRole ? <span className="text-xs font-semibold">{row.customRole.name}</span> :
        <span className="text-xs text-red-500">No custom role</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Admin Users</h2>
          <p className="text-sm text-muted mt-1">Manage admin access and custom roles</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Admin
        </button>
      </div>

      <AdminDataTable
        data={filteredAdmins}
        columns={columns}
        totalCount={filteredAdmins.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        onEdit={openModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchPlaceholder="Search admins by name or email..."
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-primary">{currentAdmin ? 'Edit Admin User' : 'New Admin User'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
              </div>
              
              {!currentAdmin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" minLength={6} />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System Role *</label>
                  <select required disabled={currentAdmin?._id === user?._id} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent disabled:bg-gray-100">
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
                
                {formData.role === 'ADMIN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Role Group *</label>
                    <select required={formData.role === 'ADMIN'} value={formData.customRole} onChange={(e) => setFormData({...formData, customRole: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent">
                      <option value="">Select a role group...</option>
                      {roles.map(role => (
                        <option key={role._id} value={role._id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
                <input type="checkbox" id="isActive" disabled={currentAdmin?._id === user?._id} checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50" />
                <label htmlFor="isActive" className={`ml-2 text-sm font-medium ${currentAdmin?._id === user?._id ? 'text-gray-400' : 'text-gray-700'}`}>Account Active (Can Login)</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-supporting rounded-sm text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-sm text-sm font-semibold uppercase tracking-widest flex items-center disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
