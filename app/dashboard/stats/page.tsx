'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Trophy, Calendar, Target, Award, Users, Clock } from 'lucide-react';

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
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

  // Mock stats data
  const trainingHours = [
    { month: 'Jan', hours: 18 },
    { month: 'Feb', hours: 22 },
    { month: 'Mar', hours: 20 },
    { month: 'Apr', hours: 25 },
    { month: 'May', hours: 28 },
    { month: 'Jun', hours: 24 },
  ];

  const tournamentStats = {
    participated: 12,
    won: 5,
    winRate: 42,
    medals: {
      gold: 5,
      silver: 4,
      bronze: 3,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Statistics</h1>
              <p className="text-gray-600 mt-1">Track your training and tournament performance</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">137h</div>
            <div className="text-sm text-gray-600 mt-1">Total Training Hours</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +3
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{tournamentStats.participated}</div>
            <div className="text-sm text-gray-600 mt-1">Tournaments</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-yellow-600 text-sm font-semibold">
                {tournamentStats.winRate}%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{tournamentStats.won}</div>
            <div className="text-sm text-gray-600 mt-1">Wins</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 text-sm font-semibold">2nd Dan</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">Black Belt</div>
            <div className="text-sm text-gray-600 mt-1">Current Rank</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Training Hours Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Hours (Last 6 Months)</h2>
            <div className="h-64 flex items-end justify-between space-x-2">
              {trainingHours.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-gradient-to-t from-gray-900 to-gray-700 rounded-t hover:from-black hover:to-gray-900 transition cursor-pointer"
                      style={{ height: `${(item.hours / 30) * 200}px` }}
                      title={`${item.hours} hours`}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-900">
                        {item.hours}h
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{item.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Medal Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tournament Medals</h2>
            <div className="space-y-6 pt-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Gold</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{tournamentStats.medals.gold}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{ width: `${(tournamentStats.medals.gold / 12) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Silver</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{tournamentStats.medals.silver}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gray-400 h-3 rounded-full"
                    style={{ width: `${(tournamentStats.medals.silver / 12) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Bronze</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{tournamentStats.medals.bronze}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-600 h-3 rounded-full"
                    style={{ width: `${(tournamentStats.medals.bronze / 12) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Medals</span>
                <span className="text-2xl font-bold text-gray-900">
                  {tournamentStats.medals.gold + tournamentStats.medals.silver + tournamentStats.medals.bronze}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Training Session</h3>
                <p className="text-sm text-gray-600">Completed advanced kata practice - 2 hours</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Tournament Win</h3>
                <p className="text-sm text-gray-600">Won gold medal at Regional Championship</p>
                <p className="text-xs text-gray-500 mt-1">1 week ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Achievement Unlocked</h3>
                <p className="text-sm text-gray-600">Earned "Perfect Attendance" badge</p>
                <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Sparring Session</h3>
                <p className="text-sm text-gray-600">Practiced kumite with senior students</p>
                <p className="text-xs text-gray-500 mt-1">3 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
