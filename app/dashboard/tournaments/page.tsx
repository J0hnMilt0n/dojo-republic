'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Calendar, MapPin, Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function DashboardTournamentsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTournament, setDeletingTournament] = useState<any>(null);

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
      await fetchTournaments();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments?myTournaments=true');
      if (res.ok) {
        const data = await res.json();
        const userTournaments = data.tournaments || [];
        setTournaments(userTournaments);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
    setEditingTournament(null);
  };

  const handleEditClick = (tournament: any) => {
    setEditingTournament(tournament);
    setShowCreateModal(true);
  };

  const handleDeleteClick = (tournament: any) => {
    setDeletingTournament(tournament);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingTournament) return;

    try {
      const res = await fetch('/api/tournaments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingTournament.id }),
      });

      if (res.ok) {
        await fetchTournaments();
        setShowDeleteModal(false);
        setDeletingTournament(null);
      } else {
        console.error('Failed to delete tournament');
        showToast('Failed to delete tournament', 'error');
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      showToast('Error deleting tournament', 'error');
    }
  };

  const handleSaveTournament = async (tournamentData: any) => {
    try {
      const method = editingTournament ? 'PUT' : 'POST';
      const res = await fetch('/api/tournaments', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTournament ? { ...tournamentData, id: editingTournament.id } : tournamentData),
      });

      if (res.ok) {
        await fetchTournaments();
        setShowCreateModal(false);
        setEditingTournament(null);
        showToast(`Tournament ${editingTournament ? 'updated' : 'created'} successfully`, 'success');
      } else {
        const errorData = await res.json();
        showToast(errorData.error || `Failed to ${editingTournament ? 'update' : 'create'} tournament`, 'error');
      }
    } catch (error) {
      console.error('Error saving tournament:', error);
      showToast('Error saving tournament', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Tournaments</h1>
                <p className="text-gray-600 mt-1">Create and manage tournaments</p>
              </div>
            </div>
            <button 
              onClick={handleCreateClick}
              className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
            >
              <Plus className="w-5 h-5" />
              <span>Create Tournament</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Tournaments</div>
            <div className="text-3xl font-bold text-gray-900">{tournaments.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Upcoming</div>
            <div className="text-3xl font-bold text-blue-600">
              {tournaments.filter(t => t.status === 'upcoming').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Ongoing</div>
            <div className="text-3xl font-bold text-green-600">
              {tournaments.filter(t => t.status === 'ongoing').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-gray-600">
              {tournaments.filter(t => t.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Tournaments List */}
        <div className="grid grid-cols-1 gap-6">
          {tournaments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tournaments Yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first tournament to get started
              </p>
              <button 
                onClick={handleCreateClick}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition"
              >
                Create Tournament
              </button>
            </div>
          ) : (
            tournaments.map((tournament, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{tournament.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tournament.status)}`}>
                        {tournament.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{tournament.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(tournament.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{tournament.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {tournament.participants?.length || 0} / {tournament.maxParticipants} Participants
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tournament.categories?.map((category: any, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {category.name} - {category.ageGroup} ({category.gender})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Link href={`/tournaments/${tournament.id}`}>
                      <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition px-3 py-2 border border-blue-600 rounded-lg">
                        <span>View</span>
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleEditClick(tournament)}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition px-3 py-2 border border-green-600 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(tournament)}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-900 transition px-3 py-2 border border-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <TournamentModal
            tournament={editingTournament}
            onSave={handleSaveTournament}
            onClose={() => {
              setShowCreateModal(false);
              setEditingTournament(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingTournament && (
          <DeleteConfirmationModal
            tournamentName={deletingTournament.name}
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setDeletingTournament(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function TournamentModal({ tournament, onSave, onClose }: { tournament: any; onSave: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: tournament?.name || '',
    description: tournament?.description || '',
    startDate: tournament?.startDate?.split('T')[0] || '',
    endDate: tournament?.endDate?.split('T')[0] || '',
    venue: tournament?.venue || '',
    city: tournament?.city || '',
    country: tournament?.country || '',
    maxParticipants: tournament?.maxParticipants || 100,
    registrationFee: tournament?.registrationFee || 0,
    rules: tournament?.rules || '',
    contactPhone: tournament?.contactPhone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {tournament ? 'Edit Tournament' : 'Create Tournament'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue *
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Participants *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Fee *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.registrationFee}
                  onChange={(e) => setFormData({ ...formData, registrationFee: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Rules *
              </label>
              <textarea
                required
                rows={4}
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                placeholder="Enter tournament rules and regulations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-black transition"
              >
                {tournament ? 'Update' : 'Create'} Tournament
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({
  tournamentName,
  onConfirm,
  onCancel,
}: {
  tournamentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Delete Tournament
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete <span className="font-semibold">{tournamentName}</span>? This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

