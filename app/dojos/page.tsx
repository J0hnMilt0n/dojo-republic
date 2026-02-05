'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Filter } from 'lucide-react';
import { Dojo } from '@/lib/types';
import { martialArts } from '@/lib/constants';

export default function DojosPage() {
  const [dojos, setDojos] = useState<Dojo[]>([]);
  const [filteredDojos, setFilteredDojos] = useState<Dojo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMartialArt, setSelectedMartialArt] = useState('');

  useEffect(() => {
    fetchDojos();
  }, []);

  const fetchDojos = async () => {
    try {
      const res = await fetch('/api/dojos?approved=true');
      const data = await res.json();
      setDojos(data.dojos);
      setFilteredDojos(data.dojos);
    } catch (error) {
      console.error('Failed to fetch dojos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = dojos;

    if (searchTerm) {
      filtered = filtered.filter(
        (dojo) =>
          dojo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dojo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter((dojo) =>
        dojo.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    if (selectedMartialArt) {
      filtered = filtered.filter((dojo) =>
        dojo.martialArts.includes(selectedMartialArt)
      );
    }

    setFilteredDojos(filtered);
  }, [searchTerm, selectedCity, selectedMartialArt, dojos]);

  const cities = Array.from(new Set(dojos.map((d) => d.city)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white py-20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Find Your Perfect Dojo</h1>
          <p className="text-base sm:text-lg text-gray-200 font-light">
            Discover martial arts schools in your area and start your journey
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search dojos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition appearance-none"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <select
                value={selectedMartialArt}
                onChange={(e) => setSelectedMartialArt(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition appearance-none"
              >
                <option value="">All Martial Arts</option>
                {martialArts.map((ma) => (
                  <option key={ma} value={ma}>
                    {ma}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Dojos Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading dojos...</p>
            </div>
          ) : filteredDojos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No dojos found</p>
              <p className="mt-2 text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Found <span className="font-semibold">{filteredDojos.length}</span> dojo
                  {filteredDojos.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDojos.map((dojo) => (
                  <DojoCard key={dojo.id} dojo={dojo} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function DojoCard({ dojo }: { dojo: Dojo }) {
  return (
    <Link href={`/dojos/${dojo.id}`}>
      <div className="group bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 border border-gray-100 hover:border-red-200">
        {/* Gradient accent on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-red-500/0 to-red-600/0 group-hover:from-red-500/5 group-hover:to-red-600/5 rounded-2xl transition-all duration-300"></div>
        
        <div className="h-48 bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] flex items-center justify-center relative">
          <span className="text-white text-4xl font-bold">
            {dojo.name.charAt(0)}
          </span>
        </div>

        <div className="p-6 relative">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{dojo.name}</h3>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{dojo.city}, {dojo.country}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {dojo.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {dojo.martialArts.slice(0, 3).map((ma) => (
              <span
                key={ma}
                className="px-3 py-1 bg-linear-to-r from-red-600 to-red-800 text-white text-xs font-semibold rounded-full"
              >
                {ma}
              </span>
            ))}
            {dojo.martialArts.length > 3 && (
              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                +{dojo.martialArts.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

