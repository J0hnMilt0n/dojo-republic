'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]); // Re-check auth when pathname changes

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Silently handle auth check failures (server may not be ready)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 group flex-shrink-0">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
              <img 
                src="/head.png" 
                alt="Dojo Republic" 
                className="h-5 w-auto lg:h-6 xl:h-8 ml-1 sm:ml-2 object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-4 2xl:space-x-6 text-sm xl:text-base">
            <Link href="/dojos" className="text-gray-700 hover:text-red-600 transition font-medium whitespace-nowrap">
              Dojos
            </Link>
            <Link href="/tournaments" className="text-gray-700 hover:text-red-600 transition font-medium whitespace-nowrap">
              Tournaments
            </Link>
            <Link href="/players" className="text-gray-700 hover:text-red-600 transition font-medium whitespace-nowrap">
              Athletes
            </Link>
            <Link href="/martialmind" className="text-gray-700 hover:text-red-600 transition font-medium flex items-center space-x-1 whitespace-nowrap">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse flex-shrink-0"></span>
              <span>MartialMind AI</span>
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-red-600 transition font-medium whitespace-nowrap">
              Marketplace
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-red-600 transition font-medium whitespace-nowrap">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-red-600 transition font-medium whitespace-nowrap">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-red-600 transition font-medium whitespace-nowrap">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 text-sm xl:text-base">
            {loading ? (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <div className="w-16 xl:w-20 h-8 bg-gray-100 animate-pulse rounded-lg"></div>
                <div className="w-14 xl:w-16 h-8 bg-gray-100 animate-pulse rounded-lg"></div>
              </div>
            ) : user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="text-gray-700 hover:text-red-600 transition flex items-center space-x-1 font-medium whitespace-nowrap"
                >
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 font-medium max-w-[100px] xl:max-w-[150px] truncate">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition flex items-center space-x-1 font-medium whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-red-600 transition flex items-center space-x-1 font-medium whitespace-nowrap"
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white px-3 xl:px-5 py-1.5 xl:py-2.5 rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-500/50 hover:scale-105 transform whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-4">
            <Link
              href="/dojos"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Dojos
            </Link>
            <Link
              href="/tournaments"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Tournaments
            </Link>
            <Link
              href="/players"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Athletes
            </Link>
            <Link
              href="/martialmind"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <span>MartialMind AI</span>
            </Link>
            <Link
              href="/marketplace"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {loading ? (
                <div className="h-8 bg-gray-100 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  <div className="text-sm text-gray-600 px-2">
                    Logged in as <span className="font-medium">{user.name}</span>
                  </div>
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="block text-gray-700 hover:text-gray-900 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block text-gray-700 hover:text-gray-900 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 text-center font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

