import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: { _id: string, name: string } | string;
  price: number;
  stock: number;
  status: string;
  images: { url: string; publicId: string; isPrimary: boolean }[];
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { confirm } = useConfirmation();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/products');
      // Handle both paginated and non-paginated responses
      const data = res.data.data;
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (product: Product) => {
    confirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete ${product.name}? This will archive the product to preserve historical order data.`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/products/${product._id}`);
          fetchProducts();
        } catch (error) {
          console.error('Failed to delete product', error);
        }
      }
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Product',
      accessor: (row: Product) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-sm bg-supporting overflow-hidden flex-shrink-0">
            {row.images && row.images.length > 0 ? (
              <img src={row.images[0].url} alt={row.name} className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div>
            <div className="font-semibold text-primary">{row.name}</div>
            <div className="text-xs text-muted">SKU: {row.sku}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (row: Product) => (
        <span className="text-sm">
          {typeof row.category === 'object' ? row.category?.name : 'N/A'}
        </span>
      )
    },
    {
      header: 'Price',
      accessor: (row: Product) => (
        <span className="font-medium">₹{row.price.toLocaleString()}</span>
      )
    },
    {
      header: 'Stock',
      accessor: (row: Product) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.stock > 10 ? 'bg-green-100 text-green-800' :
          row.stock > 0 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.stock > 0 ? `${row.stock} in stock` : 'Out of stock'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row: Product) => (
        <span className={`px-2 py-1 rounded-full text-xs uppercase tracking-wider font-semibold ${
          row.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
          row.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status || 'Active'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Catalog Management</h2>
          <p className="text-sm text-muted mt-1">Manage your premium silk sarees</p>
        </div>
        <button 
          onClick={() => navigate('/admin/products/new')}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      <AdminDataTable
        data={filteredProducts}
        columns={columns}
        totalCount={filteredProducts.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        onEdit={(row) => navigate(`/admin/products/${row._id}/edit`)}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchPlaceholder="Search products by name or SKU..."
      />
    </div>
  );
};
