'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Award,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { PlayerProfile } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayer();
  }, [params.id]);

  const fetchPlayer = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      const found = data.players.find((p: PlayerProfile) => p.id === params.id);
      
      if (found) {
        setPlayer(found);
      } else {
        setError('Player not found');
      }
    } catch (err) {
      console.error('Failed to fetch player:', err);
      setError('Failed to load player details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-600"></div>
          <p className="mt-4 text-gray-600">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Player not found'}
          </h2>
          <Link
            href="/players"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Athletes
          </Link>
        </div>
      </div>
    );
  }

  const approvedAchievements = player.achievements.filter(a => a.isApproved);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-linear-to-r from-yellow-600 to-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/players"
            className="inline-flex items-center text-yellow-100 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Athletes
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{player.name}</h1>
              <p className="text-yellow-100 mt-1">{player.beltCategory}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
                Achievements
              </h2>
              
              {approvedAchievements.length > 0 ? (
                <div className="space-y-4">
                  {approvedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="border border-gray-200 rounded-lg p-4 flex items-start space-x-4"
                    >
                      <div className="shrink-0">
                        {achievement.position === 'gold' && (
                          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                        )}
                        {achievement.position === 'silver' && (
                          <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                        )}
                        {achievement.position === 'bronze' && (
                          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                        )}
                        {achievement.position === 'participation' && (
                          <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {achievement.tournamentName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {achievement.category}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="capitalize">{achievement.position}</span>
                          <span>•</span>
                          <span>{achievement.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No achievements yet
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
              
              <div className="space-y-4">
                {/* Age */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-lg text-gray-900">{player.age} years</p>
                </div>

                {/* Date of Birth */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-lg text-gray-900">{formatDate(player.dateOfBirth)}</p>
                </div>

                {/* Gender */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-lg text-gray-900 capitalize">{player.gender}</p>
                </div>

                {/* Belt Category */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Belt Category</p>
                  <p className="text-lg text-gray-900">{player.beltCategory}</p>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-lg text-gray-900">
                      {player.city}, {player.country}
                    </p>
                  </div>
                </div>

                {/* Weight & Height */}
                {(player.weight || player.height) && (
                  <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
                    {player.weight && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Weight</p>
                        <p className="text-lg text-gray-900">{player.weight} kg</p>
                      </div>
                    )}
                    {player.height && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Height</p>
                        <p className="text-lg text-gray-900">{player.height} cm</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Total Achievements */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total Achievements</span>
                    <span className="text-2xl font-bold text-yellow-600">
                      {approvedAchievements.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
