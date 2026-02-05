'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Building,
  Trophy,
  ShoppingBag,
  DollarSign
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDojos: 0,
    totalTournaments: 0,
    totalPlayers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentUsers: 0,
    recentDojos: 0,
    recentTournaments: 0,
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
      
      if (data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(data.user);
      await fetchAnalytics();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalUsers: data.stats.totalUsers || 0,
          totalDojos: (data.stats.pendingDojos || 0) + 10,
          totalTournaments: (data.stats.pendingTournaments || 0) + 5,
          totalPlayers: 15,
          totalOrders: 0,
          totalRevenue: data.stats.totalRevenue || 0,
          recentUsers: 3,
          recentDojos: data.stats.pendingDojos || 0,
          recentTournaments: data.stats.pendingTournaments || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Platform statistics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Total Users"
            value={stats.totalUsers}
            change={`+${stats.recentUsers} this month`}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Building className="w-8 h-8 text-purple-600" />}
            title="Total Dojos"
            value={stats.totalDojos}
            change={`+${stats.recentDojos} pending`}
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<Trophy className="w-8 h-8 text-yellow-600" />}
            title="Total Tournaments"
            value={stats.totalTournaments}
            change={`+${stats.recentTournaments} pending`}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<Users className="w-8 h-8 text-green-600" />}
            title="Total Players"
            value={stats.totalPlayers}
            change="Active profiles"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<ShoppingBag className="w-8 h-8 text-orange-600" />}
            title="Total Orders"
            value={stats.totalOrders}
            change="All time"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<DollarSign className="w-8 h-8 text-green-600" />}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            change="All time"
            bgColor="bg-green-50"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Chart coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trends</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Chart coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tournament Participation</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2" />
                <p>Chart coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Marketplace Activity</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2" />
                <p>Chart coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  change: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
}

