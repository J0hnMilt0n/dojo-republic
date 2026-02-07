'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Trophy, 
  DollarSign, 
  Calendar,
  ArrowLeft,
  Package,
  ShoppingCart
} from 'lucide-react';
import { Order } from '@/lib/types';

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

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
      if (data.user.role !== 'dojo_owner' && data.user.role !== 'seller' && data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);
      
      // Fetch relevant data based on role
      if (data.user.role === 'seller' || data.user.role === 'admin') {
        await fetchOrders();
      }
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?myOrders=true');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        calculateAnalytics(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const calculateAnalytics = (ordersData: Order[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter orders by this month
    const thisMonthOrders = ordersData.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    // Calculate revenue
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
    const monthlyRevenue = thisMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate orders by status
    const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
    const completedOrders = ordersData.filter(o => o.status === 'delivered').length;

    // Monthly data for charts (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthOrders = ordersData.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === month && orderDate.getFullYear() === year;
      });

      const revenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      monthlyData.push({
        month: date.toLocaleString('default', { month: 'short' }),
        revenue,
        orderCount: monthOrders.length
      });
    }

    setAnalytics({
      totalRevenue,
      monthlyRevenue,
      totalOrders: ordersData.length,
      monthlyOrders: thisMonthOrders.length,
      pendingOrders,
      completedOrders,
      monthlyData
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
      </div>
    );
  }

  if (!user) return null;

  // Show seller analytics for sellers
  if (user.role === 'seller') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
                  <p className="text-gray-600 mt-1">Track your store's performance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 text-sm font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Total
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-gray-500 mt-1">All time earnings</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-blue-600 text-sm font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Month
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${analytics?.monthlyRevenue?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
              <div className="text-xs text-gray-500 mt-1">This month's earnings</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-purple-600 text-sm font-semibold">
                  Total
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.totalOrders || 0}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics?.monthlyOrders || 0} this month
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-orange-600 text-sm font-semibold">
                  Pending
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.pendingOrders || 0}
              </div>
              <div className="text-sm text-gray-600">Pending Orders</div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics?.completedOrders || 0} completed
              </div>
            </div>
          </div>

          {/* Charts Row */}
          {analytics?.monthlyData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analytics.monthlyData.map((data: any, index: number) => {
                    const maxRevenue = Math.max(...analytics.monthlyData.map((d: any) => d.revenue), 1);
                    const height = (data.revenue / maxRevenue) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-green-600 rounded-t hover:bg-green-700 transition cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`$${data.revenue.toFixed(2)}`}
                        ></div>
                        <div className="text-xs text-gray-500 mt-2">
                          {data.month}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Orders Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Orders</h2>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analytics.monthlyData.map((data: any, index: number) => {
                    const maxOrders = Math.max(...analytics.monthlyData.map((d: any) => d.orderCount), 1);
                    const height = (data.orderCount / maxOrders) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-purple-600 rounded-t hover:bg-purple-700 transition cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`${data.orderCount} orders`}
                        ></div>
                        <div className="text-xs text-gray-500 mt-2">
                          {data.month}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No orders yet</p>
                <p className="mt-2 text-gray-500">Orders will appear here once customers make purchases</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          #{order.id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
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

  // Show dojo analytics for dojo owners
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6">
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

