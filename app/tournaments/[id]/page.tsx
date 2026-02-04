'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  DollarSign,
  Clock,
  Mail,
  Phone
} from 'lucide-react';
import { Tournament } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTournament();
  }, [params.id]);

  const fetchTournament = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      const found = data.tournaments.find((t: Tournament) => t.id === params.id);
      
      if (found) {
        setTournament(found);
      } else {
        setError('Tournament not found');
      }
    } catch (err) {
      console.error('Failed to fetch tournament:', err);
      setError('Failed to load tournament details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Tournament not found'}
          </h2>
          <Link
            href="/tournaments"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Link>
        </div>
      </div>
    );
  }

  const isRegistrationOpen = new Date(tournament.registrationDeadline) > new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/tournaments"
            className="inline-flex items-center text-orange-100 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Link>
          <h1 className="text-4xl font-bold">{tournament.name}</h1>
          <p className="text-orange-100 mt-2">{tournament.martialArt}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{tournament.description}</p>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournament.categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Age: {category.ageGroup}</p>
                      <p>Gender: {category.gender}</p>
                      {category.weightClass && <p>Weight: {category.weightClass}</p>}
                      {category.beltLevel && <p>Belt: {category.beltLevel}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rules & Guidelines</h2>
              <p className="text-gray-600 leading-relaxed">{tournament.rules}</p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
              
              <div className="space-y-4">
                {/* Dates */}
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Event Date</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(tournament.startDate)}
                      {tournament.endDate !== tournament.startDate && 
                        ` - ${formatDate(tournament.endDate)}`}
                    </p>
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Registration Deadline</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(tournament.registrationDeadline)}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Venue</p>
                    <p className="text-sm text-gray-600">
                      {tournament.venue}
                      <br />
                      {tournament.city}, {tournament.country}
                    </p>
                  </div>
                </div>

                {/* Participants */}
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Participants</p>
                    <p className="text-sm text-gray-600">
                      {tournament.participants.length} registered
                      {tournament.maxParticipants && 
                        ` / ${tournament.maxParticipants} max`}
                    </p>
                  </div>
                </div>

                {/* Registration Fee */}
                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Registration Fee</p>
                    <p className="text-sm text-gray-600">
                      ${tournament.registrationFee}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">Contact</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <a
                      href={`mailto:${tournament.contactEmail}`}
                      className="hover:text-gray-900 transition"
                    >
                      {tournament.contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <a
                      href={`tel:${tournament.contactPhone}`}
                      className="hover:text-gray-900 transition"
                    >
                      {tournament.contactPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <div className="mt-6">
                {isRegistrationOpen ? (
                  <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
                    <Trophy className="w-4 h-4 inline mr-2" />
                    Register Now
                  </button>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-lg text-center font-medium">
                    Registration Closed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
