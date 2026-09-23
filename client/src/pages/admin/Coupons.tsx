import React, { useState, useEffect } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const Coupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minPurchaseAmount: 0,
    expiryDate: '',
    isActive: true
  });
  
  const { confirm } = useConfirmation();

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/coupons');
      setCoupons(response.data.data);
    } catch (error) {
      console.error('Failed to fetch coupons', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openModal = (coupon: any = null) => {
    setCurrentCoupon(coupon);
    if (coupon) {
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchaseAmount: coupon.minPurchaseAmount || 0,
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
        isActive: coupon.isActive ?? true
      });
    } else {
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minPurchaseAmount: 0,
        expiryDate: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentCoupon) {
        await api.put(`/admin/coupons/${currentCoupon._id}`, formData);
      } else {
        await api.post('/admin/coupons', formData);
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (coupon: any) => {
    confirm({
      title: 'Delete Coupon',
      message: `Are you sure you want to delete coupon ${coupon.code}?`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/coupons/${coupon._id}`);
          fetchCoupons();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete coupon');
        }
      }
    });
  };

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const columns = [
    {
      header: 'Code',
      accessor: (row: any) => <span className="font-bold text-primary text-base font-mono">{row.code}</span>
    },
    {
      header: 'Discount',
      accessor: (row: any) => (
        <span className="font-medium text-secondary">
          {row.discountType === 'PERCENTAGE' ? `${row.discountValue}% OFF` : `₹${row.discountValue} OFF`}
        </span>
      )
    },
    {
      header: 'Min Purchase',
      accessor: (row: any) => `₹${row.minPurchaseAmount || 0}`
    },
    {
      header: 'Expires',
      accessor: (row: any) => (
        <span className={new Date(row.expiryDate) < new Date() ? 'text-red-500 font-medium' : 'text-gray-600'}>
          {new Date(row.expiryDate).toLocaleDateString('en-IN')}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row: any) => {
        const isExpired = new Date(row.expiryDate) < new Date();
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            !row.isActive ? 'bg-gray-100 text-gray-800' :
            isExpired ? 'bg-red-100 text-red-800' : 
            'bg-green-100 text-green-800'
          }`}>
            {!row.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active'}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Coupons & Offers</h2>
          <p className="text-sm text-muted mt-1">Manage promotional discount codes</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Coupon
        </button>
      </div>

      <AdminDataTable
        data={filteredCoupons}
        columns={columns}
        totalCount={filteredCoupons.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        onEdit={openModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchPlaceholder="Search coupons by code..."
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-primary">{currentCoupon ? 'Edit Coupon' : 'New Coupon'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input required type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent uppercase font-mono font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                  <select required value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                  <input required type="number" min="1" value={formData.discountValue || ''} onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Purchase (₹)</label>
                  <input type="number" min="0" value={formData.minPurchaseAmount || ''} onChange={(e) => setFormData({...formData, minPurchaseAmount: Number(e.target.value)})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                  <input required type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">Active</label>
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
