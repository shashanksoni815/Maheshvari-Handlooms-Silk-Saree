import { useState, useEffect } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import api from '../../services/api';
import { AdminDataTable } from '../../components/admin/AdminDataTable';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: 'Admin',
    isPublished: false,
    image: ''
  });
  
  const { confirm } = useConfirmation();

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/blogs'); // We can fetch from public or admin
      setBlogs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openModal = (blog: any = null) => {
    setCurrentBlog(blog);
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        author: blog.author,
        isPublished: blog.isPublished,
        image: blog.image || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: '',
        author: 'Admin',
        isPublished: false,
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentBlog) {
        await api.put(`/admin/blog/${currentBlog._id}`, formData);
      } else {
        await api.post('/admin/blog', formData);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (blog: any) => {
    confirm({
      title: 'Delete Journal Post',
      message: `Are you sure you want to delete "${blog.title}"?`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/blog/${blog._id}`);
          fetchBlogs();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete blog');
        }
      }
    });
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Title',
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          {row.image && <img src={row.image} alt={row.title} className="w-12 h-12 object-cover rounded" />}
          <div>
            <div className="font-semibold text-primary">{row.title}</div>
            <div className="text-xs text-muted">By {row.author} • {new Date(row.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (row: any) => row.category
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          row.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.isPublished ? 'Published' : 'Draft'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Blog / Journal</h2>
          <p className="text-sm text-muted mt-1">Manage articles and journal posts</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Write Post
        </button>
      </div>

      <AdminDataTable
        data={filteredBlogs}
        columns={columns}
        totalCount={filteredBlogs.length}
        currentPage={1}
        pageSize={50}
        onPageChange={() => {}}
        onSearch={setSearchTerm}
        onEdit={openModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchPlaceholder="Search journal entries..."
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-primary">{currentBlog ? 'Edit Journal Post' : 'New Journal Post'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input required type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown supported) *</label>
                <textarea required rows={8} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent resize-y"></textarea>
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="isPublished" className="ml-2 text-sm font-medium text-gray-700">Published</label>
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
