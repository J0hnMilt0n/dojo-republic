'use client';

import Link from 'next/link';
import { Dumbbell, Trophy, Users, ShoppingBag, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white relative">
      {/* Animated Karate Background Elements */}
      <KarateAnimations scrollY={scrollY} />
      
      {/* Ninja GIF Full Page Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <img 
          src="/Ninja.gif" 
          alt="" 
          className="w-full h-full object-cover opacity-3 mix-blend-overlay" 
        />
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white overflow-hidden flex items-center">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Karate Fighter Silhouettes Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-32 animate-float">
            <img src="https://api.iconify.design/game-icons/punch.svg?color=%23ffffff&width=130&height=130" alt="" className="w-32 h-32" />
          </div>
          <div className="absolute bottom-32 left-20 animate-float-delayed">
            <img src="https://api.iconify.design/game-icons/high-kick.svg?color=%23ffffff&width=110&height=110" alt="" className="w-28 h-28" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Dojo Republic</span>
            </h1>
            <p className="text-lg sm:text-xl mb-3 text-gray-200 max-w-3xl mx-auto font-light">
              The Home of Combat Sports
            </p>
            <p className="text-sm sm:text-base mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              A unified platform connecting dojos, athletes, tournaments, coaches, and the martial arts community worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/dojos"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-xl font-semibold text-base hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:scale-105 transform"
              >
                Find a Dojo
              </Link>
              <Link
                href="/tournaments"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold text-base hover:bg-white/20 transition-all duration-300 hover:scale-105 transform"
              >
                View Tournaments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Vision Quote Section */}
      <section className="relative min-h-screen py-24 bg-gradient-to-br from-[#0D131F] via-[#171C32] to-[#0D131F] text-white overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        {/* Karate Fighter Silhouettes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 animate-pulse-slow">
            <img src="https://api.iconify.design/game-icons/punch.svg?color=%23ffffff&width=130&height=130" alt="" className="w-32 h-32" />
          </div>
          <div className="absolute bottom-20 right-10 animate-pulse-slow">
            <img src="https://api.iconify.design/game-icons/high-punch.svg?color=%23ffffff&width=110&height=110" alt="" className="w-28 h-28" />
          </div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-8">
              <Quote className="w-12 h-12 text-red-500 opacity-50" />
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 leading-tight tracking-tight">
              Why Dojo Republic Exists
            </h2>
            
            <blockquote className="text-base sm:text-lg md:text-xl font-light text-gray-200 leading-relaxed mb-6 italic">
              "Martial arts teaches discipline, respect, and growth. Dojo Republic was created to strengthen these values by uniting the entire martial arts ecosystem into one platform, empowering every dojo and every fighter to focus on progress."
            </blockquote>
            
            <div className="inline-block">
              <p className="text-lg text-gray-400 font-medium">
                — Founder & CEO, Dojo Republic
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-red-600 to-red-800 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Karate Fighter Patterns */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 right-10 animate-float-slow">
            <img src="https://api.iconify.design/game-icons/high-kick.svg?color=%239ca3af&width=140&height=140" alt="" className="w-36 h-36" />
          </div>
          <div className="absolute bottom-1/4 left-10 animate-float-slow">
            <img src="https://api.iconify.design/game-icons/punch.svg?color=%239ca3af&width=130&height=130" alt="" className="w-32 h-32" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Everything You Need in One Platform
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Whether you're a student, athlete, coach, or dojo owner, Dojo Republic has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Dumbbell className="w-12 h-12 text-red-600" />}
              title="Find Dojos"
              description="Discover martial arts schools in your city. Filter by style, location, and schedule."
            />
            <FeatureCard
              icon={<Trophy className="w-12 h-12 text-red-600" />}
              title="Tournaments"
              description="Browse upcoming competitions, register to compete, and showcase your achievements."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-red-600" />}
              title="Athlete Profiles"
              description="Create your player profile, track achievements, and build your martial arts career."
            />
            <FeatureCard
              icon={<ShoppingBag className="w-12 h-12 text-red-600" />}
              title="Marketplace"
              description="Shop for martial arts equipment, uniforms, and accessories from trusted sellers."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        {/* Animated Karate Fighters */}
        {/* <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-1/4 animate-bounce-slow">
            <img src="https://api.iconify.design/mdi/karate.svg?color=%23ffffff&width=110&height=110" alt="" className="w-28 h-28" />
          </div>
          <div className="absolute bottom-10 right-1/4 animate-bounce-slow">
            <img src="https://api.iconify.design/game-icons/high-punch.svg?color=%23ffffff&width=110&height=110" alt="" className="w-28 h-28" />
          </div>
        </div> */}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatCard number="500+" label="Dojos" />
            <StatCard number="10,000+" label="Athletes" />
            <StatCard number="200+" label="Tournaments" />
            <StatCard number="50+" label="Cities" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5 tracking-tight">
            Ready to Join Dojo Republic?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Sign up today and become part of the largest martial arts community.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-[#E63946] to-[#D62828] text-white px-8 py-3 rounded-xl font-semibold text-base hover:from-[#D62828] hover:to-[#C91F27] transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:scale-105 transform"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 px-8 py-3 rounded-xl font-semibold text-base hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:scale-105 transform"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:scale-105 transform">
      {/* Gradient accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-600/0 group-hover:from-red-500/5 group-hover:to-red-600/5 rounded-2xl transition-all duration-300"></div>
      
      <div className="relative">
        <div className="mb-5 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed font-light">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="group">
      <div className="text-4xl sm:text-5xl font-extrabold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-red-600 transition-all duration-300">{number}</div>
      <div className="text-base sm:text-lg text-gray-300 font-light tracking-wide">{label}</div>
    </div>
  );
}

// Karate Animations Component - Parallax Scrolling Fighters
function KarateAnimations({ scrollY }: { scrollY: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Professional Karate Silhouettes with Parallax */}
      <div 
        className="absolute top-1/4 left-10 opacity-[0.08] transition-transform duration-100"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <img src="https://api.iconify.design/mdi/karate.svg?color=%23dc2626&width=160&height=160" alt="" className="w-40 h-40" />
      </div>
      <div 
        className="absolute top-1/3 right-20 opacity-[0.08] transition-transform duration-100"
        style={{ transform: `translateY(${scrollY * 0.2}px) rotate(15deg)` }}
      >
        <img src="https://api.iconify.design/game-icons/high-kick.svg?color=%23dc2626&width=140&height=140" alt="" className="w-36 h-36" />
      </div>
      <div 
        className="absolute top-2/3 left-1/4 opacity-[0.08] transition-transform duration-100"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        <img src="https://api.iconify.design/game-icons/punch.svg?color=%23dc2626&width=130&height=130" alt="" className="w-32 h-32" />
      </div>
      <div 
        className="absolute bottom-1/4 right-1/3 opacity-[0.08] transition-transform duration-100"
        style={{ transform: `translateY(${scrollY * 0.25}px) rotate(-10deg)` }}
      >
        <img src="https://api.iconify.design/game-icons/roundhouse-kick.svg?color=%23dc2626&width=150&height=150" alt="" className="w-38 h-38" />
      </div>
    </div>
  );
}

// Inline SVG Components removed - using CDN instead
