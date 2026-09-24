import { useState, useEffect } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const Banners = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    mobileImage: '',
    link: '',
    position: 'HOME_HERO',
    sortOrder: 0,
    isActive: true
  });
  
  const { confirm } = useConfirmation();

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/banners');
      setBanners(response.data.data);
    } catch (error) {
      console.error('Failed to fetch banners', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openModal = (banner: any = null) => {
    setCurrentBanner(banner);
    if (banner) {
      setFormData({
        title: banner.title,
        image: banner.image,
        mobileImage: banner.mobileImage || '',
        link: banner.link,
        position: banner.position,
        sortOrder: banner.sortOrder || 0,
        isActive: banner.isActive
      });
    } else {
      setFormData({
        title: '',
        image: '',
        mobileImage: '',
        link: '',
        position: 'HOME_HERO',
        sortOrder: 0,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentBanner) {
        await api.put(`/admin/banners/${currentBanner._id}`, formData);
      } else {
        await api.post('/admin/banners', formData);
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (banner: any) => {
    confirm({
      title: 'Delete Banner',
      message: `Are you sure you want to delete "${banner.title}"?`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/banners/${banner._id}`);
          fetchBanners();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete banner');
        }
      }
    });
  };

  const columns = [
    {
      header: 'Banner',
      accessor: (row: any) => (
        <div className="flex items-center gap-4">
          <img src={row.image} alt={row.title} className="w-24 h-12 object-cover rounded shadow-sm border border-gray-200" />
          <div className="font-semibold text-primary">{row.title}</div>
        </div>
      )
    },
    {
      header: 'Position & Link',
      accessor: (row: any) => (
        <div>
          <div className="text-xs font-bold font-mono bg-gray-100 px-2 py-1 rounded inline-block mb-1">{row.position}</div>
          <div className="text-xs text-muted truncate max-w-[200px]" title={row.link}>{row.link}</div>
        </div>
      )
    },
    {
      header: 'Order',
      accessor: (row: any) => row.sortOrder
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
          <h2 className="text-2xl font-serif text-primary">Banners & Promotions</h2>
          <p className="text-sm text-muted mt-1">Manage homepage carousel and promotional banners</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </button>
      </div>

      <AdminDataTable
        data={banners}
        columns={columns}
        totalCount={banners.length}
        currentPage={1}
        pageSize={100}
        onPageChange={() => {}}
        onSearch={() => {}}
        onEdit={openModal}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-primary">{currentBanner ? 'Edit Banner' : 'New Banner'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <select required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent">
                    <option value="HOME_HERO">HOME_HERO</option>
                    <option value="HOME_FABRIC">HOME_FABRIC</option>
                    <option value="CATEGORY_TOP">CATEGORY_TOP</option>
                    <option value="PROMO_BANNER">PROMO_BANNER</option>
                    <option value="NAV_MENU">NAV_MENU</option>
                    <option value="NAV_SILK_WEAVES">NAV_SILK_WEAVES</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL *</label>
                  <input required type="text" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" placeholder="/collections/silk" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desktop Image URL *</label>
                <input required type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-20 object-cover border border-gray-200 rounded" />}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Image URL (Optional)</label>
                <input type="url" value={formData.mobileImage} onChange={(e) => setFormData({...formData, mobileImage: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
                <div className="flex items-center mt-6">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">Active / Visible</label>
                </div>
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
