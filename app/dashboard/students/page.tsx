'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, UserPlus, Mail, Phone, Award } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function StudentsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [deletingStudent, setDeletingStudent] = useState<any>(null);
  const [userDojos, setUserDojos] = useState<any[]>([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    beltLevel: 'White Belt',
    dojoId: '',
  });
  const [editStudent, setEditStudent] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.beltLevel?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

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
      await Promise.all([fetchStudents(), fetchUserDojos()]);
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDojos = async () => {
    try {
      const res = await fetch('/api/dojos/my-dojos');
      if (res.ok) {
        const data = await res.json();
        setUserDojos(data.dojos || []);
        // Set default dojo if only one
        if (data.dojos && data.dojos.length === 1) {
          setNewStudent(prev => ({ ...prev, dojoId: data.dojos[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching dojos:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students?myStudents=true');
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.age) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    // If owner has multiple dojos, require dojo selection
    if (userDojos.length > 1 && !newStudent.dojoId) {
      showToast('Please select a dojo', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone,
          age: newStudent.age,
          beltLevel: newStudent.beltLevel,
          dojoId: newStudent.dojoId || undefined,
        }),
      });

      if (res.ok) {
        showToast('Student added successfully', 'success');
        setShowAddModal(false);
        setNewStudent({
          name: '',
          email: '',
          phone: '',
          age: '',
          beltLevel: 'White Belt',
          dojoId: userDojos.length === 1 ? userDojos[0].id : '',
        });
        await fetchStudents();
      } else {
        const data = await res.json();
        
        // Handle specific error codes
        if (data.code === 'NO_DOJO') {
          if (user?.role === 'dojo_owner') {
            showToast(
              'You need to create a dojo first. Redirecting...',
              'error'
            );
            setTimeout(() => router.push('/dashboard/my-dojo'), 2000);
          } else {
            showToast(data.error || 'Not associated with any dojo', 'error');
          }
        } else {
          const errorMsg = data.details 
            ? `${data.error}: ${data.details.map((d: any) => `${d.field} - ${d.message}`).join(', ')}`
            : data.error || 'Failed to add student';
          showToast(errorMsg, 'error');
        }
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      showToast('Error adding student', 'error');
    }
  };

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditStudent = (student: any) => {
    setEditStudent({ ...student });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editStudent.name || !editStudent.email || !editStudent.age) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editStudent.id,
          name: editStudent.name,
          email: editStudent.email,
          phone: editStudent.phone,
          age: editStudent.age,
          beltLevel: editStudent.beltLevel,
          isActive: editStudent.isActive,
        }),
      });

      if (res.ok) {
        showToast('Student updated successfully', 'success');
        setShowEditModal(false);
        setEditStudent(null);
        await fetchStudents();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update student', 'error');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      showToast('Error updating student', 'error');
    }
  };

  const handleDeleteStudent = (student: any) => {
    setDeletingStudent(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingStudent) return;
    
    try {
      const res = await fetch(`/api/students?id=${deletingStudent.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Student deleted successfully', 'success');
        setShowDeleteModal(false);
        setDeletingStudent(null);
        await fetchStudents();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete student', 'error');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      showToast('Error deleting student', 'error');
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
                <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                <p className="text-gray-600 mt-1">
                  Manage your enrolled students
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name, email, or belt rank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Students</div>
            <div className="text-3xl font-bold text-gray-900">{students.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Active</div>
            <div className="text-3xl font-bold text-green-600">
              {students.filter(s => s.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Black Belts</div>
            <div className="text-3xl font-bold text-gray-900">
              {students.filter(s => s.beltLevel?.toLowerCase().includes('black')).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">This Month</div>
            <div className="text-3xl font-bold text-blue-600">
              {students.filter(s => {
                const enrollmentDate = new Date(s.enrollmentDate);
                const now = new Date();
                return enrollmentDate.getMonth() === now.getMonth() && enrollmentDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Belt Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">{student.age} years old</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Award className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-gray-900">{student.beltLevel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            {student.email}
                          </div>
                          {student.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 text-gray-400 mr-2" />
                              {student.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {student.isActive ? 'active' : 'inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewStudent(student)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleEditStudent(student)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
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

      {/* Modals */}
      <div>
        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Student</h2>
              <div className="space-y-4">
                {userDojos.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Dojo *
                    </label>
                    <select
                      value={newStudent.dojoId}
                      onChange={(e) => setNewStudent({ ...newStudent, dojoId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Choose a dojo...</option>
                      {userDojos.map((dojo) => (
                        <option key={dojo.id} value={dojo.id}>
                          {dojo.name} - {dojo.city}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      You have multiple dojos. Select which one this student belongs to.
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={newStudent.age}
                    onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Age"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Belt Rank *
                  </label>
                  <select
                    value={newStudent.beltLevel}
                    onChange={(e) => setNewStudent({ ...newStudent, beltLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="White Belt">White Belt</option>
                    <option value="Yellow Belt">Yellow Belt</option>
                    <option value="Orange Belt">Orange Belt</option>
                    <option value="Green Belt">Green Belt</option>
                    <option value="Blue Belt">Blue Belt</option>
                    <option value="Purple Belt">Purple Belt</option>
                    <option value="Brown Belt">Brown Belt</option>
                    <option value="Black Belt">Black Belt</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewStudent({
                      name: '',
                      email: '',
                      phone: '',
                      age: '',
                      beltLevel: 'White Belt',
                      dojoId: userDojos.length === 1 ? userDojos[0].id : '',
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-black transition"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Student Modal */}
        {showViewModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Details</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-3xl">
                      {selectedStudent.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <p className="text-gray-900 font-medium">{selectedStudent.name}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <label className="block text-sm font-medium text-blue-900 mb-1">
                    Student ID (for parent linking)
                  </label>
                  <div className="flex items-center justify-between">
                    <code className="text-blue-900 font-mono text-sm bg-white px-2 py-1 rounded">
                      {selectedStudent.id}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedStudent.id);
                        showToast('Student ID copied to clipboard', 'success');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Share this ID with parents to link their accounts
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{selectedStudent.email}</p>
                </div>
                {selectedStudent.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedStudent.phone}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                  <p className="text-gray-900">{selectedStudent.age} years old</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Belt Rank</label>
                  <p className="text-gray-900">{selectedStudent.beltLevel}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Join Date</label>
                  <p className="text-gray-900">{new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedStudent.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedStudent.isActive ? 'active' : 'inactive'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-black transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && editStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Student</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editStudent.name}
                    onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editStudent.email}
                    onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editStudent.phone || ''}
                    onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={editStudent.age}
                    onChange={(e) => setEditStudent({ ...editStudent, age: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Age"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Belt Rank *
                  </label>
                  <select
                    value={editStudent.beltLevel}
                    onChange={(e) => setEditStudent({ ...editStudent, beltLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="White Belt">White Belt</option>
                    <option value="Yellow Belt">Yellow Belt</option>
                    <option value="Orange Belt">Orange Belt</option>
                    <option value="Green Belt">Green Belt</option>
                    <option value="Blue Belt">Blue Belt</option>
                    <option value="Purple Belt">Purple Belt</option>
                    <option value="Brown Belt">Brown Belt</option>
                    <option value="Black Belt">Black Belt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={editStudent.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditStudent({ ...editStudent, isActive: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditStudent(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-black transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Student
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">{deletingStudent.name}</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingStudent(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

