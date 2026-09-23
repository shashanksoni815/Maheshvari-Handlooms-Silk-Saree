import React, { useState, useEffect, useRef } from 'react';
import { Plus, Loader2, UploadCloud, X } from 'lucide-react';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const Collections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', description: '', thumbnail: '', banner: '', isActive: true });
  const [isUploading, setIsUploading] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  const { confirm } = useConfirmation();

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/collections');
      setCollections(response.data.data);
    } catch (error) {
      console.error('Failed to fetch collections', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openModal = (collection: any = null) => {
    setCurrentCollection(collection);
    setFormData({
      name: collection?.name || '',
      description: collection?.description || '',
      thumbnail: collection?.thumbnail || '',
      banner: collection?.banner || '',
      isActive: collection?.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'banner') => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('image', e.target.files[0]);

    try {
      const res = await api.post('/uploads', formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData(prev => ({ ...prev, [field]: res.data.data.url }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentCollection) {
        await api.put(`/admin/collections/${currentCollection._id}`, formData);
      } else {
        await api.post('/admin/collections', formData);
      }
      setIsModalOpen(false);
      fetchCollections();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (collection: any) => {
    confirm({
      title: 'Delete Collection',
      message: `Are you sure you want to delete ${collection.name}? This cannot be undone.`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/collections/${collection._id}`);
          fetchCollections();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete collection');
        }
      }
    });
  };

  const filteredCollections = collections.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const columns = [
    {
      header: 'Collection',
      accessor: (row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-16 h-10 rounded-sm bg-supporting overflow-hidden flex-shrink-0">
            {row.thumbnail && <img src={row.thumbnail} alt={row.name} className="w-full h-full object-cover" />}
          </div>
          <div className="font-semibold text-primary">{row.name}</div>
        </div>
      )
    },
    {
      header: 'Description',
      accessor: (row: any) => (
        <span className="truncate max-w-[200px] inline-block">{row.description}</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs uppercase tracking-wider font-semibold ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Collections Management</h2>
          <p className="text-sm text-muted mt-1">Manage curated collections of products</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Collection
        </button>
      </div>

      <AdminDataTable
        data={filteredCollections}
        columns={columns}
        totalCount={filteredCollections.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        onEdit={openModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchPlaceholder="Search collections..."
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-primary">{currentCollection ? 'Edit Collection' : 'New Collection'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                  <div className="flex flex-col gap-2">
                    {formData.thumbnail && <img src={formData.thumbnail} alt="preview" className="w-full aspect-video object-cover rounded-sm border border-supporting" />}
                    <button type="button" onClick={() => thumbnailInputRef.current?.click()} className="px-3 py-1.5 border border-supporting rounded-sm text-sm font-semibold flex items-center justify-center hover:bg-gray-50">
                      {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                      Upload Thumbnail
                    </button>
                    <input type="file" ref={thumbnailInputRef} onChange={(e) => handleImageUpload(e, 'thumbnail')} accept="image/*" className="hidden" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner</label>
                  <div className="flex flex-col gap-2">
                    {formData.banner && <img src={formData.banner} alt="preview" className="w-full aspect-video object-cover rounded-sm border border-supporting" />}
                    <button type="button" onClick={() => bannerInputRef.current?.click()} className="px-3 py-1.5 border border-supporting rounded-sm text-sm font-semibold flex items-center justify-center hover:bg-gray-50">
                      {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                      Upload Banner
                    </button>
                    <input type="file" ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">Active</label>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-supporting rounded-sm text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-sm text-sm font-semibold uppercase tracking-widest flex items-center disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
