'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Award, Calendar, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function ChildrenPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [filteredChildren, setFilteredChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkStudentId, setLinkStudentId] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = children.filter(child =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChildren(filtered);
    } else {
      setFilteredChildren(children);
    }
  }, [searchTerm, children]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      if (data.user.role !== 'parent') {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);
      await fetchChildren();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/students?linkedToMe=true');
      if (res.ok) {
        const data = await res.json();
        setChildren(data.students || []);
        setFilteredChildren(data.students || []);
      } else {
        setChildren([]);
        setFilteredChildren([]);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      setChildren([]);
      setFilteredChildren([]);
    }
  };

  const handleLinkStudent = async () => {
    if (!linkStudentId.trim()) {
      showToast('Please enter a student ID', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/students/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: linkStudentId }),
      });

      if (res.ok) {
        showToast('Student linked successfully', 'success');
        setShowLinkModal(false);
        setLinkStudentId('');
        await fetchChildren();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to link student', 'error');
      }
    } catch (error) {
      console.error('Error linking student:', error);
      showToast('Error linking student', 'error');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
                <p className="text-gray-600 mt-1">
                  Track your children's martial arts journey
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowLinkModal(true)}
              className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
            >
              <UserPlus className="w-5 h-5" />
              <span>Link Student</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Children</div>
            <div className="text-3xl font-bold text-gray-900">{children.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Active Students</div>
            <div className="text-3xl font-bold text-green-600">
              {children.filter(c => c.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Achievements</div>
            <div className="text-3xl font-bold text-yellow-600">
              {children.reduce((sum, c) => sum + (c.achievements?.length || 0), 0)}
            </div>
          </div>
        </div>

        {/* Children List */}
        {filteredChildren.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No children linked yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Link your children's student accounts to track their progress
            </p>
            <button 
              onClick={() => setShowLinkModal(true)}
              className="text-gray-900 hover:text-black font-medium"
            >
              Link a Student Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChildren.map((child, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-32 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {child.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{child.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2 text-yellow-600" />
                      <span>{child.beltLevel || 'White Belt'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{child.age} years old</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-600" />
                      <span>{child.dojoName || 'No dojo assigned'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      child.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {child.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Link Student Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Student Account</h2>
              <p className="text-gray-600 mb-4">
                Enter the student ID provided by your child's dojo to link their account.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID *
                </label>
                <input
                  type="text"
                  value={linkStudentId}
                  onChange={(e) => setLinkStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Enter student ID"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contact your child's dojo if you don't have the student ID
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkStudentId('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLinkStudent}
                  className="px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-black transition"
                >
                  Link Student
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
