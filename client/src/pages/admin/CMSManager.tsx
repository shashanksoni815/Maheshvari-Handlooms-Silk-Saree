import React, { useState, useEffect } from 'react';
import { Settings, MapPin, HelpCircle, Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const CMSManager = () => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'stores' | 'settings'>('faqs');
  
  // Data states
  const [faqs, setFaqs] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { confirm } = useConfirmation();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'faqs') {
        const res = await api.get('/admin/cms/faqs');
        setFaqs(res.data.data);
      } else if (activeTab === 'stores') {
        const res = await api.get('/admin/cms/stores');
        setStores(res.data.data);
      } else {
        const res = await api.get('/admin/cms/settings');
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${activeTab}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (entity: any = null) => {
    setCurrentEntity(entity);
    if (activeTab === 'faqs') {
      setFormData(entity ? { ...entity } : { question: '', answer: '', category: 'GENERAL', order: 0, isActive: true });
    } else if (activeTab === 'stores') {
      setFormData(entity ? { ...entity } : { name: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', workingHours: '', isActive: true });
    } else {
      setFormData(entity ? { ...entity } : { key: '', value: '', type: 'STRING', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'settings') {
        // Settings uses PUT for both create and update based on key
        await api.put('/admin/cms/settings', formData);
      } else {
        const endpoint = `/admin/cms/${activeTab}`;
        if (currentEntity) {
          await api.put(`${endpoint}/${currentEntity._id}`, formData);
        } else {
          await api.post(endpoint, formData);
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to save ${activeTab}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (entity: any) => {
    if (activeTab === 'settings') return; // Cannot delete settings directly via API currently
    
    confirm({
      title: `Delete ${activeTab === 'faqs' ? 'FAQ' : 'Store'}`,
      message: `Are you sure you want to delete this ${activeTab === 'faqs' ? 'FAQ' : 'Store'}?`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/cms/${activeTab}/${entity._id}`);
          fetchData();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete');
        }
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Content Management</h2>
          <p className="text-sm text-muted mt-1">Manage FAQs, store locations, and site settings</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Add {activeTab === 'faqs' ? 'FAQ' : activeTab === 'stores' ? 'Store' : 'Setting'}
        </button>
      </div>

      <div className="flex border-b border-supporting">
        <button 
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'faqs' ? 'border-b-2 border-primary text-primary' : 'text-muted hover:text-primary'}`}
        >
          <HelpCircle className="w-4 h-4" /> FAQs
        </button>
        <button 
          onClick={() => setActiveTab('stores')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'stores' ? 'border-b-2 border-primary text-primary' : 'text-muted hover:text-primary'}`}
        >
          <MapPin className="w-4 h-4" /> Store Locations
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'settings' ? 'border-b-2 border-primary text-primary' : 'text-muted hover:text-primary'}`}
        >
          <Settings className="w-4 h-4" /> Global Settings
        </button>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-supporting overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-secondary">
              <thead className="bg-gray-50 border-b border-supporting text-xs uppercase tracking-widest text-primary">
                <tr>
                  {activeTab === 'faqs' && (
                    <>
                      <th className="px-6 py-4">Question</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </>
                  )}
                  {activeTab === 'stores' && (
                    <>
                      <th className="px-6 py-4">Store Name & City</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </>
                  )}
                  {activeTab === 'settings' && (
                    <>
                      <th className="px-6 py-4">Key</th>
                      <th className="px-6 py-4">Value</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTab === 'faqs' && faqs.map(faq => (
                  <tr key={faq._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-primary">{faq.question}</div>
                      <div className="text-xs text-muted truncate max-w-md">{faq.answer}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">{faq.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${faq.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {faq.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(faq)} className="text-secondary hover:text-primary p-1"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(faq)} className="text-secondary hover:text-red-600 p-1 ml-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'stores' && stores.map(store => (
                  <tr key={store._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-primary">{store.name}</div>
                      <div className="text-xs text-muted">{store.city}, {store.state}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{store.phone}</div>
                      <div className="text-muted">{store.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${store.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {store.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(store)} className="text-secondary hover:text-primary p-1"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(store)} className="text-secondary hover:text-red-600 p-1 ml-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'settings' && settings.map(setting => (
                  <tr key={setting._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs font-bold text-primary">{setting.key}</div>
                      {setting.description && <div className="text-[10px] text-muted">{setting.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs truncate max-w-sm font-mono bg-gray-100 px-2 py-1 rounded">{setting.value}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">{setting.type}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(setting)} className="text-secondary hover:text-primary p-1"><Edit2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}

                {(activeTab === 'faqs' && faqs.length === 0) || (activeTab === 'stores' && stores.length === 0) || (activeTab === 'settings' && settings.length === 0) ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted">
                      No {activeTab} found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-primary">
                {currentEntity ? `Edit ${activeTab.slice(0, -1).toUpperCase()}` : `New ${activeTab.slice(0, -1).toUpperCase()}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {activeTab === 'faqs' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                    <input required type="text" value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                    <textarea required rows={4} value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent">
                        <option value="GENERAL">GENERAL</option>
                        <option value="SHIPPING">SHIPPING</option>
                        <option value="RETURNS">RETURNS</option>
                        <option value="PAYMENT">PAYMENT</option>
                        <option value="PRODUCTS">PRODUCTS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order (Sort priority)</label>
                      <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'stores' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                      <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input required type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input required type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours *</label>
                      <input required type="text" placeholder="e.g. Mon-Sat: 10AM-8PM" value={formData.workingHours} onChange={(e) => setFormData({...formData, workingHours: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'settings' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Setting Key *</label>
                      <input required type="text" disabled={!!currentEntity} value={formData.key} onChange={(e) => setFormData({...formData, key: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent font-mono disabled:bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent">
                        <option value="STRING">STRING</option>
                        <option value="BOOLEAN">BOOLEAN</option>
                        <option value="JSON">JSON</option>
                        <option value="HTML">HTML</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                    <textarea required rows={formData.type === 'HTML' || formData.type === 'JSON' ? 8 : 2} value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" />
                  </div>
                </>
              )}

              {activeTab !== 'settings' && (
                <div className="flex items-center mt-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">Active / Visible</label>
                </div>
              )}

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
