'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, User, Store, CreditCard, Bell } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    businessName: '',
    description: '',
    address: '',
    phoneNumber: '',
    email: '',
    commissionRate: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      if (data.user.role !== 'seller' && data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);
      await fetchStoreSettings();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreSettings = async () => {
    try {
      // Note: You'll need to create this API endpoint
      const res = await fetch('/api/sellers/me');
      if (res.ok) {
        const data = await res.json();
        if (data.seller) {
          setStoreSettings({
            businessName: data.seller.businessName || '',
            description: data.seller.description || '',
            address: data.seller.address || '',
            phoneNumber: data.seller.phoneNumber || '',
            email: data.seller.email || '',
            commissionRate: data.seller.commissionRate?.toString() || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!storeSettings.businessName || !storeSettings.email) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/sellers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeSettings),
      });

      if (res.ok) {
        showToast('Settings updated successfully', 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update settings', 'error');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast('Error updating settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Settings className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your store information and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Store className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={storeSettings.businessName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Enter your business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={storeSettings.description}
                  onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Tell customers about your business"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={storeSettings.address}
                  onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Enter your business address"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={storeSettings.phoneNumber}
                  onChange={(e) => setStoreSettings({ ...storeSettings, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  value={storeSettings.commissionRate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, commissionRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                  placeholder="10"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Commission rate is set by platform administrators
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Order Notifications</div>
                  <div className="text-sm text-gray-500">Receive notifications for new orders</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Low Stock Alerts</div>
                  <div className="text-sm text-gray-500">Get notified when products are low on stock</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Promotional Emails</div>
                  <div className="text-sm text-gray-500">Receive emails about platform updates and tips</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
