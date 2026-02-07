'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Phone,
  Mail,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { Dojo } from '@/lib/types';
import { useToast } from '@/components/ToastProvider';

export default function AdminDojosPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [dojos, setDojos] = useState<Dojo[]>([]);
  const [filteredDojos, setFilteredDojos] = useState<Dojo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
    dojo: Dojo | null;
  }>({ isOpen: false, type: null, dojo: null });

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
      
      if (data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(data.user);
      await fetchDojos();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchDojos = async () => {
    try {
      const res = await fetch('/api/dojos');
      if (res.ok) {
        const data = await res.json();
        setDojos(data.dojos);
        setFilteredDojos(data.dojos);
      }
    } catch (error) {
      console.error('Failed to fetch dojos:', error);
    }
  };

  useEffect(() => {
    let filtered = dojos;

    // Filter by status
    if (statusFilter === 'pending') {
      filtered = filtered.filter(d => !d.isApproved);
    } else if (statusFilter === 'approved') {
      filtered = filtered.filter(d => d.isApproved);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (dojo) =>
          dojo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dojo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dojo.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDojos(filtered);
  }, [searchTerm, statusFilter, dojos]);

  const openConfirmModal = (type: 'approve' | 'reject', dojo: Dojo) => {
    setConfirmModal({ isOpen: true, type, dojo });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: null, dojo: null });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.dojo) return;

    const isApproving = confirmModal.type === 'approve';
    
    try {
      const res = await fetch(`/api/dojos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: confirmModal.dojo.id, 
          isApproved: isApproving 
        }),
      });

      if (res.ok) {
        showToast(
          isApproving ? 'Dojo approved successfully' : 'Dojo approval revoked', 
          isApproving ? 'success' : 'info'
        );
        await fetchDojos();
      } else {
        showToast(`Failed to ${isApproving ? 'approve' : 'reject'} dojo`, 'error');
      }
    } catch (error) {
      console.error(`Error ${isApproving ? 'approving' : 'rejecting'} dojo:`, error);
      showToast(`Failed to ${isApproving ? 'approve' : 'reject'} dojo`, 'error');
    } finally {
      closeConfirmModal();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  if (!user) return null;

  const pendingDojos = dojos.filter(d => !d.isApproved);
  const approvedDojos = dojos.filter(d => d.isApproved);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.dojo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-[scaleIn_0.2s_ease-out]">
            {/* Icon */}
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              confirmModal.type === 'approve' 
                ? 'bg-green-100' 
                : 'bg-orange-100'
            }`}>
              {confirmModal.type === 'approve' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-600" />
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {confirmModal.type === 'approve' ? 'Approve Dojo?' : 'Revoke Approval?'}
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-4">
              {confirmModal.type === 'approve' 
                ? `Are you sure you want to approve "${confirmModal.dojo.name}"? This will make it visible to all users.`
                : `Are you sure you want to revoke approval for "${confirmModal.dojo.name}"? This will hide it from public view.`
              }
            </p>

            {/* Dojo Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-sm font-medium text-gray-900">{confirmModal.dojo.name}</p>
              <p className="text-xs text-gray-600 mt-1">{confirmModal.dojo.city}, {confirmModal.dojo.country}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {confirmModal.dojo.martialArts.slice(0, 3).map((ma) => (
                  <span key={ma} className="text-xs px-2 py-0.5 bg-white text-gray-600 rounded">
                    {ma}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-2.5 rounded-lg transition font-medium text-white ${
                  confirmModal.type === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {confirmModal.type === 'approve' ? 'Approve' : 'Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Dojos</h1>
          <p className="text-gray-600 mt-1">Review and approve dojo listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Dojos</p>
            <p className="text-3xl font-bold text-gray-900">{dojos.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-orange-600">{pendingDojos.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedDojos.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search dojos by name, city, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dojos List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredDojos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No dojos found</p>
              <p className="mt-2 text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dojo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDojos.map((dojo) => (
                    <tr key={dojo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{dojo.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {dojo.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dojo.martialArts.slice(0, 2).map((ma) => (
                              <span
                                key={ma}
                                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                              >
                                {ma}
                              </span>
                            ))}
                            {dojo.martialArts.length > 2 && (
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                +{dojo.martialArts.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1 mt-0.5 shrink-0" />
                          <div>
                            <p>{dojo.city}</p>
                            <p className="text-gray-500">{dojo.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-600 mb-1">
                            <Phone className="w-3 h-3 mr-1" />
                            <span className="text-xs">{dojo.phoneNumber}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            <span className="text-xs truncate max-w-[150px]">
                              {dojo.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {dojo.isApproved ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/dojos/${dojo.id}`}
                            className="text-gray-600 hover:text-gray-900 transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          
                          {!dojo.isApproved ? (
                            <button
                              onClick={() => openConfirmModal('approve', dojo)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openConfirmModal('reject', dojo)}
                              className="text-orange-600 hover:text-orange-800 transition"
                              title="Revoke Approval"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

