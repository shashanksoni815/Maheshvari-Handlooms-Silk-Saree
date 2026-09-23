import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, UploadCloud, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

export const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    shortDescription: '',
    price: 0,
    mrp: 0,
    stock: 0,
    category: '',
    collection: '',
    status: 'draft',
    images: [] as string[],
    attributes: {
      fabric: '',
      silkType: '',
      weave: '',
      pattern: '',
      color: '',
      zariType: '',
      occasion: '',
      length: '5.5 meters',
      blousePiece: true
    }
  });

  useEffect(() => {
    fetchFormData();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchFormData = async () => {
    try {
      const [catRes, colRes] = await Promise.all([
        api.get('/categories'),
        api.get('/collections')
      ]);
      setCategories(catRes.data.data || []);
      setCollections(colRes.data.data || []);
    } catch (error) {
      console.error('Failed to load form dependencies', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data.data;
      setFormData({
        name: p.name || '',
        slug: p.slug || '',
        sku: p.sku || '',
        description: p.description || '',
        shortDescription: p.shortDescription || '',
        price: p.price || 0,
        mrp: p.mrp || 0,
        stock: p.stock || 0,
        category: p.category?._id || p.category || '',
        collection: p.collections?.[0]?._id || p.collections?.[0] || '',
        status: p.status || 'draft',
        images: p.images || [],
        attributes: {
          fabric: p.attributes?.fabric || '',
          silkType: p.attributes?.silkType || '',
          weave: p.attributes?.weave || '',
          pattern: p.attributes?.pattern || '',
          color: p.attributes?.color || '',
          zariType: p.attributes?.zariType || '',
          occasion: p.attributes?.occasion || '',
          length: p.attributes?.length || '5.5 meters',
          blousePiece: p.attributes?.blousePiece ?? true
        }
      });
    } catch (error) {
      console.error('Failed to load product', error);
      navigate('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('attr_')) {
      const attrName = name.replace('attr_', '');
      let parsedValue: any = value;
      if (type === 'checkbox') parsedValue = (e.target as HTMLInputElement).checked;
      
      setFormData(prev => ({
        ...prev,
        attributes: { ...prev.attributes, [attrName]: parsedValue }
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formDataObj = new FormData();
    Array.from(e.target.files).forEach(file => {
      formDataObj.append('images', file);
    });

    try {
      const res = await api.post('/uploads/multiple', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newUrls = res.data.data.map((img: any) => img.url);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
    } catch (error) {
      console.error('Failed to upload images', error);
      alert('Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload = {
        ...formData,
        collections: formData.collection ? [formData.collection] : [],
      };

      if (isEdit) {
        await api.put(`/admin/products/${id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Failed to save product', error);
      alert(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div>
            <h2 className="text-2xl font-serif text-primary">{isEdit ? 'Edit Product' : 'New Product'}</h2>
            <p className="text-sm text-muted mt-1">{isEdit ? 'Update product details and inventory' : 'Create a new premium silk saree'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-supporting rounded-sm text-sm font-semibold text-primary hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-sm text-sm font-semibold uppercase tracking-widest transition-colors flex items-center shadow-md disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Product
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 space-y-4">
            <h3 className="text-lg font-serif text-primary border-b border-supporting/50 pb-2">Basic Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="Auto-generated if empty" className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 space-y-4">
            <h3 className="text-lg font-serif text-primary border-b border-supporting/50 pb-2">Media</h3>
            
            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-sm overflow-hidden border border-supporting group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] uppercase text-center py-1">Primary</span>}
                </div>
              ))}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-supporting rounded-sm flex flex-col items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                <span className="text-xs mt-2 font-medium">Upload Image</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 space-y-4">
            <h3 className="text-lg font-serif text-primary border-b border-supporting/50 pb-2">Silk Attributes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                <input type="text" name="attr_fabric" value={formData.attributes.fabric} onChange={handleChange} placeholder="e.g. Pure Silk" className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Silk Type</label>
                <input type="text" name="attr_silkType" value={formData.attributes.silkType} onChange={handleChange} placeholder="e.g. Mulberry" className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zari Type</label>
                <input type="text" name="attr_zariType" value={formData.attributes.zariType} onChange={handleChange} placeholder="e.g. Pure Gold Zari" className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input type="text" name="attr_color" value={formData.attributes.color} onChange={handleChange} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              </div>
              <div className="col-span-2 flex items-center mt-4">
                <input type="checkbox" id="blousePiece" name="attr_blousePiece" checked={formData.attributes.blousePiece} onChange={handleChange} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="blousePiece" className="ml-2 text-sm text-gray-700">Includes Blouse Piece</label>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 space-y-4">
            <h3 className="text-lg font-serif text-primary border-b border-supporting/50 pb-2">Status & Organization</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent">
                <option value="active">Active (Published)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent">
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
              <select name="collection" value={formData.collection} onChange={handleChange} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent">
                <option value="">None</option>
                {collections.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50 space-y-4">
            <h3 className="text-lg font-serif text-primary border-b border-supporting/50 pb-2">Pricing & Inventory</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
              <input type="number" min="0" name="mrp" value={formData.mrp} onChange={handleChange} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
              <p className="text-xs text-muted mt-1">Leave 0 if no discount</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
              <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} disabled={isEdit} className={`w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
              {isEdit && <p className="text-xs text-muted mt-1">Manage stock in Inventory module.</p>}
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
