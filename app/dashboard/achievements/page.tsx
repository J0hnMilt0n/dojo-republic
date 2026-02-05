'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Trophy, Medal, Star, Target, TrendingUp, Calendar, X } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function AchievementsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    category: 'tournaments',
    earnedDate: new Date().toISOString().split('T')[0],
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
      setUser(data.user);
      loadAchievements();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const loadAchievements = () => {
    // Mock achievements data
    const mockAchievements = [
      {
        id: 1,
        title: 'First Tournament',
        description: 'Participated in your first tournament',
        icon: 'trophy',
        earned: true,
        earnedDate: '2025-11-15',
        category: 'tournaments',
      },
      {
        id: 2,
        title: 'Gold Medalist',
        description: 'Won a gold medal in a tournament',
        icon: 'medal',
        earned: true,
        earnedDate: '2025-12-10',
        category: 'tournaments',
      },
      {
        id: 3,
        title: 'Black Belt',
        description: 'Achieved black belt rank',
        icon: 'award',
        earned: false,
        earnedDate: null,
        category: 'training',
      },
      {
        id: 4,
        title: 'Perfect Attendance',
        description: 'Attended all classes for 3 months',
        icon: 'star',
        earned: true,
        earnedDate: '2026-01-05',
        category: 'training',
      },
      {
        id: 5,
        title: '100 Training Hours',
        description: 'Completed 100 hours of training',
        icon: 'target',
        earned: true,
        earnedDate: '2025-10-20',
        category: 'training',
      },
      {
        id: 6,
        title: 'Tournament Champion',
        description: 'Win a tournament championship',
        icon: 'trophy',
        earned: false,
        earnedDate: null,
        category: 'tournaments',
      },
      {
        id: 7,
        title: 'Rising Star',
        description: 'Promoted 3 belt levels in one year',
        icon: 'trending-up',
        earned: false,
        earnedDate: null,
        category: 'training',
      },
      {
        id: 8,
        title: 'Community Leader',
        description: 'Helped train 10 junior students',
        icon: 'star',
        earned: true,
        earnedDate: '2025-09-12',
        category: 'community',
      },
    ];
    setAchievements(mockAchievements);
  };

  const handleAddAchievement = () => {
    if (!newAchievement.title || !newAchievement.description) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    const achievement = {
      id: achievements.length + 1,
      title: newAchievement.title,
      description: newAchievement.description,
      icon: newAchievement.category === 'tournaments' ? 'trophy' : newAchievement.category === 'training' ? 'award' : 'star',
      earned: true,
      earnedDate: newAchievement.earnedDate,
      category: newAchievement.category,
      userAdded: true, // Mark as user-added so we can delete it
    };

    setAchievements([...achievements, achievement]);
    setShowAddModal(false);
    setNewAchievement({
      title: '',
      description: '',
      category: 'tournaments',
      earnedDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteAchievement = (achievementId: number) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      const updatedAchievements = achievements.filter(a => a.id !== achievementId);
      setAchievements(updatedAchievements);
    }
  };

  const getIcon = (iconName: string, earned: boolean) => {
    const className = `w-8 h-8 ${earned ? 'text-yellow-500' : 'text-gray-400'}`;
    switch (iconName) {
      case 'trophy':
        return <Trophy className={className} />;
      case 'medal':
        return <Medal className={className} />;
      case 'award':
        return <Award className={className} />;
      case 'star':
        return <Star className={className} />;
      case 'target':
        return <Target className={className} />;
      case 'trending-up':
        return <TrendingUp className={className} />;
      default:
        return <Award className={className} />;
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

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const progressPercentage = (earnedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Achievements</h1>
                <p className="text-gray-600 mt-1">Track your progress and milestones</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
            >
              <Trophy className="w-5 h-5" />
              <span>Add Achievement</span>
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Progress</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Achievements Earned</span>
            <span className="text-sm font-semibold text-gray-900">{earnedCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-linear-to-r from-yellow-400 to-yellow-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{earnedCount}</div>
              <div className="text-sm text-gray-600 mt-1">Earned</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{totalCount - earnedCount}</div>
              <div className="text-sm text-gray-600 mt-1">In Progress</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-gray-600 mt-1">Completion</div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-lg shadow-md p-6 transition-all relative ${
                achievement.earned
                  ? 'border-2 border-yellow-400 hover:shadow-xl'
                  : 'border-2 border-gray-200 opacity-75'
              }`}
            >
              {achievement.userAdded && (
                <button
                  onClick={() => handleDeleteAchievement(achievement.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition"
                  title="Delete achievement"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {getIcon(achievement.icon, achievement.earned)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {achievement.description}
                  </p>
                  {achievement.earned ? (
                    <div className="flex items-center space-x-2 text-xs text-green-600">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Earned on {new Date(achievement.earnedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic">Not yet earned</div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  achievement.category === 'tournaments'
                    ? 'bg-blue-100 text-blue-800'
                    : achievement.category === 'training'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {achievement.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Achievement Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Achievement</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Achievement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="What did you achieve?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newAchievement.category}
                    onChange={(e) => setNewAchievement({ ...newAchievement, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="tournaments">Tournaments</option>
                    <option value="training">Training</option>
                    <option value="community">Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Achieved *
                  </label>
                  <input
                    type="date"
                    value={newAchievement.earnedDate}
                    onChange={(e) => setNewAchievement({ ...newAchievement, earnedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAchievement({
                      title: '',
                      description: '',
                      category: 'tournaments',
                      earnedDate: new Date().toISOString().split('T')[0],
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAchievement}
                  className="px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition"
                >
                  Add Achievement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

