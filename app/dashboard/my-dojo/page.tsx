'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, MapPin, Phone, Mail, Globe, Edit2, Save, X, Plus } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function MyDojoPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [dojo, setDojo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

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
      if (data.user.role !== 'dojo_owner') {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);
      await fetchDojo(data.user.id);
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchDojo = async (userId?: string) => {
    try {
      const res = await fetch('/api/dojos/my-dojos');
      if (res.ok) {
        const data = await res.json();
        // Get the first dojo (or you could handle multiple dojos)
        if (data.dojos && data.dojos.length > 0) {
          setDojo(data.dojos[0]);
          setFormData(data.dojos[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching dojo:', error);
    }
  };

  const handleCreateNew = () => {
    setCreating(true);
    setFormData({
      name: '',
      description: '',
      martialArts: [],
      address: '',
      city: '',
      country: 'India',
      phoneNumber: '',
      email: user?.email || '',
      website: '',
    });
  };

  const handleCancelCreate = () => {
    setCreating(false);
    setFormData({});
  };

  const handleCreateDojo = async () => {
    // Validation
    if (!formData.name || !formData.description || !formData.address || !formData.city || !formData.phoneNumber || !formData.email) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/dojos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          martialArts: formData.martialArts || [],
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setDojo(data.dojo);
        setCreating(false);
        showToast('Dojo created successfully! Awaiting admin approval.', 'success');
        await fetchDojo();
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to create dojo', 'error');
      }
    } catch (error) {
      console.error('Error creating dojo:', error);
      showToast('Failed to create dojo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setFormData({ ...dojo });
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ ...dojo });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name || !formData.description || !formData.address || !formData.city || !formData.phoneNumber || !formData.email) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      // Prepare data for update
      const updatePayload = {
        id: dojo.id,
        name: formData.name,
        description: formData.description,
        martialArts: formData.martialArts || [],
        address: formData.address,
        city: formData.city,
        country: formData.country || 'India',
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        website: formData.website || '',
      };

      const res = await fetch('/api/dojos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setDojo(data.dojo);
        setEditing(false);
        showToast('Dojo updated successfully', 'success');
      } else {
        console.error('Failed to update dojo:', data);
        showToast(data.error || 'Failed to update dojo', 'error');
      }
    } catch (error) {
      console.error('Error saving dojo:', error);
      showToast('Failed to update dojo. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
      </div>
    );
  }

  if (!dojo && !creating) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Dojo Found</h2>
            <p className="text-gray-600 mb-6">
              You don't have a dojo associated with your account yet.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your Dojo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (creating) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Your Dojo</h2>
              <button
                onClick={handleCancelCreate}
                disabled={saving}
                className="text-gray-600 hover:text-gray-900 transition disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dojo Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter dojo name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Describe your dojo and what makes it unique"
                  required
                />
              </div>

              {/* Martial Arts (comma-separated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Martial Arts Styles
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.martialArts) ? formData.martialArts.join(', ') : ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    martialArts: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="e.g., Karate, Judo, Taekwondo"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple styles with commas</p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Street address"
                  required
                />
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="India"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="contact@dojo.com"
                    required
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="https://yourdojo.com"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={handleCancelCreate}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDojo}
                  disabled={saving}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-semibold"
                >
                  {saving ? 'Creating...' : 'Create Dojo'}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Your dojo will be submitted for admin approval before appearing publicly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Approval Status Banner */}
          {!dojo.isApproved && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⏳ Pending Approval:</strong> Your dojo is awaiting admin approval before it appears publicly on the platform.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building className="w-8 h-8 text-gray-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    dojo.name
                  )}
                </h1>
                <p className="text-gray-600 mt-1">
                  {editing && Array.isArray(formData.martialArts) && formData.martialArts.length > 0 
                    ? formData.martialArts.join(', ')
                    : (Array.isArray(dojo.martialArts) && dojo.martialArts.length > 0 
                      ? dojo.martialArts.join(', ') 
                      : 'No martial arts styles specified')}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dojo Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dojo Information</h2>
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              {editing ? (
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-gray-600">{dojo.description || 'No description available'}</p>
              )}
            </div>

            {/* Martial Arts */}
            {editing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Martial Arts Styles
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.martialArts) ? formData.martialArts.join(', ') : ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    martialArts: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Karate, Judo, Taekwondo"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple styles with commas</p>
              </div>
            )}

            {/* Location */}
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {editing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Street address"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600">{dojo.address}</p>
                    <p className="text-gray-600 text-sm">{dojo.city}, {dojo.country}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-600">{dojo.email}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-600">{dojo.phoneNumber || 'Not provided'}</p>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                {editing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="https://"
                  />
                ) : (
                  <p className="text-gray-600">
                    {dojo.website ? (
                      <a
                        href={dojo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:underline"
                      >
                        {dojo.website}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Approval Status</div>
            <div className="text-2xl font-bold">
              {dojo.isApproved ? (
                <span className="text-green-600">✓ Approved</span>
              ) : (
                <span className="text-yellow-600">⏳ Pending</span>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Created</div>
            <div className="text-lg font-bold text-gray-900">
              {dojo.createdAt ? new Date(dojo.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

