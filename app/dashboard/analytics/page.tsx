'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, TrendingUp, Users, Trophy, DollarSign, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
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
      if (data.user.role !== 'dojo_owner' && data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BarChart className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Track your dojo's performance</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">248</div>
            <div className="text-sm text-gray-600">Total Students</div>
            <div className="text-xs text-gray-500 mt-1">+28 this month</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">$12,450</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
            <div className="text-xs text-gray-500 mt-1">+$920 from last month</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">92%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
            <div className="text-xs text-gray-500 mt-1">Above average</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +3
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-600">Active Tournaments</div>
            <div className="text-xs text-gray-500 mt-1">3 upcoming</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Student Growth Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Growth</h2>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[42, 55, 58, 63, 70, 75, 80, 85, 92, 98, 105, 112].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gray-900 rounded-t hover:bg-black transition cursor-pointer"
                    style={{ height: `${(value / 112) * 100}%` }}
                    title={`${value} students`}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[8200, 9100, 9500, 10200, 10800, 11200, 11500, 11900, 12100, 12300, 12400, 12450].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-600 rounded-t hover:bg-green-700 transition cursor-pointer"
                    style={{ height: `${(value / 12450) * 100}%` }}
                    title={`$${value}`}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Belt Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Belt Distribution</h2>
            <div className="space-y-3">
              {[
                { rank: 'Black Belt', count: 15, color: 'bg-gray-900' },
                { rank: 'Brown Belt', count: 22, color: 'bg-amber-800' },
                { rank: 'Blue Belt', count: 38, color: 'bg-blue-600' },
                { rank: 'Green Belt', count: 45, color: 'bg-green-600' },
                { rank: 'Yellow Belt', count: 58, color: 'bg-yellow-500' },
                { rank: 'White Belt', count: 70, color: 'bg-gray-300' },
              ].map((belt, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{belt.rank}</span>
                    <span className="text-gray-900 font-semibold">{belt.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${belt.color} h-2 rounded-full`}
                      style={{ width: `${(belt.count / 248) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Popularity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Classes</h2>
            <div className="space-y-4">
              {[
                { name: 'Kids Karate', students: 65, capacity: 70 },
                { name: 'Beginner Adults', students: 48, capacity: 50 },
                { name: 'Advanced Kumite', students: 35, capacity: 40 },
                { name: 'Kata Practice', students: 42, capacity: 45 },
                { name: 'Weekend Warriors', students: 38, capacity: 50 },
              ].map((classItem, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{classItem.name}</span>
                    <span className="text-gray-600">
                      {classItem.students}/{classItem.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(classItem.students / classItem.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
            <div className="space-y-4">
              {[
                { student: 'John Smith', achievement: 'Black Belt', date: '2026-01-20' },
                { student: 'Sarah Lee', achievement: '1st Place - State Championship', date: '2026-01-18' },
                { student: 'Mike Johnson', achievement: 'Brown Belt', date: '2026-01-15' },
                { student: 'Emily Davis', achievement: '2nd Place - Regional', date: '2026-01-12' },
                { student: 'David Wilson', achievement: 'Blue Belt', date: '2026-01-10' },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.student}</div>
                    <div className="text-xs text-gray-600">{item.achievement}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

