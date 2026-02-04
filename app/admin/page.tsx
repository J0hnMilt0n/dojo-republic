'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Building, Trophy, Award, ShoppingBag, BarChart,
  CheckCircle, XCircle, Clock, TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    pendingDojos: 0,
    pendingTournaments: 0,
    pendingAchievements: 0,
    pendingSellers: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
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
      
      if (data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(data.user);
      await fetchStats();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and oversee Dojo Republic</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Clock className="w-8 h-8 text-orange-600" />}
            title="Pending Dojos"
            value={stats.pendingDojos}
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<Clock className="w-8 h-8 text-blue-600" />}
            title="Pending Tournaments"
            value={stats.pendingTournaments}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Clock className="w-8 h-8 text-yellow-600" />}
            title="Pending Achievements"
            value={stats.pendingAchievements}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<Clock className="w-8 h-8 text-purple-600" />}
            title="Pending Sellers"
            value={stats.pendingSellers}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ManagementCard
            icon={<Building className="w-8 h-8 text-gray-900" />}
            title="Manage Dojos"
            description="Review and approve dojo listings"
            link="/admin/dojos"
            pendingCount={stats.pendingDojos}
          />
          <ManagementCard
            icon={<Trophy className="w-8 h-8 text-orange-600" />}
            title="Manage Tournaments"
            description="Review and approve tournaments"
            link="/admin/tournaments"
            pendingCount={stats.pendingTournaments}
          />
          <ManagementCard
            icon={<Award className="w-8 h-8 text-yellow-600" />}
            title="Manage Achievements"
            description="Review player achievements"
            link="/admin/achievements"
            pendingCount={stats.pendingAchievements}
          />
          <ManagementCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Manage Users"
            description="View and manage all users"
            link="/admin/users"
          />
          <ManagementCard
            icon={<ShoppingBag className="w-8 h-8 text-purple-600" />}
            title="Marketplace"
            description="Manage sellers and products"
            link="/admin/marketplace"
            pendingCount={stats.pendingSellers}
          />
          <ManagementCard
            icon={<BarChart className="w-8 h-8 text-green-600" />}
            title="Analytics"
            description="View platform statistics"
            link="/admin/analytics"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
      </div>
    </div>
  );
}

function ManagementCard({
  icon,
  title,
  description,
  link,
  pendingCount,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  pendingCount?: number;
}) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 cursor-pointer relative">
        {pendingCount !== undefined && pendingCount > 0 && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {pendingCount}
          </div>
        )}
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
