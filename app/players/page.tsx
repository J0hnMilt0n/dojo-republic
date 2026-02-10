'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Award, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PlayerProfile } from '@/lib/types';

const ITEMS_PER_PAGE = 12;

export default function PlayersPage() {
  const [allPlayers, setAllPlayers] = useState<PlayerProfile[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBelt, setSelectedBelt] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    filterPlayers();
  }, [searchQuery, selectedBelt, allPlayers]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedBelt]);

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      if (res.ok) {
        const data = await res.json();
        setAllPlayers(data.players || []);
        setFilteredPlayers(data.players || []);
      }
    } catch (error) {
      console.error('Failed to fetch players:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlayers = () => {
    let filtered = [...allPlayers];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (player) => {
          // Search in basic info
          const basicMatch =
            player.name.toLowerCase().includes(query) ||
            player.city.toLowerCase().includes(query) ||
            player.country.toLowerCase().includes(query) ||
            player.beltCategory.toLowerCase().includes(query);

          // Search in achievements
          const achievementMatch = player.achievements?.some(
            (achievement) =>
              achievement.tournamentName?.toLowerCase().includes(query) ||
              achievement.category?.toLowerCase().includes(query) ||
              achievement.position?.toLowerCase().includes(query)
          );

          return basicMatch || achievementMatch;
        }
      );
    }

    // Belt filter
    if (selectedBelt !== 'all') {
      filtered = filtered.filter((player) =>
        player.beltCategory.toLowerCase().includes(selectedBelt.toLowerCase())
      );
    }

    setFilteredPlayers(filtered);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const beltCategories = [
    { value: 'all', label: 'All Belts' },
    { value: 'white', label: 'White Belt' },
    { value: 'yellow', label: 'Yellow Belt' },
    { value: 'orange', label: 'Orange Belt' },
    { value: 'green', label: 'Green Belt' },
    { value: 'blue', label: 'Blue Belt' },
    { value: 'brown', label: 'Brown Belt' },
    { value: 'black', label: 'Black Belt' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Featured Athletes</h1>
          <p className="text-base sm:text-lg text-gray-200 font-light max-w-3xl">
            Discover talented martial artists and their achievements
          </p>
        </div>
      </section>

      {/* Players Grid */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading athletes...</p>
            </div>
          ) : (
            <>
              {/* Search and Filter Section */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, city, belt, achievement, tournament..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Filter and Results Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Belt Filter */}
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">Filter by Belt:</label>
                    <select
                      value={selectedBelt}
                      onChange={(e) => setSelectedBelt(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {beltCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-gray-600">
                    Showing {currentPlayers.length} of {filteredPlayers.length} athletes
                    {searchQuery || selectedBelt !== 'all' ? (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedBelt('all');
                        }}
                        className="ml-2 text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Players Grid or Empty State */}
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">
                    {allPlayers.length === 0 ? 'No athlete profiles yet' : 'No athletes found'}
                  </p>
                  <p className="mt-2 text-gray-500">
                    {allPlayers.length === 0 
                      ? 'Be the first to create your profile!' 
                      : 'Try adjusting your search or filters'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentPlayers.map((player) => (
                      <PlayerCard key={player.id} player={player} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center space-x-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-4 py-2 rounded-lg border transition ${
                                  currentPage === page
                                    ? 'bg-red-600 text-white border-red-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-2 py-2">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function PlayerCard({ player }: { player: PlayerProfile }) {
  const approvedAchievements = player.achievements.filter(a => a.isApproved);

  return (
    <Link href={`/players/${player.id}`}>
      <div className="group relative bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:scale-105 transform overflow-hidden cursor-pointer">
        {/* Gradient accent on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-red-500/0 to-red-600/0 group-hover:from-red-500/5 group-hover:to-red-600/5 rounded-2xl transition-all duration-300"></div>
        
        <div className="h-48 bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-2xl"></div>
          </div>
          <Trophy className="w-20 h-20 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
        </div>

        <div className="p-6 relative">
          <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">{player.name}</h3>

          <div className="flex items-center text-gray-600 mb-4 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-red-600" />
            <span className="font-light">{player.city}, {player.country}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="px-4 py-2 bg-linear-to-r from-red-600 to-red-800 text-white text-xs font-semibold rounded-lg">
              {player.beltCategory}
            </span>
            <span className="text-sm text-gray-600 font-light">Age {player.age}</span>
          </div>

          <div className="flex items-center text-gray-600 pt-4 border-t border-gray-200">
            <Award className="w-5 h-5 mr-2 text-red-600" />
            <span className="font-light">{approvedAchievements.length} Achievement{approvedAchievements.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

