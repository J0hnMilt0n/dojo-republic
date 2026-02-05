'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Award, MapPin } from 'lucide-react';
import { PlayerProfile } from '@/lib/types';

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      if (res.ok) {
        const data = await res.json();
        setPlayers(data.players || []);
      }
    } catch (error) {
      console.error('Failed to fetch players:', error);
    } finally {
      setLoading(false);
    }
  };

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
          ) : players.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No athlete profiles yet</p>
              <p className="mt-2 text-gray-500">Be the first to create your profile!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
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

