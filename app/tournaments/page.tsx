'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { Tournament } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments?approved=true&upcoming=true');
      const data = await res.json();
      setTournaments(data.tournaments);
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
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
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Upcoming Tournaments</h1>
          <p className="text-base sm:text-lg text-gray-200 font-light">
            Compete, showcase your skills, and build your martial arts legacy
          </p>
        </div>
      </section>

      {/* Tournaments List */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading tournaments...</p>
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No upcoming tournaments</p>
              <p className="mt-2 text-gray-500">Check back soon for new competitions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <div className="group relative bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:scale-105 transform overflow-hidden cursor-pointer">
        {/* Gradient accent on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-red-500/0 to-red-600/0 group-hover:from-red-500/5 group-hover:to-red-600/5 rounded-2xl transition-all duration-300"></div>
        
        <div className="h-56 bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
          </div>
          <Trophy className="w-24 h-24 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
        </div>

        <div className="p-8 relative">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{tournament.name}</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3 text-red-600" />
              <span className="font-light">{formatDate(tournament.startDate)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 text-red-600" />
              <span className="font-light">{tournament.city}, {tournament.country}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3 text-red-600" />
              <span className="font-light">{tournament.participants.length} Registered</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6 line-clamp-2 font-light leading-relaxed">
            {tournament.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="px-4 py-2 bg-linear-to-r from-red-600 to-red-800 text-white text-sm font-semibold rounded-lg">
              {tournament.martialArt}
            </span>
            <span className="text-lg font-bold text-gray-900">
              ₹{tournament.registrationFee}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

