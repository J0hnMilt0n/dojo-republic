import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Dojo Republic Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold">Dojo Republic</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-light mb-6">
              The Home of Combat Sports. Connecting martial arts communities worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dojos" className="text-gray-300 hover:text-red-400 transition font-light">
                  Find Dojos
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="text-gray-300 hover:text-red-400 transition font-light">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/players" className="text-gray-300 hover:text-red-400 transition font-light">
                  Athletes
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-300 hover:text-red-400 transition font-light">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-lg font-bold mb-6">For Users</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-red-400 transition font-light">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-300 hover:text-red-400 transition font-light">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-300 hover:text-red-400 transition font-light">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-red-400 transition font-light">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-2 text-gray-300">
                <Mail className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
                <span className="text-sm font-light">info@dojorepublic.com</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <Phone className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
                <span className="text-sm font-light">+44 7440 133748</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
                <span className="text-sm font-light">123 Martial Arts Way, Sports City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-10 text-center">
          <p className="text-gray-400 text-sm font-light">&copy; {new Date().getFullYear()} Dojo Republic. All rights reserved.</p>
          <div className="mt-3 space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-red-400 transition text-sm font-light">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/terms" className="text-gray-400 hover:text-red-400 transition text-sm font-light">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

