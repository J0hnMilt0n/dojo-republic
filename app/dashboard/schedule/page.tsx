'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Plus, Edit2, Trash2 } from 'lucide-react';

interface ClassSchedule {
  id: string;
  className: string;
  instructor: string;
  day: string;
  time: string;
  duration: number;
  level: string;
  maxStudents: number;
  currentStudents: number;
  room?: string;
}

export default function SchedulePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
      if (data.user.role !== 'dojo_owner' && data.user.role !== 'coach') {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);
      loadSchedule();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = () => {
    // Mock schedule data
    const mockSchedule: ClassSchedule[] = [
      {
        id: '1',
        className: 'Beginner Karate',
        instructor: 'John Sensei',
        day: 'Monday',
        time: '16:00',
        duration: 60,
        level: 'Beginner',
        maxStudents: 20,
        currentStudents: 15,
        room: 'Main Dojo'
      },
      {
        id: '2',
        className: 'Advanced Kumite',
        instructor: 'Sarah Sensei',
        day: 'Monday',
        time: '18:00',
        duration: 90,
        level: 'Advanced',
        maxStudents: 15,
        currentStudents: 12,
        room: 'Main Dojo'
      },
      {
        id: '3',
        className: 'Kids Karate',
        instructor: 'Mike Sensei',
        day: 'Tuesday',
        time: '15:00',
        duration: 45,
        level: 'Kids',
        maxStudents: 25,
        currentStudents: 20,
        room: 'Training Hall'
      },
      {
        id: '4',
        className: 'Kata Practice',
        instructor: 'John Sensei',
        day: 'Wednesday',
        time: '17:00',
        duration: 60,
        level: 'Intermediate',
        maxStudents: 20,
        currentStudents: 18,
        room: 'Main Dojo'
      },
      {
        id: '5',
        className: 'Sparring Session',
        instructor: 'Sarah Sensei',
        day: 'Thursday',
        time: '18:30',
        duration: 90,
        level: 'Advanced',
        maxStudents: 15,
        currentStudents: 10,
        room: 'Main Dojo'
      },
      {
        id: '6',
        className: 'All Levels',
        instructor: 'Mike Sensei',
        day: 'Friday',
        time: '17:00',
        duration: 75,
        level: 'All Levels',
        maxStudents: 30,
        currentStudents: 25,
        room: 'Main Dojo'
      },
      {
        id: '7',
        className: 'Weekend Warriors',
        instructor: 'John Sensei',
        day: 'Saturday',
        time: '10:00',
        duration: 120,
        level: 'Intermediate',
        maxStudents: 20,
        currentStudents: 16,
        room: 'Main Dojo'
      },
    ];
    setSchedule(mockSchedule);
  };

  const getFilteredSchedule = () => {
    if (selectedDay === 'all') return schedule;
    return schedule.filter(item => item.day === selectedDay);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-gray-100 text-gray-800';
      case 'kids':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
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
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
                <p className="text-gray-600 mt-1">Manage your dojo's class schedule</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition">
              <Plus className="w-5 h-5" />
              <span>Add Class</span>
            </button>
          </div>
        </div>

        {/* Day Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedDay === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Days
            </button>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedDay === day
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Classes</div>
            <div className="text-3xl font-bold text-gray-900">{schedule.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Weekly Hours</div>
            <div className="text-3xl font-bold text-purple-600">
              {schedule.reduce((acc, item) => acc + item.duration, 0) / 60} hrs
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Students</div>
            <div className="text-3xl font-bold text-blue-600">
              {schedule.reduce((acc, item) => acc + item.currentStudents, 0)}
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredSchedule().length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No classes scheduled
                    </td>
                  </tr>
                ) : (
                  getFilteredSchedule().map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.className}</div>
                        {item.room && (
                          <div className="text-sm text-gray-500">{item.room}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.instructor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.day}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.duration} min</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(item.level)}`}>
                          {item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {item.currentStudents} / {item.maxStudents}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(item.currentStudents / item.maxStudents) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
