import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Minus, FileText } from 'lucide-react';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useAuthStore } from '../../store/authStore';

export const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adjustment, setAdjustment] = useState({ type: 'INCREASE', quantity: 0, reason: '' });
  
  const { user } = useAuthStore();

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/products');
      // Handle both paginated and non-paginated responses
      const data = response.data.data;
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openModal = (product: any) => {
    setCurrentProduct(product);
    setAdjustment({ type: 'INCREASE', quantity: 0, reason: '' });
    setIsModalOpen(true);
  };

  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || adjustment.quantity <= 0) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/admin/inventory/adjust', {
        productId: currentProduct._id,
        sku: currentProduct.sku,
        type: adjustment.type,
        quantity: adjustment.quantity,
        reason: adjustment.reason,
        adminId: user?._id
      });
      setIsModalOpen(false);
      fetchInventory();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to adjust inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Product',
      accessor: (row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-sm bg-supporting overflow-hidden flex-shrink-0">
            {row.images && row.images[0] && <img src={row.images[0]} alt={row.name} className="w-full h-full object-cover" />}
          </div>
          <div>
            <div className="font-semibold text-primary">{row.name}</div>
            <div className="text-xs text-muted">SKU: {row.sku}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Price',
      accessor: (row: any) => `₹${row.price.toLocaleString()}`
    },
    {
      header: 'Current Stock',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.stock > 10 ? 'bg-green-100 text-green-800' :
          row.stock > 0 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.stock} Units
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <button 
          onClick={() => openModal(row)}
          className="text-accent hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold"
        >
          <FileText className="w-4 h-4" /> Adjust
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Inventory Management</h2>
          <p className="text-sm text-muted mt-1">Track and adjust product stock</p>
        </div>
      </div>

      <AdminDataTable
        data={filteredProducts}
        columns={columns}
        totalCount={filteredProducts.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        isLoading={isLoading}
        searchPlaceholder="Search inventory by name or SKU..."
      />

      {isModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-serif font-bold text-primary">Adjust Stock</h3>
              <p className="text-sm text-muted">For {currentProduct.name} (SKU: {currentProduct.sku})</p>
            </div>
            <form onSubmit={handleAdjustmentSubmit} className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-4">Current Stock: <strong className="text-primary text-lg">{currentProduct.stock}</strong></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="type" value="INCREASE" checked={adjustment.type === 'INCREASE'} onChange={(e) => setAdjustment({...adjustment, type: e.target.value})} className="text-primary focus:ring-primary" />
                    <span><Plus className="w-4 h-4 inline text-green-600" /> Add Stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="type" value="DECREASE" checked={adjustment.type === 'DECREASE'} onChange={(e) => setAdjustment({...adjustment, type: e.target.value})} className="text-primary focus:ring-primary" />
                    <span><Minus className="w-4 h-4 inline text-red-600" /> Remove Stock</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input required type="number" min="1" value={adjustment.quantity || ''} onChange={(e) => setAdjustment({...adjustment, quantity: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Adjustment *</label>
                <input required type="text" placeholder="e.g. New Shipment, Damaged Goods" value={adjustment.reason} onChange={(e) => setAdjustment({...adjustment, reason: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-supporting rounded-sm text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting || adjustment.quantity <= 0} className="px-4 py-2 bg-primary text-white rounded-sm text-sm font-semibold uppercase tracking-widest disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
