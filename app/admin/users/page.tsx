'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Search,
  Filter,
  Trash2
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function AdminUsersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any>(null);

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
      await fetchUsers();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } else {
        const error = await res.json();
        console.error('Failed to fetch users:', error);
        showToast(error.error || 'Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast('Error loading users', 'error');
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isApproved: true }),
      });
      if (res.ok) {
        showToast('User approved successfully', 'success');
        await fetchUsers();
      } else {
        showToast('Failed to approve user', 'error');
      }
    } catch (error) {
      console.error('Failed to approve user:', error);
      showToast('Error approving user', 'error');
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isApproved: false }),
      });
      if (res.ok) {
        showToast('User rejected', 'info');
        await fetchUsers();
      } else {
        showToast('Failed to reject user', 'error');
      }
    } catch (error) {
      console.error('Failed to reject user:', error);
      showToast('Error rejecting user', 'error');
    }
  };

  const handleDeleteUser = (usr: any) => {
    setDeletingUser(usr);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    
    try {
      const res = await fetch(`/api/admin/users?userId=${deletingUser.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('User deleted successfully', 'success');
        setShowDeleteModal(false);
        setDeletingUser(null);
        await fetchUsers();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error deleting user', 'error');
    }
  };

  useEffect(() => {
    let filtered = users;

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gray-900 text-white';
      case 'dojo_owner': return 'bg-purple-100 text-purple-800';
      case 'coach': return 'bg-blue-100 text-blue-800';
      case 'player': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-yellow-100 text-yellow-800';
      case 'referee': return 'bg-indigo-100 text-indigo-800';
      case 'judge': return 'bg-pink-100 text-pink-800';
      case 'seller': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">View and manage all platform users</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="dojo_owner">Dojo Owner</option>
                <option value="coach">Coach</option>
                <option value="player">Player</option>
                <option value="parent">Parent</option>
                <option value="referee">Referee</option>
                <option value="judge">Judge</option>
                <option value="seller">Seller</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No users found</p>
              <p className="mt-2 text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{usr.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-600 mb-1">
                            <Mail className="w-3 h-3 mr-1" />
                            <span className="text-xs">{usr.email}</span>
                          </div>
                          {usr.phoneNumber && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-3 h-3 mr-1" />
                              <span className="text-xs">{usr.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(usr.role)}`}>
                          {usr.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {usr.isApproved ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(usr.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {!usr.isApproved ? (
                            <>
                              <button
                                onClick={() => handleApproveUser(usr.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectUser(usr.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </button>
                            </>
                          ) : null}
                          {usr.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(usr)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                              title="Delete User"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete User
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">{deletingUser.name}</span> ({deletingUser.email})? 
                This action cannot be undone and will permanently remove all associated data.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingUser(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

