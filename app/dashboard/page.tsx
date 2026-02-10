'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Trophy, Building, ShoppingBag, Calendar, 
  Award, ClipboardList, BarChart, Settings, LogOut 
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPlayerProfile, setHasPlayerProfile] = useState(true);

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

      // Check if player has a profile
      if (data.user.role === 'player') {
        const profileRes = await fetch('/api/players');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const hasProfile = profileData.players.some((p: any) => p.userId === data.user.id);
          setHasPlayerProfile(hasProfile);
        }
      }
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.name}
              </h1>
              <p className="text-gray-600 mt-1 capitalize">
                {user.role.replace('_', ' ')} Dashboard
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Player Profile Banner */}
        {user.role === 'player' && !hasPlayerProfile && (
          <div className="bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <Trophy className="w-12 h-12" />
                <div>
                  <h2 className="text-xl font-bold">Complete Your Player Profile</h2>
                  <p className="mt-1 text-red-100">
                    Create your athlete profile to appear on the players page and start showcasing your achievements!
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/create-profile"
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition whitespace-nowrap"
              >
                Create Profile
              </Link>
            </div>
          </div>
        )}

        {/* Role-specific Dashboard */}
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'dojo_owner' && <DojoOwnerDashboard />}
        {user.role === 'player' && <PlayerDashboard />}
        {user.role === 'parent' && <ParentDashboard />}
        {user.role === 'coach' && <CoachDashboard />}
        {user.role === 'seller' && <SellerDashboard />}
        {(user.role === 'student' || user.role === 'referee' || user.role === 'judge') && <GeneralDashboard />}
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        icon={<Building className="w-8 h-8 text-blue-600" />}
        title="Manage Dojos"
        description="Approve and manage dojo listings"
        link="/admin/dojos"
        bgColor="bg-blue-50"
      />
      <DashboardCard
        icon={<Trophy className="w-8 h-8 text-orange-600" />}
        title="Manage Tournaments"
        description="Approve and manage tournaments"
        link="/admin/tournaments"
        bgColor="bg-orange-50"
      />
      <DashboardCard
        icon={<Award className="w-8 h-8 text-yellow-600" />}
        title="Manage Achievements"
        description="Review and approve player achievements"
        link="/admin/achievements"
        bgColor="bg-yellow-50"
      />
      <DashboardCard
        icon={<Users className="w-8 h-8 text-green-600" />}
        title="Manage Users"
        description="View and manage all users"
        link="/admin/users"
        bgColor="bg-green-50"
      />
      <DashboardCard
        icon={<ShoppingBag className="w-8 h-8 text-purple-600" />}
        title="Manage Marketplace"
        description="Approve sellers and products"
        link="/admin/marketplace"
        bgColor="bg-purple-50"
      />
      <DashboardCard
        icon={<BarChart className="w-8 h-8 text-red-600" />}
        title="Analytics"
        description="View platform statistics"
        link="/admin/analytics"
        bgColor="bg-red-50"
      />
    </div>
  );
}

function DojoOwnerDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        icon={<Building className="w-8 h-8 text-gray-900" />}
        title="My Dojo"
        description="Manage your dojo information"
        link="/dashboard/my-dojo"
        bgColor="bg-gray-50"
      />
      <DashboardCard
        icon={<Users className="w-8 h-8 text-blue-600" />}
        title="Students"
        description="Manage enrolled students"
        link="/dashboard/students"
        bgColor="bg-blue-50"
      />
      <DashboardCard
        icon={<ClipboardList className="w-8 h-8 text-green-600" />}
        title="Attendance"
        description="Track student attendance"
        link="/dashboard/attendance"
        bgColor="bg-green-50"
      />
      <DashboardCard
        icon={<Trophy className="w-8 h-8 text-orange-600" />}
        title="Tournaments"
        description="Create and manage tournaments"
        link="/dashboard/tournaments"
        bgColor="bg-orange-50"
      />
      <DashboardCard
        icon={<Calendar className="w-8 h-8 text-purple-600" />}
        title="Schedule"
        description="Manage class schedules"
        link="/dashboard/schedule"
        bgColor="bg-purple-50"
      />
      <DashboardCard
        icon={<BarChart className="w-8 h-8 text-indigo-600" />}
        title="Analytics"
        description="View dojo statistics"
        link="/dashboard/analytics"
        bgColor="bg-indigo-50"
      />
    </div>
  );
}

function PlayerDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        icon={<Award className="w-8 h-8 text-yellow-600" />}
        title="My Profile"
        description="Manage your athlete profile"
        link="/dashboard/profile"
        bgColor="bg-yellow-50"
      />
      <DashboardCard
        icon={<Trophy className="w-8 h-8 text-orange-600" />}
        title="Achievements"
        description="View and add achievements"
        link="/dashboard/achievements"
        bgColor="bg-orange-50"
      />
      <DashboardCard
        icon={<Calendar className="w-8 h-8 text-blue-600" />}
        title="Tournaments"
        description="Browse and register for tournaments"
        link="/tournaments"
        bgColor="bg-blue-50"
      />
      <DashboardCard
        icon={<BarChart className="w-8 h-8 text-green-600" />}
        title="Statistics"
        description="View your performance stats"
        link="/dashboard/stats"
        bgColor="bg-green-50"
      />
    </div>
  );
}

function ParentDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        icon={<Users className="w-8 h-8 text-blue-600" />}
        title="My Children"
        description="Manage linked student accounts"
        link="/dashboard/children"
        bgColor="bg-blue-50"
      />
      <DashboardCard
        icon={<ClipboardList className="w-8 h-8 text-green-600" />}
        title="Attendance"
        description="View children's attendance"
        link="/dashboard/attendance"
        bgColor="bg-green-50"
      />
      <DashboardCard
        icon={<Award className="w-8 h-8 text-yellow-600" />}
        title="Achievements"
        description="View children's achievements"
        link="/dashboard/achievements"
        bgColor="bg-yellow-50"
      />
      <DashboardCard
        icon={<Calendar className="w-8 h-8 text-purple-600" />}
        title="Tournaments"
        description="View tournament participation"
        link="/dashboard/tournaments"
        bgColor="bg-purple-50"
      />
    </div>
  );
}

function CoachDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        icon={<Users className="w-8 h-8 text-blue-600" />}
        title="Students"
        description="Manage your students"
        link="/dashboard/students"
        bgColor="bg-blue-50"
      />
      <DashboardCard
        icon={<Trophy className="w-8 h-8 text-orange-600" />}
        title="Tournaments"
        description="Create and manage tournaments"
        link="/dashboard/tournaments"
        bgColor="bg-orange-50"
      />
      <DashboardCard
        icon={<ClipboardList className="w-8 h-8 text-green-600" />}
        title="Training Sessions"
        description="Schedule and track sessions"
        link="/dashboard/sessions"
        bgColor="bg-green-50"
      />
    </div>
  );
}

function SellerDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        icon={<ShoppingBag className="w-8 h-8 text-purple-600" />}
        title="My Products"
        description="Manage your products"
        link="/dashboard/products"
        bgColor="bg-purple-50"
      />
      <DashboardCard
        icon={<ClipboardList className="w-8 h-8 text-blue-600" />}
        title="Orders"
        description="View and manage orders"
        link="/dashboard/orders"
        bgColor="bg-blue-50"
      />
      <DashboardCard
        icon={<BarChart className="w-8 h-8 text-green-600" />}
        title="Sales Analytics"
        description="View sales statistics"
        link="/dashboard/analytics"
        bgColor="bg-green-50"
      />
      <DashboardCard
        icon={<Settings className="w-8 h-8 text-gray-600" />}
        title="Store Settings"
        description="Manage your store"
        link="/dashboard/settings"
        bgColor="bg-gray-50"
      />
    </div>
  );
}

function GeneralDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        icon={<Building className="w-8 h-8 text-red-600" />}
        title="Find Dojos"
        description="Discover martial arts schools"
        link="/dojos"
        bgColor="bg-red-50"
      />
      <DashboardCard
        icon={<Trophy className="w-8 h-8 text-orange-600" />}
        title="Tournaments"
        description="Browse upcoming tournaments"
        link="/tournaments"
        bgColor="bg-orange-50"
      />
      <DashboardCard
        icon={<ShoppingBag className="w-8 h-8 text-purple-600" />}
        title="Marketplace"
        description="Shop for martial arts gear"
        link="/marketplace"
        bgColor="bg-purple-50"
      />
    </div>
  );
}

function DashboardCard({ 
  icon, 
  title, 
  description, 
  link, 
  bgColor 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  link: string; 
  bgColor: string;
}) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 cursor-pointer">
        <div className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

