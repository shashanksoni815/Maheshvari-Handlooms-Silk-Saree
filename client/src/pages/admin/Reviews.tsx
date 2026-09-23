import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { confirm } = useConfirmation();

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/reviews');
      setReviews(response.data.data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = (review: any) => {
    const newStatus = !review.isApproved;
    const action = newStatus ? 'Approve' : 'Reject';
    
    confirm({
      title: `${action} Review`,
      message: `Are you sure you want to ${action.toLowerCase()} this review by ${review.user?.firstName}? ${newStatus ? 'It will be visible on the product page.' : 'It will be hidden from the product page.'}`,
      onConfirm: async () => {
        try {
          await api.put(`/admin/reviews/${review._id}/status`, { isApproved: newStatus });
          fetchReviews();
        } catch (error: any) {
          alert(error.response?.data?.message || `Failed to ${action.toLowerCase()} review`);
        }
      }
    });
  };

  const handleDelete = (review: any) => {
    confirm({
      title: 'Delete Review',
      message: `Are you sure you want to completely delete this review? This action is irreversible.`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/reviews/${review._id}`);
          fetchReviews();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete review');
        }
      }
    });
  };

  const filteredReviews = reviews.filter(r => 
    (r.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.product?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.user?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Product',
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          {row.product?.images?.[0] && <img src={row.product.images[0]} alt={row.product.name} className="w-10 h-10 object-cover rounded" />}
          <div className="font-semibold text-primary text-sm max-w-[150px] truncate" title={row.product?.name}>{row.product?.name || 'Unknown Product'}</div>
        </div>
      )
    },
    {
      header: 'Rating & Review',
      accessor: (row: any) => (
        <div className="max-w-xs">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < row.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs font-bold ml-2">{row.title}</span>
          </div>
          <p className="text-xs text-muted truncate" title={row.description}>{row.description}</p>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: (row: any) => (
        <div>
          <div className="text-sm font-medium text-primary">{row.user?.firstName} {row.user?.lastName}</div>
          {row.isVerifiedPurchase && <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center mt-1"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleToggleStatus(row); }}
          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
            row.isApproved ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
          title="Click to toggle status"
        >
          {row.isApproved ? <><CheckCircle className="w-3 h-3" /> Approved</> : <><XCircle className="w-3 h-3" /> Rejected</>}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Review Moderation</h2>
          <p className="text-sm text-muted mt-1">Manage and moderate customer reviews</p>
        </div>
      </div>

      <AdminDataTable
        data={filteredReviews}
        columns={columns}
        totalCount={filteredReviews.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchPlaceholder="Search reviews by product, title, or customer..."
      />
    </div>
  );
};
