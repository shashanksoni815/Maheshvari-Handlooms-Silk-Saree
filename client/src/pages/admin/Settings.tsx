import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../../services/api';

export const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    STORE_NAME: 'Maheshwari Handloom',
    CONTACT_EMAIL: 'support@maheshwari.com',
    CONTACT_PHONE: '+91 9876543210',
    CURRENCY: 'INR',
    TAX_RATE: '18',
    FLAT_SHIPPING_RATE: '100',
    FREE_SHIPPING_THRESHOLD: '5000',
    FACEBOOK_URL: '',
    INSTAGRAM_URL: '',
    TWITTER_URL: '',
    MAINTENANCE_MODE: 'false'
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/settings');
      const fetchedSettings = res.data.data;
      
      // Map to form data
      if (fetchedSettings && fetchedSettings.length > 0) {
        const newFormData = { ...formData };
        fetchedSettings.forEach((setting: any) => {
          if (setting.key in newFormData) {
            (newFormData as any)[setting.key] = setting.value;
          }
        });
        setFormData(newFormData);
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked ? 'true' : 'false' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Transform form data to key-value array
      const settingsArray = Object.entries(formData).map(([key, value]) => ({
        key,
        value: String(value),
        type: key === 'MAINTENANCE_MODE' ? 'BOOLEAN' : (key.includes('RATE') || key.includes('THRESHOLD') ? 'NUMBER' : 'STRING')
      }));

      await api.post('/admin/settings', { settings: settingsArray });
      alert('Settings saved successfully!');
      fetchSettings();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">Store Settings</h2>
          <p className="text-sm text-muted mt-1">Manage global configuration for your store</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center shadow-md disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* General Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-md shadow-sm border border-supporting p-6">
            <h3 className="text-lg font-serif text-primary border-b border-gray-100 pb-3 mb-5">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <input 
                  type="text" 
                  name="STORE_NAME"
                  value={formData.STORE_NAME} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input 
                  type="email" 
                  name="CONTACT_EMAIL"
                  value={formData.CONTACT_EMAIL} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input 
                  type="text" 
                  name="CONTACT_PHONE"
                  value={formData.CONTACT_PHONE} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm border border-supporting p-6">
            <h3 className="text-lg font-serif text-primary border-b border-gray-100 pb-3 mb-5">Tax & Shipping</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                <select 
                  name="CURRENCY"
                  value={formData.CURRENCY} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate (%)</label>
                <input 
                  type="number" 
                  name="TAX_RATE"
                  value={formData.TAX_RATE} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Flat Shipping Rate</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input 
                    type="number" 
                    name="FLAT_SHIPPING_RATE"
                    value={formData.FLAT_SHIPPING_RATE} 
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input 
                    type="number" 
                    name="FREE_SHIPPING_THRESHOLD"
                    value={formData.FREE_SHIPPING_THRESHOLD} 
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Maintenance */}
        <div className="space-y-8">
          <div className="bg-white rounded-md shadow-sm border border-supporting p-6">
            <h3 className="text-lg font-serif text-primary border-b border-gray-100 pb-3 mb-5">System Status</h3>
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-sm">
              <div>
                <p className="font-semibold text-orange-800">Maintenance Mode</p>
                <p className="text-xs text-orange-600 mt-1">Disables storefront access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="MAINTENANCE_MODE"
                  checked={formData.MAINTENANCE_MODE === 'true'} 
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm border border-supporting p-6">
            <h3 className="text-lg font-serif text-primary border-b border-gray-100 pb-3 mb-5">Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Instagram</label>
                <input 
                  type="url" 
                  name="INSTAGRAM_URL"
                  value={formData.INSTAGRAM_URL} 
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 text-sm border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Facebook</label>
                <input 
                  type="url" 
                  name="FACEBOOK_URL"
                  value={formData.FACEBOOK_URL} 
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 text-sm border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Twitter</label>
                <input 
                  type="url" 
                  name="TWITTER_URL"
                  value={formData.TWITTER_URL} 
                  onChange={handleChange}
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-2 text-sm border border-supporting rounded-sm focus:ring-1 focus:ring-accent" 
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
