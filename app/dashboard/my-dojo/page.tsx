'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, MapPin, Phone, Mail, Globe, Edit2, Save, X } from 'lucide-react';

export default function MyDojoPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dojo, setDojo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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
      await fetchDojo();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchDojo = async () => {
    try {
      const res = await fetch('/api/dojos');
      if (res.ok) {
        const data = await res.json();
        // Find the dojo owned by this user
        const userDojo = data.dojos.find((d: any) => d.ownerId === user?.id || d.contactEmail === user?.email);
        if (userDojo) {
          setDojo(userDojo);
          setFormData(userDojo);
        }
      }
    } catch (error) {
      console.error('Error fetching dojo:', error);
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
    setSaving(true);
    try {
      const res = await fetch('/api/dojos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setDojo(data.dojo);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving dojo:', error);
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

  if (!dojo) {
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
              onClick={() => router.push('/dojos')}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition"
            >
              Register Your Dojo
            </button>
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
                  {editing ? (
                    <input
                      type="text"
                      name="style"
                      value={formData.style || ''}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-1"
                      placeholder="Martial Arts Style"
                    />
                  ) : (
                    dojo.style
                  )}
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

            {/* Location */}
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-600">{dojo.location}</p>
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-600">{dojo.contactEmail}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-600">{dojo.phone || 'Not provided'}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Students</div>
            <div className="text-3xl font-bold text-gray-900">
              {dojo.studentCount || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Rating</div>
            <div className="text-3xl font-bold text-gray-900">
              {dojo.rating || 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className="text-3xl font-bold text-gray-900 capitalize">
              {dojo.status || 'Active'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
