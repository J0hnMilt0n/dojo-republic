'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
  Search,
  Filter
} from 'lucide-react';

export default function AdminAchievementsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');

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
      await fetchAchievements();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/players');
      if (res.ok) {
        const data = await res.json();
        const allAchievements: any[] = [];
        
        data.players.forEach((player: any) => {
          if (player.achievements && player.achievements.length > 0) {
            player.achievements.forEach((achievement: any) => {
              allAchievements.push({
                ...achievement,
                playerName: player.name,
                playerId: player.id,
              });
            });
          }
        });

        setAchievements(allAchievements);
        setFilteredAchievements(allAchievements);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  };

  useEffect(() => {
    let filtered = achievements;

    if (statusFilter === 'pending') {
      filtered = filtered.filter(a => !a.isApproved);
    } else if (statusFilter === 'approved') {
      filtered = filtered.filter(a => a.isApproved);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (achievement) =>
          achievement.playerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.tournamentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAchievements(filtered);
  }, [searchTerm, statusFilter, achievements]);

  const handleApprove = async (achievement: any) => {
    if (!confirm('Are you sure you want to approve this achievement?')) return;

    try {
      const res = await fetch(`/api/players`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          playerId: achievement.playerId,
          achievementId: achievement.id,
          isApproved: true 
        }),
      });

      if (res.ok) {
        alert('Achievement approved successfully');
        await fetchAchievements();
      } else {
        alert('Failed to approve achievement');
      }
    } catch (error) {
      console.error('Error approving achievement:', error);
      alert('Failed to approve achievement');
    }
  };

  const handleReject = async (achievement: any) => {
    if (!confirm('Are you sure you want to reject this achievement?')) return;

    try {
      const res = await fetch(`/api/players`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          playerId: achievement.playerId,
          achievementId: achievement.id,
          isApproved: false 
        }),
      });

      if (res.ok) {
        alert('Achievement rejected');
        await fetchAchievements();
      } else {
        alert('Failed to reject achievement');
      }
    } catch (error) {
      console.error('Error rejecting achievement:', error);
      alert('Failed to reject achievement');
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

  const pendingAchievements = achievements.filter(a => !a.isApproved);
  const approvedAchievements = achievements.filter(a => a.isApproved);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-200 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Achievements</h1>
          <p className="text-gray-600 mt-1">Review and approve player achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Achievements</p>
            <p className="text-3xl font-bold text-gray-900">{achievements.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-orange-600">{pendingAchievements.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedAchievements.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by player, tournament, or category..."
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No achievements found</p>
              <p className="mt-2 text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tournament
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
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
                  {filteredAchievements.map((achievement, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{achievement.playerName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{achievement.tournamentName}</p>
                          <p className="text-xs text-gray-500">
                            {achievement.year}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{achievement.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(achievement.position)}`}>
                          {achievement.position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {achievement.isApproved ? (
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
                          {!achievement.isApproved ? (
                            <button
                              onClick={() => handleApprove(achievement)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReject(achievement)}
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

