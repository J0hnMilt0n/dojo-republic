'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowLeft,
  Users
} from 'lucide-react';
import { Dojo } from '@/lib/types';

export default function DojoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [dojo, setDojo] = useState<Dojo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchDojo();
    }
  }, [params.id]);

  const fetchDojo = async () => {
    try {
      // Fetch all approved dojos and find the specific one
      const res = await fetch('/api/dojos?approved=true');
      if (!res.ok) {
        throw new Error('Failed to fetch dojo');
      }
      
      const data = await res.json();
      const foundDojo = data.dojos.find((d: Dojo) => d.id === params.id || d.id === String(params.id));
      
      if (foundDojo) {
        setDojo(foundDojo);
      } else {
        setError('Dojo not found');
      }
    } catch (err) {
      console.error('Failed to fetch dojo:', err);
      setError('Failed to load dojo details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading dojo details...</p>
        </div>
      </div>
    );
  }

  if (error || !dojo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Dojo not found'}
          </h2>
          <Link
            href="/dojos"
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dojos
          </Link>
        </div>
      </div>
    );
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dojos"
            className="inline-flex items-center text-gray-300 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dojos
          </Link>
          <h1 className="text-4xl font-bold">{dojo.name}</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{dojo.description}</p>
            </div>

            {/* Martial Arts Offered */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Martial Arts Offered
              </h2>
              <div className="flex flex-wrap gap-3">
                {dojo.martialArts.map((ma) => (
                  <span
                    key={ma}
                    className="px-4 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg"
                  >
                    {ma}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2" />
                Class Schedule
              </h2>
              
              {dojo.schedule.length > 0 ? (
                <div className="space-y-4">
                  {daysOfWeek.map((day) => {
                    const daySchedule = dojo.schedule.filter((s) => s.day === day);
                    if (daySchedule.length === 0) return null;

                    return (
                      <div key={day} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <h3 className="font-semibold text-gray-900 mb-2">{day}</h3>
                        <div className="space-y-2">
                          {daySchedule.map((schedule, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between bg-gray-50 p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {schedule.className}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Instructor: {schedule.instructor}
                                </p>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 whitespace-nowrap ml-4">
                                <Clock className="w-4 h-4 mr-1" />
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No schedule available</p>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-6 h-6 mr-2" />
                Pricing Plans
              </h2>
              
              {dojo.pricing.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dojo.pricing.map((plan, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 transition"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-3xl font-bold text-gray-900 mb-2">
                        ${plan.price}
                        <span className="text-base font-normal text-gray-600">
                          /{plan.duration}
                        </span>
                      </p>
                      {plan.description && (
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No pricing information available</p>
              )}
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      {dojo.address}
                      <br />
                      {dojo.city}, {dojo.country}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a
                      href={`tel:${dojo.phoneNumber}`}
                      className="text-sm text-gray-600 hover:text-gray-900 transition"
                    >
                      {dojo.phoneNumber}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href={`mailto:${dojo.email}`}
                      className="text-sm text-gray-600 hover:text-gray-900 transition break-all"
                    >
                      {dojo.email}
                    </a>
                  </div>
                </div>

                {/* Website */}
                {dojo.website && (
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 text-gray-400 mr-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Website</p>
                      <a
                        href={dojo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-gray-900 transition break-all"
                      >
                        {dojo.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <a
                  href={`mailto:${dojo.email}`}
                  className="block w-full px-4 py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Send Enquiry
                </a>
                <a
                  href={`tel:${dojo.phoneNumber}`}
                  className="block w-full px-4 py-3 bg-white text-gray-900 text-center rounded-lg border border-gray-300 hover:border-gray-900 transition font-medium"
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
